import {
  SideNav,
  SideNavItems,
  SideNavLink,
  // SideNavMenu,
  SideNavMenuItem,
  Theme,
} from '@carbon/react';
import React, { useState } from 'react';
import { FaUsers } from 'react-icons/fa';
import { TiArrowBackOutline } from 'react-icons/ti';
import { SlOrganization } from 'react-icons/sl';
import { ImMenu } from 'react-icons/im';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [isSideNav, setIsSideNav] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <>
      <div
        style={{
          marginLeft: isSideNav ? '250px' : '55px',
          transition: 'all 0.2s',
          padding: '0 1vw 2vh',
        }}
      >
        <Outlet />
      </div>
      <Theme theme="g100">
        <SideNav
          style={{ width: isSideNav ? '250px' : '55px' }}
          className="cds--side-nav__overlay-active"
          aria-label=""
          isPersistent={true}
          isChildOfHeader={false}
        >
          <SideNavItems>
            <SideNavMenuItem
              style={{ margin: '0 0 20px -5px' }}
              className={'aDashboardLink'}
              onClick={() => setIsSideNav(!isSideNav)}
            >
              <ImMenu style={{ cursor: 'pointer' }} size={30} />
            </SideNavMenuItem>

            {/* <SideNavMenu title="Users"
              renderIcon={() => <FaUsers />}>
              <SideNavMenuItem
                className={'aDashboardLink'}
                onClick={() => navigate('/admin/users')}
                isActive={pathname === '/admin/users'}
              > Active Users</SideNavMenuItem>

              <SideNavMenuItem
                className={'aDashboardLink'}
                onClick={() => navigate('/admin/users')}
                isActive={pathname === '/admin/users'}
              > ALL Users</SideNavMenuItem>
            </SideNavMenu> */}

            <SideNavLink
              renderIcon={() => <FaUsers />}
              className={'aDashboardLink'}
              onClick={() => navigate('/admin/users')}
              isActive={pathname === '/admin/users'}
            >
              Users
            </SideNavLink>

            <SideNavLink
              renderIcon={() => <SlOrganization />}
              className={'aDashboardLink'}
              onClick={() => navigate('/admin/organization')}
              isActive={pathname === '/admin/organization'}
            >
              Organization
            </SideNavLink>

            <SideNavLink
              renderIcon={() => <TiArrowBackOutline />}
              className={'aDashboardLink'}
              onClick={() => navigate('/')}
            >
              Back to home
            </SideNavLink>
          </SideNavItems>
        </SideNav>
      </Theme>
    </>
  );
};

export default AdminDashboard;
