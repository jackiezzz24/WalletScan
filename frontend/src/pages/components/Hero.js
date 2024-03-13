import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import "../../App.css";
import "../components/styles/Hero.css";
import { useLocation } from "react-router-dom";

function Hero() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("authToken")
  );

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("authToken"));
  }, [localStorage.getItem("authToken"), location.pathname]);

  return (
    <div className="hero-container">
      <h1>
        Scan, Track, Thriv: <br />
        Your Daily Expenses, Simplified.
      </h1>
      <div className="hero-btns">
        {!isAuthenticated && (
          <Button
            className="btns"
            buttonStyle="btn--outline"
            buttonSize="btn--large"
          >
            Create an Account
          </Button>
        )}
      </div>
    </div>
  );
}

export default Hero;
