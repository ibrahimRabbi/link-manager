import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import deleteAPI from '../apiRequests/deleteAPI';
import getAPI from '../apiRequests/getAPI';
import postAPI from '../apiRequests/postAPI';
import putAPI from '../apiRequests/putAPI';

// Fetch get all users
export const fetchUsers = createAsyncThunk('users/fetchUsers', async ({ url, token }) => {
  const response = getAPI({ url, token });
  return response;
});

// Create New User
export const fetchCreateUser = createAsyncThunk(
  'users/fetchCreateUser',
  async ({ url, token, bodyData, reset }) => {
    const res = postAPI({ url, token, bodyData, reset });
    return res;
  },
);

// Update user
export const fetchUpdateUser = createAsyncThunk(
  'users/fetchUpdateUser',
  async ({ url, token, bodyData, reset }) => {
    const res = putAPI({ url, token, bodyData, reset });
    return res;
  },
);

// Delete User
export const fetchDeleteUser = createAsyncThunk(
  'users/fetchDeleteUser',
  async ({ url, token }) => {
    const response = deleteAPI({ url, token });
    console.log(response);
    if (response.status === 204) {
      return { status: 204, message: 'deleted' };
    }
    return { message: 'Not deleted' };
  },
);

/// All user states
const initialState = {
  allUsers: {},
  isUserCreated: false,
  isUserUpdated: false,
  isUserDeleted: false,
  usersLoading: false,
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,

  reducers: {
    //
  },
  //----------------------\\
  extraReducers: (builder) => {
    // Get all users pending
    builder.addCase(fetchUsers.pending, (state) => {
      state.isUserDeleted = false;
      state.isUserCreated = false;
      state.isUserUpdated = false;
      state.usersLoading = true;
    });
    // Get all users fulfilled
    builder.addCase(fetchUsers.fulfilled, (state, { payload }) => {
      state.usersLoading = false;
      if (payload?.items) {
        // id as string is required in the table
        const items = payload.items?.reduce((acc, curr) => {
          acc.push({ ...curr, id: curr?.id?.toString() });
          return acc;
        }, []);
        state.allUsers = { ...payload, items };
      }
    });
    // Get all users request rejected
    builder.addCase(fetchUsers.rejected, (state) => {
      state.usersLoading = false;
    });

    // Create new user
    builder.addCase(fetchCreateUser.pending, (state) => {
      state.usersLoading = true;
    });

    builder.addCase(fetchCreateUser.fulfilled, (state, { payload }) => {
      state.usersLoading = false;
      console.log('User Creating: ', payload);
      state.isUserCreated = true;
    });

    builder.addCase(fetchCreateUser.rejected, (state) => {
      state.usersLoading = false;
    });

    // Update user
    builder.addCase(fetchUpdateUser.pending, (state) => {
      state.usersLoading = true;
    });

    builder.addCase(fetchUpdateUser.fulfilled, (state, { payload }) => {
      state.usersLoading = false;
      console.log('User Updating: ', payload);
      state.isUserUpdated = true;
    });

    builder.addCase(fetchUpdateUser.rejected, (state) => {
      state.usersLoading = false;
    });

    // Delete user
    builder.addCase(fetchDeleteUser.pending, (state) => {
      state.usersLoading = true;
    });

    builder.addCase(fetchDeleteUser.fulfilled, (state) => {
      state.usersLoading = false;
      state.isUserDeleted = true;
    });

    builder.addCase(fetchDeleteUser.rejected, (state) => {
      state.usersLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
// export const { } = usersSlice.actions;

export default usersSlice.reducer;
