import { Button, Search } from '@carbon/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { handleCurrPageTitle, handleDisplayLinks, handleEditLinkData, handleGetSources, handleIsWbe } from '../../Redux/slices/linksSlice';
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
  const [searchParams] = useSearchParams();
  const {pathname}=useLocation();

  const isWBE = pathname === '/wbe';
  // Receive Gitlab values and display source section
  const baseline= searchParams.get('commit');
  const projectName =searchParams.get('project');
  const stream= searchParams.get('branch');
  const origin= searchParams.get('origin');
  
  useEffect(()=>{
    dispatch(handleIsWbe(isWBE));
    dispatch(handleCurrPageTitle('OSLC Link Manager'));
    if(baseline) dispatch(handleGetSources({projectName, stream, baseline, origin}));
  },[isWBE, baseline, pathname]);

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
      dispatch(handleDisplayLinks(filteredLinksByCommit));
      setTimeout(()=>{
        if(!allLinks.length && sourceDataList?.baseline) navigate('/wbe/new-link');
      },100);
    }
    else{
      dispatch(handleDisplayLinks(values));
    }
    console.log('Get from Local storage: ',values);
  },[isWbe, localStorage, allLinks.length]);

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