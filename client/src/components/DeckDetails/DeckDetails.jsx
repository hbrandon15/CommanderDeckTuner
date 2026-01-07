import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To get the deck ID from the URL
import axios from "axios";
import "./DeckDetails.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PriceAlert from "../PriceAlert/PriceAlert";
import Notifications from "../Notifications/Notifications";
import CommanderButton from "../CommanderButton/CommanderButton";
import QuantityControl from "../QuantityControl/QuantityControl";

const DeckDetails = () => {
  const { id } = useParams(); // Get the deck ID from the URL
  const [deck, setDeck] = useState(null); // State to store the deck
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for errors
  // Function to fetch card image from Scryfall
  const fetchCardImage = async (cardName) => {
    try {
      const response = await axios.get(
        `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(
          cardName
        )}`
      );
      return response.data.image_uris.normal; // Return the normal image URL
    } catch (error) {
      console.error(`Error fetching image for card "${cardName}":`, error);
      return null; // Return null if the image can't be fetched
    }
  };

  // Function to generate TCGPlayer URL for a card
  const generateTCGPlayerURL = (cardName) => {
    const encodedCardName = encodeURIComponent(cardName);
    return `https://www.tcgplayer.com/search/magic/product?q=${encodedCardName}&view=grid`;
  };

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/decks/${id}`
        );
        const deckData = response.data;

        // Fetch images for all cards in the deck
        const updatedCards = await Promise.all(
          deckData.cards.map(async (card) => {
            const imageUrl = await fetchCardImage(card.name); // Fetch image from Scryfall
            return { ...card, imageUrl }; // Add the image URL to the card
          })
        );

        setDeck({ ...deckData, cards: updatedCards }); // Update the deck with image URLs
      } catch (error) {
        console.error("Error fetching deck:", error);
        setError("Failed to load the deck. Please try again.");
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchDeck();
  }, [id]);

   useEffect(() => {
    const fetchDeck = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/decks/${id}`
        );
        const deckData = response.data;

        // Fetch images for all cards in the deck
        const updatedCards = await Promise.all(
          deckData.cards.map(async (card) => {
            const imageUrl = await fetchCardImage(card.name); // Fetch image from Scryfall
            return { ...card, imageUrl }; // Add the image URL to the card
          })
        );

        setDeck({ ...deckData, cards: updatedCards }); // Update the deck with image URLs
      } catch (error) {
        console.error("Error fetching deck:", error);
        setError("Failed to load the deck. Please try again.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchDeck();
  }, [id]);

  // Backfill images whenever deck.cards changes (e.g., after remove/quantity/commander updates)
  useEffect(() => {
    if (!deck?.cards?.length) return;

    const missing = deck.cards.filter((c) => !c.imageUrl);
    if (missing.length === 0) return;

    let cancelled = false;
    (async () => {
      const urls = await Promise.all(missing.map((c) => fetchCardImage(c.name)));
      if (cancelled) return;
      const urlMap = new Map(missing.map((c, i) => [c.name, urls[i]]));
      setDeck((prev) => ({
        ...prev,
        cards: prev.cards.map((c) =>
          c.imageUrl ? c : { ...c, imageUrl: urlMap.get(c.name) || null }
        ),
      }));
    })();

    return () => {
      cancelled = true;
    };
  }, [deck?.cards]);

  // Function to handle removing a card from the deck
  // This function will be called when the user clicks the "Remove" button
  const handleRemoveCard = async (cardName) => {
    try {
      const response = await axios.delete(
        `http://localhost:5001/api/decks/${id}/cards/${encodeURIComponent(
          cardName
        )}`
      );
      setDeck(response.data); // Update the deck state with the updated deck
      toast.success("Card removed from the deck.");
    } catch (error) {
      console.error("Error removing card:", error);
      toast.error("Failed to remove the card. Please try again.");
    }
  };

  // Function to handle clearing the entire deck
  // This function will be called when the user clicks the "Clear Deck" button
  const handleClearDeck = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear all cards from this deck?"
      )
    )
      return;
    try {
      const response = await axios.delete(
        `http://localhost:5001/api/decks/${id}/cards`
      );
      setDeck(response.data); // Update the deck state with the cleared deck
      toast.success("All cards have been cleared from the deck.");
    } catch (error) {
      console.error("Error clearing deck:", error);
      toast.error("Failed to clear the deck. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  // Calculate the total number of cards (accounting for quantities)
  const totalCards = deck.cards.reduce((total, card) => total + (card.quantity || 1), 0);
  const uniqueCards = deck.cards.length;
  const commander = deck.cards.find(card => card.isCommander);
  
  return (
    <div className="deck-details">
      <div className="deck-header">
        <h2>{deck.deckName}</h2>
        <Notifications deckId={id} />
      </div>
      
      <div className="deck-info">
        <p>Total Cards: {totalCards} ({uniqueCards} unique)</p>
        {commander && (
          <p className="commander-info">
            <span className="commander-label">👑 Commander:</span>
            <span className="commander-name">{commander.name}</span>
          </p>
        )}
        {!commander && (
          <p className="no-commander">No commander selected. Click the crown button on any card to set it as your commander.</p>
        )}
      </div>
      
      <button className="clear-deck-button" onClick={handleClearDeck}>
        Clear Deck
      </button>
      <ToastContainer />
      <div className="card-grid">        {deck.cards.map((card, index) => (
          <div key={index} className={`card-item ${card.isCommander ? 'commander-card' : ''}`}>
            <img src={card.imageUrl} alt={card.name} className="card-image" />
            <div className="card-info">
              <div className="card-name-quantity">
                <span className="card-name">{card.name}</span>
                {card.quantity > 1 && (
                  <span className="quantity-badge">x{card.quantity}</span>
                )}
              </div>
              
              <QuantityControl
                deckId={id}
                cardName={card.name}
                currentQuantity={card.quantity || 1}
                onQuantityUpdated={(updatedDeck) => setDeck(updatedDeck)}
              />
              
              <div className="card-price-container">
                {card.price_usd && (
                  <a 
                    href={generateTCGPlayerURL(card.name)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="card-price-link"
                  >
                    <span className="card-price">${card.price_usd}</span>
                  </a>
                )}
                <PriceAlert
                  deckId={id}
                  cardName={card.name}
                  currentAlert={card.priceAlert}
                  onAlertUpdated={(updatedDeck) => setDeck(updatedDeck)}
                />
              </div>
              <div className="card-actions">
                <CommanderButton
                  deckId={id}
                  cardName={card.name}
                  isCommander={card.isCommander}
                  onCommanderUpdated={(updatedDeck) => setDeck(updatedDeck)}
                />
                <button
                  className="remove-card-button"
                  onClick={() => handleRemoveCard(card.name)}
                >
                  Remove All
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeckDetails;
