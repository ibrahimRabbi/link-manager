import { FaLink, FaShareAlt } from 'react-icons/fa';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import { ImMenu } from 'react-icons/im';
// import AddOutlineIcon from '@rsuite/icons/AddOutline';
import { SideNav, SideNavItems, SideNavLink, SideNavMenuItem } from '@carbon/react';
import { Breadcrumb, Button, FlexboxGrid } from 'rsuite';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  fetchStreamItems,
  handleIsDarkMode,
  handleSelectStreamType,
} from '../../../Redux/slices/navSlice';
import UseDropdown from '../UseDropdown/UseDropdown';

import styles from './NavigationBar.module.scss';
import { BrightnessContrast } from '@carbon/icons-react';
const {
  wbeSideNav,
  topContentContainer,
  sidebarLink,
  darkModeStyle,
  dropdownStyle,
  marginLeft,
  seeMLBtn,
  arIcon,
} = styles;

const WbeTopNav = () => {
  const {
    linksStream,
    linksStreamItems,
    // isDark
  } = useSelector((state) => state.nav);
  const { sourceDataList, configuration_aware } = useSelector((state) => state.links);
  const [showMore, setShowMore] = useState(false);
  const [isSideNav, setIsSideNav] = useState(false);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // get link_types dropdown items
    dispatch(fetchStreamItems('.././gcm_context.json'));
  }, []);

  const streamTypeChange = ({ selectedItem }) => {
    dispatch(handleSelectStreamType(selectedItem));
  };

  // handle see more and see less control
  useEffect(() => {
    if (showMore) setTitle(sourceDataList?.title?.slice(25, 99999));
    else {
      setTitle('');
    }
  }, [showMore]);

  const toggleTitle = () => {
    setShowMore(!showMore);
  };

  return (
    <>
      <div className="mainContainer">
        <div
          className={`${topContentContainer}
        ${(pathname === '/wbe' || pathname === '/wbe/graph-view') && marginLeft}`}
        >
          <FlexboxGrid style={{ marginTop: '10px' }} align="middle">
            <FlexboxGrid.Item colspan={3} style={{ padding: '0' }}>
              <h3>Source: </h3>
            </FlexboxGrid.Item>

            <FlexboxGrid.Item colspan={pathname !== '/wbe/new-link' ? 17 : 21}>
              <Breadcrumb style={{ fontSize: '22px', marginBottom: '-1px' }}>
                <Breadcrumb.Item>{sourceDataList?.projectName}</Breadcrumb.Item>
                <Breadcrumb.Item>{sourceDataList?.sourceType}</Breadcrumb.Item>
                <Breadcrumb.Item>{sourceDataList?.titleLabel}</Breadcrumb.Item>
                <Breadcrumb.Item>
                  <span>
                    {sourceDataList?.title?.slice(0, 25)}
                    {showMore ? <span>{title}</span> : ''}
                    {sourceDataList?.title?.length > 25 && !showMore ? '...' : ''}
                  </span>

                  {sourceDataList?.title?.length > 25 && (
                    <span className={seeMLBtn} onClick={toggleTitle}>
                      {showMore ? (
                        <MdExpandLess className={arIcon} />
                      ) : (
                        <MdExpandMore className={arIcon} />
                      )}
                    </span>
                  )}
                </Breadcrumb.Item>
              </Breadcrumb>
            </FlexboxGrid.Item>

            {/* -- create link button --  */}
            {pathname !== '/wbe/new-link' && (
              <FlexboxGrid.Item colspan={4}>
                <Button
                  onClick={() => navigate('/wbe/new-link')}
                  color="blue"
                  appearance="primary"
                  active
                  // endIcon={< AddOutlineIcon/>}
                >
                  {' '}
                  Create Link{' '}
                </Button>
              </FlexboxGrid.Item>
            )}
          </FlexboxGrid>
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

      {(pathname === '/wbe' || pathname === '/wbe/graph-view') && (
        <SideNav
          style={{ width: isSideNav ? '200px' : '55px', borderRight: '1px solid gray' }}
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

          {/* --- Dark mode option ---    */}
          <SideNavLink
            renderIcon={BrightnessContrast}
            className={`${sidebarLink} ${darkModeStyle}`}
            onClick={() => dispatch(handleIsDarkMode())}
          >
            {' '}
          </SideNavLink>
        </SideNav>
      )}
    </>
  );
};

export default WbeTopNav;
