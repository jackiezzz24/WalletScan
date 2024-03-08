import React from "react";
import styled from "styled-components";
import { leftItems } from "./utils/LeftItems";

function LeftPanel({ active, setActive }) {
  return (
    <LeftPanelStyled>
      <ul className="left-items">
        {leftItems.map((item) => {
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
    </LeftPanelStyled>
  );
}

const LeftPanelStyled = styled.nav`
  padding: 5rem 1.5rem;
  width: 374px;
  height: 90%;
  background: rgba(252, 246, 249, 0.78);
  border: 3px solid #ffffff;
  backdrop-filter: blur(4.5px);
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .left-items {
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
`;

export default LeftPanel;
