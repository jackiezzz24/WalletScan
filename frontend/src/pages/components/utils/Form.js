import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useTransactionsContext } from "../TransactionContext";
import Button from "./Btn";
import { plus } from "./Icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import receipt_image from "../../../assets/images/default-image.jpg";

function Form() {
  const { addTrans, setError } = useTransactionsContext();
  const [user, setUser] = useState(null);
  const [receiptImage, setReceiptImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const authToken = localStorage.getItem("authToken");

  const [inputState, setInputState] = useState({
    merchant: "",
    amount: "",
    currency: "",
    expenses: true,
    date: "",
    category: "",
    description: "",
    userid: "",
    receipt_img: "",
  });
  const currencies = ["USD", "CAD", "CNY", "EUR", "GBP", "JPY"];
  const expenseCategories = [
    "Education",
    "Groceries",
    "Medical",
    "Rent",
    "Restaurant",
    "Retail",
    "Travel",
    "Other",
  ];
  const incomeCategories = [
    "Salary",
    "Investment",
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
        const { username, id } = result;
        setUser({ ...result, username, id });
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
    description
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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!user) {
      console.error("User object is not available");
      return;
    }
  
    setInputState((prevInputState) => ({
      ...prevInputState,
      userid: user.id,
    }));
  
    try {
      let cloudinaryUrl = null;
  
      if (previewImage) {
        cloudinaryUrl = await uploadImageToCloudinary();
      }
  
      setInputState((prevInputState) => ({
        ...prevInputState,
        receipt_img: cloudinaryUrl || "", // Set an empty string if cloudinaryUrl is null
      }));
  
      console.log('Submitting form with inputState:', inputState);

      if (expenses) {
        addTrans(inputState);
        setInputState((prevInputState) => ({
          ...prevInputState,
          merchant: "",
          amount: "",
          currency: "",
          expenses: true,
          date: "",
          category: "",
          description: "",
          userid: "",
          receipt_img: "",
        }));
      } else {
        addTrans(inputState);
        setInputState((prevInputState) => ({
          ...prevInputState,
          merchant: "",
          amount: "",
          currency: "",
          expenses: false,
          date: "",
          category: "",
          description: "",
          userid: "",
          receipt_img: "",
        }));
      }
    } catch (submitError) {
      setError(`Form submission error: ${submitError.message}`);
    }
  };

  const uploadImageToCloudinary = async () => {
    if (previewImage) {
      const formData = new FormData();
      formData.append("file", previewImage);
      formData.append("upload_preset", "ml_default");

      try {
        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/dxhu2wrmc/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (cloudinaryResponse.ok) {
          const cloudinaryResult = await cloudinaryResponse.json();
          return cloudinaryResult.secure_url;
        } else {
          const cloudinaryResult = await cloudinaryResponse.json();
          throw new Error(
            `Cloudinary upload error: ${cloudinaryResult.error.message}`
          );
        }
      } catch (error) {
        throw new Error(
          `Error uploading image to Cloudinary: ${error.message}`
        );
      }
    } else {
      throw new Error("No image selected for upload.");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setReceiptImage(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewImage(null);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  return (
    <FormStyled onSubmit={handleSubmit}>
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
            dateFormat="MM/dd/yyyy"
            onChange={(date) => {
              setInputState({ ...inputState, date: date });
            }}
          />
        </div>
        <div className="selects input-control">
          <p>Transaction Type</p>
          <select
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
            name={"Save"}
            icon={plus}
            bPad={".8rem 1.6rem"}
            bRad={"30px"}
            bg={"rgba(34, 34, 96, 0.6)"}
            color={"#fff"}
          />
        </div>
      </div>
      <div className="upload-image" onClick={handleImageClick}>
        <div className="image-area">
          {previewImage ? (
            <img src={previewImage} alt="Selected Receipt" />
          ) : (
            <img src={receipt_image} alt="Default Receipt" />
          )}
        </div>
        <div className="file-input">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
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
    margin-right: 2rem;
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
      height: 460px;
    }
  }

  .upload-btn {
    margin-top: 1rem;
    margin-left: 1.2rem;
  }
`;
export default Form;
