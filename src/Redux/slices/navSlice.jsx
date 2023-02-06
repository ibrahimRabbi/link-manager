import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isProfileOpen: false,
  isSidebarOpen: false,
  currPageTitle: '',
  linksStream: '',
};

export const navSlice = createSlice({
  name: 'nav',
  initialState,

  reducers: {
    // sidebar controller
    handleIsSidebarOpen: (state, { payload }) => {
      state.isSidebarOpen = payload;
    },

    // top navbar page title
    handleIsProfileOpen: (state, { payload }) => {
      state.isProfileOpen = payload;
    },
    // top navbar page title
    handleCurrPageTitle: (state, { payload }) => {
      state.currPageTitle = payload;
    },
    // top navbar page title
    handleSelectStreamType: (state, { payload }) => {
      state.linksStream = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  handleIsSidebarOpen,
  handleCurrPageTitle,
  handleIsProfileOpen,
  handleSelectStreamType,
} = navSlice.actions;

export default navSlice.reducer;
