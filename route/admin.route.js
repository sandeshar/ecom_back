import express from "express";
import {
    adminLogin,
    getAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    changePassword,
    getProfile,
} from "../controller/AdminController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { requireSuperAdmin } from "../middleware/permissionMiddleware.js";

const router = express.Router();

// Public routes
router.post("/login", adminLogin);

// Protected routes
router.get("/profile", authenticate, getProfile);
router.post("/change-password", authenticate, changePassword);

// Superadmin only routes
router.get("/", authenticate, requireSuperAdmin, getAdmins);
router.post("/", authenticate, requireSuperAdmin, createAdmin);
router.put("/:id", authenticate, requireSuperAdmin, updateAdmin);
router.delete("/:id", authenticate, requireSuperAdmin, deleteAdmin);

export default router;
