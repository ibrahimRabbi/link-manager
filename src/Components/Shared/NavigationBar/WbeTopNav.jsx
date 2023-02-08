import { Logout, UserAvatarFilledAlt } from '@carbon/icons-react';
import {
  Button,
  Header,
  HeaderMenuItem,
  IconButton,
  Popover,
  PopoverContent,
  Theme,
} from '@carbon/react';
import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
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

// stream items
const streamItems = [
  { text: 'GCM Initial Stream', key:'st-main' },
  { text: 'GCM Develop Stream', key:'st-develop' },
  { text: 'GCM Staging Stream', key:'st-staging' },
];

const WbeTopNav = () => {
  const authCtx = useContext(AuthContext);
  const { isProfileOpen, linksStream } = useSelector((state) => state.nav);
  const { sourceDataList } = useSelector((state) => state.links);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();

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

  const streamTypeChange = ({ selectedItem }) => {
    dispatch(handleSelectStreamType(selectedItem.key));
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
            items={streamItems}
            title="Target Container"
            label={linksStream ? linksStream : streamItems[0]?.text}
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
    </Theme>
  );
};

export default WbeTopNav;
