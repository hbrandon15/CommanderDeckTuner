import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./DeckList.css";

function showAlert(message) {
  window.alert(message);
}

// COMPONENT TO DISPLAY LIST OF DECKS
const DeckList = () => {
  const [decks, setDecks] = useState([]); // State to store the list of decks
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for errors
  const [pastedText, setPastedText] = useState(""); // State for pasted text
  const [showImportModal, setShowImportModal] = useState(false); // State to control import modal visibility

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/decks");
        // Fetch full deck details to get commander information
        const decksWithDetails = await Promise.all(
          response.data.map(async (deck) => {
            try {
              const deckResponse = await axios.get(
                `http://localhost:5001/api/decks/${deck._id}`
              );
              return deckResponse.data;
            } catch (error) {
              console.error(
                `Error fetching details for deck ${deck._id}:`,
                error
              );
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

    /**
     * Converts a string list of cards (e.g. "4x Sol Ring") into an array of card objects
     * with name and quantity properties.
     */
    const parseCardList = (text) => {
      const lines = text.split("\n").filter((line) => line.trim() !== "");

      return lines.map((line) => {
        // Regex looks for leading digits followed by an optional 'x' or 'X' and whitespace
        const match = line.match(/^(\d+)[xX]?\s+(.+)$/);

        if (match) {
          return {
            name: match[2].trim(),
            quantity: parseInt(match[1]),
          };
        }

        // Default to quantity of 1 if no number is specified (e.g. "Sol Ring")
        return { name: line.trim(), quantity: 1 };
      });
    };

    /**
     *  Handle paste import
     *  */
    const handlePasteImport = async () => {
		if (!pastedText.trim()) {
			setError("Please paste a valid card list to import.");
			return;
		}
		const parsedCards = parseCardList(pastedText);

		try{
			const response = await axios.post("http://localhost:5001/api/decks", {
				deckName: "Imported Deck",
				cards: parsedCards,
			});
			setDecks([...decks, response.data]);
			setPastedText(""); // Clear pasted text
			setShowImportModal(false); // Close modal
			alert("Deck imported successfully!");
		}
		catch(error){
			setError("Failed to import deck. Please try again.");
		}
	};
      
    fetchDecks();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  // RENDER THE LIST OF DECKS
  return (
    <div className="deck-list">
      <div className="deck-header">
        <button onClick={() => showAlert("This is a test alert!")}>
          Test Alert
        </button>
        <h2 className="deck-list-title">Your Decks</h2>
      </div>

	  {showImportModal && (
		<div className="import-modal">
			<textarea
				value={pastedText}
				onChange={(e) => setPastedText(e.target.value)}
				placeholder="Paste your card list here..."
				rows="10"
			/>
			<button onClick={handlePasteImport}>Import Deck</button>
			<button onClick={() => setShowImportModal(false)}>Cancel</button>
		</div>
	  )}

      {decks.length > 0 ? (
        <ul>
          {decks.map((deck) => {
            const commander = deck.cards?.find((card) => card.isCommander);
            const totalCards =
              deck.cards?.reduce(
                (total, card) => total + (card.quantity || 1),
                0
              ) || 0;
            const uniqueCards = deck.cards?.length || 0;
            return (
              <li key={deck._id} className="deck-item">
                <div className="deck-main-info">
                  <Link to={`/decks/${deck._id}`} className="deck-name">
                    {deck.deckName}
                  </Link>
                  <span className="card-count">
                    ({totalCards} cards, {uniqueCards} unique)
                  </span>
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
