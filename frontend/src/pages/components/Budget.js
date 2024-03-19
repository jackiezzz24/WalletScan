import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { InnerLayout } from "./utils/Layout";
import { useTransactionsContext } from "./TransactionContext";
import { Doughnut } from "react-chartjs-2";

function Budget() {
  const { getExpenses, expenses } = useTransactionsContext();
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [budgetAmount, setBudgetAmount] = useState(0);
  const [totalExpenseAmount, setTotalExpenseAmount] = useState(0);
  const authToken = localStorage.getItem("authToken");
  const baseUrl = process.env.REACT_APP_API;

  const fetchBudgetAmount = async () => {
    try {
      const response = await fetch(`${baseUrl}/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (response.ok) {
        setBudgetAmount(parseFloat(result.budget));
      } else {
        alert(`${result.error}`);
      }
    } catch (error) {
      alert("An error occurred during fetch: " + error.message);
    }
  };

  useEffect(() => {
    fetchBudgetAmount();
  }, []);

  useEffect(() => {
    getExpenses();
  }, []);

  useEffect(() => {
    const allMonths = [
      ...new Set(
        expenses.map((transaction) => new Date(transaction.date).getMonth())
      ),
    ];
    const sortedMonths = allMonths.sort((a, b) => a - b);
    setAvailableMonths(sortedMonths);
  }, [expenses]);

  useEffect(() => {
    const initialMonth = availableMonths.length > 0 ? availableMonths[0] : null;
    setSelectedMonth(initialMonth);
  }, [availableMonths]);

  useEffect(() => {
    const filteredExpenses =
      selectedMonth !== null
        ? expenses.filter(
            (expense) => new Date(expense.date).getMonth() === selectedMonth
          )
        : expenses;

    const total = filteredExpenses.reduce(
      (total, expense) => total + parseFloat(expense.amount),
      0
    );
    setTotalExpenseAmount(total);
  }, [selectedMonth, expenses]);

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

  const chartData = {
    labels: ["Expenses", "Remaining Budget"],
    datasets: [
      {
        data: [
          totalExpenseAmount,
          Math.max(0, budgetAmount - totalExpenseAmount),
        ],
        backgroundColor: [
          totalExpenseAmount >= budgetAmount ? "orange" : "orange",
          "lightgray",
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutoutPercentage: 50,
    plugins: {
      legend: {
        position: "left",
      },
    },
  };

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

  return (
    <BudgetStyled>
      <InnerLayout>
        <div className="header">
          <h1>Budget</h1>
          <div className="select-container">
            <select
              onChange={handleMonthChange}
              value={selectedMonth === null ? -1 : selectedMonth}
              className="select"
              style={{ fontSize: "16px" }}
            >
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
            <div className="chart-con">
              <div className="chart">
                <PieChartStyled>
                  <Doughnut data={chartData} options={options} />
                </PieChartStyled>
              </div>
            </div>
            <div className="info">
              <div className="spend">
                <h2>Expense Spending</h2>
                <p>{formatAmount(totalExpenseAmount)}</p>
              </div>
              <div className="budget">
                <h2>Planned Budget</h2>
                <p>{formatAmount(budgetAmount)}</p>
              </div>
              <div className="percentage">
                <h2>Percentage Used</h2>
                <p
                  className={
                    totalExpenseAmount / budgetAmount > 1
                      ? "over-budget"
                      : "under-budget"
                  }
                >
                  {formatAmount((totalExpenseAmount / budgetAmount) * 100) +
                    "%"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </InnerLayout>
    </BudgetStyled>
  );
}

const BudgetStyled = styled.div`
  height: 100%;
  position: relative;
  display: flex;
  overflow: auto;
  flex-direction: column;
 
  .header {
    margin-bottom: 2rem;
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
    margin-top: 1rem;
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
      gap: 5rem;
      flex-direction: row;

      .spend,
      .budget,
      .percentage {
        margin-bottom: 1rem;
        margin-top: 1.5rem;
        background: #fcf6f9;
        border: 2px solid #ffffff;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 0.5rem 2rem;
        justify-content: center;
        align-items: center;
        display: flex;
        flex-direction: column;
        p {
          font-size: 1.5rem;
          font-weight: 500;
        }
      }
      .percentage .over-budget {
        color: red;
      }
      
      .percentage .under-budget {
        color: green;
      }

      .budget,
      .spend {
        p {
          opacity: 0.6;
        }
      }
    }
  }
`;

const PieChartStyled = styled.div`
  background: #fcf6f9;
  border: 2px solid #ffffff;
  box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
  padding: 1rem;
  border-radius: 20px;
  height: 100%;
`;

export default Budget;
