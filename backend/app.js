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
import adminInventoryRoutes from "./routes/adminInventoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import riderRoutes from "./routes/riderRoutes.js";
import adminRiderRoutes from "./routes/adminRiderRoutes.js";
import adminStaffRoutes from "./routes/adminStaffRoutes.js";

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

app.use(cors({
    origin: process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.split(",").map(value => value.trim())
        : ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost", "https://localhost", "capacitor://localhost"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


// =====================================================
// JSON BODY PARSER
// =====================================================

app.use(express.json({ limit: "250kb" }));
app.disable("x-powered-by");
app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
});


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
// ADMIN INVENTORY ROUTES
// =====================================================

app.use(
    "/api/admin/inventory",
    adminInventoryRoutes
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
// CUSTOMER AUTH ROUTES
// =====================================================

app.use(
    "/api/auth",
    authRoutes
);

app.use("/api/rider", riderRoutes);
app.use("/api/admin/riders", adminRiderRoutes);
app.use("/api/admin/staff", adminStaffRoutes);



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
