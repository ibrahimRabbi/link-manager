import React from 'react';
import { Route, Routes } from 'react-router-dom';
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

function App() {
  
  return (
    <div className='App'>
      <Routes>
        <Route path='/new-link' element={<NewLink />} />
        <Route path='/' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}>
          <Route path='/:id' element={<LinkManager />} />
          <Route path='/new-link' element={<NewLink />} />
          <Route path='/edit-link/:id' element={<EditLink />} />
          <Route path='/details/:id' element={<LinkDetails />} />
          <Route path='/graph-view' element={<GraphView />} />
          <Route path='/' element={<LinkManager />} />
        </Route>

        <Route path='/login' element={<LoginPage />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
