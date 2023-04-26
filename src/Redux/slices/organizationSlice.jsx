import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import deleteAPI from '../apiRequests/deleteAPI';
import getAPI from '../apiRequests/getAPI';
import postAPI from '../apiRequests/postAPI';
import putAPI from '../apiRequests/putAPI';

// Fetch get all organizations
export const fetchOrganizations = createAsyncThunk(
  'organizations/fetchOrganizations',
  async ({ url, token }) => {
    const response = getAPI({ url, token });
    return response;
  },
);

// Create New organization
export const fetchCreateOrg = createAsyncThunk(
  'organizations/fetchCreateOrg',
  async ({ url, token, bodyData, reset }) => {
    const res = postAPI({ url, token, bodyData, reset });
    return res;
  },
);

// Update organization
export const fetchUpdateOrg = createAsyncThunk(
  'organizations/fetchUpdateOrg',
  async ({ url, token, bodyData, reset }) => {
    const res = putAPI({ url, token, bodyData, reset });
    return res;
  },
);

// Delete organization
export const fetchDeleteOrg = createAsyncThunk(
  'organizations/fetchDeleteOrg',
  async ({ url, token }) => {
    const response = deleteAPI({ url, token });

    return { ...response, message: 'Delete Response' };
  },
);

/// All organization states
const initialState = {
  allOrganizations: {},
  isOrgCreated: false,
  isOrgUpdated: false,
  isOrgDeleted: false,
  isOrgLoading: false,
};

export const organizationSlice = createSlice({
  name: 'organizations',
  initialState,

  reducers: {
    //
  },
  //----------------------\\
  extraReducers: (builder) => {
    // Get all Organization
    builder.addCase(fetchOrganizations.pending, (state) => {
      state.isOrgCreated = false;
      state.isOrgDeleted = false;
      state.isOrgUpdated = false;
      state.isOrgLoading = true;
    });
    builder.addCase(fetchOrganizations.fulfilled, (state, { payload }) => {
      state.isOrgLoading = false;
      if (payload?.items) {
        state.allOrganizations = payload;
      }
    });

    builder.addCase(fetchOrganizations.rejected, (state) => {
      state.isOrgLoading = false;
    });

    // Create new org
    builder.addCase(fetchCreateOrg.pending, (state) => {
      state.isOrgLoading = true;
    });

    builder.addCase(fetchCreateOrg.fulfilled, (state, { payload }) => {
      state.isOrgLoading = false;
      console.log('Org Creating: ', payload);
      state.isOrgCreated = true;
    });

    builder.addCase(fetchCreateOrg.rejected, (state) => {
      state.isOrgLoading = false;
    });

    // Update org
    builder.addCase(fetchUpdateOrg.pending, (state) => {
      state.isOrgLoading = true;
    });

    builder.addCase(fetchUpdateOrg.fulfilled, (state, { payload }) => {
      state.isOrgLoading = false;
      console.log('Org Updating: ', payload);
      state.isOrgUpdated = true;
    });

    builder.addCase(fetchUpdateOrg.rejected, (state) => {
      state.isOrgLoading = false;
    });

    // Delete org
    builder.addCase(fetchDeleteOrg.pending, (state) => {
      state.isOrgLoading = true;
    });

    builder.addCase(fetchDeleteOrg.fulfilled, (state) => {
      state.isOrgDeleted = true;
      state.isOrgLoading = false;
    });

    builder.addCase(fetchDeleteOrg.rejected, (state) => {
      state.isOrgLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
// export const {  } = organizationSlice.actions;

export default organizationSlice.reducer;
