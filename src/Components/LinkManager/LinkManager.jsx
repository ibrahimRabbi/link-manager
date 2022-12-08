import { Button, Search } from '@carbon/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { handleCurrPageTitle, handleDisplayLinks, handleEditLinkData, handleIsWbe } from '../../Redux/slices/linksSlice';
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
  const { allLinks, sourceDataList, isWbe } = useSelector(state => state.links);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {pathname}=useLocation();
  const isWBE = pathname === '/wbe';

  // Get Created Link
  useEffect(()=>{
    // fetch('https://lm-api-dev.koneksys.com/api/v1/link/Completed_by', {
    //   method:'GET', 
    //   headers:{
    //     'Content-type':'application/json',
    //     'authorization':'Bearer '+ loggedInUser?.token,
    //   }
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     // return data;
    //     const transformedData = data.map((link) => {
    //       return {
    //         ...link,
    //         identifier: link.uri,
    //         name: link.name,
    //         description: link.name,
    //         status: 'Valid',
    //         sources: {baseline: link.uri},
    //         linkType: 'Completed_by',
    //         targetData: {label: link.name + ' - ' + link.uri}
    //       };
    //     });
    //     dispatch(handleDisplayLinks(transformedData));
    //   })
    //   .catch(err=> console.log('ERROR: ', err));
  },[]);
  
  useEffect(()=>{
    dispatch(handleIsWbe(isWBE));
    dispatch(handleCurrPageTitle('OSLC Link Manager'));
  },[isWBE, pathname]);

  // Get links in localStorage
  useEffect(()=>{
    let values = [],
      keys = Object.keys(localStorage),
      i = keys.length;
    while ( i-- ) {
      values.push( JSON.parse(localStorage.getItem(keys[i])) );
    }

    const filteredLinksByCommit= values?.filter(id=>id.sources?.baseline === sourceDataList?.baseline);
    if(isWbe){
      if (filteredLinksByCommit) dispatch(handleDisplayLinks(filteredLinksByCommit));
      setTimeout(()=>{
        if(!filteredLinksByCommit.length && sourceDataList?.baseline) navigate('/wbe/new-link');
      },100);
    }
    else{
      if (values.length > 0) dispatch(handleDisplayLinks(values));
    }
  },[isWbe, localStorage, allLinks.length]);

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
        <h5>Links for file: {sourceDataList?.baseline}</h5>

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
        <UseDataTable headers={headers} tableData={allLinks} openTargetLink={handleOpenTargetLink} />
      </div>
    </div>
  );
};
export default LinkManager;