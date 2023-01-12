import React, {useState} from 'react';

const NavigationBarContext = React.createContext(
  {
    isSideBarOpen: false,
    setSideBar: () => {},
    isProfileOpen: false,
    setProfile: () => {},
  }
);

export const NavigationBarContextProvider = (props) => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const setSideBarHandler = (value) => {
    setIsSideBarOpen(value);
  };

  const setProfileHandler = (value) => {
    setIsProfileOpen(value);
  };

  const contextValue = {
    isSideBarOpen: isSideBarOpen,
    setSideBar: setSideBarHandler,
    isProfileOpen: isProfileOpen,
    setProfile: setProfileHandler,
  };

  return (
    <NavigationBarContext.Provider value={contextValue}>
      {props.children}
    </NavigationBarContext.Provider>
  );
};

export default NavigationBarContext;
