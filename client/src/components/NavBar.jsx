import React from "react";
import "./NavBar.css"; // Import the CSS for styling

const NavBar = () => {
  return (
    <nav className="navbar">
      <h1 className="navbar-title">Commander Deck Tuner</h1>
      <ul className="navbar-links">
        <li><a href="#search">Search</a></li>
        <li><a href="#deck">Your Deck</a></li>
      </ul>
    </nav>
  );
};

export default NavBar;