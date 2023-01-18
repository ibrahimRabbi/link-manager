import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ContentSwitcher, Switch  } from '@carbon/react';

const WbeDashboard = () => {
  const navigate =useNavigate();
  const location =useLocation();

  let isSelected;
  if(location.pathname=== '/wbe') isSelected = 0;
  else if(location.pathname === '/wbe/new-link')isSelected = 1;
  else if(location.pathname === '/wbe/graph-view')isSelected= 2;

  const handleNavigate=(switcher)=>{
    if(switcher.name === 'Links') navigate('/wbe');
    else if(switcher.name === 'New Link') navigate('/wbe/new-link');
    else if(switcher.name === 'Graph View') navigate('/wbe/graph-view');
  };

  return (
    <div className="mainContainer wbeDashboardContainer">
      <ContentSwitcher 
        selectionMode='manual'
        className='wbeContentSwitcher'
        selectedIndex={isSelected} 
        onChange={handleNavigate} size='sm'
      >
        <Switch name={'Links'} text='Links' disabled={false} />
        <Switch name={'New Link'} text='New Link' disabled={false} />
        <Switch name={'Graph View'} text='Graph View' disabled={false} />
      </ContentSwitcher>

      <Outlet />
    </div>
  );
};

export default WbeDashboard;
