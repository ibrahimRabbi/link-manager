import React, { useContext, useEffect, useState } from 'react';
import { handleCurrPageTitle } from '../../Redux/slices/navSlice.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPipelines } from '../../Redux/slices/pipelineSlice.jsx';
import AuthContext from '../../Store/Auth-Context.jsx';
import styles from '../LinkManager/LinkManager.module.scss';
import { Button, Drawer, Loader } from 'rsuite';

import { Table } from 'rsuite';

const { Column, HeaderCell, Cell } = Table;

const { tableContainer } = styles;

const apiURL = `${process.env.REACT_APP_LM_REST_API_URL}/events`;

const Pipeline = () => {
  const authCtx = useContext(AuthContext);
  const { allPipelines, isPipelineLoading } = useSelector((state) => state.pipelines);
  const dispatch = useDispatch();
  const wbePath = location.pathname?.includes('wbe');

  const [openWithHeader, setOpenWithHeader] = useState(false);

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
                  content="Loading..."
                  style={{ zIndex: '10' }}
                />
              )}

              {allPipelines.items && (
                <Table
                  isTree
                  defaultExpandAllRows
                  bordered
                  cellBordered
                  data={data}
                  rowKey="id"
                  height={520}
                >
                  <Column flexGrow={1}>
                    <HeaderCell>Id</HeaderCell>
                    <Cell dataKey="id" />
                  </Column>
                  <Column flexGrow={1}>
                    <HeaderCell>Event</HeaderCell>
                    <Cell dataKey="event" />
                  </Column>
                  <Column flexGrow={1}>
                    <HeaderCell>Script</HeaderCell>
                    <Cell dataKey="filename" />
                  </Column>
                  <Column flexGrow={1} width={180}>
                    <HeaderCell>Status</HeaderCell>
                    <Cell onClick={() => setOpenWithHeader(true)}>
                      {(rowData) => {
                        if (rowData.status === 'Success') {
                          return <span>✅</span>;
                        } else {
                          return <span>❌</span>;
                        }
                      }}
                    </Cell>
                  </Column>
                  <Column flexGrow={1}>
                    <HeaderCell>Output</HeaderCell>
                    <Cell dataKey="output" />
                  </Column>
                  <Column flexGrow={1}>
                    <HeaderCell>Children</HeaderCell>
                    <Cell>
                      <Drawer
                        open={openWithHeader}
                        onClose={() => setOpenWithHeader(false)}
                      >
                        <Drawer.Header>
                          <Drawer.Title>Output</Drawer.Title>
                          <Drawer.Actions>
                            <Button onClick={() => setOpenWithHeader(false)}>
                              Cancel
                            </Button>
                            <Button
                              onClick={() => setOpenWithHeader(false)}
                              appearance="primary"
                            >
                              Confirm
                            </Button>
                          </Drawer.Actions>
                        </Drawer.Header>
                        <Drawer.Body>
                          <p>hi</p>
                          <p>{(rowData) => rowData.output}</p>
                        </Drawer.Body>
                      </Drawer>
                    </Cell>
                  </Column>
                </Table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pipeline;
