import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import getOslcAPI from '../oslcRequests/getOslcAPI';

// Fetch get all associations
export const ROOTSERVICES_CATALOG_TYPES = [
  'http://open-services.net/xmlns/rm/1.0/rmServiceProviders',
];
const OSLC_CORE = 'http://open-services.net/ns/core#';
const DCTERMS_TITLE = 'http://purl.org/dc/terms/title';
const DCTERMS_IDENTIFIER = 'http://purl.org/dc/terms/identifier';
const STATUS_URL = 'https://onto-portal.org/ns/koatl#userStatus';

export const fetchOslcResource = createAsyncThunk(
  'oslc/fetchOslcResource',
  async ({ url, token, dialogLabel = null }) => {
    console.log('Get oslc resource: ', url, token);
    const response = await getOslcAPI({ url, token });
    return { url, response, dialogLabel };
  },
);

/// All user states
const initialState = {
  rootservicesResponse: '',
  oslcCatalogUrls: [],
  userStatusUrl: '',
  oslcCatalogResponse: [],
  oslcServiceProviderResponse: [],
  oslcSelectionDialogData: [],
  isOslcResourceLoading: false,
  oslcResourceFailed: false,
  oslcUnauthorizedUser: false,
  oslcMissingConsumerToken: false,
};

export const oslcResourceSlice = createSlice({
  name: 'oslc',
  initialState,

  reducers: {
    //
    resetRootservicesResponse: (state) => {
      state.rootservicesResponse = '';
    },
    resetOslcCatalogUrls: (state) => {
      state.oslcCatalogUrls = '';
    },
    resetOslcServiceProviderCatalogResponse: (state) => {
      state.oslcCatalogResponse = [];
    },
    resetOslcServiceProviderResponse: (state) => {
      state.oslcServiceProviderResponse = [];
    },
    resetOslcSelectionDialogData: (state) => {
      state.oslcSelectionDialogData = [];
    },
    resetOslcResourceFailed: (state) => {
      state.oslcResourceFailed = false;
    },
    resetOslcUnauthorizedUser: (state) => {
      state.oslcUnauthorizedUser = false;
    },
    resetOslcMissingConsumerToken: (state) => {
      state.oslcMissingConsumerToken = false;
    },
  },
  //----------------------\\
  extraReducers: (builder) => {
    // Get all Project
    builder.addCase(fetchOslcResource.pending, (state) => {
      state.isOslcResourceLoading = true;
    });

    builder.addCase(fetchOslcResource.fulfilled, (state, { payload }) => {
      state.isOslcResourceLoading = false;

      const { url, response, dialogLabel } = payload;
      if (response?.length > 0 && url.includes('/rootservices')) {
        let allCatalogs = {};
        response.map((item) => {
          if (item['@id'].includes('/rootservices')) {
            const foundCatalogs = Object.entries(item).reduce((acc, [key, value]) => {
              if (ROOTSERVICES_CATALOG_TYPES.includes(key)) {
                acc[key] = value[0]['@id'];
              }
              return acc;
            }, {});
            allCatalogs = { ...allCatalogs, ...foundCatalogs };
          }
          if (STATUS_URL in item) {
            state.userStatusUrl = item[STATUS_URL][0]['@id'];
          }
        });
        state.rootservicesResponse = response;
        state.oslcCatalogUrls = allCatalogs;
      } else if (response?.length > 0 && url.includes('/catalog')) {
        let serviceProviders = [];
        response.forEach((item) => {
          if (item['@type'][0] === OSLC_CORE + 'ServiceProvider') {
            serviceProviders.push({
              label: item[DCTERMS_TITLE][0]['@value'],
              value: item['@id'],
              serviceProviderId: item[DCTERMS_IDENTIFIER][0]['@value'],
            });
          }
        });
        state.oslcCatalogResponse = serviceProviders;
      } else if (response?.length > 0 && url.includes('/provider') && !dialogLabel) {
        let selectionDialogData = [];
        response.forEach((item) => {
          if (item['@type'][0] === OSLC_CORE + 'Dialog') {
            let resourceType = item[OSLC_CORE + 'resourceType'][0]['@id'];
            let domain = resourceType.split('#')[0];

            selectionDialogData.push({
              value: item[OSLC_CORE + 'dialog'][0]['@id'],
              label: item[OSLC_CORE + 'label'][0]['@value'],
              description: item[DCTERMS_TITLE][0]['@value'],
              height: item[OSLC_CORE + 'hintHeight'][0]['@value'],
              width: item[OSLC_CORE + 'hintWidth'][0]['@value'],
              resourceType: resourceType,
              domain: domain,
            });
          }
        });
        state.oslcServiceProviderResponse = selectionDialogData;
      } else if (response?.length > 0 && url.includes('/provider') && dialogLabel) {
        let selectionDialogData = [];
        let serviceProviderTitle = '';

        response.forEach((item) => {
          if (item['@type'][0] === OSLC_CORE + 'ServiceProvider') {
            serviceProviderTitle = item[DCTERMS_TITLE][0]['@value'];
          }

          if (item['@type'][0] === OSLC_CORE + 'Dialog') {
            if (item[OSLC_CORE + 'label'][0]['@value'] === dialogLabel) {
              selectionDialogData.push({
                value: item[OSLC_CORE + 'dialog'][0]['@id'],
                height: item[OSLC_CORE + 'hintHeight'][0]['@value'],
                width: item[OSLC_CORE + 'hintWidth'][0]['@value'],
                serviceProviderTitle: serviceProviderTitle,
              });
            }
          }
        });
        state.oslcSelectionDialogData = selectionDialogData;
      }
    });
    builder.addCase(fetchOslcResource.rejected, (state, action) => {
      const error = action.error.message;
      const consumerTokenExists = action?.meta?.arg?.token;
      state.oslcResourceFailed = true;

      if (consumerTokenExists && error === 'UNAUTHORIZED') {
        state.oslcUnauthorizedUser = true;
      } else {
        state.oslcMissingConsumerToken = true;
      }
    });
  },
});

// Action creators are generated for each case reducer function
// export const {  } = applicationSlice.actions;

export const { actions, reducer } = oslcResourceSlice;
