import express from "express";
import { adminAuth, requirePermission } from "../middleware/adminAuth.js";
import { getAdminRiders, createAdminRider, updateAdminRider, assignDelivery } from "../controllers/riderController.js";
import { listWithdrawals, processWithdrawal } from "../controllers/riderCommerceController.js";
import db from "../config/sqlite.js";
import { listRiderApplications,getRiderApplication,streamLocalRiderDocument,recordRiderInspection,approveRiderApplication,rejectRiderApplication } from "../controllers/riderApplicationController.js";

const router = express.Router();
router.use(adminAuth);
router.get("/applications",requirePermission("riders.manage"),listRiderApplications);
router.get("/applications/:id",requirePermission("riders.manage"),getRiderApplication);
router.get("/applications/:id/document/:kind",requirePermission("riders.manage"),streamLocalRiderDocument);
router.patch("/applications/:id/inspection",requirePermission("riders.manage"),recordRiderInspection);
router.post("/applications/:id/approve",requirePermission("riders.manage"),approveRiderApplication);
router.post("/applications/:id/reject",requirePermission("riders.manage"),rejectRiderApplication);
router.get("/", requirePermission("riders.view"), getAdminRiders);
router.post("/", requirePermission("riders.manage"), createAdminRider);
router.patch("/:id/status", requirePermission("riders.manage"), updateAdminRider);
router.post("/assign/:orderId", requirePermission("deliveries.assign"), (req, res, next) => {
    const order = db.prepare("SELECT fulfillment_type FROM orders WHERE id=?").get(Number(req.params.orderId));
    if (order?.fulfillment_type === "pickup") return res.status(409).json({ success:false, message:"Customer pickup orders do not require a rider." });
    next();
}, assignDelivery);
router.get("/withdrawals", requirePermission("withdrawals.manage"), listWithdrawals);
router.patch("/withdrawals/:id", requirePermission("withdrawals.manage"), processWithdrawal);
export default router;
