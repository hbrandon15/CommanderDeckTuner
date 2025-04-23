import React, { useState } from "react";
import { searchCards } from "../api/scryfall";
import "./CardSearch.css"; // Assuming you have some CSS for styling


const CardSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      <div className="results-container">
        {results.map((card) => (
          <div key={card.id} className="card-container">
            {card.image_uris ? (
              <img
                src={card.image_uris.large} // Use 'large' for high-quality images
                alt={card.name}
                className="card-image"
              />
            ) : (
              <p>No image available</p>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardSearch;
