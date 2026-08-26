import db from "../config/sqlite.js";
import { verifyPayment } from "./paystackService.js";


// =====================================================
// SETTINGS
// =====================================================

const MINIMUM_ORDER_AGE_MINUTES = 35;


// =====================================================
// PARSE ORDER ITEMS
// =====================================================

function parseItems(value) {

    try {

        const items =
            typeof value === "string"
                ? JSON.parse(value)
                : value;

        return Array.isArray(items)
            ? items
            : [];

    } catch {

        return [];

    }

}


// =====================================================
// RELEASE ORDER RESERVATION
// =====================================================

function releaseOrderReservation(
    order,
    paymentStatus = "abandoned"
) {

    const items =
        parseItems(order.items);


    if (items.length === 0) {

        throw new Error(
            `Order #${order.id} contains no valid items.`
        );

    }


    const transaction =
        db.transaction(() => {

            // =============================================
            // DO NOT PROCESS TWICE
            // =============================================

            const freshOrder =
                db.prepare(`
                    SELECT
                        id,
                        payment_status,
                        order_status
                    FROM orders
                    WHERE id = ?
                `).get(
                    order.id
                );


            if (!freshOrder) {

                throw new Error(
                    `Order #${order.id} no longer exists.`
                );

            }


            if (
                freshOrder.payment_status === "paid" ||
                freshOrder.order_status === "cancelled"
            ) {

                return {
                    alreadyProcessed: true
                };

            }


            // =============================================
            // RELEASE EACH ITEM
            // =============================================

            for (const item of items) {

                const productId =
                    Number(
                        item.productId
                    );


                const quantity =
                    Number(
                        item.quantity
                    );


                if (
                    !Number.isInteger(productId) ||
                    productId <= 0 ||
                    !Number.isInteger(quantity) ||
                    quantity <= 0
                ) {

                    throw new Error(
                        `Invalid item in Order #${order.id}.`
                    );

                }


                // =========================================
                // CHECK EXISTING RELEASE
                // =========================================

                const existingRelease =
                    db.prepare(`
                        SELECT id

                        FROM inventory_movements

                        WHERE
                            product_id = ?
                            AND reference_id = ?
                            AND movement_type = 'release'

                        LIMIT 1
                    `).get(

                        productId,

                        order.id

                    );


                if (existingRelease) {

                    continue;

                }


                // =========================================
                // RELEASE RESERVED STOCK
                // =========================================

                const update =
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

                        quantity,

                        quantity,

                        productId,

                        quantity

                    );


                if (
                    update.changes !== 1
                ) {

                    throw new Error(
                        `Unable to release reservation for product #${productId} from Order #${order.id}.`
                    );

                }


                // =========================================
                // RECORD RELEASE
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

                    productId,

                    "release",

                    quantity,

                    order.id,

                    `Automatically restored ${quantity} unit(s) from Order #${order.id} after unsuccessful/abandoned payment`,

                    "SYSTEM:AUTO_CLEANUP"

                );

            }


            // =============================================
            // CANCEL ORDER
            // =============================================

            db.prepare(`
                UPDATE orders

                SET
                    payment_status = ?,

                    order_status = 'cancelled',

                    updated_at =
                        CURRENT_TIMESTAMP

                WHERE
                    id = ?

                    AND payment_status != 'paid'
            `).run(

                paymentStatus,

                order.id

            );


            return {
                alreadyProcessed: false
            };

        });


    return transaction();

}


// =====================================================
// CHECK PENDING PAYMENTS
// =====================================================

export async function cleanupPendingPayments() {

    try {

        const orders =
            db.prepare(`
                SELECT
                    id,
                    items,
                    payment_reference,
                    payment_status,
                    order_status,
                    created_at

                FROM orders

                WHERE
                    payment_status = 'pending'

                    AND

                    order_status = 'pending'

                    AND

                    payment_reference IS NOT NULL

                    AND

                    datetime(created_at)
                        <= datetime(
                            'now',
                            ?
                        )
            `).all(

                `-${MINIMUM_ORDER_AGE_MINUTES} minutes`

            );


        if (
            orders.length === 0
        ) {

            return;

        }


        console.log(
            `🔍 Checking ${orders.length} pending payment(s)...`
        );


        for (const order of orders) {

            try {

                const response =
                    await verifyPayment(
                        order.payment_reference
                    );


                const status =
                    String(
                        response?.data?.status || ""
                    )
                    .trim()
                    .toLowerCase();


                console.log(
                    `💳 Order #${order.id} Paystack status: ${status || "unknown"}`
                );


                // =========================================
                // TERMINAL UNSUCCESSFUL STATUS
                // =========================================

                if (
                    status === "failed" ||
                    status === "abandoned" ||
                    status === "cancelled"
                ) {

                    releaseOrderReservation(
                        order,
                        status
                    );


                    console.log(
                        `↩️ Order #${order.id} cancelled and reserved inventory restored automatically.`
                    );

                }


                // =========================================
                // SUCCESS
                // =========================================
                //
                // IMPORTANT:
                // Never release successful payments.
                //
                // Your existing payment verification flow
                // will complete the sale.
                // =========================================

                else if (
                    status === "success"
                ) {

                    console.log(
                        `✅ Order #${order.id} payment succeeded. Inventory was NOT released.`
                    );

                }


                // =========================================
                // STILL PENDING
                // =========================================

                else {

                    console.log(
                        `⏳ Order #${order.id} is still ${status || "pending"}. Reservation kept.`
                    );

                }


            } catch (error) {

                // IMPORTANT:
                // If Paystack cannot be reached,
                // do NOT release stock.

                console.error(
                    `⚠️ Unable to check Order #${order.id}:`,
                    error.message
                );

            }

        }


    } catch (error) {

        console.error(
            "❌ Pending payment cleanup error:",
            error
        );

    }

}