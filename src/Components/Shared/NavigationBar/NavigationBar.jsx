import {
  BrightnessContrast,
  Close,
  Logout,
  Menu,
  UserAvatarFilledAlt,
} from '@carbon/icons-react';
import {
  Button,
  Header,
  IconButton,
  Popover,
  PopoverContent,
  SideNav,
  SideNavItems,
  SideNavMenuItem,
  // Theme,
} from '@carbon/react';
import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  handleIsDarkMode,
  handleIsProfileOpen,
  handleIsSidebarOpen,
} from '../../../Redux/slices/navSlice';
import AuthContext from '../../../Store/Auth-Context.jsx';

import koneksysLogo from './koneksys_logo.png';
import styles from './NavigationBar.module.scss';
const {
  content,
  header,
  headerContainer,
  main,
  pageTitle,
  popoverContent,
  profile,
  projectTitle,
  sidebar,
  sidebarLink,
  userContainer,
} = styles;

const NavigationBar = () => {
  const authCtx = useContext(AuthContext);
  const { currPageTitle, isSidebarOpen, isProfileOpen, isDark } = useSelector(
    (state) => state.nav,
  );
  const navigate = useNavigate();
  const { pathname } = useLocation();
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

  return (
    <div className={`${'container'} ${main}`}>
      <Header aria-label="" id={header}>
        <div className={headerContainer}>
          <IconButton
            kind="ghost"
            label=""
            onClick={() => dispatch(handleIsSidebarOpen(!isSidebarOpen))}
          >
            {isSidebarOpen ? <Close size={30} /> : <Menu size={30} />}
          </IconButton>

          <img src={koneksysLogo} height="40px" alt="logo" />
          <h5 className={projectTitle}>Link manager</h5>
          <h6 className={pageTitle}>{currPageTitle}</h6>

          {/* --- User popover --- */}
          <Popover
            open={isProfileOpen}
            highContrast={false}
            dropShadow
            caret={false}
            align="bottom-right"
            className={profile}
          >
            <IconButton
              kind="ghost"
              label=""
              onClick={() => dispatch(handleIsProfileOpen(!isProfileOpen))}
            >
              <UserAvatarFilledAlt size={30} />
            </IconButton>

            <PopoverContent className={popoverContent}>
              <div className={content}>
                <div className={userContainer}>
                  <h5>User Name</h5>
                  <span>
                    <UserAvatarFilledAlt size={25} />
                  </span>
                </div>
                <Button
                  onClick={() => dispatch(handleIsDarkMode())}
                  renderIcon={BrightnessContrast}
                  size="md"
                  kind={isDark == 'dark' ? 'secondary' : 'ghost'}
                >
                  {isDark == 'dark' ? 'Light ' : isDark == 'light' ? 'Dark ' : 'Dark'}
                </Button>
              </div>
              <Button
                onClick={handleLogout}
                renderIcon={Logout}
                size="md"
                kind={isDark == 'dark' ? 'secondary' : 'ghost'}
              >
                Logout
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </Header>

      {/* --------- Side nav ---------   */}
      {isSidebarOpen && (
        <SideNav
          id={sidebar}
          style={{ borderRight: '1px solid gray' }}
          aria-label=""
          isPersistent={true}
          isChildOfHeader={false}
        >
          <SideNavItems>
            <hr />
            <SideNavMenuItem
              className={sidebarLink}
              onClick={() => navigate('/')}
              isActive={pathname === '/'}
            >
              Links
            </SideNavMenuItem>

            <SideNavMenuItem
              className={sidebarLink}
              onClick={() => navigate('/graph-view')}
              isActive={pathname === '/graph-view'}
            >
              Graph View
            </SideNavMenuItem>

            <SideNavMenuItem
              className={sidebarLink}
              onClick={() => navigate('/admin')}
              isActive={pathname === '/admin'}
            >
              Dashboard
            </SideNavMenuItem>
          </SideNavItems>
        </SideNav>
      )}
    </div>
  );
};

export default NavigationBar;
