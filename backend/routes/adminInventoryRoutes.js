import express from "express";

import {
    getInventory,
    addProduction,
    adjustInventory,
    getInventoryHistory
} from "../controllers/adminInventoryController.js";
import { exportInventoryExcel, exportInventoryPdf } from "../controllers/inventoryReportController.js";

import { adminAuth } from "../middleware/adminAuth.js";


const router = express.Router();

router.get("/reports/excel", adminAuth, exportInventoryExcel);
router.get("/reports/pdf", adminAuth, exportInventoryPdf);


// =====================================================
// GET ALL INVENTORY
// =====================================================

router.get(
    "/",
    adminAuth,
    getInventory
);


// =====================================================
// ADD PRODUCTION
// =====================================================

router.post(
    "/:productId/production",
    adminAuth,
    addProduction
);


// =====================================================
// ADJUST INVENTORY
// =====================================================

router.patch(
    "/:productId/adjust",
    adminAuth,
    adjustInventory
);


// =====================================================
// INVENTORY HISTORY
// =====================================================

router.get(
    "/:productId/history",
    adminAuth,
    getInventoryHistory
);


export default router;
