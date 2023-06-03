import { createSlice } from '@reduxjs/toolkit';

/// All user states
const initialState = {
  isOauth2ModalOpen: false,
};

export const oauth2ModalSlice = createSlice({
  name: 'oauth2Modal',
  initialState,

  reducers: {
    handleIsOauth2ModalOpen: (state, { payload }) => {
      state.isOauth2ModalOpen = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { handleIsOauth2ModalOpen } = oauth2ModalSlice.actions;

export default oauth2ModalSlice.reducer;
