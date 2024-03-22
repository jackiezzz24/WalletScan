import { Pie } from "react-chartjs-2";
import { useTransactionsContext } from "./TransactionContext";
import styled from "styled-components";
import React, { useState, useEffect } from "react";

const PieChart = () => {
  const { expenses } = useTransactionsContext();
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [availableMonths, setAvailableMonths] = useState([]);

  const filteredExpenses =
    selectedMonth !== null
      ? expenses.filter(
          (expense) => new Date(expense.date).getMonth() === selectedMonth
        )
      : expenses;

  useEffect(() => {
    const allMonths = [
      ...new Set(
        [...expenses].map((transaction) =>
          new Date(transaction.date).getMonth()
        )
      ),
    ];
    const sortedMonths = allMonths.sort((a, b) => a - b); 
    setAvailableMonths(sortedMonths);
  }, [expenses]);

  const handleMonthChange = (event) => {
    const selectedValue = parseInt(event.target.value, 10);
    setSelectedMonth(selectedValue === -1 ? null : selectedValue);
  };

  const totalExpenseAmount = filteredExpenses.reduce(
    (total, expense) => total + parseFloat(expense.amount),
    0
  );

  const categoryMap = new Map();
  filteredExpenses.forEach((expense) => {
    const category = expense.category;
    const amount = parseFloat(expense.amount);

    if (categoryMap.has(category)) {
      categoryMap.set(category, categoryMap.get(category) + amount);
    } else {
      categoryMap.set(category, amount);
    }
  });

  const sortedCategories = Array.from(categoryMap.entries()).sort(
    (a, b) => b[1] - a[1]
  );

  const topCategories = sortedCategories.slice(0, 3);
  const othersTotal = sortedCategories
    .slice(3)
    .reduce((acc, [, amount]) => acc + amount, 0);
  const combinedCategories =
    othersTotal > 0
      ? [...topCategories, ["Others", othersTotal]]
      : topCategories;

  const chartData = {
    labels: combinedCategories.map(([category]) => category),
    datasets: [
      {
        data: combinedCategories.map(([, amount]) => amount),
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(255, 205, 86, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(75, 192, 192, 0.7)",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
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
    <PieChartStyled>
      <label htmlFor="monthSelect">Select Month: </label>
      <select
        id="monthSelect"
        onChange={handleMonthChange}
        value={selectedMonth === null ? -1 : selectedMonth}
        style={{ fontSize: "16px" }}
      >
        <option value={-1}>All Months</option>
        {availableMonths.map((month, index) => (
          <option key={index} value={month}>
            {getMonthName(month)}
          </option>
        ))}
      </select>
      <Pie data={chartData} options={options} />
    </PieChartStyled>
  );
};

const PieChartStyled = styled.div`
  background: #fcf6f9;
  border: 2px solid #ffffff;
  box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
  padding: 1rem;
  border-radius: 20px;
  height: 100%;

  label {
    margin-left: 1rem;
    position: relative;
    top: -0.5rem;
  }

  select {
    margin-left: 1rem;
    position: relative;
    top: -0.5rem;
  }
`;

export default PieChart;
