import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Fetch data for show the graph view
export const fetchGraphData = createAsyncThunk(
  'graph/fetchGraphsData',
  async ({ url, token }) => {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        authorization: 'Bearer ' + token,
      },
    }).then((res) => res.json());
    return res;
  },
);

const initialState = {
  graphData:{},
  graphLoading:false,
  error: null,
};

export const graphSlice = createSlice({
  name: 'graph',
  initialState,

  reducers: {
    handleIsProfileOpen: (state, { payload }) => {
      state.isProfileOpen = payload;
    },
  },
  extraReducers: (builder) => {
    // graph API controller
    builder.addCase(fetchGraphData.pending, (state) => {
      state.graphLoading = true;
    });

    builder.addCase(fetchGraphData.fulfilled, (state, { payload }) => {
      state.graphLoading = false;
      if (payload) state.graphData = payload.data;
      else{
        state.graphData = {nodes:[], relationships:[]};
      }
    });

    builder.addCase(fetchGraphData.rejected, (state, { payload }) => {
      state.graphLoading = false;
      state.graphError = payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const { handleIsSidebarOpen, handleCurrPageTitle, handleIsProfileOpen } =
  graphSlice.actions;

export default graphSlice.reducer;
