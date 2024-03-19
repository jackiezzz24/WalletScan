import React, { useState, useEffect } from "react";
import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import styled from "styled-components";
import { useTransactionsContext } from "./TransactionContext";
import { dateFormat } from "./utils/dataFormat";

ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function LineGraph() {
  const { incomes, expenses } = useTransactionsContext();
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [labelDates, setLabelDates] = useState([]);

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

  useEffect(() => {
    const getEvenlySpacedDates = (startDate, endDate, count) => {
      const dateArray = [];
      const interval = (endDate.getTime() - startDate.getTime()) / (count - 1);
  
      for (let i = 0; i < count; i++) {
        const currentDate = new Date(startDate.getTime() + interval * i);
        dateArray.push(currentDate);
      }
  
      return dateArray;
    };
  
    const allTransactions = [...incomes, ...expenses];
  
    const startDate = selectedMonth !== null
      ? new Date(new Date().getFullYear(), selectedMonth, 1)
      : new Date(Math.min(...allTransactions.map(transaction => new Date(transaction.date))));
  
    const endDate = selectedMonth !== null
      ? new Date(new Date().getFullYear(), selectedMonth + 1, 0)
      : new Date(Math.max(...allTransactions.map(transaction => new Date(transaction.date))));
  
    const dates = getEvenlySpacedDates(startDate, endDate, 4);
  
    setLabelDates(dates);
  }, [selectedMonth, incomes, expenses]);

  const filteredIncomes =
  selectedMonth !== null
    ? incomes.filter((inc) => new Date(inc.date).getMonth() === selectedMonth)
    : incomes;

const filteredExpenses =
  selectedMonth !== null
    ? expenses.filter(
        (exp) => new Date(exp.date).getMonth() === selectedMonth
      )
    : expenses;

const sortedIncomes = filteredIncomes
  .slice()
  .sort((a, b) => new Date(a.date) - new Date(b.date));
const sortedExpenses = filteredExpenses
  .slice()
  .sort((a, b) => new Date(a.date) - new Date(b.date));

const data = {
  labels: labelDates.map((date) => dateFormat(date)),
    datasets: [
      {
        label: "Income",
        data: sortedIncomes.map((income) => parseFloat(income.amount)),
        backgroundColor: "green",
        tension: 0.2,
      },
      {
        label: "Expenses",
        data: sortedExpenses.map((expense) => parseFloat(expense.amount)),
        backgroundColor: "red",
        tension: 0.2,
      },
    ],
  };

  const handleMonthChange = (event) => {
    const selectedValue = parseInt(event.target.value, 10);
    setSelectedMonth(selectedValue === -1 ? null : selectedValue);
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
    <LineGraphStyled>
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
      <Line data={data} />
    </LineGraphStyled>
  );
}

const LineGraphStyled = styled.div`
  background: #fcf6f9;
  border: 2px solid #ffffff;
  box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
  padding: 1rem;
  border-radius: 20px;
  height: 100%;

  label {
    margin-left: 1rem;
  }

  select {
    margin-bottom: 1rem;
    margin-left: 1rem;
  }
`;

export default LineGraph;
