import express from "express";

import {
    signup,
    login,
    getMe
} from "../controllers/authController.js";

import {
    authenticateCustomer
} from "../middleware/authMiddleware.js";


const router =
    express.Router();


// =====================================================
// CUSTOMER SIGNUP
// =====================================================

router.post(
    "/signup",
    signup
);


// =====================================================
// CUSTOMER LOGIN
// =====================================================

router.post(
    "/login",
    login
);


// =====================================================
// CURRENT CUSTOMER
// =====================================================

router.get(
    "/me",
    authenticateCustomer,
    getMe
);


export default router;