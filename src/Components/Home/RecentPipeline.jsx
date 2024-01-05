/* eslint-disable indent */
import React from 'react';
import { PiEyeBold } from 'react-icons/pi';
import { Drawer, Table } from 'rsuite';
const { Column, HeaderCell, Cell } = Table;
import SuccessStatus from '@rsuite/icons/CheckRound';
import FailedStatus from '@rsuite/icons/WarningRound';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { darkColor } from '../../App.jsx';

const RecentPipeline = ({ recentPipelines }) => {
  const { isDark } = useSelector((state) => state.nav);
  const [openWithHeader, setOpenWithHeader] = useState(false);
  const [pipelineOutput, setPipelineOutput] = useState('');
  const data = !recentPipelines?.items
    ? []
    : recentPipelines?.items.map((recentPipeline) => {
        return {
          id: recentPipeline?.id,
          event: recentPipeline?.pipeline?.event?.name,
          organization: recentPipeline?.pipeline?.event?.application?.organization?.name,
          start_time: new Date(recentPipeline?.start_time).toLocaleString('en-US', {
            hour12: true,
          }),
          duration:
            (new Date(recentPipeline?.end_time) - new Date(recentPipeline?.start_time)) /
            1000,
          script: recentPipeline?.pipeline?.filename,
          status: recentPipeline?.status ? 'Success' : 'Failed',
          output: recentPipeline?.output,
        };
      });
  return (
    <div>
      <Table virtualized bordered cellBordered data={data} rowKey="id" autoHeight>
        <Column flexGrow={1} align="center">
          <HeaderCell>
            <h6>Started</h6>
          </HeaderCell>
          <Cell style={{ fontSize: '17px' }} dataKey="start_time" />
        </Column>
        <Column flexGrow={1} align="center" fixed>
          <HeaderCell>
            <h6>Duration (s) </h6>
          </HeaderCell>
          <Cell style={{ fontSize: '17px' }} dataKey="duration" />
        </Column>
        <Column flexGrow={1} align="center" fixed>
          <HeaderCell>
            <h6>Script</h6>
          </HeaderCell>
          <Cell style={{ fontSize: '17px' }} dataKey="script" />
        </Column>
        <Column flexGrow={1} align="center" fixed>
          <HeaderCell>
            <h6>Event</h6>
          </HeaderCell>
          <Cell style={{ fontSize: '17px' }} dataKey="event" />
        </Column>
        <Column flexGrow={1} align="center" fixed>
          <HeaderCell>
            <h6>Organization</h6>
          </HeaderCell>
          <Cell style={{ fontSize: '17px' }} dataKey="organization" />
        </Column>
        <Column flexGrow={1} width={180} align="center" fixed>
          <HeaderCell>
            <h6>Status</h6>
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

        <Column flexGrow={1} align="center" fixed>
          <HeaderCell>
            <h6>View Output</h6>
          </HeaderCell>
          <Cell>
            {(rowData) => {
              if (rowData.output) {
                return (
                  <PiEyeBold
                    style={{ cursor: 'pointer', fontSize: '19px' }}
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
      <Drawer open={openWithHeader} onClose={() => setOpenWithHeader(false)}>
        <Drawer.Header>
          <Drawer.Title>
            <p
              style={{
                marginTop: '5px',
                fontSize: '17px',
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
  );
};

export default RecentPipeline;
