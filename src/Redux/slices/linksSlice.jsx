import { createSlice } from '@reduxjs/toolkit';
import Swal from 'sweetalert2';
import UniqueID from '../../Components/Shared/UniqueID/UniqueID';
import useSessionStorage from '../../Components/Shared/UseSessionStorage/UseSessionStorage';

const initialState = {
  sourceDataList:{},
  isWbe:false,
  isLinkCreate:false,
  oslcResponse: null,
  isSidebarOpen:false,
  currPageTitle:'',
  isLoading:false,
  loggedInUser: {},
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
    handleIsWbe: (state, {payload}) => {
      state.isWbe=payload;
    },
    handleIsLoading: (state, {payload}) => {
      state.isLoading=payload;
    },

    // get sources in wbe
    handleGetSources: (state, {payload}) => {
      state.sourceDataList =payload;
    },

    handleIsSidebarOpen: (state, {payload}) => {
      state.isSidebarOpen=payload;
    },

    handleViewLinkDetails: (state, {payload}) => {
      state.linkedData=payload;
    },

    handleOslcResponse: (state, {payload}) => {
      state.oslcResponse=payload;
    },

    handleLoggedInUser: (state, {payload}) => {      
      state.loggedInUser=payload;
      
      if(!payload) {
        useSessionStorage('remove', 'token');
      }
    },

    handleIsProfileOpen: (state, {payload}) => {
      state.isProfileOpen=payload;
    },
    
    handleCurrPageTitle: (state, {payload}) => {
      state.currPageTitle=payload;
    },

    // create links and store data in the local storage
    handleCreateLink: (state) => {
      if(state.linkType && state.projectType && state.resourceType){
        state.targetDataArr?.forEach((item)=>{
          const linkId= UniqueID();
          const newLinkData ={id:linkId,sources:state.sourceDataList, linkType:state.linkType, targetProject:state.projectType, targetResource:state.resourceType, targetData: item, status:'No status'};
          localStorage.setItem(String(linkId), JSON.stringify(newLinkData));
        });
        
        Swal.fire({ icon: 'success', title: 'Link successfully created!', timer: 3000 });
        state.linkType =null;
        state.projectType =null;
        state.resourceType =null;
        state.oslcResponse = null;
        state.targetDataArr=[];
        state.isLinkEdit=false;
      }
    },

    // created links state update
    handleDisplayLinks: (state, {payload}) => {
      state.allLinks=payload;
    },

    // edit link first step get data
    handleEditLinkData: (state, {payload}) => {
      state.linkType =null;
      state.projectType =null;
      state.resourceType =null;
      state.oslcResponse =null;
      state.editTargetData=payload?.targetData;
      state.editLinkData=payload;
    },

    // edit link
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

    // edit target data
    handleEditTargetData:(state, {payload})=>{
      state.editTargetData=payload;
    },

    // get multiple target data
    handleTargetDataArr: (state, {payload}) => {
      // if(payload){
      //   const {data, value}=payload;
      //   if(value?.isChecked){
      //     state.targetDataArr.push(data);
      //   }
      //   else{
      //     state.targetDataArr=state.targetDataArr.filter(item=>item?.identifier !==value.id);
      //   }
      // }
      // else{
      //   state.targetDataArr=[];
      // }
      state.targetDataArr = payload;
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
      state.oslcResponse = null;
    },

    // status update 
    handleSetStatus: (state, {payload}) => {
      const id=payload.row?.id;
      localStorage.setItem(id, JSON.stringify({...payload.row, status:payload.status}));
      const link=state.allLinks.find(data=>data?.id=== id);
      link.status=payload.status;
    },

    // delete link
    handleDeleteLink: (state, {payload}) => {
      localStorage.removeItem(payload.id);
      state.allLinks= state.allLinks.filter(data=>data?.id !== payload?.id);
    },
  },
});

// Action creators are generated for each case reducer function
export const {handleIsWbe, handleIsLoading, handleGetSources, handleOslcResponse, handleIsSidebarOpen, handleLoggedInUser, handleCurrPageTitle, handleIsProfileOpen, handleViewLinkDetails, handleCreateLink, handleDisplayLinks, handleEditLinkData, handleTargetDataArr, handleEditTargetData, handleUpdateCreatedLink, handleLinkType, handleProjectType, handleResourceType, handleSetStatus, handleDeleteLink, handleCancelLink } = linksSlice.actions;

export default linksSlice.reducer;