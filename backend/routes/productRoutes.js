import express from "express";

import {
    getProducts,
    getProductById
} from "../controllers/productController.js";


const router =
    express.Router();


// =====================================================
// GET ALL PRODUCTS
// GET /api/products
// =====================================================

router.get(
    "/",
    getProducts
);


// =====================================================
// GET SINGLE PRODUCT
// GET /api/products/:id
// =====================================================

router.get(
    "/:id",
    getProductById
);


export default router;