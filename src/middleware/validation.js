import {z} from 'zod';

// Define Schemas 
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
    userId: z.number().int({ message: 'User ID must be an integer' }).optional(),
    status: z.enum(['applied', 'interviewing', 'offered', 'rejected'], { message: 'Invalid status value' }),
});


export const updateJobStatusSchema = jobApplicationSchema.pick({ status: true });


// create the validation middleware
export const validateUser = (schema) =>  {
    return (req, res, next) => {
        const validationResult = schema.safeParse(req.body);
        if (!validationResult.success) {
            console.log(validationResult.error.errors);
            return res.status(400).json({ errors: validationResult.error.errors });
            
        }

        req.body = validationResult.data; // Use the validated data
        next();
    };
};  

export default validateUser;