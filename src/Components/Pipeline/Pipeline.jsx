import React, { useContext, useEffect, useState } from 'react';
import { handleCurrPageTitle } from '../../Redux/slices/navSlice.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPipelines } from '../../Redux/slices/pipelineSlice.jsx';
import AuthContext from '../../Store/Auth-Context.jsx';
import styles from '../LinkManager/LinkManager.module.scss';
import { Button, Drawer, Loader } from 'rsuite';
import { Table } from 'rsuite';
import SuccessStatus from '@rsuite/icons/CheckRound';
import FailedStatus from '@rsuite/icons/WarningRound';

const { Column, HeaderCell, Cell } = Table;

const { tableContainer } = styles;

const apiURL = `${process.env.REACT_APP_LM_REST_API_URL}/events`;

const Pipeline = () => {
  const authCtx = useContext(AuthContext);
  const { allPipelines, isPipelineLoading } = useSelector((state) => state.pipelines);
  const dispatch = useDispatch();
  const wbePath = location.pathname?.includes('wbe');

  const [openWithHeader, setOpenWithHeader] = useState(false);
  const [pipelineOutput, setPipelineOutput] = useState('');

  useEffect(() => {
    dispatch(handleCurrPageTitle('Pipelines Results'));
    dispatch(
      fetchPipelines({
        url: `${apiURL}?type=Pipeline`,
        token: authCtx.token,
      }),
    );
  }, []);

  /* eslint-disable indent */
  const data = !allPipelines.items
    ? []
    : allPipelines.items.map((item) => {
        return {
          id: item.id,
          event: item.name,
          filename: '', // item.filename,
          status: '',
          output: '',
          children: item.pipelines
            ? item.pipelines.map((item) => {
                return {
                  id: item.id + 1000,
                  event: '',
                  filename: item.filename,
                  status: '',
                  output: '',
                  children: item.pipeline_runs
                    ? item.pipeline_runs.map((item) => {
                        return {
                          id: item.id + 10000,
                          event: '',
                          filename: '',
                          status: item.status ? 'Success' : 'Failed',
                          output: item.output.toString(),
                        };
                      })
                    : [],
                };
              })
            : [],
        };
      });

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
                  isTree
                  defaultExpandAllRows
                  bordered
                  cellBordered
                  data={data}
                  rowKey="id"
                  height={520}
                >
                  <Column flexGrow={1}>
                    <HeaderCell>
                      <h5 className="column-center">Id</h5>
                    </HeaderCell>
                    <Cell style={{ fontSize: '17px' }} dataKey="id" />
                  </Column>
                  <Column flexGrow={1} align="center" fixed>
                    <HeaderCell>
                      <h5>Event</h5>
                    </HeaderCell>
                    <Cell style={{ fontSize: '17px' }} dataKey="event" />
                  </Column>
                  <Column flexGrow={1} align="center" fixed>
                    <HeaderCell>
                      <h5>Script</h5>
                    </HeaderCell>
                    <Cell style={{ fontSize: '17px' }} dataKey="filename" />
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
                                style={{ cursor: 'pointer', fontSize: '19px' }}
                                onClick={() => {
                                  setOpenWithHeader(true);
                                  setPipelineOutput(rowData.output);
                                }}
                              >
                                <SuccessStatus color="#378f17" />
                              </span>
                            );
                          } else {
                            return (
                              <span
                                style={{ cursor: 'pointer', fontSize: '19px' }}
                                onClick={() => {
                                  setOpenWithHeader(true);
                                  setPipelineOutput(rowData.output);
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
                  <Column flexGrow={1} align="center" fixed>
                    <HeaderCell>
                      <h5>Output</h5>
                    </HeaderCell>
                    <Cell style={{ fontSize: '17px' }} dataKey="output" />
                  </Column>
                </Table>
              )}
              <Drawer open={openWithHeader} onClose={() => setOpenWithHeader(false)}>
                <Drawer.Header>
                  <Drawer.Title>
                    <h5 style={{ marginTop: '5px' }}>Output</h5>
                  </Drawer.Title>
                  <Drawer.Actions>
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
                  </Drawer.Actions>
                </Drawer.Header>
                <Drawer.Body>
                  <p style={{ fontSize: '19px', fontWeight: '400' }}>{pipelineOutput}</p>
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
