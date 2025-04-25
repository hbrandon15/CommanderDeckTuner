const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose"); // Import Mongoose
const cors = require("cors"); // Import CORS middleware
const deckRoutes = require("./routes/deckRoutes"); // Import the deck routes

const app = express();
dotenv.config(); // Load environment variables from .env file
app.use(express.json()); // Parse JSON requests

// Enable CORS
app.use(cors());

// Mount the deck routes at /api/decks
app.use("/api/decks", deckRoutes);

// Example Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  console.log("Headers:", req.headers);
  next();
});

// Connect to MongoDB
const CONNECTION_URL = process.env.MONGO_URI; // Get the connection string from .env
mongoose
  .connect(CONNECTION_URL)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Start the server
const PORT = process.env.PORT || 5001; // Use PORT from .env or default to 5001
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
