import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import deleteAPI from '../apiRequests/deleteAPI';
import getAPI from '../apiRequests/getAPI';
import postAPI from '../apiRequests/postAPI';
import putAPI from '../apiRequests/putAPI';

// Fetch get all linkConstraint
export const fetchLinkConstraints = createAsyncThunk(
  'linkConstraint/fetchLinkConstraints',
  async ({ url, token }) => {
    const response = getAPI({ url, token });
    return response;
  },
);

// Create New linkConstraint
export const fetchCreateLinkCons = createAsyncThunk(
  'linkConstraint/fetchCreateLinkCons',
  async ({ url, token, bodyData, reset }) => {
    const res = postAPI({ url, token, bodyData, reset });
    return res;
  },
);

// Update linkConstraint
export const fetchUpdateLinkCons = createAsyncThunk(
  'linkConstraint/fetchUpdateLinkCons',
  async ({ url, token, bodyData, reset }) => {
    const res = putAPI({ url, token, bodyData, reset });
    return res;
  },
);

// Delete linkConstraint
export const fetchDeleteLinkCons = createAsyncThunk(
  'linkConstraint/fetchDeleteLinkCons',
  async ({ url, token }) => {
    const response = deleteAPI({ url, token });
    return { ...response, message: 'deleted Response' };
  },
);

/// All linkConstraint states
const initialState = {
  AllLinkCons: {},
  isLinkConsCreated: false,
  isLinkConsUpdated: false,
  isLinkConsDeleted: false,
  isLinkConsLoading: false,
};

export const linkConstraintSlice = createSlice({
  name: 'linkConstraint',
  initialState,

  reducers: {
    //
  },
  //----------------------\\
  extraReducers: (builder) => {
    // Get all linkConstraint pending
    builder.addCase(fetchLinkConstraints.pending, (state) => {
      state.isLinkConsCreated = false;
      state.isLinkConsDeleted = false;
      state.isLinkConsUpdated = false;
      state.isLinkConsLoading = true;
    });
    // Get all linkConstraint fulfilled
    builder.addCase(fetchLinkConstraints.fulfilled, (state, { payload }) => {
      state.isLinkConsLoading = false;
      if (payload?.items) {
        state.AllLinkCons = payload;
      }
    });

    builder.addCase(fetchLinkConstraints.rejected, (state) => {
      state.isLinkConsLoading = false;
    });

    // Create new linkConstraint
    builder.addCase(fetchCreateLinkCons.pending, (state) => {
      state.isLinkConsLoading = true;
    });

    builder.addCase(fetchCreateLinkCons.fulfilled, (state, { payload }) => {
      state.isLinkConsLoading = false;
      console.log('Link Cons Creating: ', payload);
      state.isLinkConsCreated = true;
    });

    builder.addCase(fetchCreateLinkCons.rejected, (state) => {
      state.isLinkConsLoading = false;
    });

    // update linkConstraint
    builder.addCase(fetchUpdateLinkCons.pending, (state) => {
      state.isLinkConsLoading = true;
    });

    builder.addCase(fetchUpdateLinkCons.fulfilled, (state, { payload }) => {
      state.isLinkConsLoading = false;
      console.log('Link cons Updating: ', payload);
      state.isLinkConsUpdated = true;
    });

    builder.addCase(fetchUpdateLinkCons.rejected, (state) => {
      state.isLinkConsLoading = false;
    });

    // Delete linkConstraint
    builder.addCase(fetchDeleteLinkCons.pending, (state) => {
      state.isLinkConsLoading = true;
    });

    builder.addCase(fetchDeleteLinkCons.fulfilled, (state, { payload }) => {
      state.isLinkConsLoading = false;
      state.isLinkConsDeleted = true;
      console.log('Link cons Deleting: ', payload);
    });

    builder.addCase(fetchDeleteLinkCons.rejected, (state) => {
      state.isLinkConsLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
// export const {  } = applicationSlice.actions;

export default linkConstraintSlice.reducer;
