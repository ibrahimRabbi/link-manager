import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { Breadcrumb, Button, FlexboxGrid } from 'rsuite';
import styles from './Shared/NavigationBar/NavigationBar.module.scss';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';

const { seeMLBtn, arIcon } = styles;

const SourceSection = () => {
  const { isDark } = useSelector((state) => state.nav);
  const { sourceDataList } = useSelector((state) => state.links);
  const [showMore, setShowMore] = useState(false);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const { pathname } = useLocation();

  console.log(isDark);

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
      <FlexboxGrid style={{ marginTop: '10px' }} align="middle">
        <FlexboxGrid.Item colspan={3} style={{ padding: '0' }}>
          <h3>Source: </h3>
        </FlexboxGrid.Item>

        <FlexboxGrid.Item colspan={pathname !== '/wbe/new-link' ? 17 : 21}>
          <Breadcrumb style={{ fontSize: '22px', marginBottom: '-1px' }}>
            <Breadcrumb.Item>{sourceDataList?.projectName}</Breadcrumb.Item>
            <Breadcrumb.Item>{sourceDataList?.sourceType}</Breadcrumb.Item>
            <Breadcrumb.Item>{sourceDataList?.titleLabel}</Breadcrumb.Item>
            <Breadcrumb.Item>
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
            </Breadcrumb.Item>
          </Breadcrumb>
        </FlexboxGrid.Item>

        {/* -- create link button --  */}
        {pathname !== '/wbe/new-link' && (
          <FlexboxGrid.Item colspan={4}>
            <Button
              onClick={() => navigate('/wbe/new-link')}
              color="blue"
              appearance="primary"
              active
              // endIcon={< AddOutlineIcon/>}
            >
              {' '}
              Create Link{' '}
            </Button>
          </FlexboxGrid.Item>
        )}
      </FlexboxGrid>
    </div>
  );
};

export default SourceSection;
