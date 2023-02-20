import { FaLink, FaShareAlt } from 'react-icons/fa';
// import {GrClose} from 'react-icons/gr';
import { ImMenu } from 'react-icons/im';
import {
  Button,
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenuItem,
  Theme,
} from '@carbon/react';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchStreamItems, handleSelectStreamType } from '../../../Redux/slices/navSlice';
import UseDropdown from '../UseDropdown/UseDropdown';

import styles from './NavigationBar.module.scss';
const {
  wbeSideNav,
  topContentContainer,
  fileContainer,
  fileName,
  sidebarLink,
  dropdownStyle,
} = styles;

const WbeTopNav = () => {
  const { linksStream, linksStreamItems } = useSelector((state) => state.nav);
  const { sourceDataList, configuration_aware } = useSelector((state) => state.links);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const [isSideNav, setIsSideNav] = useState(false);

  useEffect(() => {
    // get link_types dropdown items
    dispatch(fetchStreamItems('.././gcm_context.json'));
  }, []);

  const streamTypeChange = ({ selectedItem }) => {
    dispatch(handleSelectStreamType(selectedItem));
  };

  return (
    <>
      <div className="mainContainer">
        <div className={topContentContainer}>
          <div className={fileContainer}>
            <h5 className={fileName}>
              Links For: <span>{sourceDataList?.title}</span>
            </h5>

            <Button size="sm" kind="primary" onClick={() => navigate('/wbe/new-link')}>
              Create link
            </Button>
          </div>
        </div>

        {configuration_aware && (
          <div className={`${topContentContainer}`}>
            <UseDropdown
              onChange={streamTypeChange}
              items={linksStreamItems}
              title="GCM Configuration Context"
              label={linksStream.name ? linksStream.name : linksStreamItems[0]?.name}
              id="links_stream"
              className={dropdownStyle}
            />
          </div>
        )}
      </div>

      {/* ----------------------  */}

      <Theme theme="g100">
        <SideNav
          style={{ width: isSideNav ? '200px' : '55px' }}
          id={wbeSideNav}
          className=".cds--side-nav__overlay-active"
          aria-label=""
          isPersistent={true}
          isChildOfHeader={false}
        >
          <SideNavItems>
            <SideNavMenuItem
              style={{ margin: '0 0 20px -5px' }}
              className={sidebarLink}
              onClick={() => setIsSideNav(!isSideNav)}
            >
              <ImMenu size={30} />
            </SideNavMenuItem>

            <SideNavLink
              renderIcon={() => <FaLink size={40} />}
              className={sidebarLink}
              onClick={() => navigate('/wbe')}
              isActive={pathname === '/wbe'}
            >
              Links
            </SideNavLink>

            <SideNavLink
              renderIcon={() => <FaShareAlt size={40} />}
              className={sidebarLink}
              onClick={() => navigate('/wbe/graph-view')}
              isActive={pathname === '/wbe/graph-view'}
            >
              Graph View
            </SideNavLink>
          </SideNavItems>
        </SideNav>
      </Theme>
    </>
  );
};

export default WbeTopNav;
