import {
  Checkbox,
  OverflowMenu,
  OverflowMenuItem,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from '@carbon/react';
import React from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  handleDeleteLink,
  handleEditLinkData,
  handleEditTargetData,
  handleSetStatus,
  handleTargetDataArr,
  handleViewLinkDetails,
} from '../../../Redux/slices/linksSlice';

import styles from './UseDataTable.module.scss';
import { Settings } from '@carbon/icons-react';
import { Whisper, Popover } from 'rsuite';
const {
  tableContainer,
  table,
  tableHead,
  tableHeader,
  tableRow,
  actionMenu,
  boxCell,
  menuItem,
  newLinkCell1,
  newLinkCell2,
  statusIcon,
  tableCell,
  targetCell,
  validIcon,
  pagination,
} = styles;

const UseDataTable = ({ isCheckBox = false, isChecked, editTargetData, props }) => {
  const { headerData, rowData, handlePagination, totalItems, pageSize } = props;

  const { isWbe } = useSelector((state) => state.links);
  const [popData, setPopData] = React.useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Delete link
  const handleDeleteCreatedLink = (data) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You wont be able to delete this!',
      icon: 'warning',
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(handleDeleteLink(data));
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  };

  const lines = popData?.content_lines ? popData?.content_lines?.split('L') : '';
  const speaker = (
    <Popover
      title={popData?.koatl_path + popData?.content_lines}
      style={{ width: '500px' }}
    >
      <iframe
        src={
          // eslint-disable-next-line max-len
          `https://gitlab-oslc-api-dev.koneksys.com/oslc/provider/${
            popData?.provider_id
          }/resources/${popData?.Type}/${popData?.resource_id}/smallPreview?file_lines=${
            lines ? lines[1] + lines[2] : ''
          }&file_content=${popData?.content}&file_path=${popData?.koatl_path}`
        }
        width="100%"
        height="auto"
      ></iframe>
    </Popover>
  );

  return (
    <TableContainer title="" className={tableContainer}>
      <Table size="md" className={table}>
        <TableHead className={tableHead}>
          <TableRow className={tableRow}>
            {headerData?.map((header, i) => (
              <TableHeader key={i} className={tableHeader}>
                {header?.header}
              </TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {
            // --- New link Table and edit link ---
            isCheckBox &&
              rowData[0] &&
              rowData?.map((row) => (
                <TableRow key={row?.identifier}>
                  <TableCell className={`${tableCell} ${newLinkCell1}`}>
                    {row?.identifier}
                  </TableCell>
                  <TableCell className={`${tableCell} ${newLinkCell2}`}>
                    <span>{row?.name}</span>
                  </TableCell>
                  <TableCell className={tableCell}>
                    <span>{row?.description}</span>
                  </TableCell>

                  {/* edit link checkbox  */}
                  {isChecked && (
                    <TableCell className={boxCell}>
                      <Checkbox
                        checked={row?.identifier === editTargetData?.identifier}
                        onClick={() => dispatch(handleEditTargetData(row))}
                        labelText=""
                        id={row?.identifier}
                      />
                    </TableCell>
                  )}

                  {/* new link checkbox  */}
                  {!isChecked && (
                    <TableCell ba className={boxCell}>
                      <Checkbox
                        onClick={(e) =>
                          dispatch(
                            handleTargetDataArr({
                              data: row,
                              value: {
                                isChecked: e.target.checked,
                                id: e.target.id,
                              },
                            }),
                          )
                        }
                        labelText=""
                        id={row?.identifier}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))
          }

          {
            // Link Manager Table
            !isCheckBox &&
              rowData[0] &&
              rowData?.map((row, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell className={tableCell}>
                      <AiFillCheckCircle className={`${statusIcon} ${validIcon}`} /> Valid
                    </TableCell>
                    <TableCell className={tableCell}>{row?.link_type}</TableCell>

                    {/* --- Table data with Popover ---  */}
                    <TableCell className={`${tableCell} ${targetCell}`}>
                      <Whisper
                        placement="bottom"
                        trigger="hover"
                        controlId="control-id-hover-enterable"
                        speaker={speaker}
                        enterable
                      >
                        <a
                          href={row?.id}
                          target="_blank"
                          rel="noopener noreferrer"
                          onMouseEnter={() => setPopData(row)}
                        >
                          {row?.content_lines
                            ? row?.name.length > 15
                              ? row?.name.slice(0, 15 - 1) +
                                '...' +
                                ' [' +
                                row.content_lines +
                                ']'
                              : row?.name + ' [' + row.content_lines + ']'
                            : row?.name}
                        </a>
                      </Whisper>
                    </TableCell>

                    <TableCell className={`${tableCell} ${'cds--table-column-menu'}`}>
                      <OverflowMenu
                        menuOptionsClass={actionMenu}
                        menuOffset={{ left: -55 }}
                        renderIcon={Settings}
                        size="md"
                        ariaLabel=""
                      >
                        <OverflowMenuItem
                          wrapperClassName={menuItem}
                          onClick={() => {
                            dispatch(handleViewLinkDetails(row));
                            isWbe
                              ? navigate(`/wbe/details/${row?.id}`)
                              : navigate(`/details/${row?.id}`);
                          }}
                          hasDivider
                          itemText="Details"
                        />

                        <OverflowMenuItem
                          wrapperClassName={menuItem}
                          onClick={() => {
                            dispatch(handleEditLinkData(row));
                            isWbe
                              ? navigate(`/wbe/edit-link/${row?.id}`)
                              : navigate(`/edit-link/${row?.id}`);
                          }}
                          hasDivider
                          itemText="Edit"
                        />

                        <OverflowMenuItem
                          wrapperClassName={menuItem}
                          onClick={() =>
                            dispatch(handleSetStatus({ row, status: 'Valid' }))
                          }
                          hasDivider
                          itemText="Set status - Valid"
                        />
                        <OverflowMenuItem
                          wrapperClassName={menuItem}
                          onClick={() =>
                            dispatch(handleSetStatus({ row, status: 'Invalid' }))
                          }
                          hasDivider
                          itemText="Set status - Invalid"
                        />
                        <OverflowMenuItem
                          wrapperClassName={menuItem}
                          onClick={() => handleDeleteCreatedLink(row)}
                          hasDivider
                          itemText="Remove"
                        />
                      </OverflowMenu>
                    </TableCell>
                  </TableRow>
                );
              })
          }
        </TableBody>
      </Table>
      {/* --- Pagination --- */}
      <Pagination
        className={pagination}
        pageSize={pageSize}
        onChange={handlePagination}
        pageSizes={[5, 10, 25, 50, 100]}
        size="md"
        totalItems={totalItems ? totalItems : 0}
      />
    </TableContainer>
  );
};

export default UseDataTable;
