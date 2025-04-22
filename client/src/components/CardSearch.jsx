import React, { useState } from "react";
import { searchCards } from "../api/scryfall";

const CardSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      setError("");
      const data = await searchCards(query);
      setResults(data.data); // Scryfall returns results in a `data` array
    } catch (err) {
      setError("Failed to fetch cards. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Search for Magic Cards</h2>
      <input
        type="text"
        placeholder="Enter card name or type..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />
      <button
        onClick={handleSearch}
        style={{ marginLeft: "10px", padding: "10px 20px" }}
      >
        Search
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ marginTop: "20px" }}>
        {results.map((card) => (
          <div key={card.id} style={{ marginBottom: "10px" }}>
            {card.image_uris ? (
              <img src={card.image_uris.small} alt={card.name} />
            ) : (
              <p>No image available</p>
            )}
            <p>{card.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardSearch;
