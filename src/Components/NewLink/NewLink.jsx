import { Button, Checkbox, Search, StructuredListBody, StructuredListCell, StructuredListRow, StructuredListWrapper } from '@carbon/react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { handleCancelLink, handleCreateLink, handleCurrPageTitle, handleLinkType, handleOslcResponse, handleProjectType, handleResourceType, handleTargetDataArr, handleUpdateCreatedLink } from '../../Redux/slices/linksSlice';
import UseDataTable from '../Shared/UseDataTable/UseDataTable';
import UseDropdown from '../Shared/UseDropdown/UseDropdown';
import { btnContainer, dropdownStyle, emptySearchWarning, inputContainer, linkTypeContainer, newLinkTable, searchContainer, searchInput, sourceContainer, sourceProp, sourceValue, targetContainer, targetIframe, targetSearchContainer } from './NewLink.module.scss';

// dropdown items
const linkTypeItems = ['affectedBy', 'implementedBy', 'trackedBy', 'constrainedBy', 'decomposedBy', 'elaboratedBy', 'satisfiedBy'];
const projectItems = ['GCM System - Backend (JIRA)', 'GCM UI - Frontend (JIRA)', 'LIM Link Manager (JIRA)', 'Delivery System (GLIDE)', 'Jet Engine Design (GLIDE)'];
const resourceItems = ['User story', 'Task', 'Epic', 'Bug', 'Improvement'];

// Table header 
const headers = [
  { key: 'identifier', header: 'Identifier' },
  { key: 'name', header: 'Name' },
  { key: 'description', header: 'Description' },
  { key: 'checkbox', header: <Checkbox labelText='' id='' /> }
];

