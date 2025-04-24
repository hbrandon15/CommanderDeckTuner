const mongoose = require("mongoose");

// Define the schema for a deck
const deckSchema = new mongoose.Schema({
  deckName: { type: String, required: true }, // Deck name is required
  cards: [
    {
      name: { type: String, required: true }, // Card name is required
      manaCost: { type: String }, // Optional mana cost
      type: { type: String }, // Card type (e.g., Creature, Instant)
    },
  ],
});

// Create the Deck model
const Deck = mongoose.model("Deck", deckSchema);

module.exports = Deck;
