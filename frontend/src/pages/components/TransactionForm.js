import React, { useEffect } from "react";
import styled from "styled-components";
import { InnerLayout } from "./utils/Layout";
import { useTransactionsContext } from "./TransactionContext";
import History from "./History";

function TransactionForm() {
  const { getIncomes, getExpenses } = useTransactionsContext();

  useEffect(() => {
    getIncomes();
    getExpenses();
  }, [getExpenses, getIncomes]);

  return (
    <TransactionFormStyled>
      <InnerLayout>
        <h1>All Transactions</h1>
        <div className="stats-con">
          <div className="history-con">
            <History />
          </div>
        </div>
      </InnerLayout>
    </TransactionFormStyled>
  );
}

const TransactionFormStyled = styled.div`
  h1 {
    color: rgba(34, 34, 126, 1);
  }

  .history-con {
    margin-top: 6rem;
    display: flex;
    gap: 5rem;
  }
`;

export default TransactionForm;
