import React, { useState } from "react";
import styled from "styled-components";
import { useTransactionsContext } from "./TransactionContext";
import { InnerLayout } from "./utils/Layout";
import TransactionItem from "./utils/TransactionItem";

function History() {
  const {
    incomes,
    getIncomes,
    totalIncome,
    getExpenses,
    totalExpenses,
    expenses,
    transactionHistory,
    totalBalance,
    deleteTrans
  } = useTransactionsContext();

  const [...history] = transactionHistory();

  const [selectedFilter, setSelectedFilter] = useState("all");

  const handleFilter = (filter) => {
    setSelectedFilter(filter);
  };

  const filteredTransactions = () => {
    let transactionsToDisplay;
  
    if (selectedFilter === "incomes") {
      transactionsToDisplay = [...incomes];
    } else if (selectedFilter === "expenses") {
      transactionsToDisplay = [...expenses];
    } else {
      transactionsToDisplay = [...history];
    }
  
    transactionsToDisplay.sort((a, b) => new Date(b.date) - new Date(a.date));
  
    return transactionsToDisplay;
  };

  const formatAmount = (amount) => {
    return parseFloat(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <HistoryStyled>
      <InnerLayout>
        <h1>All Transactions</h1>
        <div className="filter-buttons">
          <button onClick={() => handleFilter("all")}>All</button>
          <button onClick={() => handleFilter("incomes")}>Incomes</button>
          <button onClick={() => handleFilter("expenses")}>Expenses</button>
        </div>
        {selectedFilter === "all" && (
          <h2 className="total-balance">
            Total Balance:{" "}
            <span style={{ marginLeft: "20px" }}>${totalBalance()}</span>
          </h2>
        )}
        {selectedFilter === "incomes" && (
          <h2 className="total-income">
            Total Income:{" "}
            <span style={{ marginLeft: "20px" }}>
              ${formatAmount(totalIncome())}
            </span>
          </h2>
        )}
        {selectedFilter === "expenses" && (
          <h2 className="total-expenses">
            Total Expenses:{" "}
            <span style={{ marginLeft: "20px" }}>
              ${formatAmount(totalExpenses())}
            </span>
          </h2>
        )}
        <div className="trans-content">
          <div className="form-container"></div>
          <div className="transaction">
            {filteredTransactions().map((transaction) => {
              const {
                _id,
                merchant,
                amount,
                date,
                category,
                description,
                expenses,
              } = transaction;
              return (
                <TransactionItem
                  key={_id}
                  id={_id}
                  merchant={merchant}
                  description={description}
                  amount={amount}
                  date={date}
                  expenses={expenses}
                  category={category}
                  indicatorColor={expenses ? "#FF5050" : "#5CB85C"}
                  deleteItem={() => deleteTrans(_id)}
                />
              );
            })}
          </div>
        </div>
      </InnerLayout>
    </HistoryStyled>
  );
}

const HistoryStyled = styled.div`
  display: flex;
  overflow: auto;
  flex-direction: column;
  .filter-buttons {
    display: flex;
    gap: 4rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    justify-content: center;
    align-items: center;

    button {
      background: rgba(235, 101, 23, 0.6);
      border-radius: 20px;
      color: #fff;
      border: none;
      padding: 10px;
      text-align: center;
      font-size: 1.5rem;
      width: 200px;
    }
  }

  .total-income,
  .total-expenses,
  .total-balance {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fcf6f9;
    border: 2px solid #ffffff;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 1rem;
    margin: 1rem 0;
    font-size: 2rem;
    gap: 0.5rem;
    span {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--color-green);
    }
  }
  .trans-content {
    display: flex;
    gap: 2rem;
    .transaction {
      flex: 1;
    }
  }
  h1 {
    color: rgba(34, 34, 126, 1);
  }
`;

export default History;
