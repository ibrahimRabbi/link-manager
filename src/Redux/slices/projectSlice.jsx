import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import deleteAPI from '../apiRequests/deleteAPI';
import getAPI from '../apiRequests/getAPI';
import postAPI from '../apiRequests/postAPI';
import putAPI from '../apiRequests/putAPI';

// Fetch get all projects
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async ({ url, token }) => {
    const response = getAPI({ url, token });
    return response;
  },
);

// Create New project
export const fetchCreateProj = createAsyncThunk(
  'projects/fetchCreateProj',
  async ({ url, token, bodyData, reset }) => {
    const res = postAPI({ url, token, bodyData, reset });
    return res;
  },
);

// Update Project
export const fetchUpdateProj = createAsyncThunk(
  'projects/fetchUpdateProj',
  async ({ url, token, bodyData, reset }) => {
    const res = putAPI({ url, token, bodyData, reset });
    console.log(res);
    return res;
  },
);

// Delete User
export const fetchDeleteProj = createAsyncThunk(
  'projects/fetchDeleteProj',
  async ({ url, token }) => {
    const response = deleteAPI({ url, token });
    return { ...response, message: 'deleted Response' };
  },
);

/// All user states
const initialState = {
  allProjects: {},
  isProjCreated: false,
  isProjUpdated: false,
  isProjDeleted: false,
  isProjLoading: false,
};

export const projectSlice = createSlice({
  name: 'projects',
  initialState,

  reducers: {
    //
  },
  //----------------------\\
  extraReducers: (builder) => {
    // Get all Project
    builder.addCase(fetchProjects.pending, (state) => {
      state.isProjCreated = false;
      state.isProjDeleted = false;
      state.isProjLoading = true;
      state.isProjUpdated = false;
    });

    builder.addCase(fetchProjects.fulfilled, (state, { payload }) => {
      state.isProjLoading = false;
      if (payload?.items) {
        state.allProjects = payload;
      }
    });
    builder.addCase(fetchProjects.rejected, (state) => {
      state.isProjLoading = false;
    });

    // Create new Project
    builder.addCase(fetchCreateProj.pending, (state) => {
      state.isProjLoading = true;
    });

    builder.addCase(fetchCreateProj.fulfilled, (state, { payload }) => {
      state.isProjLoading = false;
      console.log('Project Creating: ', payload);
      state.isProjCreated = true;
    });

    builder.addCase(fetchCreateProj.rejected, (state) => {
      state.isProjLoading = false;
    });

    // Create new Project
    builder.addCase(fetchUpdateProj.pending, (state) => {
      state.isProjLoading = true;
    });

    builder.addCase(fetchUpdateProj.fulfilled, (state, { payload }) => {
      state.isProjLoading = false;
      console.log('Project Updating: ', payload);
      state.isProjUpdated = true;
    });

    builder.addCase(fetchUpdateProj.rejected, (state) => {
      state.isProjLoading = false;
    });

    // Delete Project
    builder.addCase(fetchDeleteProj.pending, (state) => {
      state.isProjLoading = true;
    });

    builder.addCase(fetchDeleteProj.fulfilled, (state, { payload }) => {
      state.isProjLoading = false;
      state.isProjDeleted = true;
      console.log('App Deleting: ', payload);
    });

    builder.addCase(fetchDeleteProj.rejected, (state) => {
      state.isProjLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
// export const {  } = applicationSlice.actions;

export default projectSlice.reducer;
