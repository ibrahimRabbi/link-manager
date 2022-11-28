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
  const baseline= searchParams.get('commit');
  const projectName =searchParams.get('project');
  const stream= searchParams.get('branch');
  const origin= searchParams.get('origin');
  const isWBE = location.pathname === '/wbe';

  useEffect(()=>{
    dispatch(handleIsWbe(isWBE));
    if(baseline) dispatch(handleGetSources({projectName, stream, baseline, origin}));
  },[ baseline]);

  if(isLoading) return <h1 className='text-center'>Loading...</h1>;

  if (!loggedInUser?.userName) {
    return <Navigate to='/login' state={{ from: location }} />;
  }
  else{
    return children;
  }
};

export default ProtectedRoute;