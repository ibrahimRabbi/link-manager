import { Checkbox, OverflowMenu, OverflowMenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '@carbon/react';
import React, { useEffect, useState } from 'react';
import Pagination from '../Pagination/Pagination';
import style from './UseDataTable.module.css';
import { FiSettings } from 'react-icons/fi';
import { RiCheckboxBlankFill } from 'react-icons/ri';
import { AiFillCheckCircle } from 'react-icons/ai';
import { BsExclamationTriangleFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const rowStyle = { height: '35px' };

const UseDataTable = ({ tableData, headers, isCheckBox = false, selectedData, isChecked, setIsChecked }) => {
    // pagination control
    const [currPage, setCurrPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const totalPage = Math.ceil(tableData?.length / pageSize);
    const currTableData = tableData?.slice((currPage - 1) * pageSize, currPage * pageSize);
    const navigate = useNavigate();

    useEffect(() => {
        if (pageSize * currPage > tableData?.length) {
            setCurrPage(totalPage);
        }
    }, [pageSize]);

    const paginationProps = { currPage, setCurrPage, totalPage, setPageSize, pageSize, totalItem: tableData?.length };

    return (
        <TableContainer title=''>
            <Table >
                <TableHead>
                    <TableRow className={style.tableRow}>
                        {headers?.map((header, i) => (
                            <TableHeader key={i}>{header?.header}</TableHeader>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        // --- New link Table --- 
                        (isCheckBox && tableData[0]) && currTableData?.map((row) => <TableRow key={row?.identifier} style={rowStyle}>
                            <TableCell className={style.tableCell}>{row?.identifier}</TableCell>
                            <TableCell className={style.tableCell}>{row?.name}</TableCell>
                            <TableCell className={style.tableCell}>{row?.description}</TableCell>
                            <TableCell className={style.tableCell}><Checkbox onClick={(e) => {
                                setIsChecked(e.target.id)
                                selectedData(row)
                            }} labelText='' checked={isChecked === row?.identifier ? true : false} id={row?.identifier} /></TableCell>
                        </TableRow>)
                    }
                    {
                        // Link Manager Table
                        (!isCheckBox && tableData[0]) && currTableData?.map((row, i) => <TableRow key={i} style={rowStyle}>
                            <TableCell className={style.tableCell}>{row?.status === 'valid' ? <AiFillCheckCircle className={`${style.statusIcon} ${style.validIcon}`} /> : row?.status === 'invalid' ? <BsExclamationTriangleFill className={`${style.statusIcon} ${style.invalidIcon}`} /> : <RiCheckboxBlankFill className={`${style.statusIcon} ${style.noStatusIcon}`} />}{row?.status}</TableCell>
                            <TableCell className={style.tableCell}>{row?.sourceId}</TableCell>
                            <TableCell className={style.tableCell}>{row?.linkType}</TableCell>
                            <TableCell className={`${style.tableCell} ${style.targetCell}`}>{row?.target}</TableCell>

                            <TableCell className={`${style.tableCell} ${'cds--table-column-menu'}`}>
                                <OverflowMenu menuOptionsClass={style.actionMenu}
                                    renderIcon={() => <FiSettings />}
                                    size='md' ariaLabel=''>
                                    <OverflowMenuItem wrapperClassName={style.menuItem} hasDivider itemText='Details' onClick={() => navigate('/link-details')} />
                                    <OverflowMenuItem wrapperClassName={style.menuItem} hasDivider itemText='Edit' />
                                    <OverflowMenuItem wrapperClassName={style.menuItem} hasDivider itemText='Set status - Valid' />
                                    <OverflowMenuItem wrapperClassName={style.menuItem} hasDivider itemText='Set status - Invalid' />
                                    <OverflowMenuItem wrapperClassName={style.menuItem} hasDivider itemText="Remove" />
                                </OverflowMenu>
                            </TableCell>
                        </TableRow>)
                    }
                </TableBody>
            </Table>
            {/* --- Pagination --- */}
            <div className={style.pagination}>
                <Pagination props={paginationProps} />
            </div>
        </TableContainer>
    );
};

export default UseDataTable;