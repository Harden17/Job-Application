import express from "express";
import prisma from "../prisma/prisma.js";


const approutes = express.Router();


// Get the list of all applications
approutes.get("/", async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const jobs = await prisma.job.findMany({
            where: {
                userId: userId
            }
        });

        res.json(jobs);
    } catch (error) {
        console.error("Error fetching applications:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }


});





export default approutes;