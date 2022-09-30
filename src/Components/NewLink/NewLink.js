import { Button, Checkbox } from '@carbon/react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { GoSearch } from 'react-icons/go';
import UseDataTable from '../Shared/UseDataTable/UseDataTable';
import UseDropdown from '../Shared/UseDropdown/UseDropdown';
import style from './NewLink.module.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Css styles
const { title, sourceContainer, sourceList, sourceProp, linkTypeContainer, targetContainer, projectContainer, dropDownLabel, targetSearchContainer, resourceTypeContainer, searchContainer, inputContainer, searchIcon, searchInput, searchBtn, newLinkTable, emptySearchWarning, saveBtn } = style;

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
  const [linkType, setLinkType] = useState('');
  const { register, handleSubmit } = useForm();
  const [searchText, setSearchText] = useState(null);
  const [isChecked, setIsChecked] = useState(null);
  const [selectedTargetData, setSelectedTargetData] = useState(null);
  const [displayTableData, setDisplayTableData] = useState([]);
  const [sourceItems, setSourceItems] = useState([]);
  const navigate = useNavigate();

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
    setSelectedTargetData(null);
    setSearchText(data?.searchText);
  };

  const handleLinkTypeChange = (value) => {
    console.log(value);
    setLinkType(value?.selectedItem);
  };

  const targetProjectItems = linkType === 'constrainedBy' ? ['Gilda OSLC API 1'] : projectItems;
  const targetResourceItems = linkType === 'constrainedBy' ? ['Document (PLM)', 'Part (PLM)'] : resourceItems;

  const handleTargetProject = (value) => {
    console.log(value);
  };

  const handleTargetResource = (value) => {
    console.log(value);
  };
    // Selected target data
  const handleSelectedData = (data) => {
    console.log(data);
    setSelectedTargetData(data);
  };

  // Create new link 
  const handleSaveLink = () => {
    Swal.fire({
      icon: 'success',
      title: 'Link successfully created!',
      timer: 3000
    });
    navigate('/');
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
                    <UseDropdown items={targetProjectItems} onChange={handleTargetProject} label={'Select project'} id='project-dropdown' style={{ minWidth: '300px' }} />
                  </div>

                  <div className={targetSearchContainer}>
                    <div className={resourceTypeContainer}>
                      <p className={dropDownLabel}>Resource type:</p>
                      <UseDropdown items={targetResourceItems} onChange={handleTargetResource} label={'Select resource type'} id='resourceType-dropdown' style={{ minWidth: '300px' }} />
                    </div>

                    <form onSubmit={handleSubmit(handleSearchData)} className={searchContainer}>
                      <div className={inputContainer}>
                        <GoSearch className={searchIcon} />
                        <input className={searchInput} type="text" placeholder='Search by identifier or name' {...register('searchText')} />
                      </div>
                      <Button size='md' type='submit' className={searchBtn}>Search</Button>
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
      {selectedTargetData?.identifier && <Button onClick={handleSaveLink} size='lg' className={saveBtn}>Save</Button>}
    </div>
  );
};

export default NewLink;