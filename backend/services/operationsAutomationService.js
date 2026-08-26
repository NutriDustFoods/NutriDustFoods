import db from "../config/sqlite.js";

const intervalMs = Math.max(1, Number(process.env.OPERATIONS_AUTOMATION_INTERVAL_MINUTES || 1)) * 60 * 1000;
let running = false;

export const runOperationsAutomation = () => {
    if (running) return { skipped:true, assigned:0, expiredSubscriptions:0 };
    running = true;
    try {
        const expiredSubscriptions = db.prepare("UPDATE rider_subscriptions SET status='expired' WHERE status='active' AND datetime(expires_at)<=datetime('now')").run().changes;
        let assigned = 0;
        // Rider assignment is an explicit admin action unless a deployment
        // deliberately opts into automatic dispatching.
        if (String(process.env.AUTO_ASSIGN_RIDERS || "false").toLowerCase() === "true") {
            const orders = db.prepare(`SELECT o.* FROM orders o LEFT JOIN deliveries d ON d.order_id=o.id
                WHERE o.fulfillment_type='delivery' AND o.payment_status='paid'
                AND o.order_status IN ('pending','processing') AND d.id IS NULL ORDER BY o.id`).all();
            for (const order of orders) {
                const rider = db.prepare(`SELECT r.*,(SELECT count(*) FROM deliveries d WHERE d.rider_id=r.id AND d.delivery_status IN ('assigned','accepted','picked_up','out_for_delivery')) AS activeJobs
                    FROM riders r WHERE r.account_status='active' AND r.availability_status='available' ORDER BY activeJobs ASC,r.total_deliveries ASC,r.id ASC LIMIT 1`).get();
                if (!rider) break;
                try {
                    db.transaction(() => {
                        const fee = Math.max(0, Number(order.delivery_fee || 0));
                        const result = db.prepare("INSERT INTO deliveries(order_id,rider_id,customer_id,delivery_status,delivery_address,customer_name,customer_phone,assigned_at,delivery_fee) VALUES(?,?,?,'assigned',?,?,?,CURRENT_TIMESTAMP,?)").run(order.id,rider.id,order.customer_id,order.delivery_address,order.customer_name,order.customer_phone,fee);
                        const deliveryId = Number(result.lastInsertRowid);
                        db.prepare("INSERT INTO delivery_events(delivery_id,order_id,actor_type,actor_id,from_status,to_status,note) VALUES(?,?,'system',NULL,NULL,'assigned',?)").run(deliveryId,order.id,`Automatically assigned to ${rider.full_name}`);
                        db.prepare("INSERT INTO rider_notifications(rider_id,title,message,type,delivery_id) VALUES(?,'New delivery assigned',?,'assignment',?)").run(rider.id,`Order #${order.id} was automatically assigned to you.`,deliveryId);
                        db.prepare("UPDATE orders SET order_status='processing',updated_at=CURRENT_TIMESTAMP WHERE id=?").run(order.id);
                    })();
                    assigned += 1;
                } catch (error) {
                    if (!String(error.message).includes("UNIQUE")) console.error(`Auto-assignment failed for Order #${order.id}:`,error.message);
                }
            }
        }
        return { skipped:false, assigned, expiredSubscriptions };
    } finally { running = false; }
};

let timer;
export const startOperationsAutomationWorker = () => {
    if (timer) return timer;
    runOperationsAutomation();
    timer = setInterval(runOperationsAutomation, intervalMs);
    timer.unref?.();
    console.log("Automatic operations worker started");
    return timer;
};
