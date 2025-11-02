import express from "express";
import { getSettings, updateSettings } from "../controller/SettingsController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

// Get settings (public - for frontend display)
router.get("/", getSettings);

// Update settings (superadmin or admin with permission)
router.put("/", authenticate, checkPermission('canEditSettings'), updateSettings);

export default router;
