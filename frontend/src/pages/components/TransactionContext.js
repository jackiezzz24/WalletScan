import React, { useContext, useState, useEffect } from "react";

const baseUrl = process.env.REACT_APP_API;
const TransactionsContext = React.createContext();

export const TransactionProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(() => {
    const userObject = JSON.parse(localStorage.getItem("user"));
    return userObject || {}; 
  });
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const handleStorageChange = () => {
      const userObject = JSON.parse(localStorage.getItem("user"));
      setUser(userObject);
    };
  
    window.addEventListener("storage", handleStorageChange);
  
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); 

  console.log(user);

  const addTrans = async (input) => {
    if (!user) {
      throw new Error("User object is null");
    }
    console.log('input: ' + input);
    const response = await fetch(`${baseUrl}/transaction/${user.id}/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
    console.log('response' + response);
    if (!response.ok) {
      const result = await response.json();
      alert(`Failed to add transaction: ${result.error}`);
      return;
    }
  };

  const getIncomes = async () => {
    try {
      if (!user) {
        throw new Error("User object is null");
      }
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
      if (!user) {
        throw new Error("User object is null");
      }
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

  const deleteTrans = async (id) => {
    try {
      if (!user) {
        throw new Error("User object is null");
      }
      const response = await fetch(`${baseUrl}/transaction/${id}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const result = await response.json();
        alert(`Failed to delete transaction: ${result.error}`);
        return;
      }
      alert("Transaction deleted.");
      getIncomes();
      getExpenses();
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
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

    return history;
  };

  return (
    <TransactionsContext.Provider
      value={{
        getIncomes,
        incomes,
        deleteTrans,
        expenses,
        totalIncome,
        addTrans,
        getExpenses,
        totalExpenses,
        totalBalance,
        transactionHistory,
        error,
        setError,
        user
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactionsContext = () => {
  return useContext(TransactionsContext);
};
