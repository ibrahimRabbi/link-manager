import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import getAPI from '../apiRequests/getAPI.jsx';

export const fetchPipelineRun = createAsyncThunk(
  'pipelineRun/fetchPipelineRun',
  async ({ url, token, authCtx }) => {
    return getAPI({ url, token, authCtx });
  },
);

const initialState = {
  allPipelineRun: {},
  isPipelineRunLoading: false,
};

export const PipelineRunSlice = createSlice({
  name: 'pipelineRun',
  initialState,
  recuders: {
    //
  },
  extraReducers: (builder) => {
    // Get all Pipeline Run pending
    builder.addCase(fetchPipelineRun.pending, (state) => {
      state.isPipelineRunLoading = true;
    });
    // Get all Pipelines fulfilled
    builder.addCase(fetchPipelineRun.fulfilled, (state, { payload }) => {
      state.isPipelineRunLoading = false;
      if (payload?.items) {
        state.allPipelineRun = payload;
      }
    });

    builder.addCase(fetchPipelineRun.rejected, (state) => {
      state.isPipelineRunLoading = false;
    });
  },
});

export default PipelineRunSlice.reducer;
