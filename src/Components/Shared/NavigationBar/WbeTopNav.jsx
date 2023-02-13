import { Logout, UserAvatarFilledAlt } from '@carbon/icons-react';
import {
  Button,
  Header,
  HeaderMenuItem,
  IconButton,
  Popover,
  PopoverContent,
  // SideNav,
  // SideNavItems,
  // SideNavMenuItem,
  Theme,
} from '@carbon/react';
import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  fetchStreamItems,
  handleIsProfileOpen,
  handleSelectStreamType,
} from '../../../Redux/slices/navSlice';
import AuthContext from '../../../Store/Auth-Context.jsx';
import UseDropdown from '../UseDropdown/UseDropdown';

import styles from './NavigationBar.module.scss';
const {
  wbeContent,
  wbeHeader,
  hMenuItemContainer,
  hMenuItem,
  wbeHeaderContainer,
  popoverContent,
  profile,
  userContainer,
  topContentContainer,
  fileContainer,
  fileName,
} = styles;

const WbeTopNav = () => {
  const authCtx = useContext(AuthContext);
  const { isProfileOpen, 
    linksStream, 
    linksStreamItems, 
  } = useSelector((state) => state.nav);
  const { sourceDataList } = useSelector((state) => state.links);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  useEffect(()=>{
    // get link_types dropdown items
    dispatch(fetchStreamItems('.././gcm_context.json'));
  },[]);

  const streamTypeChange = ({ selectedItem }) => {
    dispatch(handleSelectStreamType(selectedItem));
  };

  const handleLogout = () => {
    dispatch(handleIsProfileOpen(!isProfileOpen));
    Swal.fire({
      title: 'Are you sure?',
      text: 'You wont to logout!',
      icon: 'warning',
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      showCancelButton: true,
      confirmButtonText: 'Yes, !',
    }).then((result) => {
      if (result.isConfirmed) {
        authCtx.logout();
        Swal.fire({
          title: 'Logged out',
          icon: 'success',
          timer: 1500,
        });
        navigate('/login', { replace: true });
      }
    });
  };


  return (
    <Theme theme="white">
      <Header aria-label="" id={wbeHeader}>
        <div className={topContentContainer}>
          <div className={fileContainer}>
            <h5 className={fileName}>
              Links For: <span>{sourceDataList?.title}</span>
            </h5>

            <Button size="sm" kind="primary" onClick={() => navigate('/wbe/new-link')}>
              New link
            </Button>
          </div>

          <UseDropdown
            onChange={streamTypeChange}
            items={linksStreamItems}
            title="Target Container"
            label={linksStream.text ? linksStream.text : linksStreamItems[0]?.text}
            id="links_stream"
            className={''}
          />
        </div>

        <div className={`${'mainContainer'}`}>
          <div className={wbeHeaderContainer}>
            <div className={hMenuItemContainer}>
              <HeaderMenuItem
                isCurrentPage={pathname === '/wbe'}
                onClick={() => navigate('/wbe')}
                className={hMenuItem}
              >
                <p>Links</p>
              </HeaderMenuItem>
              <HeaderMenuItem
                isCurrentPage={pathname === '/wbe/graph-view'}
                onClick={() => navigate('/wbe/graph-view')}
                className={hMenuItem}
              >
                <p>Graph View</p>
              </HeaderMenuItem>
            </div>

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
                <div className={wbeContent}>
                  <div className={userContainer}>
                    <h5>User Name</h5>
                    <span>
                      <UserAvatarFilledAlt size={25} />
                    </span>
                  </div>
                  {/* <p>Item option 1</p>
                <p>Item option 2</p> */}
                </div>
                <Button
                  onClick={handleLogout}
                  renderIcon={Logout}
                  size="md"
                  kind="danger"
                >
                  Logout
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </Header>

      {/* <SideNav aria-label="" 
         
        isChildOfHeader={false}
        isRail={true}
      >
        <SideNavItems>
          <hr />
          <SideNavMenuItem
            className={'sidebarLink'}
            onClick={() => navigate('/wbe')}
            // isActive={pathname === '/'}
          >
                Links
          </SideNavMenuItem>

          <SideNavMenuItem
            className={'sidebarLink'}
            onClick={() => navigate('/wbe/graph-view')}
            // isActive={pathname === '/graph-view'}
          >
                Graph View
          </SideNavMenuItem>
        </SideNavItems>
      </SideNav> */}
    </Theme>
  );
};

export default WbeTopNav;
