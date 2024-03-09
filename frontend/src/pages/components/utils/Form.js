import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTransactionsContext } from "../TransactionContext";
import Button from "./Btn";
import { image, plus } from "./Icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import receipt_image from "../../../assets/images/default-image.jpg";

function Form() {
  const { addIncome, addExpense, error, setError } = useTransactionsContext();
  const [user, setUser] = useState(null);
  const authToken = localStorage.getItem("authToken");

  const [inputState, setInputState] = useState({
    merchant: "",
    amount: "",
    currency: "",
    expenses: true,
    date: "",
    category: "",
    description: "",
    receipt_img: "",
  });
  const currencies = ["USD", "CAD", "CNY", "EUR", "GBP", "JPY"];
  const expenseCategories = [
    "Education",
    "Groceries",
    "Medical",
    "Subscriptions",
    "Takeaways",
    "Clothing",
    "Travel",
    "Other",
  ];
  const incomeCategories = [
    "Salary",
    "Investiment",
    "Stock",
    "Bitcoin",
    "Bank",
    "Benefit",
    "Sponsor",
    "Other",
  ];

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

  const {
    merchant,
    amount,
    currency,
    expenses,
    date,
    category,
    description,
    receipt_img,
  } = inputState;

  const handleInput = (name) => (e) => {
    const value = e.target.value;

    setInputState((prevState) => {
      if (name === "expenses") {
        return { ...prevState, [name]: value === "true" };
      } else {
        return { ...prevState, [name]: value };
      }
    });

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (expenses) {
      addExpense(inputState);
      setInputState({
        merchant: "",
        amount: "",
        currency: "",
        expenses: true,
        date: "",
        category: "",
        description: "",
        receipt_img: "",
      });
    } else {
      addIncome(inputState);
      setInputState({
        merchant: "",
        amount: "",
        currency: "",
        expenses: false,
        date: "",
        category: "",
        description: "",
        receipt_img: "",
      });
    }
  };

  return (
    <FormStyled onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <div className="inputItem">
        <div className="input-control">
          <input
            type="text"
            value={merchant}
            name={"merchant"}
            placeholder="Merchant"
            onChange={handleInput("merchant")}
          />
        </div>
        <div className="input-control">
          <input
            value={amount}
            type="text"
            name={"amount"}
            placeholder={"Amount"}
            onChange={handleInput("amount")}
          />
        </div>
        <div className="selects input-control">
          <p>Currency</p>
          <select
            required
            value={currency}
            name="currency"
            id="currency"
            onChange={handleInput("currency")}
          >
            <option value="" disabled>
              Select Option
            </option>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div className="selects input-control">
          <p>Date</p>
          <DatePicker
            id="date"
            placeholderText="Enter Date"
            selected={date}
            dateFormat="dd/MM/yyyy"
            onChange={(date) => {
              setInputState({ ...inputState, date: date });
            }}
          />
        </div>
        <div className="selects input-control">
          <p>Transaction Type</p>
          <select
            required
            value={expenses}
            name="expenses"
            id="expenses"
            onChange={handleInput("expenses")}
          >
            <option value="" disabled>
              Select Option
            </option>
            <option value={true}>Expense</option>
            <option value={false}>Income</option>
          </select>
        </div>
        <div className="selects input-control">
          <p>Category</p>
          <select
            required
            value={category}
            name="category"
            id="category"
            onChange={handleInput("category")}
          >
            <option value="" disabled>
              Select Option
            </option>
            {inputState.expenses
              ? expenseCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))
              : incomeCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
          </select>
        </div>
        <div className="input-control">
          <textarea
            name="description"
            value={description}
            placeholder="Add A Reference"
            id="description"
            cols="30"
            rows="4"
            onChange={handleInput("description")}
          ></textarea>
        </div>
        <div className="submit-btn">
          <Button
            name={"Upload Receipt"}
            icon={image}
            bPad={".8rem 1.6rem"}
            bRad={"30px"}
            bg={"rgba(34, 34, 96, 0.6)"}
            color={"#fff"}
          />

          <Button
            name={"Save"}
            icon={plus}
            bPad={".8rem 1.6rem"}
            bRad={"30px"}
            bg={"rgba(34, 34, 96, 0.6)"}
            color={"#fff"}
          />
        </div>
      </div>
      <div className="image-area">
        {receipt_img ? (
          <img src={receipt_img} alt="Receipt" />
        ) : (
          <img src={receipt_image} alt="Default Receipt" />
        )}
      </div>
    </FormStyled>
  );
}

const FormStyled = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  flex-direction: column;
  gap: 1.5rem;
  input,
  textarea,
  select {
    font-family: inherit;
    font-size: inherit;
    outline: none;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    border: 2px solid #fff;
    background: transparent;
    resize: none;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    color: rgba(34, 34, 96, 0.9);
    &::placeholder {
      color: rgba(34, 34, 96, 0.6);
    }
  }

  .inputItem {
    margin-left: -2rem;
    .input-control {
      margin-top: 1.2rem;
      input {
        width: 100%;
      }
    }
  
    .selects {
      display: flex;
      justify-content: space-between;
      p {
        color: rgba(0, 0, 0, 0.8);
        margin: 0;
        font-size: 1rem;
        display: flex;
        align-items: center;
      }
  
      select {
        color: rgba(34, 34, 96, 0.6);
        &:focus,
        &:active {
          color: rgba(34, 34, 96, 1);
        }
      }
    }
  
    .submit-btn {
      margin-top: 1.2rem;
      display: flex;
      gap: 1rem;
      button {
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        &:hover {
          background: green !important;
          opacity: 0.6;
        }
      }
    }
  } 

  .image-area {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
    margin-left: 1.2rem;
    margin-right: -2rem;
    img {
      max-width: 100%;
      height: auto;
    }
  }
`;
export default Form;
