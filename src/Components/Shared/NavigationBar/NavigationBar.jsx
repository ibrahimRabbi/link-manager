import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handleIsDarkMode, handleIsProfileOpen } from '../../../Redux/slices/navSlice';
import AuthContext from '../../../Store/Auth-Context.jsx';
import koneksysLogo from './koneksys_logo.png';
import styles from './NavigationBar.module.scss';
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

const { popoverContainer, userContainer, popButton } = styles;

import { ImBrightnessContrast } from 'react-icons/im';
import { darkColor, lightBgColor } from '../../../App';
import AlertModal from '../AlertModal';
import { useState } from 'react';
const NavigationBar = () => {
  const authCtx = useContext(AuthContext);
  const { currPageTitle, isDark, isProfileOpen } = useSelector((state) => state.nav);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toaster = useToaster();
  const userInfo = jwt_decode(authCtx?.token);

  const handleLogout = () => {
    dispatch(handleIsProfileOpen(!isProfileOpen));
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

  const handlePopoverBtnClick = (item) => {
    if (item?.label === 'Profile') {
      navigate('/profile');
    } else if (item?.label === darkModeText) {
      dispatch(handleIsDarkMode());
    } else if (item?.label === 'Logout') {
      handleLogout();
    }
  };

  const popItems = [
    {
      label: 'Profile',
      icon: <BiUserCircle size={18} style={{ marginRight: '-1px' }} />,
    },
    { label: darkModeText, icon: <ImBrightnessContrast size={17} /> },
    { label: 'Logout', icon: <BiLogOut size={17} /> },
  ];

  // popover control
  const speaker = (
    <Popover
      className={popoverContainer}
      title={
        <div className={userContainer}>
          <Avatar size="md" circle src={'./default_avatar.jpg'} alt="User" />
          <div>
            <h6>{userInfo?.name ? userInfo?.name : 'First Name Last Name'}</h6>
            <p>{userInfo?.email ? userInfo?.email : 'Email'}</p>
          </div>
        </div>
      }
    >
      {popItems.map((item, index) => {
        return (
          <Button
            key={index}
            className={popButton}
            onClick={() => handlePopoverBtnClick(item)}
            size="md"
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
      <Navbar
        style={{
          backgroundColor: isDark === 'dark' ? darkColor : lightBgColor,
          boxShadow: `2px 2px 5px ${isDark === 'light' ? 'lightgray' : '#292D33'}`,
        }}
      >
        {/* confirmation modal  */}
        <AlertModal
          open={open}
          setOpen={setOpen}
          content={'You want to logout!'}
          handleConfirmed={handleConfirmed}
        />
        <Navbar.Brand
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer',
          }}
        >
          <img height={30} src={koneksysLogo} alt="Logo" />
          <h3>TraceLynx</h3>
        </Navbar.Brand>
        <Nav style={{ textAlign: 'center', marginLeft: '35%' }}>
          <h3 style={{ textAlign: 'center' }}>{currPageTitle}</h3>
        </Nav>

        <Nav pullRight style={{ padding: '5px 20px 0 0' }}>
          <Whisper
            placement="bottomEnd"
            trigger="click"
            controlId="control-id-hover-enterable"
            speaker={speaker}
            enterable
          >
            <Button>
              <BiUserCircle size={30} />
            </Button>
          </Whisper>
        </Nav>
      </Navbar>
    </>
  );
};

export default NavigationBar;
