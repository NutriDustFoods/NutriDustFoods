import jwt from "jsonwebtoken";
import db from "../config/sqlite.js";

const getJwtSecret = () => {
    if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
        throw new Error("JWT_SECRET is required in production.");
    }
    return process.env.JWT_SECRET || "nutridust-development-secret-change-this";
};

export const riderAuth = (req, res, next) => {
    try {
        const header = req.headers.authorization || "";
        if (!header.startsWith("Bearer ")) return res.status(401).json({ success: false, message: "Rider authentication required." });
        const decoded = jwt.verify(header.slice(7), getJwtSecret());
        if (decoded.role !== "rider" || !Number.isInteger(Number(decoded.riderId))) throw new Error("Invalid rider token");
        const rider = db.prepare("SELECT * FROM riders WHERE id = ? AND account_status = 'active'").get(Number(decoded.riderId));
        if (!rider) return res.status(401).json({ success: false, message: "Rider account is inactive or missing." });
        req.rider = rider;
        next();
    } catch {
        return res.status(401).json({ success: false, message: "Invalid or expired rider token." });
    }
};
