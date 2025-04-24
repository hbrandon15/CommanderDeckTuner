import React from "react"; // Needed to define the component
import "./Home.css"; // Optional: Import styles for the Home component

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Commander Deck Tuner!</h1>
      <p>Build and manage your Commander decks with ease.</p>
      <p>Use the search feature to find cards and add them to your deck.</p>
    </div>
  );
};

export default Home;