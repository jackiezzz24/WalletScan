import React from "react";
import "./App.css";
import Navbar from "./pages/components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import { TransactionProvider } from "./pages/components/TransactionContext";
import Loading from "./pages/components/Loading";

function App() {
  return (
    <TransactionProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/loading" element={<Loading />} />
      </Routes>
    </Router>
  </TransactionProvider>
  );
}

export default App;
