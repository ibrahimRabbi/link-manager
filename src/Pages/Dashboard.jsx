import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { Container } from 'rsuite';
import SideNavBar from '../Components/Shared/NavigationBar/SideNavBar';
import NavigationBar from '../Components/Shared/NavigationBar/NavigationBar';

const Dashboard = () => {
  const { isSidebarOpen } = useSelector((state) => state.nav);

  return (
    <div className="show-fake-browser sidebar-page">
      <NavigationBar />
      <Container>
        <div style={{ position: 'fixed' }}>
          <SideNavBar isWbe={false} />
        </div>
        <div className={isSidebarOpen ? 'show_nav' : 'hide_nav'}>
          <Outlet />
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;
