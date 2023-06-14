import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import deleteAPI from '../apiRequests/deleteAPI';
import putAPI from '../apiRequests/putAPI';
import postAPI from '../apiRequests/postAPI';
import getAPI from '../apiRequests/getAPI';

// Fetch get Request
export const fetchGetData = createAsyncThunk(
  'crud/fetchGetData',
  async ({ url, token, stateName, message, showNotification }) => {
    const response = await getAPI({ url, token, message, showNotification });

    return { stateName: stateName, response: response };
  },
);

// Fetch POST Request
export const fetchCreateData = createAsyncThunk(
  'crud/fetchCreateData',
  async ({ url, token, bodyData, stateName, message, showNotification }) => {
    const response = await postAPI({ url, token, bodyData, message, showNotification });

    return { stateName: stateName, response: response };
  },
);

// Fetch Update Request
export const fetchUpdateData = createAsyncThunk(
  'crud/fetchUpdateData',
  async ({ url, token, bodyData, stateName, showNotification }) => {
    const res = await putAPI({ url, token, bodyData, showNotification });

    return { stateName: stateName, response: res };
  },
);

// Delete organization
export const fetchDeleteData = createAsyncThunk(
  'crud/fetchDeleteData',
  async ({ url, token, stateName, showNotification }) => {
    const response = await deleteAPI({ url, token, showNotification });
    if (response.status === 204) {
      return { status: 204, message: 'deleted', stateName: stateName };
    }
    return { message: 'Not deleted', stateName: stateName };
  },
);

export const useCRUDSlice = createSlice({
  name: 'crud',
  initialState: {
    crudData: {},
    isCreated: false,
    isUpdated: false,
    isDeleted: false,
    isCrudLoading: false,
  },

  reducers: {
    removeCrudParameter: (state, action) => {
      const paramToRemove = action.payload;
      delete state.crudData[paramToRemove];
    },
  },
  //----------------------\\
  extraReducers: (builder) => {
    // Get all Data
    builder.addCase(fetchGetData.pending, (state) => {
      state.isCreated = false;
      state.isDeleted = false;
      state.isUpdated = false;
      state.isCrudLoading = true;
    });

    builder.addCase(fetchGetData.fulfilled, (state, { payload }) => {
      state.isCrudLoading = false;
      if (payload.response) {
        state.crudData[payload?.stateName] = payload?.response;
      }
    });

    builder.addCase(fetchGetData.rejected, (state) => {
      state.isCrudLoading = false;
    });

    // Create Data
    builder.addCase(fetchCreateData.pending, (state) => {
      state.isCrudLoading = true;
    });

    builder.addCase(fetchCreateData.fulfilled, (state, { payload }) => {
      state.isCrudLoading = false;
      state.isCreated = true;
      console.log('Creating: fulfil', payload);
    });

    builder.addCase(fetchCreateData.rejected, (state) => {
      state.isCrudLoading = false;
    });

    // Update Data
    builder.addCase(fetchUpdateData.pending, (state) => {
      state.isCrudLoading = true;
    });

    builder.addCase(fetchUpdateData.fulfilled, (state, { payload }) => {
      state.isCrudLoading = false;
      state.isUpdated = true;
      console.log('Updating: fulfil', payload);
    });

    builder.addCase(fetchUpdateData.rejected, (state) => {
      state.isCrudLoading = false;
    });

    // Delete Data
    builder.addCase(fetchDeleteData.pending, (state) => {
      state.isCrudLoading = true;
    });

    builder.addCase(fetchDeleteData.fulfilled, (state, { payload }) => {
      state.isCrudLoading = false;
      state.isDeleted = true;
      console.log('Delete: fulfil', payload);
    });

    builder.addCase(fetchDeleteData.rejected, (state) => {
      state.isCrudLoading = false;
    });
  },
});
export const { actions, reducer } = useCRUDSlice;
