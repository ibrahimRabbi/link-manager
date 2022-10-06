import { Button } from '@carbon/react';
import React from 'react';
import { TbArrowNarrowRight } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import style from './LinkDetails.module.css';

const { title, sourceContainer, sourceList, sourceProp, sourceTitle1, targetTitle1,targetTitle2, linkTitle2, sourceTitle2, circlesContainer, circle, linkTypeCenter, circleBorder, arrowIcon, backBtn,  } = style;

const btnStyle={
  backBtn:{
    display: 'block',
    backgroundColor: '#2196f3',
    margin: '10px 0 20px auto',
    borderRadius: '5px',
  }
};

const LinkDetails = () => {
  const {linkedData, sourceDataList}=useSelector(state=>state.links);
  const {linkType, project, resource, targetData}=linkedData;
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
          <h5 className={sourceTitle1}>Source</h5><h5 className={sourceTitle2}>{sourceDataList[0]?.Source}</h5>
        </div>
        {sourceDataList?.slice(1, 8)?.map((item, i)=><div key={i}
          className={sourceList}>
          <p className={sourceProp}>{Object.keys(item)}</p><p>{Object.values(item)}</p>
        </div>)}
      </div>

      <div className={sourceContainer}>
        <div className={sourceList}>
          <h5>Link type</h5>
          <h5 className={linkTitle2}>{linkType}</h5>
        </div>
      </div>

      <div className={sourceContainer}>
        <div className={sourceList}>
          <h5 className={targetTitle1}>Target</h5><h5 className={targetTitle2}>{targetData?.identifier} {targetData?.description}</h5>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Project:</p><p>{project}</p>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Type:</p><p>{resource}</p>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Component:</p><p>{'Glide component 1'}</p>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Stream:</p><p>{'development'}</p>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Baseline:</p><p>{'xyzabc'}</p>
        </div>
      </div>

      {/* ----- Graph data view -----  */}
      <div className={circlesContainer}>
        <div className={circle}>
          <p>{sourceDataList[0]?.Source}</p>
        </div>

        <p className={linkTypeCenter}>{linkedData?.linkType}</p>
        <p className={circleBorder} /><TbArrowNarrowRight className={arrowIcon} />

        <div className={circle}>
          <p>{targetData?.description}</p>
        </div>
      </div>

      <Button onClick={() => navigate('/')} size='md' style={btnStyle.backBtn} className={backBtn}>Back</Button>
    </div>
  );
};

export default LinkDetails;