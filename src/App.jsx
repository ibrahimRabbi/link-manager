import React from 'react';
import { Route, Routes } from 'react-router-dom';
import EditLink from './Components/EditLink/EditLink';
import LinkDetails from './Components/LinkDetails/LinkDetails';
import LinkManager from './Components/LinkManager/LinkManager';
import NewLink from './Components/NewLink/NewLink';
import './GlobalStyle.scss';
import NotFound from './Pages/404';
import Dashboard from './Pages/Dashboard';
import LoginPage from './Pages/Login';

function App() {
  
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<LoginPage />} />

        <Route path='/link-manager' element={<Dashboard/>}>
          <Route path='/link-manager/new-link' element={<NewLink />} />
          <Route path='/link-manager/edit-link/:id' element={<EditLink />} />
          <Route path='/link-manager/details/:id' element={<LinkDetails />} />
          <Route path='/link-manager' element={<LinkManager />} />
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
