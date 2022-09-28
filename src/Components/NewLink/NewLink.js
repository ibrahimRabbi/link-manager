import { Button } from '@carbon/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { GoSearch } from 'react-icons/go';
import UseDataTable from '../Shared/UseDataTable/UseDataTable';
import UseDropdown from '../Shared/UseDropdown/UseDropdown';
import style from './NewLink.module.css';
import { data, docData, headers, sourceList, projectItems, resourceItems, linkTypeItems } from './ItemsData';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';




const NewLink = () => {
    const [linkType, setLinkType] = useState('')
    const { register, handleSubmit } = useForm();
    const [searchText, setSearchText] = useState(null)
    const [isChecked, setIsChecked] = useState(null);
    const [selectedTargetData, setSelectedTargetData] = useState(null);
    const navigate = useNavigate();

    const handleSearchData = data => {
        setIsChecked(null)
        setSelectedTargetData(null)
        setSearchText(data?.searchText)
    };

    const handleLinkTypeChange = (value) => {
        console.log(value)
        setLinkType(value?.selectedItem)
    };

    const targetProjectItems = linkType === 'constrainedBy' ? ['Gilda OSLC "API 1'] : projectItems;

    const targetResourceItems = linkType === 'constrainedBy' ? ['Document (PLM)', 'Part (PLM)'] : resourceItems;

    const handleTargetProject = (value) => {
        console.log(value)
    };

    const handleTargetResource = (value) => {
        console.log(value)
    };
    const displayTableData = searchText === 'data' ? data : searchText === 'document' ? docData : [];

    // Selected target data
    const handleSelectedData = (data) => {
        console.log(data);
        setSelectedTargetData(data);
    };

    // Create new link 
    const handleSaveLink = () => {
        Swal.fire({
            icon: 'success',
            title: 'Link successfully created!',
            timer: 3000
        })
        navigate('/')
    }

    return (
        <div className='mainContainer'>
            <h2 className={style.title}>New link</h2>

            <div className={style.sourceContainer}>
                <h5>Source</h5>
                {
                    sourceList?.map((item, i) => <div key={i} className={style.sourceList}>
                        <p className={style.sourceProp}>{item.key}:</p>
                        <p>{item.value}</p>
                    </div>)
                }
            </div>

            <div className={style.linkTypeContainer}>
                <h5>Link type</h5>
                <UseDropdown onChange={handleLinkTypeChange} items={linkTypeItems} label='Select link type' id='newLink_linkTypes' style={{ width: '180px', borderRadius: '10px' }} />
            </div>

            {/* --- After selected link type ---  */}
            {linkType &&
                <div className={style.targetContainer}>
                    <h5>Target</h5>

                    <div className={style.projectContainer}>
                        <p className={style.dropDownLabel}>Project:</p>
                        <UseDropdown items={targetProjectItems} onChange={handleTargetProject} label={'Select project'} id='project-dropdown' style={{ minWidth: '300px' }} />
                    </div>

                    <div className={style.targetSearchContainer}>
                        <div className={style.resourceTypeContainer}>
                            <p className={style.dropDownLabel}>Resource type:</p>
                            <UseDropdown items={targetResourceItems} onChange={handleTargetResource} label={'Select resource type'} id='resourceType-dropdown' style={{ minWidth: '300px' }} />
                        </div>

                        <form onSubmit={handleSubmit(handleSearchData)} className={style.searchContainer}>
                            <div className={style.inputContainer}>
                                <GoSearch className={style.searchIcon} />
                                <input className={style.searchInput} type="text" placeholder='Search by identifier or name' {...register('searchText')} />
                            </div>
                            <Button size='md' type='submit' className={style.searchBtn}>Search</Button>
                        </form>
                    </div>

                    {
                        (searchText && displayTableData[0]) &&
                        <div className={style.newLinkTable}>
                            <UseDataTable headers={headers} tableData={displayTableData} isCheckBox={true} isPagination={displayTableData[0] ? true : false} selectedData={handleSelectedData} isChecked={isChecked} setIsChecked={setIsChecked} />
                        </div>
                    }
                    {(searchText && !displayTableData[0]) &&
                        <h2 className={style.emptySearchWarning}>Please search by valid identifier or name</h2>
                    }
                </div>
            }
            {selectedTargetData?.identifier && <Button onClick={handleSaveLink} size='lg' className={style.saveBtn}>Save</Button>}
        </div>
    );
};

export default NewLink;