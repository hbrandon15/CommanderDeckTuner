import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To get the deck ID from the URL
import axios from "axios";
import "./DeckDetails.css";

const DeckDetails = () => {
  const { id } = useParams(); // Get the deck ID from the URL
  const [deck, setDeck] = useState(null); // State to store the deck
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for errors

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/decks/${id}`);
        setDeck(response.data); // Set the deck data
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

  return (
    <div className="deck-details">
      <h2>{deck.deckName}</h2>
      <h3>Cards in this Deck:</h3>
      {deck.cards.length > 0 ? (
        <ul>
          {deck.cards.map((card, index) => (
            <li key={index}>
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