import React, { useState } from "react";
import styled from "styled-components";
import { dateFormat } from "./dataFormat";
import {
  bitcoin,
  book,
  calender,
  card,
  circle,
  clothing,
  comment,
  dollar,
  food,
  benefit,
  medical,
  money,
  piggy,
  stocks,
  takeaway,
  rent,
  users,
  sponsor,
  travel,
} from "./Icons";

function TransactionItem({
  id,
  merchant,
  amount,
  date,
  category,
  description,
  indicatorColor,
  expenses,
  deleteItem,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const incomeCatIcon = () => {
    switch (category) {
      case "Salary":
        return money;
      case "Investment":
        return stocks;
      case "Stock":
        return users;
      case "Bitcoin":
        return bitcoin;
      case "Bank":
        return card;
      case "Benefit":
        return benefit;
      case "Sponsor":
        return sponsor;
      case "Other":
        return piggy;
      default:
        return piggy;
    }
  };

  const expenseCatIcon = () => {
    switch (category) {
      case "Education":
        return book;
      case "Groceries":
        return food;
      case "Medical":
        return medical;
      case "Rent":
        return rent;
      case "Restaurant":
        return takeaway;
      case "Retail":
        return clothing;
      case "Travel":
        return travel;
      case "Other":
        return circle;
      default:
        return circle;
    }
  };

  const handleDeleteConfirmation = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteItem = () => {
    deleteItem();
    setShowDeleteModal(false);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const formatAmount = (amount) => {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount)) {
      return numericAmount.toLocaleString("en-US");
    }
    return amount;
  };

  return (
    <TransItemStyled
      indicator={indicatorColor}
      onClick={handleDeleteConfirmation}
    >
      <div className="icon">
        {expenses === true ? expenseCatIcon() : incomeCatIcon()}
      </div>
      <div className="content">
        <h5>
          {category} - {merchant}
        </h5>
        <div className="inner-content">
          <div className="text">
            <p>
              {calender} {dateFormat(date)}
            </p>
            <p>
              {comment}
              {description}
            </p>
          </div>
          <div className="amount">
            <p>
              {expenses ? "-" : "+"} {dollar} {formatAmount(amount)}
            </p>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <DeleteModal>
          <p>Delete this transaction?</p>
          <div className="button">
            <button onClick={handleDeleteItem}>Yes</button>
            <button onClick={(e) => { e.stopPropagation(); closeDeleteModal(); }}>No</button>
          </div>
        </DeleteModal>
      )}
    </TransItemStyled>
  );
}

const DeleteModal = styled.div`
  background: #edc2a8;
  border: 2px solid #ffffff;
  box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  padding: 1rem;

  .button {
    display: flex;
    gap: 10px;
    justify-content: center;
  }
`;

const TransItemStyled = styled.div`
  background: #fcf6f9;
  border: 2px solid #ffffff;
  box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  color: #222260;
  .icon {
    width: 80px;
    height: 80px;
    border-radius: 20px;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #ffffff;
    i {
      font-size: 2.6rem;
    }
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    h5 {
      font-size: 1.3rem;
      padding-left: 2rem;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 50%;
        background: ${(props) => props.indicator};
      }
    }

    .inner-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .text {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        padding-left: 2rem;
        p {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--primary-color);
          opacity: 0.8;
        }
      }
      .amount {
        p {
          font-size: 1.8rem;
        }
      }
    }
  }
`;

export default TransactionItem;
