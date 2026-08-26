import express from "express";

import {
    getAdminOrders,
    getAdminOrderById,
    updateAdminOrderStatus
} from "../controllers/adminOrderController.js";

import { adminAuth, requirePermission } from "../middleware/adminAuth.js";


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
