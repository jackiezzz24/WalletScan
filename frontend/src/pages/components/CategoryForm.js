import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { InnerLayout } from "./utils/Layout";
import { useTransactionsContext } from "./TransactionContext";
import TransactionItem from "./utils/TransactionItem";

function CategoryForm() {
  const { getExpenses, expenses } = useTransactionsContext();
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    getExpenses();
  }, [getExpenses]);

  const formatAmount = (amount) => {
    return parseFloat(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const calculateCategoryTotals = () => {
    const categoryTotals = {};

    expenses.forEach((expense) => {
      const category = expense.category || "Others";
      const amount = parseFloat(expense.amount);

      if (!isNaN(amount)) {
        if (categoryTotals[category]) {
          categoryTotals[category] += amount;
        } else {
          categoryTotals[category] = amount;
        }
      }
    });

    return categoryTotals;
  };

  const renderCategoryItems = () => {
    const topCategories = categoryArray
      .slice(0, 3)
      .map(({ category, total }) => (
        <div
          key={category}
          className="category"
          onClick={() => handleCategoryClick(category)}
        >
          <h2>{category}</h2>
          <p>{formatAmount(total)}</p>
        </div>
      ));

    const totalOtherCategories = categoryArray
      .slice(3)
      .reduce((total, { total: categoryTotal }) => total + categoryTotal, 0);

    const othersCategory = (
      <div
        key="Others"
        className="category"
        onClick={() => handleCategoryClick("Others")}
      >
        <h2>Others</h2>
        <p>{formatAmount(totalOtherCategories)}</p>
      </div>
    );

    return [...topCategories, othersCategory];
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === "Others" ? null : category);
  };

  const categoryTotals = calculateCategoryTotals();
  const categoryArray = Object.entries(categoryTotals).map(
    ([category, total]) => ({
      category,
      total,
    })
  );

  categoryArray.sort((a, b) => b.total - a.total);

  const filteredTransactions = () => {
    let filtered = expenses;
  
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  
    if (selectedCategory !== null) {
      if (selectedCategory === "Others") {
        const top3Categories = categoryArray.slice(0, 3).map(({ category }) => category);
        console.log(top3Categories);
        filtered = filtered.filter((transaction) => !top3Categories.includes(transaction.category));
      } else {
        filtered = filtered.filter((transaction) => transaction.category === selectedCategory);
      }
    }
  
    return filtered;
  };

  return (
    <CategoryFormStyled>
      <InnerLayout>
        <h1>Top 3 Categories</h1>
        <div className="amount-con">{renderCategoryItems()}</div>
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
h1 {
  color: rgba(34, 34, 126, 1);
}

.amount-con {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  margin-top: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;

  .category {
    background: #fcf6f9;
    border: 2px solid #ffffff;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 1rem 3rem;
    display: flex;
    flex-direction: column; // Keep this if you want h2 and p stacked vertically

    h2 {
      margin-bottom: 0.5rem;
    }

    p {
      margin: 0;
      font-size: 1.2rem;
    }
  }
}
`;

export default CategoryForm;
