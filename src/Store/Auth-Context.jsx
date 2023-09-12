import React, { useCallback, useEffect, useState } from 'react';
let logoutTimer;
import jwtDecode from 'jwt-decode';

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  // eslint-disable-next-line no-unused-vars
  login: (token, expiresIn, user_id) => {},
  logout: () => {},
});

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedUserId = localStorage.getItem('user_id');
  const storedUserRole = localStorage.getItem('user_role');
  const storedExpirationTime = localStorage.getItem('expirationTime');

  if (!storedToken || !storedExpirationTime) {
    return null;
  }

  const expirationTime = parseInt(storedExpirationTime);
  if (expirationTime <= Date.now() / 1000) {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_role');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('wbe');
    return null;
  }

  return {
    token: storedToken,
    user_id: storedUserId,
    user_role: storedUserRole,
    expirationTime: expirationTime,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  let initialUserId;
  let initialUserRole;
  if (tokenData) {
    initialToken = tokenData.token;
    initialUserId = tokenData.user_id;
    initialUserRole = tokenData.user_role;
  }

  const [token, setToken] = useState(initialToken);
  const [userId, setUserId] = useState(initialUserId);
  const [userRole, setUserRole] = useState(initialUserRole);

  var userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_role');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('wbe');
    userIsLoggedIn = false;
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token, expiresIn, user_id, user_role) => {
    const expirationTime = Math.floor(Date.now() / 1000) + expiresIn;

    setToken(token);
    setUserId(user_id);
    setUserRole(user_role);
    localStorage.setItem('token', token);
    localStorage.setItem('user_id', user_id);
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
