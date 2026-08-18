import express from "express";
import authroute from "./routes/authroutes.js";

const app = express();

// middleware
app.use(express.json());
app.use("/auth", authroute);

const PORT = process.env.PORT || 3000;




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});