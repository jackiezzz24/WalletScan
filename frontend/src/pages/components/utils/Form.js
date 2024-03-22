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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userObject = JSON.parse(localStorage.getItem("user"));
    setUser(userObject);
    setLoading(false);
  }, []);

  useEffect(() => {
    setInputState((prevState) => ({
      ...prevState,
      currency: user?.currency || "",
    }));
  }, [user]);

  const initalState = {
    merchant: "",
    amount: "",
    currency: "",
    expenses: true,
    date: new Date(),
    category: "",
    description: "",
    userid: "",
    receipt_img: "",
  };
  
  const [inputState, setInputState] = useState(initalState);

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

  const { merchant, amount, currency, expenses, date, category, description } =
    inputState;

  const handleInput = (name) => (e) => {
    const value = e.target.value;

    setInputState((prevState) => {
      let updatedState = {
        ...prevState,
        [name]: name === "expenses" ? value === true : value,
      };

      // Update description if merchant or category is changed
      if (name === "merchant" || name === "category") {
        updatedState = {
          ...updatedState,
          description: `${updatedState.merchant} ${updatedState.category}`,
        };
      }

      return updatedState;
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTrans(inputState);
      alert("Transaction added successfully");
      setInputState(initalState);
      setPreviewImage(null);
    } catch (error) {
      setError(`Failed to submit form: ${error.message}`);
      console.error(error);
    }
  };

  const readImage = async (cloudinaryUrl) => {
    try {
      const baseUrl = process.env.REACT_APP_API;
      const response = await fetch(`${baseUrl}/ocr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: cloudinaryUrl }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
      // Parse the JSON response and return the relevant data
      const responseData = await response.json();

      const { merchant, amount, date } = responseData;
      const timeValue = dateStringToTimeValue(date);
      setInputState((prevState) => ({
        ...prevState,
        merchant: merchant,
        amount: amount,
        date: timeValue,
      }));
    } catch (error) {
      throw new Error(`Error reading image: ${error.message}`);
    }
  };

  function dateStringToTimeValue(dateString) {
    const parts = dateString.split("/");
    let year = parseInt(parts[2], 10);
    year += year < 100 ? 2000 : 0;
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[0], 10);
    const date = new Date(year, month, day);
    return date.getTime();
  }

  const uploadImageToCloudinary = async (file) => {
    if (!file) {
      throw new Error("No image selected for upload.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/dxhu2wrmc/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!cloudinaryResponse.ok) {
        const cloudinaryResult = await cloudinaryResponse.json();
        throw new Error(
          `Cloudinary upload error: ${cloudinaryResult.error?.message}`
        );
      }

      const cloudinaryResult = await cloudinaryResponse.json();
      return cloudinaryResult.secure_url;
    } catch (error) {
      throw new Error(`Error uploading image to Cloudinary: ${error.message}`);
    }
  };

  const handleFileChange = async (e) => {
    if (!user) {
      console.error("User object is not available");
      return;
    }

    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setPreviewImage(null);
      return;
    }

    // Generate a preview of the selected file
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(selectedFile);

    try {
      // Upload the image to Cloudinary and wait for the URL
      const cloudinaryUrl = await uploadImageToCloudinary(selectedFile);
      if (!cloudinaryUrl) {
        throw new Error("Failed to upload image to Cloudinary.");
      }

      // Process the image with OCR and update the form state
      await readImage(cloudinaryUrl);
    } catch (error) {
      console.error("Error processing file change:", error.message);
      setError(`Form submission error: ${error.message}`);
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
            value={merchant}
            type="text"
            name={"merchant"}
            placeholder={"Merchant"}
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
