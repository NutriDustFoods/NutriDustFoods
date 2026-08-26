import express from "express";

import {
    initializeOrderPayment,
    verifyOrderPayment
} from "../controllers/paymentController.js";

import {
    authenticateCustomer
} from "../middleware/authMiddleware.js";


const router =
    express.Router();


// =====================================================
// CUSTOMER AUTHENTICATION
// =====================================================
//
// Both payment endpoints require the customer to be
// logged in.
//
// =====================================================

router.use(
    authenticateCustomer
);


// =====================================================
// INITIALIZE PAYMENT
// POST /api/payments/initialize
// =====================================================

router.post(
    "/initialize",
    initializeOrderPayment
);


// =====================================================
// VERIFY PAYMENT
// GET /api/payments/verify/:reference
// =====================================================

router.get(
    "/verify/:reference",
    verifyOrderPayment
);


// =====================================================
// EXPORT
// =====================================================

export default router;