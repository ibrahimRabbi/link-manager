import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import SelectionAuthContext from '../../../Store/SelectionAuthContext';

const SelectionProtectedRoute = ({ children }) => {
  const authCtx = useContext(SelectionAuthContext);
  const location = useLocation();
  if (authCtx.isLoggedIn) {
    return children;
  }

  return <Navigate to="/gitlablogin" state={{ from: location }} />;
};

export default SelectionProtectedRoute;
