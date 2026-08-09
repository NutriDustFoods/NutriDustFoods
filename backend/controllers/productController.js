import Product from "../models/Product.js";

// Get all products
export const getProducts = async (req, res) => {

    try {

        const products = await Product.find();

        res.status(200).json(products);

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// Add a new product
export const createProduct = async (req, res) => {

    try {

        const product = await Product.create(req.body);

        res.status(201).json(product);

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};