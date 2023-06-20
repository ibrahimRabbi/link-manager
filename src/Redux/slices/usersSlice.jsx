import { createSlice } from '@reduxjs/toolkit';

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
});

// Action creators are generated for each case reducer function
// export const { } = usersSlice.actions;

export default usersSlice.reducer;
