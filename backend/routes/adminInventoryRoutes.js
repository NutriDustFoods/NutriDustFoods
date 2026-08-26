import express from "express";

import {
    getInventory,
    addProduction,
    adjustInventory,
    getInventoryHistory
} from "../controllers/adminInventoryController.js";
import { exportInventoryExcel, exportInventoryPdf } from "../controllers/inventoryReportController.js";

import { adminAuth, requirePermission } from "../middleware/adminAuth.js";


const router = express.Router();

router.get("/reports/excel", adminAuth, requirePermission("inventory.view"), exportInventoryExcel);
router.get("/reports/pdf", adminAuth, requirePermission("inventory.view"), exportInventoryPdf);


// =====================================================
// GET ALL INVENTORY
// =====================================================

router.get(
    "/",
    adminAuth,
    requirePermission("inventory.view"),
    getInventory
);


// =====================================================
// ADD PRODUCTION
// =====================================================

router.post(
    "/:productId/production",
    adminAuth,
    requirePermission("inventory.manage"),
    addProduction
);


// =====================================================
// ADJUST INVENTORY
// =====================================================

router.patch(
    "/:productId/adjust",
    adminAuth,
    requirePermission("inventory.manage"),
    adjustInventory
);


// =====================================================
// INVENTORY HISTORY
// =====================================================

router.get(
    "/:productId/history",
    adminAuth,
    requirePermission("inventory.view"),
    getInventoryHistory
);


export default router;
