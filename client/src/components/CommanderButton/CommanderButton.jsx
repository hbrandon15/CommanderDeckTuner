import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './CommanderButton.css';

const CommanderButton = ({ deckId, cardName, isCommander, onCommanderUpdated }) => {
  const [loading, setLoading] = useState(false);

  const handleSetCommander = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const url = `http://localhost:5001/api/decks/${deckId}/cards/${encodeURIComponent(cardName)}/commander`;
      console.log('Setting commander:', { deckId, cardName, url });
      
      const response = await axios.put(url);
      
      toast.success(`${cardName} is now your Commander!`);
      if (onCommanderUpdated) {
        onCommanderUpdated(response.data);
      }
    } catch (error) {
      console.error('Error setting commander:', error);
      const errorMessage = error.response?.data?.message || 'Failed to set commander';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCommander = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const url = `http://localhost:5001/api/decks/${deckId}/commander`;
      console.log('Removing commander from deck:', deckId);
      
      const response = await axios.delete(url);
      
      toast.success('Commander removed');
      if (onCommanderUpdated) {
        onCommanderUpdated(response.data);
      }
    } catch (error) {
      console.error('Error removing commander:', error);
      const errorMessage = error.response?.data?.message || 'Failed to remove commander';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (isCommander) {
    return (
      <button 
        className="commander-button active"
        onClick={handleRemoveCommander}
        disabled={loading}
        title="Remove as Commander"
      >
        👑 Commander
      </button>
    );
  }

  return (
    <button 
      className="commander-button"
      onClick={handleSetCommander}
      disabled={loading}
      title="Set as Commander"
    >
      {loading ? '⏳' : '👑'}
    </button>
  );
};

export default CommanderButton;
