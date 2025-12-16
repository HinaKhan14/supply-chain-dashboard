import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import BlacklistedToken from "../models/BlacklistedToken.js";

// ✅ SIGN UP
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "User registered successfully",
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// ✅ LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // ✅ RETURN USER DATA (without password)
        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


// ✅ SIGN OUT (THIS WAS MISSING)
export const signout = async (req, res) => {
    try {
        const token = req.token;

        const decoded = jwt.decode(token);

        await BlacklistedToken.create({
            token,
            expiresAt: new Date(decoded.exp * 1000),
        });

        return res.status(200).json({
            message: "Logged out successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Logout failed",
        });
    }
};
