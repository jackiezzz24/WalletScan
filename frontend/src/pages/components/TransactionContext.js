import React, { useContext, useState, useEffect } from "react";
import axios from "axios";

const baseUrl = process.env.REACT_APP_API;
const TransactionsContext = React.createContext();

export const TransactionProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const authToken = localStorage.getItem("authToken");

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

  const addTrans = async (input) => {
    try {
      const response = await fetch(`${baseUrl}/transaction/${user.id}/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const result = await response.json();
        alert(`Failed to add transaction: ${result.error}`);
        return;
      }
      alert("Transaction added successfully");
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  };

  const getIncomes = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/transaction/incomes/${user.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const result = await response.json();
        alert(`Failed to get incomes: ${result.error}`);
        return;
      }
      const data = await response.json();
      setIncomes(data);
      console.log(data);
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  };

  const getExpenses = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/transaction/expenses/${user.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const result = await response.json();
        alert(`Failed to get expenses: ${result.error}`);
        return;
      }
      const data = await response.json();
      setExpenses(data);
      console.log(data);
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  };

  const deleteIncome = async (id) => {
    const res = await axios.delete(`${baseUrl}/delete-income/${id}`);
    getIncomes();
  };

  const deleteExpense = async (id) => {
    const res = await axios.delete(`${baseUrl}/delete-expense/${id}`);
    getExpenses();
  };

  const formatAmount = (amount) => {
    return parseFloat(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const totalIncome = () => {
    let totalIncome = 0;
    incomes.forEach((income) => {
      const incomeAmount = parseFloat(income.amount);
      if (!isNaN(incomeAmount)) {
        totalIncome += incomeAmount;
      }
    });
    return totalIncome;
  };

  const totalExpenses = () => {
    let totalExpenses = 0;
    expenses.forEach((expense) => {
      const expenseAmount = parseFloat(expense.amount);
      if (!isNaN(expenseAmount)) {
        totalExpenses += expenseAmount;
      }
    });
    return totalExpenses;
  };

  const totalBalance = () => {
    const balance = totalIncome() - totalExpenses();
    return formatAmount(balance);
  };

  const transactionHistory = () => {
    const history = [...incomes, ...expenses];
    history.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return history.slice(0, 3);
  };

  return (
    <TransactionsContext.Provider
      value={{
        getIncomes,
        incomes,
        deleteIncome,
        expenses,
        totalIncome,
        addTrans,
        getExpenses,
        deleteExpense,
        totalExpenses,
        totalBalance,
        transactionHistory,
        error,
        setError,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactionsContext = () => {
  return useContext(TransactionsContext);
};
