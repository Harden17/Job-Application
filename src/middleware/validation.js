import {z} from 'zod';

// Define Schemas 
// User registration and login schema
export const userSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});
// 


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