import React, { useContext, useEffect } from 'react';
import {
  handleCurrPageTitle,
  handleIsProfileOpen,
} from '../../Redux/slices/navSlice.jsx';
import { useDispatch, useSelector } from 'react-redux';
import UseLoader from '../Shared/UseLoader.jsx';
import { fetchPipelines } from '../../Redux/slices/pipelineSlice.jsx';
import AuthContext from '../../Store/Auth-Context.jsx';

import { Table } from 'rsuite';

const { Column, HeaderCell, Cell } = Table;

const apiURL = `${process.env.REACT_APP_LM_REST_API_URL}/pipelines`;

const Pipeline = () => {
  const authCtx = useContext(AuthContext);
  const { allPipelines, isPipelineLoading } = useSelector((state) => state.pipelines);
  const { isProfileOpen } = useSelector((state) => state.nav);
  const dispatch = useDispatch();
  const wbePath = location.pathname?.includes('wbe');

  useEffect(() => {
    dispatch(handleCurrPageTitle('Pipelines'));
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
          event: item.event,
          filename: item.filename,
          status: '',
          output: '',
          children: item.pipeline_runs
            ? item.pipeline_runs.map((item) => {
                return {
                  id: item.id,
                  event: '',
                  filename: '',
                  status: item.status ? 'Success' : 'Failed',
                  output: item.output.toString(),
                };
              })
            : [],
        };
      });

  return (
    <div>
      <div
        onClick={() => dispatch(handleIsProfileOpen(isProfileOpen && false))}
        className={wbePath ? 'wbeNavSpace' : ''}
      >
        {isPipelineLoading ? (
          <UseLoader />
        ) : (
          <div className="graphContainer">
            {allPipelines.items && (
              <Table
                isTree
                defaultExpandAllRows
                bordered
                cellBordered
                data={data}
                rowKey="id"
              >
                <Column flexGrow={1}>
                  <HeaderCell>Id</HeaderCell>
                  <Cell dataKey="id" />
                </Column>
                <Column flexGrow={1}>
                  <HeaderCell>Event</HeaderCell>
                  <Cell dataKey="event.name" />
                </Column>
                <Column flexGrow={1}>
                  <HeaderCell>Script</HeaderCell>
                  <Cell dataKey="filename" />
                </Column>
                <Column flexGrow={1}>
                  <HeaderCell>Status</HeaderCell>
                  <Cell dataKey="status" />
                </Column>
                <Column flexGrow={1}>
                  <HeaderCell>Output</HeaderCell>
                  <Cell dataKey="output" />
                </Column>
              </Table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pipeline;
