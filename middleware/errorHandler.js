// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
            message: "Validation failed",
            errors,
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            message: `${field} already exists`,
        });
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === "CastError") {
        return res.status(400).json({
            message: "Invalid ID format",
        });
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            message: "Invalid token",
        });
    }

    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            message: "Token expired",
        });
    }

    // Default error
    res.status(err.statusCode || 500).json({
        message: err.message || "Internal server error",
    });
};

// 404 handler
export const notFoundHandler = (req, res) => {
    res.status(404).json({
        message: `Route ${req.originalUrl} not found`,
    });
};
