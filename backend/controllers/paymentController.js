import db from "../config/sqlite.js";

import {
    initializePayment,
    verifyPayment
} from "../services/paystackService.js";

import {
    ACTIVE_PAYMENT_STATUSES,
    FAILED_PAYMENT_STATUSES,
    releaseFailedPaymentReservation
} from "../services/paymentCleanupService.js";
import { autoAssignPaidOrder } from "../services/riderDispatchService.js";
import { alertPaidOrder } from "../services/adminAlertService.js";


// =====================================================
// HELPER: GET AUTHENTICATED CUSTOMER
// =====================================================

const getAuthenticatedCustomer = (req) => {

    const customerId =
        Number(
            req.customer?.id
        );


    if (
        !Number.isInteger(customerId) ||
        customerId <= 0
    ) {

        return null;

    }


    return db.prepare(`
        SELECT
            id,
            name,
            email,
            phone
        FROM customers
        WHERE id = ?
    `).get(
        customerId
    );

};


// =====================================================
// HELPER: PARSE ORDER ITEMS
// =====================================================

const parseOrderItems = (order) => {

    if (!order) {

        return order;

    }


    try {

        order.items =
            typeof order.items === "string"

                ? JSON.parse(
                    order.items
                )

                : order.items;

    } catch {

        order.items = [];

    }


    return order;

};


// =====================================================
// HELPER: GET CUSTOMER ORDER
// =====================================================

const getCustomerOrder = (
    orderId,
    customerId
) => {

    return db.prepare(`
        SELECT *
        FROM orders
        WHERE
            id = ?
            AND customer_id = ?
    `).get(

        orderId,

        customerId

    );

};


// =====================================================
// INITIALIZE ORDER PAYMENT
// POST /api/payments/initialize
// =====================================================
//
// SECURITY:
//
// Customer must be authenticated.
//
// The order MUST belong to the authenticated customer.
//
// =====================================================

export const initializeOrderPayment = async (
    req,
    res
) => {

    try {

        // =================================================
        // AUTHENTICATED CUSTOMER
        // =================================================

        const customer =
            getAuthenticatedCustomer(
                req
            );


        if (!customer) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required. Please login."

            });

        }


        // =================================================
        // ORDER ID
        // =================================================

        const orderId =
            Number(
                req.body?.orderId
            );


        if (

            !Number.isInteger(
                orderId
            ) ||

            orderId <= 0

        ) {

            return res.status(400).json({

                success: false,

                message:
                    "A valid order ID is required."

            });

        }


        // =================================================
        // FIND CUSTOMER ORDER
        // =================================================

        const order =
            getCustomerOrder(

                orderId,

                customer.id

            );


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found."

            });

        }


        // =================================================
        // ALREADY PAID
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
        // CANCELLED ORDER
        // =================================================

        if (
            order.order_status === "cancelled"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "This order has been cancelled and cannot be paid."

            });

        }


        // =================================================
        // CUSTOMER EMAIL
        // =================================================

        const email =
            String(
                customer.email || ""
            ).trim();


        if (!email) {

            return res.status(400).json({

                success: false,

                message:
                    "Your customer account does not have a valid email address."

            });

        }


        // =================================================
        // ORDER AMOUNT
        // =================================================

        const orderAmount =
            Number(
                order.total_amount
            );


        if (

            !Number.isFinite(
                orderAmount
            ) ||

            orderAmount <= 0

        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid order amount."

            });

        }


        // =================================================
        // NAIRA → KOBO
        // =================================================

        const amount =
            Math.round(
                orderAmount * 100
            );


        if (
            amount <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid payment amount."

            });

        }


        // =================================================
        // CREATE UNIQUE PAYMENT REFERENCE
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

                customerId:
                    customer.id,

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

        const update =
            db.prepare(`
                UPDATE orders

                SET
                    payment_reference = ?,

                    payment_status = 'pending',

                    updated_at =
                        CURRENT_TIMESTAMP

                WHERE
                    id = ?

                    AND customer_id = ?

                    AND payment_status != 'paid'
            `).run(

                paystackReference,

                order.id,

                customer.id

            );


        if (
            update.changes !== 1
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "The order could not be prepared for payment."

            });

        }


        console.log(
            "✅ Paystack payment initialized:",
            paystackReference
        );


        // =================================================
        // SUCCESS
        // =================================================

        return res.status(200).json({

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


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Unable to initialize payment."

        });

    }

};


// =====================================================
// VERIFY ORDER PAYMENT
// GET /api/payments/verify/:reference
// =====================================================
//
// SECURITY:
//
// Customer must be authenticated.
//
// Payment reference MUST belong to that customer.
//
// =====================================================

