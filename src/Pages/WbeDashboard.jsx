import React from 'react';
import { Outlet } from 'react-router-dom';

const WbeDashboard = () => {
  console.log('getting into wbeDashboard');
  return (
    <div className='mainContainer wbeDashboardContainer'>
      <Outlet/>
    </div>
  );
};

export default WbeDashboard;