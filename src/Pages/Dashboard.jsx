import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import NavigationBar from '../Components/Shared/NavigationBar/NavigationBar';
import { handleIsProfileOpen } from '../Redux/slices/linksSlice';

const Dashboard = () => {
  const {isProfileOpen, isSidebarOpen}=useSelector(state=>state.links);
  const dispatch=useDispatch();
  
  return (
    <>
      <NavigationBar/>
      <div className={isSidebarOpen?'show_nav':''}
        onClick={()=>dispatch(handleIsProfileOpen(isProfileOpen && false))}>
        <div className='mainContainer'>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
