import cors from "cors";
import { RequestHandler } from "express";

// Allowed origins for CORS
const allowedOrigins = [
    'http://localhost:3000',
    'https://job-application-rfot.onrender.com/'
]


// Create the CORS middleware configuration
const corsOptions: cors.CorsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }  
    }  
};


let corsMiddleware = cors(corsOptions);

export default corsMiddleware;