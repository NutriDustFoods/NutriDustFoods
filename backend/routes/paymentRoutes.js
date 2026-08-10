import express from "express";

import {
    initializeOrderPayment
} from "../controllers/paymentController.js";

const router = express.Router();


// Initialize payment for an order
router.post("/initialize", initializeOrderPayment);


export default router;