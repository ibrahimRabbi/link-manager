import { Button } from '@carbon/react';
import React, { useEffect, useState } from 'react';
import UseDataTable from '../Shared/UseDataTable/UseDataTable';
import UseDropdown from '../Shared/UseDropdown/UseDropdown';
import style from './LinkManager.module.css';
import { GoSearch } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';

// Css style destructure
const { title, linkFileContainer, fileName, newLinkBtn, tableContainer, searchBox, searchContainer, inputContainer, searchInput, searchBtn, searchIcon } = style;


const headers = [{ key: 'status', header: 'Status' }, { key: 'sourceId', header: 'Source ID' }, { key: 'linkType', header: 'Link type' }, { key: 'target', header: 'Target' }, { key: 'actions', header: 'Actions' }];

const dropdownItem = ['Item 1', 'Item 2'];

const LinkManager = () => {
    const navigate = useNavigate();
    const [projectsData, setProjectsData] = useState([]);

    useEffect(() => {
        fetch('./linksData.json')
            .then(res => res.json())
            .then(data => setProjectsData(data))
            .catch(err => console.log(err))
    }, [])

    const handleShowItem = (value) => {
        console.log(value)
    };

    return (
        <div>
            <h2 className={title}>OSLC Link manager</h2>

            <div className={linkFileContainer}>
                <h5>Links for file: <span className={fileName}>requirements.txt</span></h5>
                <h5 className={newLinkBtn} onClick={() => navigate('/new-link')}>New link</h5>
            </div>

            <div className={tableContainer}>
                <div className={searchBox}>
                    <UseDropdown onChange={handleShowItem} items={dropdownItem} id={'linkManager_showAll'} label='Show all' style={{ width: '150px', borderRadius: '5px' }} />

                    <div className={searchContainer}>
                        <div className={inputContainer}>
                            <GoSearch className={searchIcon} />
                            <input className={searchInput} type="text" placeholder='Search by identifier or name' />
                        </div>
                        <Button size='md' className={searchBtn}>Search</Button>
                    </div>
                </div>
                <UseDataTable headers={headers} tableData={projectsData} isPagination={true} />
            </div>
        </div>
    );
};

export default LinkManager;