import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { rightItems } from "./utils/RightItems";
import profile_image from "../../assets/images/profile_image.png";
import { useProfileContext } from './ProfileContext';

function RightPanel({ active, setActive, setShowForm }) {

  const [user, setUser] = useState(null);
  const { profileImageUrl  } = useProfileContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userObject = JSON.parse(localStorage.getItem("user"));
    setUser(userObject);
    if (userObject) {
      setUser((prevUser) => ({
        ...prevUser,
        profile_img: profileImageUrl || prevUser.profile_img,
      }));
    }
  }, [profileImageUrl]);

  const downloadFile = async() => {
    setLoading(true);
    const baseUrl = process.env.REACT_APP_API;
    try {
      const response = await fetch(`${baseUrl}/transaction/export/${user.id}`);
      const blob = await response.blob();

      // Create a URL for the Excel file data
      const url = window.URL.createObjectURL(blob);
      
      // Create a link element and simulate a click to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
    setLoading(false);
  };

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

      <button className="report-btn" onClick={() => {
       downloadFile();
      }} disabled={loading}>
        
        <i className="fa-solid fa-table-list" style={{ marginRight: "8px" }}></i>
        {loading ? 'Exporting...' : 'Generate Report'}
      </button>
    </RightPanelStyled>
  );
}

const RightPanelStyled = styled.nav`
  padding: 3rem 0rem;
  width: 18vw;
  height: 400px;
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
    gap: 2rem;
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
      margin: 1rem 0;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.4s ease-in-out;
      color: rgba(34, 34, 96, 0.6);
      padding-left: 3rem;
      position: relative;
      overflow: hidden;  
      text-overflow: ellipsis; 
      i {
        color: rgba(34, 34, 96, 0.6);
        font-size: 2rem;
        transition: all 0.4s ease-in-out;
      }
      span {
        font-size: 1.8rem;
        margin-left: 1rem;
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
    margin-top: 80px;
    background-color: rgba(34, 34, 126, 0.9);
    color: white;
    border: none;
    padding: 35px 20px;
    text-align: center;
    text-decoration: none;
    font-size: 1.5rem;
    cursor: pointer;
    border-radius: 20px;
  }
  .report-btn {
    margin-top: 30px;
    background-color: rgba(34, 34, 126, 0.9);
    color: white;
    border: none;
    padding: 35px 20px;
    text-align: center;
    text-decoration: none;
    font-size: 1.5rem;
    cursor: pointer;
    border-radius: 20px;
  }

  @media screen and (max-width: 1200px) {
    display: none;
  }
`;

export default RightPanel;
