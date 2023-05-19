import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import deleteAPI from '../apiRequests/deleteAPI';
import getAPI from '../apiRequests/getAPI';
import postAPI from '../apiRequests/postAPI';
import putAPI from '../apiRequests/putAPI';

// Fetch get all associations
export const fetchAssociations = createAsyncThunk(
  'associations/fetchAssociations',
  async ({ url, token }) => {
    const response = getAPI({ url, token });
    console.log('response: ', response);
    return response;
  },
);

// Create New Association
export const fetchCreateAssoc = createAsyncThunk(
  'associations/fetchCreateAssoc',
  async ({ url, token, bodyData, reset }) => {
    const res = postAPI({ url, token, bodyData, reset });
    return res;
  },
);

// Update Association
export const fetchUpdateAssoc = createAsyncThunk(
  'associations/fetchUpdateAssoc',
  async ({ url, token, bodyData, reset }) => {
    const res = putAPI({ url, token, bodyData, reset });
    console.log(res);
    return res;
  },
);

// Delete Association
export const fetchDeleteAssoc = createAsyncThunk(
  'associations/fetchDeleteAssoc',
  async ({ url, token }) => {
    const response = deleteAPI({ url, token });
    return { ...response, message: 'deleted Response' };
  },
);

/// All user states
const initialState = {
  allAssociations: {},
  isAssocCreated: false,
  isAssocUpdated: false,
  isAssocDeleted: false,
  isAssocLoading: false,
};

export const associationSlice = createSlice({
  name: 'associations',
  initialState,

  reducers: {
    //
  },
  //----------------------\\
  extraReducers: (builder) => {
    // Get all Project
    builder.addCase(fetchAssociations.pending, (state) => {
      state.isAssocCreated = false;
      state.isAssocDeleted = false;
      state.isAssocUpdated = false;
      state.isAssocLoading = true;
    });

    builder.addCase(fetchAssociations.fulfilled, (state, { payload }) => {
      state.isAssocLoading = false;
      if (payload?.items) {
        state.allAssociations = payload;
      }
    });
    builder.addCase(fetchAssociations.rejected, (state) => {
      state.isAssocLoading = false;
    });

    // Create new Project
    builder.addCase(fetchCreateAssoc.pending, (state) => {
      state.isAssocLoading = true;
    });

    builder.addCase(fetchCreateAssoc.fulfilled, (state, { payload }) => {
      state.isAssocLoading = false;
      state.isAssocCreated = true;
      console.log('Creating association: ', payload);
    });

    builder.addCase(fetchCreateAssoc.rejected, (state) => {
      state.isAssocLoading = false;
    });

    // Create new Project
    builder.addCase(fetchUpdateAssoc.pending, (state) => {
      state.isAssocLoading = true;
    });

    builder.addCase(fetchUpdateAssoc.fulfilled, (state, { payload }) => {
      state.isAssocLoading = false;
      console.log('Updating association: ', payload);
      state.isAssocUpdated = true;
    });

    builder.addCase(fetchUpdateAssoc.rejected, (state) => {
      state.isAssocLoading = false;
    });

    // Delete Project
    builder.addCase(fetchDeleteAssoc.pending, (state) => {
      state.isAssocLoading = true;
    });

    builder.addCase(fetchDeleteAssoc.fulfilled, (state, { payload }) => {
      state.isAssocLoading = false;
      state.isAssocDeleted = true;
      console.log('Deleting association: ', payload);
    });

    builder.addCase(fetchDeleteAssoc.rejected, (state) => {
      state.isAssocLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
// export const {  } = applicationSlice.actions;

export default associationSlice.reducer;
