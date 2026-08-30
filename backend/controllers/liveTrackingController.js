import db from "../config/sqlite.js";
import { getDeliverySettings } from "../services/deliveryPricingService.js";

const ACTIVE_STATUSES = new Set(["assigned", "accepted", "picked_up", "out_for_delivery"]);
const CUSTOMER_VISIBLE_STATUSES = new Set(["picked_up", "out_for_delivery"]);

const getTrackingRow = orderId => db.prepare(`
    SELECT
        o.id AS order_id,
        o.customer_id,
        o.order_status,
        o.delivery_address,
        o.fulfillment_type,
        d.id AS delivery_id,
        d.delivery_status,
        d.assigned_at,
        d.accepted_at,
        d.picked_up_at,
        d.out_for_delivery_at,
        d.delivered_at,
        r.id AS rider_id,
        r.full_name AS rider_name,
        r.vehicle_type,
        r.vehicle_registration_number,
        rl.latitude,
        rl.longitude,
        rl.accuracy,
        rl.created_at AS location_updated_at
    FROM orders o
    LEFT JOIN deliveries d ON d.order_id = o.id
    LEFT JOIN riders r ON r.id = d.rider_id
    LEFT JOIN rider_locations rl ON rl.id = (
        SELECT id
        FROM rider_locations
        WHERE delivery_id = d.id
        ORDER BY id DESC
        LIMIT 1
    )
    WHERE o.id = ?
`).get(orderId);

const phaseLabel = status => ({
    assigned: "Rider assigned — travelling to collect your order",
    accepted: "Rider accepted — travelling to the pickup location",
    picked_up: "Order collected by rider",
    out_for_delivery: "Rider is delivering your order",
    delivered: "Order delivered",
    failed: "Delivery could not be completed"
}[status] || "Waiting for rider assignment");

const parseUtc = value => value ? Date.parse(`${String(value).replace(" ", "T")}Z`) : NaN;

const serializeTracking = (row, audience) => {
    const settings = getDeliverySettings();
    const active = ACTIVE_STATUSES.has(row.delivery_status);
    const visible = audience === "admin" ? active : CUSTOMER_VISIBLE_STATUSES.has(row.delivery_status);
    const updatedMs = parseUtc(row.location_updated_at);
    const locationFresh = Number.isFinite(updatedMs) && Date.now() - updatedMs <= 2 * 60 * 1000;
    const hasLocation = Number.isFinite(Number(row.latitude)) && Number.isFinite(Number(row.longitude));

    return {
        orderId: row.order_id,
        deliveryId: row.delivery_id || null,
        deliveryStatus: row.delivery_status || "waiting_assignment",
        orderStatus: row.order_status,
        phase: phaseLabel(row.delivery_status),
        active,
        trackingVisible: visible,
        trackingAvailable: Boolean(visible && hasLocation),
        locationFresh,
        rider: row.rider_id ? {
            id: audience === "admin" ? row.rider_id : undefined,
            name: row.rider_name,
            vehicleType: row.vehicle_type,
            vehicleRegistrationNumber: row.vehicle_registration_number
        } : null,
        location: visible && hasLocation ? {
            latitude: Number(row.latitude),
            longitude: Number(row.longitude),
            accuracy: Number(row.accuracy || 0) || null,
            updatedAt: row.location_updated_at
        } : null,
        pickup: audience === "admin" && Number.isFinite(settings.shopLatitude) && Number.isFinite(settings.shopLongitude) ? {
            address: settings.shopAddress || null,
            latitude: settings.shopLatitude,
            longitude: settings.shopLongitude
        } : null,
        deliveryAddress: audience === "admin" ? row.delivery_address : undefined
    };
};

const validOrderId = value => Number.isInteger(Number(value)) && Number(value) > 0;

export const getCustomerLiveTracking = (req, res) => {
    const orderId = Number(req.params.id);
    if (!validOrderId(orderId)) return res.status(400).json({ success:false, message:"Provide a valid order number." });

    const row = getTrackingRow(orderId);
    if (!row || Number(row.customer_id) !== Number(req.customer.id)) {
        return res.status(404).json({ success:false, message:"Order not found." });
    }
    if (row.fulfillment_type === "pickup") {
        return res.status(409).json({ success:false, message:"Customer pickup orders do not have rider tracking." });
    }
    return res.json({ success:true, tracking:serializeTracking(row, "customer") });
};

export const getAdminLiveTracking = (req, res) => {
    const orderId = Number(req.params.id);
    if (!validOrderId(orderId)) return res.status(400).json({ success:false, message:"Provide a valid order number." });

    const row = getTrackingRow(orderId);
    if (!row) return res.status(404).json({ success:false, message:"Order not found." });
    if (row.fulfillment_type === "pickup") {
        return res.status(409).json({ success:false, message:"Customer pickup orders do not have a rider." });
    }
    return res.json({ success:true, tracking:serializeTracking(row, "admin") });
};
