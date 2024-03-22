import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTransactionsContext } from "./TransactionContext";
import { InnerLayout } from "./utils/Layout";
import TransactionItem from "./utils/TransactionItem";

function History() {
  const { incomes, expenses, transactionHistory, deleteTrans } =
    useTransactionsContext();

  const [...history] = transactionHistory();

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [availableMonths, setAvailableMonths] = useState([]);
  const getMonthName = (month) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[month];
  };

  useEffect(() => {
    const allMonths = [
      ...new Set(
        [...incomes, ...expenses].map((transaction) =>
          new Date(transaction.date).getMonth()
        )
      ),
    ];
    const sortedMonths = allMonths.sort((a, b) => a - b);
    setAvailableMonths(sortedMonths);
  }, [incomes, expenses]);

  const handleFilter = (filter) => {
    setSelectedFilter(filter);
  };

  const handleMonthChange = (event) => {
    const selectedValue = parseInt(event.target.value, 10);
    setSelectedMonth(selectedValue === -1 ? null : selectedValue);
  };

  const filteredTransactions = () => {
    let transactionsToDisplay = [...history];

    if (selectedFilter === "incomes") {
      transactionsToDisplay = incomes.filter((income) => {
        const incomeDate = new Date(income.date);
        return (
          selectedMonth === null || incomeDate.getMonth() === selectedMonth
        );
      });
    } else if (selectedFilter === "expenses") {
      transactionsToDisplay = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          selectedMonth === null || expenseDate.getMonth() === selectedMonth
        );
      });
    } else {
      transactionsToDisplay = history.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return (
          selectedMonth === null || transactionDate.getMonth() === selectedMonth
        );
      });
    }

    transactionsToDisplay.sort((a, b) => new Date(b.date) - new Date(a.date));

    return transactionsToDisplay;
  };

  return (
    <HistoryStyled>
      <InnerLayout>
        <div className="header">
          <h1>All Transactions</h1>
          <div className="select-container">
            <select
              onChange={handleMonthChange}
              value={selectedMonth === null ? -1 : selectedMonth}
              className="select"
              style={{ fontSize: "16px" }}
            >
              <option value={-1}>All Months</option>
              {availableMonths.map((month, index) => (
                <option key={index} value={month}>
                  {getMonthName(month)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="filter-buttons">
          <button onClick={() => handleFilter("all")}>All</button>
          <button onClick={() => handleFilter("incomes")}>Incomes</button>
          <button onClick={() => handleFilter("expenses")}>Expenses</button>
        </div>
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
                  key={transaction.id}
                  id={_id}
                  merchant={merchant}
                  description={description}
                  amount={amount}
                  date={date}
                  expenses={expenses}
                  category={category}
                  indicatorColor={expenses ? "#FF5050" : "#5CB85C"}
                  deleteItem={() => deleteTrans(transaction.id)}
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
  .header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }

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

  .select-container {
    margin-left: 1rem; 
  }

  .select {
    width: 100%; 
  }
`;

export default History;
