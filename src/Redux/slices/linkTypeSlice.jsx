import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import deleteAPI from '../apiRequests/deleteAPI';
import getAPI from '../apiRequests/getAPI';
import postAPI from '../apiRequests/postAPI';
import putAPI from '../apiRequests/putAPI';

// Fetch get all link type
export const fetchLinkTypes = createAsyncThunk(
  'linkTypes/fetchLinkTypes',
  async ({ url, token }) => {
    const response = getAPI({ url, token });
    return response;
  },
);

// Create Link type
export const fetchCreateLinkType = createAsyncThunk(
  'linkTypes/fetchCreateLinkType',
  async ({ url, token, bodyData, message }) => {
    const res = postAPI({ url, token, bodyData, message });
    return res;
  },
);

// Update Link type
export const fetchUpdateLinkType = createAsyncThunk(
  'linkTypes/fetchUpdateLinkType',
  async ({ url, token, bodyData }) => {
    const res = putAPI({ url, token, bodyData });
    return res;
  },
);

// Delete linkType
export const fetchDeleteLinkType = createAsyncThunk(
  'linkTypes/fetchDeleteLinkType',
  async ({ url, token }) => {
    const response = deleteAPI({ url, token });
    return { ...response, message: 'deleted Response' };
  },
);

/// All link type states
const initialState = {
  allLinkTypes: {},
  isLinkTypeCreated: false,
  isLinkTypeUpdated: false,
  isLinkTypeDeleted: false,
  isLinkTypeLoading: false,

  // states for form data
  selectedLinkTypeCreationMethod: false,
  applicationType: null,
};

export const linkTypeSlice = createSlice({
  name: 'linkTypes',
  initialState,

  reducers: {
    handleApplicationType: (state, { payload }) => {
      state.applicationType = payload;
    },
    resetApplicationType: (state) => {
      state.applicationType = null;
    },
    handleSelectedLinkTypeCreationMethod: (state, { payload }) => {
      state.selectedLinkTypeCreationMethod = payload;
    },
    resetSelectedLinkTypeCreationMethod: (state) => {
      state.selectedLinkTypeCreationMethod = false;
    },
  },
  //----------------------\\
  extraReducers: (builder) => {
    // Get all link type pending
    builder.addCase(fetchLinkTypes.pending, (state) => {
      state.isLinkTypeDeleted = false;
      state.isLinkTypeCreated = false;
      state.isLinkTypeUpdated = false;
      state.isLinkTypeLoading = true;
    });
    // Get all link type fulfilled
    builder.addCase(fetchLinkTypes.fulfilled, (state, { payload }) => {
      state.isLinkTypeLoading = false;
      if (payload?.items) {
        state.allLinkTypes = payload;
      }
    });
    builder.addCase(fetchLinkTypes.rejected, (state) => {
      state.isLinkTypeLoading = false;
    });

    // Create new link type
    builder.addCase(fetchCreateLinkType.pending, (state) => {
      state.isLinkTypeLoading = true;
    });

    builder.addCase(fetchCreateLinkType.fulfilled, (state, { payload }) => {
      state.isLinkTypeLoading = false;
      console.log('link type Creating: ', payload);
      state.isLinkTypeCreated = true;
    });

    builder.addCase(fetchCreateLinkType.rejected, (state) => {
      state.isLinkTypeLoading = false;
    });

    // Update link type
    builder.addCase(fetchUpdateLinkType.pending, (state) => {
      state.isLinkTypeLoading = true;
    });

    builder.addCase(fetchUpdateLinkType.fulfilled, (state, { payload }) => {
      state.isLinkTypeLoading = false;
      console.log('link type Updating: ', payload);
      state.isLinkTypeUpdated = true;
    });

    builder.addCase(fetchUpdateLinkType.rejected, (state) => {
      state.isLinkTypeLoading = false;
    });

    // Delete link type
    builder.addCase(fetchDeleteLinkType.pending, (state) => {
      state.isLinkTypeLoading = true;
    });

    builder.addCase(fetchDeleteLinkType.fulfilled, (state, { payload }) => {
      state.isLinkTypeDeleted = true;
      state.isLinkTypeLoading = false;
      console.log('link type Deleting: ', payload);
    });

    builder.addCase(fetchDeleteLinkType.rejected, (state) => {
      state.isLinkTypeLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const { actions, reducer } = linkTypeSlice;
