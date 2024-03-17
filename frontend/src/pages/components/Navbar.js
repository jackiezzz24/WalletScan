import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import { Link, useNavigate } from "react-router-dom";
import "./styles/Navbar.css";

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setIsAuthenticated(!!authToken);
  }, [localStorage.getItem("authToken")]);
  

  window.addEventListener("resize", showButton);

  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem("authToken");
    alert("User Logout");
    navigate("/");
    setIsAuthenticated(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            WalletScan
            <i className="fa-solid fa-qrcode fa-fw" />
          </Link>
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link
                  to="/dashboard"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
              </li>
            )}
            <li>
              {isAuthenticated ? (
                <Link
                  to="/"
                  className="nav-links-mobile"
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                >
                  Logout
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="nav-links-mobile"
                  onClick={closeMobileMenu}
                >
                  Sign Up
                </Link>
              )}
            </li>
          </ul>
          {button && (
            <Button
              buttonStyle="btn--outline"
              onClick={(event) => {
                if (isAuthenticated) {
                  handleLogout(event);
                }
              }}
            >
              {isAuthenticated ? "Log Out" : "Sign Up"}
            </Button>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
