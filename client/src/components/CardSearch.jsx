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
        {results.slice(0,20).map((card) => ( // Limit to 20 results
          <div key={card.id} className="card-container">
            {card.image_uris ? (
             <img
			 src={card.image_uris.png || card.image_uris.normal} // Fallback to 'normal' if 'png' is unavailable
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardSearch;
