import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import CardSearch from "./components/CardSearch/CardSearch";
import Home from "./components/Home/Home";

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
