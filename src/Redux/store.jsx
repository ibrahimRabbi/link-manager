import { configureStore } from '@reduxjs/toolkit';
import graphReducer from './slices/graphSlice';
import linksReducer from './slices/linksSlice';
import navReducer from './slices/navSlice';
import usersReducer from './slices/usersSlice';
import organizationsReducer from './slices/organizationSlice';
import applicationsReducer from './slices/applicationSlice';

const store = configureStore({
  reducer: {
    nav: navReducer,
    links: linksReducer,
    graph: graphReducer,
    users: usersReducer,
    organizations: organizationsReducer,
    applications: applicationsReducer,
  },
});
export default store;
