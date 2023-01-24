import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Swal from 'sweetalert2';

// Fetch data for show the graph view
export const fetchGraphData = createAsyncThunk(
  'graph/fetchGraphsData',
  async ({ url, token }) => {
    console.time();
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
            Swal.fire({ 
              text: 'No Links Created for this source', 
              icon: 'info' });
          }
        } else {
          res.json().then((data) => {
            let errorMessage = 'Loading graph failed: ';
            if (data && data.message) {
              errorMessage += data.message;
              Swal.fire({ title: 'Error', text: errorMessage, icon: 'error' });
            }
            Swal.fire({ title: 'Error', text: errorMessage, icon: 'error' });
          });
        }
      })
      .catch((err) => Swal.fire({ title: 'Error', text: err.message, icon: 'error' }));
    console.log('graph load time');
    console.timeEnd();
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
      // console.log(payload.data[0].graph);
      if (payload) {
        if (payload?.isConfirmed) {
          // 
        }
        else{
          state.graphData =payload.data[0].graph;
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
