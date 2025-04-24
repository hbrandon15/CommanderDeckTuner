import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import CardSearch from "./components/CardSearch";

const Home = () => <h2>Welcome to Commander Deck Tuner!</h2>; // Example Home page

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home page */}
        <Route path="/search" element={<CardSearch />} /> {/* Search page */}
      </Routes>
    </Router>
  );
};

export default App;
