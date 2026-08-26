import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import { listStaff, createStaff, updateStaffStatus } from "../controllers/adminStaffController.js";
const router = express.Router(); router.use(adminAuth); router.get("/", listStaff); router.post("/", createStaff); router.patch("/:id/status", updateStaffStatus); export default router;
