/* eslint-disable max-len */
import React, { useEffect, useContext, lazy, Suspense } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from '@sentry/react';
import { handleIsDarkMode } from './Redux/slices/navSlice';
import AuthContext from './Store/Auth-Context';
import { CustomProvider } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import 'rsuite/styles/index.less';
import './GlobalStyle.scss';
import ProtectedRoute from './Components/Shared/ProtectedRoute/ProtectedRoute';
import Oauth2Success from './Components/Oauth2/oauth2Success';
import Oauth2TokenStatus from './Components/AdminDasComponents/ExternalAppIntegrations/Oauth2Callback/Oauth2TokenStatus';
import UseLoader from './Components/Shared/UseLoader';
import RecoverEmailSent from './Components/Login/RecoverEmailSent.jsx';

// lazy load components
const Dashboard = lazy(() => import('./Pages/Dashboard'));
const WbeDashboard = lazy(() => import('./Pages/WbeDashboard'));
const Home = lazy(() => import('./Components/Home/Home'));
const LinkManager = lazy(() => import('./Components/LinkManager/LinkManager'));
const CytoscapeGraphView = lazy(() =>
  import('./Components/CytoscapeGraphView/CytoscapeGraphView'),
);
const NewLink = lazy(() => import('./Components/NewLink/NewLink'));
const LoginPage = lazy(() => import('./Pages/Login'));
const SetPassword = lazy(() => import('./Components/Login/SetPassword'));
const NotFound = lazy(() => import('./Pages/404'));

