import React, { useState, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  fetchDeleteLink,
  fetchLinksData,
  handleIsWbe,
} from '../../Redux/slices/linksSlice';
import { Button, FlexboxGrid, Form, IconButton, Loader, Schema, Stack } from 'rsuite';
import { handleCurrPageTitle, handleRefreshData } from '../../Redux/slices/navSlice';
import AuthContext from '../../Store/Auth-Context.jsx';
import styles from './LinkManager.module.scss';
import SourceSection from '../SourceSection';
import { HiRefresh } from 'react-icons/hi';
import SearchIcon from '@rsuite/icons/Search';
import CloseIcon from '@rsuite/icons/Close';
import { darkBgColor, lightBgColor } from '../../App';
import Swal from 'sweetalert2';
import Notification from '../Shared/Notification';
import TextField from '../AdminDasComponents/TextField';
import LinkManagerTable from './LinkManagerTable';

const { tableContainer } = styles;

const apiURL = `${process.env.REACT_APP_LM_REST_API_URL}/link`;
let isTreeTable = process.env.REACT_APP_IS_TREEVIEW_TABLE;
if (isTreeTable) isTreeTable = JSON.parse(isTreeTable);

const { StringType } = Schema.Types;
const model = Schema.Model({
  search_term: StringType(),
});

const LinkManager = () => {
  const { sourceDataList, linksData, isLoading, isLinkDeleting, configuration_aware } =
    useSelector((state) => state.links);

  const { linksStream, refreshData, isDark } = useSelector((state) => state.nav);
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState({ search_term: '' });
  const [isLinkSearching, setIsLinkSearching] = useState(false);
  const authCtx = useContext(AuthContext);
  const location = useLocation();
  const isWbe = location.pathname?.includes('wbe');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const uri = searchParams.get('uri');
  const sourceFileURL = uri || sourceDataList?.uri;
  const searchRef = useRef();

  const [notificationType, setNotificationType] = React.useState('');
  const [notificationMessage, setNotificationMessage] = React.useState('');
  const showNotification = (type, message) => {
    setNotificationType(type);
    setNotificationMessage(message);
  };

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
        // eslint-disable-next-line max-len
        const getLinkUrl = `${apiURL}/resource?stream=${stream}&resource_id=${encodeURIComponent(
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
    })();
  }, [linksStream, pageSize, currPage, isLinkDeleting, isLinkSearching, refreshData]);

  // handle search links
  const handleSearchLinks = () => {
    if (searchValue.search_term) {
      setIsLinkSearching((prevValue) => !prevValue);
    }
  };

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
        const deleteURl = `${apiURL}/resource?source_id=${encodeURIComponent(
          sourceFileURL,
        )}&target_id=${encodeURIComponent(value.id)}&link_type=${value?.link_type}`;
        dispatch(
          fetchDeleteLink({
            url: deleteURl,
            token: authCtx.token,
            showNotification: showNotification,
          }),
        );
      }
    });
  };

  const tableProps = {
    data: linksData?.items?.length ? linksData?.items : [],
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
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: isDark === 'dark' ? darkBgColor : lightBgColor,
                  padding: '10px 0',
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
                          width: '400px',
                          borderRadius: '6px 0 0 6px',
                          height: '36px',
                        }}
                        placeholder="Search Links"
                        type="text"
                        name="search_term"
                      />

                      {searchValue?.search_term && (
                        <IconButton
                          onClick={() => {
                            setSearchValue({ search_term: '' });
                            setIsLinkSearching((prevValue) => !prevValue);
                          }}
                          icon={<CloseIcon />}
                          style={{
                            position: 'absolute',
                            top: '1px',
                            bottom: '1px',
                            right: '91px',
                            borderRadius: '0',
                          }}
                        />
                      )}

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

              <LinkManagerTable props={tableProps} />

              {notificationType && notificationMessage && (
                <Notification
                  type={notificationType}
                  message={notificationMessage}
                  setNotificationType={setNotificationType}
                  setNotificationMessage={setNotificationMessage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default React.memo(LinkManager);
