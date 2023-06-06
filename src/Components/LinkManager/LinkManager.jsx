import { Button, FlexboxGrid, Form, Loader, Schema, Stack } from 'rsuite';
import React, { useState, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  fetchDeleteLink,
  fetchLinksData,
  handleIsWbe,
} from '../../Redux/slices/linksSlice';
import { handleCurrPageTitle, handleRefreshData } from '../../Redux/slices/navSlice';
import AuthContext from '../../Store/Auth-Context.jsx';
import styles from './LinkManager.module.scss';
import SourceSection from '../SourceSection';
import { HiRefresh } from 'react-icons/hi';
import SearchIcon from '@rsuite/icons/Search';
// import CloseIcon from '@rsuite/icons/Close';
import { darkBgColor, lightBgColor } from '../../App';
import Swal from 'sweetalert2';
// import LinksDataTable from '../Shared/UseDataTable/LinksDataTable';
import TextField from '../AdminDasComponents/TextField';
import { fetchGetData } from '../../Redux/slices/useCRUDSlice';
import LinksTreeDataTable from '../Shared/UseDataTable/LinksTreeDataTable';

const { tableContainer } = styles;

// links table header data
const headerData = [
  { key: 'status', header: 'Status' },
  { key: 'link_type', header: 'Link type' },
  { key: 'target', header: 'Target' },
  { key: 'actions', header: 'Actions' },
];

const apiURL = `${process.env.REACT_APP_LM_REST_API_URL}/link`;

const { StringType } = Schema.Types;
const model = Schema.Model({
  search_term: StringType().isRequired('Search text is required.'),
});

