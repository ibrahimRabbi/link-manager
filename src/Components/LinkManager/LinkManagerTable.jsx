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
import { Button, Dropdown, IconButton, Input, Popover, Whisper } from 'rsuite';
import cssStyles from './LinkManager.module.scss';
import { useSelector } from 'react-redux';
import CustomFilterSelect from './CustomFilterSelect';
const {
  table_row_dark,
  table_row_light,
  statusCellStyle,
  checkBox,
  uiPreviewStyle,
  toggleExpand,
  emptyBall,
  statusIcon,
  statusHeader,
  headerCheckBox,
  headerExpand,
  headerCell,
  dataCell,
  tableStyle,
  paginationContainer,
  filterContainer,
  pageTitle,
  pageInput,
  numberFilter,
  filterInput,
  emptyTableContent,
} = cssStyles;

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
      <div className={uiPreviewStyle}>
        <Whisper
          trigger="hover"
          enterable
          placement="auto"
          speaker={speaker}
          delayOpen={800}
          delayClose={800}
        >
          <a href={rowData?.id} target="_blank" rel="noopener noreferrer">
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
        <div className={statusCellStyle}>
          <IndeterminateCheckbox
            className={checkBox}
            checked={row.getIsSelected()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
          {row.getCanExpand() ? (
            <h5 onClick={row.getToggleExpandedHandler()} className={toggleExpand}>
              {row.getIsExpanded() ? (
                <MdExpandLess style={{ marginBottom: '-7px' }} size={22} />
              ) : (
                <MdExpandMore style={{ marginBottom: '-7px' }} size={22} />
              )}
            </h5>
          ) : (
            <h5 className={emptyBall}>{'🔵'}</h5>
          )}{' '}
          <h5 className={statusIcon}>
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
          <div className={statusHeader}>
            <IndeterminateCheckbox
              className={headerCheckBox}
              checked={table.getIsAllRowsSelected()}
              indeterminate={table.getIsSomeRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
            />{' '}
            <IconButton
              className={headerExpand}
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
          <div className={headerCell}>
            <h6>Link Type</h6>
          </div>
        ),
        cell: (info) => (
          <div className={dataCell}>
            <p>{info.getValue()}</p>
          </div>
        ),
        footer: (props) => props.column.id,
      },
      // target cell
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
      // Action cell
      {
        accessorKey: 'id',
        header: () => (
          <div className={headerCell}>
            <h6>Actions</h6>
          </div>
        ),
        cell: ({ row }) => (
          <div className={dataCell}>
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
      <table className={tableStyle}>
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
                          <div className={filterContainer}>
                            {table.getRowModel().rows[0] && (
                              <Filter
                                column={header.column}
                                table={table}
                                isAction={header.index === 3 ? true : false}
                                isStatusFilter={header.index === 0 ? true : false}
                              />
                            )}
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

      {!table.getRowModel().rows[0] && <p className={emptyTableContent}>No Data Found</p>}

      <div className={paginationContainer}>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[5, 10, 25, 50, 100].map((pageSize) => (
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

        <span className={pageTitle}>
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>

        <span className={pageTitle}>
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className={pageInput}
          />
        </span>
      </div>
    </div>
  );
};

function Filter({ column, table, isAction, isStatusFilter }) {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const statusFilterItems = [
    {
      icon: <SuccessStatus color="#378f17" />,
      label: 'Active',
      value: 'active',
    },
    {
      icon: <FailedStatus color="#de1655" />,
      label: 'Invalid',
      value: 'invalid',
    },
    {
      icon: <InfoStatus color="#25b3f5" />,
      label: 'Suspect',
      value: 'suspect',
    },
  ];

  return typeof firstValue === 'number' ? (
    <div className={numberFilter}>
      <input
        type="number"
        value={columnFilterValue?.[0] ?? ''}
        onChange={(e) => column.setFilterValue((old) => [e.target.value, old?.[1]])}
        placeholder={'Min'}
      />
      <input
        type="number"
        value={columnFilterValue?.[1] ?? ''}
        onChange={(e) => column.setFilterValue((old) => [old?.[0], e.target.value])}
        placeholder={'Max'}
        className={filterInput}
      />
    </div>
  ) : (
    <>
      {!isAction && !isStatusFilter && (
        <Input
          type="text"
          value={columnFilterValue ?? ''}
          onChange={(value) => column.setFilterValue(value)}
          placeholder={'Search...'}
          size="sm"
          className={filterInput}
        />
      )}

      {isStatusFilter && (
        <CustomFilterSelect
          items={statusFilterItems}
          placeholder="Search by status"
          onChange={(value) => {
            if (value) column.setFilterValue(value);
            else {
              column.setFilterValue('');
            }
          }}
        />
      )}
    </>
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
