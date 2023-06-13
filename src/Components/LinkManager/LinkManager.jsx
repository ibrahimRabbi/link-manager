import { Button, FlexboxGrid, Input, InputGroup, Loader } from 'rsuite';
import React, { useState, useContext, useEffect } from 'react';
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
import CloseIcon from '@rsuite/icons/Close';
import { darkBgColor, lightBgColor } from '../../App';
import Swal from 'sweetalert2';
import LinksDataTable from '../Shared/UseDataTable/LinksDataTable';

const { tableContainer } = styles;

// links table header data
const headerData = [
  { key: 'status', header: 'Status' },
  { key: 'link_type', header: 'Link type' },
  { key: 'target', header: 'Target' },
  { key: 'actions', header: 'Actions' },
];

const apiURL = `${process.env.REACT_APP_LM_REST_API_URL}/link/resource`;

const LinkManager = () => {
  const { sourceDataList, linksData, isLoading, isLinkDeleting, configuration_aware } =
    useSelector((state) => state.links);

  const { linksStream, refreshData, isDark } = useSelector((state) => state.nav);
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [tableFilterValue, setTableFilterValue] = useState('');
  const [displayTableData, setDisplayTableData] = useState([]);
  const location = useLocation();
  const isWbe = location.pathname?.includes('wbe');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
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
            url: `${apiURL}?stream=${stream}&resource_id=${encodeURIComponent(
              sourceFileURL,
            )}&page=${currPage}&per_page=${pageSize}`,
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
                  <InputGroup size="lg" inside style={{ width: '400px' }}>
                    <Input
                      placeholder={'Search Links'}
                      type="text"
                      value={tableFilterValue}
                      onChange={(v) => setTableFilterValue(v)}
                    />

                    {tableFilterValue ? (
                      <InputGroup.Button onClick={() => setTableFilterValue('')}>
                        <CloseIcon />
                      </InputGroup.Button>
                    ) : (
                      <InputGroup.Button>
                        <SearchIcon />
                      </InputGroup.Button>
                    )}
                  </InputGroup>
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

              <LinksDataTable props={tableProps} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LinkManager;
