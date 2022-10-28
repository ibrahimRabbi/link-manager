import { createSlice } from '@reduxjs/toolkit';
import UniqueID from '../../Components/Shared/UniqueID/UniqueID';

const sources=[
  { Source: 'requirements.txt'},
  { Project: 'Gitlab OSLC API'},
  { Type: 'Gitlab - File'},
  { Component: 'Gitlab component 1'},
  { Stream: 'development'},
  { BaseLine: '78zabc'}
];

const initialState = {
  sourceDataList:[...sources],
  sourceCommit: '',
  isSidebarOpen:false,
  currPageTitle:'',
  loggedInUser:null,
  isProfileOpen:false,
  allLinks: [],
  editTargetData:{},
  targetDataArr:[],
  linkedData:{},
  editLinkData:{},
  linkType:null,
  projectType:null,
  resourceType:null,
};

export const linksSlice = createSlice({
  name: 'links',
  initialState,

  reducers: {
    handleGetCommit: (state, {payload}) => {
      state.sourceCommit=payload;
      state.sourceDataList[0].Source=payload;
    },

    handleIsSidebarOpen: (state, {payload}) => {
      state.isSidebarOpen=payload;
    },

    handleViewLinkDetails: (state, {payload}) => {
      state.linkedData=payload;
    },

    handleLoggedInUser: (state, {payload}) => {
      state.loggedInUser=payload;
    },
    handleIsProfileOpen: (state, {payload}) => {
      state.isProfileOpen=payload;
    },
    handleCurrPageTitle: (state, {payload}) => {
      state.currPageTitle=payload;
    },

    handleCreateLink: (state) => {
      state.targetDataArr?.forEach((item)=>{
        state.allLinks.push({id:UniqueID(),targetData:item,linkType:state.linkType, project:state.projectType, resource:state.resourceType,status:'No status'});
      });
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
      state.editTargetData=payload?.targetData;
      state.editLinkData=payload;
    },

    handleUpdateCreatedLink: (state) => {
      const index=state.allLinks.findIndex(item=>item?.id===state.editLinkData?.id);
      state.allLinks[index]={
        ...state.allLinks[index],
        ...{targetData:state.editTargetData,linkType:state.linkType?state?.linkType:state.editLinkData?.linkType, project:state.projectType?state.projectType:state.editLinkData?.project, resource:state.resourceType? state.resourceType:state.editLinkData?.resource,}
      };
      state.linkType =null;
      state.projectType =null;
      state.resourceType =null;
      state.editTargetData={};
      state.targetDataArr=[];
    },

    handleEditTargetData:(state, {payload})=>{
      state.editTargetData=payload;
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

    // new link and edit link cancel btn
    handleCancelLink: (state) => {
      state.linkType =null;
      state.projectType =null;
      state.resourceType =null;
      state.editTargetData={};
      state.targetDataArr=[];
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
export const {handleGetCommit, handleIsSidebarOpen, handleLoggedInUser, handleCurrPageTitle, handleIsProfileOpen, handleViewLinkDetails, handleCreateLink, handleEditLinkData, handleTargetDataArr,handleEditTargetData, handleUpdateCreatedLink, handleLinkType, handleProjectType, handleResourceType, handleSetStatus, handleDeleteLink, handleCancelLink } = linksSlice.actions;

export default linksSlice.reducer;