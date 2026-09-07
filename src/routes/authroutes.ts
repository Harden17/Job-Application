import express from "express";
// import the req/res types
import { Request, Response } from "express";
// also import the router type
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../prismaconfig.js"
import validateUser, { userSchema } from "../middleware/validation.js";
import dotenv from "dotenv";
dotenv.config();

const authroute: Router = express.Router();

// Register route
authroute.post("/register", validateUser(userSchema), async (req: Request, res: Response): Promise<void> => {
    const {email, password} = req.body;
    if (!email || !password) {
        // meaning that this error will be returned on the server side not in the console.
        res.status(400).json({ error: "Email and password are required" });
        return;
    }

    // Hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
        res.status(500).json({ error: "Internal server error" });
        return;
    }

    // Database connection
    try {
        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword
            }
        });

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        const token = jwt.sign({ userId: newUser.id }, secret, { expiresIn: "24h" });
        if (token) {
           res.status(201).json({ token });
           
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
});

// Login route
authroute.post("/login", validateUser(userSchema), async (req: Request, res: Response): Promise<void> => {
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
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }

        // compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }

        // generate a JWT token and send it back to the client
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "24h" });
        if (token) {
            res.status(200).json({ token });
            return;
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }



});

export default authroute;