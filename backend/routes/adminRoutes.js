import express from "express";

import {
    adminLogin
} from "../controllers/adminController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { getOperationsSummary, runAutomationNow } from "../controllers/operationsController.js";

const router = express.Router();
router.get("/operations", adminAuth, getOperationsSummary);
router.post("/operations/run", adminAuth, runAutomationNow);


// =====================================================
// ADMIN LOGIN
// POST /api/admin/login
// =====================================================

router.post(
    "/login",
    adminLogin
);


export default router;
