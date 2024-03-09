import React, { useEffect } from "react";
import styled from "styled-components";
import { InnerLayout } from "./utils/Layout";
import { useTransactionsContext } from "./TransactionContext";
import { dollar } from "./utils/Icons";
import Chart from "./Chart";
import Pie from "./Pie";

function DashboardForm() {
  const { totalExpenses, totalIncome, totalBalance, getIncomes, getExpenses } =
    useTransactionsContext();

  useEffect(() => {
    getIncomes();
    getExpenses();
  }, [getExpenses, getIncomes]);

  return (
    <DashboardStyled>
      <InnerLayout>
        <h1>Overview</h1>
        <div className="stats-con">
          <div className="amount-con">
            <div className="income">
              <h2>Total Income</h2>
              <p>
                {dollar} {totalIncome()}
              </p>
            </div>
            <div className="expense">
              <h2>Total Expense</h2>
              <p>
                {dollar} {totalExpenses()}
              </p>
            </div>
            <div className="balance">
              <h2>Total Balance</h2>
              <p>
                {dollar} {totalBalance()}
              </p>
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
            <Pie />
          </div>
        </div>
      </InnerLayout>
    </DashboardStyled>
  );
}

const DashboardStyled = styled.div`
  h1 {
    color: rgba(34, 34, 126, 1);
  }

  .chart-con {
    margin-top: 6rem;
    display: flex;
    gap: 5rem;

    .chart {
      height: 250px;
      width: 400px;
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
    gap: 2rem;

    .amount-con {
      display: flex;
      gap: 4rem;
      flex-direction: row;
      margin-top: 2rem;

      .income,
      .expense,
      .balance {
        background: #fcf6f9;
        border: 2px solid #ffffff;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 1rem 4rem;
        justify-content: center;
        align-items: center;
        display: flex;
        flex-direction: column;
        p {
          font-size: 3.5rem;
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