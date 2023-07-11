import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Application from './Components/AdminDasComponents/Application/Application';
// eslint-disable-next-line max-len
import LinkConstraint from './Components/AdminDasComponents/LinkConstraint/LinkConstraint';
import Components from './Components/AdminDasComponents/Components/Components';
import LinkTypes from './Components/AdminDasComponents/LinkType/LinkTypes';
import Organization from './Components/AdminDasComponents/Organization/Organization';
import Projects from './Components/AdminDasComponents/Projects/Projects';
import Users from './Components/AdminDasComponents/Users/Users';
import EditLink from './Components/EditLink/EditLink';
import GraphView from './Components/GraphView/GraphView';
import LinkDetails from './Components/LinkDetails/LinkDetails';
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
import UserVerify from './Components/Login/UserVerify';
import Oauth2Success from './Components/Oauth2/oauth2Success.jsx';
import Events from './Components/AdminDasComponents/Events/Events.jsx';
import Pipelines from './Components/AdminDasComponents/Pipelines/Pipelines.jsx';
import Associations from './Components/AdminDasComponents/Associations/Associations';
import PipelineRun from './Components/AdminDasComponents/PipelineRun/PipelineRun.jsx';
import Pipeline from './Components/Pipeline/Pipeline.jsx';
import WebBrowserExtension from './Components/WebBrowserExtension/WebBrowserExtension';
import GitlabSelector from './Components/SelecctionDialog/GitlabSelector/GitlabSelector';
// eslint-disable-next-line max-len
import SelectionProtectedRoute from './Components/Shared/ProtectedRoute/SelectionProtectedRoute';
import GitlabLogin from './Components/SelecctionDialog/GitlabSelector/GitlabLogin';

export const darkColor = '#1a1d24';
export const darkBgColor = '#0f131a';
export const lightBgColor = 'white';

function App() {
  const { isDark } = useSelector((state) => state.nav);
  const dispatch = useDispatch();

  useEffect(() => {
    const isDark = localStorage.getItem('isDarkMode');
    dispatch(handleIsDarkMode(isDark));
  }, []);

  // resize observer loop disable
  window.addEventListener('error', (e) => {
    if (
      e.message == 'ResizeObserver loop completed with undelivered notifications.' ||
      e.message?.toLowerCase()?.includes('resizeObserver'?.toLocaleLowerCase())
    ) {
      const resizeIframe = document.getElementById('webpack-dev-server-client-overlay');
      if (resizeIframe) {
        resizeIframe.style.display = 'none';
        return false;
      }
    }
  });

  return (
    <CustomProvider theme={isDark}>
      <div
        className="App"
        style={{ backgroundColor: isDark === 'dark' ? darkBgColor : lightBgColor }}
      >
        <Routes>
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
            <Route path="/wbe/edit-link/:id" element={<EditLink />} />
            <Route path="/wbe/details/:id" element={<LinkDetails />} />
            <Route path="/wbe/graph-view" element={<GraphView />} />
            <Route path="/wbe/pipeline" element={<Pipeline />} />
            <Route path="/wbe/graph-dashboard" element={<GraphView />} />
            <Route path="/wbe/treeview" element={<LinkManager />} />
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
            <Route path="/edit-link/:id" element={<EditLink />} />
            <Route path="/details/:id" element={<LinkDetails />} />
            <Route path="/graph-view" element={<GraphView />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/graph-dashboard" element={<GraphView />} />
            <Route path="/treeview" element={<LinkManager />} />
            <Route path="/extension" element={<WebBrowserExtension />} />
            <Route path="/" element={<LinkManager />} />
          </Route>

          {/* This is admin dashboard  */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/organizations" element={<Organization />} />
            <Route path="/admin/applications" element={<Application />} />
            <Route path="/admin/integrations" element={<Associations />} />
            <Route path="/admin/projects" element={<Projects />} />
            <Route path="/admin/link-types" element={<LinkTypes />} />
            <Route path="/admin/link-constraint" element={<LinkConstraint />} />
            <Route path="/admin/components" element={<Components />} />
            <Route path="/admin/events" element={<Events />} />
            <Route path="/admin/pipelines" element={<Pipelines />} />
            <Route path="/admin/pipelinerun" element={<PipelineRun />} />
            <Route path="/admin" element={<Users />} />
          </Route>
          <Route
            path="/gitlabselection"
            element={
              <SelectionProtectedRoute>
                <GitlabSelector />
              </SelectionProtectedRoute>
            }
          ></Route>
          <Route path="/gitlablogin" element={<GitlabLogin />}></Route>
          <Route path="/oauth2-status" element={<Oauth2Success />} />
          <Route path="/set-password" element={<UserVerify />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </CustomProvider>
  );
}

export default App;
