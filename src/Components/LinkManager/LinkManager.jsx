import { Button, Search } from '@carbon/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { handleCurrPageTitle, handleEditLinkData, handleGetSources, handleIsWbe } from '../../Redux/slices/linksSlice';
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
  const location=useLocation();
  const {id}=useParams();
  
  useEffect(()=>{
    dispatch(handleCurrPageTitle('OSLC Link Manager'));
    
    if(location.pathname){
      const currPath =location.pathname.split('/');
      dispatch(handleIsWbe(currPath[1] === 'wbe' ? true : false));
    }
    
    if(id){
      const sources=id.split('__');
      dispatch(handleGetSources({projectName: sources[0], stream:sources[1], baseline:sources[2]}));
    }
  },[]);

  useEffect(()=>{
    if(isWbe){
      if(!allLinks?.length) return navigate('/wbe/new-link');
    }
  },[isWbe]);

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