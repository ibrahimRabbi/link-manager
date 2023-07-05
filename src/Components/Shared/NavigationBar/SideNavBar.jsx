import React, { useContext } from 'react';
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
import PlayOutlineIcon from '@rsuite/icons/PlayOutline';

let isGraphDashboard = process.env.REACT_APP_IS_GRAPH_DASHBOARD;
if (isGraphDashboard) isGraphDashboard = JSON.parse(isGraphDashboard);

const baseOptions = [
  {
    path: '/',
    navigateTo: '/',
    icon: <TableColumnIcon />,
    content: <span>Links</span>,
  },
  {
    path: '/graph-view',
    navigateTo: '/graph-view',
    icon: <ShareOutlineIcon />,
    content: <span>Graph View</span>,
  },
  {
    path: '/graph-dashboard',
    navigateTo: '/graph-dashboard',
    icon: <ShareOutlineIcon />,
    content: <span>Graph View</span>,
  },
  {
    path: '/pipeline',
    navigateTo: '/pipeline',
    icon: <PlayOutlineIcon />,
    content: <span>Pipeline</span>,
  },

  {
    path: '/admin',
    navigateTo: '/admin',
    icon: <DashboardIcon />,
    content: <span>Dashboard</span>,
  },
  {
    path: '/extension',
    navigateTo: '/extension',
    icon: <AttachmentIcon />,
    content: <span>Extension</span>,
  },
];

const SideNavBar = ({ isWbe }) => {
  const { isDark, isSidebarOpen } = useSelector((state) => state.nav);
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
              {baseOptions?.map((option, index) => {
                // hide admin dashboard from the WBE
                if (isWbe && option.path === '/admin') return null;
                if (isWbe && option.path === '/extension') return null;

                if (!isGraphDashboard && option.path === '/graph-dashboard') return null;

                return (
                  <Nav.Item
                    key={index}
                    eventKey={`${index}`}
                    active={
                      !isWbe
                        ? option.path === pathname
                        : `/wbe${option.path}` === pathname
                    }
                    icon={option.icon}
                    onClick={() =>
                      navigate(!isWbe ? option.navigateTo : `/wbe${option.navigateTo}`)
                    }
                  >
                    {option.content}
                  </Nav.Item>
                );
              })}
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
                  <h5>
                    {' '}
                    <BiLogOut />{' '}
                  </h5>
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
