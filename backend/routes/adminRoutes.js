import express from "express";

import {
    adminLogin,
    getAdminSession
} from "../controllers/adminController.js";
import { adminAuth, requirePermission } from "../middleware/adminAuth.js";
import { getOperationsSummary, runAutomationNow } from "../controllers/operationsController.js";

const router = express.Router();
router.get("/session", adminAuth, getAdminSession);
router.get("/operations", adminAuth, requirePermission("operations.view"), getOperationsSummary);
router.post("/operations/run", adminAuth, requirePermission("operations.run"), runAutomationNow);


// =====================================================
// ADMIN LOGIN
// POST /api/admin/login
// =====================================================

router.post(
    "/login",
    adminLogin
);


export default router;
