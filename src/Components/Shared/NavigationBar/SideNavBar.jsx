import React, { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import './NavigationBar.module.scss';
import { ImBrightnessContrast } from 'react-icons/im';
import { BiLogOut } from 'react-icons/bi';

import { Sidebar, Sidenav, Navbar, Nav, Divider } from 'rsuite';
import CogIcon from '@rsuite/icons/legacy/Cog';
import ShareOutlineIcon from '@rsuite/icons/ShareOutline';
import TableColumnIcon from '@rsuite/icons/TableColumn';
import Swal from 'sweetalert2';
import AuthContext from '../../../Store/Auth-Context';
import { handleIsDarkMode, handleIsSidebarOpen } from '../../../Redux/slices/navSlice';
import MenuIcon from '@rsuite/icons/Menu';
import CloseIcon from '@rsuite/icons/Close';
import DashboardIcon from '@rsuite/icons/Dashboard';
import AttachmentIcon from '@rsuite/icons/Attachment';
import { darkColor, lightBgColor } from '../../../App';

const SideNavBar = ({ isWbe }) => {
  const { isDark, isSidebarOpen } = useSelector((state) => state.nav);
  const { isGraphDashboardDisplay, isTreeviewTableDisplay } = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);
  const { pathname } = useLocation();

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to logout!',
      icon: 'warning',
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        authCtx.logout();
        Swal.fire({
          title: 'Logged out successful',
          icon: 'success',
        });
        navigate('/login', { replace: true });
      }
    });
  };

  return (
    <>
      <Sidebar
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: isWbe ? '100vh' : '94vh',
          boxShadow: `2px 2px 5px ${isDark === 'light' ? 'lightgray' : '#292D33'}`,
          backgroundColor: isDark === 'dark' ? darkColor : lightBgColor,
        }}
        width={isSidebarOpen ? 200 : 56}
        collapsible
      >
        <Sidenav.Header>
          <Nav pullRight>
            <Nav.Item
              onClick={() => dispatch(handleIsSidebarOpen(!isSidebarOpen))}
              style={{ width: '100%', paddingLeft: '17px', borderRadius: '0' }}
            >
              <h3>{isSidebarOpen ? <CloseIcon /> : <MenuIcon />}</h3>
            </Nav.Item>
          </Nav>
        </Sidenav.Header>
        <Divider style={{ marginTop: '0' }} />
        <Sidenav expanded={isSidebarOpen} defaultOpenKeys={['3']} appearance="subtle">
          <Sidenav.Body>
            <Nav>
              <Nav.Item
                eventKey="1"
                active={isWbe ? pathname === '/wbe' : pathname === '/'}
                icon={<TableColumnIcon />}
                onClick={() => (isWbe ? navigate('/wbe') : navigate('/'))}
              >
                Links
              </Nav.Item>

              {isTreeviewTableDisplay && (
                <Nav.Item
                  eventKey="2"
                  active={isWbe ? pathname === '/wbe/treeview' : pathname === '/treeview'}
                  icon={<TableColumnIcon />}
                  onClick={() =>
                    isWbe ? navigate('/wbe/treeview') : navigate('/treeview')
                  }
                >
                  {' '}
                  Links Treeview
                </Nav.Item>
              )}

              <Nav.Item
                eventKey="3"
                active={
                  isWbe ? pathname === '/wbe/graph-view' : pathname === '/graph-view'
                }
                icon={<ShareOutlineIcon />}
                onClick={() =>
                  isWbe ? navigate('/wbe/graph-view') : navigate('/graph-view')
                }
              >
                Graph View
              </Nav.Item>

              {isGraphDashboardDisplay && (
                <Nav.Item
                  eventKey="3"
                  active={
                    // eslint-disable-next-line max-len
                    isWbe
                      ? pathname === '/wbe/graph-dashboard'
                      : pathname === '/graph-dashboard'
                  }
                  icon={<ShareOutlineIcon />}
                  onClick={() =>
                    isWbe
                      ? navigate('/wbe/graph-dashboard')
                      : navigate('/graph-dashboard')
                  }
                >
                  {' '}
                  Graph View
                </Nav.Item>
              )}

              {!isWbe && (
                <Nav.Item
                  eventKey="4"
                  active={pathname === '/admin'}
                  icon={<DashboardIcon />}
                  onClick={() => navigate('/admin')}
                >
                  Dashboard
                </Nav.Item>
              )}
              {!isWbe && (
                <Nav.Item
                  eventKey="4"
                  active={pathname === '/extension'}
                  icon={<AttachmentIcon />}
                  onClick={() => navigate('/extension')}
                >
                  Extension
                </Nav.Item>
              )}
            </Nav>
          </Sidenav.Body>
        </Sidenav>

        {isWbe && (
          <Navbar
            style={{ marginTop: 'auto' }}
            appearance="subtle"
            className="nav-toggle"
          >
            <Nav>
              <Nav.Menu
                noCaret
                placement="topStart"
                trigger="click"
                title={<CogIcon style={{ width: 20, height: 20 }} size="lg" />}
              >
                <Nav.Item
                  style={{ width: '45px' }}
                  onClick={() => dispatch(handleIsDarkMode())}
                >
                  <h5>
                    <ImBrightnessContrast />
                  </h5>
                </Nav.Item>

                <Nav.Item onClick={() => handleLogout()}>
                  {' '}
                  <h5>
                    <BiLogOut />
                  </h5>{' '}
                </Nav.Item>
              </Nav.Menu>
            </Nav>
          </Navbar>
        )}
      </Sidebar>
    </>
  );
};

export default SideNavBar;
