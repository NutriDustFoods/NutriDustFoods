import express from "express";

import {
    adminLogin
} from "../controllers/adminController.js";

const router = express.Router();


// =====================================================
// ADMIN LOGIN
// POST /api/admin/login
// =====================================================

router.post(
    "/login",
    adminLogin
);


export default router;