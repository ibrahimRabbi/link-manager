import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isGraphDashboardDisplay: true,
  isTreeviewTableDisplay: true,
};

export const featureFlagSlice = createSlice({
  name: 'featureFlag',
  initialState,

  reducers: {},
});

// Action creators are generated for each case reducer function
export const actions = featureFlagSlice.actions;

export default featureFlagSlice.reducer;
