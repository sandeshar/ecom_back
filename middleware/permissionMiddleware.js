/**
 * Check if user has required permission
 */
export const checkPermission = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Superadmin has all permissions
        if (req.user.role === "superadmin") {
            return next();
        }

        // Check specific permission
        if (!req.user.permissions || !req.user.permissions[permission]) {
            return res.status(403).json({
                message: "You don't have permission to perform this action"
            });
        }

        next();
    };
};

/**
 * Check if user is superadmin
 */
export const requireSuperAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "superadmin") {
        return res.status(403).json({
            message: "Only superadmins can perform this action"
        });
    }

    next();
};

/**
 * Check if user has any of the required roles
 */
export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Insufficient permissions"
            });
        }

        next();
    };
};
