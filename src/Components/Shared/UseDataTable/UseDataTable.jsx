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
import React, { useRef, useState } from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import { FiSettings } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowContainer, Popover } from 'react-tiny-popover';
import Swal from 'sweetalert2';
import {
  handleDeleteLink,
  handleEditLinkData,
  handleEditTargetData,
  handleSetStatus,
  handleTargetDataArr,
  handleViewLinkDetails,
} from '../../../Redux/slices/linksSlice';
import { GrClose } from 'react-icons/gr';

import styles from './UseDataTable.module.scss';
const {
  tableContainer,
  table,
  tableHead,
  tableHeader,
  tableRow,
  pagination,
  actionMenu,
  boxCell,
  menuItem,
  newLinkCell1,
  newLinkCell2,
  statusIcon,
  closeIcon,
  tableCell,
  targetCell,
  validIcon,
  popoverContentStyle,
} = styles;

const UseDataTable = ({
  tableData,
  headers,
  isCheckBox = false,
  isChecked,
  editTargetData,
  handlePagination,
  currPage,
  pageSize,
}) => {
  const { isWbe } = useSelector((state) => state.links);
  const [isPopoverOpen, setIsPopoverOpen] = useState(null);
  const [cursorInPopoverContent, setCursorInPopoverContent] = useState(false);
  const [shouldClosePopover, setShouldClosePopover] = useState(false);
  const popoverContentRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // control popover via mouse enter and mouse leave
  const handlePopoverOpen = (index) => {
    if (index === isPopoverOpen) {
      setIsPopoverOpen(null);
    } else {
      if (isPopoverOpen !== null) {
        setIsPopoverOpen(null);
        setShouldClosePopover(false);
        clearTimeout(closeTimeoutRef.current);
      }
      setIsPopoverOpen(index);
    }
  };

  const handlePopoverClose = () => {
    if (!cursorInPopoverContent && !shouldClosePopover) {
      setShouldClosePopover(true);
      closeTimeoutRef.current = setTimeout(() => {
        setIsPopoverOpen(null);
        setShouldClosePopover(false);
      }, 100);
    }
  };

  const handlePopoverContentEnter = () => {
    setCursorInPopoverContent(true);
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handlePopoverContentLeave = () => {
    setCursorInPopoverContent(false);
    if (isPopoverOpen !== null) {
      setShouldClosePopover(true);
      closeTimeoutRef.current = setTimeout(() => {
        setIsPopoverOpen(null);
        setShouldClosePopover(false);
      }, 100);
    }
  };

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

  return (
    <TableContainer title="" className={tableContainer}>
      <Table size="md" className={table}>
        <TableHead className={tableHead}>
          <TableRow className={tableRow}>
            {headers?.map((header, i) => (
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
              tableData[0] &&
              tableData?.map((row) => (
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
              tableData[0] &&
              tableData?.map((row, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell className={tableCell}>
                      <AiFillCheckCircle className={`${statusIcon} ${validIcon}`} /> Valid
                    </TableCell>
                    <TableCell className={tableCell}>{row?.link_type}</TableCell>

                    {/* --- Table data with Popover ---  */}
                    <TableCell className={`${tableCell} ${targetCell}`}>
                      <Popover
                        id={row?.id}
                        isOpen={isPopoverOpen === index}
                        onClickOutside={() => handlePopoverClose()}
                        positions={['bottom', 'top', 'left']}
                        content={({ position, childRect, popoverRect }) => (
                          <ArrowContainer
                            position={position}
                            childRect={childRect}
                            popoverRect={popoverRect}
                            arrowColor={'gray'}
                            arrowSize={12}
                            arrowStyle={{}}
                            className="popover-arrow-container"
                            arrowClassName="popover-arrow"
                          >
                            <div
                              className={popoverContentStyle}
                              ref={popoverContentRef}
                              onMouseEnter={handlePopoverContentEnter}
                              onMouseLeave={handlePopoverContentLeave}
                            >
                              {/* --- close popover ---  */}
                              <GrClose
                                className={closeIcon}
                                onClick={() => handlePopoverClose(null)}
                              />

                              <iframe
                                src={
                                  // eslint-disable-next-line max-len
                                  'https://gitlab-oslc-api-dev.koneksys.com/oslc/provider/42854970/resources/files/7f1d9abe39a958aaac2a04d6e4e03ac9a908c34c/smallPreview?file_lines=1-9&file_content=6c58744a370a4e3be225ba36caac24d3e03791b846eb4ddebdf40f1f6432fcb2&file_path=GUI/background.js'
                                }
                                width="100%"
                                height="auto"
                              ></iframe>
                            </div>
                          </ArrowContainer>
                        )}
                      >
                        <a
                          href={row?.id}
                          target="_blank"
                          rel="noopener noreferrer"
                          onMouseEnter={() => handlePopoverOpen(index)}
                          onMouseLeave={() => handlePopoverClose()}
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
                      </Popover>
                    </TableCell>

                    <TableCell className={`${tableCell} ${'cds--table-column-menu'}`}>
                      <OverflowMenu
                        menuOptionsClass={actionMenu}
                        menuOffset={{ left: -55 }}
                        renderIcon={() => <FiSettings />}
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
        backwardText="Previous page"
        forwardText="Next page"
        itemsPerPageText="Items per page:"
        onChange={handlePagination}
        page={currPage}
        pageSize={pageSize}
        pageSizes={[5, 10, 25, 50, 100]}
        size="lg"
        totalItems={tableData?.length}
      />
    </TableContainer>
  );
};

export default UseDataTable;
