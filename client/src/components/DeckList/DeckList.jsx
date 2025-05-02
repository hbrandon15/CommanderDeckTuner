import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./DeckList.css";

const DeckList = () => {
  const [decks, setDecks] = useState([]); // State to store the list of decks
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for errors

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/decks");
        setDecks(response.data); // Set the list of decks
      } catch (error) {
        console.error("Error fetching decks:", error);
        setError("Failed to load decks. Please try again.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchDecks();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="deck-list">
      <h2 className="deck-list-title">Your Decks</h2> {/* Title header */}
      {decks.length > 0 ? (
        <ul>
          {decks.map((deck) => (
            <li key={deck._id}>
              <Link to={`/decks/${deck._id}`}>{deck.deckName}</Link> {/* Link to DeckDetails */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No decks available. Create one in the search page!</p>
      )}
    </div>
  );
};

export default DeckList;