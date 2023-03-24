import { configureStore } from '@reduxjs/toolkit';
import graphReducer from './slices/graphSlice';
import linksReducer from './slices/linksSlice';
import navReducer from './slices/navSlice';
import usersReducer from './slices/usersSlice';
import organizationsReducer from './slices/organizationSlice';
import applicationsReducer from './slices/applicationSlice';
import projectsReducer from './slices/projectSlice';
import linkTypesReducer from './slices/linkTypeSlice';
import linkConsReducer from './slices/linkConstraintSlice';

const store = configureStore({
  reducer: {
    nav: navReducer,
    links: linksReducer,
    graph: graphReducer,
    // admin dashboard reducers
    users: usersReducer,
    organizations: organizationsReducer,
    applications: applicationsReducer,
    projects: projectsReducer,
    linkTypes: linkTypesReducer,
    linkConstraints: linkConsReducer,
  },
});
export default store;
