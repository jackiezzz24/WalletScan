import React from "react";
import styled from "styled-components";
import { InnerLayout } from "./utils/Layout";
import Form from "./utils/Form";

function AddTransaction() {
  return (
    <AddTransactionStyled>
      <InnerLayout>
        <h1>Add Transaction</h1>
        <div className="income-content">
          <div className="form-container">
            <Form />
          </div>
        </div>
      </InnerLayout>
    </AddTransactionStyled>
  );
}

const AddTransactionStyled = styled.div`
  h1 {
    color: rgba(34, 34, 126, 1);
  }

  display: flex;
  overflow: auto;
  .form-container {
    margin-top: 2rem;
    background: #fcf6f9;
    border: 2px solid #ffffff;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 1rem 3.8rem;
  }
  .income-content {
    display: flex;
    gap: 4rem;
  }

`;

export default AddTransaction;
