import React from 'react';
import style from './LinkDetails.module.css';
import { TbArrowNarrowRight } from 'react-icons/tb';
import { Button } from '@carbon/react';
import { useNavigate } from 'react-router-dom';

const sourceList = [
    { key: 'Project', value: 'Jet Engine Design (GLIDE)' },
    { key: 'Type', value: 'Gitlab - File' },
    { key: 'Component', value: 'Gitlab component 1' },
    { key: 'Stream', value: 'development' },
    { key: 'Baseline', value: '78zabc' },
];
const targetList = [
    { key: 'Project', value: 'Jet Engine Design (GLIDE)' },
    { key: 'Type', value: 'Glide document' },
    { key: 'Component', value: 'Glide component 1' },
    { key: 'Stream', value: 'development' },
    { key: 'Baseline', value: 'xyzabc' },
];

const LinkDetails = () => {
    const navigate = useNavigate();

    return (
        <div className='mainContainer'>
            <h2 className={style.title}>OSLC Link manager</h2>

            <div className={style.sourceContainer}>
                <div className={style.sourceList}>
                    <h3>Link details</h3>
                </div>
            </div>

            <div className={style.sourceContainer}>
                <div className={style.sourceList}>
                    <h5>Source</h5>
                    <h5 className={style.sourceTitle2}>requirements.txt</h5>
                </div>
                {
                    sourceList?.map((item, i) => <div key={i} className={style.sourceList}>
                        <p className={style.sourceProp}>{item.key}:</p>
                        <p>{item.value}</p>
                    </div>)
                }
            </div>

            <div className={style.sourceContainer}>
                <div className={style.sourceList}>
                    <h4>Link type</h4>
                    <h4>ConstrainedBy</h4>
                </div>
            </div>

            <div className={style.sourceContainer}>
                <div className={style.sourceList}>
                    <h5>Target</h5>
                    <h5 className={style.targetTitle2}>Doc-106 Document - Example 106</h5>
                </div>
                {
                    targetList?.map((item, i) => <div key={i} className={style.sourceList}>
                        <p className={style.sourceProp}>{item.key}:</p>
                        <p>{item.value}</p>
                    </div>)
                }
            </div>

            <div className={style.circlesContainer}>
                <div className={style.circle}>
                    <p>requirements.txt</p>
                </div>

                <p className={style.linkTypeCenter}>constrainedBy</p>

                <p className={style.circleBorder} /><TbArrowNarrowRight className={style.arrowIcon} />

                <div className={style.circle}>
                    <p>Doc-106 Document - Example 106</p>
                </div>
            </div>

            <Button onClick={() => navigate('/')} size='lg' className={style.backBtn}>Back</Button>

        </div>
    );
};

export default LinkDetails;