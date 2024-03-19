import React, { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useNavigate } from "react-router-dom";

function Loading() {
  const [data, setData] = useState([]);
  const [loading, setloading] = useState(undefined);
  const [completed, setcompleted] = useState(undefined);
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");
  const baseUrl = process.env.REACT_APP_API;

  useEffect(() => {
    setTimeout(() => {
      fetch(`${baseUrl}/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          setData(json);
          setloading(true);

          setTimeout(() => {
            setcompleted(true);
          }, 1000);
        });
    }, 2000);
  }, []);

  useEffect(() => {
    if (completed) {
      navigate("/dashboard");
    }
  }, [completed, navigate]);

  return (
    <>
      {!completed ? (
        <>
          {!loading ? (
            <div className="spinner-container">
              <div className="spinner">
                <span>Loading...</span>
                <div className="half-spinner"></div>
              </div>
            </div>
          ) : (
            <div className="completed">&#x2713;</div>
          )}
        </>
      ) : null}
    </>
  );
}

export default Loading;
