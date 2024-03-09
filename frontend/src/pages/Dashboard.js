import DashboardForm from "./components/DashboarForm";
import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { MainLayout } from "./components/utils/Layout";
import Orb from "./components/utils/Orb";
import Income from "./components/Income";
import Expenses from "./components/Expense";
import { useTransactionsContext } from "./components/TransactionContext";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import { ProfileProvider } from "./components/ProfileContext";
import TransactionForm from "./components/TransactionForm";
import CategoryForm from "./components/CategoryForm";
import AddTransaction from "./components/AddTransaction";

function Dashboard() {
  const [active, setActive] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const global = useTransactionsContext();
  console.log(global);

  const displayData = () => {
    if (showForm) {
      return <AddTransaction />;
    } else {
      if (active === 1) {
        return <DashboardForm />;
      } else if (active === 2) {
        return <TransactionForm />;
      } else if (active === 3) {
        return <CategoryForm />;
      } else if (active === 4) {
        return <Income />;
      } else if (active === 5) {
        return <Expenses />;
      } else if (active === 6) {
        return <Profile />;
      } else if (active === 7) {
        return <Settings />;
      } else {
        return <DashboardForm />;
      }
    }
  };

  const orbMemo = useMemo(() => {
    return <Orb />;
  }, []);

  const handleSetActive = (newActive) => {
    if (newActive === active) {
      setShowForm(!showForm); 
    } else {
      setShowForm(false); 
      setActive(newActive);
    }
  };

  return (
    <DashboardStyled className="Dashboard">
      {orbMemo}
      <MainLayout>
        <LeftPanel active={active} setActive={handleSetActive} />
        <ProfileProvider>
          <main>{displayData()}</main>
          <RightPanel
            active={active}
            setActive={handleSetActive}
            setShowForm={setShowForm}
          />
        </ProfileProvider>
      </MainLayout>
    </DashboardStyled>
  );
}

const DashboardStyled = styled.div`
  height: 100vh;
  position: relative;
  main {
    flex: 1;
    height: 90%;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #ffffff;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;

export default Dashboard;
