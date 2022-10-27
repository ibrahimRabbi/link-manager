import { Close, HybridNetworkingAlt, Logout, Menu, UserAvatarFilledAlt } from '@carbon/icons-react';
import { Button, Header, IconButton, Popover, PopoverContent, SideNav, SideNavItems, SideNavLink, Theme } from '@carbon/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { handleIsProfileOpen, handleIsSidebarOpen, handleLoggedInUser } from '../../../Redux/slices/linksSlice';
import { header, headerContainer, main, pageTitle, popoverContent, profile, projectTitle, sidebar, sidebarLink } from './NavigationBar.module.scss';

const NavigationBar = () => {
  const {currPageTitle, loggedInUser, isSidebarOpen, isProfileOpen}=useSelector(state=>state.links);
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

  console.log(isSidebarOpen);

  return (
    <div className={`${'container'} ${main}`}>
      <Theme theme='g100'>
        <Header aria-label='' className={header}>
                
          <div className={headerContainer}>

            <IconButton kind='ghost' label=''
              onClick={()=>dispatch(handleIsSidebarOpen(!isSidebarOpen))}
            >
              {isSidebarOpen?<Close size={25}/>:<Menu size={25} />}
            </IconButton>

            <h5 className={projectTitle}>Link manager</h5>
                  
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

        </Header>
        {/* --------- Side nav ---------   */}

        {
          isSidebarOpen && <SideNav id={sidebar}
            aria-label=''
            isPersistent
            isChildOfHeader={false}
          >
            <SideNavItems>
              <SideNavLink  className={sidebarLink} renderIcon={HybridNetworkingAlt} onClick={()=>navigate('/link-manager')}>All Links</SideNavLink>
              <SideNavLink  className={sidebarLink} renderIcon={HybridNetworkingAlt} >View Graph</SideNavLink>
              <SideNavLink  className={sidebarLink} renderIcon={HybridNetworkingAlt} >View Details</SideNavLink>
            </SideNavItems>
          </SideNav>
        }

      </Theme>

    </div>
  );
};

export default NavigationBar;