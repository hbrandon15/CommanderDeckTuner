const express = require("express");
const Deck = require("../models/Deck"); // Import the Deck model

const router = express.Router();

// Create a new deck
router.post("/", async (req, res) => {
  console.log("Request headers:", req.headers); // Debug log for headers
  console.log("Request body:", req.body); // Debug log for body

  const { deckName, cards } = req.body;

  try {
    const newDeck = new Deck({ deckName, cards });
    await newDeck.save();
    res.status(201).json(newDeck);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all decks
router.get("/", async (req, res) => {
  try {
    const decks = await Deck.find();
    res.status(200).json(decks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single deck by ID
router.get("/:id", async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ message: "Deck not found" });
    res.status(200).json(deck);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a deck by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedDeck = await Deck.findByIdAndDelete(req.params.id);
    if (!deletedDeck)
      return res.status(404).json({ message: "Deck not found" });
    res.status(200).json({ message: "Deck deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
