import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import deleteAPI from '../apiRequests/deleteAPI';
import getAPI from '../apiRequests/getAPI';
import postAPI from '../apiRequests/postAPI';
import putAPI from '../apiRequests/putAPI';

// Fetch get all organizations for create application
export const fetchOrg = createAsyncThunk(
  'applications/fetchOrg',
  async ({ url, token }) => {
    const response = getAPI({ url, token });
    return response;
  },
);

// Fetch get all applications
export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async ({ url, token }) => {
    const response = getAPI({ url, token });
    return response;
  },
);

// Create New app
export const fetchCreateApp = createAsyncThunk(
  'applications/fetchCreateApp',
  async ({ url, token, bodyData }) => {
    const res = postAPI({ url, token, bodyData });
    return res;
  },
);

// Update app
export const fetchUpdateApp = createAsyncThunk(
  'applications/fetchUpdateApp',
  async ({ url, token, bodyData }) => {
    const res = putAPI({ url, token, bodyData });
    return res;
  },
);

// Delete app
export const fetchDeleteApp = createAsyncThunk(
  'applications/fetchDeleteApp',
  async ({ url, token }) => {
    const response = deleteAPI({ url, token });
    return { ...response, message: 'deleted Response' };
  },
);

/// All user states
const initialState = {
  allApplications: {},
  organizationList: {},
  isAppCreated: false,
  isAppUpdated: false,
  isAppDeleted: false,
  isAppLoading: false,
  isDdLoading: false,
};

export const applicationSlice = createSlice({
  name: 'applications',
  initialState,

  reducers: {
    //
  },
  //----------------------\\
  extraReducers: (builder) => {
    // Get all application pending
    builder.addCase(fetchApplications.pending, (state) => {
      state.isAppCreated = false;
      state.isAppDeleted = false;
      state.isAppUpdated = false;
      state.isAppLoading = true;
    });
    // Get all application fulfilled
    builder.addCase(fetchApplications.fulfilled, (state, { payload }) => {
      state.isAppLoading = false;
      if (payload?.items) {
        state.allApplications = payload;
      }
    });

    builder.addCase(fetchApplications.rejected, (state) => {
      state.isAppLoading = false;
    });

    // Create new application
    builder.addCase(fetchCreateApp.pending, (state) => {
      state.isAppLoading = true;
    });

    builder.addCase(fetchCreateApp.fulfilled, (state, { payload }) => {
      state.isAppCreated = true;
      state.isAppLoading = false;
      console.log('App Creating: ', payload);
    });

    builder.addCase(fetchCreateApp.rejected, (state) => {
      state.isAppLoading = false;
    });

    // update application
    builder.addCase(fetchUpdateApp.pending, (state) => {
      state.isAppLoading = true;
    });

    builder.addCase(fetchUpdateApp.fulfilled, (state, { payload }) => {
      state.isAppUpdated = true;
      state.isAppLoading = false;
      console.log('App Updating: ', payload);
    });

    builder.addCase(fetchUpdateApp.rejected, (state) => {
      state.isAppLoading = false;
    });

    // Delete application
    builder.addCase(fetchDeleteApp.pending, (state) => {
      state.isAppLoading = true;
    });

    builder.addCase(fetchDeleteApp.fulfilled, (state, { payload }) => {
      state.isAppDeleted = true;
      state.isAppLoading = false;
      console.log('App Deleting: ', payload);
    });

    builder.addCase(fetchDeleteApp.rejected, (state) => {
      state.isAppLoading = false;
    });

    // Get all organizations for crate applications
    builder.addCase(fetchOrg.pending, (state) => {
      state.isDdLoading = true;
    });
    // Get all organizations for crate applications
    builder.addCase(fetchOrg.fulfilled, (state, { payload }) => {
      state.isDdLoading = false;
      if (payload?.items) {
        state.organizationList = payload;
      }
    });
    // Get all organizations for crate applications
    builder.addCase(fetchOrg.rejected, (state) => {
      state.isDdLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
// export const {  } = applicationSlice.actions;

export default applicationSlice.reducer;
