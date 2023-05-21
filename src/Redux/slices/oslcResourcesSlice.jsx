import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import getOslcAPI from '../oslcRequests/getOslcAPI';

// Fetch get all associations
const ROOTSERVICES_CATALOG_TYPE =
  'http://open-services.net/xmlns/rm/1.0/rmServiceProviders';
const OSLC_CORE = 'http://open-services.net/ns/core#';
const DCTERMS_TITLE = 'http://purl.org/dc/terms/title';
const DCTERMS_IDENTIFIER = 'http://purl.org/dc/terms/identifier';

export const fetchOslcResource = createAsyncThunk(
  'oslc/fetchOslcResource',
  async ({ url, token, dialogLabel = null }) => {
    const response = await getOslcAPI({ url, token });
    return { url, response, dialogLabel };
  },
);

/// All user states
const initialState = {
  oslcRootservicesResponse: [],
  oslcRootservicesCatalogResponse: '',
  oslcServiceProviderCatalogResponse: [],
  oslcServiceProviderResponse: [],
  oslcSelectionDialogResponse: [],
  isOslcResourceLoading: false,
};

export const oslcResourceSlice = createSlice({
  name: 'oslc',
  initialState,

  reducers: {
    //
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
        response.every((item) => {
          if (item['@id'].includes('/rootservices')) {
            if (ROOTSERVICES_CATALOG_TYPE in item) {
              state.oslcRootservicesCatalogResponse =
                item[ROOTSERVICES_CATALOG_TYPE][0]['@id'];
              return true;
            }
          }
        });
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
        state.oslcServiceProviderCatalogResponse = serviceProviders;
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
        state.oslcSelectionDialogResponse = selectionDialogData;
      }
    });
    builder.addCase(fetchOslcResource.rejected, (state) => {
      state.isAssocLoading = false;
    });
    builder.addCase('resetOslcServiceProviderCatalogResponse', (state) => {
      state.oslcServiceProviderCatalogResponse = [];
    });
    builder.addCase('resetOslcServiceProviderResponse', (state) => {
      state.oslcServiceProviderResponse = [];
    });
  },
});

// Action creators are generated for each case reducer function
// export const {  } = applicationSlice.actions;

export const { actions, reducer } = oslcResourceSlice;
