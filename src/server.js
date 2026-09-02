import express from "express";
import authroute from "./routes/authroutes.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import approutes from "./routes/applicationroutes.js";
import authMiddleware from "./middleware/authmiddleware.js";
import rateLimitingMiddleware from "./middleware/ratelimiting.js";
import helmetMiddleware from "./middleware/helmet.js";
import corsMiddleware from "./middleware/cors.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Get the current absolute directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 1. Core Global Security & Parsing Middlewares
app.use(express.json()); // Parses incoming request body data perfectly
app.use(helmetMiddleware);
app.use(rateLimitingMiddleware);
app.use(corsMiddleware);

// 2. Serve Frontend Static Assets Automatically
// This handles serving your index.html and assets on "/" out-of-the-box!
app.use(express.static(path.join(__dirname, "../public")));

// 3. API Routes
app.use("/auth", authroute);
app.use("/jobs", authMiddleware, approutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
