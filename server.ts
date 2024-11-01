import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./src/config/db";
import userRoutes from "./src/routes/userRoutes";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();
connectDB(); // Establish database connection

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mount User routes under /api/users path
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
