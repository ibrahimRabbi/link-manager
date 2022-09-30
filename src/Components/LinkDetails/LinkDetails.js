import React, { useEffect, useState } from 'react';
import style from './LinkDetails.module.css';
import { TbArrowNarrowRight } from 'react-icons/tb';
import { Button } from '@carbon/react';
import { useNavigate } from 'react-router-dom';

const { title, sourceContainer, sourceList, sourceProp, sourceTitle1, sourceTitle2, targetTitle1, targetTitle2, circlesContainer, circle, linkTypeCenter, circleBorder, arrowIcon, backBtn, linkTitle2 } = style;

const LinkDetails = () => {
  const [sourceItems, setSourceItems] = useState([]);
  const [targetItems, setTargetItems] = useState([]);
  useEffect(() => {
    fetch('./sourceList.json')
      .then(res => res.json())
      .then(data => setSourceItems(data));

    fetch('./targetList.json')
      .then(res => res.json())
      .then(data => setTargetItems(data));
  }, []);

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
          <h5 className={sourceTitle1}>Source</h5><h5 className={sourceTitle2}>{sourceItems[0]?.Source}</h5>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Project:</p><p>{sourceItems[1]?.Project}</p>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Type:</p><p>{sourceItems[2]?.Type}</p>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Component:</p><p>{sourceItems[3]?.Component}</p>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Stream:</p><p>{sourceItems[4]?.Stream}</p>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Baseline:</p><p>{sourceItems[5]?.Baseline}</p>
        </div>
      </div>

      <div className={sourceContainer}>
        <div className={sourceList}>
          <h5>Link type</h5>
          <h5 className={linkTitle2}>ConstrainedBy</h5>
        </div>
      </div>

      <div className={sourceContainer}>
        <div className={sourceList}>
          <h5 className={targetTitle1}>Source</h5><h5 className={targetTitle2}>{targetItems[0]?.Target}</h5>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Project:</p><p>{targetItems[1]?.Project}</p>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Type:</p><p>{targetItems[2]?.Type}</p>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Component:</p><p>{targetItems[3]?.Component}</p>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Stream:</p><p>{targetItems[4]?.Stream}</p>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Baseline:</p><p>{targetItems[5]?.Baseline}</p>
        </div>
      </div>

      <div className={circlesContainer}>
        <div className={circle}>
          <p>{sourceItems[0]?.Source}</p>
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