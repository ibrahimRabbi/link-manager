import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import getAPI, { deleteAPI, putAPI, saveResource } from '../apiRequests/API';

// Fetch get all associations
export const fetchAssociations = createAsyncThunk(
  'associations/fetchAssociations',
  async ({ url, token, showNotification }) => {
    const response = getAPI({ url, token, showNotification });
    return response;
  },
);

// Create New Association
export const fetchCreateAssoc = createAsyncThunk(
  'associations/fetchCreateAssoc',
  async ({ url, token, bodyData, reset, showNotification }) => {
    const res = await saveResource({ url, token, bodyData, reset, showNotification });
    return res;
  },
);

// Update Association
export const fetchUpdateAssoc = createAsyncThunk(
  'associations/fetchUpdateAssoc',
  async ({ url, token, bodyData, reset, showNotification }) => {
    const res = putAPI({ url, token, bodyData, reset, showNotification });
    return res;
  },
);

// Delete Association
export const fetchDeleteAssoc = createAsyncThunk(
  'associations/fetchDeleteAssoc',
  async ({ url, token, showNotification }) => {
    const response = await deleteAPI({ url, token, showNotification });
    return { ...response, message: 'deleted Response' };
  },
);

/// All user states
const initialState = {
  allAssociations: {},
  applicationsForDropdown: [],
  consumerTokens: {},
  isAssocCreated: false,
  isAssocUpdated: false,
  isAssocDeleted: false,
  isAssocLoading: false,
};

export const associationSlice = createSlice({
  name: 'associations',
  initialState,

  reducers: {
    handleStoreApplications: (state, { payload }) => {
      state.applicationsForDropdown = payload;
    },
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
        const mergeData = payload?.items?.reduce((accumulator, value) => {
          const newValue = {
            ...value,
            project_name: value?.project?.name,
            application_name: value?.application?.name,
            organization_id: value?.application?.organization_id,
          };
          accumulator.push(newValue);
          return accumulator;
        }, []);
        state.allAssociations = { ...payload, items: mergeData };
        state.isAssocLoading = false;
      }
    });

    builder.addCase(fetchAssociations.rejected, (state) => {
      state.isAssocLoading = false;
    });

    // Create new Project
    builder.addCase(fetchCreateAssoc.pending, (state) => {
      state.isAssocLoading = true;
    });

    builder.addCase(fetchCreateAssoc.fulfilled, (state) => {
      state.isAssocLoading = false;
      state.isAssocCreated = true;
    });

    builder.addCase(fetchCreateAssoc.rejected, (state) => {
      state.isAssocLoading = false;
    });

    // Create new Project
    builder.addCase(fetchUpdateAssoc.pending, (state) => {
      state.isAssocLoading = true;
    });

    builder.addCase(fetchUpdateAssoc.fulfilled, (state) => {
      state.isAssocLoading = false;
      state.isAssocUpdated = true;
    });

    builder.addCase(fetchUpdateAssoc.rejected, (state) => {
      state.isAssocLoading = false;
    });

    // Delete Project
    builder.addCase(fetchDeleteAssoc.pending, (state) => {
      state.isAssocLoading = true;
    });

    builder.addCase(fetchDeleteAssoc.fulfilled, (state) => {
      state.isAssocLoading = false;
      state.isAssocDeleted = true;
    });

    builder.addCase(fetchDeleteAssoc.rejected, (state) => {
      state.isAssocLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const { handleStoreApplications } = associationSlice.actions;

export default associationSlice.reducer;
