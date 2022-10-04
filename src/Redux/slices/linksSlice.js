import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allLinks: [],
  targetData:{},
  editLinkData:{},
  isLinkEdit:false,
  linkType:null,
  projectType:null,
  resourceType:null,
};

export const linksSlice = createSlice({
  name: 'links',
  initialState,

  reducers: {
    handleCreateLink: (state) => {
      state.allLinks.push({...state.targetData,linkType:state.linkType, project:state.projectType, resource:state.resourceType,status:'No status',});
      state.linkType =null;
      state.projectType =null;
      state.resourceType =null;
      state.targetData={};
      state.isLinkEdit=false;
    },

    handleEditLinkData: (state, {payload}) => {
      state.linkType =null;
      state.projectType =null;
      state.resourceType =null;
      state.targetData={};
      state.isLinkEdit=payload?.value;
      state.editLinkData=payload?.row;
    },

    handleUpdateCreatedLink: (state) => {
      const index=state.allLinks.findIndex(item=>item?.identifier===state.editLinkData?.identifier);
      state.allLinks[index]={
        ...state.allLinks[index],
        ...{...state.targetData,linkType:state.linkType, project:state.projectType, resource:state.resourceType,}
      };
      state.isLinkEdit=false;
      state.linkType =null;
      state.projectType =null;
      state.resourceType =null;
      state.targetData={};
    },

    handleLinkType: (state, {payload}) => {
      state.linkType=payload;
    },

    handleTargetData: (state, {payload}) => {
      state.targetData=payload;
    },

    handleProjectType: (state, {payload}) => {
      state.projectType=payload;
    },

    handleResourceType: (state, {payload}) => {
      state.resourceType=payload;
    },

    handleSetStatus: (state, {payload}) => {
      const link=state.allLinks.find(data=>data?.identifier=== payload.row?.identifier);
      link.status=payload.status;
    },

    handleDeleteLink: (state, {payload}) => {
      state.allLinks= state.allLinks.filter(data=>data.identifier !== payload.identifier);
    },

  },
});

// Action creators are generated for each case reducer function
export const { handleCreateLink, handleEditLinkData, handleUpdateCreatedLink, handleTargetData, handleLinkType, handleProjectType, handleResourceType, handleSetStatus, handleDeleteLink } = linksSlice.actions;

export default linksSlice.reducer;