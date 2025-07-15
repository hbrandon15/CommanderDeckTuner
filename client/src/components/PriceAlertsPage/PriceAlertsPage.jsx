import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import PriceAlert from '../PriceAlert/PriceAlert';
import 'react-toastify/dist/ReactToastify.css';
import './PriceAlertsPage.css';

const PriceAlertsPage = () => {
  const [priceAlertCards, setPriceAlertCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cardImages, setCardImages] = useState({});

  // Function to fetch card image from Scryfall
  const fetchCardImage = async (cardName) => {
    try {
      const response = await axios.get(
        `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}`
      );
      return response.data.image_uris.normal;
    } catch (error) {
      console.error(`Error fetching image for card "${cardName}":`, error);
      return null;
    }
  };

  // Function to generate TCGPlayer URL for a card
  const generateTCGPlayerURL = (cardName) => {
    const encodedCardName = encodeURIComponent(cardName);
    return `https://www.tcgplayer.com/search/magic/product?q=${encodedCardName}&view=grid`;
  };

  const fetchPriceAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/decks/price-alerts/all');
      setPriceAlertCards(response.data);
      
      // Fetch images for all cards with price alerts
      const imagePromises = response.data.map(async (card) => {
        const imageUrl = await fetchCardImage(card.cardName);
        return { cardName: card.cardName, imageUrl };
      });
      
      const images = await Promise.all(imagePromises);
      const imageMap = {};
      images.forEach(({ cardName, imageUrl }) => {
        imageMap[cardName] = imageUrl;
      });
      setCardImages(imageMap);
      
    } catch (error) {
      console.error('Error fetching price alerts:', error);
      setError('Failed to load price alerts. Please try again.');
      toast.error('Failed to load price alerts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPriceAlerts();
  }, [fetchPriceAlerts]);

  const handleAlertUpdated = () => {
    // Refresh the price alerts list when an alert is updated
    fetchPriceAlerts();
    toast.success('Price alert updated successfully!');
  };

  const formatCondition = (condition) => {
    return condition === 'above' ? 'Above' : 'Below';
  };

  const getPriceStatus = (card) => {
    if (!card.currentPrice || !card.priceAlert.targetPrice) return null;
    
    const currentPrice = parseFloat(card.currentPrice);
    const targetPrice = parseFloat(card.priceAlert.targetPrice);
    const condition = card.priceAlert.condition;
    
    if (condition === 'above' && currentPrice >= targetPrice) {
      return 'triggered';
    } else if (condition === 'below' && currentPrice <= targetPrice) {
      return 'triggered';
    }
    return 'waiting';
  };

  if (loading) return <div className="loading">Loading price alerts...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="price-alerts-page">
      <div className="page-header">
        <h1>Price Alerts</h1>
        <p className="page-description">
          Monitor your cards and get notified when prices reach your target thresholds.
        </p>
      </div>

      {priceAlertCards.length === 0 ? (
        <div className="no-alerts">
          <h3>No Price Alerts Set</h3>
          <p>You haven't set any price alerts yet. Visit your decks to set up alerts for specific cards.</p>
          <Link to="/decks" className="link-button">
            Go to Your Decks
          </Link>
        </div>
      ) : (
        <div className="alerts-container">
          <div className="alerts-summary">
            <h3>Active Price Alerts ({priceAlertCards.length})</h3>
          </div>

          <div className="alerts-grid">
            {priceAlertCards.map((card) => {
              const priceStatus = getPriceStatus(card);
              return (
                <div key={`${card.deckId}-${card.cardName}`} className={`alert-card ${priceStatus}`}>
                  <div className="card-image-container">
                    {cardImages[card.cardName] ? (
                      <img
                        src={cardImages[card.cardName]}
                        alt={card.cardName}
                        className="card-image"
                      />
                    ) : (
                      <div className="image-placeholder">Loading...</div>
                    )}
                  </div>
                  
                  <div className="card-details">
                    <h4 className="card-name">{card.cardName}</h4>
                    <p className="deck-name">
                      From: <Link to={`/decks/${card.deckId}`}>{card.deckName}</Link>
                    </p>
                    
                    <div className="price-info">
                      <div className="current-price">
                        {card.currentPrice ? (
                          <a
                            href={generateTCGPlayerURL(card.cardName)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="price-link"
                          >
                            Current: <span className="price">${card.currentPrice}</span>
                          </a>
                        ) : (
                          <span className="price-unavailable">Price unavailable</span>
                        )}
                      </div>
                      
                      <div className="alert-info">
                        <span className="alert-condition">
                          Alert when {formatCondition(card.priceAlert.condition)} ${card.priceAlert.targetPrice}
                        </span>
                        {priceStatus === 'triggered' && (
                          <span className="status-badge triggered">🔴 Triggered</span>
                        )}
                        {priceStatus === 'waiting' && (
                          <span className="status-badge waiting">⏳ Waiting</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="alert-actions">
                      <PriceAlert
                        deckId={card.deckId}
                        cardName={card.cardName}
                        currentAlert={card.priceAlert}
                        onAlertUpdated={handleAlertUpdated}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <ToastContainer />
    </div>
  );
};

export default PriceAlertsPage;
