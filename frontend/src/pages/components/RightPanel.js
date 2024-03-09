import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { rightItems } from "./utils/RightItems";
import profile_image from "../../assets/images/profile_image.png";
import { useProfileContext } from './ProfileContext';

function RightPanel({ active, setActive, setShowForm }) {

  const [user, setUser] = useState(null);
  const authToken = localStorage.getItem('authToken');
  const { profileImageUrl  } = useProfileContext();

  const getUserProfile = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API;
      const response = await fetch(`${baseUrl}/auth/profile`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        }
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
  },[]);

  useEffect(() => {
    setUser((prevUser) => ({
      ...prevUser,
      profile_img: profileImageUrl,
    }));
  }, [profileImageUrl]);

  return (
    <RightPanelStyled>
      <div className="user-con">
        <img src={user?.profile_img || profile_image} alt="" />
      </div>
      <div className="text">
        <h2>Welcome {user?.username || 'Guest'}!</h2>
      </div>
      <ul className="right-items">
        {rightItems.map((item) => {
          return (
            <li
              key={item.id}
              onClick={() => setActive(item.id)}
              className={active === item.id ? "active" : ""}
            >
              {item.icon}
              <span>{item.title}</span>
            </li>
          );
        })}
      </ul>
      <button className="button" onClick={() => {
        setActive(8);
        setShowForm(true);
      }}>
        <i className="fa-solid fa-plus" style={{ marginRight: "8px" }}></i>
        Add Transactions
      </button>
    </RightPanelStyled>
  );
}

const RightPanelStyled = styled.nav`
  padding: 3rem 1.5rem;
  width: 374px;
  height: 55%;
  background: rgba(252, 246, 249, 0.78);
  border: 3px solid #ffffff;
  backdrop-filter: blur(4.5px);
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  .user-con {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    img {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      object-fit: cover;
      background: #fcf6f9;
      border: 2px solid #ffffff;
      padding: 0.2rem;
      box-shadow: 0px 1px 17px rgba(0, 0, 0, 0.06);
    }
  }

  .text {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2.5rem;
    h2 {
      color: rgba(0, 0, 0, 0.6);
      font-size: 2rem;
    }
  }

  .right-items {
    flex: 1;
    display: flex;
    flex-direction: column;
    li {
      display: grid;
      grid-template-columns: 40px auto;
      align-items: center;
      margin: 1.5rem 0;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.4s ease-in-out;
      color: rgba(34, 34, 96, 0.6);
      padding-left: 3rem;
      position: relative;
      i {
        color: rgba(34, 34, 96, 0.6);
        font-size: 2.4rem;
        transition: all 0.4s ease-in-out;
      }
      span {
        font-size: 2rem;
        margin-left: 2rem;
      }
    }
  }

  .active {
    color: rgba(34, 34, 96, 1) !important;
    i {
      color: rgba(34, 34, 96, 1) !important;
    }
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 4px;
      height: 100%;
      background: #222260;
      border-radius: 0 10px 10px 0;
    }
  }

  .button {
    margin-top: 110px;
    background-color: rgba(34, 34, 126, 1);
    color: white;
    border: none;
    padding: 35px 20px;
    text-align: center;
    text-decoration: none;
    font-size: 2rem;
    cursor: pointer;
    border-radius: 20px;
  }
`;

export default RightPanel;
