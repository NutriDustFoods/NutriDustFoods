import db from "../config/sqlite.js";
import { sendEmail } from "./emailService.js";

db.exec(`
    CREATE TABLE IF NOT EXISTS admin_alerts (
        event_key TEXT PRIMARY KEY,
        alert_type TEXT NOT NULL,
        recipient TEXT NOT NULL,
        sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

const recipient = () => String(
    process.env.ADMIN_NOTIFICATION_EMAIL || process.env.EMAIL_REPLY_TO || "support@nutridustfoods.com"
).trim();

const money = value => `₦${Number(value || 0).toLocaleString("en-NG")}`;
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;"
})[character]);

const sendOnce = async ({ eventKey, alertType, subject, text, html }) => {
    const to = recipient();
    if (!to) return false;
    const claim = db.prepare("INSERT OR IGNORE INTO admin_alerts(event_key,alert_type,recipient) VALUES(?,?,?)").run(eventKey, alertType, to);
    if (!claim.changes) return false;
    try {
        const sent = await sendEmail({ to, subject, text, html });
        if (!sent) db.prepare("DELETE FROM admin_alerts WHERE event_key=?").run(eventKey);
        return sent;
    } catch (error) {
        db.prepare("DELETE FROM admin_alerts WHERE event_key=?").run(eventKey);
        console.error(`Admin ${alertType} alert failed:`, error.message);
        return false;
    }
};

export const alertNewRiderApplication = application => sendOnce({
    eventKey: `rider_application:${application.id}`,
    alertType: "rider_application",
    subject: `New rider application — ${application.firstName} ${application.surname}`,
    text: `A new rider has applied.\n\nName: ${application.firstName} ${application.surname}\nPhone: ${application.phone}\nEmail: ${application.email}\nVehicle: ${application.vehicleType}\nPlate number: ${application.plateNumber}\nTracking code: ${application.trackingCode}\n\nOpen the NutriDust admin dashboard to review the documents.`,
    html: `<h2>New rider application</h2><p><strong>${escapeHtml(application.firstName)} ${escapeHtml(application.surname)}</strong> has applied to become a NutriDust rider.</p><ul><li>Phone: ${escapeHtml(application.phone)}</li><li>Email: ${escapeHtml(application.email)}</li><li>Vehicle: ${escapeHtml(application.vehicleType)}</li><li>Plate number: ${escapeHtml(application.plateNumber)}</li><li>Tracking code: ${escapeHtml(application.trackingCode)}</li></ul><p>Open the NutriDust admin dashboard to review the application and documents.</p>`
});

export const alertPaidOrder = order => sendOnce({
    eventKey: `paid_order:${order.id}`,
    alertType: "paid_order",
    subject: `New paid order #${order.id} — ${money(order.total)}`,
    text: `A customer payment has been confirmed.\n\nOrder: #${order.id}\nCustomer: ${order.customerName}\nPhone: ${order.customerPhone}\nTotal: ${money(order.total)}\nDelivery address: ${order.deliveryAddress || "Pickup order"}\n\nOpen the NutriDust admin dashboard to process the order.`,
    html: `<h2>New paid order #${escapeHtml(order.id)}</h2><p>A customer payment has been confirmed.</p><ul><li>Customer: ${escapeHtml(order.customerName)}</li><li>Phone: ${escapeHtml(order.customerPhone)}</li><li>Total: ${escapeHtml(money(order.total))}</li><li>Delivery address: ${escapeHtml(order.deliveryAddress || "Pickup order")}</li></ul><p>Open the NutriDust admin dashboard to process the order.</p>`
});
