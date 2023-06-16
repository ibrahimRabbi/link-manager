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
const CATALOG_INSTANCE_SHAPE = 'https://onto-portal.org/ns/koatl#catalogInstanceShapeUrl';
const PROVIDER_INSTANCE_SHAPE = 'http://open-services.net/ns/core#valueShape';
const RESOURCE_TYPE_TAG = '#resourceType';
const DEFAULT_RESOURCE_TYPE_URL = 'http://open-services.net/ns/core#defaultValue';
const RESOURCE_SHAPE_TAG = '#resourceShape';
const VALUE_SHAPE_URL = 'http://open-services.net/ns/core#valueShape';
const OSLC_ANY_RESOURCE_URI = 'http://open-services.net/ns/core#AnyResource';
const OSLC_VALUE_TYPE_URI = 'http://open-services.net/ns/core#valueType';
const OSLC_DESCRIBES = 'http://open-services.net/ns/core#describes';
// eslint-disable-next-line max-len
const OSLC_PROPERTY_DEFINITION_URI =
  'http://open-services.net/ns/core#propertyDefinition';
const OSLC_NAME_URI = 'http://open-services.net/ns/core#name';
const OSLC_ERROR_MESSAGE = 'http://open-services.net/ns/core#message';

export const fetchOslcResource = createAsyncThunk(
  'oslc/fetchOslcResource',
  async ({ url, token, dialogLabel = null, requestType = null }) => {
    const response = await getOslcAPI({ url, token });
    return { url, response, dialogLabel, requestType };
  },
);

