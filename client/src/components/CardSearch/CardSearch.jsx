import React, { useState, useEffect } from "react";
import { searchCards } from "../../api/scryfall"; // API function for card search
import axios from "axios"; // For making API requests to the backend
import { Link } from "react-router-dom";
import "./CardSearch.css"; // Styles for the CardSearch component

const CardSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [decks, setDecks] = useState([]); // State to store the list of decks
  const [newDeckName, setNewDeckName] = useState(""); // State for the new deck name
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState(""); // State for selected deck

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

  const handleCreateDeck = async () => {
    if (!newDeckName.trim()) {
      alert("Please enter a deck name!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/api/decks", {
        deckName: newDeckName,
        cards: [],
      });

      // Add the new deck to the list of decks
      setDecks((prevDecks) => [...prevDecks, response.data]);

      // Clear the new deck name input
      setNewDeckName("");
    } catch (error) {
      console.error("Error creating new deck:", error);
    }
  };

  const handleAddToDeck = async (card) => {
    if (!selectedDeck) {
      alert("Please select a deck first!");
      return;
    }

    try {
      console.log("Adding card to deck:", selectedDeck, card); // Debug log

      const response = await axios.post(
        `http://localhost:5001/api/decks/${selectedDeck}/cards`,
        {
          name: card.name,
          manaCost: card.mana_cost,
          type: card.type_line,
        }
      );

      console.log("Card added to deck:", response.data); // Debug log
      alert(`Card "${card.name}" added to the deck!`);
    } catch (error) {
      console.error("Error adding card to deck:", error); // Debug log
      alert("Failed to add card to the deck. Please try again.");
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

      {/* Deck selection cards */}
      <div className="deck-cards">
        <h3>Select a Deck</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {decks.map((deck) => (
            <div
              key={deck._id}
              style={{
                cursor: "pointer",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: selectedDeck === deck._id ? "#d3f9d8" : "white",
                textAlign: "center",
                width: "150px",
                boxShadow:
                  selectedDeck === deck._id
                    ? "0 0 10px rgba(0, 128, 0, 0.5)"
                    : "0 0 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h4>{deck.deckName}</h4>
              <Link to={`/decks/${deck._id}`}>View Deck</Link> {/* Link to DeckDetails */}
            </div>
          ))}
        </div>
      </div>

      {/* Create a new deck */}
      <div className="create-deck">
        <h3>Create a New Deck</h3>
        <input
          type="text"
          placeholder="Enter new deck name..."
          value={newDeckName}
          onChange={(e) => setNewDeckName(e.target.value)}
          className="new-deck-input"
        />
        <button onClick={handleCreateDeck} className="create-deck-button">
          Create Deck
        </button>
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
              disabled={!selectedDeck} // Disable if no deck is selected
            >
              Add to Deck
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardSearch;
