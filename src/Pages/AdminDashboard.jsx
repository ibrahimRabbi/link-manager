import {
  Button,
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
  Theme,
} from '@carbon/react';
import React, { useState } from 'react';
import { FaUserTie } from 'react-icons/fa';
import { SlOrganization } from 'react-icons/sl';
import { ImMenu } from 'react-icons/im';
import {
  //  useLocation,
  useNavigate,
} from 'react-router-dom';
import UseTable from '../Components/AdminDasComponents/UseTable';

const AdminDashboard = () => {
  const [isSideNav, setIsSideNav] = useState(false);
  const navigate = useNavigate();
  //   const {pathname} = useLocation();
  return (
    <>
      <div
        style={{
          marginLeft: isSideNav ? '250px' : '55px',
          transition: 'all 0.2s',
          padding: '0 1vw',
        }}
      >
        <h2>This is admin dashboard</h2>
        <Button size="md" kind="primary" onClick={() => navigate('/')}>
          Back
        </Button>

        <UseTable />
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
              // className={sidebarLink}
              onClick={() => setIsSideNav(!isSideNav)}
            >
              <ImMenu size={30} />
            </SideNavMenuItem>

            <SideNavLink
              renderIcon={() => <FaUserTie size={40} />}
              //   className={sidebarLink}
              //   onClick={() => navigate('/admin/user')}
              //   isActive={pathname === '/admin/user'}
            >
              {' '}
              User
            </SideNavLink>

            <SideNavMenu
              title="Organization"
              renderIcon={() => <SlOrganization size={30} />}
              //   className={sidebarLink}
              //   onClick={() => navigate('/admin/Organization')}
              //   isActive={pathname === '/admin/Organization'}
            >
              <SideNavMenuItem>General Setting</SideNavMenuItem>
              <SideNavMenuItem>Team</SideNavMenuItem>
            </SideNavMenu>

            <SideNavMenu
              title="Customers"
              renderIcon={() => <SlOrganization size={30} />}
              //   className={sidebarLink}
              //   onClick={() => navigate('/admin/Organization')}
              //   isActive={pathname === '/admin/Organization'}
            >
              <SideNavMenuItem>Customers 1</SideNavMenuItem>
              <SideNavMenuItem>Customers 2</SideNavMenuItem>
            </SideNavMenu>

            <SideNavMenu
              title="Documentation"
              renderIcon={() => <SlOrganization size={30} />}
              //   className={sidebarLink}
              //   onClick={() => navigate('/admin/Organization')}
              //   isActive={pathname === '/admin/Organization'}
            >
              <SideNavMenuItem>Documentation 1</SideNavMenuItem>
              <SideNavMenuItem>Documentation 2</SideNavMenuItem>
            </SideNavMenu>
          </SideNavItems>
        </SideNav>
      </Theme>
    </>
  );
};

export default AdminDashboard;
