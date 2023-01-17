import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import NavigationBar from '../Components/Shared/NavigationBar/NavigationBar';
import { handleIsProfileOpen } from '../Redux/slices/navSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { isSidebarOpen, isProfileOpen } = useSelector((state) => state.nav);

  return (
    <>
      <NavigationBar />
      <div
        className={isSidebarOpen ? 'show_nav' : ''}
        onClick={() => dispatch(handleIsProfileOpen(isProfileOpen && false))}
      >
        <Outlet />
      </div>
    </>
  );
};

export default Dashboard;
