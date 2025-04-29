import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To get the deck ID from the URL
import axios from "axios";
import "./DeckDetails.css";

const DeckDetails = () => {
  const { id } = useParams(); // Get the deck ID from the URL
  const [deck, setDeck] = useState(null); // State to store the deck
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for errors

  // Function to fetch card image from Scryfall
  const fetchCardImage = async (cardName) => {
    try {
      const response = await axios.get(
        `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}`
      );
      return response.data.image_uris.normal; // Return the normal image URL
    } catch (error) {
      console.error(`Error fetching image for card "${cardName}":`, error);
      return null; // Return null if the image can't be fetched
    }
  };

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/decks/${id}`);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  // Calculate the total number of cards
  const totalCards = deck.cards.length;

  return (
    <div className="deck-details">
      <h2>{deck.deckName}</h2>
      <p>Total Cards: {totalCards}</p> {/* Display the total number of cards */}
      <h3>Cards in this Deck:</h3>
      {deck.cards.length > 0 ? (
        <ul>
          {deck.cards.map((card, index) => (
            <li key={index} className="card-item">
              {card.imageUrl ? (
                <img src={card.imageUrl} alt={card.name} className="card-image" />
              ) : (
                <p>Image not available</p>
              )}
              <strong>{card.name}</strong> - {card.manaCost} ({card.type})
            </li>
          ))}
        </ul>
      ) : (
        <p>No cards in this deck yet.</p>
      )}
    </div>
  );
};

export default DeckDetails;