// lazy load components admin components
const Application = lazy(() =>
  import('./Components/AdminDasComponents/Application/Application'),
);
const LinkRules = lazy(() =>
  import('./Components/AdminDasComponents/LinkRules/LinkRules'),
);
const Organization = lazy(() =>
  import('./Components/AdminDasComponents/Organization/Organization'),
);
const Projects = lazy(() => import('./Components/AdminDasComponents/Projects/Projects'));
const Users = lazy(() => import('./Components/AdminDasComponents/Users/Users'));
const Events = lazy(() => import('./Components/AdminDasComponents/Events/Events'));
const PipelineSecrets = lazy(() =>
  import('./Components/AdminDasComponents/PipelineSecrets/PipelineSecrets'),
);
const Pipelines = lazy(() =>
  import('./Components/AdminDasComponents/Pipelines/Pipelines'),
);
const PipelineRun = lazy(() =>
  import('./Components/AdminDasComponents/PipelineRun/PipelineRun'),
);
const Pipeline = lazy(() => import('./Components/Pipeline/Pipeline.jsx'));
const WebBrowserExtension = lazy(() =>
  import('./Components/WebBrowserExtension/WebBrowserExtension'),
);
const Oauth2Callback = lazy(() =>
  import(
    './Components/AdminDasComponents/ExternalAppIntegrations/Oauth2Callback/Oauth2Callback'
  ),
);
const UserProfile = lazy(() => import('./Components/Login/UserProfile'));
const SynchronizationConfig = lazy(() =>
  import('./Components/AdminDasComponents/MigrationConfig/SynchronizationConfig'),
);
const Synchronization = lazy(() =>
  import('./Components/AdminDasComponents/MigrationConfig/Synchronization'),
);
const ResourceDetails = lazy(() =>
  import('./Components/AdminDasComponents/ResourceDetails/ResourceDetails.jsx'),
);

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
          <Route
            path="/login"
            element={
              <Suspense fallback={<UseLoader />}>
                <LoginPage />
              </Suspense>
            }
          />
          <Route path="/recover-email-sent" element={<RecoverEmailSent />} />
          <Route
            path="/set-password"
            element={
              <Suspense fallback={<UseLoader />}>
                <SetPassword />
              </Suspense>
            }
          />

          <Route path="/oauth2/callback" element={<Oauth2Callback />} />
          <Route path="/oauth2/status" element={<Oauth2TokenStatus />} />
          <Route path="/oauth2-status" element={<Oauth2Success />} />

          <Route
            path="/graph-cytoscape"
            element={
              <Suspense fallback={<UseLoader />}>
                <CytoscapeGraphView />
              </Suspense>
            }
          />
          {/* This is WBE dashboard */}
          <Route
            path="/wbe"
            element={
              <ProtectedRoute>
                <Suspense fallback={<UseLoader />}>
                  <WbeDashboard />
                </Suspense>
              </ProtectedRoute>
            }
          >
            <Route
              path={`/wbe${organization}/new-link`}
              element={
                <Suspense fallback={<UseLoader />}>
                  <NewLink />
                </Suspense>
              }
            />
            <Route
              path={`/wbe${organization}/graph-view`}
              element={
                <Suspense fallback={<UseLoader />}>
                  <CytoscapeGraphView />
                </Suspense>
              }
            />
            <Route
              path={`/wbe${organization}/pipeline`}
              element={
                <Suspense fallback={<UseLoader />}>
                  <Pipeline />
                </Suspense>
              }
            />
            <Route
              path={`/wbe${organization}`}
              element={
                <Suspense fallback={<UseLoader />}>
                  <LinkManager />
                </Suspense>
              }
            />
          </Route>

          {/* This is Browser dashboard  */}
          <Route
            path={`${organization}/`}
            element={
              <ProtectedRoute>
                <Suspense fallback={<UseLoader />}>
                  <Dashboard />
                </Suspense>
              </ProtectedRoute>
            }
          >
            <Route
              path={`${organization}/new-link`}
              element={
                <Suspense fallback={<UseLoader />}>
                  <NewLink />
                </Suspense>
              }
            />
            <Route
              path={`${organization}/graph-view`}
              element={
                <Suspense fallback={<UseLoader />}>
                  <CytoscapeGraphView />
                </Suspense>
              }
            />
            <Route
              path={`${organization}/pipeline`}
              element={
                <Suspense fallback={<UseLoader />}>
                  <Pipeline />
                </Suspense>
              }
            />
            <Route
              path={`${organization}/extension`}
              element={
                <Suspense fallback={<UseLoader />}>
                  <WebBrowserExtension />
                </Suspense>
              }
            />
            <Route
              path={`${organization}/profile`}
              element={
                <Suspense fallback={<UseLoader />}>
                  <UserProfile />
                </Suspense>
              }
            />
            <Route
              path={`${organization}/`}
              element={
                <Suspense fallback={<UseLoader />}>
                  <Home />
                </Suspense>
              }
            />

            {/* ---- admin modules ---- */}
            {(isAdmin || isSuperAdmin) && (
              <>
                {/* ---- display organization module if user is an super admin ---- */}
                {isSuperAdmin && (
                  <Route
                    path={`${organization}/admin/organizations`}
                    element={
                      <Suspense fallback={<UseLoader />}>
                        <Organization />
                      </Suspense>
                    }
                  />
                )}

                <Route
                  path={`${organization}/admin`}
                  element={
                    <Suspense fallback={<UseLoader />}>
                      <Projects />
                    </Suspense>
                  }
                />
                <Route
                  path={`${organization}/admin/users`}
                  element={
                    <Suspense fallback={<UseLoader />}>
                      <Users />
                    </Suspense>
                  }
                />
                <Route
                  path={`${organization}/admin/projects`}
                  element={
                    <Suspense fallback={<UseLoader />}>
                      <Projects />
                    </Suspense>
                  }
                />
                <Route
                  path={`${organization}/admin/project/:id`}
                  element={
                    <Suspense fallback={<UseLoader />}>
                      <ResourceDetails type="project" />
                    </Suspense>
                  }
                />
                <Route
                  path={`${organization}/admin/project/new`}
                  element={
                    <Suspense fallback={<UseLoader />}>
                      <ResourceDetails type="project" newResource={true} />
                    </Suspense>
                  }
                />

                <Route
                  path={`${organization}/admin/project/:id/user-permissions`}
                  element={
                    <Suspense fallback={<UseLoader />}>
                      <ResourceDetails type="project-permissions" />
                    </Suspense>
                  }
                />
                <Route
                  path={`${organization}/admin/link-rules`}
                  element={
                    <Suspense fallback={<UseLoader />}>
                      <LinkRules />
                    </Suspense>
                  }
                />
                <Route
                  path={`${organization}/admin/events`}
                  element={
                    <Suspense fallback={<UseLoader />}>
                      <Events />
                    </Suspense>
                  }
                />
                <Route
                  path={`${organization}/admin/integrations`}
                  element={
                    <Suspense fallback={<UseLoader />}>
                      <Application />
                    </Suspense>
                  }
                />
                <Route
                  path={`${organization}/admin/pipelinessecrets`}
                  element={
                    <Suspense fallback={<UseLoader />}>
                      <PipelineSecrets />
                    </Suspense>
                  }
                />
                <Route
                  path={`${organization}/admin/pipelines`}
                  element={
                    <Suspense fallback={<UseLoader />}>
                      <Pipelines />
                    </Suspense>
                  }
                />
                <Route
                  path={`${organization}/admin/pipelinerun`}
                  element={
                    <Suspense fallback={<UseLoader />}>
                      <PipelineRun />
                    </Suspense>
                  }
                />
                <Route
                  path={`${organization}/admin/synchronization`}
                  element={
                    <Suspense fallback={<UseLoader />}>
                      <Synchronization />
                    </Suspense>
                  }
                />
                <Route
                  path={`${organization}/admin/createsync`}
                  element={
                    <Suspense fallback={<UseLoader />}>
                      <SynchronizationConfig />
                    </Suspense>
                  }
                />
              </>
            )}
          </Route>

          <Route path={`${organization}/*`} element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </CustomProvider>
  );
}

export default App;
