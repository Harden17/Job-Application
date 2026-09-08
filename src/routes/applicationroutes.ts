import express from "express";
import { Router } from "express";
import { Request, Response } from "express";
import prisma from "../prismaconfig.js";
import validateUser, { jobApplicationSchema, updateJobStatusSchema } from "../middleware/validation.js";

const approutes: Router = express.Router();


// Create a custom type for the request to include the userId property
interface AuthenticatedRequest extends Request {
    userId?: number; // Assuming userId is a number, adjust if it's a different type
}

// Also create a custom type for the params
interface JobIdParams {
    id: string; // The job ID will be a string in the URL, but we will parse it to a number
}

// 1. Get the list of all applications
approutes.get("/", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
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
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});

// 2. Create a new job application
approutes.post("/", validateUser(jobApplicationSchema), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) {
       res.status(401).json({ message: "Unauthorized" });
       return;
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
    } catch (error) {
        console.error("Error creating job application:", error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});   

// 3. Update an existing job application status
approutes.patch("/:id", validateUser(updateJobStatusSchema), async (req: Request<JobIdParams> & AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    
    const jobId = parseInt(req.params.id);
    if (isNaN(jobId)) {
        res.status(400).json({ message: "Invalid Job ID format" });
        return;
    }

    const { status } = req.body;

    try {
        // FIX: Using updateMany handles compound queries safely where 'userId' isn't a unique key.
        const updateResult = await prisma.job.updateMany({
            where: {
                id: jobId,
                userId: userId // Ensures users can only update their own records
            },
            data: {
                status: status
            }
        });

        // If no rows were changed, it means the job didn't exist or didn't belong to the logged-in user
        if (updateResult.count === 0) {
            res.status(404).json({ message: "Job application not found or unauthorized" });
            return;
        }

        // Fetch the newly updated job record to return it cleanly to the frontend
        const updatedJob = await prisma.job.findFirst({ where: { id: jobId } });
        res.json(updatedJob);
    } catch (error) {
        console.error("Error updating job application:", error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});

// 4. Delete a job application
approutes.delete("/:id", async (req: Request<JobIdParams> & AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    
    const jobId = parseInt(req.params.id);
    if (isNaN(jobId)) {
        res.status(400).json({ message: "Invalid Job ID format" });
        return;
    }

    try {
        // FIX: Using deleteMany allows compounding 'id' and 'userId' safely.
        const deleteResult = await prisma.job.deleteMany({
            where: {
                id: jobId,
                userId: userId // Guardrail ensuring users only delete their own data
            }
        });

        if (deleteResult.count === 0) {
            res.status(404).json({ message: "Job application not found or unauthorized" });
            return;
        }

        res.status(200).json({ message: "Job application deleted successfully" });
    } catch (error) {
        console.error("Error deleting job application:", error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});

export default approutes;
