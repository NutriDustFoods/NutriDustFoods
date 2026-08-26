import db from "../config/sqlite.js";


// =====================================================
// HELPER: GET ADMIN / USER WHO PERFORMED THE ACTION
// =====================================================

const getPerformedBy = (req) => {

    const admin =
        req.admin || {};

    return (

        admin.username ||

        admin.name ||

        admin.email ||

        admin.adminName ||

        admin.userName ||

        (
            admin.id
                ? `Admin #${admin.id}`
                : null
        ) ||

        "SYSTEM"

    );

};


// =====================================================
// HELPER: PARSE ORDER ITEMS
// =====================================================

const parseItems = (value) => {

    if (!value) {

        return [];

    }


    if (Array.isArray(value)) {

        return value;

    }


    try {

        const parsed =
            JSON.parse(value);


        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch {

        return [];

    }

};


// =====================================================
// HELPER: FORMAT ORDER
// =====================================================

const formatOrder = (order) => {

    if (!order) {

        return null;

    }


    return {

        id:
            order.id,

        customerId:
            order.customer_id,

        customerName:
            order.customer_name,

        customerPhone:
            order.customer_phone,

        customerEmail:
            order.customer_email,

        deliveryAddress:
            order.delivery_address,

        fulfillmentType:
            order.fulfillment_type || "delivery",

        deliveryFee:
            Number(order.delivery_fee || 0),

        items:
            parseItems(
                order.items
            ),

        total:
            Number(
                order.total_amount || 0
            ),

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

};


// =====================================================
// HELPER: GET ORDER
// =====================================================

const getOrder = (id) => {

    return db.prepare(`

        SELECT

            id,

            customer_id,

            customer_name,

            customer_phone,

            customer_email,

            delivery_address,

            fulfillment_type,

            delivery_fee,

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

};


// =====================================================
// GET ALL ORDERS
// GET /api/admin/orders
// =====================================================

export const getAdminOrders = (
    req,
    res
) => {

    try {

        const rows =
            db.prepare(`

                SELECT

                    id,

                    customer_id,

                    customer_name,

                    customer_phone,

                    customer_email,

                    delivery_address,

                    fulfillment_type,

                    delivery_fee,

                    items,

                    total_amount,

                    payment_status,

                    order_status,

                    payment_reference,

                    created_at,

                    updated_at

                FROM orders

                ORDER BY
                    id DESC

            `).all();


        const orders =
            rows.map(
                formatOrder
            );


        return res.status(200).json({

            success:
                true,

            orders

        });


    } catch (error) {

        console.error(
            "❌ Admin orders error:",
            error
        );


        return res.status(500).json({

            success:
                false,

            message:
                "Unable to load orders."

        });

    }

};


// =====================================================
// GET SINGLE ORDER
// GET /api/admin/orders/:id
// =====================================================

export const getAdminOrderById = (
    req,
    res
) => {

    try {

        const id =
            Number(
                req.params.id
            );


        // =================================================
        // VALIDATE ID
        // =================================================

        if (

            !Number.isInteger(id) ||

            id <= 0

        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "Please provide a valid order number."

            });

        }


        // =================================================
        // FIND ORDER
        // =================================================

        const order =
            getOrder(id);


        if (!order) {

            return res.status(404).json({

                success:
                    false,

                message:
                    "Order not found."

            });

        }


        return res.status(200).json({

            success:
                true,

            order:
                formatOrder(order)

        });


    } catch (error) {

        console.error(
            "❌ Admin order details error:",
            error
        );


        return res.status(500).json({

            success:
                false,

            message:
                "Unable to load order."

        });

    }

};


// =====================================================
// UPDATE ORDER STATUS
// PATCH /api/admin/orders/:id/status
// =====================================================

export const updateAdminOrderStatus = (
    req,
    res
) => {

    try {

        const id =
            Number(
                req.params.id
            );


        let status =
            String(
                req.body?.status || ""
            )
                .trim()
                .toLowerCase();

        if (status === "shipped" || status === "on_delivery") {
            status = "out_for_delivery";
        }


        const allowedStatuses = [

            "pending",

            "processing",

            "ready_for_pickup",

            "out_for_delivery",

            "delivered",

            "cancelled",

            "stock_issue"

        ];


        // =================================================
        // VALIDATE ORDER ID
        // =================================================

        if (

            !Number.isInteger(id) ||

            id <= 0

        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "Please provide a valid order number."

            });

        }


        // =================================================
        // VALIDATE STATUS
        // =================================================

        if (!status) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "Order status is required."

            });

        }


        if (
            !allowedStatuses.includes(
                status
            )
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    `Invalid order status. Allowed statuses: ${allowedStatuses.join(", ")}`

            });

        }


        // =================================================
        // GET EXISTING ORDER
        // =================================================

        const existingOrder =
            getOrder(id);


        if (!existingOrder) {

            return res.status(404).json({

                success:
                    false,

                message:
                    "Order not found."

            });

        }


        // =================================================
        // NO CHANGE
        // =================================================

        if (
            existingOrder.order_status ===
            status
        ) {

            return res.status(200).json({

                success:
                    true,

                message:
                    `Order is already ${status}.`,

                order:
                    formatOrder(
                        existingOrder
                    )

            });

        }


        // =================================================
        // DELIVERED ORDERS
        // =================================================
        //
        // Once delivered, don't allow the order to be
        // changed back or cancelled automatically.
        //
        // =================================================

        if (
            existingOrder.order_status ===
            "delivered"
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "A delivered order cannot be changed."

            });

        }

        if (existingOrder.order_status === "cancelled") {
            return res.status(400).json({ success:false, message:"A cancelled order cannot be changed." });
        }

        const pickupOrder = (existingOrder.fulfillment_type || "delivery") === "pickup";
        const transitions = pickupOrder
            ? { pending:["processing","cancelled"], processing:["ready_for_pickup","cancelled"], ready_for_pickup:["delivered","cancelled"] }
            : { pending:["processing","cancelled"], processing:["cancelled"] };
        if (!(transitions[existingOrder.order_status] || []).includes(status)) {
            return res.status(409).json({
                success:false,
                message:pickupOrder
                    ? "That action is not valid for the current pickup stage."
                    : "Delivery progress after preparation is controlled by the assigned rider."
            });
        }


        // =================================================
        // CANCEL ORDER
        // =================================================

        if (
            status ===
            "cancelled"
        ) {

            const result =
                cancelOrder(
                    existingOrder,
                    req
                );


            const updatedOrder =
                getOrder(id);


            return res.status(200).json({

                success:
                    true,

                message:
                    result.message,

                order:
                    formatOrder(
                        updatedOrder
                    ),

                inventoryRestored:
                    result.inventoryRestored

            });

        }


        // =================================================
        // NORMAL STATUS UPDATE
        // =================================================

        db.prepare(`

            UPDATE orders

            SET

                order_status = ?,

                updated_at =
                    CURRENT_TIMESTAMP

            WHERE id = ?

        `).run(

            status,

            id

        );


        const updatedOrder =
            getOrder(id);


        return res.status(200).json({

            success:
                true,

            message:
                "Order status updated successfully.",

            order:
                formatOrder(
                    updatedOrder
                )

        });


    } catch (error) {

        console.error(
            "❌ Update order status error:",
            error
        );


        return res.status(500).json({

            success:
                false,

            message:
                "Unable to update order status.",

            error:
                error.message

        });

    }

};


// =====================================================
// CANCEL ORDER
// =====================================================
//
// This function handles both:
//
// 1. UNPAID ORDER
//
// quantity_available += quantity
// reserved_quantity -= quantity
//
// 2. PAID ORDER
//
// quantity_available += quantity
// total_sold -= quantity
//
// =====================================================

const cancelOrder = (
    order,
    req
) => {

    const performedBy =
        getPerformedBy(
            req
        );


    const items =
        parseItems(
            order.items
        );


    if (
        items.length === 0
    ) {

        throw new Error(
            "This order contains no valid inventory items."
        );

    }


    const isPaid =
        order.payment_status ===
        "paid";


    const transaction =
        db.transaction(() => {

            const restoredItems = [];


            // =================================================
            // PROCESS EACH ITEM
            // =================================================

            for (
                const item
                of items
            ) {

                const productId =
                    Number(
                        item?.productId
                    );


                const quantity =
                    Number(
                        item?.quantity
                    );


                // =============================================
                // VALIDATE ITEM
                // =============================================

                if (

                    !Number.isInteger(
                        productId
                    ) ||

                    productId <= 0 ||

                    !Number.isInteger(
                        quantity
                    ) ||

                    quantity <= 0

                ) {

                    throw new Error(
                        `Invalid inventory item in Order #${order.id}.`
                    );

                }


                // =============================================
                // PREVENT DUPLICATE RESTORATION
                // =============================================

                const previousCancellation =
                    db.prepare(`

                        SELECT id

                        FROM inventory_movements

                        WHERE

                            product_id = ?

                            AND

                            reference_id = ?

                            AND

                            movement_type =
                                'cancellation'

                        LIMIT 1

                    `).get(

                        productId,

                        order.id

                    );


                if (
                    previousCancellation
                ) {

                    continue;

                }


                // =============================================
                // GET INVENTORY
                // =============================================

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


                // =============================================
                // UNPAID ORDER
                // =============================================
                //
                // The quantity is currently reserved.
                //
                // We must verify the reservation before
                // releasing it.
                //
                // =============================================

                if (!isPaid) {

                    const reserved =
                        Number(
                            inventory.reserved_quantity
                        );


                    if (
                        reserved <
                        quantity
                    ) {

                        throw new Error(

                            `Reserved stock is insufficient for product #${productId}. Reserved: ${reserved}, required: ${quantity}.`

                        );

                    }


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

                        quantity,

                        quantity,

                        productId

                    );

                }


                // =============================================
                // PAID ORDER
                // =============================================
                //
                // The reservation was already converted
                // into a completed sale.
                //
                // Therefore:
                //
                // available += quantity
                // total_sold -= quantity
                //
                // =============================================

                else {

                    const totalSold =
                        Number(
                            inventory.total_sold
                        );


                    if (
                        totalSold <
                        quantity
                    ) {

                        throw new Error(

                            `Sold inventory is insufficient for product #${productId}. Sold: ${totalSold}, required reversal: ${quantity}.`

                        );

                    }


                    db.prepare(`

                        UPDATE inventory

                        SET

                            quantity_available =
                                quantity_available + ?,

                            total_sold =
                                total_sold - ?,

                            updated_at =
                                CURRENT_TIMESTAMP

                        WHERE product_id = ?

                    `).run(

                        quantity,

                        quantity,

                        productId

                    );

                }


                // =============================================
                // RECORD CANCELLATION
                // =============================================

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

                    productId,

                    "cancellation",

                    quantity,

                    order.id,

                    isPaid

                        ? `Restored ${quantity} unit(s) from Order #${order.id} after cancellation of paid order`

                        : `Released ${quantity} reserved unit(s) from Order #${order.id} after cancellation of unpaid order`,

                    performedBy

                );


                restoredItems.push({

                    productId,

                    quantity

                });

            }


            // =================================================
            // UPDATE ORDER
            // =================================================

            db.prepare(`

                UPDATE orders

                SET

                    order_status =
                        'cancelled',

                    updated_at =
                        CURRENT_TIMESTAMP

                WHERE id = ?

            `).run(
                order.id
            );


            return {

                restoredItems

            };

        });


    const result =
        transaction();


    return {

        message:
            isPaid

                ? "Paid order cancelled and sold inventory restored successfully."

                : "Order cancelled and reserved inventory released successfully.",

        inventoryRestored:
            result.restoredItems

    };

};
