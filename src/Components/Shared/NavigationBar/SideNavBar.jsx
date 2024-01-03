/* eslint-disable max-len */
import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import './NavigationBar.module.scss';
import { ImBrightnessContrast } from 'react-icons/im';
import { BiLogOut } from 'react-icons/bi';
import {
  Sidebar,
  Sidenav,
  Navbar,
  Nav,
  Divider,
  Message,
  useToaster,
  IconButton,
} from 'rsuite';
import CogIcon from '@rsuite/icons/legacy/Cog';
import TableColumnIcon from '@rsuite/icons/TableColumn';
import AuthContext from '../../../Store/Auth-Context';
import { handleIsDarkMode, handleIsSidebarOpen } from '../../../Redux/slices/navSlice';
import AttachmentIcon from '@rsuite/icons/Attachment';
import { darkColor, lightBgColor } from '../../../App';
import PlayOutlineIcon from '@rsuite/icons/PlayOutline';
import { PiGraphFill } from 'react-icons/pi';
import { MdArrowForwardIos } from 'react-icons/md';
import { useState } from 'react';
import AlertModal from '../AlertModal';

import { FaUsers, FaLink } from 'react-icons/fa';
import { SiAzurepipelines } from 'react-icons/si';
import { PiPlugsDuotone } from 'react-icons/pi';
import { VscProject } from 'react-icons/vsc';
import { MdEvent, MdAdminPanelSettings } from 'react-icons/md';
import { BiTransferAlt } from 'react-icons/bi';
import { RiLockPasswordLine } from 'react-icons/ri';
import { IoArrowBackCircle } from 'react-icons/io5';

const iconStyle = {
  marginLeft: '-38px',
  marginRight: '17px',
};

