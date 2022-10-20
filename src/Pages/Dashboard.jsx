import React from 'react';
import { Outlet } from 'react-router-dom';
import mediaQuery from '../Components/Shared/MediaQueryHook/MediaQuery';
import NavigationBar from '../Components/Shared/NavigationBar/NavigationBar';

const Dashboard = () => {
  const isDeskTop=mediaQuery('(min-width: 1055px)');
  return (
    <>
      <NavigationBar/>
      <div className={isDeskTop?'show_nav':'hide_nav'}>
        <div className="mainContainer">
          <Outlet/>
        </div>
      </div>
    </>
  );
};

export default Dashboard;