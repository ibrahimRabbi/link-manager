import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allLinks: [],
  targetDataArr:[],
  editLinkData:{},
  linkType:null,
  projectType:null,
  resourceType:null,
};

// UID generator 
function uuid(mask = 'xxyx4xxyxxxyxx') {
  return `${mask}`.replace(/[xy]/g, function(c) {
    let r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

export const linksSlice = createSlice({
  name: 'links',
  initialState,

  reducers: {
    handleCreateLink: (state) => {
      state.allLinks.push({id:uuid(),targetData:state.targetDataArr,linkType:state.linkType, project:state.projectType, resource:state.resourceType,status:'No status',});
      state.linkType =null;
      state.projectType =null;
      state.resourceType =null;
      state.targetDataArr=[];
      state.isLinkEdit=false;
    },

    handleEditLinkData: (state, {payload}) => {
      state.linkType =null;
      state.projectType =null;
      state.resourceType =null;
      state.targetDataArr=payload?.targetData;
      state.editLinkData=payload;
    },

    handleUpdateCreatedLink: (state) => {
      const index=state.allLinks.findIndex(item=>item?.id===state.editLinkData?.id);
      state.allLinks[index]={
        ...state.allLinks[index],
        ...{targetData:state.targetDataArr,linkType:state.linkType?state?.linkType:state.editLinkData?.linkType, project:state.projectType?state.projectType:state.editLinkData?.project, resource:state.resourceType? state.resourceType:state.editLinkData?.resource,}
      };
      state.isLinkEdit=false;
      state.linkType =null;
      state.projectType =null;
      state.resourceType =null;
      state.targetDataArr=[];
    },

    handleTargetDataArr: (state, {payload}) => {
      if(payload){
        const {data, value}=payload;
        if(value?.isChecked){
          state.targetDataArr.push(data);
        }
        else{
          state.targetDataArr=state.targetDataArr.filter(item=>item?.identifier !==value.id);
        }
      }
      else{
        state.targetDataArr=[];
      }
    },

    handleLinkType: (state, {payload}) => {
      state.linkType=payload;
    },

    handleProjectType: (state, {payload}) => {
      state.projectType=payload;
    },

    handleResourceType: (state, {payload}) => {
      state.resourceType=payload;
    },

    handleSetStatus: (state, {payload}) => {
      const link=state.allLinks.find(data=>data?.id=== payload.row?.id);
      link.status=payload.status;
    },

    handleDeleteLink: (state, {payload}) => {
      state.allLinks= state.allLinks.filter(data=>data?.id !== payload?.id);
    },

  },
});

// Action creators are generated for each case reducer function
export const { handleCreateLink, handleEditLinkData, handleTargetDataArr, handleUpdateCreatedLink, handleLinkType, handleProjectType, handleResourceType, handleSetStatus, handleDeleteLink } = linksSlice.actions;

export default linksSlice.reducer;