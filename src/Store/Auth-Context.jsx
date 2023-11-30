import React, { useCallback, useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
const logoutURL = `${import.meta.env.VITE_LM_REST_API_URL}/auth/logout`;

let logoutTimer;
const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  // eslint-disable-next-line no-unused-vars
  login: (token, expiresIn, user_id, organization_id, role) => {},
  logout: () => {},
});

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedUserId = localStorage.getItem('user_id');
  const storedOrganizationId = localStorage.getItem('organization_id');
  const storedOrganizationName = localStorage.getItem('organization_name');
  const storedUserRole = localStorage.getItem('user_role');
  const storedExpirationTime = localStorage.getItem('expirationTime');

  if (!storedToken || !storedExpirationTime) {
    return null;
  }

  const expirationTime = parseInt(storedExpirationTime);
  if (expirationTime <= Date.now() / 1000) {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('organization_id');
    localStorage.removeItem('organization_name');
    localStorage.removeItem('user_role');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('wbe');
    return null;
  }

  return {
    token: storedToken,
    user_id: storedUserId,
    organization_id: storedOrganizationId,
    organization_name: storedOrganizationName,
    user_role: storedUserRole,
    expirationTime: expirationTime,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  let initialUserId;
  let initialOrganizationId;
  let initialOrganizationName;
  let initialUserRole;
  if (tokenData) {
    initialToken = tokenData.token;
    initialUserId = tokenData.user_id;
    initialOrganizationId = tokenData.organization_id;
    initialOrganizationName = tokenData.organization_name;
    initialUserRole = tokenData.user_role;
  }

  const [token, setToken] = useState(initialToken);
  const [userId, setUserId] = useState(initialUserId);
  const [organizationId, setOrganizationId] = useState(initialOrganizationId);
  const [organizationName, setOrganizationName] = useState(initialOrganizationName);
  const [userRole, setUserRole] = useState(initialUserRole);

  var userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    fetch(logoutURL, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });

    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('organization_id');
    localStorage.removeItem('organization_name');
    localStorage.removeItem('user_role');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('wbe');
    userIsLoggedIn = false;
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  // eslint-disable-next-line max-len
  const loginHandler = ({
    token,
    expiresIn,
    user_id,
    organization_id,
    user_role,
    organization,
  }) => {
    const expirationTime = Math.floor(Date.now() / 1000) + expiresIn;

    setToken(token);
    setUserId(user_id);
    setOrganizationId(organization_id);
    setUserRole(user_role);
    if (organization?.name) {
      setOrganizationName(organization?.name);
      localStorage.setItem('organization_name', organization?.name);
    }
    localStorage.setItem('token', token);
    localStorage.setItem('user_id', user_id);
    localStorage.setItem('organization_id', organization_id);
    localStorage.setItem('user_role', user_role);
    localStorage.setItem('expirationTime', expirationTime);
  };

  useEffect(() => {
    if (token) {
      const expirationTime = parseInt(localStorage.getItem('expirationTime'));
      const timer = setInterval(() => {
        const updatedRemainingTime = expirationTime - Math.floor(Date.now() / 1000);
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
          logoutHandler();
        }
        if (updatedRemainingTime <= 0) {
          logoutHandler();
        }
      }, 1000); // Update the remaining time every second

      return () => {
        clearInterval(timer);
      };
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logoutHandler]);

  const user = token ? jwtDecode(token) : {};

  const contextValue = {
    token: token,
    user_id: userId,
    organization_id: organizationId,
    organization_name: organizationName,
    user: { ...user, role: userRole },
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
  );
};

export default AuthContext;
