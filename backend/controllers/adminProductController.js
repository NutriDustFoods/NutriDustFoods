import Product from "../models/Product.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";


// =====================================================
// FILE PATH CONFIGURATION
// =====================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// =====================================================
// DELETE LOCAL PRODUCT IMAGE
// =====================================================

async function deleteProductImage(imagePath) {

    try {

        // Nothing to delete
        if (!imagePath) {
            return;
        }


        // Only delete images managed by our uploads folder
        if (
            !imagePath.startsWith(
                "/uploads/products/"
            )
        ) {

            return;

        }


        // Remove the leading slash
        const relativePath =
            imagePath.replace(
                /^\/+/,
                ""
            );


        // Build the actual backend file path
        const filePath =
            path.resolve(
                __dirname,
                "..",
                relativePath
            );


        // Safety check:
        // Make sure the resolved file is actually
        // inside backend/uploads/products
        const uploadsDirectory =
            path.resolve(
                __dirname,
                "..",
                "uploads",
                "products"
            );


        if (
            !filePath.startsWith(
                uploadsDirectory +
                path.sep
            )
        ) {

            console.warn(
                "⚠️ Blocked unsafe image deletion:",
                imagePath
            );

            return;

        }


        await fs.unlink(
            filePath
        );


        console.log(
            "🗑️ Product image deleted:",
            filePath
        );


    } catch (error) {

        // If the file is already gone, that's okay.
        if (
            error.code ===
            "ENOENT"
        ) {

            console.log(
                "ℹ️ Product image was already missing."
            );

            return;

        }


        console.error(
            "⚠️ Unable to delete product image:",
            error
        );

    }

}


// =====================================================
// GET ALL PRODUCTS
// =====================================================

export const getAdminProducts = async (
    req,
    res
) => {

    try {

        const products =
            Product.getAll();


        res.status(200).json({

            success: true,

            products

        });


    } catch (error) {

        console.error(
            "❌ Admin products error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to load products."

        });

    }

};


// =====================================================
// CREATE PRODUCT
// =====================================================

export const createAdminProduct = async (
    req,
    res
) => {

    try {

        const {
            name,
            category,
            description,
            price,
            rating,
            badge
        } = req.body;


        // -------------------------------------------------
        // VALIDATE REQUIRED FIELDS
        // -------------------------------------------------

        if (
            !name ||
            !category ||
            price === undefined
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Name, category and price are required."

            });

        }


        // -------------------------------------------------
        // GET UPLOADED IMAGE
        // -------------------------------------------------

        const image =
            req.file
                ? `/uploads/products/${req.file.filename}`
                : "";


        // -------------------------------------------------
        // CREATE PRODUCT
        // -------------------------------------------------

        const product =
            Product.create({

                name,

                category,

                description:
                    description || "",

                image,

                price:
                    Number(price),

                rating:
                    rating ?? 5,

                badge:
                    badge || "NEW"

            });


        res.status(201).json({

            success: true,

            message:
                "Product created successfully.",

            product

        });


    } catch (error) {

        console.error(
            "❌ Create product error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to create product."

        });

    }

};


// =====================================================
// UPDATE PRODUCT
// =====================================================

export const updateAdminProduct = async (
    req,
    res
) => {

    try {

        const { id } =
            req.params;


        // -------------------------------------------------
        // FIND EXISTING PRODUCT
        // -------------------------------------------------

        const existing =
            Product.getById(id);


        if (!existing) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found."

            });

        }


        const {
            name,
            category,
            description,
            price,
            rating,
            badge
        } = req.body;


        // -------------------------------------------------
        // KEEP EXISTING IMAGE
        // -------------------------------------------------

        let image =
            existing.image || "";


        let oldImage =
            null;


        // -------------------------------------------------
        // NEW IMAGE UPLOADED
        // -------------------------------------------------

        if (req.file) {

            oldImage =
                existing.image || "";


            image =
                `/uploads/products/${req.file.filename}`;

        }


        // -------------------------------------------------
        // UPDATE PRODUCT
        // -------------------------------------------------

        const product =
            Product.update(

                id,

                {

                    name:
                        name ??
                        existing.name,

                    category:
                        category ??
                        existing.category,

                    description:
                        description ??
                        existing.description,

                    image,

                    price:
                        price !== undefined
                            ? Number(price)
                            : existing.price,

                    rating:
                        rating !== undefined
                            ? Number(rating)
                            : existing.rating,

                    badge:
                        badge ??
                        existing.badge

                }

            );


        // -------------------------------------------------
        // DELETE OLD IMAGE
        // -------------------------------------------------

        if (
            oldImage &&
            oldImage !== image
        ) {

            await deleteProductImage(
                oldImage
            );

        }


        res.status(200).json({

            success: true,

            message:
                "Product updated successfully.",

            product

        });


    } catch (error) {

        console.error(
            "❌ Update product error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to update product."

        });

    }

};


// =====================================================
// DELETE PRODUCT
// =====================================================

export const deleteAdminProduct = async (
    req,
    res
) => {

    try {

        const { id } =
            req.params;


        // -------------------------------------------------
        // FIND PRODUCT
        // -------------------------------------------------

        const existing =
            Product.getById(id);


        if (!existing) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found."

            });

        }


        // -------------------------------------------------
        // SAVE IMAGE PATH
        // -------------------------------------------------

        const image =
            existing.image || "";


        // -------------------------------------------------
        // DELETE PRODUCT FROM DATABASE
        // -------------------------------------------------

        Product.deleteById(id);


        // -------------------------------------------------
        // DELETE PRODUCT IMAGE
        // -------------------------------------------------

        if (image) {

            await deleteProductImage(
                image
            );

        }


        res.status(200).json({

            success: true,

            message:
                "Product deleted successfully."

        });


    } catch (error) {

        console.error(
            "❌ Delete product error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to delete product."

        });

    }

};