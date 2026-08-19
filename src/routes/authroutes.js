import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../prismaconfig.js"
import dotenv from "dotenv";
dotenv.config();

const authroute = express.Router();

// Register route
authroute.post("/register", async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
         return res.status(400).json({ error: "Email and password are required" });
    }

    // Hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
        return res.status(500).json({ error: "Internal server error" });
    }

    // Database connection
    try {
        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword
            }
        });

        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        if (token) {
            return res.status(201).json({ token });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Login route
authroute.post("/login", async (req, res) => {
    const {email, password} = req.body;

    // get the password from the database
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            }
        });
        // check if the user exists
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // generate a JWT token and send it back to the client
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        if (token) {
            return res.status(200).json({ token });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }



});

export default authroute;