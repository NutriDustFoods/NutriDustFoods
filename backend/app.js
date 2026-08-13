import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminProductRoutes from "./routes/adminProductRoutes.js";


// =====================================================
// ES MODULE PATH SETUP
// =====================================================

const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);


// =====================================================
// CREATE EXPRESS APP
// =====================================================

const app = express();


// =====================================================
// CORS
// =====================================================

app.use(
    cors()
);


// =====================================================
// JSON BODY PARSER
// =====================================================

app.use(
    express.json()
);


// =====================================================
// STATIC PRODUCT UPLOADS
// =====================================================
//
// Physical location:
//
// backend/
// └── uploads/
//     └── products/
//
// Browser URL:
//
// http://localhost:5000/uploads/products/filename.png
//
// =====================================================

const uploadsPath =
    path.join(
        __dirname,
        "uploads"
    );


app.use(
    "/uploads",
    express.static(
        uploadsPath
    )
);


// =====================================================
// ADMIN ORDER ROUTES
// =====================================================

app.use(
    "/api/admin/orders",
    adminOrderRoutes
);


// =====================================================
// ADMIN GENERAL ROUTES
// =====================================================

app.use(
    "/api/admin",
    adminRoutes
);


// =====================================================
// ADMIN PRODUCT ROUTES
// =====================================================

app.use(
    "/api/admin/products",
    adminProductRoutes
);


// =====================================================
// HOME ROUTE
// =====================================================

app.get(
    "/",
    (req, res) => {

        res.json({

            success: true,

            message:
                "NutriDust API Running"

        });

    }
);


// =====================================================
// CUSTOMER PRODUCT ROUTES
// =====================================================

app.use(
    "/api/products",
    productRoutes
);


// =====================================================
// CUSTOMER ORDER ROUTES
// =====================================================

app.use(
    "/api/orders",
    orderRoutes
);


// =====================================================
// PAYMENT ROUTES
// =====================================================

app.use(
    "/api/payments",
    paymentRoutes
);


// =====================================================
// 404 HANDLER
// =====================================================

app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                `Route not found: ${req.method} ${req.originalUrl}`

        });

    }
);


// =====================================================
// EXPORT APP
// =====================================================

export default app;