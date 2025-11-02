import Admin from "../model/Admin.model.js";
import jwt from "jsonwebtoken";

/**
 * Admin login
 */
export const adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find admin by email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check if admin is active
        if (admin.status !== "active") {
            return res.status(403).json({ message: "Account is inactive" });
        }

        // Verify password
        const isPasswordValid = await admin.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        // Generate JWT token
        const token = jwt.sign(
            {
                id: admin._id,
                email: admin.email,
                role: admin.role,
                permissions: admin.permissions,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
                permissions: admin.permissions,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all admins (superadmin only)
 */
export const getAdmins = async (req, res, next) => {
    try {
        const admins = await Admin.find()
            .select("-password")
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        res.json(admins);
    } catch (error) {
        next(error);
    }
};

/**
 * Create new admin (superadmin only)
 */
export const createAdmin = async (req, res, next) => {
    try {
        const { email, password, name, role, permissions } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin with this email already exists" });
        }

        // Create new admin
        const admin = await Admin.create({
            email,
            password,
            name,
            role: role || "admin",
            permissions: role === "superadmin" ? undefined : permissions,
            createdBy: req.user.id,
        });

        // Return admin without password
        const adminResponse = admin.toObject();
        delete adminResponse.password;

        res.status(201).json({
            message: "Admin created successfully",
            admin: adminResponse,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update admin (superadmin only)
 */
export const updateAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, role, permissions, status } = req.body;

        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Prevent modifying yourself if changing role or status
        if (req.user.id === id && (role || status)) {
            return res.status(400).json({
                message: "Cannot modify your own role or status"
            });
        }

        // Update fields
        if (name) admin.name = name;
        if (role) admin.role = role;
        if (status) admin.status = status;

        // Update permissions only for regular admins
        if (permissions && role !== "superadmin") {
            admin.permissions = permissions;
        }

        await admin.save();

        const adminResponse = admin.toObject();
        delete adminResponse.password;

        res.json({
            message: "Admin updated successfully",
            admin: adminResponse,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete admin (superadmin only)
 */
export const deleteAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Prevent deleting yourself
        if (req.user.id === id) {
            return res.status(400).json({ message: "Cannot delete your own account" });
        }

        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        await Admin.findByIdAndDelete(id);

        res.json({ message: "Admin deleted successfully" });
    } catch (error) {
        next(error);
    }
};

/**
 * Change password
 */
export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const admin = await Admin.findById(req.user.id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Verify current password
        const isPasswordValid = await admin.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        // Update password
        admin.password = newPassword;
        await admin.save();

        res.json({ message: "Password changed successfully" });
    } catch (error) {
        next(error);
    }
};

/**
 * Get current admin profile
 */
export const getProfile = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.user.id).select("-password");
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.json(admin);
    } catch (error) {
        next(error);
    }
};
