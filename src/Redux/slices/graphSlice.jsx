import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Swal from 'sweetalert2';

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
        if (res.ok) return res.json();
        else {
          res.json().then((data) => {
            Swal.fire({ title: data.status, text: data.message, icon: 'error' });
          });
        }
      })
      .catch((err) => Swal.fire({ title: 'Error', text: err.message, icon: 'error' }));
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
      if (payload) {
        if (payload?.isConfirmed) {
          // 
        }
        else{
          state.graphData =payload.data;
        }
      }
      state.graphLoading = false;
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
