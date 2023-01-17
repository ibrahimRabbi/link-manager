import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Swal from 'sweetalert2';

// Fetch Create New link
export const fetchCreateLink = createAsyncThunk(
  'links/fetchCreateLink',
  async ({ url, token, bodyData }) => {
    const res = await fetch(`${url}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(bodyData),
    })
      .then((res) => {
        if (res.ok) {
          return res.json().then((data) => {
            Swal.fire({ title: data.status, text: data.message, icon: 'success' });
            return data;
          });
        } else if (res.status !== 404) {
          res.json().then((data) => {
            Swal.fire({ title: 'Error', text: data.message, icon: 'error' });
          });
        }
      })
      .catch((err) => Swal.fire({ title: 'Error', text: err.message, icon: 'error' }));
    return res;
  },
);

// Fetch all created links for Link manager table
export const fetchLinksData = createAsyncThunk(
  'links/fetchLinksData',
  async ({ url, token }) => {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        authorization: 'Bearer ' + token,
      },
    })
      .then((res) => {
        if (res.ok) {
          if (res.status !== 204) return res.json();
        } else {
          res.json().then((data) => {
            let errorMessage = 'Loading links failed: ';
            if (data && data.message) {
              errorMessage += data.message;
            }
            Swal.fire({ title: 'Error', text: errorMessage, icon: 'error' });
          });
        }
      })
      .catch((err) => Swal.fire({ title: 'Error', text: err.message, icon: 'error' }));
    return res;
  },
);

const initialState = {
  sourceDataList: {},
  isWbe: false,
  oslcResponse: null,
  isLinkCreate: false,
  isLoading: false,
  linkCreateLoading: false,
  allLinks: [],
  linksData: [],
  CLResponse: null,
  editTargetData: {},
  targetDataArr: [],
  linkedData: {},
  editLinkData: {},
  linkType: null,
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

    // created links state update
    handleDisplayLinks: (state, { payload }) => {
      state.allLinks = payload;
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

    handleProjectType: (state, { payload }) => {
      state.projectType = payload;
    },

    handleResourceType: (state, { payload }) => {
      state.resourceType = payload;
    },

    // new link and edit link cancel btn
    handleCancelLink: (state) => {
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
      state.isLoading = true;
    });

    builder.addCase(fetchLinksData.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      if (payload) state.linksData = payload;
      else {
        state.linksData = [];
      }
    });

    // Create new link controller
    builder.addCase(fetchCreateLink.pending, (state) => {
      state.linkCreateLoading = true;
      state.linkType = null;
      state.projectType = null;
      state.resourceType = null;
      state.oslcResponse = false;
      state.targetDataArr = [];
      state.isLinkEdit = false;
    });

    builder.addCase(fetchCreateLink.fulfilled, (state, { payload }) => {
      state.linkCreateLoading = false;
      if (payload) state.CLResponse = payload;
      else {
        state.CLResponse = [];
      }
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
  handleDisplayLinks,
  handleEditLinkData,
  handleTargetDataArr,
  handleEditTargetData,
  handleUpdateCreatedLink,
  handleLinkType,
  handleProjectType,
  handleResourceType,
  handleSetStatus,
  handleDeleteLink,
  handleCancelLink,
} = linksSlice.actions;

export default linksSlice.reducer;
