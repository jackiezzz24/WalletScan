import React from "react";
import "./App.css";
import Navbar from "./pages/components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import SignUp from './pages/SignUp';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home/>}></Route>
          <Route path="/register" exact element={<SignUp/>}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
