import express from "express";

import {
    initializeOrderPayment,
    verifyOrderPayment
} from "../controllers/paymentController.js";

const router = express.Router();


// =====================================================
// INITIALIZE PAYMENT
// =====================================================

router.post(
    "/initialize",
    initializeOrderPayment
);


// =====================================================
// VERIFY PAYMENT
// =====================================================

router.get(
    "/verify/:reference",
    verifyOrderPayment
);


export default router;