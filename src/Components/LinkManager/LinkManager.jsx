import { Button, ProgressBar, Search } from '@carbon/react';
import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { fetchLinksData, handleIsWbe } from '../../Redux/slices/linksSlice';
import { handleCurrPageTitle, handleIsProfileOpen } from '../../Redux/slices/navSlice';
import AuthContext from '../../Store/Auth-Context.jsx';
import WbeTopNav from '../Shared/NavigationBar/WbeTopNav';
import UseDataTable from '../Shared/UseDataTable/UseDataTable';
import UseDropdown from '../Shared/UseDropdown/UseDropdown';

import styles from './LinkManager.module.scss';
const {
  dropdownStyle,
  inputContainer,
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

const tableDropdownItems = [
  { text: 'Link type' },
  { text: 'Project type' },
  { text: 'Status' },
  { text: 'Target' },
];

const apiURL = `${process.env.REACT_APP_LM_REST_API_URL}/link/resource`;

const LinkManager = () => {
  const { sourceDataList, linksData, isLoading } = useSelector((state) => state.links);
  const { linksStream, isProfileOpen } = useSelector((state) => state.nav);
  const location = useLocation();
  const wbePath = location.pathname?.includes('wbe');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const uri = searchParams.get('uri');
  const sourceFileURL = uri || sourceDataList?.uri;

  useEffect(() => {
    dispatch(handleIsWbe(wbePath));
  }, [location]);

  useEffect(() => {
    dispatch(handleIsProfileOpen(isProfileOpen && false));
    dispatch(handleCurrPageTitle('Links'));

    let stream = linksStream ? linksStream : 'st-main';
    // Create link
    if (sourceFileURL && stream) {
      dispatch(
        fetchLinksData({
          // eslint-disable-next-line max-len
          url: `${apiURL}?stream=${stream}&resource_id=${encodeURIComponent(
            sourceFileURL,
          )}`,
          token: authCtx.token,
        }),
      );
    }
  }, [linksStream]);

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
    <>
      {/* WBE Nav bar  */}
      {wbePath && <WbeTopNav />}

      <div
        onClick={() => dispatch(handleIsProfileOpen(isProfileOpen && false))}
        className={wbePath ? 'wbeNavSpace' : ''}
      >
        <div className="mainContainer">
          <div className="container">
            {!wbePath && (
              <div className="linkFileContainer">
                <h5>Links For: {sourceDataList?.title}</h5>

                <Button
                  onClick={() => {
                    wbePath ? navigate('/wbe/new-link') : navigate('/new-link');
                  }}
                  size="md"
                  kind="primary"
                >
                  New link
                </Button>
              </div>
            )}

            <div className={tableContainer}>
              <div className={searchBox}>
                <UseDropdown
                  onChange={handleShowItem}
                  items={tableDropdownItems}
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
                      size="sm"
                    />
                  </div>
                  <Button kind="primary" size="sm">
                    Search
                  </Button>
                </div>
              </div>

              {isLoading && <ProgressBar label="" />}
              <UseDataTable
                headers={headers}
                tableData={linksData}
                openTargetLink={handleOpenTargetLink}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default LinkManager;
