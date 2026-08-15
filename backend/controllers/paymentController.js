import db from "../config/sqlite.js";

import {
    initializePayment,
    verifyPayment
} from "../services/paystackService.js";


// =====================================================
// INITIALIZE ORDER PAYMENT
// =====================================================

export const initializeOrderPayment = async (req, res) => {

    try {

        const { orderId } = req.body;


        if (!orderId) {

            return res.status(400).json({

                success: false,

                message:
                    "Order ID is required."

            });

        }


        // =================================================
        // FIND ORDER
        // =================================================

        const order = db.prepare(`
            SELECT *
            FROM orders
            WHERE id = ?
        `).get(orderId);


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found."

            });

        }


        // =================================================
        // PREVENT DUPLICATE PAYMENT
        // =================================================

        if (
            order.payment_status === "paid"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "This order has already been paid."

            });

        }


        // =================================================
        // CUSTOMER EMAIL
        // =================================================

        const email =
            order.customer_email;


        // =================================================
        // CONVERT NAIRA TO KOBO
        // =================================================

        const amount =
            Math.round(
                Number(
                    order.total_amount
                ) * 100
            );


        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid order amount."

            });

        }


        // =================================================
        // CREATE PAYMENT REFERENCE
        // =================================================

        const reference =
            `NUTRIDUST-${order.id}-${Date.now()}`;


        // =================================================
        // CALLBACK URL
        // =================================================

        const callbackUrl =
            process.env.FRONTEND_URL ||
            "http://localhost:5173";


        console.log(
            "💳 Initializing Paystack payment:",
            {
                orderId:
                    order.id,

                amount,

                reference
            }
        );


        // =================================================
        // INITIALIZE PAYSTACK
        // =================================================

        const payment =
            await initializePayment({

                email,

                amount,

                reference,

                callbackUrl

            });


        if (
            !payment ||
            !payment.status ||
            !payment.data
        ) {

            return res.status(500).json({

                success: false,

                message:
                    "Paystack could not initialize the payment."

            });

        }


        const paystackReference =
            payment.data.reference;


        // =================================================
        // SAVE PAYMENT REFERENCE
        // =================================================

        db.prepare(`
            UPDATE orders

            SET
                payment_reference = ?,

                payment_status = 'pending',

                updated_at =
                    CURRENT_TIMESTAMP

            WHERE id = ?
        `).run(

            paystackReference,

            order.id

        );


        console.log(
            "✅ Paystack payment initialized:",
            paystackReference
        );


        res.status(200).json({

            success: true,

            message:
                "Payment initialized successfully.",

            orderId:
                order.id,

            reference:
                paystackReference,

            authorizationUrl:
                payment.data.authorization_url,

            accessCode:
                payment.data.access_code

        });


    } catch (error) {

        console.error(
            "❌ Payment Initialization Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Unable to initialize payment."

        });

    }

};



// =====================================================
// VERIFY ORDER PAYMENT
// =====================================================

