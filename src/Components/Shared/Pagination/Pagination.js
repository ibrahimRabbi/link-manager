import { Select, SelectItem } from '@carbon/react';
import React from 'react';
import { MdFirstPage, MdLastPage, MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import style from './Pagination.module.css';

const Pagination = ({ props }) => {

    const { currPage, setCurrPage, totalPage, setPageSize, pageSize, totalItem } = props;
    const handlePagination = (type) => {
        if (type === 'next') setCurrPage(currPage + 1);
        if (type === 'previous') setCurrPage(currPage - 1);
        if (type === 'first_page') setCurrPage(1);
        if (type === 'last_page') setCurrPage(totalPage);
    };
    return (
        <>
            <div className={style.tablePaginationContainer}>
                <div className={style.tablePaginationRight}>
                    <div className={style.pageItemContainer}>
                        <p>Items per page</p>
                        <Select className={style.select}
                            defaultValue={pageSize}
                            id='' labelText='' size='sm'
                            onChange={(e) => setPageSize(e.target.value)}
                        >
                            <SelectItem text={totalItem < 10 ? String(totalItem) : '10'} value={totalItem < 10 ? Number(totalItem) : 10} />
                            <SelectItem text={'20'} value={20} />
                            <SelectItem text={'50'} value={50} />
                        </Select>
                        <p>Total {totalItem}</p>
                    </div>

                    <div className={style.tablePagination}>
                        <button
                            onClick={() => handlePagination('first_page')}
                            className={currPage === 1 ? style.disabledBtn : ''}
                        >
                            <MdFirstPage />
                        </button>
                        <button
                            onClick={() => handlePagination('previous')}
                            className={currPage === 1 ? style.disabledBtn : ''}
                        >
                            <MdNavigateBefore />
                        </button>
                        <p className={style.paginationIndex}>{currPage} of {totalPage}</p>
                        <button
                            onClick={() => handlePagination('next')}
                            className={currPage === totalPage ? style.disabledBtn : ''}
                        >
                            <MdNavigateNext />
                        </button>
                        <button
                            onClick={() => handlePagination('last_page')}
                            className={currPage === totalPage ? style.disabledBtn : ''}
                        >
                            <MdLastPage />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Pagination;