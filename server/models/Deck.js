const mongoose = require("mongoose");

// Define the schema for a deck
const deckSchema = new mongoose.Schema({
  deckName: { type: String, required: true }, // Deck name is required
  commander: { type: String }, // The name of the commander card
  cards: [
    {
      name: { type: String, required: true }, // Card name is required
      manaCost: { type: String }, // Optional mana cost
      type: { type: String }, // Card type (e.g., Creature, Instant)
      price_usd: { type: String }, // Current price in USD
      quantity: { type: Number, default: 1 }, // Quantity of this card in the deck
      isCommander: { type: Boolean, default: false }, // Flag to mark if this card is the commander
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
}, { strict: false }); // Allow flexible schema

// Create the Deck model
const Deck = mongoose.model("Deck", deckSchema);

module.exports = Deck;
