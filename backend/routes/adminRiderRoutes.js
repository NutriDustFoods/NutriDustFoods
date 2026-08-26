import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import { getAdminRiders, createAdminRider, updateAdminRider, assignDelivery } from "../controllers/riderController.js";
import { listWithdrawals, processWithdrawal } from "../controllers/riderCommerceController.js";
import db from "../config/sqlite.js";

const router = express.Router();
router.use(adminAuth);
router.get("/", getAdminRiders);
router.post("/", createAdminRider);
router.patch("/:id/status", updateAdminRider);
router.post("/assign/:orderId", (req, res, next) => {
    const order = db.prepare("SELECT fulfillment_type FROM orders WHERE id=?").get(Number(req.params.orderId));
    if (order?.fulfillment_type === "pickup") return res.status(409).json({ success:false, message:"Customer pickup orders do not require a rider." });
    next();
}, assignDelivery);
router.get("/withdrawals", listWithdrawals);
router.patch("/withdrawals/:id", processWithdrawal);
export default router;
