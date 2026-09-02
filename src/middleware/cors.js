import cors from "cors";

// Allowed origins for CORS
const allowedOrigins = [
    'http://localhost:3000'
]


// Create the CORS middleware configuration
const corsOptions = {
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