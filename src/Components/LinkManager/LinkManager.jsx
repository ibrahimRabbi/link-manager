import React, { useState, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  fetchLinksData,
  handleIsWbe,
  exportLinksToExcel,
} from '../../Redux/slices/linksSlice';
import {
  Button,
  FlexboxGrid,
  Form,
  IconButton,
  Loader,
  Message,
  Pagination,
  Schema,
  Stack,
  toaster,
} from 'rsuite';
import AuthContext from '../../Store/Auth-Context.jsx';
import styles from './LinkManager.module.scss';
import SourceSection from '../SourceSection';
import { FaRegFileExcel } from 'react-icons/fa';
import SearchIcon from '@rsuite/icons/Search';
import CloseIcon from '@rsuite/icons/Close';
import { darkBgColor, lightBgColor } from '../../App';
import TextField from '../AdminDasComponents/TextField';
import LinkManagerTable from './LinkManagerTable';
import { useMutation } from '@tanstack/react-query';
import fetchAPIRequest from '../../apiRequests/apiRequest';
import AlertModal from '../Shared/AlertModal';
import useMediaQuery from '../Shared/useMediaQeury.js';
import AddOutlineIcon from '@rsuite/icons/AddOutline';

const {
  tableContainer,
  onlyTableContainer,
  onlyTableContainerDark,
  paginationStyle,
  paginationStyleDark,
} = styles;

const apiURL = import.meta.env.VITE_LM_REST_API_URL;

const { StringType } = Schema.Types;
const model = Schema.Model({
  search_term: StringType(),
});

