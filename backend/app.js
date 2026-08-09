import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";

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

export default app;