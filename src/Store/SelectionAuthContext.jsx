import React, { useState } from 'react';

const SelectionAuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  // eslint-disable-next-line no-unused-vars
  login: (token) => {},
});

const retrieveStoredToken = () => {
  return localStorage.getItem('selectionToken');
};

export const SelectionAuthContextProvider = (props) => {
  const storedToken = retrieveStoredToken();
  const [token, setToken] = useState(storedToken);

  const userIsLoggedIn = !!token;

  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem('selectionToken', token);
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
  };

  return (
    <SelectionAuthContext.Provider value={contextValue}>
      {props.children}
    </SelectionAuthContext.Provider>
  );
};

export default SelectionAuthContext;
