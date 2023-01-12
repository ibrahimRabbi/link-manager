import React, {useState} from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import NavigationBar from '../Components/Shared/NavigationBar/NavigationBar';
import { handleIsProfileOpen } from '../Redux/slices/linksSlice';

const Dashboard = () => {
  console.log('Dashboard.jsx');
  const [isProfileOpen] = useState(false);
  const [isSidebarOpen] = useState(false);
  // const {isProfileOpen, isSidebarOpen} = useSelector(state=>state.links);
  const dispatch=useDispatch();
  
  return (
    <>
      <NavigationBar />
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
