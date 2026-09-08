import jwt  from 'jsonwebtoken';
import {VerifyErrors,JwtPayload} from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();


// Create a custom type for the request object to include userId
interface AuthenticatedRequest extends Request {
    userId?: string;
}


function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];


    if (!authHeader || typeof authHeader !== 'string') {
        res.status(401).json({ message: 'Failed to authenticate user!' });
        return;
    }

    
    const tokenArray = authHeader.split(' ');
    const token = tokenArray[1];

    if (!token) {
        res.status(401).json({ message: 'Failed to authenticate user!' });
        return;
    }


    // Create a variable for the jwt key
    const jwtSecret: string = process.env.JWT_SECRET || 'default_secret_key';
    const decoded = jwt.verify(token, jwtSecret) as { userId: string };

    if (!decoded) {
        return res.status(401).json({ message: 'Failed to authenticate userB!'});
    }

    req.userId = decoded.userId; // Attach the user ID to the request object

}


export default authMiddleware;