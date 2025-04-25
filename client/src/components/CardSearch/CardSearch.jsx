import React, { useState, useEffect } from "react"; // Added useEffect for fetching decks
import { searchCards } from "../../api/scryfall"; // API function for card search
import axios from "axios"; // For making API requests to the backend
import "./CardSearch.css"; // Styles for the CardSearch component

const CardSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [deck, setDeck] = useState([]); // State to store the current deck
  const [decks, setDecks] = useState([]); // State to store the list of decks
  const [selectedDeck, setSelectedDeck] = useState(""); // State to store the selected deck ID
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch the list of decks from the backend when the component loads
  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/decks");
        setDecks(response.data);
      } catch (error) {
        console.error("Error fetching decks:", error);
      }
    };

    fetchDecks();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await searchCards(query);
      setResults(data.data); // Scryfall returns results in a `data` array
    } catch {
      setError("Failed to fetch cards. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToDeck = async (card) => {
    if (!selectedDeck) {
      alert("Please select a deck first!");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5001/api/decks/${selectedDeck}/cards`,
        {
          name: card.name,
          manaCost: card.mana_cost,
          type: card.type_line,
        }
      );

      // Update the local deck state with the updated deck from the backend
      setDeck(response.data.cards);
    } catch (error) {
      console.error("Error adding card to deck:", error);
    }
  };

  return loading ? (
    <p>Loading...</p>
  ) : (
    <div className="search-container">
      <h2>Search for Magic Cards</h2>
      <input
        type="text"
        placeholder="Enter card name or type..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
      <button onClick={handleSearch} className="search-button">
        Search
      </button>
      {error && <p className="error-message">{error}</p>}

      {/* Deck selection dropdown */}
      <div className="deck-selection">
        <h3>Select a Deck</h3>
        <select
          value={selectedDeck}
          onChange={(e) => setSelectedDeck(e.target.value)}
        >
          <option value="">-- Select a Deck --</option>
          {decks.map((deck) => (
            <option key={deck._id} value={deck._id}>
              {deck.deckName}
            </option>
          ))}
        </select>
      </div>

      <div className="results-container">
        {results.slice(0, 20).map((card) => (
          <div key={card.id} className="card-container">
            {card.image_uris ? (
              <img
                src={card.image_uris.png || card.image_uris.normal}
                alt={card.name}
                className="card-image"
                loading="lazy"
              />
            ) : (
              <div className="image-placeholder">Loading...</div>
            )}
            <h3>{card.name}</h3>
            <p>
              <strong>Mana Cost:</strong> {card.mana_cost || "N/A"}
            </p>
            <p>
              <strong>Type:</strong> {card.type_line}
            </p>
            <p>
              <strong>Oracle Text:</strong> {card.oracle_text || "N/A"}
            </p>
            <p>
              <strong>Set:</strong> {card.set_name}
            </p>
            <button
              className="add-to-deck-button"
              onClick={() => handleAddToDeck(card)}
            >
              Add to Deck
            </button>
          </div>
        ))}
      </div>

      <div className="deck-container">
        <h2>Your Deck</h2>
        <ul>
          {deck.map((card, index) => (
            <li key={index}>{card.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CardSearch;
