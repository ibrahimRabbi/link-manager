/* eslint-disable max-len */
import React, { useContext } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Application from './Components/AdminDasComponents/Application/Application';
import LinkRules from './Components/AdminDasComponents/LinkRules/LinkRules';
import Organization from './Components/AdminDasComponents/Organization/Organization';
import Projects from './Components/AdminDasComponents/Projects/Projects';
import Users from './Components/AdminDasComponents/Users/Users';
import LinkManager from './Components/LinkManager/LinkManager';
import NewLink from './Components/NewLink/NewLink';
import ProtectedRoute from './Components/Shared/ProtectedRoute/ProtectedRoute';
import './GlobalStyle.scss';
import NotFound from './Pages/404';
import Dashboard from './Pages/Dashboard';
import LoginPage from './Pages/Login';
import WbeDashboard from './Pages/WbeDashboard';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { handleIsDarkMode } from './Redux/slices/navSlice';
import { CustomProvider } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import 'rsuite/styles/index.less';
import SetPassword from './Components/Login/SetPassword';
import Oauth2Success from './Components/Oauth2/oauth2Success.jsx';
import Events from './Components/AdminDasComponents/Events/Events.jsx';
// eslint-disable-next-line max-len
import PipelineSecrets from './Components/AdminDasComponents/PipelineSecrets/PipelineSecrets';
import Pipelines from './Components/AdminDasComponents/Pipelines/Pipelines.jsx';
import PipelineRun from './Components/AdminDasComponents/PipelineRun/PipelineRun.jsx';
import Pipeline from './Components/Pipeline/Pipeline.jsx';
import WebBrowserExtension from './Components/WebBrowserExtension/WebBrowserExtension';
// eslint-disable-next-line max-len
import Oauth2Callback from './Components/AdminDasComponents/ExternalAppIntegrations/Oauth2Callback/Oauth2Callback.jsx';
import CytoscapeGraphView from './Components/CytoscapeGraphView/CytoscapeGraphView.jsx';
import UserProfile from './Components/Login/UserProfile';
// eslint-disable-next-line max-len
import Oauth2TokenStatus from './Components/AdminDasComponents/ExternalAppIntegrations/Oauth2Callback/Oauth2TokenStatus.jsx';
import AuthContext from './Store/Auth-Context';
import Home from './Components/Home/Home';
// eslint-disable-next-line max-len
import SynchronizationConfig from './Components/AdminDasComponents/MigrationConfig/SynchronizationConfig';
import Synchronization from './Components/AdminDasComponents/MigrationConfig/Synchronization';
import * as Sentry from '@sentry/react';
import ResourceDetails from './Components/AdminDasComponents/ResourceDetails/ResourceDetails.jsx';

export const darkColor = '#1a1d24';
export const darkBgColor = '#0f131a';
export const lightBgColor = 'white';

export const OAUTH2_APPLICATION_TYPES = [
  'gitlab',
  'jira',
  'codebeamer',
  'bitbucket',
  'github',
];
export const OAUTH2_ROPC_APPLICATION_TYPES = ['servicenow'];
export const OIDC_APPLICATION_TYPES = ['codebeamer'];
export const MICROSERVICES_APPLICATION_TYPES = ['glideyoke'];
export const BASIC_AUTH_APPLICATION_TYPES = ['valispace', 'dng'];

export const USER_PASSWORD_APPLICATION_TYPES =
  MICROSERVICES_APPLICATION_TYPES + BASIC_AUTH_APPLICATION_TYPES;
export const WORKSPACE_APPLICATION_TYPES = ['gitlab', 'valispace'];
export const PROJECT_APPLICATION_TYPES = ['jira', 'glideyoke'];

export const THIRD_PARTY_INTEGRATIONS =
  OAUTH2_APPLICATION_TYPES +
  MICROSERVICES_APPLICATION_TYPES +
  BASIC_AUTH_APPLICATION_TYPES;

