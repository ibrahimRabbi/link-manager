import { Button } from '@carbon/react';
import React, { useEffect, useState } from 'react';
import UseDataTable from '../Shared/UseDataTable/UseDataTable';
import UseDropdown from '../Shared/UseDropdown/UseDropdown';
import style from './LinkManager.module.css';
import { GoSearch } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Css style destructure
const { title, linkFileContainer, fileName, newLinkBtn, tableContainer, searchBox, searchContainer, inputContainer, searchInput, searchBtn, searchIcon } = style;


const headers = [
  { key: 'status', header: 'Status' },
  { key: 'sourceId', header: 'Source ID' },
  { key: 'linkType', header: 'Link type' },
  { key: 'target', header: 'Target' },
  { key: 'actions', header: 'Actions' }
];

const dropdownItem = ['Link type', 'Project type', 'Status', 'Target'];

const LinkManager = () => {
  const navigate = useNavigate();
  const [projectsData, setProjectsData] = useState([]);

  useEffect(() => {
    fetch('./linksData.json')
      .then(res => res.json())
      .then(data => setProjectsData(data))
      .catch(err => console.log(err));
  }, []);

  const handleShowItem = (value) => {
    console.log(value);
  };

  const handleOpenTargetLink = () => {
    Swal.fire({
      title: 'Opening Jira Application',
      timer: 2000,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  return (
    <div>
      <h2 className={title}>OSLC Link manager</h2>

      <div className={linkFileContainer}>
        <h5>Links for file: <span className={fileName}>requirements.txt</span></h5>
        <Button onClick={() => navigate('/new-link')} className={newLinkBtn} size='sm' kind='ghost--tertiary'>New link</Button>
      </div>

      <div className={tableContainer}>
        <div className={searchBox}>
          <UseDropdown onChange={handleShowItem} items={dropdownItem} id={'linkManager_showAll'} label='Show all' style={{ width: '20%' }} />

          <div className={searchContainer}>
            <div className={inputContainer}>
              <GoSearch className={searchIcon} />
              <input className={searchInput} type="text" placeholder='Search by identifier or name' />
            </div>
            <Button size='md' className={searchBtn}>Search</Button>
          </div>
        </div>
        <UseDataTable headers={headers} tableData={projectsData} openTargetLink={handleOpenTargetLink} />
      </div>
    </div>
  );
};

export default LinkManager;