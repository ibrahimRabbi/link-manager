import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import getOslcAPI from '../oslcRequests/getOslcAPI';

// Fetch get all associations
// eslint-disable-next-line max-len
const ROOTSERVICES_CATALOG_TYPE =
  'http://open-services.net/xmlns/rm/1.0/rmServiceProviders';
const SERVICE_PROVIDER_TYPE = 'http://open-services.net/ns/core#ServiceProvider';
const DCTERMS_TITLE = 'http://purl.org/dc/terms/title';

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
              // console.log('state about catalog: ',
              //   state.oslcRootservicesCatalogResponse);
              return true;
            }
          }
        });
      } else if (response?.length > 0 && url.includes('/catalog')) {
        let serviceProviders = [];
        response.forEach((item) => {
          console.log('item: ', item['@type'][0]);
          if (item['@type'][0] === SERVICE_PROVIDER_TYPE) {
            serviceProviders.push({
              label: item[DCTERMS_TITLE][0]['@value'],
              value: item['@id'],
            });
          }
        });
        state.oslcServiceProviderCatalogResponse = serviceProviders;
      } else if (response?.length > 0 && url.includes('/provider')) {
        state.oslcServiceProviderResponse = response;
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
