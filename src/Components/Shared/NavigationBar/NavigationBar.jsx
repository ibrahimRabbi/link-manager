import { Close, Logout, Menu, UserAvatarFilledAlt } from '@carbon/icons-react';
import { Button, Header, IconButton, Popover, PopoverContent, SideNav, SideNavItems, SideNavMenuItem, Theme } from '@carbon/react';
import React, {useContext} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { handleIsSidebarOpen } from '../../../Redux/slices/linksSlice';
import AuthContext from '../../../Store/Auth-Context.jsx';

import koneksysLogo from './koneksys_logo.png';
import styles from './NavigationBar.module.scss';
import NavigationBarContext from '../../../Store/NavigationBar-Context.jsx';
const {
  content, header, headerContainer,
  main, pageTitle, popoverContent,
  profile, projectTitle, sidebar,
  sidebarLink, userContainer
} = styles;

const NavigationBar = () => {
  const authCtx = useContext(AuthContext);
  const navbarCtx = useContext(NavigationBarContext);

  const {currPageTitle, isSidebarOpen} = useSelector(state => state.links);
  const navigate = useNavigate();
  const {pathname} = useLocation();
  const dispatch = useDispatch();

  const handleLogout=()=>{
    navbarCtx.closeProfile(!navbarCtx.isProfileOpen);
    Swal.fire({
      title: 'Are you sure?',
      text: 'You wont to logout!',
      icon: 'warning',
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      showCancelButton: true,
      confirmButtonText: 'Yes, !'
    }).then((result) => {
      if (result.isConfirmed) {
        authCtx.logout();
        Swal.fire({title:'Logged out successful',icon:'success', timer:1500});
        navigate('/login', {replace:true});
      }
    });
  };

  return (
    <div className={`${'container'} ${main}`}>
      <Theme theme='g100'>
        <Header aria-label='' id={header}>
          <div className={headerContainer}>

            <IconButton kind='ghost' label=''
              onClick={()=>dispatch(handleIsSidebarOpen(!isSidebarOpen))}
            >
              {isSidebarOpen?<Close size={30}/>:<Menu size={30} />}
            </IconButton>
            <img src={koneksysLogo} height='40px' alt='logo' />
            <h5 className={projectTitle}>Link manager</h5>
            <h5 className={pageTitle}>{currPageTitle}</h5>

            {/* --- User popover --- */}
            <Popover open={navbarCtx.isProfileOpen}
              highContrast={false} dropShadow caret={false}
              align='bottom-right'
              className={profile}>
              <IconButton kind='ghost' label='' onClick={() => navbarCtx.setProfile(!navbarCtx.isProfileOpen)}>
                <UserAvatarFilledAlt size={30}/>
              </IconButton>
              <PopoverContent className={popoverContent}>
                <div className={content}>
                  <div className={userContainer}>
                    <h5>User Name</h5>
                    <span><UserAvatarFilledAlt size={25}/></span>
                  </div>
                  <p>Item option 1</p>
                  <p>Item option 2</p>
                </div>
                <Button onClick={handleLogout} renderIcon={Logout} kind='secondary'>Logout</Button>
              </PopoverContent>
            </Popover>
          </div>
        </Header>
        
        {/* --------- Side nav ---------   */}
        {
          isSidebarOpen && <SideNav id={sidebar}
            aria-label=''
            isPersistent={true}
            isChildOfHeader={false}
          >
            <SideNavItems>
              <hr/>
              <SideNavMenuItem className={sidebarLink}
                onClick={()=>navigate('/')} isActive={pathname==='/'}>All links</SideNavMenuItem>
              <SideNavMenuItem className={sidebarLink}
                onClick={()=>navigate('/graph-view')} isActive={pathname=== '/graph-view'}>Graph view</SideNavMenuItem>
            </SideNavItems>
          </SideNav>
        }
      </Theme>
    </div>
  );
};

export default NavigationBar;
