import { HybridNetworkingAlt, Logout, UserAvatarFilledAlt } from '@carbon/icons-react';
import { Button, Header, HeaderContainer, HeaderMenuButton, HeaderName, IconButton, Popover, PopoverContent, SideNav, SideNavItems, SideNavLink, Theme } from '@carbon/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { handleIsProfileOpen, handleLoggedInUser } from '../../../Redux/slices/linksSlice';
import mediaQuery from '../MediaQueryHook/MediaQuery';
import { headerContainer, lgNav, main, pageTitle, popoverContent, profile, projectTitle, smNav } from './NavigationBar.module.scss';

const NavigationBar = () => {
  const {currPageTitle, loggedInUser, isProfileOpen}=useSelector(state=>state.links);
  const isDeskTop=mediaQuery('(min-width: 1055px)');
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const handleLogout=()=>{
    dispatch(handleIsProfileOpen(!isProfileOpen));
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
        dispatch(handleLoggedInUser(null));
        Swal.fire({title:'Logged out successful',icon:'success', timer:1500});
        navigate('/');
      }
    });
  };

  return (
    <div className={`${'container'} ${main}`}>
      <HeaderContainer
        render={({ isSideNavExpanded, onClickSideNavExpand }) => (
          <>
            <Theme theme='g90'>
              <Header aria-label=''>
                <HeaderMenuButton
                  aria-label=''
                  onClick={onClickSideNavExpand}
                  isActive={isSideNavExpanded}
                />

                <HeaderName className={projectTitle} prefix=''>Link manager</HeaderName>
                
                <div className={headerContainer}>
                  <h5 className={pageTitle}>{currPageTitle}</h5>
                  
                  <Popover open={isProfileOpen}
                    autoAlign dropShadow
                    className={profile}>
                    <IconButton kind='ghost' label='' onClick={() => dispatch(handleIsProfileOpen(!isProfileOpen))}>
                      <UserAvatarFilledAlt size='25'/>
                    </IconButton>
                    <PopoverContent className={popoverContent}>
                      <img src='https://i.ibb.co/ScbTKWS/admin.png' alt='Profile'/>
                      <h5>Admin</h5>
                      <h5>{loggedInUser?.email}</h5>
                      <Button onClick={handleLogout} renderIcon={Logout} size='sm' kind='danger--tertiary'>Logout</Button>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* --------- Side nav ---------   */}
              
                <SideNav id={isDeskTop?lgNav:isSideNavExpanded?smNav:''}
                  aria-label=''
                  expanded={isSideNavExpanded}
                >
                  <SideNavItems>
                    <SideNavLink renderIcon={HybridNetworkingAlt} onClick={()=>navigate('/link-manager')}>All Links</SideNavLink>
                    <SideNavLink renderIcon={HybridNetworkingAlt} onClick={()=>navigate('/link-manager/new-link')}>New Link</SideNavLink>
                  </SideNavItems>
                </SideNav>
              </Header>
            </Theme>
          </>
        )}
      />
    </div>
  );
};

export default NavigationBar;