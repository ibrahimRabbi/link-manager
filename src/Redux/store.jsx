import { configureStore } from '@reduxjs/toolkit';
import graphReducer from './slices/graphSlice';
import linksReducer from './slices/linksSlice';
import navReducer from './slices/navSlice';
import usersReducer from './slices/usersSlice';
import organizationsReducer from './slices/organizationSlice';
import applicationsReducer from './slices/applicationSlice';
import associationsReducer from './slices/associationSlice';
import projectsReducer from './slices/projectSlice';
import linkTypesReducer from './slices/linkTypeSlice';
import linkConsReducer from './slices/linkConstraintSlice';
import componentsReducer from './slices/componentSlice';
import eventReducer from './slices/eventSlice';
import pipelineReducer from './slices/pipelineSlice';
import useCRUDReducer from './slices/useCRUDSlice';
import { reducer as oslcResourceReducer } from './slices/oslcResourcesSlice';
import oauth2ModalReducer from './slices/oauth2ModalSlice';
import * as Sentry from '@sentry/react';

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  // Optionally pass options listed below
  actionTransformer: (action) => {
    if (action.type === 'GOVERNMENT_SECRETS') {
      // Return null to not log the action to Sentry
      return null;
    }
    if (action.type === 'SET_PASSWORD') {
      // Return a transformed action to remove sensitive information
      return {
        ...action,
        password: null,
      };
    }

    return action;
  },
});

const store = configureStore({
  reducer: {
    nav: navReducer,
    links: linksReducer,
    graph: graphReducer,
    // admin dashboard reducers
    crud: useCRUDReducer,
    users: usersReducer,
    organizations: organizationsReducer,
    applications: applicationsReducer,
    associations: associationsReducer,
    oslcResources: oslcResourceReducer,
    projects: projectsReducer,
    linkTypes: linkTypesReducer,
    linkConstraints: linkConsReducer,
    components: componentsReducer,
    events: eventReducer,
    pipelines: pipelineReducer,
    oauth2Modal: oauth2ModalReducer,
  },
  sentryReduxEnhancer,
});
export default store;
