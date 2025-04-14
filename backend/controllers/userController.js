const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/User");

exports.signup = async (req, res) => {
    console.log(req.body);
    const { name, email, phone, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    console.log(hash);
    try {
        await User.create({ name, email, phone, password: hash });
        res.status(201).json({ message: "User created" });
    } catch (err) {
        res.status(400).json({ error: "User already exists or invalid data" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Verify Password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "User not authorized" });
        }

        res.status(200).json({
            message: "User login successful",
            token: generateToken(user),
        });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "An error occurred while logging in" });
    }
};

function generateToken(user) {
    const payload = { id: user.id, name: user.name };
    const secretKey = "secretkey";

    if (!secretKey) {
        console.log(
            "JWT_SECRET_KEY is not defined in the environment variables"
        );
        throw new Error("Server configuration error");
    }

    return jwt.sign(payload, secretKey);
}
