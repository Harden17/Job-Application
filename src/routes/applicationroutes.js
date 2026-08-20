import express from "express";
import prisma from "../../prismaconfig.js";


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


// Create a new job application
approutes.post("/", async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { company, jobTitle, jobUrl, status } = req.body;
    try {
        const newJob = await prisma.job.create({
            data: {
                company: company,
                jobTitle: jobTitle,
                jobUrl: jobUrl,
                status: status,
                userId: userId
            }
        });

        res.status(201).json(newJob);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});   

// Update an existing job application
approutes.patch("/:id", async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const jobId = parseInt(req.params.id);
    const {status} = req.body;
    if (!status) {
        return res.status(400).json({ message: "Status is required" });
    }

    try {
        const updatedJob = await prisma.job.update({
            where: {
                id: jobId,
                userId: userId
            },
            data: {
                status: status
            }
        });

        res.json(updatedJob);
    } catch (error) {
        console.error("Error updating job application:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// delete a job application
approutes.delete("/:id", async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const jobId = parseInt(req.params.id);

    try {
        await prisma.job.delete({
            where: {
                id: jobId,
                userId: userId
            }
        });
        res.status(200).json({ message: "Job application deleted successfully" });
    } catch (error) {
        console.error("Error deleting job application:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


export default approutes;