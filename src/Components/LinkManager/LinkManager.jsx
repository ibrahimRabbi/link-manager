import { ProgressBar, Search } from '@carbon/react';
import { Button } from 'rsuite';
import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import { fetchLinksData, handleIsWbe } from '../../Redux/slices/linksSlice';
import { handleCurrPageTitle, handleIsProfileOpen } from '../../Redux/slices/navSlice';
import AuthContext from '../../Store/Auth-Context.jsx';
import UseDropdown from '../Shared/UseDropdown/UseDropdown';
import styles from './LinkManager.module.scss';
import SourceSection from '../SourceSection';
import LinksDataTable from '../Shared/UseDataTable/LinksDataTable';

// import AddOutlineIcon from '@rsuite/icons/AddOutline';
// import WbeTopNav from '../Shared/NavigationBar/WbeTopNav';
// import LinksTable from '../Shared/UseDataTable/LinksTable';
// import UseDataTable from '../Shared/UseDataTable/UseDataTable';

const {
  dropdownStyle,
  inputContainer,
  searchBox,
  searchContainer,
  searchInput,
  tableContainer,
} = styles;

const headerData = [
  { key: 'status', header: 'Status' },
  { key: 'link_type', header: 'Link type' },
  { key: 'target', header: 'Target' },
  { key: 'actions', header: 'Actions' },
];

const tableDropdownItems = [
  { name: 'Link type' },
  { name: 'Project type' },
  { name: 'Status' },
  { name: 'Target' },
];

const apiURL = `${process.env.REACT_APP_LM_REST_API_URL}/link/resource`;

const LinkManager = () => {
  const { sourceDataList, linksData, isLoading, configuration_aware } = useSelector(
    (state) => state.links,
  );
  // console.log('linksData ->', linksData);
  const { linksStream, isProfileOpen, isWbeNavOpen } = useSelector((state) => state.nav);
  const location = useLocation();
  const wbePath = location.pathname?.includes('wbe');
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const uri = searchParams.get('uri');
  const sourceFileURL = uri || sourceDataList?.uri;

  useEffect(() => {
    dispatch(handleIsWbe(wbePath));
  }, [location]);

  // Handle pagination for the links table
  // Pagination
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handlePagination = (value) => {
    setCurrPage(value);
  };

  const handleChangeLimit = (dataKey) => {
    setCurrPage(1);
    setPageSize(dataKey);
  };

  useEffect(() => {
    (async () => {
      dispatch(handleIsProfileOpen(isProfileOpen && false));
      dispatch(handleCurrPageTitle('Links'));

      let streamRes = [];
      if (configuration_aware && !linksStream.key) {
        streamRes = await fetch('.././gcm_context.json')
          .then((res) => res.json())
          .catch((err) => console.log(err));
      }

      let stream = linksStream.key ? linksStream.key : streamRes[0]?.key;

      // Create link
      if (sourceFileURL) {
        dispatch(
          fetchLinksData({
            // eslint-disable-next-line max-len
            url: `${apiURL}?stream=${stream}&resource_id=${encodeURIComponent(
              sourceFileURL,
            )}&page=${currPage}&per_page=${pageSize}`,
            token: authCtx.token,
          }),
        );
      }
    })();
  }, [linksStream, pageSize, currPage]);

  // Link manager dropdown options
  const handleShowItem = () => {};

  // display conditionally Search and dropdown 0
  const isSearchBox = false;
  console.log(linksData?.items);
  const tableProps = {
    rowData: linksData?.items?.length ? linksData?.items : [],
    headerData,
    handlePagination,
    handleChangeLimit,
    totalItems: linksData?.total_items,
    totalPages: linksData?.total_pages,
    setCurrPage,
    pageSize,
    page: linksData?.page,
  };

  return (
    <div style={{ marginLeft: isWbeNavOpen ? '200px' : '55px' }}>
      <SourceSection />
      <div
        onClick={() => dispatch(handleIsProfileOpen(isProfileOpen && false))}
        className={wbePath ? 'wbeNavSpace' : ''}
      >
        <div className="mainContainer">
          <div className="container">
            {/* {!wbePath && (
              <div className="linkFileContainer">
                <h5>Links For: {sourceDataList?.title}</h5>

                <Button
                  onClick={() => navigate('/new-link')}
                  color="cyan"
                  appearance="primary"
                  endIcon={<AddOutlineIcon />}
                >
                  Create Link
                </Button>
              </div>
            )} */}

            <div className={tableContainer}>
              {isSearchBox && (
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
              )}

              {isLoading && <ProgressBar label="" />}
              {/* {
                location.pathname === '/' || '/wbe' &&
                <UseDataTable props={tableProps} />
              } */}
              {location.pathname === '/' ||
                ('/wbe' && <LinksDataTable props={tableProps} />)}

              {/* {
                linksData?.items?.length && 
              <LinksTable props={tableProps} rowsData={linksData?.items}/>
              } */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LinkManager;
