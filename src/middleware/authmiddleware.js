import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization']; 
    const token = authHeader && authHeader.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({ message: 'Failed to authenticate user!'});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate user!' });
        }
        // this is the id we are gping to use to get the data of aspecific user.
        req.userId = decoded.id;
        next();
    });

}


export default authMiddleware;