const LinkManager = () => {
  const { sourceDataList, linksData, isLoading } = useSelector((state) => state.links);
  const { linksStream, refreshData, isDark } = useSelector((state) => state.nav);
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState({ search_term: '' });
  const [isLinkSearching, setIsLinkSearching] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [open, setOpen] = useState(false);
  const authCtx = useContext(AuthContext);
  const location = useLocation();
  const isWbe = location.pathname?.includes('wbe');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const uri = searchParams.get('uri');
  const sourceFileURL = uri || sourceDataList?.uri;
  const searchRef = useRef();
  const isSmallDevice = useMediaQuery('(max-width: 985px)');

  useEffect(() => {
    dispatch(handleIsWbe(isWbe));
    if (isWbe) {
      localStorage.setItem('wbe', 'wbe');
    }
  }, [location]);

  // delete link using react-query
  const deleteURl = `link/resource?source_id=${encodeURIComponent(
    sourceFileURL,
  )}&target_id=${encodeURIComponent(selectedRowData?.uri)}&link_type=${
    selectedRowData?.link_type
  }`;
  const {
    isLoading: deleteLoading,
    isSuccess: deleteSuccess,
    mutate: deleteMutate,
  } = useMutation(
    () =>
      fetchAPIRequest({
        urlPath: deleteURl,
        token: authCtx.token,
        method: 'DELETE',
        showNotification: showNotification,
      }),
    {
      onSuccess: () => {
        setSelectedRowData({});
      },
      onError: () => {
        setSelectedRowData({});
      },
    },
  );

  // get all links
  useEffect(() => {
    if (sourceFileURL) {
      const getLinkUrl = `${apiURL}/link/resource?resource_id=${encodeURIComponent(
        sourceFileURL,
      )}&page=${currPage}&per_page=${pageSize}&search_term=${searchValue.search_term}`;

      dispatch(
        fetchLinksData({
          url: getLinkUrl,
          token: authCtx.token,
          showNotification: showNotification,
        }),
      );
    }
  }, [linksStream, pageSize, currPage, deleteSuccess, isLinkSearching, refreshData]);

  const showNotification = (type, message) => {
    if (type && message) {
      const messages = (
        <Message closable showIcon type={type}>
          {message}
        </Message>
      );
      toaster.push(messages, { placement: 'bottomCenter', duration: 5000 });
    }
  };

  useEffect(() => {
    setCurrPage(page);
  }, [page]);

  const handleChangeLimit = (dataKey) => {
    setCurrPage(1);
    setPageSize(dataKey);
  };

  // handle search links
  const handleSearchLinks = () => {
    // if (searchValue.search_term) {
    setIsLinkSearching((prevValue) => !prevValue);
    // }
  };

  // handle delete link
  const handleDeleteLink = () => {
    setOpen(true);
  };
  const handleConfirmed = (value) => {
    if (value) deleteMutate();
    else {
      setSelectedRowData({});
    }
  };

  const exportToExcel = () => {
    if (sourceFileURL) {
      if (linksData?.items?.length) {
        const exportUrl = `${apiURL}/link/export?source_id=${sourceFileURL}`;
        const filename = sourceDataList['titleLabel']?.replace(' ', '_');
        exportLinksToExcel({
          url: exportUrl,
          token: authCtx.token,
          showNotification: showNotification,
          filename: filename,
        });
      } else {
        showNotification(
          'info',
          'Sorry, you can not export to Excel because the data is empty in the table!!',
        );
      }
    }
  };
  const tableProps = {
    data: linksData?.items?.length ? linksData?.items : [],
    handleChangeLimit,
    handleDeleteLink,
    setSelectedRowData: setSelectedRowData,
    totalItems: linksData?.total_items,
    totalPages: linksData?.total_pages,
  };

  // eslint-disable-next-line max-len
  const organization = authCtx?.organization_name
    ? `/${authCtx?.organization_name?.toLowerCase()}`
    : '';
  return (
    <div>
      <SourceSection />
      {/* confirmation modal  */}
      <AlertModal
        open={open}
        setOpen={setOpen}
        content={'You want to delete this link!'}
        handleConfirmed={handleConfirmed}
      />
      <div className={isWbe ? 'wbeNavSpace' : ''}>
        <div className="mainContainer">
          <div className="container">
            <div className={tableContainer}>
              {(isLoading || deleteLoading) && (
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
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: isDark === 'dark' ? darkBgColor : lightBgColor,
                  paddingBottom: '10px',
                }}
              >
                <FlexboxGrid.Item>
                  <Form
                    fluid
                    ref={searchRef}
                    onChange={setSearchValue}
                    formValue={searchValue}
                    model={model}
                  >
                    <Stack style={{ position: 'relative' }}>
                      <TextField
                        style={{
                          width: isSmallDevice ? '100%' : '400px',
                          borderRadius: '0 6px 6px 0',
                          height: '36px',
                        }}
                        placeholder=""
                        type="text"
                        name="search_term"
                      />

                      {searchValue?.search_term && (
                        <IconButton
                          onClick={() => {
                            setSearchValue({
                              search_term: '',
                            });
                            setIsLinkSearching((prevValue) => !prevValue);
                          }}
                          icon={<CloseIcon />}
                          style={{
                            position: 'absolute',
                            top: '1px',
                            bottom: '1px',
                            right: '40px',
                            borderRadius: '0',
                          }}
                        />
                      )}

                      <Button
                        color="blue"
                        appearance="primary"
                        size="md"
                        style={{
                          borderRadius: '0 6px 6px 0',
                          position: 'absolute',
                          top: '0px',
                          right: '0',
                        }}
                        type="submit"
                        onClick={handleSearchLinks}
                        startIcon={
                          <SearchIcon
                            style={{
                              marginLeft: isSmallDevice ? '' : '-5px',
                              height: '20px',
                            }}
                          />
                        }
                      />
                    </Stack>
                  </Form>
                </FlexboxGrid.Item>

                <FlexboxGrid.Item>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                    }}
                  >
                    <Button
                      color="blue"
                      appearance="primary"
                      onClick={() => {
                        if (isWbe) navigate(`/wbe${organization}/new-link`);
                        else {
                          navigate(`${organization}/new-link`);
                        }
                      }}
                    >
                      {isSmallDevice ? <AddOutlineIcon /> : 'Create Link'}
                    </Button>
                    <Button
                      appearance="default"
                      onClick={() => exportToExcel()}
                      color="blue"
                    >
                      <FaRegFileExcel title="Export To Excel" size={25} />
                    </Button>
                  </div>
                </FlexboxGrid.Item>
              </FlexboxGrid>

              <div
                className={
                  isDark === 'dark' ? onlyTableContainerDark : onlyTableContainer
                }
              >
                <LinkManagerTable props={tableProps} />
              </div>
              {/* --- Table Pagination ---  */}
              <Pagination
                className={isDark === 'dark' ? paginationStyleDark : paginationStyle}
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                maxButtons={2}
                size="lg"
                layout={['-', 'total', '|', 'limit', 'pager']}
                total={tableProps?.totalItems ? tableProps?.totalItems : 0}
                limitOptions={[5, 10, 25, 50, 100]}
                limit={pageSize}
                activePage={page}
                onChangePage={setPage}
                onChangeLimit={(v) => handleChangeLimit(v)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default React.memo(LinkManager);
