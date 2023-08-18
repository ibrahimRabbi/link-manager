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
    })
      .then((res) => {
        if (res.ok) {
          if (res.status !== 204) {
            return res.json();
          } else {
            console.log('No Links Created for this source');
            return null;
          }
        } else {
          return res.json().then((data) => {
            console.log({
              title: data.status,
              text: data.message,
              icon: 'error',
            });
            return null;
          });
        }
      })
      .catch((err) => console.log({ title: 'Error', text: err.message, icon: 'error' }));

    return res;
  },
);

const initialState = {
  graphData: { nodes: [], relationships: [] },
  graphLoading: false,
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
      if (payload) {
        if (payload?.isConfirmed) {
          //
        } else {
          state.linksData = payload.data;
        }
        state.graphData = payload.data;
      }
    });

    builder.addCase(fetchGraphData.rejected, (state, { payload }) => {
      state.graphError = payload;
      state.graphLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const { handleIsSidebarOpen, handleCurrPageTitle, handleIsProfileOpen } =
  graphSlice.actions;

export default graphSlice.reducer;
