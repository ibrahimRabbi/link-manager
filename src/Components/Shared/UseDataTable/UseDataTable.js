import { OverflowMenu, OverflowMenuItem, Popover, PopoverContent, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '@carbon/react';
import React, { useEffect, useState } from 'react';
import Pagination from '../Pagination/Pagination';
import style from './UseDataTable.module.css';
import { FiSettings } from 'react-icons/fi';

const UseDataTable = ({ tableData, headers, editData, deleteData, isPagination = false, isHeader = true, isEdit = true, isDelete = true }) => {
    const [isActionBtn, setIsActionBtn] = useState(false);
    const [rowValue, setRowValue] = useState([]);
    const [open, setOpen] = useState(false);

    // pagination control
    const [currPage, setCurrPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const totalPage = Math.ceil(tableData?.length / pageSize);
    const currTableData = isPagination ? tableData?.slice((currPage - 1) * pageSize, currPage * pageSize) : tableData;

    useEffect(() => {
        if (pageSize * currPage > tableData?.length) {
            setCurrPage(totalPage);
        }
    }, [pageSize]);
    const paginationProps = { currPage, setCurrPage, totalPage, setPageSize, pageSize, totalItem: tableData?.length };
    // pagination control end

    useEffect(() => {
        setIsActionBtn(false);
        for (let header of headers) {
            if (header.key === 'actions') setIsActionBtn(true);
        }
        setRowValue(headers?.filter(data => data.key !== 'actions'));
    }, [headers]);

    return (
        <TableContainer title='' onClick={() => setOpen(false)} >
            <Table >
                {isHeader && <TableHead>
                    <TableRow className={style.tableRow}>
                        {headers?.map((header, i) => (
                            <TableHeader key={i}>
                                {header?.header}
                            </TableHeader>
                        ))}
                    </TableRow>
                </TableHead>}

                <TableBody>
                    {
                        tableData[0] && currTableData?.map((row, i) => (
                            <TableRow key={i} className={style.tableRow} >
                                {rowValue?.map(value => <TableCell key={value.key} className={style.tableCell}>{row[value.key]}</TableCell>)}

                                {isActionBtn && <TableCell className={`${style.tableCell} ${'cds--table-column-menu'}`}>
                                    <OverflowMenu menuOptionsClass={style.actionMenu}
                                        renderIcon={() => <FiSettings />}
                                        size='md' ariaLabel=''>
                                        <OverflowMenuItem wrapperClassName={style.menuItem} hasDivider itemText='Details' />
                                        <OverflowMenuItem wrapperClassName={style.menuItem} hasDivider itemText='Edit' />
                                        <OverflowMenuItem wrapperClassName={style.menuItem} hasDivider itemText='Set status' onClick={() => setOpen(true)} />
                                        <OverflowMenuItem wrapperClassName={style.menuItem} hasDivider itemText="Remove" />
                                    </OverflowMenu>
                                </TableCell>}
                            </TableRow>))
                    }
                    {/* <Popover open={open}>
                        <PopoverContent>
                            <OverflowMenuItem wrapperClassName={style.menuItem} hasDivider itemText='Details' />
                            <OverflowMenuItem wrapperClassName={style.menuItem} hasDivider itemText='Edit' />
                        </PopoverContent>
                    </Popover> */}
                </TableBody>
            </Table>

            {/* --- Pagination --- */}
            {isPagination && <div className={style.pagination}>
                <Pagination props={paginationProps} />
            </div>
            }
        </TableContainer>
    );
};

export default UseDataTable;