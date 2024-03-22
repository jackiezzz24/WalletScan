import React from "react";
import "./App.css";
import Navbar from "./pages/components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Loading from "./pages/components/Loading";
import { TransactionProvider } from "./pages/components/TransactionContext";


function App() {
  return (
    <Router>
    <TransactionProvider> 
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/loading" element={<Loading />} /> 
      </Routes>
    </TransactionProvider>
  </Router>
  );
}

export default App;
