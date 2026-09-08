import helmet from "helmet";

// Middleware to set security-related HTTP headers
const helmetMiddleware = helmet({
    contentSecurityPolicy: false, // Disable CSP for simplicity; adjust as needed
});


export default helmetMiddleware;