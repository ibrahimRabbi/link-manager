import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { Container } from 'rsuite';
import SideNavBar from '../Components/Shared/NavigationBar/SideNavBar';
import NavigationBar from '../Components/Shared/NavigationBar/NavigationBar';
import { useEffect } from 'react';
import { handleIsSidebarOpen } from '../Redux/slices/navSlice';

const Dashboard = () => {
  const { isSidebarOpen } = useSelector((state) => state.nav);
  const { isWbe } = useSelector((state) => state.links);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isWbe) dispatch(handleIsSidebarOpen(true));
  }, []);

  return (
    <div className="show-fake-browser sidebar-page">
      <NavigationBar />
      <Container>
        <div style={{ position: 'fixed' }}>
          <SideNavBar isWbe={false} />
        </div>
        <div
          className={isSidebarOpen ? 'show_nav' : 'hide_nav'}
          style={{ marginTop: isWbe ? '' : '50px', padding: '20px 1vw 0' }}
        >
          <Outlet />
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;
