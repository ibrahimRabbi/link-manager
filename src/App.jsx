import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
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
import AdminDashboard from './Pages/AdminDashboard';
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
import Pipelines from './Components/AdminDasComponents/Pipelines/Pipelines.jsx';
import PipelineRun from './Components/AdminDasComponents/PipelineRun/PipelineRun.jsx';
import Pipeline from './Components/Pipeline/Pipeline.jsx';
import WebBrowserExtension from './Components/WebBrowserExtension/WebBrowserExtension';
import GitlabSelector from './Components/SelectionDialog/GitlabSelector/GitlabSelector';
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

export const darkColor = '#1a1d24';
export const darkBgColor = '#0f131a';
export const lightBgColor = 'white';

export const OAUTH2_APPLICATION_TYPES = ['gitlab', 'jira', 'codebeamer'];
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
  const isSuperAdmin = authCtx?.user?.role === 'super_admin' ? true : false;
  const isAdmin = authCtx?.user?.role === 'admin' ? true : false;

  useEffect(() => {
    const theme = localStorage.getItem('isDarkMode');
    dispatch(handleIsDarkMode(theme));
  }, []);

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
                <WbeDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="/wbe/new-link" element={<NewLink />} />
            <Route path="/wbe/graph-view" element={<CytoscapeGraphView />} />
            <Route path="/wbe/pipeline" element={<Pipeline />} />
            <Route path="/wbe" element={<LinkManager />} />
          </Route>

          {/* This is Browser dashboard  */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route path="/new-link" element={<NewLink />} />
            <Route path="/graph-view" element={<CytoscapeGraphView />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/extension" element={<WebBrowserExtension />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/" element={<Home />} />
          </Route>

          {/* This is admin dashboard  */}
          {(isSuperAdmin || isAdmin) && (
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            >
              {isSuperAdmin && (
                <Route path="/admin/organizations" element={<Organization />} />
              )}
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/integrations" element={<Application />} />
              <Route path="/admin/projects" element={<Projects />} />
              <Route path="/admin/link-rules" element={<LinkRules />} />
              <Route path="/admin/events" element={<Events />} />
              <Route path="/admin/pipelines" element={<Pipelines />} />
              <Route path="/admin/pipelinerun" element={<PipelineRun />} />
              <Route path="/admin/synchronization" element={<SynchronizationConfig />} />
              <Route path="/admin" element={<Users />} />
            </Route>
          )}

          <Route path="/gitlabselection/:id" element={<GitlabSelector />}></Route>
          <Route path="/oauth2-status" element={<Oauth2Success />} />
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </CustomProvider>
  );
}

export default App;
