import Product from "../models/Product.js";

// Get all products
export const getProducts = async (req, res) => {
    try {
        const products = Product.getAll();

        res.status(200).json(products);

    } catch (error) {

        console.error("❌ Error getting products:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get one product
export const getProductById = async (req, res) => {
    try {

        const product = Product.getById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json(product);

    } catch (error) {

        console.error("❌ Error getting product:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Create product
export const createProduct = async (req, res) => {
    try {

        const product = Product.create(req.body);

        res.status(201).json(product);

    } catch (error) {

        console.error("❌ Error creating product:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Delete all products
export const deleteAllProducts = async (req, res) => {
    try {

        Product.deleteAll();

        res.status(200).json({
            success: true,
            message: "All products deleted"
        });

    } catch (error) {

        console.error("❌ Error deleting products:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};