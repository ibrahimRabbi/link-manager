import React, { useContext, useEffect, useState } from 'react';
import { handleCurrPageTitle, handleRefreshData } from '../../Redux/slices/navSlice.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPipelineRun } from '../../Redux/slices/pipelineRunSlice.jsx';
import AuthContext from '../../Store/Auth-Context.jsx';
import styles from '../LinkManager/LinkManager.module.scss';
import { darkColor, lightBgColor, darkBgColor } from '../../App.jsx';
import AlertModal from '../Shared/AlertModal.jsx';
import { fetchDeleteData } from '../../Redux/slices/useCRUDSlice.jsx';

import {
  Drawer,
  Loader,
  Message,
  toaster,
  Pagination,
  FlexboxGrid,
  Button,
  InputGroup,
  Input,
} from 'rsuite';
import { Table, IconButton, ButtonToolbar } from 'rsuite';
import SuccessStatus from '@rsuite/icons/CheckRound';
import FailedStatus from '@rsuite/icons/WarningRound';
import { PiEyeBold } from 'react-icons/pi';
import SearchIcon from '@rsuite/icons/Search';
import { HiRefresh } from 'react-icons/hi';
import { MdDelete } from 'react-icons/md';
import CloseIcon from '@rsuite/icons/Close';
import FlexboxGridItem from 'rsuite/esm/FlexboxGrid/FlexboxGridItem.js';
const { Column, HeaderCell, Cell } = Table;

const { tableContainer } = styles;

const apiURL = `${import.meta.env.VITE_LM_REST_API_URL}`;

