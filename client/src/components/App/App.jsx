import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import CardSearch from "../CardSearch/CardSearch";
import Home from "../Home/Home";
import DeckDetails from "../DeckDetails/DeckDetails";
import DeckList from "../DeckList/DeckList"; // Import DeckList

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home page */}
        <Route path="/search" element={<CardSearch />} /> {/* Search page */}
        <Route path="/decks" element={<DeckList />} /> {/* Deck List */}
        <Route path="/decks/:id" element={<DeckDetails />} /> {/* Deck Details */}
      </Routes>
    </Router>
  );
};

export default App;
