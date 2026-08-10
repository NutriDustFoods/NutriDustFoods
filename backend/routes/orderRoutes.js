import express from "express";

import {
    createOrder,
    getOrders
} from "../controllers/orderController.js";

const router = express.Router();


// Create a new order
router.post("/", createOrder);


// Get all orders
router.get("/", getOrders);


export default router;