/// All user states
const initialState = {
  rootservicesResponse: '',
  oslcCatalogUrls: [],
  // Parameters for OSLC Catalog instance shape
  oslcCatalogInstanceShapeUrl: null,
  oslcCatalogInstanceShapeResponse: null,
  // Parameters for OSLC ServiceProvider instance shape
  oslcProviderInstanceShapeUrl: null,
  oslcProviderInstanceShapeResponse: null,
  oslcResourceTypes: [],
  oslcResourceShapeUrls: [],
  // Parameters for OSLC Resource Shape provided by the ServiceProvider instance
  oslcResourceShapeResponse: [],
  oslcFoundExternalLinks: [],
  oslcFinishedExternalLinksLoading: false,
  // Parameters for RootServices
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
    finishExternalLinksLoading: (state) => {
      state.oslcFinishedExternalLinksLoading = true;
    },
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
    resetOslcCatalogInstanceShape: (state) => {
      state.oslcCatalogInstanceShapeUrl = null;
      state.oslcCatalogInstanceShapeResponse = null;
    },
    resetOslcProviderInstanceShape: (state) => {
      state.oslcProviderInstanceShapeUrl = null;
      state.oslcProviderInstanceShapeResponse = null;
      state.oslcResourceTypes = [];
      state.oslcResourceShapeUrls = [];
    },
    resetOslcResourceShape: (state) => {
      state.oslcResourceShapeResponse = [];
      state.oslcFoundExternalLinks = [];
      state.oslcFinishedExternalLinksLoading = false;
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
      const { url, response, dialogLabel, requestType } = payload;
      if (requestType === 'oslcCatalogInstanceShape') {
        let providerInstanceShapeUrl = null;
        response.map((item) => {
          if (PROVIDER_INSTANCE_SHAPE in item) {
            providerInstanceShapeUrl = item[PROVIDER_INSTANCE_SHAPE][0]['@id'];
          }
        });
        state.oslcProviderInstanceShapeUrl = providerInstanceShapeUrl;
        state.oslcCatalogInstanceShapeResponse = response;
      } else if (requestType === 'oslcServiceProviderInstanceShape') {
        // eslint-disable-next-line max-len
        const resourceTypeProviderInstance = `${state.oslcProviderInstanceShapeUrl}${RESOURCE_TYPE_TAG}`;
        // eslint-disable-next-line max-len
        const resourceShapeProviderInstance = `${state.oslcProviderInstanceShapeUrl}${RESOURCE_SHAPE_TAG}`;
        let resourceTypes = [];
        let resourceShapeUrls = [];

        response.map((item) => {
          if (resourceTypeProviderInstance === item['@id']) {
            item[DEFAULT_RESOURCE_TYPE_URL]?.map((resourceType) => {
              resourceTypes.push(resourceType['@value']);
            });
          }
          if (resourceShapeProviderInstance === item['@id']) {
            item[VALUE_SHAPE_URL]?.map((resourceShape) => {
              resourceShapeUrls.push(resourceShape['@id']);
            });
          }
        });
        state.oslcProviderInstanceShapeResponse = response;
        state.oslcResourceTypes = resourceTypes;
        state.oslcResourceShapeUrls = resourceShapeUrls;
      } else if (requestType === 'oslcResourceShape') {
        let externalLinks = [];
        let title = null;
        let resourceType = null;

        response.map((item) => {
          if (DCTERMS_TITLE in item) {
            title = item[DCTERMS_TITLE][0]['@value'];
          }
          if (OSLC_DESCRIBES in item) {
            resourceType = item[OSLC_DESCRIBES][0]['@id'];
          }
          if (OSLC_PROPERTY_DEFINITION_URI in item) {
            let linkName = null;
            let linkUrl = null;
            if (OSLC_NAME_URI in item) {
              linkName = item[OSLC_NAME_URI][0]['@value'];
            }
            if (OSLC_VALUE_TYPE_URI in item) {
              if (item[OSLC_VALUE_TYPE_URI][0]['@id'] === OSLC_ANY_RESOURCE_URI) {
                linkUrl = item[OSLC_PROPERTY_DEFINITION_URI][0]['@id'];
              }
              if (!linkName) {
                linkName = item[OSLC_PROPERTY_DEFINITION_URI][0]['@id'];
                linkName = linkName.split('#')[1];
              }
            }
            if (linkName && linkUrl) {
              const newLink = {
                url: linkUrl,
                value: linkName,
              };
              externalLinks.push(newLink);
            }
          }
        });

        const storedResponse = {
          title: title,
          resourceType: resourceType,
          response: response,
        };
        state.oslcResourceShapeResponse = [
          ...state.oslcResourceShapeResponse,
          storedResponse,
        ];
        state.oslcFoundExternalLinks = [
          ...state.oslcFoundExternalLinks,
          {
            title: title,
            resourceType: resourceType,
            links: externalLinks,
          },
        ];
      } else if (response?.length > 0 && url.includes('/rootservices')) {
        let allCatalogs = {};
        let catalogInstanceShapeUrl = null;
        response.map((item) => {
          if (item['@id'].includes('/rootservices')) {
            const foundCatalogs = Object.entries(item).reduce((acc, [key, value]) => {
              if (ROOTSERVICES_CATALOG_TYPES.includes(key)) {
                acc[key] = value[0]['@id'];
              }
              return acc;
            }, {});
            if (CATALOG_INSTANCE_SHAPE in item) {
              catalogInstanceShapeUrl = item[CATALOG_INSTANCE_SHAPE][0]['@id'];
            }
            allCatalogs = { ...allCatalogs, ...foundCatalogs };
          }
          if (STATUS_URL in item) {
            state.userStatusUrl = item[STATUS_URL][0]['@id'];
          }
        });
        state.oslcCatalogInstanceShapeUrl = catalogInstanceShapeUrl;
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
      state.isOslcResourceLoading = false;
      const error = action.error.message;
      if (error[0] === 'UNAUTHORIZED') {
        error[1].map((item) => {
          if (OSLC_ERROR_MESSAGE in item) {
            // eslint-disable-next-line max-len
            if (
              item[OSLC_ERROR_MESSAGE][0]['@value'].includes('invalid_token') ||
              item[OSLC_ERROR_MESSAGE][0]['@value'].includes(
                'access token provided is expired',
              )
            ) {
              state.oslcMissingConsumerToken = true;
            }
            if (item[OSLC_ERROR_MESSAGE][0]['@value'].includes('wrong credentials')) {
              state.oslcUnauthorizedUser = true;
            }
          }
        });
      }
      state.oslcResourceFailed = true;
    });
  },
});

// Action creators are generated for each case reducer function
// export const {  } = applicationSlice.actions;

export const { actions, reducer } = oslcResourceSlice;