const Pipeline = () => {
  const { allPipelineRun, isPipelineRunLoading } = useSelector(
    (state) => state.pipelinerun,
  );
  const { isDark } = useSelector((state) => state.nav);
  const { refreshData } = useSelector((state) => state.nav);
  const [tableFilterValue, setTableFilterValue] = useState('');
  const [displayTableData, setDisplayTableData] = useState([]);
  const authCtx = useContext(AuthContext);
  const isSuperAdmin = authCtx?.user?.role === 'super_admin' ? true : false;
  const isAdmin = authCtx?.user?.role === 'admin' ? true : false;
  const dispatch = useDispatch();
  const wbePath = location.pathname?.includes('wbe');
  const [pageSize, setPageSize] = useState(5);
  const [currPage, setCurrPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [openWithHeader, setOpenWithHeader] = useState(false);
  const [pipelineOutput, setPipelineOutput] = useState('');
  const organization_id = authCtx.organization_id;
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

  const handleChangeLimit = (dataKey) => {
    setCurrPage(1);
    setPageSize(dataKey);
  };

  const handlePagination = (value) => {
    setCurrPage(value);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleConfirmed = (value) => {
    if (value) {
      const deleteUrl = `${apiURL}/${organization_id}/pipeline_run/${deleteId}`;
      dispatch(
        fetchDeleteData({
          url: deleteUrl,
          token: authCtx.token,
          showNotification: showNotification,
        }),
      );
    }
  };

  /* eslint-disable max-len */
  useEffect(() => {
    dispatch(handleCurrPageTitle('Pipeline Runs'));
    const getUrl = `${apiURL}/${organization_id}/pipeline_run?page=${currPage}&per_page=${pageSize}`;
    dispatch(
      fetchPipelineRun({
        url: getUrl,
        token: authCtx.token,
        authCtx: authCtx,
        showNotification: showNotification,
      }),
    );
  }, [pageSize, currPage, refreshData]);

  /* eslint-disable indent */

  const data = !allPipelineRun.items
    ? []
    : allPipelineRun.items.map((run) => {
        return {
          id: run.id,
          event: run.pipeline.event.name,
          organization: run.pipeline.event.application.organization.name,
          start_time: new Date(run.start_time).toLocaleString('en-US', {
            hour12: true,
          }),
          duration: (new Date(run.end_time) - new Date(run.start_time)) / 1000,
          status: run.status ? 'Success' : 'Failed',
          output: run.output,
        };
      });

  useEffect(() => {
    if (tableFilterValue) {
      const filteredData = data?.filter((row) => {
        return Object.values(row)
          ?.toString()
          ?.toLowerCase()
          .includes(tableFilterValue?.toLowerCase());
      });
      setDisplayTableData(filteredData);
    }
  }, [tableFilterValue]);

  return (
    <div>
      <div className={wbePath ? 'wbeNavSpace' : ''}>
        <div className="mainContainer">
          <div className="container">
            <div className={tableContainer}>
              {isPipelineRunLoading && (
                <Loader
                  backdrop
                  center
                  size="md"
                  vertical
                  style={{ zIndex: '10', marginTop: '200px' }}
                />
              )}

              {allPipelineRun?.items && (
                <div>
                  <FlexboxGrid justify="end">
                    <FlexboxGridItem>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <InputGroup size="lg" inside style={{ width: '400px' }}>
                          <Input
                            placeholder={'Search...'}
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

                        <Button
                          appearance="default"
                          onClick={() => dispatch(handleRefreshData(!refreshData))}
                          color="blue"
                        >
                          <HiRefresh size={25} />
                        </Button>
                      </div>
                    </FlexboxGridItem>
                  </FlexboxGrid>
                  <br />
                  <Table
                    virtualized
                    bordered
                    cellBordered
                    data={tableFilterValue === '' ? data : displayTableData}
                    rowKey="id"
                    autoHeight
                  >
                    <Column flexGrow={1} align="left">
                      <HeaderCell>
                        <h5>Started</h5>
                      </HeaderCell>
                      <Cell style={{ fontSize: '17px' }} dataKey="start_time" />
                    </Column>
                    <Column flexGrow={1} align="left" fixed>
                      <HeaderCell>
                        <h5>Duration (s) </h5>
                      </HeaderCell>
                      <Cell style={{ fontSize: '17px' }} dataKey="duration" />
                    </Column>
                    <Column flexGrow={1} align="left" fixed>
                      <HeaderCell>
                        <h5>Event</h5>
                      </HeaderCell>
                      <Cell style={{ fontSize: '17px' }} dataKey="event" />
                    </Column>
                    <Column flexGrow={1} align="left" fixed>
                      <HeaderCell>
                        <h5>Organization</h5>
                      </HeaderCell>
                      <Cell style={{ fontSize: '17px' }} dataKey="organization" />
                    </Column>
                    <Column flexGrow={1} width={180} align="left" fixed>
                      <HeaderCell>
                        <h5>Status</h5>
                      </HeaderCell>
                      <Cell style={{ fontSize: '17px' }}>
                        {(rowData) => {
                          if (rowData.status) {
                            if (rowData.status === 'Success') {
                              return (
                                <span
                                  style={{
                                    cursor: 'pointer',
                                    fontSize: '19px',
                                  }}
                                >
                                  <SuccessStatus color="#378f17" />
                                </span>
                              );
                            } else {
                              return (
                                <span
                                  style={{
                                    cursor: 'pointer',
                                    fontSize: '19px',
                                  }}
                                >
                                  <FailedStatus color="#de1655" />
                                </span>
                              );
                            }
                          }
                        }}
                      </Cell>
                    </Column>
                    <Column flexGrow={1} align="left" fixed>
                      <HeaderCell>
                        <h5>Action</h5>
                      </HeaderCell>
                      <Cell>
                        {(rowData) => {
                          return (
                            <ButtonToolbar>
                              <IconButton
                                size="sm"
                                title="View Output"
                                icon={<PiEyeBold />}
                                onClick={() => {
                                  setOpenWithHeader(true);
                                  setPipelineOutput(rowData.output);
                                }}
                              />
                              {(isSuperAdmin || isAdmin) && (
                                <IconButton
                                  size="sm"
                                  title="Delete"
                                  icon={<MdDelete />}
                                  onClick={() => handleDelete(rowData.id)}
                                />
                              )}
                            </ButtonToolbar>
                          );
                        }}
                      </Cell>
                    </Column>
                  </Table>
                  <Pagination
                    style={{
                      backgroundColor: isDark == 'dark' ? darkBgColor : lightBgColor,
                    }}
                    prev
                    next
                    first
                    last
                    ellipsis
                    boundaryLinks
                    maxButtons={2}
                    size="lg"
                    layout={['-', 'total', '|', 'limit', 'pager']}
                    total={allPipelineRun?.total_items ? allPipelineRun?.total_items : 0}
                    limitOptions={[5, 10, 25, 50, 100]}
                    limit={pageSize}
                    activePage={allPipelineRun?.page}
                    onChangePage={(v) => handlePagination(v)}
                    onChangeLimit={(v) => handleChangeLimit(v)}
                  />
                </div>
              )}
              <AlertModal
                open={open}
                setOpen={setOpen}
                content={'Do you want to delete the pipeline?'}
                handleConfirmed={handleConfirmed}
              />
              <Drawer open={openWithHeader} onClose={() => setOpenWithHeader(false)}>
                <Drawer.Header>
                  <Drawer.Title>
                    <p
                      style={{
                        marginTop: '5px',
                        fontSize: '19px',
                        fontWeight: 'bold',
                      }}
                    >
                      Output
                    </p>
                  </Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                  <p
                    style={{
                      fontWeight: '700',
                      fontFamily: 'monospace',
                      backgroundColor: isDark === 'dark' ? darkColor : '#f6f8fa',
                      padding: '4px 6px',
                      borderRadius: '4px',
                      position: 'relative',
                    }}
                    dangerouslySetInnerHTML={{
                      __html: pipelineOutput.replace(/\n/g, '<br>'),
                    }}
                  />
                </Drawer.Body>
              </Drawer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pipeline;
