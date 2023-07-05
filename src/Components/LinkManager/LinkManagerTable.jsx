import React, { useMemo, useState } from 'react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import MoreIcon from '@rsuite/icons/legacy/More';
import SuccessStatus from '@rsuite/icons/CheckRound';
import FailedStatus from '@rsuite/icons/WarningRound';
import InfoStatus from '@rsuite/icons/InfoRound';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Button, Dropdown, IconButton, Popover, Whisper } from 'rsuite';
import cssStyles from './LinkManager.module.scss';
import { useSelector } from 'react-redux';
const { table_row_dark, table_row_light } = cssStyles;

// OSLC API URLs
const jiraURL = `${process.env.REACT_APP_JIRA_DIALOG_URL}`;
const gitlabURL = `${process.env.REACT_APP_GITLAB_DIALOG_URL}`;
const glideURL = `${process.env.REACT_APP_GLIDE_DIALOG_URL}`;
const valispaceURL = `${process.env.REACT_APP_VALISPACE_DIALOG_URL}`;
const codebeamerURL = `${process.env.REACT_APP_CODEBEAMER_DIALOG_URL}`;

const LinkManagerTable = ({ props }) => {
  const { data, handleDeleteLink } = props;
  const { isDark } = useSelector((state) => state.nav);
  const [actionData, setActionData] = useState({});

  // Action table cell control
  const renderMenu = ({ onClose, left, top, className }, ref) => {
    const handleSelect = (key) => {
      if (key === 1) {
        //
      } else if (key === 2) {
        //
      } else if (key === 3) {
        //
      } else if (key === 4) {
        //
      } else if (key === 5) {
        handleDeleteLink(actionData);
      }
      onClose();
    };
    return (
      <Popover ref={ref} className={className} style={{ left, top }} full>
        <Dropdown.Menu onSelect={handleSelect} style={{ fontSize: '17px' }}>
          <Dropdown.Item eventKey={1}>Details</Dropdown.Item>
          <Dropdown.Item eventKey={2}>Edit</Dropdown.Item>
          <Dropdown.Item eventKey={3}>Set Status - Valid </Dropdown.Item>
          <Dropdown.Item eventKey={4}>Set Status - Invalid</Dropdown.Item>
          <Dropdown.Item eventKey={5}>Delete</Dropdown.Item>
        </Dropdown.Menu>
      </Popover>
    );
  };

  // target cell
  const targetCell = (row) => {
    const rowData = row?.original;
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
    const providerId = rowData?.provider_id ? rowData?.provider_id : '';
    const type = rowData?.Type ? rowData?.Type : '';
    const resourceId = rowData?.resource_id ? rowData?.resource_id : '';
    const branch = rowData?.branch_name ? rowData?.branch_name : '';
    const content = rowData?.content ? rowData?.content : '';
    const selectedLine = rowData?.selected_lines ? rowData?.selected_lines : '';
    const koatlPath = rowData?.koatl_path ? rowData?.koatl_path : '';

    // eslint-disable-next-line max-len
    const uiPreviewURL = `${oslcObj?.URL}/oslc/provider/${providerId}/resources/${type}/${resourceId}/smallPreview?branch_name=${branch}&file_content=${content}&file_lines=${selectedLine}&file_path=${koatlPath}`;

    const speaker = (
      <Popover title="Preview">
        <iframe src={uiPreviewURL} width="450" height="300" />
      </Popover>
    );

    return (
      <div style={{ marginLeft: '10px' }}>
        <Whisper
          trigger="hover"
          enterable
          placement="auto"
          speaker={speaker}
          delayOpen={800}
          delayClose={800}
        >
          <a
            href={rowData?.id}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '17px' }}
          >
            {rowData?.content_lines
              ? rowData?.name?.length > 15
                ? rowData?.name?.slice(0, 15 - 1) +
                  '...' +
                  ' [' +
                  rowData?.content_lines +
                  ']'
                : rowData?.name + ' [' + rowData?.content_lines + ']'
              : rowData?.name}
          </a>
        </Whisper>
      </div>
    );
  };

  // Status cell
  const statusCell = (row, getValue) => {
    const status = getValue();
    return (
      <div
        style={{
          paddingLeft: `${row.depth * 2}rem`,
          marginLeft: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IndeterminateCheckbox
            style={{
              height: '15px',
              width: '15px',
              cursor: 'pointer',
              marginRight: '2px',
              marginBottom: '-3px',
            }}
            checked={row.getIsSelected()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
          {row.getCanExpand() ? (
            <h5
              onClick={row.getToggleExpandedHandler()}
              style={{ cursor: 'pointer', margin: '0 3px 0 2px' }}
            >
              {row.getIsExpanded() ? (
                <MdExpandLess style={{ marginBottom: '-7px' }} size={22} />
              ) : (
                <MdExpandMore style={{ marginBottom: '-7px' }} size={22} />
              )}
            </h5>
          ) : (
            <h5 style={{ margin: '0 5px' }}>{'🔵'}</h5>
          )}{' '}
          <h5 style={{ marginLeft: '20px' }}>
            {status?.toLowerCase() === 'active' ? (
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
      </div>
    );
  };

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'status',
        header: ({ table }) => (
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '3px', margin: '10px' }}
          >
            <IndeterminateCheckbox
              style={{ height: '16px', width: '16px', cursor: 'pointer' }}
              checked={table.getIsAllRowsSelected()}
              indeterminate={table.getIsSomeRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
            />{' '}
            <IconButton
              style={{ height: '20px', marginRight: '10px' }}
              onClick={table.getToggleAllRowsExpandedHandler()}
              icon={table.getIsAllRowsExpanded() ? <MdExpandLess /> : <MdExpandMore />}
              size="xs"
            />
            <h6>Status</h6>
          </div>
        ),
        cell: ({ row, getValue }) => statusCell(row, getValue),
        footer: (props) => props.column.id,
      },
      // Link type cell
      {
        accessorKey: 'link_type',
        header: () => (
          <div style={{ margin: '10px' }}>
            <h6 style={{ textAlign: 'start' }}>Link Type</h6>
          </div>
        ),
        cell: (info) => (
          <div style={{ marginLeft: '10px' }}>
            <p>{info.getValue()}</p>
          </div>
        ),
        footer: (props) => props.column.id,
      },
      // target cell
      {
        accessorKey: 'name',
        header: () => (
          <div style={{ margin: '10px' }}>
            <h6 style={{ textAlign: 'start' }}>Target</h6>
          </div>
        ),
        cell: ({ row }) => targetCell(row),
        footer: (props) => props.column.id,
      },
      // Action cell
      {
        accessorKey: 'id',
        header: () => (
          <div style={{ margin: '10px' }}>
            <h6 style={{ textAlign: 'start' }}>Actions</h6>
          </div>
        ),
        cell: ({ row }) => (
          <div style={{ marginLeft: '10px' }}>
            <Whisper placement="auto" trigger="click" speaker={renderMenu}>
              <IconButton
                appearance="subtle"
                icon={<MoreIcon />}
                onClick={() => setActionData(row)}
              />
            </Whisper>
          </div>
        ),
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
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div>
      <table style={{ padding: '20px', width: '100%', border: '1px solid lightgray' }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(header.column.columnDef.header, header.getContext())}

                        {header.column.getCanFilter() ? (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              margin: '0 10px',
                            }}
                          >
                            <Filter
                              column={header.column}
                              table={table}
                              isAction={
                                header.index === 0 || header.index === 3 ? false : true
                              }
                            />
                          </div>
                        ) : null}
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
              style={{
                height: '40px',
                '&:hover': {
                  backgroundColor: 'red',
                },
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '10px',
          border: '1px solid lightgray',
        }}
      >
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Rows per page {pageSize}
            </option>
          ))}
        </select>

        <Button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          appearance="default"
        >
          {'<<'}
        </Button>
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          appearance="default"
        >
          {'<'}
        </Button>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          appearance="default"
        >
          {'>'}
        </Button>
        <Button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          appearance="default"
        >
          {'>>'}
        </Button>

        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>

        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            style={{ border: '1px solid lightgray', width: '60px', borderRadius: '3px' }}
          />
        </span>
      </div>
    </div>
  );
};

function Filter({ column, table, isAction }) {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === 'number' ? (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '0 10px' }}
    >
      <input
        type="number"
        value={columnFilterValue?.[0] ?? ''}
        onChange={(e) => column.setFilterValue((old) => [e.target.value, old?.[1]])}
        placeholder={'Min'}
        style={{ border: '1px solid lightgray', borderRadius: '3px' }}
      />
      <input
        type="number"
        value={columnFilterValue?.[1] ?? ''}
        onChange={(e) => column.setFilterValue((old) => [old?.[0], e.target.value])}
        placeholder={'Max'}
        style={{ border: '1px solid lightgray', borderRadius: '3px' }}
      />
    </div>
  ) : (
    isAction && (
      <input
        type="text"
        value={columnFilterValue ?? ''}
        onChange={(e) => column.setFilterValue(e.target.value)}
        placeholder={'Search...'}
        style={{ border: '1px solid lightgray', borderRadius: '3px' }}
      />
    )
  );
}

function IndeterminateCheckbox({ indeterminate, className = '', ...rest }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + ' cursor-pointer'}
      {...rest}
    />
  );
}

export default LinkManagerTable;
