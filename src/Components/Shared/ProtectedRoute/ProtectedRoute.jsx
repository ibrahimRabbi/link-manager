import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { handleGetSources, handleIsWbe } from '../../../Redux/slices/linksSlice';

const ProtectedRoute = ({ children }) => {
  // Get sources in the gitlab and display data  
  let { loggedInUser, isLoading } = useSelector(state=>state.links);
  let location = useLocation();
  const dispatch =useDispatch();
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
  },[ uri, sessionStorage]);

  if(isLoading) return <h1 className='text-center'>Loading...</h1>;
  
  if (loggedInUser?.token) {
    return children;
  }
  else{
    return <Navigate to='/login' state={{ from: location }} />;
  }
};

export default ProtectedRoute;