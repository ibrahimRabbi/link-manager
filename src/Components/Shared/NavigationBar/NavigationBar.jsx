import { HybridNetworkingAlt, UserAvatarFilledAlt } from '@carbon/icons-react';
import { Header, HeaderContainer, HeaderMenuButton, HeaderName, OverflowMenu, OverflowMenuItem, SideNav, SideNavItems, SideNavLink, Theme } from '@carbon/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import mediaQuery from '../MediaQueryHook/MediaQuery';
import { headerContainer, lgNav, main, menuItem, pageTitle, profile, projectTitle, smNav } from './NavigationBar.module.scss';

const NavigationBar = () => {
  const {currPageTitle}=useSelector(state=>state.links);
  const isDeskTop=mediaQuery('(min-width: 1055px)');
  const navigate=useNavigate();
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
                  <OverflowMenu id={profile} label='' menuOffset={{left:-60}}
                    renderIcon={() => <UserAvatarFilledAlt size='25'/>}
                    size='md' ariaLabel=''>
                    <OverflowMenuItem wrapperClassName={menuItem} itemText='admin@example.com'/>
                    <OverflowMenuItem wrapperClassName={menuItem} itemText='Logout' />
                  </OverflowMenu>
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