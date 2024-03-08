import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { InnerLayout } from "./utils/Layout";
import Switch from "react-switch";

function Settings() {
  const [user, setUser] = useState({
    budget: "0",
    currency: "USD",
    subscribe: true,
    notification: true,
  });
  const authToken = localStorage.getItem("authToken");

  const getUserProfile = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API;
      const response = await fetch(`${baseUrl}/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (response.ok) {
        const { username } = result;
        setUser({ ...result, username });
      } else {
        alert(`${result.error}`);
      }
    } catch (error) {
      alert("An error occurred during fetch: " + error.message);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const handleSubscribeToggle = (checked) => {
    setUser((prevUser) => ({ ...prevUser, subscribe: checked }));
  };

  const handleNotificationToggle = (checked) => {
    setUser((prevUser) => ({ ...prevUser, notification: checked }));
  };

  return (
    <SettingsStyled>
      <InnerLayout>
        <h1>Settings</h1>
        <div className="user-settings">
          <div className="item">
            <h4>Budget</h4>
            <p>{user?.budget || "0"}</p>
          </div>
          <div className="item">
            <h4>Currency</h4>
            <p>{user?.currency || "USD"}</p>
          </div>
          <div className="item">
            <h4>Substribe Marketing Emails</h4>
            <Switch
              onChange={handleSubscribeToggle}
              checked={user.subscribe}
              className="switch"
            />
          </div>
          <div className="item">
            <h4>Receive Notifications</h4>
            <Switch
              onChange={handleNotificationToggle}
              checked={user.notification}
              className="switch"
            />
          </div>
        </div>
      </InnerLayout>
    </SettingsStyled>
  );
}

const SettingsStyled = styled.div`
  h1 {
    color: rgba(34, 34, 126, 1);
  }
  .user-settings {
    padding: 6rem 2.5rem;
    margin-top: 6rem;
    height: 100px;
    display: flex;
    align-items: left;
    justify-content: center;
    gap: 2rem;
    flex-direction: column;
    .item {
      display: flex;
      align-items: center;
      gap: 2rem;

      h4 {
        font-size: 2rem;
        color: rgba(0, 0, 0, 0.6);
      }

      p {
        font-size: 1.8rem;
        color: rgba(0, 0, 0, 0.8);
        font-family: "Roboto";
        margin-left: auto;
      }
      .switch {
        margin-left: auto;
      }
    }
  }
`;

export default Settings;
