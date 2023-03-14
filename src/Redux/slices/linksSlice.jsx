import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Swal from 'sweetalert2';

// handle report us message
const handleReportUs = async () => {
  Swal.fire({
    title: 'Sent',
    icon: 'success',
    confirmButtonColor: '#3085d6',
    // eslint-disable-next-line max-len
    text: 'Your message has been sent to our support team who will try to resolve your issue shortly',
  });
};

// reduce duplication code for message
const clientMessages = ({ isErrCatch, error, status, message }) => {
  if (isErrCatch) {
    Swal.fire({
      icon: 'error',
      title: error.message,
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Report us',
      // eslint-disable-next-line max-len
      text: 'Your request failed. Please try to solve this issue or report to us to solve the problem',
    }).then((result) => {
      if (result.isConfirmed) handleReportUs();
    });
  }

  if (status === 400) {
    Swal.fire({
      title: message,
      icon: 'warning',
      // eslint-disable-next-line max-len
      text: 'Please check There is some data missing from the data required to create the link or you can report to us to resolve the issue.',
      showCancelButton: true,
      confirmButtonText: 'Report us',
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) handleReportUs();
    });
  } else if (status === 401) {
    Swal.fire({
      title: message,
      icon: 'question',
      confirmButtonColor: '#3085d6',
      // eslint-disable-next-line max-len
      text: 'Sorry, you do not have access to create links. Please make sure you have permission to create links',
    });
  } else if (status === 500) {
    Swal.fire({
      title: message,
      icon: 'error',
      // eslint-disable-next-line max-len
      text: 'Failed to connect to the server due to some issue please check it or you can report it to us to solve this issue.',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Report us',
    }).then((result) => {
      if (result.isConfirmed) handleReportUs();
    });
  }
};

