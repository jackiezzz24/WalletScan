import React from "react";
import "./App.css";
import Navbar from "./pages/components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import { TransactionProvider } from "./pages/components/TransactionContext";

function App() {
  return (
    <TransactionProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  </TransactionProvider>
  );
}

export default App;
