import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../config/sqlite.js";
import { parsePermissions } from "../auth/adminPermissions.js";


// =====================================================
// ADMIN LOGIN
// POST /api/admin/login
// =====================================================

export const adminLogin = async (req, res) => {

    try {

        const { username, password } = req.body;

        const adminUsername =
            process.env.ADMIN_USERNAME;

        const adminPassword =
            process.env.ADMIN_PASSWORD;


        if (!process.env.JWT_SECRET) {

            return res.status(500).json({
                success: false,
                message:
                    "JWT_SECRET is not configured."
            });

        }


        const isPrimaryAdmin = adminUsername && adminPassword &&
            username === adminUsername && password === adminPassword;

        if (isPrimaryAdmin) {
            const token = jwt.sign(
                { username: adminUsername, role: "admin" },
                process.env.JWT_SECRET,
                { expiresIn: "8h" }
            );

            return res.status(200).json({
                success: true,
                message: "Admin login successful.",
                token,
                admin: { username: adminUsername, role: "admin", permissions: ["*"] }
            });
        }

        const staff = db.prepare(`
            SELECT id, full_name, username, password_hash, role, permissions, account_status
            FROM staff_users WHERE lower(username) = lower(?)
        `).get(String(username || "").trim());

        const validStaffPassword = staff && await bcrypt.compare(String(password || ""), staff.password_hash);
        if (!staff || !validStaffPassword) {
            return res.status(401).json({ success: false, message: "Invalid username or password." });
        }

        if (staff.account_status !== "active") {
            return res.status(403).json({ success: false, message: "This staff account is inactive." });
        }

        const permissions = parsePermissions(staff.permissions);
        const token = jwt.sign(
            { staffId: staff.id, username: staff.username, role: "staff" },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        return res.status(200).json({
            success: true,
            message: "Staff login successful.",
            token,
            admin: {
                id: staff.id,
                fullName: staff.full_name,
                username: staff.username,
                role: "staff",
                jobRole: staff.role,
                permissions
            }
        });


    } catch (error) {

        console.error(
            "❌ Admin login error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to process admin login."

        });

    }

};

export const getAdminSession = (req, res) => res.json({ success: true, admin: req.admin });
