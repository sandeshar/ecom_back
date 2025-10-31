// Input validation helper using simple checks
export const validateOrderInput = (req, res, next) => {
    const { customer, billingAddress, items } = req.body;

    const errors = [];

    // Validate customer
    if (!customer) {
        errors.push("Customer information is required");
    } else {
        if (!customer.name || customer.name.trim().length === 0) {
            errors.push("Customer name is required");
        }
        if (!customer.email || !isValidEmail(customer.email)) {
            errors.push("Valid customer email is required");
        }
    }

    // Validate billing address
    if (!billingAddress) {
        errors.push("Billing address is required");
    } else {
        if (!billingAddress.line1 || billingAddress.line1.trim().length === 0) {
            errors.push("Address line 1 is required");
        }
        if (!billingAddress.city || billingAddress.city.trim().length === 0) {
            errors.push("City is required");
        }
        if (!billingAddress.postalCode || billingAddress.postalCode.trim().length === 0) {
            errors.push("Postal code is required");
        }
        if (!billingAddress.country || billingAddress.country.trim().length === 0) {
            errors.push("Country is required");
        }
    }

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
        errors.push("Order must contain at least one item");
    } else {
        items.forEach((item, index) => {
            if (!item.productId && !item.product) {
                errors.push(`Item ${index + 1}: Product ID is required`);
            }
            if (!item.quantity || item.quantity < 1) {
                errors.push(`Item ${index + 1}: Quantity must be at least 1`);
            }
        });
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: "Validation failed",
            errors,
        });
    }

    next();
};

export const validateProductInput = (req, res, next) => {
    const { name, price } = req.body;

    const errors = [];

    if (!name || name.trim().length === 0) {
        errors.push("Product name is required");
    }

    if (price === undefined || price === null) {
        errors.push("Product price is required");
    } else if (price < 0) {
        errors.push("Product price must be non-negative");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: "Validation failed",
            errors,
        });
    }

    next();
};

// Helper function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
