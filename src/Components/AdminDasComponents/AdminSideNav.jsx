import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar, Sidenav, Nav, Divider } from 'rsuite';
import { handleIsAdminSidebarOpen } from '../../Redux/slices/navSlice';
import { FaUsers, FaLink } from 'react-icons/fa';
import { SlOrganization } from 'react-icons/sl';
import { SiAzurepipelines } from 'react-icons/si';
import { PiPlugsDuotone } from 'react-icons/pi';
import { VscProject } from 'react-icons/vsc';
import { CgLink } from 'react-icons/cg';
import { MdEvent, MdArrowForwardIos } from 'react-icons/md';
import { darkColor, lightBgColor } from '../../App';
import PlayOutlineIcon from '@rsuite/icons/PlayOutline';

const iconStyle = {
  marginLeft: '-35px',
  marginBottom: '-3px',
  marginRight: '20px',
};

const options = [
  {
    path: ['/admin', '/admin/organizations'],
    navigateTo: '/admin/organizations',
    icon: <SlOrganization size={17} style={iconStyle} />,
    content: <span>Organizations</span>,
  },
  {
    path: ['/admin/users'],
    navigateTo: '/admin/users',
    icon: <FaUsers style={iconStyle} />,
    content: <span>Users</span>,
  },
  {
    path: ['/admin/integrations'],
    navigateTo: '/admin/integrations',
    icon: <PiPlugsDuotone size={21} style={{ ...iconStyle, marginLeft: '-37px' }} />,
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
    icon: (
      <CgLink
        size={24}
        style={{ ...iconStyle, marginLeft: '-40px', marginRight: '17px' }}
      />
    ),
    content: <span>Link Constraint</span>,
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
    content: <span>Pipeline Runs</span>,
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
        <Sidenav.Header className="dashboard_sidebar_header">
          <h3
            style={{ transform: isAdminSidebarOpen ? 'rotate(180deg)' : '' }}
            onClick={() => dispatch(handleIsAdminSidebarOpen(!isAdminSidebarOpen))}
          >
            <MdArrowForwardIos />
          </h3>
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
