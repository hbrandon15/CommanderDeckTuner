import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Notifications.css';

const Notifications = ({ deckId }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const fetchNotifications = async () => {
    if (!deckId) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5001/api/decks/${deckId}/notifications`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [deckId]); // eslint-disable-line react-hooks/exhaustive-deps

  const markAsRead = async (index) => {
    try {
      await axios.put(`http://localhost:5001/api/decks/${deckId}/notifications/${index}/read`);
      setNotifications(prev => 
        prev.map((notification, i) => 
          i === index ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/decks/${deckId}/notifications`);
      setNotifications([]);
      toast.success('All notifications cleared');
    } catch (error) {
      console.error('Error clearing notifications:', error);
      toast.error('Failed to clear notifications');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-container">
      <button 
        className={`notifications-button ${unreadCount > 0 ? 'has-unread' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="View notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <button 
                onClick={clearAllNotifications}
                className="clear-all-button"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="notifications-list">
            {loading ? (
              <div className="loading">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="no-notifications">No notifications</div>
            ) : (
              notifications.map((notification, index) => (
                <div 
                  key={index}
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => !notification.read && markAsRead(index)}
                >
                  <div className="notification-content">
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-time">
                      {new Date(notification.timestamp).toLocaleString()}
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="unread-indicator"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
