import { Checkbox, OverflowMenu, OverflowMenuItem, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '@carbon/react';
import React, { useState } from 'react';
import style from './UseDataTable.module.css';
import { FiSettings } from 'react-icons/fi';
import { RiCheckboxBlankFill } from 'react-icons/ri';
import { AiFillCheckCircle } from 'react-icons/ai';
import { BsExclamationTriangleFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

// Css styles 
const { tableRow, tableCell, targetCell, actionMenu, menuItem, statusIcon, invalidIcon, validIcon, noStatusIcon, pagination } = style;
const rowStyle = { height: '35px' };

const UseDataTable = ({ tableData, headers, isCheckBox = false, selectedData, isChecked, setIsChecked }) => {
    const [currPage, setCurrPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate();

    const handlePagination = (values) => {
        setPageSize(values.pageSize)
        setCurrPage(values.page)
    };

    const currTableData = tableData?.slice((currPage - 1) * pageSize, currPage * pageSize);

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
                <TableBody>
                    {
                        // --- New link Table --- 
                        (isCheckBox && tableData?.length > 0) && currTableData?.map((row) => <TableRow key={row?.identifier} style={rowStyle}>
                            <TableCell className={tableCell}>{row?.identifier}</TableCell>
                            <TableCell className={tableCell}>{row?.name}</TableCell>
                            <TableCell className={tableCell}>{row?.description}</TableCell>
                            <TableCell className={tableCell}><Checkbox onClick={(e) => {
                                setIsChecked(e.target.id)
                                selectedData(row)
                            }} labelText='' checked={isChecked === row?.identifier ? true : false} id={row?.identifier} /></TableCell>
                        </TableRow>)
                    }
                    {
                        // Link Manager Table
                        (!isCheckBox && tableData[0]) && currTableData?.map((row, i) => <TableRow key={i} style={rowStyle}>
                            <TableCell className={tableCell}>{row?.status === 'valid' ? <AiFillCheckCircle className={`${statusIcon} ${validIcon}`} /> : row?.status === 'invalid' ? <BsExclamationTriangleFill className={`${statusIcon} ${invalidIcon}`} /> : <RiCheckboxBlankFill className={`${statusIcon} ${noStatusIcon}`} />}{row?.status}</TableCell>
                            <TableCell className={tableCell}>{row?.sourceId}</TableCell>
                            <TableCell className={tableCell}>{row?.linkType}</TableCell>
                            <TableCell className={`${tableCell} ${targetCell}`}>{row?.target}</TableCell>

                            <TableCell className={`${tableCell} ${'cds--table-column-menu'}`}>
                                <OverflowMenu menuOptionsClass={actionMenu}
                                    renderIcon={() => <FiSettings />}
                                    size='md' ariaLabel=''>
                                    <OverflowMenuItem wrapperClassName={menuItem} hasDivider itemText='Details' onClick={() => navigate('/link-details')} />
                                    <OverflowMenuItem wrapperClassName={menuItem} hasDivider itemText='Edit' />
                                    <OverflowMenuItem wrapperClassName={menuItem} hasDivider itemText='Set status - Valid' />
                                    <OverflowMenuItem wrapperClassName={menuItem} hasDivider itemText='Set status - Invalid' />
                                    <OverflowMenuItem wrapperClassName={menuItem} hasDivider itemText="Remove" />
                                </OverflowMenu>
                            </TableCell>
                        </TableRow>)
                    }
                </TableBody>
            </Table>
            {/* --- Pagination --- */}
            <div className={pagination}>
                <Pagination
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
            </div>
        </TableContainer>
    );
};

export default UseDataTable;