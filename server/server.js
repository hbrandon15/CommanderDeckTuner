const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const mongoose = require("mongoose"); // Import Mongoose
const deckRoutes = require("./routes/deckRoutes"); // Import the deck routes

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(helmet()); // Add Helmet middleware to enhance security

const PORT = process.env.PORT || 5000; // Use PORT from .env or default to 5000

// MongoDB Connection
const CONNECTION_URL = process.env.MONGO_URI; // Get the connection string from .env
mongoose
  .connect(CONNECTION_URL)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Example Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use(express.json()); // Middleware to parse JSON requests
app.use("/api/decks", deckRoutes); // Use the deck routes

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
