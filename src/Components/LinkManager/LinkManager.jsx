import { Button, FlexboxGrid, Input, InputGroup } from 'rsuite';
import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchLinksData, handleIsWbe } from '../../Redux/slices/linksSlice';
import { handleCurrPageTitle, handleRefreshData } from '../../Redux/slices/navSlice';
import AuthContext from '../../Store/Auth-Context.jsx';
import styles from './LinkManager.module.scss';
import SourceSection from '../SourceSection';
import LinksDataTable from '../Shared/UseDataTable/LinksDataTable';
import UseLoader from '../Shared/UseLoader';
import { HiRefresh } from 'react-icons/hi';
import SearchIcon from '@rsuite/icons/Search';
import CloseIcon from '@rsuite/icons/Close';
import { darkBgColor, lightBgColor } from '../../App';

const { tableContainer } = styles;

const headerData = [
  { key: 'status', header: 'Status' },
  { key: 'link_type', header: 'Link type' },
  { key: 'target', header: 'Target' },
  { key: 'actions', header: 'Actions' },
];

const apiURL = `${process.env.REACT_APP_LM_REST_API_URL}/link/resource`;

const LinkManager = () => {
  const { sourceDataList, linksData, isLoading, configuration_aware } = useSelector(
    (state) => state.links,
  );
  // console.log('linksData ->', linksData);
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

  // fetch links
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
  }, [linksStream, pageSize, currPage, refreshData]);

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
    // eslint-disable-next-line max-len
    rowData:
      tableFilterValue === ''
        ? linksData?.items?.length
          ? linksData?.items
          : []
        : displayTableData,
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
    <div>
      <SourceSection />
      <div className={isWbe ? 'wbeNavSpace' : ''}>
        <div className="mainContainer">
          <div className="container">
            <div className={tableContainer}>
              {isLoading && <UseLoader />}

              <FlexboxGrid
                justify="space-between"
                style={{
                  backgroundColor: isDark == 'dark' ? darkBgColor : lightBgColor,
                  padding: '10px 0',
                }}
              >
                <FlexboxGrid.Item>
                  <InputGroup size="lg" inside style={{ width: '400px' }}>
                    <Input
                      placeholder={'Search Links'}
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
