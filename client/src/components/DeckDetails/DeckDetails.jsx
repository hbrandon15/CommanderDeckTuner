import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To get the deck ID from the URL
import axios from "axios";
import "./DeckDetails.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PriceAlert from "../PriceAlert/PriceAlert";
import Notifications from "../Notifications/Notifications";

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

  // Calculate the total number of cards
  const totalCards = deck.cards.length;
  return (
    <div className="deck-details">
      <div className="deck-header">
        <h2>{deck.deckName}</h2>
        <Notifications deckId={id} />
      </div>
      <p>Total Cards: {totalCards}</p>
      <button className="clear-deck-button" onClick={handleClearDeck}>
        Clear Deck
      </button>
      <ToastContainer />
      <div className="card-grid">        {deck.cards.map((card, index) => (
          <div key={index} className="card-item">
            <img src={card.imageUrl} alt={card.name} className="card-image" />
            <div className="card-info">
              <span>{card.name} </span>
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
            </div>
            <button
              className="remove-card-button"
              onClick={() => handleRemoveCard(card.name)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeckDetails;
