import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// User registration and login schema
export const userSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

// New job application schema
export const jobApplicationSchema = z.object({
    company: z.string().min(2, { message: 'Company name must be at least 2 characters long' }),
    jobTitle: z.string().min(2, { message: 'Job title must be at least 2 characters long' }),
    jobUrl: z.string().url({ message: 'Invalid URL format' }),
    status: z.enum(['Applied', 'Interview', 'Accepted', 'Rejected'], { message: 'Invalid status value' })
});

export const updateJobStatusSchema = jobApplicationSchema.pick({ status: true });

// The validation middleware
export const validateUser = (schema: z.ZodTypeAny) =>  {
    return (req: Request, res: Response, next: NextFunction) => {
        const validationResult = schema.safeParse(req.body);
        if (!validationResult.success) {
            // This prints the exact mismatch field clearly in your terminal console!
            console.log("Zod Validation Failed details");
            return res.status(400).json({message: "Validation failed" });
        }

        req.body = validationResult.data; 
        next();
    };
};  

export default validateUser;
