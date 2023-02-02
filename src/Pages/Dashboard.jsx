import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import NavigationBar from '../Components/Shared/NavigationBar/NavigationBar';

const Dashboard = () => {
  const { isSidebarOpen } = useSelector((state) => state.nav);

  return (
    <>
      <NavigationBar />
      <div className={isSidebarOpen ? 'show_nav' : ''}>
        <Outlet />
      </div>
    </>
  );
};

export default Dashboard;
