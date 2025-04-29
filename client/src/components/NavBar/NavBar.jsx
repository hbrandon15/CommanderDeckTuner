import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./NavBar.css";

const NavBar = () => {
  return (
    <nav className="navbar">
      <h1 className="navbar-title">Commander Deck Tuner</h1>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link> {/* Navigate to the Home page */}
        </li>
        <li>
          <Link to="/search">Search</Link> {/* Navigate to the Search page */}
        </li>
        <li>
          <Link to="/decks/:id">Your Deck</Link> {/* Replace anchor link */}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
