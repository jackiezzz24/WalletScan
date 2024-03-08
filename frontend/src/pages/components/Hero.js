import React from "react";
import { Button } from "./Button";
import "../../App.css";
import "../components/styles/Hero.css";

function Hero() {
  return (
    <div className="hero-container">
      <h1>
        Scan, Track, Thriv: <br />
        Your Daily Expenses, Simplified.
      </h1>
      <div className="hero-btns">
        <Button
          className="btns"
          buttonStyle="btn--outline"
          buttonSize="btn--large"
        >
          Create an Account
        </Button>
      </div>
    </div>
  );
}

export default Hero;
