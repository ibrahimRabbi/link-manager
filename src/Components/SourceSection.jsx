import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Divider, FlexboxGrid } from 'rsuite';
import styles from './Shared/NavigationBar/NavigationBar.module.scss';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';

const { seeMLBtn, arIcon } = styles;
const dividerStyle = {
  fontSize: '25px',
};

const SourceSection = () => {
  const { sourceDataList } = useSelector((state) => state.links);
  const [showMore, setShowMore] = useState(false);
  const [title, setTitle] = useState('');

  // handle see more and see less control
  useEffect(() => {
    if (showMore) setTitle(sourceDataList?.title?.slice(25, 99999));
    else {
      setTitle('');
    }
  }, [showMore]);

  const toggleTitle = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="mainContainer">
      <FlexboxGrid align="middle">
        <FlexboxGrid.Item colspan={3} style={{ padding: '0 20px' }}>
          <h3>Source: </h3>
        </FlexboxGrid.Item>

        <FlexboxGrid.Item colspan={21}>
          {sourceDataList?.projectName && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '22px',
                marginBottom: '-3px',
                flexWrap: 'wrap',
              }}
            >
              {sourceDataList?.logoUrl && (
                <img
                  src={sourceDataList?.logoUrl}
                  height={25}
                  alt=""
                  style={{ marginRight: '10px' }}
                />
              )}
              <span>{sourceDataList?.projectName}</span>
              {sourceDataList?.sourceType && <Divider style={dividerStyle}>|</Divider>}

              <span>{sourceDataList?.sourceTypeText}</span>
              {sourceDataList?.titleLabel && <Divider style={dividerStyle}>|</Divider>}

              <span>{sourceDataList?.titleLabel}</span>
              {sourceDataList?.title && <Divider style={dividerStyle}>|</Divider>}

              {sourceDataList?.title && (
                <span>
                  <span>
                    {sourceDataList?.title?.slice(0, 25)}
                    {showMore ? <span>{title}</span> : ''}
                    {sourceDataList?.title?.length > 25 && !showMore ? '...' : ''}
                  </span>

                  {sourceDataList?.title?.length > 25 && (
                    <span className={seeMLBtn} onClick={toggleTitle}>
                      {showMore ? (
                        <MdExpandLess className={arIcon} />
                      ) : (
                        <MdExpandMore className={arIcon} />
                      )}
                    </span>
                  )}
                </span>
              )}
            </div>
          )}
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </div>
  );
};

export default SourceSection;
