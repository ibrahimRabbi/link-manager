import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { Sidebar, Sidenav, Nav, Divider } from 'rsuite';
import MenuIcon from '@rsuite/icons/Menu';
import CloseIcon from '@rsuite/icons/Close';
import { handleIsAdminSidebarOpen } from '../../Redux/slices/navSlice';
import { FaUsers, FaLink } from 'react-icons/fa';
import { TiArrowBackOutline } from 'react-icons/ti';
import { SlOrganization } from 'react-icons/sl';
import { SiAzurepipelines, SiWebcomponentsdotorg } from 'react-icons/si';
import { TbApps } from 'react-icons/tb';
import { VscProject } from 'react-icons/vsc';
import { CgLink } from 'react-icons/cg';
import { darkColor, lightBgColor } from '../../App';

const AdminSideNav = () => {
  const { isDark, isAdminSidebarOpen } = useSelector((state) => state.nav);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  return (
    <>
      <Sidebar
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          boxShadow: `2px 2px 5px ${isDark === 'light' ? 'lightgray' : '#292D33'}`,
          backgroundColor: isDark === 'dark' ? darkColor : lightBgColor,
        }}
        width={isAdminSidebarOpen ? 200 : 56}
        collapsible
      >
        <Sidenav.Header>
          <Nav pullRight>
            <Nav.Item
              onClick={() => dispatch(handleIsAdminSidebarOpen(!isAdminSidebarOpen))}
              style={{ width: '100%', paddingLeft: '17px' }}
            >
              <h3>{isAdminSidebarOpen ? <CloseIcon /> : <MenuIcon />}</h3>
            </Nav.Item>
          </Nav>
        </Sidenav.Header>
        <Divider style={{ marginTop: '0' }} />
        <Sidenav
          expanded={isAdminSidebarOpen}
          defaultOpenKeys={['3']}
          appearance="subtle"
        >
          <Sidenav.Body>
            <Nav>
              <Nav.Item
                eventKey="1"
                active={pathname === '/admin' || pathname === '/admin/users'}
                onClick={() => navigate('/admin/users')}
              >
                <FaUsers className="adminDasIcon" />
                <span>User</span>
              </Nav.Item>

              <Nav.Item
                eventKey="2"
                active={pathname === '/admin/organizations'}
                onClick={() => navigate('/admin/organizations')}
              >
                <SlOrganization className="adminDasIcon" />
                Organizations
              </Nav.Item>

              <Nav.Item
                eventKey="3"
                active={pathname === '/admin/applications'}
                onClick={() => navigate('/admin/applications')}
              >
                <TbApps
                  className="adminDasIcon"
                  size={20}
                  style={{ marginLeft: '-37px' }}
                />
                Applications
              </Nav.Item>

              <Nav.Item
                eventKey="4"
                active={pathname === '/admin/integrations'}
                onClick={() => navigate('/admin/integrations')}
              >
                <TbApps
                  className="adminDasIcon"
                  size={20}
                  style={{ marginLeft: '-37px' }}
                />
                Integrations
              </Nav.Item>

              <Nav.Item
                eventKey="5"
                active={pathname === '/admin/projects'}
                onClick={() => navigate('/admin/projects')}
              >
                <VscProject
                  className="adminDasIcon"
                  size={18}
                  style={{ marginLeft: '-36px' }}
                />
                Projects
              </Nav.Item>

              <Nav.Item
                eventKey="6"
                active={pathname === '/admin/link-types'}
                onClick={() => navigate('/admin/link-types')}
              >
                <FaLink className="adminDasIcon" />
                Link Types
              </Nav.Item>

              <Nav.Item
                eventKey="7"
                active={pathname === '/admin/link-constraint'}
                onClick={() => navigate('/admin/link-constraint')}
              >
                <CgLink
                  size={22}
                  style={{ marginLeft: '-39px' }}
                  className="adminDasIcon"
                />
                Link Constraint
              </Nav.Item>

              <Nav.Item
                eventKey="8"
                active={pathname === '/admin/components'}
                onClick={() => navigate('/admin/components')}
              >
                <SiWebcomponentsdotorg className="adminDasIcon" />
                Components
              </Nav.Item>

              <Nav.Item
                eventKey="8"
                active={pathname === '/admin/events'}
                onClick={() => navigate('/admin/events')}
              >
                <SiAzurepipelines className="adminDasIcon" />
                Events
              </Nav.Item>

              <Nav.Item
                eventKey="9"
                active={pathname === '/'}
                onClick={() => navigate('/')}
              >
                <TiArrowBackOutline
                  size={21}
                  style={{ marginLeft: '-36px' }}
                  className="adminDasIcon"
                />
                Back To Home
              </Nav.Item>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
      </Sidebar>
    </>
  );
};

export default AdminSideNav;
