import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './QuantityControl.css';

const QuantityControl = ({ deckId, cardName, currentQuantity = 1, onQuantityUpdated }) => {
  const [quantity, setQuantity] = useState(currentQuantity);
  const [loading, setLoading] = useState(false);

  // Basic lands that can have multiple copies
  const basicLands = ["Island", "Mountain", "Plains", "Swamp", "Forest"];
  const isBasicLand = basicLands.includes(cardName);

  // Don't render if it's not a basic land
  if (!isBasicLand) {
    return null;
  }

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1 || newQuantity > 20 || newQuantity === quantity || loading) {
      return;
    }

    setLoading(true);
    try {
      const url = `http://localhost:5001/api/decks/${deckId}/cards/${encodeURIComponent(cardName)}/quantity`;
      console.log('Updating quantity:', { deckId, cardName, newQuantity, url });
      
      const response = await axios.put(url, { quantity: newQuantity });
      
      setQuantity(newQuantity);
      toast.success(`${cardName} quantity updated to ${newQuantity}`);
      
      if (onQuantityUpdated) {
        onQuantityUpdated(response.data);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update quantity';
      toast.error(errorMessage);
      
      // Reset quantity on error
      setQuantity(currentQuantity);
    } finally {
      setLoading(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < 20) {
      handleQuantityChange(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      handleQuantityChange(quantity - 1);
    }
  };

  return (
    <div className="quantity-control">
      <button 
        className="quantity-btn decrease"
        onClick={decrementQuantity}
        disabled={loading || quantity <= 1}
        title="Decrease quantity"
      >
        −
      </button>
      
      <span className="quantity-display">
        {loading ? '...' : quantity}
      </span>
      
      <button 
        className="quantity-btn increase"
        onClick={incrementQuantity}
        disabled={loading || quantity >= 20}
        title="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default QuantityControl;
