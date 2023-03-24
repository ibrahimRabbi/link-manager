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
import { GrAppsRounded } from 'react-icons/gr';
import { VscProject } from 'react-icons/vsc';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { TextLink, Unlink } from '@carbon/icons-react';

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

            {/* Users  */}
            <SideNavLink
              renderIcon={FaUsers}
              className={'aDashboardLink'}
              onClick={() => navigate('/admin/users')}
              isActive={pathname === '/admin' || pathname === '/admin/users'}
            >
              Users
            </SideNavLink>

            {/* Organizations  */}
            <SideNavLink
              renderIcon={SlOrganization}
              className={'aDashboardLink'}
              onClick={() => navigate('/admin/organizations')}
              isActive={pathname === '/admin/organizations'}
            >
              Organizations
            </SideNavLink>

            {/* Applications */}
            <SideNavLink
              renderIcon={GrAppsRounded}
              className={'aDashboardLink'}
              onClick={() => navigate('/admin/applications')}
              isActive={pathname === '/admin/applications'}
            >
              Applications
            </SideNavLink>

            {/* Projects  */}
            <SideNavLink
              renderIcon={VscProject}
              className={'aDashboardLink'}
              onClick={() => navigate('/admin/projects')}
              isActive={pathname === '/admin/projects'}
            >
              Projects
            </SideNavLink>

            {/* Link types  */}
            <SideNavLink
              renderIcon={TextLink}
              className={'aDashboardLink'}
              onClick={() => navigate('/admin/link-types')}
              isActive={pathname === '/admin/link-types'}
            >
              Link Types
            </SideNavLink>

            {/* link-constraint  */}
            <SideNavLink
              renderIcon={Unlink}
              className={'aDashboardLink'}
              onClick={() => navigate('/admin/link-constraint')}
              isActive={pathname === '/admin/link-constraint'}
            >
              Link Constraint
            </SideNavLink>

            <SideNavLink
              renderIcon={TiArrowBackOutline}
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
