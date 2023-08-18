import React, { useCallback, useEffect, useState } from 'react';
let logoutTimer;

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
  const storedExpirationTime = localStorage.getItem('expirationTime');

  if (!storedToken || !storedExpirationTime) {
    return null;
  }

  const expirationTime = parseInt(storedExpirationTime);
  if (expirationTime <= Date.now() / 1000) {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('expirationTime');
    return null;
  }

  return {
    token: storedToken,
    user_id: storedUserId,
    expirationTime: expirationTime,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  let initialUserId;
  if (tokenData) {
    initialToken = tokenData.token;
    initialUserId = tokenData.user_id;
  }

  const [token, setToken] = useState(initialToken);
  const [userId, setUserId] = useState(initialUserId);

  var userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('expirationTime');
    userIsLoggedIn = false;
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token, expiresIn, user_id) => {
    const expirationTime = Math.floor(Date.now() / 1000) + expiresIn;

    setToken(token);
    setUserId(user_id);
    localStorage.setItem('token', token);
    localStorage.setItem('user_id', user_id);
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

  const contextValue = {
    token: token,
    user_id: userId,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
  );
};

export default AuthContext;
