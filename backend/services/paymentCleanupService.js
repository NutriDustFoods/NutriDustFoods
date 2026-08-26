import db from "../config/sqlite.js";
import { verifyPayment } from "./paystackService.js";

const readPositiveMinutes = (value, fallback) => {
    const minutes = Number(value);
    return Number.isFinite(minutes) && minutes > 0 ? minutes : fallback;
};

// Paystack checkout can remain legitimately pending for a while. Keep a
// generous grace period and make it configurable for deployments/test runs.
const PENDING_AGE_MINUTES = readPositiveMinutes(
    process.env.PAYMENT_RESERVATION_TIMEOUT_MINUTES,
    35
);
const CLEANUP_INTERVAL_MS = readPositiveMinutes(
    process.env.PAYMENT_CLEANUP_INTERVAL_MINUTES,
    5
) * 60 * 1000;

export const ACTIVE_PAYMENT_STATUSES = new Set([
    "ongoing", "pending", "processing", "queued"
]);

export const FAILED_PAYMENT_STATUSES = new Set([
    "abandoned", "failed", "expired", "cancelled", "canceled"
]);

const normalizeStatus = value =>
    String(value || "").trim().toLowerCase();

const parseItems = value => {
    let items;

    try {
        items = typeof value === "string" ? JSON.parse(value) : value;
    } catch {
        items = null;
    }

    if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Order contains no valid inventory items.");
    }

    return items.map(item => {
        const productId = Number(item?.productId);
        const quantity = Number(item?.quantity);

        if (
            !Number.isInteger(productId) || productId <= 0 ||
            !Number.isInteger(quantity) || quantity <= 0
        ) {
            throw new Error("Order contains an invalid inventory item.");
        }

        return { productId, quantity };
    });
};

// The order state change, inventory updates, and movement records happen in one
// SQLite transaction. Claiming the pending order first makes overlapping cleanup,
// customer verification, and admin cancellation attempts idempotent.
export const releaseFailedPaymentReservation = ({
    orderId,
    paystackStatus,
    performedBy = "SYSTEM:AUTO_PAYMENT_CLEANUP"
}) => {
    const normalizedStatus = normalizeStatus(paystackStatus);

    if (!FAILED_PAYMENT_STATUSES.has(normalizedStatus)) {
        throw new Error(
            `Refusing to release inventory for non-terminal Paystack status: ${normalizedStatus || "unknown"}.`
        );
    }

    const release = db.transaction(() => {
        const order = db.prepare(`
            SELECT id, items, payment_status, order_status
            FROM orders
            WHERE id = ?
        `).get(orderId);

        if (!order) {
            throw new Error(`Order #${orderId} was not found.`);
        }

        if (order.payment_status === "paid") {
            return { released: false, reason: "paid" };
        }

        if (order.order_status === "cancelled") {
            return { released: false, reason: "already_cancelled" };
        }

        if (order.payment_status !== "pending" || order.order_status !== "pending") {
            return { released: false, reason: "state_changed" };
        }

        const items = parseItems(order.items);
        const claim = db.prepare(`
            UPDATE orders
            SET payment_status = ?, order_status = 'cancelled', updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
              AND payment_status = 'pending'
              AND order_status = 'pending'
        `).run(normalizedStatus, order.id);

        if (claim.changes !== 1) {
            return { released: false, reason: "state_changed" };
        }

        for (const item of items) {
            const inventoryUpdate = db.prepare(`
                UPDATE inventory
                SET quantity_available = quantity_available + ?,
                    reserved_quantity = reserved_quantity - ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE product_id = ?
                  AND reserved_quantity >= ?
            `).run(item.quantity, item.quantity, item.productId, item.quantity);

            if (inventoryUpdate.changes !== 1) {
                throw new Error(
                    `Unable to release ${item.quantity} reserved unit(s) of product #${item.productId} for Order #${order.id}.`
                );
            }

            db.prepare(`
                INSERT INTO inventory_movements (
                    product_id, movement_type, quantity, reference_id, note, performed_by
                ) VALUES (?, 'release', ?, ?, ?, ?)
            `).run(
                item.productId,
                item.quantity,
                order.id,
                `Paystack payment ${normalizedStatus}; released ${item.quantity} reserved unit(s) from Order #${order.id}`,
                performedBy
            );
        }

        return { released: true, reason: normalizedStatus };
    });

    return release();
};

const getCleanupCandidates = () => db.prepare(`
    SELECT id, payment_reference
    FROM orders
    WHERE payment_status = 'pending'
      AND order_status = 'pending'
      AND payment_reference IS NOT NULL
      AND TRIM(payment_reference) != ''
      AND datetime(COALESCE(updated_at, created_at)) <= datetime('now', ?)
    ORDER BY id ASC
`).all(`-${PENDING_AGE_MINUTES} minutes`);

let cleanupRunning = false;

export const cleanupPendingPayments = async () => {
    if (cleanupRunning) {
        return { skipped: true, checked: 0, released: 0 };
    }

    cleanupRunning = true;
    let checked = 0;
    let released = 0;

    try {
        for (const candidate of getCleanupCandidates()) {
            try {
                const response = await verifyPayment(candidate.payment_reference);
                const transaction = response?.data;
                const status = normalizeStatus(transaction?.status);
                checked += 1;

                if (
                    transaction?.reference &&
                    String(transaction.reference) !== String(candidate.payment_reference)
                ) {
                    console.error(`Paystack reference mismatch for Order #${candidate.id}.`);
                    continue;
                }

                if (status === "success") {
                    console.log(`Order #${candidate.id} payment succeeded; reservation retained for payment settlement.`);
                    continue;
                }

                if (ACTIVE_PAYMENT_STATUSES.has(status)) {
                    continue;
                }

                if (!FAILED_PAYMENT_STATUSES.has(status)) {
                    console.warn(`Order #${candidate.id} has unknown/non-cleanup Paystack status: ${status || "unknown"}.`);
                    continue;
                }

                const result = releaseFailedPaymentReservation({
                    orderId: candidate.id,
                    paystackStatus: status
                });

                if (result.released) {
                    released += 1;
                    console.log(`Order #${candidate.id} cancelled and reserved inventory released.`);
                }
            } catch (error) {
                // Verification and database errors fail safe: inventory stays reserved.
                console.error(`Pending payment cleanup failed for Order #${candidate.id}:`, error.message);
            }
        }

        if (checked > 0) {
            console.log(
                `Pending-payment cleanup checked ${checked} order(s); released ${released}.`
            );
        }

        return { skipped: false, checked, released };
    } finally {
        cleanupRunning = false;
    }
};

let cleanupTimer;

export const startPaymentCleanupWorker = () => {
    if (cleanupTimer) {
        return cleanupTimer;
    }

    void cleanupPendingPayments();
    cleanupTimer = setInterval(() => {
        void cleanupPendingPayments();
    }, CLEANUP_INTERVAL_MS);
    cleanupTimer.unref?.();

    console.log("Automatic pending-payment cleanup worker started");
    return cleanupTimer;
};
