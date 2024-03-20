import React, { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useNavigate } from "react-router-dom";
import { useTransactionsContext } from "./TransactionContext";

function Loading() {
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();
  const { user } = useTransactionsContext();
  const baseUrl = process.env.REACT_APP_API;

  useEffect(() => {
    if (user) {
      setLoading(false);
      setCompleted(true);
    }
  }, [user]);

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
