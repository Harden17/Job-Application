import cors from "cors";

// Allowed origins for CORS (Added trailing slashes safety check inside the function)
const allowedOrigins = [
    'http://localhost:3000',
    'https://job-application-rfot.onrender.com', // Added trailing comma
];

const corsOptions: cors.CorsOptions = {
    origin: function (origin, callback) {
        // Strip any trailing slashes from the incoming origin header for a clean match
        const sanitizedOrigin = origin ? origin.replace(/\/$/, "") : origin;

        if (!sanitizedOrigin || allowedOrigins.includes(sanitizedOrigin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }  
    },
    credentials: true // Recommended if you plan to use sessions/cookies later
};

// Export it so you can import it into your main server file
export const corsMiddleware = cors(corsOptions);
