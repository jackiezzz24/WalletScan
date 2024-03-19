import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { InnerLayout } from "./utils/Layout";
import { useTransactionsContext } from "./TransactionContext";
import Chart from "./LineGraph";
import PieChart from "./Pie";

function DashboardForm() {
  const { getIncomes, getExpenses, incomes, expenses } =
    useTransactionsContext();

  useEffect(() => {
    getIncomes();
    getExpenses();
  }, []);

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

  const handleMonthChange = (event) => {
    const selectedValue = parseInt(event.target.value, 10);
    setSelectedMonth(selectedValue === -1 ? null : selectedValue);
  };

  const formatAmount = (amount) => {
    return parseFloat(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getTransactionsForSelectedMonth = () => {
    if (selectedMonth === null) return [...incomes, ...expenses];

    return [...incomes, ...expenses].filter(transaction => new Date(transaction.date).getMonth() === selectedMonth);
  };

  const getTotalIncomeForSelectedMonth = () => {
    const transactions = getTransactionsForSelectedMonth().filter(transaction => transaction.expenses === false);
    const totalIncome = transactions.reduce((total, transaction) => total + parseFloat(transaction.amount), 0);
    return totalIncome;
  };
  
  const getTotalExpensesForSelectedMonth = () => {
    const transactions = getTransactionsForSelectedMonth().filter(transaction => transaction.expenses === true);
    const totalExpenses = transactions.reduce((total, transaction) => total + parseFloat(transaction.amount), 0);
    return totalExpenses;
  };
  
  const getTotalBalanceForSelectedMonth = () => {
    const totalIncome = getTotalIncomeForSelectedMonth();
    const totalExpenses = getTotalExpensesForSelectedMonth();
    const totalBalance = totalIncome - totalExpenses;
    return totalBalance;
  };


  return (
    <DashboardStyled>
      <InnerLayout>
      <div className="header">
          <h1>Overview</h1>
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
        <div className="stats-con">
          <div className="amount-con">
            <div className="income">
              <h2>Total Income</h2>
              <p>{formatAmount(getTotalIncomeForSelectedMonth())}</p>
            </div>
            <div className="expense">
              <h2>Total Expense</h2>
              <p>{formatAmount(getTotalExpensesForSelectedMonth())}</p>
            </div>
            <div className="balance">
              <h2>Total Balance</h2>
              <p>{formatAmount(getTotalBalanceForSelectedMonth())}</p>
            </div>
          </div>
        </div>
        <div className="chart-con">
          <div className="chart">
            <p>Monthly Trend</p>
            <Chart />
          </div>
          <div className="chart">
            <p>Spend Details</p>
            <PieChart />
          </div>
        </div>
      </InnerLayout>
    </DashboardStyled>
  );
}

const DashboardStyled = styled.div`
  height: 100%;
  position: relative;
  display: flex;
  overflow: auto;
  flex-direction: column;
  .header {
    display: flex;
    align-items: center;
  }

  .select-container {
    margin-left: 1rem; 
  }

  .select {
    width: 100%; 
  }

  h1 {
    color: rgba(34, 34, 126, 1);
  }

  .chart-con {
    margin-top: 3rem;
    display: flex;
    gap: 3rem;

    .chart {
      height: 300px;
      width: 450px;
      flex-direction: column;
    }

    p {
      margin-bottom: 0.8rem;
      font-size: 1.5rem;
      color: rgba(0, 0, 0, 0.8);
      padding-left: 2rem;
    }
  }

  .stats-con {
    display: flex;
    gap: 1rem;
    justify-content: center;

    .amount-con {
      display: flex;
      gap: 2rem;
      flex-direction: row;
      margin-top: 1rem;
      justify-content: center;

      .income,
      .expense,
      .balance {
        background: #fcf6f9;
        border: 2px solid #ffffff;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 1rem 2rem;
        justify-content: center;
        align-items: center;
        display: flex;
        flex-direction: column;
        p {
          font-size: 3rem;
          font-weight: 500;
        }
      }

      .income {
        p {
          color: green;
        }
      }

      .expense {
        p {
          color: red;
        }
      }

      .balance {
        p {
          opacity: 0.6;
        }
      }
    }
  }
`;

export default DashboardForm;
