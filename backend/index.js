import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import Razorpay from "razorpay";
import cors from "cors";
import path from "path";
import quizRoutes from "./routes/quiz.js"; // Use import instead of require
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";
import certificateRoutes from "./routes/certificates.js";

// Add this below the existing routes




dotenv.config();

export const instance = new Razorpay({
  key_id: process.env.Razorpay_Key,
  key_secret: process.env.Razorpay_Secret,
});

const app = express();

// using middlewares
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",  // Allow frontend requests
  credentials: true
}));

app.use("/api", quizRoutes);
app.use("/api/users", userRoutes);
const port = 5000;

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.use("/uploads", express.static("uploads"));



// using routes
app.use("/api/certificate", certificateRoutes);
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);

const __dirname = path.resolve();

if(process.env.NODE_ENV === "production")
{
    // app.use(express.static(path.join(__dirname,"/frontend/build")));
    app.get("*", (req,res) => res.sendFile(path.resolve(__dirname,"frontend","index.html")) );
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDb();
});