const SideNavBar = () => {
  const { isDark, isSidebarOpen } = useSelector((state) => state.nav);
  const { isWbe } = useSelector((state) => state.links);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const toaster = useToaster();

  // handle logout
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

  const darkModeText =
    isDark === 'dark' ? 'Light Mode' : isDark === 'light' ? 'Dark Mode' : 'Dark Mode';

  // check user role
  const isSuperAdmin = authCtx?.user?.role === 'super_admin';
  const isAdmin = authCtx?.user?.role === 'admin';

  // eslint-disable-next-line max-len
  const organization = authCtx?.organization_name
    ? `/${authCtx?.organization_name?.toLowerCase()}`
    : '';
  // options to navigate
  const baseOptions = [
    {
      path: organization ? organization : '/',
      navigateTo: organization ? organization : '/',
      icon: <TableColumnIcon />,
      content: <span>Dashboard</span>,
      isAdminModule: false,
    },
    {
      path: organization ? organization + '/graph-view' : '/graph-view',
      navigateTo: organization ? organization + '/graph-view' : '/graph-view',
      icon: <PiGraphFill size={20} style={iconStyle} />,
      content: <span>Graph View</span>,
      isAdminModule: false,
    },
    {
      path: organization ? organization + '/pipeline' : '/pipeline',
      navigateTo: organization ? organization + '/pipeline' : '/pipeline',
      icon: <PlayOutlineIcon />,
      content: <span>Pipelines</span>,
      isAdminModule: false,
    },
    {
      path: organization ? organization + '/extension' : '/extension',
      navigateTo: organization ? organization + '/extension' : '/extension',
      icon: <AttachmentIcon />,
      content: <span>Extension</span>,
      isAdminModule: false,
    },
    {
      path: organization ? organization + '/admin' : '/admin',
      navigateTo: organization ? organization + '/admin' : '/admin',
      icon: (
        <MdAdminPanelSettings size={20} style={{ ...iconStyle, marginLeft: '-35px' }} />
      ),
      content: <span>Administrator Configuration</span>,
      isAdminModule: false,
    },
    // admin modules
    {
      path: organization ? organization : '/',
      navigateTo: organization ? organization : '/',
      icon: <IoArrowBackCircle size={20} style={{ ...iconStyle, marginLeft: '-35px' }} />,
      content: <span>Back</span>,
      isAdminModule: true,
    },
    {
      path: organization ? organization + '/admin/users' : '/admin/users',
      navigateTo: `${organization}/admin/users`,
      icon: <FaUsers style={{ ...iconStyle, marginLeft: '-35px' }} />,
      content: <span>Users</span>,
      hidden: false,
      isAdminModule: true,
    },
    {
      path: organization ? organization + '/admin/integrations' : '/admin/integrations',
      navigateTo: `${organization}/admin/integrations`,
      icon: <PiPlugsDuotone size={20} style={{ ...iconStyle }} />,
      content: <span>Integrations</span>,
      hidden: false,
      isAdminModule: true,
    },
    {
      path: organization ? organization + '/admin/projects' : '/admin/projects',
      navigateTo: `${organization}/admin/projects`,
      icon: <VscProject size={18} style={{ ...iconStyle, marginLeft: '-37px' }} />,
      content: <span>Projects</span>,
      hidden: true,
      isAdminModule: true,
    },
    {
      path: organization ? organization + '/admin/link-rules' : '/admin/link-rules',
      navigateTo: `${organization}/admin/link-rules`,
      icon: <FaLink size={16} style={{ ...iconStyle, marginLeft: '-37px' }} />,
      content: <span>Link Rules</span>,
      hidden: false,
      isAdminModule: true,
    },
    {
      path: organization ? organization + '/admin/events' : '/admin/events',
      navigateTo: `${organization}/admin/events`,
      icon: <MdEvent size={19} style={{ ...iconStyle }} />,
      content: <span>Event Config</span>,
      hidden: true,
      isAdminModule: true,
    },
    {
      path: organization
        ? organization + '/admin/pipelinessecrets'
        : '/admin/pipelinessecrets',
      navigateTo: `${organization}/admin/pipelinessecrets`,
      icon: <RiLockPasswordLine size={19} style={{ ...iconStyle }} />,
      content: <span>Pipeline Secrets</span>,
      hidden: false,
      isAdminModule: true,
    },
    {
      path: organization ? organization + '/admin/pipelines' : '/admin/pipelines',
      navigateTo: `${organization}/admin/pipelines`,
      icon: <SiAzurepipelines size={15} style={{ ...iconStyle, marginLeft: '-36px' }} />,
      content: <span>Pipeline Config</span>,
      hidden: false,
      isAdminModule: true,
    },
    {
      path: organization
        ? organization + '/admin/synchronization'
        : '/admin/synchronization',
      navigateTo: `${organization}/admin/synchronization`,
      icon: <BiTransferAlt size={21} style={{ ...iconStyle }} />,
      content: <span>Sync Configs</span>,
      hidden: false,
      isAdminModule: true,
    },
  ];
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
          boxShadow: `2px 2px 5px ${isDark === 'light' ? 'lightgray' : '#292D33'}`,
          backgroundColor: isDark === 'dark' ? darkColor : lightBgColor,
          height: isWbe ? '100vh' : '94vh',
          marginTop: isWbe ? '0' : '56px',
        }}
        className="links-components-sidebar"
        width={isSidebarOpen ? 200 : 56}
        collapsible
      >
        <Divider style={{ margin: '0' }} />
        <Sidenav
          className="links-side-nav-body"
          expanded={isSidebarOpen}
          appearance="subtle"
        >
          <Sidenav.Body className="link-nav-container">
            <Nav>
              {baseOptions?.map((option, index) => {
                // manage admin or normal user modules to display it
                if (pathname.includes('/admin') && !option.isAdminModule) {
                  return null;
                } else if (!pathname.includes('/admin') && option.isAdminModule) {
                  return null;
                }

                // manage extension redirect
                if (isWbe && option.path === organization + '/extension') {
                  return null;
                }
                if (isWbe && option.path === organization + '/admin') {
                  return null;
                }

                // display extra nav module if user is a admin
                if (option.isAdminModule) {
                  if (!isSuperAdmin && !isAdmin) return null;
                  if (isWbe) return null;
                } else {
                  if (
                    !isSuperAdmin &&
                    !isAdmin &&
                    option.navigateTo === organization + '/admin'
                  ) {
                    return null;
                  }
                }

                // get active status for the navigate path
                const isActive = () => {
                  if (!isWbe) {
                    if (
                      pathname === organization + '/admin' ||
                      pathname === organization + '/admin/'
                    ) {
                      if (option.path === organization + '/admin/projects') return true;
                    }
                    return option.path === pathname || option.path + '/' === pathname;
                  } else {
                    return (
                      `/wbe${option.path}` === pathname ||
                      `/wbe${option.path}/` === pathname
                    );
                  }
                };
                return (
                  <Nav.Item
                    key={index}
                    eventKey={`${index}`}
                    active={isActive()}
                    icon={option.icon}
                    onClick={() => {
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
          <Navbar className="wbe-nav-setting">
            <Nav>
              <Nav.Menu
                noCaret
                placement="topStart"
                trigger="click"
                title={<CogIcon style={{ width: 25, height: 20 }} size="lg" />}
              >
                <Nav.Item onClick={() => dispatch(handleIsDarkMode())}>
                  <h5>
                    <IconButton
                      size="sm"
                      title={darkModeText}
                      icon={<ImBrightnessContrast />}
                    />
                  </h5>
                </Nav.Item>

                <Nav.Item onClick={() => handleLogout()}>
                  <h5>
                    <IconButton size="sm" title="Logout" icon={<BiLogOut />} />
                  </h5>
                </Nav.Item>
              </Nav.Menu>
            </Nav>
          </Navbar>
        )}

        <Navbar style={{ marginTop: isWbe ? '0' : 'auto', marginBottom: '10px' }}>
          <Nav pullRight>
            <Nav.Item
              onClick={() => dispatch(handleIsSidebarOpen(!isSidebarOpen))}
              style={{
                textAlign: 'center',
                transition: '0.2s',
                transform: isSidebarOpen ? 'rotate(180deg)' : '',
              }}
            >
              <MdArrowForwardIos size={25} />
            </Nav.Item>
          </Nav>
        </Navbar>
      </Sidebar>
    </>
  );
};

export default SideNavBar;
