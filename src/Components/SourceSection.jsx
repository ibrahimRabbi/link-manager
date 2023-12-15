import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Col, Divider, FlexboxGrid, Message, toaster, Tooltip, Whisper } from 'rsuite';
import styles from './Shared/NavigationBar/NavigationBar.module.scss';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import fetchAPIRequest from '../apiRequests/apiRequest.js';
import AuthContext from '../Store/Auth-Context.jsx';
import { FaTriangleExclamation } from 'react-icons/fa6';

const sourceAppLogos = {
  gitlab: '/node_icons/gitlab_logo.png',
  valispace: '/node_icons/valispace_logo.png',
  jira: '/node_icons/jira_logo.png',
  glideyoke: '/node_icons/glide_logo.png',
  glide: '/node_icons/glide_logo.png',
  codebeamer: '/node_icons/codebeamer_logo.png',
  dng: '/node_icons/dng_logo.png',
  servicenow: '/node_icons/servicenow_logo.png',
  default: '/node_icons/default_logo.png',
};

const { seeMLBtn, arIcon } = styles;
const dividerStyle = {
  fontSize: '22px',
  margin: '0',
  padding: '0',
};
const NOT_FOUND_RESOURCE_TYPE =
  'Resource type not found. ' + 'Link creation will provide default link types';
const SourceSection = () => {
  const authCtx = useContext(AuthContext);
  const { sourceDataList } = useSelector((state) => state.links);
  const [showMore, setShowMore] = useState(false);
  const [title, setTitle] = useState('');
  const [sourceLogo, setSourceLogo] = useState('');
  const [unknownResourceType, setUnknownResourceType] = useState(false);

  /** Functions */
  const showNotification = (type, message) => {
    if (type && message) {
      const messages = (
        <Message closable showIcon type={type}>
          {message}
        </Message>
      );
      toaster.push(messages, { placement: 'bottomCenter', duration: 5000 });
    }
  };

  const { data: allResourceTypes } = useQuery(['resourceType'], () =>
    fetchAPIRequest({
      urlPath: 'resource-type?page=1&per_page=100',
      token: authCtx.token,
      method: 'GET',
      showNotification: showNotification,
    }),
  );

  const toggleTitle = () => {
    setShowMore(!showMore);
  };

  // handle see more and see less control
  useEffect(() => {
    if (showMore) setTitle(sourceDataList?.title?.slice(25, 99999));
    else {
      setTitle('');
    }
  }, [showMore]);

  useEffect(() => {
    // display logo for the source application
    for (let logo in sourceAppLogos) {
      if (logo.includes(sourceDataList?.appName)) {
        setSourceLogo(sourceAppLogos[logo]);
      }
    }
  }, [sourceDataList]);

  useEffect(() => {
    const foundType = allResourceTypes?.items?.some(
      (resourceType) => resourceType?.type === sourceDataList?.sourceType,
    );

    if (!foundType) {
      setUnknownResourceType(true);
    } else {
      setUnknownResourceType(false);
    }
  }, [allResourceTypes]);

  return (
    <div className="mainContainer">
      <FlexboxGrid justify="space-between">
        <FlexboxGrid.Item as={Col} colspan={3}>
          <h6>Source: </h6>
        </FlexboxGrid.Item>

        <FlexboxGrid.Item as={Col} colspan={21}>
          {sourceDataList?.appName && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '18px',
                marginBottom: '-10px',
                flexWrap: 'wrap',
              }}
            >
              {sourceDataList?.appName && (
                <img
                  src={sourceLogo || sourceAppLogos?.default}
                  height={22}
                  alt="Source"
                  style={{ margin: '0 10px 0 0' }}
                />
              )}
              <span>{sourceDataList?.projectName}</span>s
              {sourceDataList?.sourceType && <Divider style={dividerStyle}>|</Divider>}
              <span>{sourceDataList?.resourceTypeLabel}</span>
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
              {unknownResourceType && (
                <div style={{ right: '0', position: 'fixed', marginRight: '20px' }}>
                  <Whisper
                    followCursor
                    placement="leftEnd"
                    speaker={<Tooltip>{NOT_FOUND_RESOURCE_TYPE}</Tooltip>}
                  >
                    <FaTriangleExclamation
                      style={{ color: '#ffb638', fontSize: '30px' }}
                    />
                  </Whisper>
                </div>
              )}
            </div>
          )}
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </div>
  );
};

export default SourceSection;
