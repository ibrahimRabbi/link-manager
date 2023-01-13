import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isProfileOpen:false,
  isSidebarOpen:false,
  currPageTitle:'',
};

export const navSlice = createSlice({
  name: 'nav',
  initialState,

  reducers: {
    // sidebar controller
    handleIsSidebarOpen: (state, {payload}) => {
      state.isSidebarOpen=payload;
    },

    // top navbar page title
    handleIsProfileOpen: (state, {payload}) => {
      state.isProfileOpen=payload;
    },
    // top navbar page title
    handleCurrPageTitle: (state, {payload}) => {
      state.currPageTitle=payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {handleIsSidebarOpen, handleCurrPageTitle, handleIsProfileOpen} = navSlice.actions;

export default navSlice.reducer;