import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import deleteAPI from '../apiRequests/deleteAPI';
import getAPI from '../apiRequests/getAPI';
import { postAPIForm } from '../apiRequests/postAPI';
import putAPI from '../apiRequests/putAPI';

// Fetch get all Pipelines
export const fetchPipelines = createAsyncThunk(
  'pipelines/fetchPipelines',
  async ({ url, token }) => {
    return getAPI({ url, token });
  },
);

// Create New Pipeline
export const fetchCreatePipeline = createAsyncThunk(
  'pipelines/fetchCreatePipeline',
  async ({ url, token, bodyData }) => {
    return postAPIForm({ url, token, bodyData });
  },
);

// Update Pipeline
export const fetchUpdatePipeline = createAsyncThunk(
  'pipelines/fetchUpdatePipeline',
  async ({ url, token, bodyData }) => {
    return putAPI({ url, token, bodyData });
  },
);

// Delete Pipeline
export const fetchDeletePipeline = createAsyncThunk(
  'pipelines/fetchDeletePipeline',
  async ({ url, token }) => {
    const response = deleteAPI({ url, token });
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
