import { configureStore } from '@reduxjs/toolkit';
import linksReducer from './slices/linksSlice';

const store = configureStore({
  reducer: {
    links: linksReducer,
  },
});
export default store;