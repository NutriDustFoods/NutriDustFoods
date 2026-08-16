import db from "../config/sqlite.js";


// =====================================================
// GET ALL ORDERS
// GET /api/admin/orders
// =====================================================

export const getAdminOrders = (req, res) => {

    try {

        const rows = db.prepare(`
            SELECT
                id,
                customer_name,
                customer_phone,
                customer_email,
                delivery_address,
                items,
                total_amount,
                payment_status,
                order_status,
                payment_reference,
                created_at,
                updated_at
            FROM orders
            ORDER BY id DESC
        `).all();


        const orders = rows.map(order => {

            let items = [];

            try {

                items =
                    typeof order.items === "string"
                        ? JSON.parse(order.items)
                        : order.items || [];

            } catch (error) {

                console.error(
                    `❌ Unable to parse items for order #${order.id}:`,
                    error
                );

                items = [];

            }


            return {

                id: order.id,

                customerName:
                    order.customer_name,

                customerPhone:
                    order.customer_phone,

                customerEmail:
                    order.customer_email,

                deliveryAddress:
                    order.delivery_address,

                items,

                total:
                    Number(order.total_amount),

                paymentStatus:
                    order.payment_status,

                orderStatus:
                    order.order_status,

                paymentReference:
                    order.payment_reference,

                createdAt:
                    order.created_at,

                updatedAt:
                    order.updated_at

            };

        });


        res.status(200).json({

            success: true,

            orders

        });


    } catch (error) {

        console.error(
            "❌ Admin orders error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to load orders."

        });

    }

};


// =====================================================
// GET SINGLE ORDER
// GET /api/admin/orders/:id
// =====================================================

export const getAdminOrderById = (req, res) => {

    try {

        const { id } = req.params;


        const order =
            db.prepare(`
                SELECT
                    id,
                    customer_name,
                    customer_phone,
                    customer_email,
                    delivery_address,
                    items,
                    total_amount,
                    payment_status,
                    order_status,
                    payment_reference,
                    created_at,
                    updated_at
                FROM orders
                WHERE id = ?
            `).get(id);


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found."

            });

        }


        let items = [];

        try {

            items =
                typeof order.items === "string"
                    ? JSON.parse(order.items)
                    : order.items || [];

        } catch (error) {

            console.error(
                `❌ Unable to parse items for order #${order.id}:`,
                error
            );

            items = [];

        }


        const formattedOrder = {

            id: order.id,

            customerName:
                order.customer_name,

            customerPhone:
                order.customer_phone,

            customerEmail:
                order.customer_email,

            deliveryAddress:
                order.delivery_address,

            items,

            total:
                Number(order.total_amount),

            paymentStatus:
                order.payment_status,

            orderStatus:
                order.order_status,

            paymentReference:
                order.payment_reference,

            createdAt:
                order.created_at,

            updatedAt:
                order.updated_at

        };


        res.status(200).json({

            success: true,

            order:
                formattedOrder

        });


    } catch (error) {

        console.error(
            "❌ Admin order details error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to load order."

        });

    }

};


// =====================================================
// UPDATE ORDER STATUS
// PATCH /api/admin/orders/:id/status
// =====================================================

