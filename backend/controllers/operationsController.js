import db from "../config/sqlite.js";
import { runOperationsAutomation } from "../services/operationsAutomationService.js";

export const getOperationsSummary = (req,res) => {
    const summary = {
        lowStock: db.prepare("SELECT count(*) AS count FROM inventory WHERE quantity_available<=low_stock_threshold").get().count,
        outOfStock: db.prepare("SELECT count(*) AS count FROM inventory WHERE quantity_available<=0").get().count,
        pendingPayments: db.prepare("SELECT count(*) AS count FROM orders WHERE payment_status='pending'").get().count,
        deliveryOrdersAwaitingRider: db.prepare(`SELECT count(*) AS count FROM orders o LEFT JOIN deliveries d ON d.order_id=o.id WHERE o.fulfillment_type='delivery' AND o.payment_status='paid' AND o.order_status IN ('pending','processing') AND d.id IS NULL`).get().count,
        pickupsReady: db.prepare("SELECT count(*) AS count FROM orders WHERE fulfillment_type='pickup' AND order_status='ready_for_pickup'").get().count,
        pendingWithdrawals: db.prepare("SELECT count(*) AS count FROM rider_withdrawals WHERE status='pending'").get().count,
        activeDeliveries: db.prepare("SELECT count(*) AS count FROM deliveries WHERE delivery_status IN ('assigned','accepted','picked_up','out_for_delivery')").get().count,
        availableRiders: db.prepare("SELECT count(*) AS count FROM riders WHERE account_status='active' AND availability_status='available'").get().count
    };
    return res.json({success:true,summary,lastCheckedAt:new Date().toISOString()});
};
export const runAutomationNow = (req,res) => res.json({success:true,result:runOperationsAutomation()});
