import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './PriceAlert.css';

const PriceAlert = ({ deckId, cardName, currentAlert, onAlertUpdated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [enabled, setEnabled] = useState(currentAlert?.enabled || false);
  const [targetPrice, setTargetPrice] = useState(currentAlert?.targetPrice || '');
  const [condition, setCondition] = useState(currentAlert?.condition || 'above');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5001/api/decks/${deckId}/cards/${encodeURIComponent(cardName)}/alert`,
        {
          enabled,
          targetPrice: enabled ? parseFloat(targetPrice) : null,
          condition
        }
      );
      
      toast.success('Price alert updated successfully!');
      setIsOpen(false);
      if (onAlertUpdated) {
        onAlertUpdated(response.data);
      }
    } catch (error) {
      console.error('Error updating price alert:', error);
      toast.error('Failed to update price alert');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEnabled(currentAlert?.enabled || false);
    setTargetPrice(currentAlert?.targetPrice || '');
    setCondition(currentAlert?.condition || 'above');
    setIsOpen(false);
  };

  return (
    <div className="price-alert-container">
      <button 
        className={`alert-button ${enabled ? 'active' : ''}`}
        onClick={() => setIsOpen(true)}
        title="Set price alert"
      >
        🔔
      </button>

      {isOpen && (
        <div className="alert-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="alert-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Price Alert for {cardName}</h3>
            
            <div className="alert-form">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                />
                Enable price alert
              </label>

              {enabled && (
                <>
                  <div className="form-group">
                    <label>Alert when price goes:</label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                    >
                      <option value="above">Above</option>
                      <option value="below">Below</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Target price ($):</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(e.target.value)}
                      placeholder="Enter target price"
                    />
                  </div>
                </>
              )}

              <div className="modal-buttons">
                <button onClick={handleCancel} className="cancel-button">
                  Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  className="save-button"
                  disabled={loading || (enabled && !targetPrice)}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceAlert;
