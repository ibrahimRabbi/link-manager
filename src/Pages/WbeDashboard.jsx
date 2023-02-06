import React from 'react';
import { Outlet } from 'react-router-dom';

const WbeDashboard = () => {
  return (
    <div className="mainContainer wbeDashboardContainer">
      <div className="wbeContent">
        <Outlet />
      </div>
    </div>
  );
};

export default WbeDashboard;
