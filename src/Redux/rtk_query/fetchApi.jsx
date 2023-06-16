import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const lmApiUrl = process.env.REACT_APP_LM_REST_API_URL;
// Define a service using a base URL and expected endpoints
export const fetchApi = createApi({
  reducerPath: 'fetchApi',
  baseQuery: fetchBaseQuery({
    baseUrl: lmApiUrl,
  }),
  endpoints: (builder) => ({
    // GET Request API
    getApi: builder.query({
      query: ({ url, token }) => ({
        url,
        headers: {
          'Content-type': 'application/json',
          authorization: 'Bearer ' + token,
        },
      }),
    }),

    // POST Request API
    postApi: builder.mutation({
      query: ({ url, token, bodyData }) => ({
        url,
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          authorization: 'Bearer ' + token,
        },
        body: bodyData,
      }),
    }),

    // PUT Request API
    updateApi: builder.mutation({
      query: ({ url, token, bodyData }) => ({
        url,
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          authorization: 'Bearer ' + token,
        },
        body: bodyData,
      }),
    }),

    // DELETE Request API
    deleteApi: builder.mutation({
      query: ({ url, token }) => ({
        url,
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          authorization: 'Bearer ' + token,
        },
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetApiQuery,
  usePostApiMutation,
  useUpdateApiMutation,
  useDeleteApiMutation,
} = fetchApi;
