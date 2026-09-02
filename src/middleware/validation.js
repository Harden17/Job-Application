import { z } from 'zod';

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
    userId: z.number().int().optional(), 
    
    // FIX: Expand the enum options to match every single frontend dropdown selection perfectly!
    status: z.preprocess(
        (val) => (typeof val === 'string' ? val.toLowerCase() : val),
        z.enum(['saved', 'applied', 'interview', 'interviewing', 'offered', 'rejected', 'accepted'], { 
            message: 'Invalid status value' 
        })
    ),
});

export const updateJobStatusSchema = jobApplicationSchema.pick({ status: true });

// The validation middleware
export const validateUser = (schema) =>  {
    return (req, res, next) => {
        const validationResult = schema.safeParse(req.body);
        if (!validationResult.success) {
            // This prints the exact mismatch field clearly in your terminal console!
            console.log("Zod Validation Failed details:", validationResult.error.errors);
            return res.status(400).json({ errors: validationResult.error.errors });
        }

        req.body = validationResult.data; 
        next();
    };
};  

export default validateUser;
