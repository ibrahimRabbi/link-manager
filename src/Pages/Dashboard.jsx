import React, {useContext} from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from '../Components/Shared/NavigationBar/NavigationBar';
import NavigationBarContext from '../Store/NavigationBar-Context.jsx';

const Dashboard = () => {
  console.log('Dashboard.jsx');

  const navbarCtx = useContext(NavigationBarContext);

  return (
    <>
      <NavigationBar />
      <div className={navbarCtx.isSidebarOpen ? 'show_nav' : ''}
        onClick={() => navbarCtx.setProfile((navbarCtx.isProfileOpen && false))}>
        <div className='mainContainer'>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