function App() {
  const { isDark } = useSelector((state) => state.nav);
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isSuperAdmin = authCtx?.user?.role === 'super_admin';
  const isAdmin = authCtx?.user?.role === 'admin';

  useEffect(() => {
    const theme = localStorage.getItem('isDarkMode');
    dispatch(handleIsDarkMode(theme));
  }, []);
  // eslint-disable-next-line max-len
  const organization = authCtx?.organization_name
    ? `/${authCtx?.organization_name?.toLowerCase()}`
    : '';

  useEffect(() => {
    if (organization) {
      if (pathname === '/') navigate(organization);
      else if (pathname === '/wbe') navigate(`/wbe${organization}`);
    }
  }, [pathname]);

  // add condition to not send error message to the sentry for specific reason
  Sentry.addGlobalEventProcessor(function (event) {
    // Add anything to the event here
    // returning `null` will drop the event
    if (event?.exception?.values) {
      for (let error of event.exception.values) {
        if (error?.value?.toLowerCase()?.includes('token does not match')) {
          authCtx?.logout();
          return null;
        } else if (error?.value?.toLowerCase()?.includes('403 not authorized')) {
          authCtx?.logout();
          return null;
        }
      }
    }

    return event;
  });

  return (
    <CustomProvider theme={isDark}>
      <div
        className="App"
        style={{
          backgroundColor: isDark === 'dark' ? darkBgColor : lightBgColor,
          color: isDark === 'dark' && '#a4a9b3',
        }}
      >
        <Routes>
          <Route path="/oauth2/callback" element={<Oauth2Callback />} />
          <Route path="/oauth2/status" element={<Oauth2TokenStatus />} />

          <Route path="/graph-cytoscape" element={<CytoscapeGraphView />} />
          {/* This is WBE dashboard */}
          <Route
            path="/wbe"
            element={
              <ProtectedRoute>
                {' '}
                <WbeDashboard />
              </ProtectedRoute>
            }
          >
            <Route path={`/wbe${organization}/new-link`} element={<NewLink />} />
            <Route
              path={`/wbe${organization}/graph-view`}
              element={<CytoscapeGraphView />}
            />
            <Route path={`/wbe${organization}/pipeline`} element={<Pipeline />} />
            <Route path={`/wbe${organization}`} element={<LinkManager />} />
          </Route>

          {/* This is Browser dashboard  */}
          <Route
            path={`${organization}/`}
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route path={`${organization}/new-link`} element={<NewLink />} />
            <Route path={`${organization}/graph-view`} element={<CytoscapeGraphView />} />
            <Route path={`${organization}/pipeline`} element={<Pipeline />} />
            <Route path={`${organization}/extension`} element={<WebBrowserExtension />} />
            <Route path={`${organization}/profile`} element={<UserProfile />} />
            <Route path={`${organization}/`} element={<Home />} />

            {/* ---- admin modules ---- */}
            {(isAdmin || isSuperAdmin) && (
              <>
                {/* ---- display organization module if user is an super admin ---- */}
                {isSuperAdmin && (
                  <Route
                    path={`${organization}/organizations`}
                    element={<Organization />}
                  />
                )}

                <Route path={`${organization}/users`} element={<Users />} />
                <Route path={`${organization}/projects`} element={<Projects />} />
                <Route path={`${organization}/link-rules`} element={<LinkRules />} />
                <Route path={`${organization}/events`} element={<Events />} />
                <Route path={`${organization}/integrations`} element={<Application />} />
                <Route
                  path={`${organization}/pipelinessecrets`}
                  element={<PipelineSecrets />}
                />
                <Route path={`${organization}/pipelines`} element={<Pipelines />} />
                <Route path={`${organization}/pipelinerun`} element={<PipelineRun />} />
                <Route
                  path={`${organization}/synchronization`}
                  element={<Synchronization />}
                />
                <Route
                  path={`${organization}/createsync`}
                  element={<SynchronizationConfig />}
                />
              </>
            )}
          </Route>

          <Route
            path={`${organization}/admin/project/:id`}
            element={<ResourceDetails type="project" />}
          />
          <Route
            path={`${organization}/admin/project/:id/user-permissions`}
            element={<ResourceDetails type="project-permissions" />}
          />
          <Route path="/oauth2-status" element={<Oauth2Success />} />
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path={`${organization}/*`} element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </CustomProvider>
  );
}

export default App;
