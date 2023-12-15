import { Container } from 'rsuite';
import React from 'react';
import { Outlet } from 'react-router-dom';
import SideNavBar from '../Components/Shared/NavigationBar/SideNavBar';
import { useSelector } from 'react-redux';

const WbeDashboard = () => {
  const { isSidebarOpen } = useSelector((state) => state.nav);

  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <div style={{ position: 'fixed' }}>
          <SideNavBar isWbe={true} />
        </div>
        <div
          className={isSidebarOpen ? 'show_nav' : 'hide_nav'}
          style={{ padding: '20px 1vw 0' }}
        >
          <Outlet />
        </div>
      </Container>
    </div>
  );
};

export default WbeDashboard;
