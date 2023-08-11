import React, { useCallback, useEffect, useState } from 'react';
let logoutTimer;

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  // eslint-disable-next-line no-unused-vars
  login: (token, expiresIn) => {},
  logout: () => {},
});

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationTime = localStorage.getItem('expirationTime');

  if (!storedToken || !storedExpirationTime) {
    return null;
  }

  const expirationTime = parseInt(storedExpirationTime);
  if (expirationTime <= Date.now() / 1000) {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    return null;
  }

  return {
    token: storedToken,
    expirationTime: expirationTime,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }

  const [token, setToken] = useState(initialToken);

  var userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    userIsLoggedIn = false;
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token, expiresIn) => {
    const expirationTime = Math.floor(Date.now() / 1000) + expiresIn;

    setToken(token);
    localStorage.setItem('token', token);
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
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
  );
};

export default AuthContext;
