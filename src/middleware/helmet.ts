import helmet from "helmet";
import { RequestHandler } from "express";

// Middleware to set security-related HTTP headers
const helmetMiddleware: RequestHandler = helmet({
    contentSecurityPolicy: false, // Disable CSP for simplicity; adjust as needed
});


export default helmetMiddleware;