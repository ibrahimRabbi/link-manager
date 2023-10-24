import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar, Sidenav, Nav, Divider, Navbar } from 'rsuite';
import { handleIsAdminSidebarOpen } from '../../Redux/slices/navSlice';
import { FaUsers, FaLink } from 'react-icons/fa';
import { SlOrganization } from 'react-icons/sl';
import { SiAzurepipelines } from 'react-icons/si';
import { PiPlugsDuotone } from 'react-icons/pi';
import { VscProject } from 'react-icons/vsc';
import { MdEvent, MdArrowForwardIos } from 'react-icons/md';
import { darkColor, lightBgColor } from '../../App';
import PlayOutlineIcon from '@rsuite/icons/PlayOutline';
import { useContext } from 'react';
import AuthContext from '../../Store/Auth-Context';
import { BiTransferAlt } from 'react-icons/bi';
import { RiLockPasswordLine } from 'react-icons/ri';

const iconStyle = {
  marginLeft: '-35px',
  marginBottom: '-3px',
  marginRight: '20px',
};

const AdminSideNav = () => {
  const { isDark, isAdminSidebarOpen } = useSelector((state) => state.nav);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const authCtx = useContext(AuthContext);
  const isSuperAdmin = authCtx?.user?.role === 'super_admin' ? true : false;
  // eslint-disable-next-line max-len
  const organization = authCtx?.organization_name
    ? `/${authCtx?.organization_name?.toLowerCase()}`
    : '';

  const options = [
    {
      path: [`${organization}/admin`, `${organization}/admin/users`],
      navigateTo: `${organization}/admin/users`,
      icon: <FaUsers style={iconStyle} />,
      content: <span>Users</span>,
      hidden: false,
    },
    {
      path: [`${organization}/admin/organizations`],
      navigateTo: `${organization}/admin/organizations`,
      icon: <SlOrganization size={17} style={iconStyle} />,
      content: <span>Organizations</span>,
      hidden: false,
    },
    {
      path: [`${organization}/admin/integrations`],
      navigateTo: `${organization}/admin/integrations`,
      icon: <PiPlugsDuotone size={21} style={{ ...iconStyle, marginLeft: '-37px' }} />,
      content: <span>Integrations</span>,
      hidden: false,
    },
    {
      path: [`${organization}admin/projects`],
      navigateTo: `${organization}/admin/projects`,
      icon: <VscProject size={18} style={{ ...iconStyle }} />,
      content: <span>Projects</span>,
      hidden: false,
    },
    {
      path: [`${organization}/admin/link-rules`],
      navigateTo: `${organization}/admin/link-rules`,
      icon: <FaLink size={16.5} style={{ ...iconStyle }} />,
      content: <span>Link Rules</span>,
      hidden: false,
    },
    {
      path: [`${organization}/admin/events`],
      navigateTo: `${organization}/admin/events`,
      icon: <MdEvent size={21} style={{ ...iconStyle, marginLeft: '-37px' }} />,
      content: <span>Event Config</span>,
      hidden: false,
    },
    {
      path: [`${organization}/admin/pipelinessecrets`],
      navigateTo: `${organization}/admin/pipelinessecrets`,
      icon: <RiLockPasswordLine size={16} style={{ ...iconStyle }} />,
      content: <span>Pipeline Secrets</span>,
      hidden: false,
    },
    {
      path: [`${organization}/admin/pipelines`],
      navigateTo: `${organization}/admin/pipelines`,
      icon: <SiAzurepipelines size={16} style={{ ...iconStyle }} />,
      content: <span>Pipeline Config</span>,
      hidden: false,
    },

    {
      path: [`${organization}/admin/pipelinerun`],
      navigateTo: `${organization}/admin/pipelinerun`,
      icon: <PlayOutlineIcon size={15} style={{ ...iconStyle, marginLeft: '0' }} />,
      content: <span>Pipeline Runs</span>,
      hidden: true,
    },
    {
      path: [`${organization}/admin/synchronization`],
      navigateTo: `${organization}/admin/synchronization`,
      icon: (
        <BiTransferAlt style={{ ...iconStyle, marginLeft: '-38px', fontSize: '20px' }} />
      ),
      content: <span>Synchronization</span>,
      hidden: false,
    },
  ];

  return (
    <>
      <Sidebar
        style={{
          boxShadow: `2px 2px 5px ${isDark === 'light' ? 'lightgray' : '#292D33'}`,
          backgroundColor: isDark === 'dark' ? darkColor : lightBgColor,
        }}
        className="admin-components-sidebar"
        width={isAdminSidebarOpen ? 200 : 56}
        collapsible
      >
        <Divider style={{ margin: '0' }} />

        <Sidenav
          expanded={isAdminSidebarOpen}
          defaultOpenKeys={['12']}
          className="admin-side-nav-body"
          appearance="subtle"
        >
          <Sidenav.Body>
            <Nav>
              {options
                .filter((options) => !options.hidden)
                .map((option, index) => {
                  if (option.navigateTo === '/admin/organizations' && !isSuperAdmin) {
                    return null;
                  }
                  return (
                    <Nav.Item
                      key={index}
                      eventKey={`${index}`}
                      active={option.path.includes(pathname)}
                      onClick={() => navigate(option.navigateTo)}
                      icon={option.icon}
                    >
                      {option.content}
                    </Nav.Item>
                  );
                })}
            </Nav>
          </Sidenav.Body>
        </Sidenav>

        <Navbar style={{ margin: 'auto 0 10px 0' }}>
          <Nav pullRight>
            <Nav.Item
              onClick={() => dispatch(handleIsAdminSidebarOpen(!isAdminSidebarOpen))}
              style={{
                textAlign: 'center',
                transition: '0.2s',
                transform: isAdminSidebarOpen ? 'rotate(180deg)' : '',
              }}
            >
              <MdArrowForwardIos size={25} />
            </Nav.Item>
          </Nav>
        </Navbar>
      </Sidebar>
    </>
  );
};

export default AdminSideNav;
