import Settings from "../model/Settings.model.js";

/**
 * Get store settings
 */
export const getSettings = async (req, res, next) => {
    try {
        let settings = await Settings.findOne();

        // If no settings exist, create default settings
        if (!settings) {
            settings = await Settings.create({});
        }

        res.json(settings);
    } catch (error) {
        next(error);
    }
};

/**
 * Update store settings
 */
export const updateSettings = async (req, res, next) => {
    try {
        const {
            storeName,
            supportEmail,
            supportPhone,
            timezone,
            currency,
            taxRate,
            shippingFee,
            notificationsEnabled,
            lowStockThreshold,
            orderNotifications,
            inventoryNotifications,
        } = req.body;

        let settings = await Settings.findOne();

        if (!settings) {
            // Create new settings if none exist
            settings = await Settings.create(req.body);
        } else {
            // Update existing settings
            Object.assign(settings, {
                storeName,
                supportEmail,
                supportPhone,
                timezone,
                currency,
                taxRate,
                shippingFee,
                notificationsEnabled,
                lowStockThreshold,
                orderNotifications,
                inventoryNotifications,
            });
            await settings.save();
        }

        res.json({
            message: "Settings updated successfully",
            settings,
        });
    } catch (error) {
        next(error);
    }
};
