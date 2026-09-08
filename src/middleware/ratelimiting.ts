import rateLimit from 'express-rate-limit';
import { RequestHandler } from 'express';

// Create a rate limit structure
const rateLimitingMiddleware: RequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

export default rateLimitingMiddleware;