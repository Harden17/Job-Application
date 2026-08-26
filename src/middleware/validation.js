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
        const errors = validationResult.error.errors.map(err => err.message);
        return res.status(400).json({ errors });
    }
    next();
}

export default validateUser;