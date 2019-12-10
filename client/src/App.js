import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Locations from "./components/Locations.js";

function App() {
  return (
    <div className="App">
      <header className="app-head">
        <img src={logo} className="App-logo logo" alt="logo" />
        <h2 className="title">EQWorks: Locations UI</h2>
        <p className="credit">Made with React</p>
      </header>
      <div className="Body">
        <Locations />
      </div>
    </div>
  );
}

export default App;
