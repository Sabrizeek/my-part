import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors"; // Import cors for handling CORS
import eventRoute from "./routes/eventRoute.js";
 // Import event routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // allows us to use JSON data in the body
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
// Routes
app.use("/api/events", eventRoute); // Use event routes

console.log(process.env.MONGO_URI);

// Start server and connect to the database
app.listen(PORT, () => {
    connectDB(); // Connect to the database
    console.log("Server started at http://localhost:" + PORT + "🔥");
});
