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
  const [editingField, setEditingField] = useState(null);
  const currencies = ["USD", "CAD", "CNY", "EUR", "GBP", "JPY"];
  const baseUrl = process.env.REACT_APP_API;

  const getUserProfile = async () => {
    try {
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

  const handleSubscribeToggle = async (checked) => {
    setUser((prevUser) => ({ ...prevUser, subscribe: checked }));
    await saveToggleChanges("subscribe", checked);
  };

  const handleNotificationToggle = async (checked) => {
    setUser((prevUser) => ({ ...prevUser, notification: checked }));
    await saveToggleChanges("notification", checked);
  };

  const saveToggleChanges = async (field, value) => {
    if (value === user[field]) {
      alert("No changes detected");
      return;
    }

    const updateData = {
      budget: user.budget,
      currency: user.currency,
      subscribe: user.subscribe,
      notification: user.notification,
    };

    updateData[field] = value;

    try {
      const response = await fetch(`${baseUrl}/auth/update/${user.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const result = await response.json();
        alert(`Failed to update profile: ${result.error}`);
      } else {
        alert("Profile updated successfully");
      }
    } catch (error) {
      alert("An error occurred during update: " + error.message);
    }
  };

  const handleEditStart = (field) => {
    setEditingField(field);
  };

  const handleEditSave = async () => {
    // Save the changes to the database
    const updateData = {
      budget: user.budget,
      currency: user.currency,
      subscribe: user.subscribe,
      notification: user.notification,
    };

    try {
      const baseUrl = process.env.REACT_APP_API;
      const response = await fetch(`${baseUrl}/auth/update/${user.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const result = await response.json();
        alert(`Failed to update profile: ${result.error}`);
        return;
      }
      alert("Profile updated successfully");
      setEditingField(null);
      getUserProfile();
    } catch (error) {
      alert("An error occurred during update: " + error.message);
    }
  };

  const handleEditCancel = () => {
    // Cancel the edit mode
    setEditingField(null);
  };

  const handleInputChange = (e) => {
    setUser((prevUser) => ({
      ...prevUser,
      [editingField]: e.target.value,
    }));
  };

  const handleCurrencyChange = (selectedCurrency) => {
    setUser((prevUser) => ({ ...prevUser, currency: selectedCurrency }));
  };

  return (
    <SettingsStyled>
      <InnerLayout>
        <h1>Settings</h1>
        <div className="user-settings">
          <div className="item">
            <h4>Budget</h4>
            {editingField === "budget" ? (
              <>
                <input
                  type="text"
                  value={user.budget}
                  onChange={handleInputChange}
                  style={{ fontSize: "1.5rem" }}
                />
                <button onClick={handleEditSave} style={{ fontSize: "1.5rem" }}>
                  Save
                </button>
                <button
                  onClick={handleEditCancel}
                  style={{ fontSize: "1.5rem" }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <p onClick={() => handleEditStart("budget")}>
                {parseInt(user.budget).toLocaleString()}
              </p>
            )}
          </div>
          <div className="item">
            <h4>Currency</h4>
            {editingField === "currency" ? (
              <>
                <select
                  value={user.currency}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                  style={{ fontSize: "1.5rem" }}
                >
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
                <button onClick={handleEditSave} style={{ fontSize: "1.5rem" }}>
                  Save
                </button>
                <button
                  onClick={handleEditCancel}
                  style={{ fontSize: "1.5rem" }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <p onClick={() => handleEditStart("currency")}>{user.currency}</p>
            )}
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
