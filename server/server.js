const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(helmet()); // Add Helmet middleware to enhance security

const PORT = process.env.PORT || 5000; // Use PORT from .env or default to 5000

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
