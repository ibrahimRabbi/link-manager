import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Col, FlexboxGrid, Message, toaster, Tooltip, Whisper } from 'rsuite';
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

const dividerStyle = {
  fontSize: '25px',
  margin: '0 6px',
  padding: '0',
};
const NOT_FOUND_RESOURCE_TYPE =
  'Resource type not found. ' + 'Link creation will provide default link types';
const SourceSection = () => {
  const authCtx = useContext(AuthContext);
  const { sourceDataList } = useSelector((state) => state.links);
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

  const tooltip = (
    <Tooltip>
      <h5>
        {sourceDataList?.projectName}
        {sourceDataList?.sourceType && <span style={dividerStyle}>|</span>}
        {sourceDataList?.resourceTypeLabel}
        {sourceDataList?.titleLabel && <span style={dividerStyle}>|</span>}
        {sourceDataList?.titleLabel}
        {sourceDataList?.title && <span style={dividerStyle}>|</span>}
        {sourceDataList?.title}
      </h5>
    </Tooltip>
  );

  return (
    <div className="mainContainer">
      <FlexboxGrid align="middle" justify="space-between">
        <FlexboxGrid.Item as={Col} colspan={4} style={{ margin: '0', padding: '0' }}>
          <h3>Source:</h3>
        </FlexboxGrid.Item>

        <FlexboxGrid.Item as={Col} colspan={20} style={{ margin: '0', padding: '0' }}>
          <FlexboxGrid align="middle">
            <FlexboxGrid.Item colspan={1}>
              {sourceDataList?.appName && (
                <img
                  src={sourceLogo || sourceAppLogos?.default}
                  height={25}
                  alt="Source"
                  style={{ margin: '0 10px 0 0' }}
                />
              )}
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={21}>
              <Whisper placement="bottom" followCursor speaker={tooltip}>
                <h3 className="source_section_title">
                  {sourceDataList?.projectName}
                  {sourceDataList?.sourceType && <span style={dividerStyle}>|</span>}
                  {sourceDataList?.resourceTypeLabel}
                  {sourceDataList?.titleLabel && <span style={dividerStyle}>|</span>}
                  {sourceDataList?.titleLabel}
                  {sourceDataList?.title && <span style={dividerStyle}>|</span>}
                  {sourceDataList?.title}
                </h3>
              </Whisper>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={2}>
              {unknownResourceType && (
                <div style={{ right: '0', position: 'fixed', marginRight: '20px' }}>
                  <Whisper
                    followCursor
                    placement="leftEnd"
                    speaker={<Tooltip>{NOT_FOUND_RESOURCE_TYPE}</Tooltip>}
                  >
                    <h5>
                      <FaTriangleExclamation
                        style={{ color: '#ffb638', fontSize: '30px' }}
                      />
                    </h5>
                  </Whisper>
                </div>
              )}
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </div>
  );
};

export default SourceSection;