const NewLink = ({ pageTitle: isEditLinkPage }) => {
  const {isWbe, oslcResponse, sourceDataList,allLinks, linkType, projectType, resourceType, editLinkData, targetDataArr, editTargetData } = useSelector(state => state.links);
  const { register, handleSubmit } = useForm();
  const [searchText, setSearchText] = useState(null);
  const [isJiraApp, setIsJiraApp] = useState(false);
  const [isBackJiraApp, setIsBackJiraApp] = useState(false);
  const [displayTableData, setDisplayTableData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(handleCurrPageTitle(isEditLinkPage ? isEditLinkPage : 'New Link'));
  },[]);

  // Get link type 
  useEffect(()=>{
    const origin =sourceDataList?.origin;
    const sourceId = origin === 'https://gitlab.com'? 'gitlab': origin === 'https://github.com'? 'github' : origin === 'https://bitbucket.org' ? 'bitbucket' : 'gitlab';
    console.log(sourceId);
  },[]);

  useEffect(()=>{
    isEditLinkPage?null: dispatch(handleCancelLink());
  },[location?.pathname]);

  
  useEffect(()=>{
    if(projectType) {
      setIsBackJiraApp(projectType?.includes('Backend (JIRA)'));
      setIsJiraApp(projectType?.includes('JIRA'));
    }
  },[projectType]);

  // Edit link options start
  useEffect(() => {
    if (editTargetData?.identifier) {
      const string = editTargetData?.description?.split(' ')[0]?.toLowerCase();
      setSearchText(string === 'document' ? 'document' : string === 'user' ? 'data' : null);
    }
  }, [isEditLinkPage]);
  // Edit link options end

  // search data or document 
  useEffect(() => {
    setDisplayTableData([]);
    // const URL = editTargetData?.identifier ? `../../${searchText}.json` : `../../${searchText}.json`;
    // if(searchText){
    //   fetch(URL)
    //     .then(res => res.json())
    //     .then(data => setDisplayTableData(data))
    //     .catch(() => { });
    // }
  }, [searchText]);

  const handleSearchData = (data) => {
    dispatch(handleTargetDataArr(null));
    fetch('https://192.241.220.34:9443/jts/j_security_check?j_username=koneksys&j_password=koneksys')
      .then(res =>  console.log(res))
      .catch((err) => console.log(err));
    setSearchText(data?.searchText);
  };

  //// Get Selection dialog response data
  window.addEventListener('message', function (event) {
    let message = event.data;
    if(!message.source && !oslcResponse) {
      console.log(oslcResponse);
      console.log(message);
      const response = JSON.parse(message?.substr('oslc-response:'.length));
      const results = response['oslc:results'];
      const targetArray =[];
      for (let i = 0; i < results.length; i++) {
        const label = results[i]['oslc:label'];
        const uri = results[i]['rdf:resource'];
        const type = results[i]['rdf:type'];
        targetArray.push({uri, label});
        dispatch(handleOslcResponse({uri, label, type}));
      }
      dispatch(handleTargetDataArr([...targetArray]));
    }
  }, false);

  useEffect(()=>{
    if(oslcResponse) {
      handleSaveLink();
    }
  },[oslcResponse]);
  
  // Link type dropdown
  const handleLinkTypeChange = ({ selectedItem }) => {
    dispatch(handleProjectType(null));
    dispatch(handleResourceType(null));
    dispatch(handleLinkType(selectedItem));
  };

  const targetProjectItems = linkType === 'constrainedBy' ? ['Jet Engine Design (GLIDE)'] : projectItems;
  const targetResourceItems = linkType === 'constrainedBy' ? ['Document (PLM)', 'Part (PLM)'] : resourceItems;

  // Project type dropdown
  const handleTargetProject = ({ selectedItem }) => {
    dispatch(handleProjectType(selectedItem));
  };

  // Resource type dropdown
  const handleTargetResource = ({ selectedItem }) => {
    dispatch(handleResourceType(selectedItem));
  };

  // Selected target data
  const handleSelectedData = (data, value) => {
    dispatch(handleTargetDataArr({ data, value }));
  };

  // Edit created link
  const handleLinkUpdate = () => {
    dispatch(handleUpdateCreatedLink());
    Swal.fire({
      icon: 'success',
      title: 'Link Updated success!',
      timer: 3000
    });
    isWbe ? navigate('/wbe') : navigate('/');
  };


  // Create Link
  // useEffect(()=>{
  //   console.log('Bearer' + loggedInUser?.token);
  //   fetch('http://lm-api-dev.koneksys.com/api/v1/link', {
  //     method:'POST', 
  //     headers:{
  //       'Content-type':'application/json',
  //       'authorization':'Bearer '+ loggedInUser?.token,
  //     },
  //     body:JSON.stringify({
  //       source_type: 'Requirement',
  //       source_id: '0112',
  //       source_uri: 'http://abc.def',
  //       target_type: 'Story',
  //       target_id: '1122',
  //       target_uri: 'http://xyz.abc',
  //       relation: 'Completed_by'
  //     })
  //   })
  //     .then(res => res.json())
  //     .then((res)=>console.log(res)) 
  //     .catch(err=>console.log(err));
  // },[]);
  // Create new link 
  
  const handleSaveLink = async () => {
    if (linkType && projectType && resourceType) {
      await dispatch(handleCreateLink());
      isWbe ? navigate('/wbe') : navigate('/');
    }
    else if(linkType && projectType && !resourceType) {
      Swal.fire({ icon: 'error', title: 'Link create failed!!! Please fill all the options', timer: 3000 });
    }
  };

  // cancel create link
  const handleCancelOpenedLink = () => {
    dispatch(handleCancelLink());
    isWbe ? navigate('/wbe') : navigate('/');
  };

  return (
    <div className='container'>
      <div className={sourceContainer}>
        <h5>Source</h5>
        <StructuredListWrapper ariaLabel="Structured list">
          <StructuredListBody>
            {
              ['GitLab repository', 'Title', 'ID', ].map((properties, index)=><StructuredListRow key={properties}>
                <StructuredListCell id={sourceProp}>{properties}</StructuredListCell>
                <StructuredListCell id={sourceValue}>{Object.values(sourceDataList)[index]}</StructuredListCell>
              </StructuredListRow>)
            }
          </StructuredListBody>
        </StructuredListWrapper>
      </div>

      <div className={linkTypeContainer}>
        <UseDropdown onChange={handleLinkTypeChange} items={linkTypeItems} title='Link type' selectedValue={editLinkData?.linkType} label={'Select link type'} id='newLink_linkTypes' className={dropdownStyle}/>

        <UseDropdown items={targetProjectItems} onChange={handleTargetProject} title='Target project' selectedValue={editLinkData?.project} label={'Select target project'} id='project-dropdown' className={dropdownStyle}/>
        
        {
          (linkType && projectType || isEditLinkPage) && 
            <UseDropdown items={targetResourceItems} onChange={handleTargetResource}  title='Target resource type' selectedValue={editLinkData?.resource} label={'Select target resource type'} id='resourceType-dropdown' className={dropdownStyle}/>
        }
      </div>

      {/* --- After selected link type ---  */}
      {(linkType && projectType || isEditLinkPage) &&
        <div className={targetContainer}>
          <h5>Target</h5>


          { // Show the selection dialogs
            isJiraApp && <div className={targetIframe}>
              { isBackJiraApp ?
                <div>
                  <iframe src='https://jira-oslc-api-dev.koneksys.com/oslc/provider/selector?provider_id=KGCM#oslc-core-postMessage-1.0' height='550px' width='800px'></iframe>
                </div>
                :
                <div>
                  <iframe src='https://192.241.220.34:9443/rm/pickers/com.ibm.rdm.web.RRCPicker?projectURL=https://192.241.220.34:9443/rm/rm-projects/_VhNr0IEzEeqnsvH-FkjSvQ#oslc-core-postMessage-1.0' height='550px' width='800px'></iframe>
                </div>
              }
              {/*you will receive the information coming from the Selection Dialog*/}
            </div>
          }

          {
            !isJiraApp && 
            <>
              <div className={targetSearchContainer}>
                <form onSubmit={handleSubmit(handleSearchData)} className={searchContainer}>
                  <div className={inputContainer}>
                    <Search
                      id=''
                      labelText=''
                      className={searchInput} 
                      type='text' 
                      placeholder='Search by identifier or name' 
                      {...register('searchText')}
                      size='md'
                    />
                  </div>
                  <Button kind='primary' size='md' type='submit'>Search</Button>
                </form>
              </div>

              {
                (searchText && displayTableData[0] || isEditLinkPage) &&
                 <div className={newLinkTable}>
                   <UseDataTable headers={headers} tableData={displayTableData} isCheckBox={true} isChecked={editLinkData?.targetData?.identifier} editTargetData={editTargetData} isPagination={displayTableData[0] ? true : false} selectedData={handleSelectedData} />
                 </div>
              }
              { (searchText && !displayTableData[0]) && <h2 className={emptySearchWarning}>Please search by valid identifier or name</h2> }
            </>
          }
          
          { !isJiraApp &&
            <>
              {/* new link btn  */}
              {(projectType && resourceType &&  targetDataArr[0] &&!isEditLinkPage) && <div className={btnContainer}>
                <Button kind='secondary' onClick={handleCancelOpenedLink} size='md'>Cancel</Button>
                <Button kind='primary' onClick={handleSaveLink} size='md'>Save</Button>
              </div>}

              {/* edit link btn  */}
              {(isEditLinkPage && editLinkData?.id) && <div className={btnContainer}>
                <Button kind='secondary' onClick={handleCancelOpenedLink} size='md'>Cancel</Button>
                <Button kind='primary' onClick={handleLinkUpdate} size='md'>Save</Button>
              </div>}
            </>
          }


        </div>
      }
      {(allLinks[0] && isWbe) && <div className={'see-btn'}>
        <Button kind='primary' onClick={()=>isWbe ? navigate('/wbe'): navigate('/')} size='md'>See created links</Button>
      </div>}
    </div>
  );
};

export default NewLink;