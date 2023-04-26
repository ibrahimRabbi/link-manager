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
  isProfileOpen: false,
  isSidebarOpen: false,
  currPageTitle: '',
  linksStreamItems: [],
  linksStream: {},
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
  handleIsSidebarOpen,
  handleCurrPageTitle,
  handleIsProfileOpen,
  handleSelectStreamType,
} = navSlice.actions;

export default navSlice.reducer;