const LinkManager = () => {
  const { sourceDataList, linksData, isLoading, isLinkDeleting, configuration_aware } =
    useSelector((state) => state.links);

  const { linksStream, refreshData, isDark } = useSelector((state) => state.nav);
  // const { crudData } = useSelector((state) => state.crud);
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [tableFilterValue, setTableFilterValue] = useState('');
  const [searchValue, setSearchValue] = useState({ search_term: '' });
  const [searchError, setSearchError] = useState({});
  const [displayTableData, setDisplayTableData] = useState([]);
  const authCtx = useContext(AuthContext);
  const location = useLocation();
  const isWbe = location.pathname?.includes('wbe');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [searchParams] = useSearchParams();
  const uri = searchParams.get('uri');
  const sourceFileURL = uri || sourceDataList?.uri;

  useEffect(() => {
    dispatch(handleIsWbe(isWbe));
  }, [location]);

  // Handle pagination for the links table
  const handlePagination = (value) => {
    setCurrPage(value);
  };
  const handleChangeLimit = (dataKey) => {
    setCurrPage(1);
    setPageSize(dataKey);
  };

  // get all links
  useEffect(() => {
    (async () => {
      dispatch(handleCurrPageTitle('Links'));

      let streamRes = [];
      if (configuration_aware && !linksStream.key) {
        streamRes = await fetch('.././gcm_context.json')
          .then((res) => res.json())
          .catch((err) => console.log(err));
      }

      let stream = linksStream.key ? linksStream.key : streamRes[0]?.key;

      // Get all links
      if (sourceFileURL) {
        dispatch(
          fetchLinksData({
            // eslint-disable-next-line max-len
            url: `${apiURL}/resource?stream=${stream}&resource_id=${encodeURIComponent(
              sourceFileURL,
              // eslint-disable-next-line max-len
            )}&page=${currPage}&per_page=${pageSize}&search_term=${
              searchValue.search_term
            }`,
            token: authCtx.token,
          }),
        );
      }
    })();
  }, [linksStream, pageSize, currPage, isLinkDeleting, refreshData]);

  // handle delete link
  const handleDeleteLink = (value) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this link!',
      icon: 'question',
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        // eslint-disable-next-line max-len
        const deleteURl = `${apiURL}?source_id=${encodeURIComponent(
          sourceFileURL,
        )}&target_id=${encodeURIComponent(value.id)}&link_type=${value?.link_type}`;
        dispatch(
          fetchDeleteLink({
            url: deleteURl,
            token: authCtx.token,
          }),
        );
      }
    });
  };

  // handle search links
  const handleSearchLinks = () => {
    if (!searchRef.current.check()) {
      console.error('Search Error', searchError);
      console.log(tableFilterValue, setTableFilterValue);
      return;
    }

    // console.log(searchValue);
    const linkType = '';
    const resourceType = '';
    dispatch(
      fetchGetData({
        // eslint-disable-next-line max-len
        url: `${apiURL}/search?search_term=${searchValue.search_term}&resource_type=${resourceType}&link_type=${linkType}&page=1&page_size=100`,
        token: authCtx.token,
        stateName: 'filteredLinks',
      }),
    ).then((res) => console.log(res?.payload?.response));
  };

  // filter table
  useEffect(() => {
    if (tableFilterValue) {
      const filteredData = linksData?.items?.filter((row) => {
        // eslint-disable-next-line max-len
        return Object.values(row)
          ?.toString()
          ?.toLowerCase()
          .includes(tableFilterValue?.toLowerCase());
      });
      setDisplayTableData(filteredData);
    }
  }, [tableFilterValue]);

  const tableProps = {
    rowData:
      tableFilterValue === ''
        ? linksData?.items?.length
          ? linksData?.items
          : []
        : displayTableData,
    headerData,
    handlePagination,
    handleChangeLimit,
    handleDeleteLink,
    totalItems: linksData?.total_items,
    totalPages: linksData?.total_pages,
    setCurrPage,
    pageSize,
    page: linksData?.page,
  };

  return (
    <div>
      <SourceSection />
      <div className={isWbe ? 'wbeNavSpace' : ''}>
        <div className="mainContainer">
          <div className="container">
            <div className={tableContainer}>
              {isLoading && (
                <Loader
                  backdrop
                  center
                  size="md"
                  vertical
                  content="Loading..."
                  style={{ zIndex: '10' }}
                />
              )}

              <FlexboxGrid
                justify="space-between"
                style={{
                  backgroundColor: isDark === 'dark' ? darkBgColor : lightBgColor,
                  padding: '10px 0',
                }}
              >
                <FlexboxGrid.Item>
                  <Form
                    fluid
                    ref={searchRef}
                    onChange={setSearchValue}
                    onCheck={setSearchError}
                    formValue={searchValue}
                    model={model}
                  >
                    <Stack>
                      <TextField
                        style={{
                          width: '400px',
                          borderRadius: '6px 0 0 6px',
                          height: '36px',
                        }}
                        placeholder="Search Links"
                        type="text"
                        name="search_term"
                      />

                      <Button
                        color="blue"
                        appearance="primary"
                        size="md"
                        style={{ borderRadius: '0 6px 6px 0' }}
                        type="submit"
                        startIcon={<SearchIcon style={{ marginLeft: '-5px' }} />}
                        onClick={handleSearchLinks}
                      >
                        Search
                      </Button>
                    </Stack>
                  </Form>
                </FlexboxGrid.Item>

                <FlexboxGrid.Item>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Button
                      color="blue"
                      appearance="primary"
                      active
                      onClick={() =>
                        isWbe ? navigate('/wbe/new-link') : navigate('/new-link')
                      }
                    >
                      {' '}
                      Create Link
                    </Button>

                    <Button
                      appearance="default"
                      onClick={() => dispatch(handleRefreshData(!refreshData))}
                      color="blue"
                    >
                      <HiRefresh size={25} />
                    </Button>
                  </div>
                </FlexboxGrid.Item>
              </FlexboxGrid>

              {/* <LinksDataTable props={tableProps} /> */}
              <LinksTreeDataTable props={tableProps} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LinkManager;
