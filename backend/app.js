import express from "express";
import cors from "cors";

import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());


// Home Route
app.get("/", (req, res) => {

    res.json({

        message: "NutriDust API Running"

    });

});


// Product Routes
app.use("/api/products", productRoutes);


// Order Routes
app.use("/api/orders", orderRoutes);


// Payment Routes
app.use("/api/payments", paymentRoutes);


export default app;