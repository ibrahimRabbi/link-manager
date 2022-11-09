import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  let { loggedInUser, isLoading } = useSelector(state=>state.links);
  let location = useLocation();
  if(isLoading) return <h1 className='text-center'>Loading...</h1>;

  if (loggedInUser?.userName) {
    return children;
  }

  return <Navigate to='/login' state={{ from: location }} />;
};

export default ProtectedRoute;