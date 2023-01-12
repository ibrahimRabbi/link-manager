import { Button, ProgressBar, Search } from '@carbon/react';
import React, {useContext, useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { handleDisplayLinks, handleEditLinkData } from '../../Redux/slices/linksSlice';
import UseDataTable from '../Shared/UseDataTable/UseDataTable';
import UseDropdown from '../Shared/UseDropdown/UseDropdown';
import AuthContext from '../../Store/Auth-Context.jsx';

import styles from './LinkManager.module.scss';
const {
  dropdownStyle, inputContainer, linkFileContainer,
  searchBox, searchContainer, searchInput, tableContainer
} = styles;

const headers = [
  { key: 'status', header: 'Status' },
  { key: 'sourceId', header: 'Source ID' },
  { key: 'linkType', header: 'Link type' },
  { key: 'target', header: 'Target' },
  { key: 'actions', header: 'Actions' }
];

const dropdownItem = ['Link type', 'Project type', 'Status', 'Target'];

const apiURL = `${process.env.REACT_APP_LM_REST_API_URL}/link/resource`;


const LinkManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { allLinks, sourceDataList, isWbe } = useSelector(state => state.links);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const authCtx = useContext(AuthContext);

  const title = searchParams.get('title');

  // Get Created Links from LM API
  useEffect(() => {
    if (title) {
      setIsLoading(true);
      // dispatch(handleIsLoading(true));
      fetch(`${apiURL}/6`, {
        method:'GET',
        headers:{
          'Content-type':'application/json',
          'authorization':'Bearer ' + authCtx.token,
        }
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            return res.json().then(data => {
              let errorMessage = 'Loading links failed: ';
              if (data && data.message) {
                errorMessage += data.message;
              }
              throw new Error(errorMessage);
            });
          }
        })
        .then(data=>{
          console.log(data);
          if (data?.length) dispatch(handleDisplayLinks(data));
        })
        .catch((err)=>{
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.message,
          });
        })
        .finally(() => setIsLoading(false));
    }
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
        <h5>Links created for: {sourceDataList?.title}</h5>

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
        { (isLoading && !allLinks[0]) && <ProgressBar label=''/> }
        <UseDataTable headers={headers} tableData={allLinks} openTargetLink={handleOpenTargetLink} />
      </div>
    </div>
  );
};
export default LinkManager;
