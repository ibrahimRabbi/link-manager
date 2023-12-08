import React, { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handleIsDarkMode, handleIsProfileOpen } from '../../../Redux/slices/navSlice';
import AuthContext from '../../../Store/Auth-Context.jsx';
import {
  Avatar,
  Button,
  Message,
  Nav,
  Navbar,
  Popover,
  Whisper,
  useToaster,
} from 'rsuite';
import { BiUserCircle, BiLogOut } from 'react-icons/bi';
import jwt_decode from 'jwt-decode';
import { ImBrightnessContrast } from 'react-icons/im';
import { darkColor, lightBgColor } from '../../../App';
import AlertModal from '../AlertModal';
import styles from './NavigationBar.module.scss';

const { popoverContainer, userContainer, popButton, navbarBrand } = styles;

const NavigationBar = () => {
  const authCtx = useContext(AuthContext);
  const { currPageTitle, isDark, isProfileOpen } = useSelector((state) => state.nav);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toaster = useToaster();
  const userInfo = jwt_decode(authCtx?.token);
  const isSuperAdmin = authCtx?.user?.role === 'super_admin' ? true : false;
  const isAdmin = authCtx?.user?.role === 'admin' ? true : false;

  const handleLogout = () => {
    dispatch(handleIsProfileOpen(!isProfileOpen));
    setOpen(true);
  };
  const handleConfirmed = async (value) => {
    if (value) {
      authCtx.logout();
      const message = (
        <Message closable showIcon type="success">
          Logout successful
        </Message>
      );
      toaster.push(message, { placement: 'bottomCenter', duration: 5000 });
    }
  };

  const darkModeText =
    isDark === 'dark' ? 'Light Mode' : isDark === 'light' ? 'Dark Mode' : 'Dark Mode';

  // popover items click handler
  const handlePopoverBtnClick = (item) => {
    if (item.path) navigate(item.path);
    else if (item.label === darkModeText) {
      dispatch(handleIsDarkMode());
    } else if (item.label === 'Logout') {
      handleLogout();
    }
  };

  // eslint-disable-next-line max-len
  const organization = authCtx?.organization_name
    ? `/${authCtx?.organization_name?.toLowerCase()}`
    : '';

  const popItems = [
    {
      label: 'Profile',
      path: organization + '/profile',
      icon: <BiUserCircle size={18} style={{ marginRight: '-1px' }} />,
    },
    { label: darkModeText, path: '', icon: <ImBrightnessContrast size={17} /> },
    { label: 'Logout', path: '', icon: <BiLogOut size={17} /> },
  ];

  // popover control
  const speaker = (
    <Popover
      className={popoverContainer}
      title={
        <div className={userContainer}>
          <Avatar
            size="md"
            circle
            src={`${location.origin}/default_avatar.png`}
            alt="User"
          />
          <div>
            <h6>{userInfo?.name ? userInfo?.name : 'First Name Last Name'}</h6>
            <p>{userInfo?.email ? userInfo?.email : 'Email'}</p>
          </div>
        </div>
      }
    >
      {popItems.map((item, index) => {
        // hide admin dashboard module if the user not an admin
        if (item?.path === organization + '/admin') {
          if (isAdmin || isSuperAdmin) {
            // display dashboard option
          } else {
            return null;
          }
        }
        // hide admin dashboard module if the user already in the admin dashboard
        if (item.label === 'Admin Dashboard' && location.pathname.includes('/admin')) {
          return null;
        }
        // hide homepage module if the user is not in the admin dashboard
        else if (item.label === 'Homepage' && !location.pathname.includes('/admin')) {
          return null;
        }
        return (
          <Button
            key={index}
            className={popButton}
            onClick={() => handlePopoverBtnClick(item)}
            size="md"
            data-cy="profile-btns"
            appearance="default"
          >
            {item?.icon}
            <p>{item?.label}</p>
          </Button>
        );
      })}
    </Popover>
  );

  return (
    <>
      <div
        style={{
          backgroundColor: isDark === 'dark' ? darkColor : lightBgColor,
          boxShadow: `0px 0px 5px ${isDark === 'light' ? 'lightgray' : '#292D33'}`,
          position: 'fixed',
          zIndex: '100',
          width: '100%',
        }}
      >
        {/* confirmation modal  */}
        <AlertModal
          open={open}
          setOpen={setOpen}
          content={'You want to logout!'}
          handleConfirmed={handleConfirmed}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Navbar.Brand
            onClick={() => navigate(organization ? organization : '/')}
            className={navbarBrand}
          >
            <img
              height={30}
              alt="TraceLynx"
              src={window.location.origin + '/traceLynx_logo.svg'}
            />
            <h2 style={{ fontWeight: '600' }}>
              <span
                style={{
                  color: isDark === 'dark' ? '#3491e2' : '#2c74b3',
                }}
              >
                Trace
              </span>
              <span
                style={{
                  color: isDark === 'dark' ? '#1d69ba' : '#144272',
                }}
              >
                Lynx
              </span>
            </h2>
          </Navbar.Brand>
          <Nav>
            <h5 style={{ textAlign: 'center' }}>{currPageTitle}</h5>
          </Nav>

          <Nav style={{ padding: '5px 20px 0 0' }}>
            <Whisper
              placement="bottomEnd"
              trigger="click"
              controlId="control-id-hover-enterable"
              speaker={speaker}
              enterable
            >
              <Button data-cy="profile-options-btn">
                <BiUserCircle size={30} />
              </Button>
            </Whisper>
          </Nav>
        </div>
      </div>
    </>
  );
};

export default NavigationBar;
