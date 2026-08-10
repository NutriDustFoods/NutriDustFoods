import dotenv from "dotenv";
import app from "./app.js";
import "./config/sqlite.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 NutriDust API running on port ${PORT}`);
});