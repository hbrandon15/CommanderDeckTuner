import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import CardSearch from "../CardSearch/CardSearch";
import Home from "../Home/Home";

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