// Create New link
export const fetchCreateLink = createAsyncThunk(
  'links/fetchCreateLink',
  async ({ url, token, bodyData }) => {
    const response = await fetch(`${url}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(bodyData),
    })
      .then((res) => {
        // console.log(response);
        // const res = {status: 500, ok: false};
        console.log(res);
        if (res.ok) {
          return res.json().then((data) => {
            Swal.fire({
              title: 'Success',
              icon: 'success',
              text: data.message,
              confirmButtonColor: '#3085d6',
            });
            return data;
          });
        } else {
          if (res.status === 304) {
            Swal.fire({
              title: 'Already exists',
              icon: 'info',
              text: `This link is already exists. please select a different source 
              or target and try to create the link again.`,
              confirmButtonColor: '#3085d6',
            });
          } else if (res.status === 400) {
            clientMessages({ status: res.status, message: res.statusText });
          } else if (res.status === 401) {
            clientMessages({ status: res.status, message: res.statusText });
          } else if (res.status === 403) {
            console.log(res.status, res.statusText);
          } else if (res.status === 409) {
            console.log(res.status, res.statusText);
          } else if (res.status === 500) {
            clientMessages({ status: res.status, message: res.statusText });
          }
        }
        // if links not created we need return a value
        return 'Link creating Failed';
      })
      .catch((error) => clientMessages({ isErrCatch: true, error }));
    return response;
  },
);

// Fetch all created links for Link manager table
export const fetchLinksData = createAsyncThunk(
  'links/fetchLinksData',
  async ({ url, token }) => {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        authorization: 'Bearer ' + token,
      },
    })
      .then((res) => {
        if (res.ok) {
          if (res.status !== 204) {
            return res.json();
          } else {
            // Swal.fire({
            //   text: 'No Links Created for this resource',
            //   icon: 'info',
            //   confirmButtonColor: '#3085d6',
            // });
          }
        } else {
          if (res.status === 400) {
            clientMessages({ status: res.status, message: res.statusText });
          } else if (res.status === 401) {
            clientMessages({ status: res.status, message: res.statusText });
          } else if (res.status === 403) {
            console.log(res.status, res.status);
          } else if (res.status === 500) {
            clientMessages({ status: res.status, message: res.statusText });
          }
          // res.json().then((data) => {
          //   let errorMessage = 'Loading links failed: ';
          //   if (data && data.message) {
          //     Swal.fire({ text: data.message, icon: 'info' });
          //   } else {
          //     Swal.fire({ title: 'Error', text: errorMessage, icon: 'error' });
          //   }
          // });
        }
      })
      .catch((error) => clientMessages({ isErrCatch: true, error }));
    return response;
  },
);

const gcmAware = JSON.parse(process.env.REACT_APP_CONFIGURATION_AWARE);

const initialState = {
  isTargetModalOpen: false,
  configuration_aware: gcmAware,
  sourceDataList: {},
  isWbe: false,
  oslcResponse: null,
  isLinkCreate: false,
  isLoading: false,
  linkCreateLoading: false,
  allLinks: [],
  linksData: [],
  createLinkRes: null,
  editTargetData: {},
  targetDataArr: [],
  linkedData: {},
  editLinkData: {},
  linkType: null,
  streamType: null,
  projectType: null,
  resourceType: null,
};

export const linksSlice = createSlice({
  name: 'links',
  initialState,

  reducers: {
    handleIsWbe: (state, { payload }) => {
      state.isWbe = payload;
    },
    handleIsTargetModalOpen: (state, { payload }) => {
      state.isTargetModalOpen = payload;
    },
    handleIsLoading: (state, { payload }) => {
      state.isLoading = payload;
    },

    handleOslcResponse: (state, { payload }) => {
      state.oslcResponse = payload;
    },

    // get sources in wbe
    handleGetSources: (state, { payload }) => {
      state.sourceDataList = payload;
    },

    handleViewLinkDetails: (state, { payload }) => {
      state.linkedData = payload;
    },

    // edit link first step get data
    handleEditLinkData: (state, { payload }) => {
      state.linkType = null;
      state.projectType = null;
      state.resourceType = null;
      state.oslcResponse = false;
      state.editTargetData = payload?.targetData;
      state.editLinkData = payload;
    },

    // edit link
    handleUpdateCreatedLink: (state) => {
      const index = state.allLinks.findIndex(
        (item) => item?.id === state.editLinkData?.id,
      );
      state.allLinks[index] = {
        ...state.allLinks[index],
        ...{
          targetData: state.editTargetData,
          linkType: state.linkType ? state?.linkType : state.editLinkData?.linkType,
          project: state.projectType ? state.projectType : state.editLinkData?.project,
          resource: state.resourceType
            ? state.resourceType
            : state.editLinkData?.resource,
        },
      };
      state.linkType = null;
      state.projectType = null;
      state.resourceType = null;
      state.editTargetData = {};
      state.targetDataArr = [];
    },

    // edit target data
    handleEditTargetData: (state, { payload }) => {
      state.editTargetData = payload;
    },

    // get multiple target data
    handleTargetDataArr: (state, { payload }) => {
      state.targetDataArr = payload;
    },

    handleLinkType: (state, { payload }) => {
      state.linkType = payload;
    },

    handleStreamType: (state, { payload }) => {
      state.streamType = payload;
    },

    handleProjectType: (state, { payload }) => {
      state.projectType = payload;
    },

    handleResourceType: (state, { payload }) => {
      state.resourceType = payload;
    },

    // new link and edit link cancel btn
    handleCancelLink: (state) => {
      state.isTargetModalOpen = false;
      state.linkType = null;
      state.projectType = null;
      state.resourceType = null;
      state.editTargetData = {};
      state.targetDataArr = [];
      state.oslcResponse = null;
    },

    // status update
    handleSetStatus: (state, { payload }) => {
      const id = payload.row?.id;
      localStorage.setItem(
        id,
        JSON.stringify({ ...payload.row, status: payload.status }),
      );
      const link = state.allLinks.find((data) => data?.id === id);
      link.status = payload.status;
    },

    // delete link
    handleDeleteLink: (state, { payload }) => {
      localStorage.removeItem(payload.id);
      state.allLinks = state.allLinks.filter((data) => data?.id !== payload?.id);
    },
  },
  /// Extra Reducers ///
  extraReducers: (builder) => {
    // get all links controller
    builder.addCase(fetchLinksData.pending, (state) => {
      state.createLinkRes = null;
      state.isLoading = true;
    });

    builder.addCase(fetchLinksData.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      console.log('fetchLinksData -> payload', payload);
      if (payload) {
        if (payload?.isConfirmed) state.linksData = [];
        else {
          state.linksData = payload.data.items;
        }
      } else {
        state.linksData = [];
      }
    });

    // Create new link controller
    builder.addCase(fetchCreateLink.pending, (state) => {
      state.linkCreateLoading = true;
      state.oslcResponse = false;
      state.targetDataArr = [];
      state.linkType = null;
      state.streamType = null;
      state.projectType = null;
      state.resourceType = null;
      state.isLinkEdit = false;
    });

    builder.addCase(fetchCreateLink.fulfilled, (state, { payload }) => {
      state.linkCreateLoading = false;
      state.createLinkRes = payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  handleIsWbe,
  handleOslcResponse,
  handleIsLoading,
  handleGetSources,
  handleViewLinkDetails,
  handleEditLinkData,
  handleTargetDataArr,
  handleEditTargetData,
  handleUpdateCreatedLink,
  handleLinkType,
  handleStreamType,
  handleProjectType,
  handleResourceType,
  handleSetStatus,
  handleDeleteLink,
  handleCancelLink,
  handleIsTargetModalOpen,
} = linksSlice.actions;

export default linksSlice.reducer;
