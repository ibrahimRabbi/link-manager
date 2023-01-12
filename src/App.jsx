import React, { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import EditLink from './Components/EditLink/EditLink';
import GraphView from './Components/GraphView/GraphView';
import LinkDetails from './Components/LinkDetails/LinkDetails';
import LinkManager from './Components/LinkManager/LinkManager';
import NewLink from './Components/NewLink/NewLink';
import ProtectedRoute from './Components/Shared/ProtectedRoute/ProtectedRoute';
import './GlobalStyle.scss';
import Dashboard from './Pages/Dashboard';
import LoginPage from './Pages/Login';
import WbeDashboard from './Pages/WbeDashboard';
import AuthContext from './Store/Auth-Context.jsx';

function App() {
  const authCtx = useContext(AuthContext);
  return (
    <div className='App'>
      <Routes>

        {!authCtx.isLoggedIn && (
          <Route path='/' element={<Navigate to="/login" replace />} />
        )}

        {!authCtx.isLoggedIn && (
          <Route path='/login' element={<LoginPage />} />
        )}

        {authCtx.isLoggedIn && (
          <Route path='/login' element={<Navigate to="/" />}  />
        )}

        {authCtx.isLoggedIn && (
          <Route path='/wbe' element={
            <ProtectedRoute>
              <WbeDashboard />
            </ProtectedRoute>
          }>
            <Route path='/wbe' element={<LinkManager />} />
            <Route path='/wbe/new-link' element={<NewLink />} />
            <Route path='/wbe/edit-link/:id' element={<EditLink />} />
            <Route path='/wbe/details/:id' element={<LinkDetails />} />
          </Route>
        )}

        {authCtx.isLoggedIn && (
          <Route path='/' element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }>
            <Route path='/new-link' element={<NewLink />} />
            <Route path='/edit-link/:id' element={<EditLink />} />
            <Route path='/details/:id' element={<LinkDetails />} />
            <Route path='/graph-view' element={<GraphView />} />
            <Route path='/' element={<LinkManager />} />
          </Route>
        )}

        {/* THis is WBE dashboard */}
        {/* <Route path='/wbe' element={<ProtectedRoute><WbeDashboard/></ProtectedRoute>}>
          <Route path='/wbe/new-link' element={<NewLink />} />
          <Route path='/wbe/edit-link/:id' element={<EditLink />} />
          <Route path='/wbe/details/:id' element={<LinkDetails />} />
          <Route path='/wbe/graph-view' element={<GraphView />} />
          <Route path='/wbe' element={<LinkManager />} />
        </Route>
        
        <Route path='/' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}>
          <Route path='/new-link' element={<NewLink />} />
          <Route path='/edit-link/:id' element={<EditLink />} />
          <Route path='/details/:id' element={<LinkDetails />} />
          <Route path='/graph-view' element={<GraphView />} />
          <Route path='/' element={<LinkManager />} />
        </Route> */}

        {/* <Route path='*' element={<Navigate to="/login" replace />} /> */}
      </Routes>
    </div>
  );
}

export default App;
