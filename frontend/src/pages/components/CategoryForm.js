import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { InnerLayout } from "./utils/Layout";
import { useTransactionsContext } from "./TransactionContext";
import TransactionItem from "./utils/TransactionItem";

function CategoryForm() {
  const { getExpenses, expenses, deleteTrans } = useTransactionsContext();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
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

  useEffect(() => {
    getExpenses();
  }, [getExpenses]);

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

  useEffect(() => {
    const categories = [
      ...new Set(
        expenses
          .filter(
            (transaction) =>
              selectedMonth === null ||
              new Date(transaction.date).getMonth() === selectedMonth
          )
          .map((transaction) => transaction.category || "Others")
      ),
    ];
    setAllCategories(categories);
  }, [expenses, selectedMonth]);

  const handleMonthChange = (event) => {
    const selectedValue = parseInt(event.target.value, 10);
    setSelectedMonth(selectedValue === -1 ? null : selectedValue);
  };

  const filteredTransactions = () => {
    let filtered = expenses;

    if (selectedCategory !== null) {
      filtered = filtered.filter(
        (transaction) => transaction.category === selectedCategory
      );
    }

    if (selectedMonth !== null && selectedMonth !== -1) {
      filtered = filtered.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === selectedMonth;
      });
    }

    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    return filtered;
  };

  const renderCategoryItems = () => {
    return allCategories.map((category) => {
      calculateCategoryTotal(category);
      return (
        <div
          key={category}
          className="category"
          onClick={() => handleCategoryClick(category)}
        >
          <h2>{category}</h2>
        </div>
      );
    });
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const calculateCategoryTotal = (category) => {
    const filtered = expenses.filter((transaction) => {
      return (
        (selectedCategory === null ||
          transaction.category === selectedCategory) &&
        (selectedMonth === null ||
          new Date(transaction.date).getMonth() === selectedMonth)
      );
    });

    const total = filtered.reduce((accumulator, current) => {
      return accumulator + parseFloat(current.amount);
    }, 0);

    return total;
  };

  return (
    <CategoryFormStyled>
      <InnerLayout>
        <div className="header">
          <h1>Categories</h1>
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
       <div className="amount-con">
          <div className={`category-container ${isExpanded ? 'expanded' : ''}`}>
            {/* Render your category items here */}
            {renderCategoryItems()}
          </div>
          {/* Show the expand/collapse icon */}
          {allCategories.length > 4 && (
            <div className="toggle-icon" onClick={toggleExpansion}>
              {isExpanded ? <span>-</span> : <span>+</span>}
            </div>
          )}
        </div>
        <div className="trans-content">
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
    </CategoryFormStyled>
  );
}

const CategoryFormStyled = styled.div`
  display: flex;
  overflow: auto;
  flex-direction: column;
  .header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
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

  .amount-con {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    margin-top: 1rem;
    justify-content: center;
    margin-bottom: 1.5rem;

    .category-container {
      display: flex;
      flex-wrap: wrap;
      gap: 2rem;
      overflow: hidden;
      max-height: 6rem; 
      transition: max-height 0.3s ease-in-out;

      &.expanded {
        max-height: none;
      }
    }

    .toggle-icon {
      cursor: pointer;
      margin-top: -2.5rem;

      span {
        font-size: 1.5rem;
      }
    }

    .category {
      background: #fcf6f9;
      border: 2px solid #ffffff;
      box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
      border-radius: 20px;
      padding: 0.4rem 2rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 1rem; 

      h2 {
        margin-bottom: 0.5rem;
      }
    }
  }
`;

export default CategoryForm;
