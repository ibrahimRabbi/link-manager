import React from 'react';
import style from './LinkDetails.module.css';
import { TbArrowNarrowRight } from 'react-icons/tb';
import { Button } from '@carbon/react';
import { useNavigate } from 'react-router-dom';

const { title, sourceContainer, sourceList, sourceProp, sourceTitle2, targetTitle2, circlesContainer, circle, linkTypeCenter, circleBorder, arrowIcon, backBtn } = style;

const sourceListItems = { Source: 'requirements.txt', Project: 'Jet Engine Design (GLIDE)', Type: 'Gitlab - File', Component: 'Gitlab component 1', Stream: 'development', Baseline: '78zabc' };

const targetListItems = { Source: 'Doc-106 Document - Example 106', Project: 'Jet Engine Design (GLIDE)', Type: 'Glide document', Component: 'Glide component 1', Stream: 'development', Baseline: 'xyzabc' };

const LinkDetails = () => {
    const navigate = useNavigate();
    return (
        <div className='mainContainer'>
            <h2 className={title}>OSLC Link manager</h2>
            <div className={sourceContainer}>
                <div className={sourceList}>
                    <h3>Link details</h3>
                </div>
            </div>

            <div className={sourceContainer}>
                <div className={sourceList}>
                    <h5>Source</h5><h5 className={sourceTitle2}>{targetListItems?.Source}</h5>
                </div>
                <div className={sourceList}>
                    <p className={sourceProp}>Project:</p><p>{targetListItems?.Project}</p>
                </div>
                <div className={sourceList}>
                    <p className={sourceProp}>Type:</p><p>{targetListItems?.Type}</p>
                </div>
                <div className={sourceList}>
                    <p className={sourceProp}>Component:</p><p>{targetListItems?.Component}</p>
                </div>
                <div className={sourceList}>
                    <p className={sourceProp}>Stream:</p><p>{targetListItems?.Stream}</p>
                </div>
                <div className={sourceList}>
                    <p className={sourceProp}>Baseline:</p><p>{targetListItems?.Baseline}</p>
                </div>
            </div>

            <div className={sourceContainer}>
                <div className={sourceList}>
                    <h4>Link type</h4>
                    <h4>ConstrainedBy</h4>
                </div>
            </div>

            <div className={sourceContainer}>
                <div className={sourceList}>
                    <h5>Source</h5><h5 className={targetTitle2}>{sourceListItems?.Source}</h5>
                </div>
                <div className={sourceList}>
                    <p className={sourceProp}>Project:</p><p>{sourceListItems?.Project}</p>
                </div>
                <div className={sourceList}>
                    <p className={sourceProp}>Type:</p><p>{sourceListItems?.Type}</p>
                </div>
                <div className={sourceList}>
                    <p className={sourceProp}>Component:</p><p>{sourceListItems?.Component}</p>
                </div>
                <div className={sourceList}>
                    <p className={sourceProp}>Stream:</p><p>{sourceListItems?.Stream}</p>
                </div>
                <div className={sourceList}>
                    <p className={sourceProp}>Baseline:</p><p>{sourceListItems?.Baseline}</p>
                </div>
            </div>

            <div className={circlesContainer}>
                <div className={circle}>
                    <p>requirements.txt</p>
                </div>

                <p className={linkTypeCenter}>constrainedBy</p>

                <p className={circleBorder} /><TbArrowNarrowRight className={arrowIcon} />

                <div className={circle}>
                    <p>Doc-106 Document - Example 106</p>
                </div>
            </div>

            <Button onClick={() => navigate('/')} size='lg' className={backBtn}>Back</Button>

        </div>
    );
};

export default LinkDetails;