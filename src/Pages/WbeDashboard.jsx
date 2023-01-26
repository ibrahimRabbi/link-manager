import React from 'react';
import { Outlet } from 'react-router-dom';
import WbeTopNav from '../Components/Shared/NavigationBar/WbeTopNav';
import { useDispatch, useSelector } from 'react-redux';
import { handleIsProfileOpen } from '../Redux/slices/navSlice';

const WbeDashboard = () => {
  const { isProfileOpen } = useSelector((state) => state.nav);
  const dispatch = useDispatch();

  return (
    <div className="mainContainer wbeDashboardContainer">
      {/* ------- Top Nav for WBE -------   */}
      <WbeTopNav />

      <div className="wbeContent"
        onClick={() => dispatch(handleIsProfileOpen(isProfileOpen && false))}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default WbeDashboard;
