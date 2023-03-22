import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import deleteAPI from '../apiRequests/deleteAPI';
import getAPI from '../apiRequests/getAPI';
import postAPI from '../apiRequests/postAPI';

// Fetch get all applications
export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async ({ url, token }) => {
    const response = getAPI({ url, token });
    return response;
  },
);

// Create New User
export const fetchCreateApp = createAsyncThunk(
  'applications/fetchCreateApp',
  async ({ url, token, bodyData, reset }) => {
    const res = postAPI({ url, token, bodyData, reset });
    return res;
  },
);

// Delete User
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
  isAppCreated: false,
  isAppDeleted: false,
  isAppLoading: false,
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
      state.isAppLoading = true;
    });
    // Get all application fulfilled
    builder.addCase(fetchApplications.fulfilled, (state, { payload }) => {
      state.isAppLoading = false;
      if (payload?.items) {
        // id as string is required in the table
        const items = payload.items?.reduce((acc, curr) => {
          acc.push({ ...curr, id: curr?.id?.toString() });
          return acc;
        }, []);
        state.allApplications = { ...payload, items };
      }
    });
    // Get all users request rejected
    builder.addCase(fetchApplications.rejected, (state) => {
      state.isAppLoading = false;
    });

    // Create new user
    builder.addCase(fetchCreateApp.pending, (state) => {
      state.isAppLoading = true;
    });

    builder.addCase(fetchCreateApp.fulfilled, (state, { payload }) => {
      state.isAppLoading = false;
      console.log('App Creating: ', payload);
      state.isAppCreated = true;
    });

    builder.addCase(fetchCreateApp.rejected, (state) => {
      state.isAppLoading = false;
    });

    // Delete user
    builder.addCase(fetchDeleteApp.pending, (state) => {
      state.isAppLoading = true;
    });

    builder.addCase(fetchDeleteApp.fulfilled, (state, { payload }) => {
      state.isAppLoading = false;
      state.isAppDeleted = true;
      console.log('App Deleting: ', payload);
    });

    builder.addCase(fetchDeleteApp.rejected, (state) => {
      state.isAppLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
// export const {  } = applicationSlice.actions;

export default applicationSlice.reducer;
