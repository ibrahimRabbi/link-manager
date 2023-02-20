import {
  Checkbox,
  ComposedModal,
  ModalBody,
  ModalHeader,
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
import React, { useState } from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import { FiSettings } from 'react-icons/fi';
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
  modalBody,
  modalHeadContainer,
  modalTitle,
  newLinkCell1,
  newLinkCell2,
  statusIcon,
  tableCell,
  targetCell,
  validIcon,
} = styles;

const UseDataTable = ({
  tableData,
  headers,
  openTargetLink,
  isCheckBox = false,
  isChecked,
  editTargetData,
}) => {
  const { isWbe, sourceDataList } = useSelector((state) => state.links);
  const [isOpen, setIsOpen] = useState(null);
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Pagination
  const handlePagination = (values) => {
    setPageSize(values.pageSize);
    setCurrPage(values.page);
  };
  const currTableData = tableData?.slice((currPage - 1) * pageSize, currPage * pageSize);

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
      <Table size="md"  className={table}>
        <TableHead className={tableHead}>
          <TableRow  className={tableRow}>
            {headers?.map((header, i) => (
              <TableHeader key={i} className={tableHeader}>{header?.header}</TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {
            // --- New link Table and edit link ---
            isCheckBox &&
              tableData[0] &&
              currTableData?.map((row) => (
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
              currTableData?.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className={tableCell}>
                    <AiFillCheckCircle className={`${statusIcon} ${validIcon}`} /> Valid
                  </TableCell>
                  <TableCell className={tableCell}>
                    <p>{sourceDataList?.title}</p>
                  </TableCell>
                  <TableCell className={tableCell}>{row?.link_type}</TableCell>

                  {/* --- Table data with modal ---  */}
                  <TableCell className={`${tableCell} ${targetCell}`}>
                    <a href={row?.id} target="_blank" rel="noopener noreferrer">
                      {row?.name}
                    </a>

                    <ComposedModal
                      open={isOpen?.id === row?.id ? isOpen?.value : false}
                      onClose={(e) =>
                        e.target.id === isOpen?.id
                          ? setIsOpen({ id: null, value: false })
                          : null
                      }
                      id={row?.id}
                      size="sm"
                    >
                      <div className={modalHeadContainer}>
                        <h4
                          onClick={() => {
                            setIsOpen({ id: null, value: false });
                            openTargetLink(row);
                          }}
                          className={modalTitle}
                        >
                          {row?.targetData?.identifier}
                        </h4>
                        <ModalHeader
                          onClick={() => setIsOpen({ id: null, value: false })}
                        />
                      </div>
                      <ModalBody className={modalBody}>
                        {/* eslint-disable-next-line max-len */}
                        {/* <iframe src='https://192.241.220.34:9443/rm/resources/_XBsnIIEzEeqnsvH-FkjSvQ/compact/html?hover=sm[…].220.34%3A9443%2Frm%2Fcm%2Fstream%2F_VpeP8IEzEeqnsvH-FkjSvQ' width='100%' height='auto'></iframe> */}
                      </ModalBody>
                    </ComposedModal>
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
              ))
          }
        </TableBody>
      </Table>
      {/* --- Pagination --- */}
      <Pagination className={pagination}
        backwardText="Previous page"
        forwardText="Next page"
        itemsPerPageText="Items per page:"
        onChange={handlePagination}
        page={currPage}
        pageSize={pageSize}
        pageSizes={[10, 20, 30, 40, 50]}
        size="lg"
        totalItems={tableData?.length}
      />
    </TableContainer>
  );
};

export default UseDataTable;
