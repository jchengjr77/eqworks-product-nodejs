import React from "react";
import logo from "./logo.svg";
import Locations from "./components/Locations.js";
import DailyEvents from "./components/DailyEvents.js";
import HourlyStats from "./components/HourlyStats";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="app-head">
        <img src={logo} className="logo" alt="logo" />
        <h2 className="title">EQWorks: Locations UI</h2>
        <p className="credit">Made with React</p>
      </header>
      <div className="Body">
        <Locations />
        <DailyEvents />
        <HourlyStats />
      </div>
    </div>
  );
}

export default App;
