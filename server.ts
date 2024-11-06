import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./src/config/db";
import userRoutes from "./src/routes/userRoutes";
import inventoryRoutes from "./src/routes/inventoryRoutes";
import dotenv from "dotenv";
import serviceRoutes from "./src/routes/serviceRoutes";

dotenv.config(); // Load environment variables

const app = express();
connectDB(); // Establish database connection

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route handling
app.use("/api/users", userRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/services', serviceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
