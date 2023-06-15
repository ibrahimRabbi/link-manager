import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import deleteAPI from '../apiRequests/deleteAPI';
import getAPI from '../apiRequests/getAPI';
import { postAPIForm } from '../apiRequests/postAPI';
import { putAPIForm } from '../apiRequests/putAPI';

// Fetch get all Pipelines
export const fetchPipelines = createAsyncThunk(
  'pipelines/fetchPipelines',
  async ({ url, token, authCtx, showNotification }) => {
    return getAPI({ url, token, authCtx, showNotification });
  },
);

// Create New Pipeline
export const fetchCreatePipeline = createAsyncThunk(
  'pipelines/fetchCreatePipeline',
  async ({ url, token, bodyData, showNotification }) => {
    return postAPIForm({ url, token, bodyData, showNotification });
  },
);

// Update Pipeline
export const fetchUpdatePipeline = createAsyncThunk(
  'pipelines/fetchUpdatePipeline',
  async ({ url, token, bodyData, showNotification }) => {
    return putAPIForm({ url, token, bodyData, showNotification });
  },
);

// Delete Pipeline
export const fetchDeletePipeline = createAsyncThunk(
  'pipelines/fetchDeletePipeline',
  async ({ url, token, showNotification }) => {
    const response = deleteAPI({ url, token, showNotification });
    return { ...response, message: 'deleted Response' };
  },
);

/// All Pipelines states
const initialState = {
  allPipelines: {},
  isPipelineCreated: false,
  isPipelineUpdated: false,
  isPipelineDeleted: false,
  isPipelineLoading: false,
};

export const PipelineSlice = createSlice({
  name: 'pipeline',
  initialState,

  reducers: {
    //
  },
  //----------------------\\
  extraReducers: (builder) => {
    // Get all Pipelines pending
    builder.addCase(fetchPipelines.pending, (state) => {
      state.isPipelineCreated = false;
      state.isPipelineDeleted = false;
      state.isPipelineUpdated = false;
      state.isPipelineLoading = true;
    });
    // Get all Pipelines fulfilled
    builder.addCase(fetchPipelines.fulfilled, (state, { payload }) => {
      state.isPipelineLoading = false;
      if (payload?.items) {
        state.allPipelines = payload;
      }
    });

    builder.addCase(fetchPipelines.rejected, (state) => {
      state.isPipelineLoading = false;
    });

    // Create new Pipelines
    builder.addCase(fetchCreatePipeline.pending, (state) => {
      state.isPipelineLoading = true;
    });

    builder.addCase(fetchCreatePipeline.fulfilled, (state, { payload }) => {
      state.isPipelineLoading = false;
      console.log('Pipelines Creating: ', payload);
      state.isPipelineCreated = true;
    });

    builder.addCase(fetchCreatePipeline.rejected, (state) => {
      state.isPipelineLoading = false;
    });

    // update Pipelines
    builder.addCase(fetchUpdatePipeline.pending, (state) => {
      state.isPipelineLoading = true;
    });

    builder.addCase(fetchUpdatePipeline.fulfilled, (state, { payload }) => {
      state.isPipelineLoading = false;
      console.log('Pipelines Updating: ', payload);
      state.isPipelineUpdated = true;
    });

    builder.addCase(fetchUpdatePipeline.rejected, (state) => {
      state.isPipelineLoading = false;
    });

    // Delete Pipelines
    builder.addCase(fetchDeletePipeline.pending, (state) => {
      state.isPipelineLoading = true;
    });

    builder.addCase(fetchDeletePipeline.fulfilled, (state, { payload }) => {
      state.isPipelineLoading = false;
      state.isPipelineDeleted = true;
      console.log('Pipelines Deleting: ', payload);
    });

    builder.addCase(fetchDeletePipeline.rejected, (state) => {
      state.isPipelineLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
// export const {  } = applicationSlice.actions;

export default PipelineSlice.reducer;
