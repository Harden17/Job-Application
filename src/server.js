import express from "express";
import authroute from "./routes/authroutes.js";
import path,{dirname} from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// get the current filepath
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Add frontend build folder path
app.use(express.static(path.join(__dirname, "../public")));

// middleware
app.use(express.json());
app.use("/auth", authroute);

// Serve the frontend build files
app.get("/", (req, res) => {
  const index = path.join(__dirname, "public", "index.html");
  res.sendFile(index);  
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});