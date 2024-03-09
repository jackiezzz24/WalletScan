import DashboardForm from "./components/DashboardForm";
import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { MainLayout } from "./components/utils/Layout";
import Orb from "./components/utils/Orb";
import Income from "./components/Income";
import Expenses from "./components/Expense";
import { useTransactionsContext } from "./components/Transactions";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import { ProfileProvider } from "./components/ProfileContext";

function Dashboard() {
  const [active, setActive] = useState(false);

  const global = useTransactionsContext();
  console.log(global);

  const displayData = () => {
    switch (active) {
      case 1:
        return <DashboardForm />;
      case 2:
        return <DashboardForm />;
      case 3:
        return <DashboardForm />;
      case 4:
        return <Income />;
      case 5:
        return <Expenses />;
      case 6:
        return <Profile />;
      case 7:
        return <Settings />;
      default:
        return <DashboardForm />;
    }
  };

  const orbMemo = useMemo(() => {
    return <Orb />;
  }, []);

  return (
    <DashboardStyled className="Dashboard">
      {orbMemo}
      <MainLayout>
        <LeftPanel active={active} setActive={setActive} />
        <ProfileProvider>
          <main>{displayData()}</main>
          <RightPanel active={active} setActive={setActive} />
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
