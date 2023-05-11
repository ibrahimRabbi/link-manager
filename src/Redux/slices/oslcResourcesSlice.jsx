import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import getOslcAPI from '../oslcRequests/getOslcAPI';

// Fetch get all associations
// eslint-disable-next-line max-len
const ROOTSERVICES_CATALOG_TYPE =
  'http://open-services.net/xmlns/rm/1.0/rmServiceProviders';
const OSLC_CORE = 'http://open-services.net/ns/core#';
const DCTERMS_TITLE = 'http://purl.org/dc/terms/title';
const DCTERMS_IDENTIFIER = 'http://purl.org/dc/terms/identifier';

export const fetchOslcResource = createAsyncThunk(
  'oslc/fetchOslcResource',
  async ({ url, token }) => {
    const response = await getOslcAPI({ url, token });
    return { url, response };
  },
);

/// All user states
const initialState = {
  oslcRootservicesResponse: [],
  oslcRootservicesCatalogResponse: '',
  oslcServiceProviderCatalogResponse: [],
  oslcServiceProviderResponse: [],
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

      // console.log('payload: ', payload);
      const { url, response } = payload;
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
      } else if (response?.length > 0 && url.includes('/provider')) {
        let selectionDialogData = [];
        response.forEach((item) => {
          if (item['@type'][0] === OSLC_CORE + 'Dialog') {
            let resourceType = item[OSLC_CORE + 'resourceType'][0]['@id'];
            let domain = resourceType.split('#')[0];
            console.log('domain: ', domain);
            // console.log('label: ', item[DCTERMS_TITLE][0]['@value']);
            // console.log('value: ', item[OSLC_CORE + 'dialog'][0]['@id']);
            // console.log('height: ', item[OSLC_CORE + 'hintHeight'][0]['@value']);
            // console.log('width: ', item[OSLC_CORE + 'hintWidth'][0]['@value']);
            // console.log('resourceType: ', item[OSLC_CORE + 'resourceType'][0]['@id']);

            selectionDialogData.push({
              value: item[OSLC_CORE + 'dialog'][0]['@id'],
              label: item[DCTERMS_TITLE][0]['@value'],
              height: item[OSLC_CORE + 'hintHeight'][0]['@value'],
              width: item[OSLC_CORE + 'hintWidth'][0]['@value'],
              resourceType: resourceType,
              domain: domain,
            });
          }
        });
        state.oslcServiceProviderResponse = selectionDialogData;
      }
    });
    builder.addCase(fetchOslcResource.rejected, (state) => {
      state.isAssocLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
// export const {  } = applicationSlice.actions;

export default oslcResourceSlice.reducer;
