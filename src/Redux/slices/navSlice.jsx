import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Fetch Create New link
export const fetchStreamItems = createAsyncThunk(
  'links/fetchStreamItems',
  async (url) => {
    const response = await fetch(url)
      .then((res) => res.json())
      .catch((err) => console.log(err));
    return response;
  },
);

const initialState = {
  isAdminEditing: false,
  isProfileOpen: false,
  isSidebarOpen: false,
  refreshData: false,
  isAdminSidebarOpen: true,
  isAddNewModalOpen: false,
  isDark: 'light',
  currPageTitle: '',
  linksStreamItems: [],
  linksStream: {},
};

export const navSlice = createSlice({
  name: 'nav',
  initialState,

  reducers: {
    // sidebar controller
    handleIsDarkMode: (state, { payload }) => {
      const isDarkMode = localStorage.getItem('isDarkMode');
      if (payload) {
        state.isDark = payload;
      } else {
        if (isDarkMode) {
          if (isDarkMode === 'dark') {
            localStorage.setItem('isDarkMode', 'light');
            state.isDark = 'light';
          } else if (isDarkMode === 'light') {
            localStorage.setItem('isDarkMode', 'dark');
            state.isDark = 'dark';
          }
        } else {
          localStorage.setItem('isDarkMode', 'light');
        }
      }
    },

    // sidebar controller
    handleIsSidebarOpen: (state, { payload }) => {
      state.isSidebarOpen = payload;
    },

    handleIsAdminSidebarOpen: (state, { payload }) => {
      state.isAdminSidebarOpen = payload;
    },

    handleIsAdminEditing: (state, { payload }) => {
      state.isAdminEditing = payload;
    },

    // admin add new modal
    handleIsAddNewModal: (state, { payload }) => {
      state.isAddNewModalOpen = payload;
    },

    // refresh Data
    handleRefreshData: (state, { payload }) => {
      state.refreshData = payload;
    },

    // isProfile open
    handleIsProfileOpen: (state, { payload }) => {
      state.isProfileOpen = payload;
    },

    // top navbar page title
    handleCurrPageTitle: (state, { payload }) => {
      state.currPageTitle = payload;
    },
    // link stream
    handleSelectStreamType: (state, { payload }) => {
      state.linksStream = payload;
    },
  },
  //----------------------\\
  extraReducers: (builder) => {
    // stream items
    builder.addCase(fetchStreamItems.fulfilled, (state, { payload }) => {
      state.linksStreamItems = payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  handleIsDarkMode,
  handleIsAdminEditing,
  handleIsAdminSidebarOpen,
  handleIsSidebarOpen,
  handleCurrPageTitle,
  handleIsProfileOpen,
  handleSelectStreamType,
  handleRefreshData,
  handleIsAddNewModal,
} = navSlice.actions;

export default navSlice.reducer;
