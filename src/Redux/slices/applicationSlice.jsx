import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import deleteAPI from '../apiRequests/deleteAPI';
import getAPI from '../apiRequests/getAPI';
import postAPI from '../apiRequests/postAPI';
import putAPI from '../apiRequests/putAPI';
import getOslcAPI from '../oslcRequests/getOslcAPI.jsx';

const OSLC_PUBLISHER_URL = 'http://open-services.net/ns/core#publisher';
const OSLC_PUBLISHER_ICON = 'http://open-services.net/ns/core#icon';

// Fetch get all applications
export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async ({ url, token }) => {
    const response = await getAPI({ url, token });
    return response;
  },
);

export const fetchApplicationPublisherIcon = createAsyncThunk(
  'applications/fetchApplicationPublisherIcon',
  async ({ applicationData }) => {
    applicationData.map(async (item) => {
      let publisherUrl = null;
      let icon = null;

      if (item.rootservicesUrl) {
        const oslcResponse = await getOslcAPI({
          url: item.rootservicesUrl,
          token: 'dummy',
        });

        if (oslcResponse instanceof Array) {
          oslcResponse.every((item) => {
            if (item[OSLC_PUBLISHER_URL][0]['@id']) {
              publisherUrl = item[OSLC_PUBLISHER_URL][0]['@id'];
              return false;
            }
            return true;
          });
        }
        if (publisherUrl) {
          const publisherResponse = await getOslcAPI({
            url: publisherUrl,
            token: 'dummy',
          });

          publisherResponse.every((item) => {
            if (item[OSLC_PUBLISHER_ICON][0]['@id']) {
              icon = item[OSLC_PUBLISHER_ICON][0]['@id'];
              return false;
            }
            return true;
          });
        }
      }
      item.iconUrl = icon;
    });

    applicationData.map(async (item) => {
      if (!item?.iconUrl) {
        item.iconUrl = null;
      }
    });
    return applicationData;
  },
);

// Create New app
export const fetchCreateApp = createAsyncThunk(
  'applications/fetchCreateApp',
  async ({ url, token, bodyData, message }) => {
    const res = await postAPI({ url, token, bodyData, message });
    return res;
  },
);

// Update app
export const fetchUpdateApp = createAsyncThunk(
  'applications/fetchUpdateApp',
  async ({ url, token, bodyData }) => {
    const res = await putAPI({ url, token, bodyData });
    return res;
  },
);

// Delete app
export const fetchDeleteApp = createAsyncThunk(
  'applications/fetchDeleteApp',
  async ({ url, token }) => {
    const response = await deleteAPI({ url, token });
    return { ...response, message: 'deleted Response' };
  },
);

/// All user states
const initialState = {
  allApplications: {},
  createdApplicationResponse: {},
  isAppCreated: false,
  isAppUpdated: false,
  isAppDeleted: false,
  isAppLoading: false,
  isDdLoading: false,
  isIconDataLoading: false,
  isIconDataLoaded: false,
  iconData: [],
};

export const applicationSlice = createSlice({
  name: 'applications',
  initialState,

  reducers: {
    //
  },
  //----------------------\\
  extraReducers: (builder) => {
    // Get all application pending
    builder.addCase(fetchApplications.pending, (state) => {
      state.isAppCreated = false;
      state.isAppDeleted = false;
      state.isAppUpdated = false;
      state.isAppLoading = true;
    });
    // Get all application fulfilled
    builder.addCase(fetchApplications.fulfilled, (state, { payload }) => {
      state.isAppLoading = false;
      if (payload?.items) {
        state.allApplications = payload;
      }
    });

    builder.addCase(fetchApplications.rejected, (state) => {
      state.isAppLoading = false;
    });

    // Create new application
    builder.addCase(fetchCreateApp.pending, (state) => {
      state.isAppLoading = true;
    });

    builder.addCase(fetchCreateApp.fulfilled, (state, { payload }) => {
      state.isAppCreated = true;
      state.isAppLoading = false;
      console.log('App Creating: ', payload);
    });

    builder.addCase(fetchCreateApp.rejected, (state) => {
      state.isAppLoading = false;
    });

    // update application
    builder.addCase(fetchUpdateApp.pending, (state) => {
      state.isAppLoading = true;
    });

    builder.addCase(fetchUpdateApp.fulfilled, (state, { payload }) => {
      state.isAppUpdated = true;
      state.isAppLoading = false;
      console.log('App Updating: ', payload);
    });

    builder.addCase(fetchUpdateApp.rejected, (state) => {
      state.isAppLoading = false;
    });

    // Delete application
    builder.addCase(fetchDeleteApp.pending, (state) => {
      state.isAppLoading = true;
    });

    builder.addCase(fetchDeleteApp.fulfilled, (state, { payload }) => {
      state.isAppDeleted = true;
      state.isAppLoading = false;
      console.log('App Deleting: ', payload);
    });

    builder.addCase(fetchDeleteApp.rejected, (state) => {
      state.isAppLoading = false;
    });

    // Get application icon
    builder.addCase(fetchApplicationPublisherIcon.pending, (state) => {
      state.isIconDataLoading = true;
    });

    builder.addCase(fetchApplicationPublisherIcon.fulfilled, (state, { payload }) => {
      state.isIconDataLoaded = true;
      state.isIconDataLoading = false;
      console.log('App Icon: ', payload);
      state.iconData = payload;
    });
  },
});

// Action creators are generated for each case reducer function
// export const {  } = applicationSlice.actions;

export default applicationSlice.reducer;
