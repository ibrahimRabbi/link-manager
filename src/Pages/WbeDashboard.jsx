import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ContentSwitcher, Switch } from '@carbon/react';

const WbeDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  let isSelected;
  if (location.pathname === '/wbe') isSelected = 0;
  else if (location.pathname === '/wbe/new-link') isSelected = 1;
  else if (location.pathname === '/wbe/graph-view') isSelected = 2;

  const handleNavigate = (switcher) => {
    if (switcher.name === 'Links') navigate('/wbe');
    else if (switcher.name === 'New Link') navigate('/wbe/new-link');
    else if (switcher.name === 'Graph View') navigate('/wbe/graph-view');
  };

  return (
    <div className="mainContainer wbeDashboardContainer">
      <ContentSwitcher
        light={true}
        selectionMode="manual"
        className="wbeContentSwitcher"
        selectedIndex={isSelected}
        onChange={handleNavigate}
        size="sm"
      >
        <Switch name={'Links'} disabled={false}><p>Links</p></Switch>
        <Switch name={'New Link'} disabled={false}><p>New Link</p></Switch>
        <Switch name={'Graph View'} disabled={false}><p>Graph View</p></Switch>
      </ContentSwitcher>

      <Outlet />
    </div>
  );
};

export default WbeDashboard;
