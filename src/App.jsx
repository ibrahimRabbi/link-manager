import React, {useContext} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import EditLink from './Components/EditLink/EditLink';
import GraphView from './Components/GraphView/GraphView';
import LinkDetails from './Components/LinkDetails/LinkDetails';
import LinkManager from './Components/LinkManager/LinkManager';
import NewLink from './Components/NewLink/NewLink';
import ProtectedRoute from './Components/Shared/ProtectedRoute/ProtectedRoute';
import './GlobalStyle.scss';
import NotFound from './Pages/404';
import Dashboard from './Pages/Dashboard';
import LoginPage from './Pages/Login';
import WbeDashboard from './Pages/WbeDashboard';
import AuthContext from './Store/Auth-Context.jsx';

function App() {

  const authCtx = useContext(AuthContext);

  return (
    <div className='App'>
      <Routes>
        {authCtx.isLoggedIn && (
          <Route path='/wbe' element={<ProtectedRoute><WbeDashboard/></ProtectedRoute>}>
            <Route path='/wbe' element={<LinkManager />} />
            <Route path='/wbe/new-link' element={<NewLink />} />
            <Route path='/wbe/edit-link/:id' element={<EditLink />} />
            <Route path='/wbe/details/:id' element={<LinkDetails />} />
          </Route>
        )}

        {authCtx.isLoggedIn && (
          <Route path='/' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}>
            <Route path='/new-link' element={<NewLink />} />
            <Route path='/edit-link/:id' element={<EditLink />} />
            <Route path='/details/:id' element={<LinkDetails />} />
            <Route path='/graph-view' element={<GraphView />} />
            <Route path='/' element={<LinkManager />} />
          </Route>
        )}

        {!authCtx.isLoggedIn && (
          <Route path='/login' element={<LoginPage />} />
        )}

        <Route path='*' element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
