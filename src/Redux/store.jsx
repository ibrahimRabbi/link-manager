import { configureStore } from '@reduxjs/toolkit';
import graphReducer from './slices/graphSlice';
import linksReducer from './slices/linksSlice';
import navReducer from './slices/navSlice';

const store = configureStore({
  reducer: {
    links: linksReducer,
    nav:navReducer,
    graph:graphReducer,
  },
});
export default store;
