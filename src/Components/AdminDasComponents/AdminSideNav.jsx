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
import PlayOutlineIcon from '@rsuite/icons/PlayOutline';

const iconStyle = {
  marginLeft: '-35px',
  marginBottom: '-3px',
  marginRight: '20px',
};

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
              style={{ width: '100%', paddingLeft: '17px', borderRadius: '0' }}
            >
              <h3>{isAdminSidebarOpen ? <CloseIcon /> : <MenuIcon />}</h3>
            </Nav.Item>
          </Nav>
        </Sidenav.Header>
        <Divider style={{ margin: '0' }} />
        <Sidenav
          expanded={isAdminSidebarOpen}
          defaultOpenKeys={['12']}
          appearance="subtle"
        >
          <Sidenav.Body style={{ marginTop: '0' }}>
            <Nav>
              <Nav.Item
                eventKey="1"
                active={pathname === '/admin' || pathname === '/admin/users'}
                onClick={() => navigate('/admin/users')}
                icon={<FaUsers style={iconStyle} />}
              >
                <span>User</span>
              </Nav.Item>

              <Nav.Item
                eventKey="2"
                active={pathname === '/admin/organizations'}
                onClick={() => navigate('/admin/organizations')}
                icon={<SlOrganization size={17} style={iconStyle} />}
              >
                Organizations
              </Nav.Item>

              <Nav.Item
                eventKey="3"
                active={pathname === '/admin/applications'}
                onClick={() => navigate('/admin/applications')}
                icon={<TbApps size={21} style={{ ...iconStyle, marginLeft: '-37px' }} />}
              >
                Applications
              </Nav.Item>

              <Nav.Item
                eventKey="4"
                active={pathname === '/admin/integrations'}
                onClick={() => navigate('/admin/integrations')}
                icon={<TbApps size={21} style={{ ...iconStyle, marginLeft: '-37px' }} />}
              >
                Integrations
              </Nav.Item>

              <Nav.Item
                eventKey="5"
                active={pathname === '/admin/projects'}
                onClick={() => navigate('/admin/projects')}
                icon={<VscProject size={18} style={{ ...iconStyle }} />}
              >
                Projects
              </Nav.Item>

              <Nav.Item
                eventKey="6"
                active={pathname === '/admin/link-types'}
                onClick={() => navigate('/admin/link-types')}
                icon={<FaLink size={16.5} style={{ ...iconStyle }} />}
              >
                Link Types
              </Nav.Item>

              <Nav.Item
                eventKey="7"
                active={pathname === '/admin/link-constraint'}
                onClick={() => navigate('/admin/link-constraint')}
                icon={<CgLink size={25} style={{ ...iconStyle, marginLeft: '-39px' }} />}
              >
                Link Constraint
              </Nav.Item>

              <Nav.Item
                eventKey="8"
                active={pathname === '/admin/components'}
                onClick={() => navigate('/admin/components')}
                icon={
                  <SiWebcomponentsdotorg
                    size={18}
                    style={{ ...iconStyle, marginLeft: '-36' }}
                  />
                }
              >
                Components
              </Nav.Item>

              <Nav.Item
                eventKey="9"
                active={pathname === '/admin/events'}
                onClick={() => navigate('/admin/events')}
                icon={<SiAzurepipelines size={15} style={{ ...iconStyle }} />}
              >
                Events
              </Nav.Item>

              <Nav.Item
                eventKey="10"
                active={pathname === '/admin/pipelines'}
                onClick={() => navigate('/admin/pipelines')}
                icon={<SiAzurepipelines size={15} style={{ ...iconStyle }} />}
              >
                Pipelines
              </Nav.Item>

              <Nav.Item
                eventKey="11"
                active={pathname === '/admin/pipelinerun'}
                onClick={() => navigate('/admin/pipelinerun')}
                icon={
                  <PlayOutlineIcon size={15} style={{ ...iconStyle, marginLeft: '0' }} />
                }
              >
                Pipeline Results
              </Nav.Item>

              <Nav.Item
                eventKey="12"
                active={pathname === '/'}
                onClick={() => navigate('/')}
                icon={
                  <TiArrowBackOutline
                    size={22}
                    style={{ ...iconStyle, marginLeft: '-36px' }}
                  />
                }
              >
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
