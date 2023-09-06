import React, { useMemo, useState } from 'react';
import SuccessStatus from '@rsuite/icons/CheckRound';
import FailedStatus from '@rsuite/icons/WarningRound';
import InfoStatus from '@rsuite/icons/InfoRound';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { Popover, Whisper } from 'rsuite';
import cssStyles from './RecentLink.module.scss';
import { useSelector } from 'react-redux';
// eslint-disable-next-line max-len
import ExternalPreview from '../AdminDasComponents/ExternalAppIntegrations/ExternalPreview/ExternalPreview.jsx';
// eslint-disable-next-line max-len
import { showOslcData } from '../AdminDasComponents/ExternalAppIntegrations/ExternalPreview/ExternalPreviewConfig.jsx';
const {
  table_row_dark,
  table_row_light,
  uiPreviewStyle,
  statusIcon,
  headerCell,
  dataCell,
  emptyTableContent,
  styled_table,
} = cssStyles;

// OSLC API URLs
const jiraURL = `${import.meta.env.VITE_JIRA_DIALOG_URL}`;
const gitlabURL = `${import.meta.env.VITE_GITLAB_DIALOG_URL}`;
const glideURL = `${import.meta.env.VITE_GLIDE_DIALOG_URL}`;
const valispaceURL = `${import.meta.env.VITE_VALISPACE_DIALOG_URL}`;
const codebeamerURL = `${import.meta.env.VITE_CODEBEAMER_DIALOG_URL}`;

const RecentLink = ({ recentCreatedLinks }) => {
  const { data } = recentCreatedLinks;
  const { isDark } = useSelector((state) => state.nav);

  // target cell
  const targetCell = (row) => {
    const rowData = row?.original?.target;
    const status = row?.original?.link?.status;
    // OSLC API URL Receiving conditionally
    const oslcObj = { URL: '' };
    if (
      rowData?.provider?.toLowerCase() === 'jira' ||
      rowData?.provider?.toLowerCase() === 'jira-projects'
    ) {
      oslcObj['URL'] = jiraURL;
    } else if (rowData?.provider?.toLowerCase() === 'gitlab') {
      oslcObj['URL'] = gitlabURL;
    } else if (rowData?.provider?.toLowerCase() === 'glide') {
      oslcObj['URL'] = glideURL;
    } else if (rowData?.provider?.toLowerCase() === 'valispace') {
      oslcObj['URL'] = valispaceURL;
    } else if (rowData?.provider?.toLowerCase() === 'codebeamer') {
      oslcObj['URL'] = codebeamerURL;
    }

    const speaker = (rowData, native = false) => {
      if (rowData && native) {
        return (
          <Popover>
            <ExternalPreview nodeData={rowData} status={status} />
          </Popover>
        );
      } else {
        const updatedRowData = showOslcData(rowData);
        return (
          <Popover>
            <ExternalPreview nodeData={updatedRowData} />
          </Popover>
        );
      }
    };
    return (
      <div className={uiPreviewStyle}>
        <Whisper
          trigger="hover"
          enterable
          placement="auto"
          speaker={rowData?.api ? speaker(rowData, true) : speaker(rowData)}
          delayOpen={550}
          delayClose={550}
        >
          <a
            href={rowData?.api ? rowData?.web_url : rowData?.id}
            target="_blank"
            rel="noopener noreferrer"
          >
            {rowData?.selected_lines
              ? rowData?.name?.length > 15
                ? rowData?.name?.slice(0, 15 - 1) +
                  '...' +
                  ' [' +
                  rowData?.selected_lines +
                  ']'
                : rowData?.name + ' [' + rowData?.selected_lines + ']'
              : rowData?.name}
          </a>
        </Whisper>
      </div>
    );
  };

  const statusCell = (info) => {
    const status = info?.row?.original?.link?.status;
    return (
      <div className={dataCell}>
        <h5 className={statusIcon}>
          {status?.toLowerCase() === 'active' || status === 'valid' ? (
            <SuccessStatus color="#378f17" />
          ) : status?.toLowerCase() === 'invalid' ? (
            <FailedStatus color="#de1655" />
          ) : status?.toLowerCase() === 'suspect' ? (
            <InfoStatus color="#25b3f5" />
          ) : (
            <InfoStatus color="#25b3f5" />
          )}
        </h5>
      </div>
    );
  };

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'source',
        header: () => (
          <div className={headerCell}>
            <h6>Source</h6>
          </div>
        ),
        cell: ({ row }) => (
          <p style={{ fontSize: '20px' }}>{row?.original?.source?.name}</p>
        ),
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => `${row?.link?.link_type}`,
        accessorKey: 'link_type',
        header: () => {
          return (
            <div className={headerCell}>
              <h6>Link Type</h6>
            </div>
          );
        },
        footer: (props) => props.column.id,
      },
      {
        accessorKey: 'name',
        header: () => (
          <div className={headerCell}>
            <h6>Target</h6>
          </div>
        ),
        cell: ({ row }) => targetCell(row),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: 'status',
        header: () => (
          <div className={headerCell}>
            <h6>Status</h6>
          </div>
        ),
        cell: (info) => statusCell(info),
        footer: (props) => props.column.id,
      },
    ],
    [],
  );

  const [expanded, setExpanded] = useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.children,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <table className={styled_table}>
        <thead style={{ background: 'white' }}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const status = header.id.includes('status');
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      width: status ? '120px' : '',
                      textAlign: 'center',
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={isDark === 'dark' ? table_row_dark : table_row_light}
            >
              {row.getVisibleCells().map((cell) => {
                const status = cell.id?.includes('status');
                return (
                  <td
                    key={cell.id}
                    style={{
                      width: status ? '120px' : '',
                      textAlign: 'left',
                      fontSize: '17px',
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div />

      {!table.getRowModel().rows[0] && <p className={emptyTableContent}>No Data Found</p>}
    </div>
  );
};

export default RecentLink;
