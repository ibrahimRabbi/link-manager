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
import AttachmentIcon from '@rsuite/icons/Attachment';
import { darkColor, lightBgColor } from '../../../App';
import PlayOutlineIcon from '@rsuite/icons/PlayOutline';
import { PiGraphFill } from 'react-icons/pi';
import { MdArrowForwardIos } from 'react-icons/md';
import { useState } from 'react';
import AlertModal from '../AlertModal';

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
    },
    {
      path: organization ? organization + '/graph-view' : '/graph-view',
      navigateTo: organization ? organization + '/graph-view' : '/graph-view',
      icon: <PiGraphFill size={20} style={iconStyle} />,
      content: <span>Graph View</span>,
    },
    {
      path: organization ? organization + '/pipeline' : '/pipeline',
      navigateTo: organization ? organization + '/pipeline' : '/pipeline',
      icon: <PlayOutlineIcon />,
      content: <span>Pipelines</span>,
    },
    {
      path: organization ? organization + '/extension' : '/extension',
      navigateTo: organization ? organization + '/extension' : '/extension',
      icon: <AttachmentIcon />,
      content: <span>Extension</span>,
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
          defaultOpenKeys={['3']}
          appearance="subtle"
        >
          <Sidenav.Body className="link-nav-container">
            <Nav>
              {baseOptions?.map((option, index) => {
                if (isWbe && option.path === organization + '/extension') {
                  return null;
                }

                // get active status for the navigate path
                const isActive = () => {
                  if (!isWbe) {
                    return option?.path === pathname || option.path + '/' === pathname;
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
                    <BiLogOut />
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
