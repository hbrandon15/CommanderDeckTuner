const mongoose = require("mongoose");

// Define the schema for a deck
const deckSchema = new mongoose.Schema({
  deckName: { type: String, required: true }, // Deck name is required
  cards: [
    {
      name: { type: String, required: true }, // Card name is required
      manaCost: { type: String }, // Optional mana cost
      type: { type: String }, // Card type (e.g., Creature, Instant)
      price_usd: { type: String }, // Current price in USD
      priceAlert: {
        enabled: { type: Boolean, default: false },
        targetPrice: { type: Number }, // Price threshold for alert
        condition: { type: String, enum: ['above', 'below'], default: 'above' }, // Alert when price goes above or below
        lastTriggered: { type: Date } // Last time alert was triggered
      }
    },
  ],
  notifications: [
    {
      cardName: { type: String, required: true },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      read: { type: Boolean, default: false },
      type: { type: String, enum: ['price_alert'], default: 'price_alert' }
    }
  ]
});

// Create the Deck model
const Deck = mongoose.model("Deck", deckSchema);

module.exports = Deck;
