import { Button, Checkbox } from '@carbon/react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { GoSearch } from 'react-icons/go';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { handleCreateLink, handleLinkType, handleProjectType, handleResourceType, handleTargetData } from '../../Redux/slices/linksSlice';
import UseDataTable from '../Shared/UseDataTable/UseDataTable';
import UseDropdown from '../Shared/UseDropdown/UseDropdown';
import style from './NewLink.module.css';


// Css styles
const { title, sourceContainer, sourceList, sourceProp, linkTypeContainer, targetContainer, projectContainer, dropDownLabel, targetSearchContainer, resourceTypeContainer, searchContainer, inputContainer, searchIcon, searchInput, searchBtn, newLinkTable, emptySearchWarning, saveBtn } = style;

const btnStyle={
  saveBtn:{display: 'block',
    backgroundColor:'#2196f3',
    margin: '10px 0 10px auto',
    borderRadius: '5px'},
  searchBtn:{borderRadius: '0px 5px 5px 0',
    padding: '0 20px',
    backgroundColor: '#2196f3'}
};

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

const NewLink = () => {
  const {targetData, linkType, projectType, resourceType}=useSelector(state=>state.links);
  
  const { register, handleSubmit } = useForm();
  const [searchText, setSearchText] = useState(null);
  const [isChecked, setIsChecked] = useState(null);
  const [displayTableData, setDisplayTableData] = useState([]);
  const [sourceItems, setSourceItems] = useState([]);
  const navigate = useNavigate();
  const dispatch=useDispatch();

  useEffect(() => {
    setDisplayTableData([]);
    const URL = `./${searchText}.json`;
    fetch(URL)
      .then(res => res.json())
      .then(data => setDisplayTableData(data))
      .catch(err => console.log(err));

    fetch('./sourceList.json')
      .then(res => res.json())
      .then(data => setSourceItems(data))
      .catch(err => console.log(err));
  }, [searchText]);

  const handleSearchData = data => {
    setIsChecked(null);
    dispatch(handleTargetData({}));
    setSearchText(data?.searchText);
  };

  const handleLinkTypeChange = ({selectedItem}) => {
    dispatch(handleProjectType(null));
    dispatch(handleResourceType(null));
    dispatch(handleLinkType(selectedItem));
  };

  const targetProjectItems = linkType === 'constrainedBy' ? ['Jet Engine Design (GLIDE)'] : projectItems;
  const targetResourceItems = linkType === 'constrainedBy' ? ['Document (PLM)', 'Part (PLM)'] : resourceItems;

  const handleTargetProject = ({selectedItem}) => {
    dispatch(handleProjectType(selectedItem));
  };

  const handleTargetResource = ({selectedItem}) => {
    dispatch(handleResourceType(selectedItem));
  };
  
  // Selected target data
  const handleSelectedData = (data) => {
    dispatch(handleTargetData(data));
  };

  // Create new link 
  const handleSaveLink = () => {
    if(linkType&&projectType&&resourceType){
      dispatch(handleCreateLink());
      Swal.fire({
        icon: 'success',
        title: 'Link successfully created!',
        timer: 3000
      });
      navigate('/');
    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Link create failed!!! Please fill all the options',
        timer: 3000
      });
    }
  };

  return (
    <div className='mainContainer'>
      <h2 className={title}>New link</h2>

      <div className={sourceContainer}>
        <h5>Source</h5>
        <div className={sourceList}>
          <p className={sourceProp}>Name:</p><p>{sourceItems[0]?.Source}</p>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Type:</p><p>{sourceItems[2]?.Type}</p>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Component:</p><p>{sourceItems[3]?.Component}</p>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Stream:</p><p>{sourceItems[4]?.Stream}</p>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Baseline:</p><p>{sourceItems[5]?.Baseline}</p>
        </div>
      </div>

      <div className={linkTypeContainer}>
        <h5>Link type</h5>
        <UseDropdown onChange={handleLinkTypeChange} items={linkTypeItems} label='Select link type' id='newLink_linkTypes' style={{ width: '180px', borderRadius: '10px' }} />
      </div>

      {/* --- After selected link type ---  */}
      {linkType &&
        <div className={targetContainer}>
          <h5>Target</h5>

          <div className={projectContainer}>
            <p className={dropDownLabel}>Project:</p>
            <UseDropdown items={targetProjectItems} onChange={handleTargetProject} label={'Select project'} id='project-dropdown' style={{ minWidth: '250px' }} />
          </div>

          <div className={targetSearchContainer}>
            <div className={resourceTypeContainer}>
              <p className={dropDownLabel}>Resource type:</p>
              <UseDropdown items={targetResourceItems} onChange={handleTargetResource} label={'Select resource type'} id='resourceType-dropdown' style={{ minWidth: '250px' }} />
            </div>

            <form onSubmit={handleSubmit(handleSearchData)} className={searchContainer}>
              <div className={inputContainer}>
                <GoSearch className={searchIcon} />
                <input className={searchInput} type='text' placeholder='Search by identifier or name' {...register('searchText')} />
              </div>
              <Button size='md' type='submit' style={btnStyle.searchBtn} className={searchBtn}>Search</Button>
            </form>
          </div>

          {
            (searchText && displayTableData[0]) &&
            <div className={newLinkTable}>
              <UseDataTable headers={headers} tableData={displayTableData} isCheckBox={true} isPagination={displayTableData[0] ? true : false} selectedData={handleSelectedData} isChecked={isChecked} setIsChecked={setIsChecked} />
            </div>
          }
          {(searchText && !displayTableData[0]) &&
            <h2 className={emptySearchWarning}>Please search by valid identifier or name</h2>
          }
        </div>
      }
      {targetData?.identifier && <Button onClick={handleSaveLink} size='md' style={btnStyle.saveBtn} className={saveBtn}>Save</Button>}
    </div>
  );
};

export default NewLink;