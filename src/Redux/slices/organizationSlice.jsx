import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import deleteAPI from '../apiRequests/deleteAPI';
import getAPI from '../apiRequests/getAPI';
import postAPI from '../apiRequests/postAPI';

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
  'users/fetchCreateOrg',
  async ({ url, token, bodyData, reset }) => {
    const res = postAPI({ url, token, bodyData, reset });
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
    // Get all users pending
    builder.addCase(fetchOrganizations.pending, (state) => {
      state.isOrgCreated = false;
      state.isOrgDeleted = false;
      state.isOrgLoading = true;
    });
    // Get all users fulfilled
    builder.addCase(fetchOrganizations.fulfilled, (state, { payload }) => {
      state.isOrgLoading = false;
      if (payload?.items) {
        // id as string is required in the table
        const items = payload.items?.reduce((acc, curr) => {
          acc.push({
            ...curr,
            id: curr?.id?.toString(),
            // active: curr?.active?.toString(),
          });
          return acc;
        }, []);
        state.allOrganizations = { ...payload, items };
      }
    });
    // Get all users request rejected
    builder.addCase(fetchOrganizations.rejected, (state) => {
      state.isOrgLoading = false;
    });

    // Create new user
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

    // Delete user
    builder.addCase(fetchDeleteOrg.pending, (state) => {
      state.isOrgLoading = true;
    });

    builder.addCase(fetchDeleteOrg.fulfilled, (state) => {
      state.isOrgLoading = false;
      state.isOrgDeleted = true;
    });

    builder.addCase(fetchDeleteOrg.rejected, (state) => {
      state.isOrgLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
// export const {  } = organizationSlice.actions;

export default organizationSlice.reducer;
