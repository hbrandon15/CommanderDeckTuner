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
        // Fetch full deck details to get commander information
        const decksWithDetails = await Promise.all(
          response.data.map(async (deck) => {
            try {
              const deckResponse = await axios.get(`http://localhost:5001/api/decks/${deck._id}`);
              return deckResponse.data;
            } catch (error) {
              console.error(`Error fetching details for deck ${deck._id}:`, error);
              return deck; // Return basic deck info if detailed fetch fails
            }
          })
        );
        setDecks(decksWithDetails); // Set the list of decks with commander info
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
          {decks.map((deck) => {
            const commander = deck.cards?.find(card => card.isCommander);
            const totalCards = deck.cards?.reduce((total, card) => total + (card.quantity || 1), 0) || 0;
            const uniqueCards = deck.cards?.length || 0;
            return (
              <li key={deck._id} className="deck-item">
                <div className="deck-main-info">
                  <Link to={`/decks/${deck._id}`} className="deck-name">{deck.deckName}</Link>
                  <span className="card-count">({totalCards} cards, {uniqueCards} unique)</span>
                </div>
                {commander && (
                  <div className="deck-commander">
                    <span className="commander-icon">👑</span>
                    <span className="commander-text">{commander.name}</span>
                  </div>
                )}
                {!commander && (
                  <div className="no-commander-text">No commander selected</div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No decks available. Create one in the search page!</p>
      )}
    </div>
  );
};

export default DeckList;