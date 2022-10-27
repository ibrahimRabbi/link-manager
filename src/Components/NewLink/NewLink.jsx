import { Button, Checkbox, Search } from '@carbon/react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { handleCancelLink, handleCreateLink, handleCurrPageTitle, handleLinkType, handleProjectType, handleResourceType, handleTargetDataArr, handleUpdateCreatedLink } from '../../Redux/slices/linksSlice';
import UseDataTable from '../Shared/UseDataTable/UseDataTable';
import UseDropdown from '../Shared/UseDropdown/UseDropdown';
import { btnContainer, dropDownLabel, dropdownStyle, emptySearchWarning, inputContainer, linkTypeContainer, newLinkTable, projectContainer, resourceTypeContainer, searchContainer, searchInput, sourceContainer, sourceList, sourceProp, targetContainer, targetSearchContainer } from './NewLink.module.scss';

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

const NewLink = ({ pageTitle }) => {
  const { sourceDataList, linkType, targetDataArr, projectType, resourceType, editLinkData, editTargetData } = useSelector(state => state.links);
  const { register, handleSubmit } = useForm();
  const [searchText, setSearchText] = useState(null);
  const [displayTableData, setDisplayTableData] = useState([]);
  const navigate = useNavigate();
  const {pathname}=useLocation();
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(handleCurrPageTitle(pageTitle?pageTitle:'New Link'));
  },[]);

  useEffect(()=>{
    dispatch(handleCancelLink());
  },[pathname]);

  // Edit link options start
  useEffect(() => {
    if (editTargetData?.identifier) {
      const string = editTargetData?.description?.split(' ')[0]?.toLowerCase();
      setSearchText(string === 'document' ? 'document' : string === 'user' ? 'data' : null);
    }
  }, [pageTitle]);
  // Edit link options end

  // search data or document 
  useEffect(() => {
    setDisplayTableData([]);
    const URL = editTargetData?.identifier ? `../../${searchText}.json` : `./../${searchText}.json`;
    fetch(URL)
      .then(res => res.json())
      .then(data => setDisplayTableData(data))
      .catch(() => { });
  }, [searchText]);

  const handleSearchData = data => {
    dispatch(handleTargetDataArr(null));
    setSearchText(data?.searchText);
  };

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
    navigate('/link-manager');
  };

  // Create new link 
  const handleSaveLink = () => {
    if (linkType && projectType && resourceType) {
      dispatch(handleCreateLink());
      Swal.fire({ icon: 'success', title: 'Link successfully created!', timer: 3000 });
      navigate('/link-manager');
    }
    else {
      Swal.fire({ icon: 'error', title: 'Link create failed!!! Please fill all the options', timer: 3000 });
    }
  };

  const handleCancelOpenedLink = () => {
    dispatch(handleCancelLink());
    navigate('/link-manager');
  };

  return (
    <div className='container'>
      <div className={sourceContainer}>
        <h5>Source</h5>
        {sourceDataList?.map((item, i) => <div key={i}
          className={sourceList}>
          <p className={sourceProp}>{Object.keys(item)}</p><p>{Object.values(item)}</p>
        </div>)}
      </div>

      <div className={linkTypeContainer}>
        <h5>Link type</h5>
        <UseDropdown onChange={handleLinkTypeChange} items={linkTypeItems} selectedValue={editLinkData?.linkType} label={'Select link type'} id='newLink_linkTypes' className={dropdownStyle}/>
      </div>

      {/* --- After selected link type ---  */}
      {(linkType || pageTitle) &&
        <div className={targetContainer}>
          <h5>Target</h5>

          <div className={projectContainer}>
            <p className={dropDownLabel}>Project:</p>
            <UseDropdown items={targetProjectItems} onChange={handleTargetProject} selectedValue={editLinkData?.project} label={'Select project'} id='project-dropdown' className={dropdownStyle}/>
          </div>

          <div className={resourceTypeContainer}>
            <p className={dropDownLabel}>Resource type:</p>
            <UseDropdown items={targetResourceItems} onChange={handleTargetResource} selectedValue={editLinkData?.resource} label={'Select resource type'} id='resourceType-dropdown' className={dropdownStyle}/>
          </div>

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
            (searchText && displayTableData[0] || pageTitle) &&
            <div className={newLinkTable}>
              <UseDataTable headers={headers} tableData={displayTableData} isCheckBox={true} isChecked={editLinkData?.targetData?.identifier} editTargetData={editTargetData} isPagination={displayTableData[0] ? true : false} selectedData={handleSelectedData} />
            </div>
          }
          {(searchText && !displayTableData[0]) &&
            <h2 className={emptySearchWarning}>Please search by valid identifier or name</h2>
          }

          {/* new link btn  */}
          {(projectType && resourceType && targetDataArr[0] && !pageTitle) && <div className={btnContainer}>
            <Button kind='secondary' onClick={handleCancelOpenedLink} size='md'>Cancel</Button>
            <Button kind='primary' onClick={handleSaveLink} size='md'>Save</Button>
          </div>}

          {/* edit link btn  */}
          {(pageTitle && editLinkData?.id) && <div className={btnContainer}>
            <Button kind='secondary' onClick={handleCancelOpenedLink} size='md'>Cancel</Button>
            <Button kind='primary' onClick={handleLinkUpdate} size='md'>Save</Button>
          </div>}
        </div>
      }
    </div>
  );
};

export default NewLink;