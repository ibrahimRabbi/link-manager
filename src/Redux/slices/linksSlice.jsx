import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import getAPI from '../apiRequests/getAPI';
import postAPI from '../apiRequests/postAPI';

// Create New link
export const fetchCreateLink = createAsyncThunk(
  'links/fetchCreateLink',
  async ({ url, token, bodyData }) => {
    const response = postAPI({ url, token, bodyData });
    return response;
  },
);

// Fetch all created links for Link manager table
export const fetchLinksData = createAsyncThunk(
  'links/fetchLinksData',
  async ({ url, token }) => {
    const response = getAPI({ url, token });
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
