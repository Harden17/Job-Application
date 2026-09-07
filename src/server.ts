import { Request, Response } from "express";
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
app.use(helmetMiddleware);
app.use(rateLimitingMiddleware);
app.use(corsMiddleware);
app.use(express.json());
// 2. Serve Frontend Static Assets Automatically
// This handles serving your index.html and assets on "/" out-of-the-box!
app.use(express.static(path.join(__dirname, "../public")));

// 3. API Routes
app.use("/auth", authroute);
app.use("/jobs", authMiddleware, approutes);


// send the index.html file to the user to be displayed in the frontend
app.get("/", (req: Request, res: Response): void => {
    console.log("Response to the root directory has been detected!");
    // Here we use the public directory after we have related it to the index file.
    const index = path.join(__dirname, "../public", "index.html");
    res.status(200).sendFile(index);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