export const verifyOrderPayment = async (req, res) => {

    try {

        const { reference } =
            req.params;


        if (!reference) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment reference is required."

            });

        }


        console.log(
            "🔍 Verifying Paystack payment:",
            reference
        );


        // =================================================
        // VERIFY WITH PAYSTACK
        // =================================================

        const payment =
            await verifyPayment(
                reference
            );


        if (
            !payment ||
            !payment.status ||
            !payment.data
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Unable to verify payment."

            });

        }


        const transaction =
            payment.data;


        // =================================================
        // FIND ORDER
        // =================================================

        const order =
            db.prepare(`
                SELECT *
                FROM orders
                WHERE payment_reference = ?
            `).get(reference);


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order associated with this payment was not found."

            });

        }


        // =================================================
        // PREVENT DOUBLE PROCESSING
        // =================================================

        if (
            order.payment_status === "paid"
        ) {

            console.log(
                "ℹ️ Order already processed:",
                order.id
            );


            return res.status(200).json({

                success: true,

                message:
                    "Payment has already been verified.",

                order,

                alreadyProcessed:
                    true

            });

        }


        // =================================================
        // VERIFY AMOUNT
        // =================================================

        const paidAmount =
            Number(
                transaction.amount
            );


        const expectedAmount =
            Math.round(
                Number(
                    order.total_amount
                ) * 100
            );


        if (
            !Number.isFinite(paidAmount) ||
            paidAmount !== expectedAmount
        ) {

            console.error(
                "❌ Payment amount mismatch:",
                {
                    orderId:
                        order.id,

                    expectedAmount,

                    paidAmount
                }
            );


            return res.status(400).json({

                success: false,

                message:
                    "Payment amount does not match the order amount."

            });

        }


        // =================================================
        // PARSE ORDER ITEMS
        // =================================================

        let items;


        try {

            items =
                typeof order.items === "string"
                    ? JSON.parse(order.items)
                    : order.items;

        } catch (error) {

            console.error(
                "❌ Invalid order items JSON:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Order contains invalid product information."

            });

        }


        if (
            !Array.isArray(items) ||
            items.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Order contains no valid products."

            });

        }


        // =================================================
        // NORMALIZE ITEMS
        // =================================================

        const normalizedItems =
            items.map(item => ({

                productId:
                    Number(
                        item.productId ||
                        item.id ||
                        item._id
                    ),

                quantity:
                    Number(
                        item.quantity
                    ),

                name:
                    item.name ||
                    "Product"

            }));


        // =================================================
        // VALIDATE ITEMS
        // =================================================

        for (
            const item
            of normalizedItems
        ) {

            if (
                !Number.isInteger(
                    item.productId
                ) ||
                item.productId <= 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        `Invalid product ID for ${item.name}.`

                });

            }


            if (
                !Number.isInteger(
                    item.quantity
                ) ||
                item.quantity <= 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        `Invalid quantity for ${item.name}.`

                });

            }

        }


        // =================================================
        // PAYMENT FAILED
        // =================================================
        //
        // IMPORTANT:
        //
        // The order controller already reserved the stock.
        //
        // Therefore, if payment fails:
        //
        // available += quantity
        // reserved  -= quantity
        // sold       stays the same
        //
        // =================================================

        if (
            transaction.status !==
            "success"
        ) {

            const releaseReservation =
                db.transaction(() => {

                    for (
                        const item
                        of normalizedItems
                    ) {

                        const inventory =
                            db.prepare(`
                                SELECT
                                    quantity_available,
                                    reserved_quantity
                                FROM inventory
                                WHERE product_id = ?
                            `).get(
                                item.productId
                            );


                        if (!inventory) {

                            throw new Error(
                                `Inventory record not found for ${item.name}.`
                            );

                        }


                        // -------------------------------------
                        // Make sure enough quantity is reserved
                        // -------------------------------------

                        if (
                            Number(
                                inventory.reserved_quantity
                            ) <
                            item.quantity
                        ) {

                            throw new Error(

                                `Reserved stock mismatch for ${item.name}.`

                            );

                        }


                        // -------------------------------------
                        // RELEASE RESERVATION
                        // -------------------------------------

                        db.prepare(`
                            UPDATE inventory

                            SET
                                quantity_available =
                                    quantity_available + ?,

                                reserved_quantity =
                                    reserved_quantity - ?,

                                updated_at =
                                    CURRENT_TIMESTAMP

                            WHERE product_id = ?
                        `).run(

                            item.quantity,

                            item.quantity,

                            item.productId

                        );


                        // -------------------------------------
                        // RECORD RELEASE
                        // -------------------------------------

                        db.prepare(`
                            INSERT INTO inventory_movements (
                                product_id,
                                movement_type,
                                quantity,
                                reference_id,
                                note
                            )
                            VALUES (?, ?, ?, ?, ?)
                        `).run(

                            item.productId,

                            "release",

                            item.quantity,

                            order.id,

                            `Payment failed for Order #${order.id}. ${item.quantity} unit(s) returned to available stock`

                        );

                    }


                    // -----------------------------------------
                    // UPDATE ORDER
                    // -----------------------------------------

                    db.prepare(`
                        UPDATE orders

                        SET
                            payment_status = ?,

                            order_status = 'cancelled',

                            updated_at =
                                CURRENT_TIMESTAMP

                        WHERE id = ?
                    `).run(

                        transaction.status ||
                            "failed",

                        order.id

                    );

                });


            releaseReservation();


            console.log(
                "↩️ Reserved inventory released:",
                {
                    orderId:
                        order.id,

                    paymentStatus:
                        transaction.status
                }
            );


            return res.status(400).json({

                success: false,

                message:
                    "Payment was not successful. Reserved stock has been released.",

                paymentStatus:
                    transaction.status,

                stockReleased:
                    true

            });

        }


        // =================================================
        // PAYMENT SUCCESSFUL
        // =================================================
        //
        // VERY IMPORTANT:
        //
        // DO NOT reduce quantity_available here.
        //
        // The order controller already reduced it when
        // the stock was reserved.
        //
        // We only:
        //
        // reserved_quantity -= quantity
        // total_sold += quantity
        //
        // =================================================

        try {

            const processSuccessfulPayment =
                db.transaction(() => {

                    // =========================================
                    // CHECK ALL RESERVED STOCK
                    // =========================================

                    for (
                        const item
                        of normalizedItems
                    ) {

                        const inventory =
                            db.prepare(`
                                SELECT
                                    inventory.*,

                                    products.name
                                        AS product_name

                                FROM inventory

                                INNER JOIN products
                                    ON products.id =
                                        inventory.product_id

                                WHERE inventory.product_id = ?
                            `).get(
                                item.productId
                            );


                        if (!inventory) {

                            const error =
                                new Error(
                                    `Inventory record not found for ${item.name}.`
                                );


                            error.code =
                                "INVENTORY_NOT_FOUND";


                            throw error;

                        }


                        // =====================================
                        // VERIFY RESERVATION
                        // =====================================

                        if (
                            Number(
                                inventory.reserved_quantity
                            ) <
                            item.quantity
                        ) {

                            const error =
                                new Error(

                                    `Reserved stock is insufficient for ${inventory.product_name}. Reserved: ${inventory.reserved_quantity}, required: ${item.quantity}.`

                                );


                            error.code =
                                "RESERVATION_MISMATCH";


                            error.productId =
                                item.productId;


                            error.available =
                                inventory.quantity_available;


                            error.reserved =
                                inventory.reserved_quantity;


                            error.requested =
                                item.quantity;


                            throw error;

                        }

                    }


                    // =========================================
                    // COMPLETE SALE
                    // =========================================

                    for (
                        const item
                        of normalizedItems
                    ) {

                        // -------------------------------------
                        // CONVERT RESERVATION TO SALE
                        // -------------------------------------

                        db.prepare(`
                            UPDATE inventory

                            SET
                                total_sold =
                                    total_sold + ?,

                                reserved_quantity =
                                    reserved_quantity - ?,

                                updated_at =
                                    CURRENT_TIMESTAMP

                            WHERE product_id = ?
                        `).run(

                            item.quantity,

                            item.quantity,

                            item.productId

                        );


                        // -------------------------------------
                        // RECORD SALE
                        // -------------------------------------

                        db.prepare(`
                            INSERT INTO inventory_movements (
                                product_id,
                                movement_type,
                                quantity,
                                reference_id,
                                note
                            )
                            VALUES (?, ?, ?, ?, ?)
                        `).run(

                            item.productId,

                            "sale",

                            item.quantity,

                            order.id,

                            `Order #${order.id} - ${item.quantity} unit(s) sold`

                        );

                    }


                    // =========================================
                    // MARK ORDER AS PAID
                    // =========================================

                    db.prepare(`
                        UPDATE orders

                        SET
                            payment_status = 'paid',

                            order_status = 'processing',

                            updated_at =
                                CURRENT_TIMESTAMP

                        WHERE id = ?
                    `).run(
                        order.id
                    );

                });


            // =============================================
            // EXECUTE SUCCESSFUL PAYMENT TRANSACTION
            // =============================================

            processSuccessfulPayment();


        } catch (inventoryError) {

            // =================================================
            // PAYMENT SUCCESSFUL BUT INVENTORY PROBLEM
            // =================================================

            console.error(
                "❌ Payment successful but inventory processing failed:",
                inventoryError
            );


            // -------------------------------------------------
            // IMPORTANT:
            // We DO NOT mark payment as failed.
            //
            // Paystack says payment was successful.
            // -------------------------------------------------

            db.prepare(`
                UPDATE orders

                SET
                    payment_status = 'paid',

                    order_status = 'stock_issue',

                    updated_at =
                        CURRENT_TIMESTAMP

                WHERE id = ?
            `).run(
                order.id
            );


            return res.status(409).json({

                success: false,

                paymentSuccessful:
                    true,

                stockAvailable:
                    false,

                message:
                    "Payment was successful, but there was a problem confirming the reserved inventory. Please contact NutriDust Foods for assistance.",

                orderId:
                    order.id,

                error:
                    inventoryError.message

            });

        }


        // =================================================
        // GET UPDATED ORDER
        // =================================================

        const updatedOrder =
            db.prepare(`
                SELECT
                    id,

                    customer_name
                        AS customerName,

                    customer_phone
                        AS customerPhone,

                    customer_email
                        AS customerEmail,

                    delivery_address
                        AS deliveryAddress,

                    items,

                    total_amount
                        AS total,

                    payment_status
                        AS paymentStatus,

                    order_status
                        AS orderStatus,

                    payment_reference
                        AS paymentReference,

                    created_at
                        AS createdAt,

                    updated_at
                        AS updatedAt

                FROM orders

                WHERE id = ?
            `).get(
                order.id
            );


        // =================================================
        // PARSE UPDATED ITEMS
        // =================================================

        if (updatedOrder) {

            try {

                updatedOrder.items =
                    JSON.parse(
                        updatedOrder.items
                    );

            } catch {

                updatedOrder.items = [];

            }

        }


        console.log(
            "✅ Payment verified and inventory sale completed:",
            {
                orderId:
                    updatedOrder.id,

                reference:
                    updatedOrder.paymentReference,

                amount:
                    updatedOrder.total
            }
        );


        // =================================================
        // SUCCESS RESPONSE
        // =================================================

        res.status(200).json({

            success: true,

            message:
                "Payment verified and inventory updated successfully.",

            order:
                updatedOrder,

            transaction: {

                reference:
                    transaction.reference,

                status:
                    transaction.status,

                amount:
                    transaction.amount,

                paidAt:
                    transaction.paid_at,

                channel:
                    transaction.channel

            }

        });


    } catch (error) {

        console.error(
            "❌ Payment Verification Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Unable to verify payment."

        });

    }

};