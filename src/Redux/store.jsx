import { configureStore } from '@reduxjs/toolkit';
import linksReducer from './slices/linksSlice';
import navReducer from './slices/navSlice';

const store = configureStore({
  reducer: {
    links: linksReducer,
    nav:navReducer,
  },
});
export default store;