import express from "express";


const authroute = express.Router();

// Register route
authroute.post("/register", async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
         return res.status(400).json({ error: "Email and password are required" });
    }

    // Hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
        return res.status(500).json({ error: "Internal server error" });
    }

    // Database connection
    try {
        const user = await User.create({
            data: {
                email: email,
                password: hashedPassword
            }
        });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        if (token) {
            return res.status(201).json({ token });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// Login route
authroute.post("/login", async (req, res) => {
    const {email, password} = req.body;


});

export default authroute;