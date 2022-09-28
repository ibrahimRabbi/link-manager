import { Button } from '@carbon/react';
import React from 'react';
import UseDataTable from '../Shared/UseDataTable/UseDataTable';
import UseDropdown from '../Shared/UseDropdown/UseDropdown';
import style from './LinkManager.module.css';
import { GoSearch } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';

const headers = [{ key: 'status', header: 'Status' }, { key: 'sourceId', header: 'Source ID' }, { key: 'linkType', header: 'Link type' }, { key: 'target', header: 'Target' }, { key: 'actions', header: 'Actions' }];

const projectsData = [
    {
        status: 'No status',
        sourceId: 'requirements.txt',
        linkType: 'implementedBy',
        target: 'US-193 Document the process for...',
    },
    {
        status: 'valid',
        sourceId: 'requirements.txt',
        linkType: 'constrainedBy',
        target: 'dDOC-106 Document - Example 106',
    },
    {
        status: 'invalid',
        sourceId: 'requirements.txt',
        linkType: 'affectedBy',
        target: 'US-193 Document the process for...',
    },
];

const dropdownItem = [
    'Item 1', 'Item 2'
];

const LinkManager = () => {
    const navigate = useNavigate();

    const handleShowItem = (value) => {
        console.log(value)
    };

    return (
        <div>
            <h2 className={style.title}>OSLC Link manager</h2>

            <div className={style.linkFileContainer}>
                <h5>Links for file: <span className={style.fileName}>requirements.txt</span></h5>
                <h5 className={style.newLinkBtn} onClick={() => navigate('/new-link')}>New link</h5>
            </div>

            <div className={style.tableContainer}>
                <div className={style.searchBox}>
                    <UseDropdown onChange={handleShowItem} items={dropdownItem} id={'linkManager_showAll'} label='Show all' style={{ width: '150px', borderRadius: '5px' }} />

                    <div className={style.searchContainer}>
                        <div className={style.inputContainer}>
                            <GoSearch className={style.searchIcon} />
                            <input className={style.searchInput} type="text" placeholder='Search by identifier or name' />
                        </div>
                        <Button size='md' className={style.searchBtn}>Search</Button>
                    </div>
                </div>

                <UseDataTable headers={headers} tableData={projectsData} isPagination={true} />
            </div>
        </div>
    );
};

export default LinkManager;