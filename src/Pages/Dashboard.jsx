import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import mediaQuery from '../Components/Shared/MediaQueryHook/MediaQuery';
import NavigationBar from '../Components/Shared/NavigationBar/NavigationBar';
import { handleIsProfileOpen } from '../Redux/slices/linksSlice';

const Dashboard = () => {
  const isDeskTop=mediaQuery('(min-width: 1055px)');
  const {isProfileOpen}=useSelector(state=>state.links);
  const dispatch=useDispatch();
  
  return (
    <>
      <NavigationBar/>
      <div className={isDeskTop?'show_nav':'hide_nav'} onClick={()=>dispatch(handleIsProfileOpen(isProfileOpen && false))}>
        <div className='mainContainer'>
          <Outlet/>
        </div>
      </div>
    </>
  );
};

export default Dashboard;