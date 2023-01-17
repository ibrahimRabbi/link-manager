import { Button, ProgressBar, Search } from '@carbon/react';
import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { fetchLinksData, handleEditLinkData } from '../../Redux/slices/linksSlice';
import { handleCurrPageTitle } from '../../Redux/slices/navSlice';
import AuthContext from '../../Store/Auth-Context.jsx';
import GraphView from '../GraphView/GraphView';
import UseDataTable from '../Shared/UseDataTable/UseDataTable';
import UseDropdown from '../Shared/UseDropdown/UseDropdown';

import styles from './LinkManager.module.scss';
const {
  dropdownStyle,
  inputContainer,
  linkFileContainer,
  searchBox,
  searchContainer,
  searchInput,
  tableContainer,
} = styles;

const headers = [
  { key: 'status', header: 'Status' },
  { key: 'sourceId', header: 'Source ID' },
  { key: 'linkType', header: 'Link type' },
  { key: 'target', header: 'Target' },
  { key: 'actions', header: 'Actions' },
];

const dropdownItem = ['Link type', 'Project type', 'Status', 'Target'];
const apiURL = `${process.env.REACT_APP_LM_REST_API_URL}/link/resource`;

const LinkManager = () => {
  const { 
    sourceDataList, 
    isWbe, linksData, 
    isLoading ,
  } = useSelector(state => state.links);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const uri =searchParams.get('uri');
  const sourceFileURL= uri || sourceDataList?.uri;

  useEffect(()=>{
    dispatch(handleCurrPageTitle('Links'));
    console.log(sourceFileURL);
    // Create link 
    if(sourceFileURL){
      dispatch(fetchLinksData({
        url:`${apiURL}/?resource_id=${sourceFileURL}`, 
        token:authCtx.token,
      }));
    }
  },[sourceDataList]);
  
  // Link manager dropdown options
  const handleShowItem = () => {};

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
    <div className="mainContainer">
      <div className="container">
        <div className={linkFileContainer}>
          <h5>Links For: {sourceDataList?.title}</h5>

          <Button
            onClick={() => {
              isWbe ? navigate('/wbe/new-link') : navigate('/new-link');
              dispatch(handleEditLinkData());
            }}
            size="md"
            kind="primary"
          >
            New link
          </Button>
        </div>
        <div className={tableContainer}>
          <div className={searchBox}>
            <UseDropdown
              onChange={handleShowItem}
              items={dropdownItem}
              id={'linkManager_showAll'}
              label="Show all"
              className={dropdownStyle}
            />

            <div className={searchContainer}>
              <div className={inputContainer}>
                <Search
                  id=""
                  labelText=""
                  className={searchInput}
                  placeholder="Search by identifier or name"
                  onChange={function noRefCheck() {}}
                  onKeyDown={function noRefCheck() {}}
                  size="md"
                />
              </div>
              <Button kind="primary" size="md">
                Search
              </Button>
            </div>
          </div>

          { (isLoading && !linksData[0]) && <ProgressBar label=''/> }
          <UseDataTable 
            headers={headers} 
            tableData={linksData} 
            openTargetLink={handleOpenTargetLink} 
          />
        </div>
      </div>
      <GraphView uri={uri}/>
    </div>
  );
};
export default LinkManager;
