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
    console.log("New deck saved:", newDeck); // Debug log
    res.status(201).json(newDeck);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all decks
router.get("/", async (req, res) => {
  try {
    const decks = await Deck.find({}, "deckName"); // Fetch only the deck names
    res.status(200).json(decks);
  } catch (error) {
    console.error("Error fetching decks:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get a single deck by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params; // Deck ID from the URL

  try {
    const deck = await Deck.findById(id); // Find the deck by ID
    if (!deck) {
      return res.status(404).json({ message: "Deck not found" });
    }
    res.status(200).json(deck); // Return the deck
  } catch (error) {
    console.error("Error fetching deck:", error);
    res.status(500).json({ message: error.message });
  }
});

// Delete a deck by ID
// This route will delete a specific deck by its ID
// It will remove the deck from the database
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

// Clear all cards from a deck
// This route will remove all cards from a specific deck
router.delete("/:id/cards", async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ message: "Deck not found" });
    deck.cards = [];
    await deck.save();
    res.status(200).json(deck);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add a card to a deck
router.post("/:id/cards", async (req, res) => {
  const { id } = req.params; // Deck ID from the URL
  const { name, manaCost, type } = req.body; // Card details from the request body

  try {
    console.log("Adding card to deck:", id, req.body); // Debug log

    // Find the deck by ID and add the card to the "cards" array
    const updatedDeck = await Deck.findByIdAndUpdate(
      id,
      { $push: { cards: { name, manaCost, type } } }, // Add the card to the "cards" array
      { new: true } // Return the updated deck after the update
    );

    if (!updatedDeck) {
      console.error("Deck not found:", id); // Debug log
      return res.status(404).json({ message: "Deck not found" });
    }

    console.log("Card added successfully:", updatedDeck); // Debug log
    res.status(200).json(updatedDeck); // Return the updated deck
  } catch (error) {
    console.error("Error adding card to deck:", error); // Debug log
    res.status(500).json({ message: error.message });
  }
});

// Remove a card from a deck
router.delete("/:id/cards/:cardName", async (req, res) => {
  const { id, cardName } = req.params; // Deck ID and card name from the URL

  try {
    const updatedDeck = await Deck.findByIdAndUpdate(
      id,
      { $pull: { cards: { name: cardName } } }, // Remove the card by name
      { new: true } // Return the updated deck
    );

    if (!updatedDeck) {
      return res.status(404).json({ message: "Deck not found" });
    }

    res.status(200).json(updatedDeck); // Return the updated deck
  } catch (error) {
    console.error("Error removing card:", error);
    res.status(500).json({ message: error.message });
  }
});

// Set price alert for a card
router.put("/:id/cards/:cardName/alert", async (req, res) => {  const { id, cardName } = req.params;
  const { enabled, targetPrice, condition } = req.body;

  // Decode the URL-encoded card name
  const decodedCardName = decodeURIComponent(cardName);
  
  console.log("=== PRICE ALERT REQUEST ===");
  console.log("Raw cardName from URL:", cardName);
  console.log("Decoded cardName:", decodedCardName);
  console.log("Request data:", { id, enabled, targetPrice, condition });

  try {
    const deck = await Deck.findById(id);
    if (!deck) {
      console.log("❌ Deck not found:", id);
      return res.status(404).json({ message: "Deck not found" });
    }

    console.log("✅ Deck found:", deck.deckName);
    console.log("🔍 Looking for card:", decodedCardName);
    console.log("📋 Available cards:", deck.cards.map(c => `"${c.name}"`));

    // Try to find the card with exact match first, then case-insensitive
    let card = deck.cards.find(c => c.name === decodedCardName);
    if (!card) {
      card = deck.cards.find(c => c.name.toLowerCase() === decodedCardName.toLowerCase());
    }
    
    if (!card) {
      console.log("❌ Card not found in deck:", decodedCardName);
      console.log("Available card names (exact):", deck.cards.map(c => c.name));
      return res.status(404).json({ 
        message: "Card not found in deck",
        searchedFor: decodedCardName,
        availableCards: deck.cards.map(c => c.name)
      });
    }    console.log("✅ Card found:", card.name);
    console.log("🔧 Setting alert...");
    
    // Initialize priceAlert if it doesn't exist (for backward compatibility)
    if (!card.priceAlert) {
      card.priceAlert = {
        enabled: false,
        targetPrice: null,
        condition: 'above',
        lastTriggered: null
      };
    }
    
    // Update the price alert settings
    card.priceAlert.enabled = enabled || false;
    card.priceAlert.targetPrice = targetPrice || null;
    card.priceAlert.condition = condition || 'above';
    // Keep existing lastTriggered value
    
    // Mark the subdocument as modified for Mongoose
    deck.markModified('cards');

    await deck.save();
    console.log("Price alert saved successfully");
    res.status(200).json(deck);
  } catch (error) {
    console.error("Error setting price alert:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get notifications for a deck
router.get("/:id/notifications", async (req, res) => {
  const { id } = req.params;

  try {
    const deck = await Deck.findById(id);
    if (!deck) {
      return res.status(404).json({ message: "Deck not found" });
    }

    res.status(200).json(deck.notifications || []);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: error.message });
  }
});

// Mark notification as read
router.put("/:id/notifications/:notificationIndex/read", async (req, res) => {
  const { id, notificationIndex } = req.params;

  try {
    const deck = await Deck.findById(id);
    if (!deck) {
      return res.status(404).json({ message: "Deck not found" });
    }

    if (deck.notifications && deck.notifications[notificationIndex]) {
      deck.notifications[notificationIndex].read = true;
      await deck.save();
    }

    res.status(200).json(deck.notifications || []);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: error.message });
  }
});

// Clear all notifications for a deck
router.delete("/:id/notifications", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedDeck = await Deck.findByIdAndUpdate(
      id,
      { $set: { notifications: [] } },
      { new: true }
    );

    if (!updatedDeck) {
      return res.status(404).json({ message: "Deck not found" });
    }

    res.status(200).json({ message: "All notifications cleared" });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    res.status(500).json({ message: error.message });
  }
});

// Test route to check deck structure
router.get("/:id/debug", async (req, res) => {
  const { id } = req.params;
  try {
    const deck = await Deck.findById(id);
    if (!deck) {
      return res.status(404).json({ message: "Deck not found" });
    }
    res.status(200).json({
      deckId: deck._id,
      deckName: deck.deckName,
      cardCount: deck.cards.length,
      cards: deck.cards.map(card => ({
        name: card.name,
        hasPrice: !!card.price_usd,
        hasPriceAlert: !!card.priceAlert,
        priceAlert: card.priceAlert
      }))
    });
  } catch (error) {
    console.error("Error in debug route:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
