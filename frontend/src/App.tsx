import React from "react";
import "./App.css";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Header></Header>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/dashboard/" element={<Dashboard />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
