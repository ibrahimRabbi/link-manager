import { FaLink, FaShareAlt } from 'react-icons/fa';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import { ImMenu } from 'react-icons/im';
import { RxSlash } from 'react-icons/rx';
import {
  Button,
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenuItem,
  Theme,
  // Tooltip,
} from '@carbon/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchStreamItems, handleSelectStreamType } from '../../../Redux/slices/navSlice';
import UseDropdown from '../UseDropdown/UseDropdown';

import styles from './NavigationBar.module.scss';
const {
  wbeSideNav,
  topContentContainer,
  fileContainer,
  sidebarLink,
  dropdownStyle,
  marginLeft,
  titleDiv,
  seeMLBtn,
  arIcon,
  icon,
} = styles;

const WbeTopNav = () => {
  const { linksStream, linksStreamItems } = useSelector((state) => state.nav);
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
          <div className={fileContainer}>
            {/* with hover tooltip show title */}
            {/* {
              sourceDataList?.titleLabel ? 
                <Tooltip
                  align="bottom-right"
                  label={<p>{sourceDataList?.title}</p>}
                  tabIndex={0}
                  triggerText="Tooltip label"
                >
                  <button className="tooltip-trigger" type="button">
                    <h5 className={fileName}>
                       Links For: <span>{sourceDataList?.titleLabel}</span>
                    </h5>
                  </button>
                </Tooltip>
                :
                <h5 className={fileName}>
              Links For: <span>{sourceDataList?.title}</span>
                </h5>
            } */}

            {/* with see more and see less btn show title */}
            <div className={titleDiv}>
              <h3>Source: </h3>
              <p>
                {sourceDataList?.projectName}
                {sourceDataList?.projectName && <RxSlash className={icon} />}
                {sourceDataList?.sourceType}
                {sourceDataList?.sourceType && <RxSlash className={icon} />}
                {sourceDataList?.titleLabel}
                {sourceDataList?.titleLabel && <RxSlash className={icon} />}
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
              </p>
            </div>

            {pathname !== '/wbe/new-link' && (
              <Button size="sm" kind="primary" onClick={() => navigate('/wbe/new-link')}>
                Create Link
              </Button>
            )}
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

      {(pathname === '/wbe' || pathname === '/wbe/graph-view') && (
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
      )}
    </>
  );
};

export default WbeTopNav;
