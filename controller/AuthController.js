import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const getAuthConfig = () => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    const adminName = process.env.ADMIN_NAME || "Admin";
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1d";

    if (!adminEmail || !adminPasswordHash || !jwtSecret) {
        return null;
    }

    return {
        adminEmail,
        adminPasswordHash,
        adminName,
        jwtSecret,
        jwtExpiresIn,
    };
};

export const login = async (req, res) => {
    try {
        const config = getAuthConfig();
        if (!config) {
            return res.status(500).json({ message: "Authentication is not configured" });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        if (email.toLowerCase() !== config.adminEmail.toLowerCase()) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, config.adminPasswordHash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ email: config.adminEmail, name: config.adminName }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

        return res.json({
            token,
            user: {
                email: config.adminEmail,
                name: config.adminName,
            },
        });
    } catch (error) {
        console.error("Login error", error);
        return res.status(500).json({ message: "Unable to login" });
    }
};
