import React, { useState } from "react";
import "./styles/Footer.css";
import { Button } from "./Button";

function Footer() {
  const [email, setEmail] = useState("");

  const onSubscribeTapped = async (event) => {
    event.preventDefault();
    try {
      if (!email) {
        alert("Please fill in your email.");
        return;
      }
      const url = `${process.env.REACT_APP_API}/subscribe/save`;
      console.log("URL:", url);
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      };
      const response = await fetch(url, requestOptions);

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
      } else {
        const errorResult = await response.json();
        console.log("Error Result:", errorResult);
        alert(`Error: ${errorResult.error}`);
      }
    } catch (error) {
      console.error("Error during subscribe:", error);
      alert("An error occurred during subscribe. Please try again later.");
    }
  };

  return (
    <div className="footer-container">
      <section className="footer-subscription">
        <p className="footer-subscription-heading">
          Join the WalletScan newsletter to receive our best deals
        </p>
        <p className="footer-subscription-text">
          You can unsubscribe at any time.
        </p>
        <div className="input-areas">
          <form>
            <input
              className="footer-input"
              name="email"
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
            <Button buttonStyle="btn--outline" onClick={onSubscribeTapped}>
              Subscribe
            </Button>
          </form>
        </div>
      </section>
      <section>
        <small class="website-rights">WalletScan © 2024</small>
      </section>
    </div>
  );
}

export default Footer;
