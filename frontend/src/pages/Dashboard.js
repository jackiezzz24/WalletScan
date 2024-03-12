import DashboardForm from "./components/DashboarForm";
import React, { useState, useMemo, useRef, useEffect } from "react";
import styled from "styled-components";
import { MainLayout } from "./components/utils/Layout";
import Orb from "./components/utils/Orb";
import Budget from "./components/Budget";
import { useTransactionsContext } from "./components/TransactionContext";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import { ProfileProvider } from "./components/ProfileContext";
import CategoryForm from "./components/CategoryForm";
import AddTransaction from "./components/AddTransaction";
import History from "./components/History";

function Dashboard() {
  const [active, setActive] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const global = useTransactionsContext();
  console.log(global);

  const mainRef = useRef(null);
  const [showScrollbar, setShowScrollbar] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const hasScrollbar = mainRef.current.scrollWidth > mainRef.current.clientWidth;
      setShowScrollbar(hasScrollbar);
    };
    mainRef.current.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => mainRef.current.removeEventListener('scroll', handleScroll);
  }, []);

  const displayData = () => {
    if (showForm) {
      return <AddTransaction />;
    } else {
      if (active === 1) {
        return <DashboardForm />;
      } else if (active === 2) {
        return <History />;
      } else if (active === 3) {
        return <CategoryForm />;
      } else if (active === 4) {
        return <Budget />;
      } else if (active === 5) {
        return <Profile />;
      } else if (active === 6) {
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
    } else {
      setShowForm(false);
      setActive(newActive);
    }
  };

  return (
    <DashboardStyled className="Dashboard" showScrollbar={showScrollbar}>
      {orbMemo}
      <MainLayout>
        <LeftPanel active={active} setActive={handleSetActive} />
        <ProfileProvider>
          <main ref={mainRef}>
            <div className="scroll-container">{displayData()}</div>
          </main>
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
  height: 860px;
  position: relative;
  main {
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    padding: 10px;
    border: 3px solid #ffffff;
    backdrop-filter: blur(4.5px);
    border-radius: ${(props) => (props.showScrollbar ? "0" : "32px")};
    overflow-x: auto;

    &::-webkit-scrollbar {
      width: 0px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #9fedb2;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-track {
      background-color: #f1f1f1;
      border-radius: 10px;
    }
  }
`;

export default Dashboard;
