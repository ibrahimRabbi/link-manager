import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  let { loggedInUser } = useSelector(state=>state.links);
  let location = useLocation();

  if (loggedInUser?.email) {
    return children;
  }

  return <Navigate to='/login' state={{ from: location }} />;
};

export default ProtectedRoute;