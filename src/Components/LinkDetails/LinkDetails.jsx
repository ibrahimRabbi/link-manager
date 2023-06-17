import React, { useEffect } from 'react';
import { TbArrowNarrowRight } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handleCurrPageTitle } from '../../Redux/slices/navSlice';
import styles from './LinkDetails.module.scss';
import { Button } from 'rsuite';
import { ArrowLeft } from '@rsuite/icons';
const {
  arrowIcon,
  btnContainer,
  circle,
  circleBorder,
  circlesContainer,
  linkTitle2,
  linkTypeCenter,
  sourceContainer,
  sourceList,
  sourceProp,
  sourceTitle2,
  targetTitle2,
} = styles;

const LinkDetails = () => {
  const { isWbe, linkedData, sourceDataList } = useSelector((state) => state.links);
  const { linkType, project, resource, targetData } = linkedData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(handleCurrPageTitle('Link Details'));
  }, []);

  return (
    <div className="container">
      <div className={sourceContainer}>
        <div className={sourceList}>
          <h5>Source</h5>
          <h5 className={sourceTitle2}>{sourceDataList?.source}</h5>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Project</p>
          <p>{sourceDataList?.project}</p>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Type</p>
          <p>{sourceDataList?.type}</p>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Component</p>
          <p>{sourceDataList?.component}</p>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Stream</p>
          <p>{sourceDataList?.stream}</p>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Baseline</p>
          <p>{sourceDataList?.baseline}</p>
        </div>
      </div>

      <div className={sourceContainer}>
        <div className={sourceList}>
          <h5>Link type</h5>
          <h5 className={linkTitle2}>{linkType}</h5>
        </div>
      </div>

      <div className={sourceContainer}>
        <div className={sourceList}>
          <h5>Target</h5>
          <h5 className={targetTitle2}>
            {targetData?.identifier} {targetData?.description}
          </h5>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Project:</p>
          <p>{project}</p>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Type:</p>
          <p>{resource}</p>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Component:</p>
          <p>{'Glide component 1'}</p>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Stream:</p>
          <p>{'development'}</p>
        </div>
        <div className={sourceList}>
          <p className={sourceProp}>Baseline:</p>
          <p>{'xyzabc'}</p>
        </div>
      </div>

      {/* ----- Graph data view -----  */}
      <div className={circlesContainer}>
        <div className={circle}>
          <p>{sourceDataList[0]?.Source}</p>
        </div>

        <p className={linkTypeCenter}>{linkedData?.linkType}</p>
        <p className={circleBorder} />
        <TbArrowNarrowRight className={arrowIcon} />

        <div className={circle}>
          <p>{targetData?.description}</p>
        </div>
      </div>

      <div className={btnContainer}>
        <Button
          renderIcon={ArrowLeft}
          onClick={() => (isWbe ? navigate('/wbe') : navigate('/'))}
          kind="primary"
          size="md"
        >
          Back to home
        </Button>
      </div>
    </div>
  );
};

export default LinkDetails;
