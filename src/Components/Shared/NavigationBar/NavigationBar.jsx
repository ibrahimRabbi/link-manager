import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { handleIsDarkMode, handleIsProfileOpen } from '../../../Redux/slices/navSlice';
import AuthContext from '../../../Store/Auth-Context.jsx';

import koneksysLogo from './koneksys_logo.png';
import styles from './NavigationBar.module.scss';
import { Button, Nav, Navbar, Popover, Whisper } from 'rsuite';
import { BiUserCircle, BiLogOut } from 'react-icons/bi';

const { userContainer, content, popButton } = styles;

import { ImBrightnessContrast } from 'react-icons/im';
const NavigationBar = () => {
  const authCtx = useContext(AuthContext);
  const { currPageTitle, isDark, isProfileOpen } = useSelector((state) => state.nav);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(handleIsProfileOpen(!isProfileOpen));
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
          timer: 1500,
        });
        navigate('/login', { replace: true });
      }
    });
  };

  const darkModeText =
    isDark == 'dark' ? 'Light Mode' : isDark == 'light' ? 'Dark Mode' : 'Dark Mode';

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
          backgroundColor: isDark == 'dark' ? '' : 'white',
        }}
      >
        <Navbar.Brand
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
        >
          <img height={30} src={koneksysLogo} alt="Logo" />
          <h3>Koneksys</h3>
        </Navbar.Brand>
        <Nav style={{ textAlign: 'center', marginLeft: '39%' }}>
          <Nav.Item>
            <h3 style={{ textAlign: 'center' }}>{currPageTitle}</h3>
          </Nav.Item>
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
