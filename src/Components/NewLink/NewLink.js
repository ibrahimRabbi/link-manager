import { Button } from '@carbon/react';
import React, { useState } from 'react';
import { GoSearch } from 'react-icons/go';
import UseDropdown from '../Shared/UseDropdown/UseDropdown';
import style from './NewLink.module.css';

const sourceList = [
    { key: 'Name', value: 'requirements.txt' },
    { key: 'Type', value: 'Gitlab - File' },
    { key: 'Component', value: 'Gitlab component 1' },
    { key: 'Stream', value: 'main' },
    { key: 'Baseline', value: 'c865083' },
];

const linkTypeItems = ['affectedBy', 'implementedBy', 'trackedBy', 'constrainedBy', 'decomposedBy', 'elaboratedBy', 'satisfiedBy'
];
const targetProjectItems = ['Jira OSLC API 1', 'Glide OSLC API f1',
];
const targetResourceItems = ['User story', 'Task', 'Epic', 'Bug', 'Improvement',
];


const NewLink = () => {
    const [linkType, setLinkType] = useState('')

    const handleLinkTypeChange = (value) => {
        console.log(value)
        setLinkType(value?.selectedItem)
    };
    const handleTargetProject = (value) => {
        console.log(value)
    };
    const handleTargetResource = (value) => {
        console.log(value)
    };

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

            {linkType &&
                <div className={style.targetContainer}>
                    <h5>Target</h5>

                    <div className={style.projectContainer}>
                        <p className={style.dropDownLabel}>Project:</p>
                        <UseDropdown items={targetProjectItems} onChange={handleTargetProject} label={targetProjectItems[0]} id='project-dropdown' style={{ minWidth: '300px' }} />
                    </div>

                    <div className={style.targetSearchContainer}>
                        <div className={style.resourceTypeContainer}>
                            <p className={style.dropDownLabel}>Resource type:</p>
                            <UseDropdown items={targetResourceItems} onChange={handleTargetResource} label={targetResourceItems[0]} id='resourceType-dropdown' style={{ minWidth: '300px' }} />
                        </div>

                        <div className={style.searchContainer}>
                            <div className={style.inputContainer}>
                                <GoSearch className={style.searchIcon} />
                                <input className={style.searchInput} type="text" placeholder='Search by identifier or name' />
                            </div>
                            <Button size='md' className={style.searchBtn}>Search</Button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default NewLink;