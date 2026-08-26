import {z} from 'zod';

// Define the zod schema for validation
const userSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

// create the validation middleware
export const validateUser = (req, res, next) => {
    const validationResult = userSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ errors: validationResult.error.errors });
    }
    next();
}

export default validateUser;