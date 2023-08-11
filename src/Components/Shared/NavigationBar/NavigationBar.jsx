import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handleIsDarkMode, handleIsProfileOpen } from '../../../Redux/slices/navSlice';
import AuthContext from '../../../Store/Auth-Context.jsx';

import koneksysLogo from './koneksys_logo.png';
import styles from './NavigationBar.module.scss';
import { Button, Message, Nav, Navbar, Popover, Whisper, useToaster } from 'rsuite';
import { BiUserCircle, BiLogOut } from 'react-icons/bi';

const { userContainer, content, popButton } = styles;

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

  // popover control
  const speaker = (
    <Popover
      title=""
      style={{ padding: '0', display: 'flex', flexDirection: 'column', gap: '2px' }}
    >
      <div className={content}>
        <div className={userContainer}>
          <h5>User Name</h5>
          <span>
            <BiUserCircle size={25} />
          </span>
        </div>
      </div>

      <Button
        style={{ display: 'flex', width: '100%', justifyContent: 'start', gap: '20px' }}
        onClick={() => dispatch(handleIsDarkMode())}
        size="md"
        appearance="default"
      >
        <ImBrightnessContrast />
        <p>{darkModeText}</p>
      </Button>

      <Button
        className={popButton}
        style={{ display: 'flex', width: '100%', gap: '20px', justifyContent: 'start' }}
        onClick={handleLogout}
        size="md"
        appearance="default"
      >
        <BiLogOut />
        <p>Logout</p>
      </Button>
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
          style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
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
