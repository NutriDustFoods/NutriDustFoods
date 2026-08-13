import express from "express";
import multer from "multer";
import path from "path";

import {
    getAdminProducts,
    createAdminProduct,
    updateAdminProduct,
    deleteAdminProduct
} from "../controllers/adminProductController.js";

import { adminAuth } from "../middleware/adminAuth.js";


const router = express.Router();


// =====================================================
// MULTER STORAGE
// =====================================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(
            null,
            "uploads/products"
        );

    },

    filename: (req, file, cb) => {

        const ext =
            path.extname(
                file.originalname
            ).toLowerCase();


        const name =
            Date.now() +
            "-" +
            Math.round(
                Math.random() * 1E9
            ) +
            ext;


        cb(
            null,
            name
        );

    }

});


// =====================================================
// IMAGE FILE VALIDATION
// =====================================================

const fileFilter = (req, file, cb) => {

    const allowedMimeTypes = [

        "image/jpeg",
        "image/png",
        "image/webp"

    ];


    const allowedExtensions = [

        ".jpg",
        ".jpeg",
        ".png",
        ".webp"

    ];


    const extension =
        path.extname(
            file.originalname
        ).toLowerCase();


    const mimeTypeAllowed =
        allowedMimeTypes.includes(
            file.mimetype
        );


    const extensionAllowed =
        allowedExtensions.includes(
            extension
        );


    if (
        mimeTypeAllowed &&
        extensionAllowed
    ) {

        cb(
            null,
            true
        );

    } else {

        const error =
            new Error(
                "Invalid image type. Only JPG, JPEG, PNG and WebP images are allowed."
            );


        error.code =
            "INVALID_IMAGE_TYPE";


        cb(
            error,
            false
        );

    }

};


// =====================================================
// MULTER UPLOAD CONFIGURATION
// =====================================================

const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize:
            5 * 1024 * 1024

    }

});


// =====================================================
// UPLOAD ERROR HANDLER
// =====================================================

const uploadImage = (req, res, next) => {

    upload.single("image")(
        req,
        res,
        (error) => {

            if (!error) {

                return next();

            }


            console.error(
                "❌ Product image upload error:",
                error
            );


            if (
                error.code ===
                "LIMIT_FILE_SIZE"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Image is too large. Maximum image size is 5 MB."

                });

            }


            if (
                error.code ===
                "INVALID_IMAGE_TYPE"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid image type. Only JPG, JPEG, PNG and WebP images are allowed."

                });

            }


            return res.status(400).json({

                success: false,

                message:
                    error.message ||
                    "Unable to upload image."

            });

        }

    );

};


// =====================================================
// ADMIN PRODUCT ROUTES
// =====================================================


// GET /api/admin/products
// Get all products

router.get(

    "/",

    adminAuth,

    getAdminProducts

);


// =====================================================
// CREATE PRODUCT
// =====================================================


// POST /api/admin/products

router.post(

    "/",

    adminAuth,

    uploadImage,

    createAdminProduct

);


// =====================================================
// UPDATE PRODUCT
// =====================================================


// PUT /api/admin/products/:id

router.put(

    "/:id",

    adminAuth,

    uploadImage,

    updateAdminProduct

);


// =====================================================
// DELETE PRODUCT
// =====================================================


// DELETE /api/admin/products/:id

router.delete(

    "/:id",

    adminAuth,

    deleteAdminProduct

);


// =====================================================
// EXPORT
// =====================================================

export default router;