import { Container } from 'rsuite';
import React from 'react';
import { Outlet } from 'react-router-dom';
import WbeTopNav from '../Components/Shared/NavigationBar/WbeTopNav';

const WbeDashboard = () => {
  return (
    <>
      <div className="show-fake-browser sidebar-page">
        <Container>
          <div style={{ position: 'fixed' }}>
            <WbeTopNav />
          </div>
          <div style={{ width: '100%' }}>
            <Outlet />
          </div>
        </Container>
      </div>
    </>
  );
};

export default WbeDashboard;
