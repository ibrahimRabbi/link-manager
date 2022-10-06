import { Checkbox, ComposedModal, ModalBody, ModalHeader, OverflowMenu, OverflowMenuItem, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '@carbon/react';
import React, { useState } from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import { BsExclamationTriangleFill } from 'react-icons/bs';
import { FiSettings } from 'react-icons/fi';
import { RiCheckboxBlankFill } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { handleDeleteLink, handleEditLinkData, handleEditTargetData, handleSetStatus, handleTargetDataArr, handleViewLinkDetails } from '../../../Redux/slices/linksSlice';
import style from './UseDataTable.module.css';

// Css styles 
const { tableRow, tableCell, targetCell, actionMenu, menuItem, statusIcon, invalidIcon, validIcon, noStatusIcon, pagination, modalHeadContainer,modalTitle, modalBody,sourceList, sourceProp,newLinkCell1,newLinkCell2} = style;
const rowStyle = { height: '35px' };

const UseDataTable = ({ tableData, headers, openTargetLink, isCheckBox = false,isChecked,editTargetData }) => {
  const [isOpen, setIsOpen] = useState(null);
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const dispatch=useDispatch();
  const navigate = useNavigate();

  // Pagination
  const handlePagination = (values) => {
    setPageSize(values.pageSize);
    setCurrPage(values.page);
  };
  const currTableData = tableData?.slice((currPage - 1) * pageSize, currPage * pageSize);

  // Delete link
  const handleDeleteCreatedLink=(data)=>{
    Swal.fire({
      title: 'Are you sure?',
      text: 'You wont be able to delete this!',
      icon: 'warning',
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(handleDeleteLink(data));
        Swal.fire( 'Deleted!','Your file has been deleted.','success');
      }
    });
  };

  return (
    <TableContainer title=''>
      <Table >
        <TableHead>
          <TableRow className={tableRow}>
            {headers?.map((header, i) => (
              <TableHeader key={i}>{header?.header}</TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody >
          {
            // --- New link Table and edit link --- 
            (isCheckBox && tableData?.length > 0) && currTableData?.map((row) => <TableRow key={row?.identifier} style={rowStyle}>
              <TableCell className={`${tableCell} ${newLinkCell1}`}>{row?.identifier}</TableCell>
              <TableCell className={`${tableCell} ${newLinkCell2}`}>{row?.name}</TableCell>
              <TableCell className={tableCell}>{row?.description}</TableCell>
              
              {/* edit link checkbox  */}
              {isChecked &&<TableCell className={tableCell}><Checkbox checked={row?.identifier=== editTargetData?.identifier} onClick={(e) => {

                dispatch(handleEditTargetData({row, value:{isChecked:e.target.checked, id:e.target.id}}));
              }} labelText='' id={row?.identifier} /></TableCell>}

              {/* new link checkbox  */}
              {!isChecked &&<TableCell className={tableCell}><Checkbox onClick={(e) => dispatch(handleTargetDataArr({data:row, value:{isChecked:e.target.checked, id:e.target.id}}))} labelText='' id={row?.identifier} /></TableCell>}
            </TableRow>)
          }

          {
            // Link Manager Table
            (!isCheckBox && tableData[0]) && currTableData?.map((row, i) => <TableRow key={i} style={rowStyle}>
              <TableCell className={tableCell}>{row?.status === 'Valid' ? <AiFillCheckCircle className={`${statusIcon} ${validIcon}`} /> : row?.status === 'Invalid' ? <BsExclamationTriangleFill className={`${statusIcon} ${invalidIcon}`} /> : <RiCheckboxBlankFill className={`${statusIcon} ${noStatusIcon}`} />}{row?.status}</TableCell>
              <TableCell className={tableCell}>{'requirements.txt'}</TableCell>
              <TableCell className={tableCell}>{row?.linkType}</TableCell>

              {/* --- Table data with modal ---  */}
              <TableCell className={`${tableCell} ${targetCell}`}><span onMouseOver={() => setIsOpen({ id: row?.id, value: true })}>{row?.targetData?.identifier} {row?.targetData?.description}</span>
                <ComposedModal
                  open={isOpen?.id === row?.id ? isOpen?.value : false}
                  onClose={(e) => e.target.id === isOpen?.id ? setIsOpen({ id: null, value: false }) : null}
                  id={row?.id}
                  size='sm'
                >
                  <div className={modalHeadContainer}>
                    <h4
                      onClick={() => { setIsOpen({ id: null, value: false }); openTargetLink(row); }}
                      className={modalTitle}>{row?.targetData?.identifier}</h4>
                    <ModalHeader onClick={() => setIsOpen({ id: null, value: false })} />
                  </div>
                  <ModalBody className={modalBody}>
                    <div className={sourceList}>
                      <p className={sourceProp}>Name:</p><p>{row?.targetData?.name}</p>
                    </div>
                    <div className={sourceList}>
                      <p className={sourceProp}>Resource type:</p><p>{row?.resource}</p>
                    </div>
                    <div className={sourceList}>
                      <p className={sourceProp}>Project:</p><p>{row?.project}</p>
                    </div>
                    <div className={sourceList}>
                      <p className={sourceProp}>Component:</p><p>Component 1</p>
                    </div>
                  </ModalBody>
                </ComposedModal>
              </TableCell>

              <TableCell className={`${tableCell} ${'cds--table-column-menu'}`}>
                <OverflowMenu menuOptionsClass={actionMenu}
                  renderIcon={() => <FiSettings />}
                  size='md' ariaLabel=''>
                  <OverflowMenuItem wrapperClassName={menuItem} onClick={() => {dispatch(handleViewLinkDetails(row));navigate(`/details/${row?.id}`);}} hasDivider itemText='Details'/>
                  <OverflowMenuItem wrapperClassName={menuItem} onClick={()=>{dispatch(handleEditLinkData(row)); navigate(`/edit-link/${row?.id}`);}} hasDivider itemText='Edit' />
                  <OverflowMenuItem wrapperClassName={menuItem} onClick={()=>dispatch(handleSetStatus({row, status:'Valid'}))} hasDivider itemText='Set status - Valid' />
                  <OverflowMenuItem wrapperClassName={menuItem} onClick={()=>dispatch(handleSetStatus({row, status:'Invalid'}))} hasDivider itemText='Set status - Invalid' />
                  <OverflowMenuItem wrapperClassName={menuItem} onClick={()=>handleDeleteCreatedLink(row)} hasDivider itemText='Remove' />
                </OverflowMenu>
              </TableCell>
            </TableRow>)
          }
        </TableBody>
      </Table>
      
      {/* --- Pagination --- */}
      <div className={pagination}>
        <Pagination
          backwardText='Previous page'
          forwardText='Next page'
          itemsPerPageText='Items per page:'
          onChange={handlePagination}
          page={currPage}
          pageSize={pageSize}
          pageSizes={[10, 20, 30, 40, 50]}
          size='lg'
          totalItems={tableData?.length}
        />
      </div>
    </TableContainer>
  );
};

export default UseDataTable;