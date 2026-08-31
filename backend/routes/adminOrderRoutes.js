import express from "express";

import {
    getAdminOrders,
    getAdminOrderById,
    updateAdminOrderStatus
} from "../controllers/adminOrderController.js";

import { adminAuth, requirePermission } from "../middleware/adminAuth.js";
import { getAdminLiveTracking } from "../controllers/liveTrackingController.js";
import { exportOrdersExcel, exportOrdersPdf } from "../controllers/orderReportController.js";


const router = express.Router();


// =====================================================
// ADMIN AUTHENTICATION
// All routes below require a valid JWT
// =====================================================

router.use(adminAuth);


// =====================================================
// GET ALL ORDERS
// GET /api/admin/orders
// =====================================================

router.get(
    "/",
    requirePermission("orders.view"),
    getAdminOrders
);

router.get("/reports/excel", requirePermission("orders.view"), exportOrdersExcel);
router.get("/reports/pdf", requirePermission("orders.view"), exportOrdersPdf);

router.get(
    "/:id/live-location",
    requirePermission("orders.view"),
    getAdminLiveTracking
);


// =====================================================
// GET SINGLE ORDER
// GET /api/admin/orders/:id
// =====================================================

router.get(
    "/:id",
    requirePermission("orders.view"),
    getAdminOrderById
);


// =====================================================
// UPDATE ORDER STATUS
// PATCH /api/admin/orders/:id/status
// =====================================================

router.patch(
    "/:id/status",
    requirePermission("orders.update"),
    updateAdminOrderStatus
);


export default router;
