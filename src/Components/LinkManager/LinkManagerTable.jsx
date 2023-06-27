import React, { useMemo, useState } from 'react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import {
  // Column,
  // Table,
  // ExpandedState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  // ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { makeData } from './makeData';
import { Button } from 'rsuite';

const LinkManagerTable = () => {
  const rerender = useState({})[1];
  const columns = useMemo(
    () => [
      {
        header: 'Name',
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: 'firstName',
            header: ({ table }) => (
              <>
                <IndeterminateCheckbox
                  checked={table.getIsAllRowsSelected()}
                  indeterminate={table.getIsSomeRowsSelected()}
                  onChange={table.getToggleAllRowsSelectedHandler()}
                />{' '}
                <button
                  onClick={table.getToggleAllRowsExpandedHandler()}
                  style={{ cursor: 'pointer' }}
                >
                  {table.getIsAllRowsExpanded() ? <MdExpandLess /> : <MdExpandMore />}
                </button>{' '}
                First Name
              </>
            ),
            cell: ({ row, getValue }) => (
              <div
                style={{
                  paddingLeft: `${row.depth * 2}rem`,
                }}
              >
                <>
                  <IndeterminateCheckbox
                    checked={row.getIsSelected()}
                    indeterminate={row.getIsSomeSelected()}
                    onChange={row.getToggleSelectedHandler()}
                  />{' '}
                  {row.getCanExpand() ? (
                    <Button
                      appearance=""
                      onClick={row.getToggleExpandedHandler()}
                      style={{ cursor: 'pointer' }}
                    >
                      {row.getIsExpanded() ? <MdExpandLess /> : <MdExpandMore />}
                    </Button>
                  ) : (
                    '🔵'
                  )}{' '}
                  {getValue()}
                </>
              </div>
            ),
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row.lastName,
            id: 'lastName',
            cell: (info) => info.getValue(),
            header: () => <span>Last Name</span>,
            footer: (props) => props.column.id,
          },
        ],
      },
      {
        header: 'Info',
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: 'age',
            header: () => <h5>Age</h5>,
            footer: (props) => props.column.id,
          },
          {
            header: 'More Info',
            columns: [
              {
                accessorKey: 'visits',
                header: () => <h5>Visits</h5>,
                footer: (props) => props.column.id,
              },
              {
                accessorKey: 'status',
                header: () => <h5>Status</h5>,
                footer: (props) => props.column.id,
              },
              {
                accessorKey: 'progress',
                header: () => <h5>Profile Progress</h5>,
                footer: (props) => props.column.id,
              },
            ],
          },
        ],
      },
    ],
    [],
  );

  const [data, setData] = useState(() => makeData(100, 5, 3));
  const refreshData = () => setData(() => makeData(100, 5, 3));

  const [expanded, setExpanded] = useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    debugTable: true,
  });

  return (
    <div className="p-2">
      <div className="h-2" />
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanFilter() ? (
                        <div>
                          <Filter column={header.column} table={table} />
                        </div>
                      ) : null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <Button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          appearance=""
        >
          {'<<'}
        </Button>
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </Button>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          appearance=""
        >
          {'>'}
        </Button>
        <Button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          appearance=""
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
            style={{ border: '1px solid lightgray', width: '200px' }}
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>{table.getRowModel().rows.length} Rows</div>
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      <div>
        <button onClick={refreshData}>Refresh Data</button>
      </div>
      <pre>{JSON.stringify(expanded, null, 2)}</pre>
    </div>
  );
};

function Filter({ column, table }) {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === 'number' ? (
    <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px' }}>
      <input
        type="number"
        value={columnFilterValue?.[0] ?? ''}
        onChange={(e) => column.setFilterValue((old) => [e.target.value, old?.[1]])}
        placeholder={'Min'}
        style={{ width: '200px', border: '1px solid lightgray', borderRadius: '5px' }}
      />
      <input
        type="number"
        value={columnFilterValue?.[1] ?? ''}
        onChange={(e) => column.setFilterValue((old) => [old?.[0], e.target.value])}
        placeholder={'Max'}
        style={{ width: '200px', border: '1px solid lightgray', borderRadius: '5px' }}
      />
    </div>
  ) : (
    <input
      type="text"
      value={columnFilterValue ?? ''}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={'Search...'}
      style={{ width: '200px', border: '1px solid lightgray', borderRadius: '5px' }}
    />
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
    // <Checkbox
    //   ref={ref}
    //   className={className + ' cursor-pointer'}
    //   {...rest}
    // />
    <input
      type="checkbox"
      ref={ref}
      className={className + ' cursor-pointer'}
      {...rest}
    />
  );
}

export default LinkManagerTable;
