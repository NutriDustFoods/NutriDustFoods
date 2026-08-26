import jwt from "jsonwebtoken";
import db from "../config/sqlite.js";
import { hasPermission, parsePermissions } from "../auth/adminPermissions.js";


// =====================================================
// ADMIN AUTHENTICATION MIDDLEWARE
// =====================================================

export const adminAuth = (req, res, next) => {

    try {

        const authHeader =
            req.headers.authorization;


        // -------------------------------------------------
        // Check Authorization header
        // -------------------------------------------------

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required."

            });

        }


        // -------------------------------------------------
        // Get token
        // -------------------------------------------------

        const token =
            authHeader.split(" ")[1];


        if (!token) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication token is missing."

            });

        }


        // -------------------------------------------------
        // Verify JWT
        // -------------------------------------------------

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        if (decoded?.role === "admin") {
            req.admin = { ...decoded, permissions: ["*"] };
            return next();
        }

        if (decoded?.role !== "staff" || !decoded?.staffId) {
            return res.status(403).json({
                success: false,
                message: "Administrator access required."
            });
        }

        const staff = db.prepare(`
            SELECT id, full_name, username, role, permissions, account_status
            FROM staff_users WHERE id = ?
        `).get(Number(decoded.staffId));

        if (!staff || staff.account_status !== "active") {
            return res.status(403).json({ success: false, message: "This staff account is inactive." });
        }

        req.admin = {
            staffId: staff.id,
            username: staff.username,
            fullName: staff.full_name,
            role: "staff",
            jobRole: staff.role,
            permissions: parsePermissions(staff.permissions)
        };

        next();


    } catch (error) {

        console.error(
            "❌ Admin authentication error:",
            error.message
        );


        return res.status(401).json({

            success: false,

            message:
                "Invalid or expired authentication token."

        });

    }

};

export const requirePermission = permission => (req, res, next) => {
    if (hasPermission(req.admin, permission)) return next();
    return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this task."
    });
};
