import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import deleteAPI from '../apiRequests/deleteAPI';
import getAPI from '../apiRequests/getAPI';
import postAPI from '../apiRequests/postAPI';
import putAPI from '../apiRequests/putAPI';

// Fetch get all components
export const fetchComponents = createAsyncThunk(
  'components/fetchComponents',
  async ({ url, token }) => {
    const response = getAPI({ url, token });
    return response;
  },
);

// Create New components
export const fetchCreateComp = createAsyncThunk(
  'components/fetchCreateComp',
  async ({ url, token, bodyData, message }) => {
    const res = postAPI({ url, token, bodyData, message });
    return res;
  },
);

// Update components
export const fetchUpdateComp = createAsyncThunk(
  'components/fetchUpdateComp',
  async ({ url, token, bodyData }) => {
    const res = putAPI({ url, token, bodyData });
    return res;
  },
);

// Delete components
export const fetchDeleteComp = createAsyncThunk(
  'components/fetchDeleteComp',
  async ({ url, token }) => {
    const response = deleteAPI({ url, token });
    return { ...response, message: 'deleted Response' };
  },
);

/// All components states
const initialState = {
  allComponents: {},
  isCompCreated: false,
  isCompUpdated: false,
  isCompDeleted: false,
  isCompLoading: false,
};

export const ComponentsSlice = createSlice({
  name: 'components',
  initialState,

  reducers: {
    //
  },
  //----------------------\\
  extraReducers: (builder) => {
    // Get all components pending
    builder.addCase(fetchComponents.pending, (state) => {
      state.isCompCreated = false;
      state.isCompDeleted = false;
      state.isCompUpdated = false;
      state.isCompLoading = true;
    });
    // Get all components fulfilled
    builder.addCase(fetchComponents.fulfilled, (state, { payload }) => {
      state.isCompLoading = false;
      if (payload?.items) {
        state.allComponents = payload;
      }
    });

    builder.addCase(fetchComponents.rejected, (state) => {
      state.isCompLoading = false;
    });

    // Create new components
    builder.addCase(fetchCreateComp.pending, (state) => {
      state.isCompLoading = true;
    });

    builder.addCase(fetchCreateComp.fulfilled, (state, { payload }) => {
      state.isCompLoading = false;
      console.log('components Creating: ', payload);
      state.isCompCreated = true;
    });

    builder.addCase(fetchCreateComp.rejected, (state) => {
      state.isCompLoading = false;
    });

    // update components
    builder.addCase(fetchUpdateComp.pending, (state) => {
      state.isCompLoading = true;
    });

    builder.addCase(fetchUpdateComp.fulfilled, (state, { payload }) => {
      state.isCompLoading = false;
      console.log('components Updating: ', payload);
      state.isCompUpdated = true;
    });

    builder.addCase(fetchUpdateComp.rejected, (state) => {
      state.isCompLoading = false;
    });

    // Delete components
    builder.addCase(fetchDeleteComp.pending, (state) => {
      state.isCompLoading = true;
    });

    builder.addCase(fetchDeleteComp.fulfilled, (state, { payload }) => {
      state.isCompLoading = false;
      state.isCompDeleted = true;
      console.log('components Deleting: ', payload);
    });

    builder.addCase(fetchDeleteComp.rejected, (state) => {
      state.isCompLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
// export const {  } = applicationSlice.actions;

export default ComponentsSlice.reducer;
