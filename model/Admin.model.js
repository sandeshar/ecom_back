import mongoose from "mongoose";
import bcrypt from "bcrypt";

const AdminSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            enum: ["superadmin", "admin"],
            default: "admin",
        },
        permissions: {
            // Product permissions
            canViewProducts: { type: Boolean, default: true },
            canCreateProducts: { type: Boolean, default: true },
            canEditProducts: { type: Boolean, default: true },
            canDeleteProducts: { type: Boolean, default: false },

            // Order permissions
            canViewOrders: { type: Boolean, default: true },
            canEditOrders: { type: Boolean, default: true },
            canDeleteOrders: { type: Boolean, default: false },

            // Customer permissions
            canViewCustomers: { type: Boolean, default: true },

            // Analytics permissions
            canViewAnalytics: { type: Boolean, default: true },

            // Settings permissions
            canEditSettings: { type: Boolean, default: false },

            // Admin management (only superadmin)
            canManageAdmins: { type: Boolean, default: false },
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            default: null,
        },
        lastLogin: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

// Hash password before saving
AdminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
AdminSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Set permissions based on role
AdminSchema.pre("save", function (next) {
    if (this.role === "superadmin") {
        // Superadmin has all permissions
        this.permissions = {
            canViewProducts: true,
            canCreateProducts: true,
            canEditProducts: true,
            canDeleteProducts: true,
            canViewOrders: true,
            canEditOrders: true,
            canDeleteOrders: true,
            canViewCustomers: true,
            canViewAnalytics: true,
            canEditSettings: true,
            canManageAdmins: true,
        };
    }
    next();
});

const Admin = mongoose.model("Admin", AdminSchema);
export default Admin;
