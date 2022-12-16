import { Button, ProgressBar, Search } from '@carbon/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { handleDisplayLinks, handleEditLinkData, handleIsLoading } from '../../Redux/slices/linksSlice';
import UseDataTable from '../Shared/UseDataTable/UseDataTable';
import UseDropdown from '../Shared/UseDropdown/UseDropdown';
import { dropdownStyle, inputContainer, linkFileContainer, searchBox, searchContainer, searchInput, tableContainer } from './LinkManager.module.scss';

const headers = [
  { key: 'status', header: 'Status' },
  { key: 'sourceId', header: 'Source ID' },
  { key: 'linkType', header: 'Link type' },
  { key: 'target', header: 'Target' },
  { key: 'actions', header: 'Actions' }
];

const dropdownItem = ['Link type', 'Project type', 'Status', 'Target'];

const LinkManager = () => {
  // const [isLoaded, setIsLoaded] = React.useState(false);
  const { allLinks, isLoading, loggedInUser, sourceDataList, isWbe } = useSelector(state => state.links);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get Created Links from LM API
  useEffect(()=>{
    dispatch(handleIsLoading(true));
    (async()=>{
      await fetch('http://127.0.0.1:5000/api/v1/link/A-A', {
        headers:{
          'Content-type':'application/json',
          'authorization':'Bearer '+ loggedInUser?.token,
        }
      })
        .then(res=>res.json())
        .then(data=>{
          console.log(data);
          dispatch(handleDisplayLinks(data));
        })
        .catch(()=>{})
        .finally(()=>dispatch(handleIsLoading(false)));
    })();
  },[]);

  // Link manager dropdown options
  const handleShowItem = () => { };

  const handleOpenTargetLink = () => {
    Swal.fire({
      title: 'Opening Jira Application',
      timer: 2000,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  return (
    <div className='container'>
      <div className={linkFileContainer}>
        <h5>Links created for: {sourceDataList?.sourceType}</h5>

        <Button onClick={() => { 
          isWbe ? navigate('/wbe/new-link') : navigate('/new-link'); 
          dispatch(handleEditLinkData()); 
        }} size='sm' kind='ghost'>New link</Button>
      </div>
      <div className={tableContainer}>
        <div className={searchBox}>
          <UseDropdown onChange={handleShowItem} items={dropdownItem} id={'linkManager_showAll'} label='Show all' className={dropdownStyle}/>

          <div className={searchContainer}>
            <div className={inputContainer}>
              <Search
                id=''
                labelText=''
                className={searchInput}
                placeholder='Search by identifier or name'
                onChange={function noRefCheck(){}}
                onKeyDown={function noRefCheck(){}}
                size='md'
              />
            </div>
            <Button kind='primary' size='md'>Search</Button>
          </div>
        </div>
        { isLoading && <ProgressBar label=''/> }
        <UseDataTable headers={headers} tableData={allLinks} openTargetLink={handleOpenTargetLink} />
      </div>
    </div>
  );
};
export default LinkManager;