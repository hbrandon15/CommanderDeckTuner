import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleButtonClick = () => {
    setOutputValue(`You entered: ${inputValue}`);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Commander Deck Tuner</h1>
      <input
        type="text"
        placeholder="Enter something..."
        value={inputValue}
        onChange={handleInputChange}
        style={{ padding: "10px", width: "300px" }}
      />
      <button
        onClick={handleButtonClick}
        style={{ marginLeft: "10px", padding: "10px 20px" }}
      >
        Submit
      </button>
      <p style={{ marginTop: "20px", fontSize: "18px" }}>{outputValue}</p>
    </div>
  );
}

export default App;