export const verifyOrderPayment = async (
    req,
    res
) => {

    try {

        // =================================================
        // AUTHENTICATED CUSTOMER
        // =================================================

        const customer =
            getAuthenticatedCustomer(
                req
            );


        if (!customer) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required. Please login."

            });

        }


        // =================================================
        // PAYMENT REFERENCE
        // =================================================

        const cleanReference =
            String(
                req.params?.reference || ""
            ).trim();


        if (!cleanReference) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment reference is required."

            });

        }


        console.log(
            "🔍 Verifying Paystack payment:",
            {

                reference:
                    cleanReference,

                customerId:
                    customer.id

            }
        );


        // =================================================
        // FIND CUSTOMER'S ORDER
        // =================================================

        const order =
            db.prepare(`
                SELECT *
                FROM orders
                WHERE
                    payment_reference = ?

                    AND

                    customer_id = ?
            `).get(

                cleanReference,

                customer.id

            );


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order associated with this payment was not found."

            });

        }


        // =================================================
        // ALREADY PAID
        // =================================================

        if (
            order.payment_status === "paid"
        ) {

            parseOrderItems(
                order
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
        // VERIFY WITH PAYSTACK
        // =================================================

        const payment =
            await verifyPayment(
                cleanReference
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
        // VERIFY REFERENCE
        // =================================================

        if (

            transaction.reference &&

            transaction.reference !==
                cleanReference

        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment reference verification failed."

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

            !Number.isFinite(
                paidAmount
            ) ||

            paidAmount !==
                expectedAmount

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
        // PARSE ITEMS
        // =================================================

        let items;


        try {

            items =
                typeof order.items === "string"

                    ? JSON.parse(
                        order.items
                    )

                    : order.items;

        } catch {

            return res.status(500).json({

                success: false,

                message:
                    "Order contains invalid product information."

            });

        }


        if (

            !Array.isArray(
                items
            ) ||

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
            items.map(
                item => ({

                    productId:
                        Number(
                            item.productId
                        ),

                    quantity:
                        Number(
                            item.quantity
                        ),

                    name:
                        String(
                            item.name ||
                            "Product"
                        )

                })
            );


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
        // PAYMENT NOT SUCCESSFUL
        // =================================================

        if (
            transaction.status !== "success"
        ) {

            // =============================================
            // IMPORTANT IDEMPOTENCY CHECK
            // =============================================
            //
            // If the order is already cancelled because
            // the failed payment was previously processed,
            // DO NOT release inventory again.
            //
            // =============================================

            if (
                order.order_status === "cancelled"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Payment was not successful. The order has already been cancelled and reserved stock released.",

                    paymentStatus:
                        transaction.status,

                    stockReleased:
                        true,

                    alreadyProcessed:
                        true

                });

            }

            // Use the same atomic, idempotent release path as the background
            // cleanup worker. This prevents a verification request racing the
            // worker (or an admin cancellation) from releasing stock twice.
            const paystackStatus = String(transaction.status || "").trim().toLowerCase();

            if (FAILED_PAYMENT_STATUSES.has(paystackStatus)) {
                const releaseResult = releaseFailedPaymentReservation({
                    orderId: order.id,
                    paystackStatus,
                    performedBy: "SYSTEM:CUSTOMER_PAYMENT_VERIFY"
                });

                return res.status(400).json({
                    success: false,
                    message: releaseResult.released
                        ? "Payment was not successful. Reserved stock has been released."
                        : "Payment was not successful. The order has already been cancelled or processed.",
                    paymentStatus: paystackStatus,
                    stockReleased: releaseResult.released || releaseResult.reason === "already_cancelled",
                    alreadyProcessed: !releaseResult.released
                });
            }

            return res.status(400).json({
                success: false,
                message: "Payment is still processing. Reserved stock was kept.",
                paymentStatus: paystackStatus,
                stockReleased: false
            });


            try {

                const releaseReservation =
                    db.transaction(() => {

                        // =====================================
                        // VERIFY RESERVATIONS
                        // =====================================

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

                        }


                        // =====================================
                        // RELEASE RESERVATIONS
                        // =====================================

                        for (
                            const item
                            of normalizedItems
                        ) {

                            db.prepare(`
                                UPDATE inventory

                                SET
                                    quantity_available =
                                        quantity_available + ?,

                                    reserved_quantity =
                                        reserved_quantity - ?,

                                    updated_at =
                                        CURRENT_TIMESTAMP

                                WHERE
                                    product_id = ?

                                    AND

                                    reserved_quantity >= ?
                            `).run(

                                item.quantity,

                                item.quantity,

                                item.productId,

                                item.quantity

                            );


                            // =================================
                            // INVENTORY MOVEMENT
                            // =================================

                            db.prepare(`
                                INSERT INTO inventory_movements (

                                    product_id,

                                    movement_type,

                                    quantity,

                                    reference_id,

                                    note,

                                    performed_by

                                )

                                VALUES (?, ?, ?, ?, ?, ?)
                            `).run(

                                item.productId,

                                "release",

                                item.quantity,

                                order.id,

                                `Payment failed for Order #${order.id}. ${item.quantity} unit(s) returned to available stock`,

                                "SYSTEM"

                            );

                        }


                        // =====================================
                        // CANCEL ORDER
                        // =====================================

                        db.prepare(`
                            UPDATE orders

                            SET
                                payment_status = ?,

                                order_status = 'cancelled',

                                updated_at =
                                    CURRENT_TIMESTAMP

                            WHERE
                                id = ?

                                AND customer_id = ?

                                AND payment_status != 'paid'
                        `).run(

                            transaction.status ||
                                "failed",

                            order.id,

                            customer.id

                        );

                    });


                releaseReservation();


                return res.status(400).json({

                    success: false,

                    message:
                        "Payment was not successful. Reserved stock has been released.",

                    paymentStatus:
                        transaction.status,

                    stockReleased:
                        true

                });

            } catch (releaseError) {

                console.error(
                    "❌ Failed to release reserved stock:",
                    releaseError
                );


                return res.status(500).json({

                    success: false,

                    message:
                        "Payment was unsuccessful, but the system could not release the reserved stock automatically. Please contact NutriDust Foods.",

                    stockReleased:
                        false

                });

            }

        }


        // =================================================
        // SUCCESSFUL PAYMENT
        // =================================================
        //
        // IMPORTANT:
        //
        // quantity_available was already decreased during
        // order creation.
        //
        // Therefore:
        //
        // reserved_quantity -= quantity
        //
        // total_sold += quantity
        //
        // =================================================

        try {

            const processSuccessfulPayment =
                db.transaction(() => {

                    // =========================================
                    // VERIFY RESERVATIONS
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

                                WHERE
                                    inventory.product_id = ?
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

    const update =
        db.prepare(`
            UPDATE inventory

            SET
                total_sold =
                    total_sold + ?,

                reserved_quantity =
                    reserved_quantity - ?,

                updated_at =
                    CURRENT_TIMESTAMP

            WHERE
                product_id = ?

                AND

                reserved_quantity >= ?
        `).run(

            item.quantity,

            item.quantity,

            item.productId,

            item.quantity

        );


    // =========================================
    // VERIFY INVENTORY UPDATE
    // =========================================

    if (
        update.changes !== 1
    ) {

        const error =
            new Error(
                `Unable to complete inventory sale for ${item.name}.`
            );


        error.code =
            "SALE_UPDATE_FAILED";


        throw error;

    }


    // =========================================
    // RECORD SALE
    // =========================================

    db.prepare(`
        INSERT INTO inventory_movements (

            product_id,

            movement_type,

            quantity,

            reference_id,

            note,

            performed_by

        )

        VALUES (?, ?, ?, ?, ?, ?)

    `).run(

        item.productId,

        "sale",

        item.quantity,

        order.id,

        `Order #${order.id} - ${item.quantity} unit(s) sold`,

        "SYSTEM"

    );

}
                    // =========================================
                    // MARK ORDER PAID
                    // =========================================

                    db.prepare(`
                        UPDATE orders

                        SET
                            payment_reference = ?,

                            payment_status = 'paid',

                            order_status = 'processing',

                            auto_dispatch_eligible = CASE WHEN fulfillment_type='delivery' THEN 1 ELSE 0 END,

                            updated_at =
                                CURRENT_TIMESTAMP

                        WHERE
                            id = ?

                            AND customer_id = ?

                            AND payment_status != 'paid'
                    `).run(

                        transaction.reference ||
                            cleanReference,

                        order.id,

                        customer.id

                    );

                });


            processSuccessfulPayment();

            autoAssignPaidOrder(order.id);


        } catch (inventoryError) {

            // =================================================
            // PAYMENT SUCCESSFUL BUT INVENTORY PROBLEM
            // =================================================

            console.error(
                "❌ Payment successful but inventory processing failed:",
                inventoryError
            );


            // =================================================
            // DO NOT CALL PAYMENT FAILED
            // =================================================

            db.prepare(`
                UPDATE orders

                SET
                    payment_status = 'paid',

                    order_status = 'stock_issue',

                    updated_at =
                        CURRENT_TIMESTAMP

                WHERE
                    id = ?

                    AND customer_id = ?
            `).run(

                order.id,

                customer.id

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

                    customer_id
                        AS customerId,

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

                WHERE
                    id = ?

                    AND customer_id = ?
            `).get(

                order.id,

                customer.id

            );


        parseOrderItems(
            updatedOrder
        );

        await alertPaidOrder(updatedOrder);


        // =================================================
        // SUCCESS
        // =================================================

        console.log(
            "✅ Payment verified successfully:",
            {

                orderId:
                    updatedOrder.id,

                customerId:
                    customer.id,

                reference:
                    updatedOrder.paymentReference,

                amount:
                    updatedOrder.total

            }
        );


        return res.status(200).json({

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


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Unable to verify payment."

        });

    }

};
