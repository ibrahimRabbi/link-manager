import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import EditLink from './Components/EditLink/EditLink';
import GraphView from './Components/GraphView/GraphView';
import LinkDetails from './Components/LinkDetails/LinkDetails';
import LinkManager from './Components/LinkManager/LinkManager';
import NewLink from './Components/NewLink/NewLink';
import ProtectedRoute from './Components/Shared/ProtectedRoute/ProtectedRoute';
import useSessionStorage from './Components/Shared/UseSessionStorage/UseSessionStorage';
import './GlobalStyle.scss';
import NotFound from './Pages/404';
import Dashboard from './Pages/Dashboard';
import LoginPage from './Pages/Login';
import WbeDashboard from './Pages/WbeDashboard';
import { handleIsLoading, handleLoggedInUser } from './Redux/slices/linksSlice';


function App() {
  const dispatch=useDispatch();
  useEffect(()=>{
    dispatch(handleIsLoading(true));
    const userName =useSessionStorage('get', 'userName');
    const password =useSessionStorage('get', 'password');
    dispatch(handleLoggedInUser({userName, password}));
    dispatch(handleIsLoading(false));
  },[]);

  return (
    <div className='App'>
      <Routes>
        <Route path='/wbe' element={<ProtectedRoute><WbeDashboard/></ProtectedRoute>}>
          <Route path='/wbe' element={<LinkManager />} />
          <Route path='/wbe/new-link' element={<NewLink />} />
          <Route path='/wbe/edit-link/:id' element={<EditLink />} />
          <Route path='/wbe/details/:id' element={<LinkDetails />} />
        </Route>


        <Route path='/' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}>
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
