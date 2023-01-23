import React from 'react';
import { Outlet} from 'react-router-dom';
// import { ContentSwitcher, Switch } from '@carbon/react';
import WbeTopNav from '../Components/Shared/NavigationBar/WbeTopNav';
import { useDispatch, useSelector } from 'react-redux';
import { handleIsProfileOpen } from '../Redux/slices/navSlice';

const WbeDashboard = () => {
  const {isProfileOpen}=useSelector(state=>state.nav);
  // const {sourceDataList}=useSelector(state=>state.links);
  // const location = useLocation();
  // const wbePath = location.pathname?.includes('wbe');
  // const navigate =useNavigate();
  const dispatch =useDispatch();
  
  return (
    <div className="mainContainer wbeDashboardContainer">
    
      {/* ------- Top Nav for WBE -------   */}
      <WbeTopNav/>

      <div className='wbeContent'
        onClick={() => dispatch(handleIsProfileOpen(isProfileOpen && false))}>

        <Outlet />
      </div>
    </div>
  );
};

export default WbeDashboard;
