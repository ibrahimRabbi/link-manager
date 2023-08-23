import React, { useContext, useEffect, useState } from 'react';
import { handleCurrPageTitle } from '../../Redux/slices/navSlice.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPipelines } from '../../Redux/slices/pipelineSlice.jsx';
import AuthContext from '../../Store/Auth-Context.jsx';
import styles from '../LinkManager/LinkManager.module.scss';
import { darkColor } from '../../App.jsx';
import {
  // Button,
  Drawer,
  Loader,
  Message,
  toaster,
} from 'rsuite';
import { Table } from 'rsuite';
import SuccessStatus from '@rsuite/icons/CheckRound';
import FailedStatus from '@rsuite/icons/WarningRound';
import { PiEyeBold } from 'react-icons/pi';
const { Column, HeaderCell, Cell } = Table;

const { tableContainer } = styles;

const apiURL = `${import.meta.env.VITE_LM_REST_API_URL}/events`;

const Pipeline = () => {
  const { allPipelines, isPipelineLoading } = useSelector((state) => state.pipelines);
  const { isDark } = useSelector((state) => state.nav);
  const { sourceDataList, isWbe } = useSelector((state) => state.links);
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const wbePath = location.pathname?.includes('wbe');

  const [openWithHeader, setOpenWithHeader] = useState(false);
  const [pipelineOutput, setPipelineOutput] = useState('');
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
    dispatch(handleCurrPageTitle('Pipelines Results'));
    let getUrl = `${apiURL}`;
    if (isWbe) {
      if (sourceDataList?.appName) {
        getUrl = `${getUrl}?application_type=${sourceDataList?.appName}`;
      }

      if (sourceDataList?.AppName) {
        getUrl = `${getUrl}?application_type=${sourceDataList?.AppName}`;
      }
    }

    dispatch(
      fetchPipelines({
        url: getUrl,
        token: authCtx.token,
        showNotification: showNotification,
      }),
    );
  }, []);

  /* eslint-disable indent */

  const results = [];

  !allPipelines.items
    ? []
    : allPipelines.items.forEach((event) => {
        event.pipelines.forEach((pipeline) => {
          pipeline.pipeline_runs.forEach((run) => {
            results.push({
              id: run.id,
              start_time: new Date(run.start_time).toLocaleString('en-US', {
                hour12: true,
              }),
              duration: (new Date(run.end_time) - new Date(run.start_time)) / 1000,
              filename: pipeline.filename,
              status: run.status ? 'Success' : 'Failed',
              output: run.output,
            });
          });
        });
      });

  /* eslint-disable indent */
  // const data = !allPipelines.items
  //   ? []
  //   : allPipelines.items.map((item) => {
  //       return {
  //         id: item.id,
  //         event: item.name,
  //         filename: '', // item.filename,
  //         status: '',
  //         output: '',
  //         children: item.pipelines
  //           ? item.pipelines.map((item) => {
  //               return {
  //                 id: item.id + 1000,
  //                 event: '',
  //                 filename: item.filename,
  //                 status: '',
  //                 output: '',
  //                 children: item.pipeline_runs
  //                   ? item.pipeline_runs.map((item) => {
  //                       return {
  //                         id: item.id + 10000,
  //                         event: '',
  //                         filename: '',
  //                         status: item.status ? 'Success' : 'Failed',
  //                         output: item.output.toString(),
  //                       };
  //                     })
  //                   : [],
  //               };
  //             })
  //           : [],
  //       };
  //     });

  return (
    <div>
      <div className={wbePath ? 'wbeNavSpace' : ''}>
        <div className="mainContainer">
          <div className="container">
            <div className={tableContainer}>
              {isPipelineLoading && (
                <Loader
                  backdrop
                  center
                  size="md"
                  vertical
                  style={{ zIndex: '10', marginTop: '200px' }}
                />
              )}

              {allPipelines.items && (
                <Table
                  virtualized
                  // isTree
                  // defaultExpandAllRows
                  bordered
                  cellBordered
                  data={results}
                  rowKey="id"
                  autoHeight
                >
                  <Column flexGrow={1}>
                    <HeaderCell>
                      <h5 className="column-center">Started</h5>
                    </HeaderCell>
                    <Cell style={{ fontSize: '17px' }} dataKey="start_time" />
                  </Column>
                  <Column flexGrow={1} align="center" fixed>
                    <HeaderCell>
                      <h5>Duration (s) </h5>
                    </HeaderCell>
                    <Cell style={{ fontSize: '17px' }} dataKey="duration" />
                  </Column>
                  <Column flexGrow={1} align="center" fixed>
                    <HeaderCell>
                      <h5>Event</h5>
                    </HeaderCell>
                    <Cell style={{ fontSize: '17px' }} dataKey="event" />
                  </Column>
                  <Column flexGrow={1} width={180} align="center" fixed>
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
                                // onClick={() => {
                                //   setOpenWithHeader(true);
                                //   setPipelineOutput(rowData.output);
                                // }}
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
                                // onClick={() => {
                                //   setOpenWithHeader(true);
                                //   setPipelineOutput(rowData.output);
                                // }}
                              >
                                <FailedStatus color="#de1655" />
                              </span>
                            );
                          }
                        }
                      }}
                    </Cell>
                  </Column>
                  <Column flexGrow={1} align="center" fixed>
                    <HeaderCell>
                      <h5>View Output</h5>
                    </HeaderCell>
                    <Cell>
                      {(rowData) => {
                        if (rowData.output) {
                          return (
                            <PiEyeBold
                              onClick={() => {
                                setOpenWithHeader(true);
                                setPipelineOutput(rowData.output);
                              }}
                            />
                          );
                        }
                      }}
                    </Cell>
                  </Column>
                </Table>
              )}
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
                  {/* <Drawer.Actions>
                    <Button
                      onClick={() => {
                        setOpenWithHeader(false);
                        setPipelineOutput('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        setOpenWithHeader(false);
                        setPipelineOutput('');
                      }}
                      appearance="primary"
                    >
                      Ok
                    </Button>
                  </Drawer.Actions> */}
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
