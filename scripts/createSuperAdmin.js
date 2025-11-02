import mongoose from "mongoose";
import Admin from "../model/Admin.model.js";
import dotenv from "dotenv";

dotenv.config();

const createSuperAdmin = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Check if superadmin already exists
        const existingSuperAdmin = await Admin.findOne({ role: "superadmin" });
        if (existingSuperAdmin) {
            console.log("SuperAdmin already exists:", existingSuperAdmin.email);
            process.exit(0);
        }

        // Create superadmin
        const superAdmin = await Admin.create({
            email: process.env.SUPERADMIN_EMAIL || "admin@designhub.com",
            password: process.env.SUPERADMIN_PASSWORD || "admin123",
            name: "Super Admin",
            role: "superadmin",
        });

        console.log("SuperAdmin created successfully!");
        console.log("Email:", superAdmin.email);
        console.log("Password:", process.env.SUPERADMIN_PASSWORD || "admin123");
        console.log("\n⚠️  Please change the password after first login!");

        process.exit(0);
    } catch (error) {
        console.error("Error creating superadmin:", error);
        process.exit(1);
    }
};

createSuperAdmin();
