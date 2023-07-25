import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { Sidebar, Sidenav, Nav, Divider } from 'rsuite';
import MenuIcon from '@rsuite/icons/Menu';
import CloseIcon from '@rsuite/icons/Close';
import { handleIsAdminSidebarOpen } from '../../Redux/slices/navSlice';
import { FaUsers, FaLink } from 'react-icons/fa';
import { TiArrowBackOutline } from 'react-icons/ti';
import { SlOrganization } from 'react-icons/sl';
import { SiAzurepipelines, SiWebcomponentsdotorg } from 'react-icons/si';
import { TbApps } from 'react-icons/tb';
import { VscProject } from 'react-icons/vsc';
import { CgLink } from 'react-icons/cg';
import { MdEvent } from 'react-icons/md';
import { GrIntegration } from 'react-icons/gr';
import { darkColor, lightBgColor } from '../../App';
import PlayOutlineIcon from '@rsuite/icons/PlayOutline';

const iconStyle = {
  marginLeft: '-35px',
  marginBottom: '-3px',
  marginRight: '20px',
};

const options = [
  {
    path: ['/admin', '/admin/users'],
    navigateTo: '/admin/users',
    icon: <FaUsers style={iconStyle} />,
    content: <span>Users</span>,
  },
  {
    path: ['/admin/organizations'],
    navigateTo: '/admin/organizations',
    icon: <SlOrganization size={17} style={iconStyle} />,
    content: <span>Organizations</span>,
  },
  {
    path: ['/admin/applications'],
    navigateTo: '/admin/applications',
    icon: <TbApps size={21} style={{ ...iconStyle, marginLeft: '-37px' }} />,
    content: <span>Applications</span>,
  },
  {
    path: ['/admin/integrations'],
    navigateTo: '/admin/integrations',
    icon: <GrIntegration size={17} style={{ ...iconStyle, color: '#8e8e93' }} />,
    content: <span>Integrations</span>,
  },
  {
    path: ['/admin/projects'],
    navigateTo: '/admin/projects',
    icon: <VscProject size={18} style={{ ...iconStyle }} />,
    content: <span>Projects</span>,
  },
  {
    path: ['/admin/link-types'],
    navigateTo: '/admin/link-types',
    icon: <FaLink size={16.5} style={{ ...iconStyle }} />,
    content: <span>Link Types</span>,
  },
  {
    path: ['/admin/link-constraint'],
    navigateTo: '/admin/link-constraint',
    icon: <CgLink size={25} style={{ ...iconStyle, marginLeft: '-39px' }} />,
    content: <span>Link Constraint</span>,
  },
  {
    path: ['/admin/components'],
    navigateTo: '/admin/components',
    icon: <SiWebcomponentsdotorg size={18} style={{ ...iconStyle, marginLeft: '-36' }} />,
    content: <span>Components</span>,
  },
  {
    path: ['/admin/events'],
    navigateTo: '/admin/events',
    icon: <MdEvent size={21} style={{ ...iconStyle, marginLeft: '-37px' }} />,
    content: <span>Events</span>,
  },
  {
    path: ['/admin/pipelines'],
    navigateTo: '/admin/pipelines',
    icon: <SiAzurepipelines size={16} style={{ ...iconStyle }} />,
    content: <span>Pipelines</span>,
  },
  {
    path: ['/admin/pipelinerun'],
    navigateTo: '/admin/pipelinerun',
    icon: <PlayOutlineIcon size={15} style={{ ...iconStyle, marginLeft: '0' }} />,
    content: <span>Pipeline Results</span>,
  },
  {
    path: ['/'],
    navigateTo: '/',
    icon: <TiArrowBackOutline size={22} style={{ ...iconStyle, marginLeft: '-36px' }} />,
    content: <span>Back To Home</span>,
  },
];

const AdminSideNav = () => {
  const { isDark, isAdminSidebarOpen } = useSelector((state) => state.nav);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  return (
    <>
      <Sidebar
        style={{
          boxShadow: `2px 2px 5px ${isDark === 'light' ? 'lightgray' : '#292D33'}`,
          backgroundColor: isDark === 'dark' ? darkColor : lightBgColor,
        }}
        className="admin-components-sidebar"
        width={isAdminSidebarOpen ? 210 : 60}
        collapsible
      >
        <Sidenav.Header>
          <Nav pullRight>
            <Nav.Item
              onClick={() => dispatch(handleIsAdminSidebarOpen(!isAdminSidebarOpen))}
              style={{ width: '100%', paddingLeft: '17px', borderRadius: '0' }}
            >
              <h3>{isAdminSidebarOpen ? <CloseIcon /> : <MenuIcon />}</h3>
            </Nav.Item>
          </Nav>
        </Sidenav.Header>
        <Divider style={{ margin: '0' }} />
        <Sidenav
          expanded={isAdminSidebarOpen}
          defaultOpenKeys={['12']}
          className="admin-side-nav-body"
          appearance="subtle"
        >
          <Sidenav.Body>
            <Nav>
              {options.map((option, index) => (
                <Nav.Item
                  key={index}
                  eventKey={`${index}`}
                  active={option.path.includes(pathname)}
                  onClick={() => navigate(option.navigateTo)}
                  icon={option.icon}
                >
                  {option.content}
                </Nav.Item>
              ))}
            </Nav>
          </Sidenav.Body>
        </Sidenav>
      </Sidebar>
    </>
  );
};

export default AdminSideNav;
