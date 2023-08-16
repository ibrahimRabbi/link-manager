import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import './NavigationBar.module.scss';
import { ImBrightnessContrast } from 'react-icons/im';
import { BiLogOut } from 'react-icons/bi';
import { Sidebar, Sidenav, Navbar, Nav, Divider, Message, useToaster } from 'rsuite';
import CogIcon from '@rsuite/icons/legacy/Cog';
import TableColumnIcon from '@rsuite/icons/TableColumn';
import AuthContext from '../../../Store/Auth-Context';
import { handleIsDarkMode, handleIsSidebarOpen } from '../../../Redux/slices/navSlice';
import MenuIcon from '@rsuite/icons/Menu';
import CloseIcon from '@rsuite/icons/Close';
import DashboardIcon from '@rsuite/icons/Dashboard';
import AttachmentIcon from '@rsuite/icons/Attachment';
import { darkColor, lightBgColor } from '../../../App';
import PlayOutlineIcon from '@rsuite/icons/PlayOutline';
import { PiGraphFill } from 'react-icons/pi';
import { useState } from 'react';
import AlertModal from '../AlertModal';

const iconStyle = {
  marginLeft: '-38px',
  marginRight: '17px',
};

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
    icon: <PiGraphFill size={20} style={iconStyle} />,
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

const SideNavBar = () => {
  const { isDark, isSidebarOpen } = useSelector((state) => state.nav);
  const { isWbe } = useSelector((state) => state.links);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const toaster = useToaster();
  const handleLogout = () => {
    setOpen(true);
  };
  const handleConfirmed = (value) => {
    if (value) {
      authCtx.logout();
      const message = (
        <Message closable showIcon type="success">
          Logut successfull
        </Message>
      );
      toaster.push(message, { placement: 'bottomCenter', duration: 5000 });
    }
  };

  return (
    <>
      {/* confirmation modal  */}
      <AlertModal
        open={open}
        setOpen={setOpen}
        content={'You want to logout!'}
        handleConfirmed={handleConfirmed}
      />
      <Sidebar
        style={{
          // minHeight: isWbe ? '100vh' : '94vh',
          boxShadow: `2px 2px 5px ${isDark === 'light' ? 'lightgray' : '#292D33'}`,
          backgroundColor: isDark === 'dark' ? darkColor : lightBgColor,
        }}
        className="links-components-sidebar"
        width={isSidebarOpen ? 210 : 60}
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
        <Divider style={{ margin: '0' }} />
        <Sidenav
          className="links-side-nav-body"
          expanded={isSidebarOpen}
          defaultOpenKeys={['3']}
          appearance="subtle"
        >
          <Sidenav.Body className="link-nav-container">
            <Nav>
              {baseOptions?.map((option, index) => {
                // hide admin dashboard from the WBE
                if (isWbe && option.path === '/admin') return null;
                if (isWbe && option.path === '/extension') return null;
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
                    onClick={() => {
                      // eslint-disable-next-line max-len
                      isWbe
                        ? navigate(`/wbe${option.navigateTo}`)
                        : navigate(option.navigateTo);
                    }}
                  >
                    {option.content}
                  </Nav.Item>
                );
              })}
            </Nav>
          </Sidenav.Body>
        </Sidenav>

        {isWbe && (
          <Navbar appearance="subtle" className="nav-toggle wbe-nav-setting">
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
