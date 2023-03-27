import { Add, Edit, TrashCan } from '@carbon/icons-react';
import {
  Button,
  DataTable,
  Pagination,
  Table,
  TableBatchAction,
  TableBatchActions,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectAll,
  TableSelectRow,
  TableToolbar,
  // TableToolbarAction,
  TableToolbarContent,
  // TableToolbarMenu,
  TableToolbarSearch,
} from '@carbon/react';
import React from 'react';

const UseTable = ({ props }) => {
  const {
    title,
    headerData,
    rowData,
    handleEdit,
    handleDelete,
    handleAddNew,
    handlePagination,
    totalItems,
    totalPages,
    pageSize,
    page,
  } = props;

  console.log(
    'totalItems: ',
    totalItems,
    ', totalPages: ',
    totalPages,
    ', page: ',
    page,
    rowData,
  );
  return (
    <div>
      <DataTable rows={rowData} headers={headerData}>
        {({
          rows,
          headers,
          getHeaderProps,
          getRowProps,
          getSelectionProps,
          getBatchActionProps,
          onInputChange,
          selectedRows,
        }) => {
          // get original data from selected rows
          selectedRows = selectedRows?.reduce((acc, curr) => {
            const value = rowData?.reduce((ac, cr) => {
              if (cr?.id === curr?.id) ac = cr;
              return ac;
            }, {});
            acc.push(value);
            return acc;
          }, []);

          return (
            <TableContainer title={title}>
              <TableToolbar>
                <TableBatchActions {...getBatchActionProps()}>
                  {/* Edit  */}
                  <TableBatchAction
                    tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                    renderIcon={Edit}
                    onClick={() => handleEdit(selectedRows)}
                  >
                    Edit
                  </TableBatchAction>

                  {/* Delete  */}
                  <TableBatchAction
                    tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                    renderIcon={TrashCan}
                    onClick={() => handleDelete(selectedRows)}
                  >
                    Delete
                  </TableBatchAction>
                </TableBatchActions>
                <TableToolbarContent>
                  <TableToolbarSearch
                    placeholder="Search User"
                    tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                    onChange={onInputChange}
                  />

                  {/* <TableToolbarMenu
                  tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                >
                  <TableToolbarAction onClick={() => console.log('Action 1')}>
                  Action 1
                  </TableToolbarAction>
                  <TableToolbarAction onClick={() => console.log('Action 2')}>
                  Action 2
                  </TableToolbarAction>
                  <TableToolbarAction onClick={() => console.log('Action 3')}>
                  Action 3
                  </TableToolbarAction>
                </TableToolbarMenu> */}

                  <Button
                    renderIcon={Add}
                    tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                    onClick={() => handleAddNew()}
                    size="md"
                    kind="primary"
                  >
                    Add New
                  </Button>
                </TableToolbarContent>
              </TableToolbar>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableSelectAll {...getSelectionProps()} />
                    {headers.map((header) => (
                      <TableHeader key={''} {...getHeaderProps({ header })}>
                        <h5>{header.header}</h5>
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows?.map((row, i) => (
                    <TableRow key={i} {...getRowProps({ row })}>
                      <TableSelectRow {...getSelectionProps({ row })} />
                      {row?.cells?.map((cell) => (
                        <TableCell key={cell?.id}>
                          <p>{cell?.value?.toString()}</p>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {/* --- Pagination --- */}
              <Pagination
                backwardText="Previous page"
                forwardText="Next page"
                itemsPerPageText="Items per page:"
                pageSize={pageSize}
                onChange={handlePagination}
                pageSizes={[5, 10, 25, 50, 100]}
                size="lg"
                totalItems={totalItems ? totalItems : 0}
              />
            </TableContainer>
          );
        }}
      </DataTable>
    </div>
  );
};

export default UseTable;
