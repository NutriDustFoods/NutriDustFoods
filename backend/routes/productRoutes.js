import express from "express";

import {
    getProducts,
    getProductById,
    createProduct,
    deleteAllProducts
} from "../controllers/productController.js";

const router = express.Router();


// GET /api/products
// Get all products
router.get("/", getProducts);


// GET /api/products/:id
// Get one product
router.get("/:id", getProductById);


// POST /api/products
// Create a new product
router.post("/", createProduct);


// DELETE /api/products
// Delete all products
router.delete("/", deleteAllProducts);


export default router;