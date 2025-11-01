import express from "express";
import { getSettings, updateSettings } from "../controller/SettingsController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get settings (public - for frontend display)
router.get("/", getSettings);

// Update settings (admin only)
router.put("/", authenticateJWT, updateSettings);

export default router;
