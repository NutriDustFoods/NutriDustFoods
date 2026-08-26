import express from "express";

import {
    createOrder,
    getOrders,
    getMyOrders,
    getOrderById,
    trackOrder
} from "../controllers/orderController.js";

import {
    authenticateCustomer
} from "../middleware/authMiddleware.js";
import { calculateDeliveryQuote } from "../services/deliveryPricingService.js";


const router =
    express.Router();

router.post("/delivery-quote", async (req, res) => {
    const address = String(req.body?.deliveryAddress || "").trim();
    if (address.length < 5) return res.status(400).json({ success:false, message:"Enter a complete delivery address." });
    try { return res.json({ success:true, quote:await calculateDeliveryQuote(address) }); }
    catch (error) { return res.status(error.status || 500).json({ success:false, message:error.message || "Unable to calculate delivery." }); }
});


// =====================================================
// CREATE NEW ORDER
// POST /api/orders
// =====================================================

router.post(
    "/",
    authenticateCustomer,
    createOrder
);


// =====================================================
// GET MY ORDERS
// GET /api/orders/my
// =====================================================
//
// IMPORTANT:
// This MUST appear before /:id.
//
// =====================================================

router.get(
    "/my",
    authenticateCustomer,
    getMyOrders
);


// =====================================================
// GET ALL ORDERS
// GET /api/orders
// =====================================================
//
// TEMPORARY compatibility endpoint.
//
// Admin should use:
// GET /api/admin/orders
//
// =====================================================

router.get(
    "/",
    getOrders
);


// =====================================================
// TRACK ORDER
// GET /api/orders/:id/track
// =====================================================
//
// Legacy phone-based tracking.
//
// =====================================================

router.get(
    "/:id/track",
    trackOrder
);


// =====================================================
// GET SINGLE CUSTOMER ORDER
// GET /api/orders/:id
// =====================================================

router.get(
    "/:id",
    authenticateCustomer,
    getOrderById
);


export default router;
