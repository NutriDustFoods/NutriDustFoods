import bcrypt from "bcryptjs";
import db from "../config/sqlite.js";

const roles = new Set(["rider", "accountant", "cashier", "staff", "support", "manager"]);
const format = row => ({ id: row.id, fullName: row.full_name, username: row.username, email: row.email, phone: row.phone, role: row.role, accountStatus: row.account_status, createdAt: row.created_at, updatedAt: row.updated_at });

export const listStaff = (req, res) => res.json({ success: true, staff: db.prepare("SELECT id, full_name, username, email, phone, role, account_status, created_at, updated_at FROM staff_users ORDER BY id DESC").all().map(format) });

export const createStaff = async (req, res) => {
    const { fullName, username, email, phone, password, role = "staff" } = req.body || {};
    const cleanRole = String(role).trim().toLowerCase();
    if (!fullName || !username || !password || !roles.has(cleanRole)) return res.status(400).json({ success: false, message: "Full name, username, password and a valid staff role are required." });
    try {
        const hash = await bcrypt.hash(String(password), 12);
        if (cleanRole === "rider") {
            const riderPhone = String(phone || username).trim();
            const result = db.prepare("INSERT INTO riders (full_name, phone, email, password_hash) VALUES (?, ?, ?, ?)").run(String(fullName).trim(), riderPhone, email ? String(email).trim().toLowerCase() : null, hash);
            return res.status(201).json({ success: true, rider: db.prepare("SELECT id, full_name, phone, email, availability_status, account_status FROM riders WHERE id = ?").get(result.lastInsertRowid) });
        }
        const result = db.prepare("INSERT INTO staff_users (full_name, username, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)").run(String(fullName).trim(), String(username).trim(), email ? String(email).trim().toLowerCase() : null, phone || null, hash, cleanRole);
        return res.status(201).json({ success: true, staff: format(db.prepare("SELECT * FROM staff_users WHERE id = ?").get(result.lastInsertRowid)) });
    } catch (error) {
        if (String(error.code).includes("CONSTRAINT")) return res.status(409).json({ success: false, message: "Username, phone or email already exists." });
        return res.status(500).json({ success: false, message: "Unable to create account." });
    }
};

export const updateStaffStatus = (req, res) => {
    const status = String(req.body?.accountStatus || "").trim().toLowerCase();
    if (!["active", "inactive"].includes(status)) return res.status(400).json({ success: false, message: "Account status must be active or inactive." });
    const result = db.prepare("UPDATE staff_users SET account_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(status, Number(req.params.id));
    if (!result.changes) return res.status(404).json({ success: false, message: "Staff account not found." });
    return res.json({ success: true, message: "Staff account status updated." });
};