export const updateAdminOrderStatus = (req, res) => {

    try {

        const { id } = req.params;

        const { status } = req.body;


        const allowedStatuses = [

            "pending",

            "processing",

            "shipped",

            "delivered",

            "cancelled"

        ];


        // =================================================
        // VALIDATE STATUS
        // =================================================

        if (!status) {

            return res.status(400).json({

                success: false,

                message:
                    "Order status is required."

            });

        }


        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({

                success: false,

                message:
                    `Invalid order status. Allowed statuses: ${allowedStatuses.join(", ")}`

            });

        }


        // =================================================
        // GET EXISTING ORDER
        // =================================================

        const existingOrder =
            db.prepare(`
                SELECT
                    id,
                    items,
                    payment_status,
                    order_status
                FROM orders
                WHERE id = ?
            `).get(id);


        if (!existingOrder) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found."

            });

        }


        // =================================================
        // DO NOT RESTORE STOCK TWICE
        // =================================================

        if (
            status === "cancelled" &&
            existingOrder.order_status === "cancelled"
        ) {

            return res.status(200).json({

                success: true,

                message:
                    "Order is already cancelled."

            });

        }


        // =================================================
        // CANCEL ORDER + RESTORE INVENTORY
        // =================================================

        const transaction =
            db.transaction(() => {

                // =========================================
                // CANCEL ORDER
                // =========================================

                if (status === "cancelled") {

                    let items = [];

                    try {

                        items =
                            typeof existingOrder.items === "string"
                                ? JSON.parse(existingOrder.items)
                                : existingOrder.items || [];

                    } catch {

                        items = [];

                    }


                    // =====================================
                    // RESTORE EACH PRODUCT
                    // =====================================

                    for (const item of items) {

                        const productId =
                            Number(
                                item.productId ||
                                item.id ||
                                item._id
                            );


                        const quantity =
                            Number(
                                item.quantity || 0
                            );


                        if (
                            !Number.isInteger(productId) ||
                            productId <= 0 ||
                            !Number.isInteger(quantity) ||
                            quantity <= 0
                        ) {

                            continue;

                        }


                        // =================================
                        // CHECK IF THIS ORDER WAS ALREADY
                        // RESTORED THROUGH A CANCELLATION
                        // =================================

                        const existingCancellation =
                            db.prepare(`
                                SELECT id
                                FROM inventory_movements
                                WHERE product_id = ?
                                  AND reference_id = ?
                                  AND movement_type = 'cancellation'
                                LIMIT 1
                            `).get(

                                productId,

                                id

                            );


                        if (existingCancellation) {

                            continue;

                        }


                        // =================================
                        // GET INVENTORY
                        // =================================

                        const inventory =
                            db.prepare(`
                                SELECT
                                    product_id,
                                    quantity_available,
                                    reserved_quantity,
                                    total_sold
                                FROM inventory
                                WHERE product_id = ?
                            `).get(
                                productId
                            );


                        if (!inventory) {

                            throw new Error(
                                `Inventory record not found for product #${productId}.`
                            );

                        }


                        // =================================
                        // PENDING / UNPAID ORDER
                        // =================================
                        //
                        // Stock was reserved when the order
                        // was created.
                        //
                        // Return it to available stock and
                        // remove the reservation.
                        //
                        // =================================

                        if (
                            existingOrder.payment_status !== "paid"
                        ) {

                            db.prepare(`
                                UPDATE inventory

                                SET
                                    quantity_available =
                                        quantity_available + ?,

                                    reserved_quantity =
                                        MAX(
                                            0,
                                            reserved_quantity - ?
                                        ),

                                    updated_at =
                                        CURRENT_TIMESTAMP

                                WHERE product_id = ?
                            `).run(

                                quantity,

                                quantity,

                                productId

                            );

                        }


                        // =================================
                        // PAID ORDER
                        // =================================
                        //
                        // Payment already completed, so the
                        // reservation has already moved into
                        // total_sold.
                        //
                        // Cancelling therefore returns the
                        // product to available stock and
                        // removes it from total_sold.
                        //
                        // =================================

                        else {

                            db.prepare(`
                                UPDATE inventory

                                SET
                                    quantity_available =
                                        quantity_available + ?,

                                    total_sold =
                                        MAX(
                                            0,
                                            total_sold - ?
                                        ),

                                    updated_at =
                                        CURRENT_TIMESTAMP

                                WHERE product_id = ?
                            `).run(

                                quantity,

                                quantity,

                                productId

                            );

                        }


                        // =================================
                        // RECORD INVENTORY MOVEMENT
                        // =================================

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

                            productId,

                            "cancellation",

                            quantity,

                            id,

                            `Restored ${quantity} unit(s) because order #${id} was cancelled`

                        );

                    }

                }


                // =========================================
                // UPDATE ORDER STATUS
                // =========================================

                db.prepare(`
                    UPDATE orders

                    SET
                        order_status = ?,
                        updated_at = CURRENT_TIMESTAMP

                    WHERE id = ?
                `).run(

                    status,

                    id

                );

            });


        // =================================================
        // EXECUTE TRANSACTION
        // =================================================

        transaction();


        // =================================================
        // GET UPDATED ORDER
        // =================================================

        const updatedOrder =
            db.prepare(`
                SELECT
                    id,
                    customer_name,
                    customer_phone,
                    customer_email,
                    delivery_address,
                    items,
                    total_amount,
                    payment_status,
                    order_status,
                    payment_reference,
                    created_at,
                    updated_at
                FROM orders
                WHERE id = ?
            `).get(id);


        let items = [];

        try {

            items =
                typeof updatedOrder.items === "string"
                    ? JSON.parse(updatedOrder.items)
                    : updatedOrder.items || [];

        } catch {

            items = [];

        }


        // =================================================
        // SUCCESS
        // =================================================

        res.status(200).json({

            success: true,

            message:
                status === "cancelled"
                    ? "Order cancelled and inventory restored successfully."
                    : "Order status updated successfully.",

            order: {

                id:
                    updatedOrder.id,

                customerName:
                    updatedOrder.customer_name,

                customerPhone:
                    updatedOrder.customer_phone,

                customerEmail:
                    updatedOrder.customer_email,

                deliveryAddress:
                    updatedOrder.delivery_address,

                items,

                total:
                    Number(
                        updatedOrder.total_amount
                    ),

                paymentStatus:
                    updatedOrder.payment_status,

                orderStatus:
                    updatedOrder.order_status,

                paymentReference:
                    updatedOrder.payment_reference,

                createdAt:
                    updatedOrder.created_at,

                updatedAt:
                    updatedOrder.updated_at

            }

        });


    } catch (error) {

        console.error(
            "❌ Update order status error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to update order status.",

            error:
                error.message

        });

    }

};