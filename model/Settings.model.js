import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
    {
        storeName: { type: String, required: true, default: "Design Hub" },
        supportEmail: { type: String, required: true, default: "support@designhub.com" },
        supportPhone: { type: String, default: "" },
        timezone: { type: String, default: "GMT-05:00 Eastern Time" },
        currency: { type: String, default: "USD" },
        taxRate: { type: Number, default: 0.06, min: 0, max: 1 },
        shippingFee: { type: Number, default: 4.99, min: 0 },
        notificationsEnabled: { type: Boolean, default: true },
        lowStockThreshold: { type: Number, default: 10, min: 0 },
        orderNotifications: { type: Boolean, default: true },
        inventoryNotifications: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Ensure only one settings document exists
SettingsSchema.index({}, { unique: true });

const Settings = mongoose.model("Settings", SettingsSchema);
export default Settings;
