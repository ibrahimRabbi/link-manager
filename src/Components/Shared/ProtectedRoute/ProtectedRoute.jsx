import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { handleGetSources, handleIsWbe } from '../../../Redux/slices/linksSlice';

const ProtectedRoute = ({ children }) => {
  // Get sources in the gitlab and display data  
  const {loggedInUser}=useSelector(state=>state.links);
  let location = useLocation();
  const dispatch =useDispatch();

  // Get query parameters from the Gitlab
  const [searchParams] = useSearchParams();
  const projectName =searchParams.get('project');
  const title =searchParams.get('title');
  const uri =searchParams.get('uri');
  const branch= searchParams.get('branch');
  const origin= searchParams.get('origin');
  const isWBE = location.pathname === '/wbe';

  useEffect(()=>{
    dispatch(handleIsWbe(isWBE));
    if(uri) dispatch(handleGetSources({projectName, branch, title, uri, origin}));
  },[uri]);

  // useEffect(()=>{
  //   const token =useSessionStorage('get', 'token');
  //   dispatch(handleLoggedInUser({token:window.atob(token)}));
  //   console.log(token);
  // },[sessionStorage]);

  if (loggedInUser?.token) {
    return children;
  }
  return <Navigate to='/login' state={{ from: location }} />;
};

export default ProtectedRoute;