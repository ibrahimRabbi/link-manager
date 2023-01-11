import React from 'react';
import { Outlet } from 'react-router-dom';

const WbeDashboard = () => {
  return (
    <div className='mainContainer wbeDashboardContainer'>
      <Outlet />
    </div>
  );
};

export default WbeDashboard;
