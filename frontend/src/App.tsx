import React from "react";
import "./App.css";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import QuickStart from "./pages/QuickStart";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Divider } from "@mui/material";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/dashboard/" element={<Dashboard />}></Route>
        <Route path="/quickstart/" element={<QuickStart />}></Route>
      </Routes>
      <Divider />
      <Footer />
    </Router>
  );
}

export default App;
