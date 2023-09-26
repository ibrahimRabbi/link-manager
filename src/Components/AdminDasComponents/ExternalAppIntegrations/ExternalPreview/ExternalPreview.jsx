import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../../../Store/Auth-Context.jsx';
import { Button, Col, Divider, FlexboxGrid, Tooltip, Whisper } from 'rsuite';
import Editor from '@monaco-editor/react';
import hljs from 'highlight.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeCommit, faFileCode } from '@fortawesome/free-solid-svg-icons';
import GlobalIcon from '@rsuite/icons/Global';
import CheckRoundIcon from '@rsuite/icons/CheckRound';
import RemindFillIcon from '@rsuite/icons/RemindFill';
import WarningRoundIcon from '@rsuite/icons/WarningRound';
import MinusRoundIcon from '@rsuite/icons/MinusRound';
import SingleSourceIcon from '@rsuite/icons/SingleSource';
import BranchIcon from '@rsuite/icons/Branch';

//files in Gitlab
import CodeIcon from '@rsuite/icons/Code';
//Documents in Glideyoke
import IdInfoIcon from '@rsuite/icons/IdInfo';
// Change requests
import ChangeListIcon from '@rsuite/icons/ChangeList';
// JIRA tasks
import TaskIcon from '@rsuite/icons/Task';

import styles from './ExternalPreview.module.scss';
import PreviewRow from './PreviewRow/PreviewRow.jsx';
import { useSelector } from 'react-redux';
// eslint-disable-next-line max-len
import {
  BASIC_AUTH_APPLICATION_TYPES, MICROSERVICES_APPLICATION_TYPES,
  OAUTH2_APPLICATION_TYPES,
} from '../../../../App.jsx';
import ExternalAppModal from '../ExternalAppModal/ExternalAppModal.jsx';

const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;
const {
  title,
  iconStatus,
  applicationIcon,
  buttonTitle,
  tablePreviewContainer,
  graphPreviewContainer,
} = styles;

const ExternalPreview = (props) => {
  const { isDark } = useSelector((state) => state.nav);
  const authCtx = useContext(AuthContext);
  let { nodeData, fromGraphView, status } = props;
  let iconUrl = '';
  console.log('nodeData', nodeData);
  // prettier-ignore
  switch (nodeData?.api) {
  case 'gitlab':
    iconUrl = '/gitlab_logo.png';
    break;
  case 'jira':
    iconUrl = '/jira_logo.png';
    break;
  case 'valispace':
    iconUrl = '/valispace_logo.png';
    break;
  case 'glideyoke':
    iconUrl = '/glide_logo.png';
    break;
  case 'glide':
    iconUrl = '/glide_logo.png';
    break;
  case 'codebeamer':
    iconUrl = '/codebeamer_logo.png';
    break;
  case 'dng':
    iconUrl = '/dng_logo.png';
    break;
  default:
    iconUrl = '/default_preview_logo.svg';
    break;
  }

  const [extension, setExtension] = useState('');
  const [decodedCodeLines, setDecodedCodeLines] = useState('');
  const [unauthorizedData, setUnauthorizedData] = useState(false);

  const webAppTooltip = <Tooltip>Click to open link in web application.</Tooltip>;


  const getExtLoginData = (data) => {
    if (data?.status) {
      console.log('request data again');
    }
  };

  const getLanguageFromExtension = (extension) => {
    // Remove the leading dot if present
    const language = hljs.getLanguage(extension);
    return language ? language.name : 'XML';
  };

  const getIconStatus = (status) => {
    // prettier-ignore
    switch (status.toLowerCase()) {
    case 'valid':
      return <CheckRoundIcon className={iconStatus} style={{ color: 'green' }} />;
    case 'suspect':
      return <RemindFillIcon className={iconStatus} style={{ color: 'orange' }} />;
    case 'invalid':
      return <WarningRoundIcon className={iconStatus} style={{ color: 'red' }} />;
    default:
      return <MinusRoundIcon className={iconStatus} style={{ color: 'grey' }} />;
    }
  };

  const validateLinkType = (linkType, linkList) => {
    return linkList.some((substring) => linkType.includes(substring));
  };

  const getResourceType = (resourceType) => {
    let resource = resourceType.toLowerCase().split('#');
    resource = resource[resource.length - 1];
    return resource;
  };

  const getIconResourceType = (resourceType) => {
    const resource = getResourceType(resourceType);
    const files = ['file', 'ofcode', 'folder'];
    const documents = ['document'];
    const changeRequests = ['changerequest'];
    const tasks = ['task'];

    const isFile = validateLinkType(resource, files);
    if (isFile) {
      return <CodeIcon className={iconStatus} style={{ color: 'blue' }} />;
    }
    const isDocument = validateLinkType(resource, documents);
    if (isDocument) {
      return <IdInfoIcon className={iconStatus} style={{ color: 'blue' }} />;
    }
    const isChangeRequest = validateLinkType(resource, changeRequests);
    if (isChangeRequest) {
      return <ChangeListIcon className={iconStatus} style={{ color: 'blue' }} />;
    }
    const isTask = validateLinkType(resource, tasks);
    if (isTask) {
      return <TaskIcon className={iconStatus} style={{ color: 'blue' }} />;
    }
    return <GlobalIcon className={iconStatus} style={{ color: 'blue' }} />;
  };

  const sendToWebApplication = () => {
    window.open(nodeData?.web_url ? nodeData?.web_url : nodeData?.id, '_blank');
  };

  const getExternalResourceData = (nodeData) => {
    if(nodeData?.api_url && nodeData?.application_id){
      fetch(`${nodeData.api_url}?application_id=${nodeData.application_id}`, {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${authCtx.token}`,
        },
        method: 'GET',
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            console.log('Error fetching external resource data');
            setUnauthorizedData(true);
          }
          return null;
        })
        .then((data) => {
          if (data) {
            console.log(data);
          }
        });
    }
  };
  
  const decodeContent = (nodeData) => {
    if (nodeData?.content_hash) {
      fetch(`${lmApiUrl}/third_party/${nodeData.api}/decode_selected_content`, {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${authCtx.token}`,
        },
        body: JSON.stringify({
          selected_content: nodeData.content_hash,
        }),
        method: 'POST',
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
          return null;
        })
        .then((data) => {
          if (data) {
            setDecodedCodeLines(data.selected_content);
          }
        });
    } else {
      setDecodedCodeLines('');
    }
  };

  const getLanguageExtension = (nodeData) => {
    if (nodeData.api === 'gitlab') {
      const extension = nodeData?.name.split('.')[1];
      setExtension(getLanguageFromExtension(extension).toLowerCase());
    }
  };

  useEffect(() => {
    getLanguageExtension(nodeData);
    decodeContent(nodeData);
    getExternalResourceData(nodeData);
  }, [nodeData]);

  return (
    <div className={fromGraphView ? graphPreviewContainer : tablePreviewContainer}>
      <FlexboxGrid>
        <FlexboxGrid.Item as={Col} colspan={2}>
          <img src={iconUrl} alt="icon" className={applicationIcon} />
        </FlexboxGrid.Item>
        <FlexboxGrid.Item as={Col} colspan={17}>
          <Whisper
            placement="topEnd"
            controlId="control-id-hover"
            trigger="hover"
            speaker={webAppTooltip}
          >
            <Button appearance="subtle" onClick={sendToWebApplication}>
              <h4
                className={buttonTitle}
                style={{ color: isDark === 'dark' ? 'white' : '#323232' }}
              >
                {nodeData?.name
                  ? nodeData.name.length > 42
                    ? `${nodeData.name.slice(0, 42)}...`
                    : nodeData.name
                  : 'External link overview'}
              </h4>
            </Button>
          </Whisper>
        </FlexboxGrid.Item>
      </FlexboxGrid>

      {unauthorizedData && (
        <ExternalAppModal
          formValue={{
            ...nodeData,
            type: nodeData?.api,
            rdf_type: nodeData?.type,
          }}
          isOauth2={OAUTH2_APPLICATION_TYPES?.includes(nodeData?.api)}
          isBasic={(
            BASIC_AUTH_APPLICATION_TYPES + MICROSERVICES_APPLICATION_TYPES
          ).includes(nodeData?.api)}
          onDataStatus={getExtLoginData}
          integrated={false}
        />
      )}

      {!fromGraphView && (
        <>
          <Divider style={{ marginTop: '-2px' }}>
            <h5>Overview</h5>
          </Divider>
          {nodeData?.description && (
            <PreviewRow name="Description" value={nodeData?.description} />
          )}
          {nodeData?.status ? (
            <PreviewRow
              name="Status"
              value={nodeData?.status}
              functionForIcon={getIconStatus}
              firstLetter={true}
            />
          ) : (
            <PreviewRow
              name="Status"
              value={status}
              functionForIcon={getIconStatus}
              firstLetter={true}
            />
          )}
          {nodeData?.resource_type && (
            <PreviewRow
              name="Type"
              functionForIcon={getIconResourceType}
              firstLetter={true}
              value={nodeData?.resource_type? 
                nodeData?.resource_type : 
                getResourceType(nodeData?.type)}
            />
          )}

          <Divider style={{ marginTop: '18px' }}>
            <h5>Details</h5>
          </Divider>
          {nodeData?.description && fromGraphView && (
            <PreviewRow name="Description" value={nodeData?.description} />
          )}
          {nodeData?.api === 'gitlab' ? (
            <PreviewRow
              name="Repository"
              value={nodeData?.provider_name}
              titleIcon={<SingleSourceIcon className={iconStatus} />}
            />
          ) : (
            <PreviewRow
              name="Project"
              value={nodeData?.provider_name}
              titleIcon={<SingleSourceIcon className={iconStatus} />}
            />
          )}

          {nodeData?.commit_id && (
            <PreviewRow
              name="Commit ID"
              value={nodeData?.commit_id}
              titleIcon={<FontAwesomeIcon icon={faCodeCommit} className={iconStatus} />}
            />
          )}
          {nodeData?.branch_name && (
            <PreviewRow
              name="Branch"
              value={nodeData?.branch_name}
              titleIcon={<BranchIcon className={iconStatus} />}
            />
          )}
          {nodeData?.selected_lines && (
            <PreviewRow
              name="Selected code lines"
              value={nodeData?.selected_lines}
              urlDescription={nodeData?.web_url}
              titleIcon={<CodeIcon className={iconStatus} />}
            />
          )}
          {decodedCodeLines && (
            <FlexboxGrid justify="space-around">
              <FlexboxGrid.Item as={Col} colspan={24}>
                <p className={title} style={{ marginBottom: '10px' }}>
                  <FontAwesomeIcon icon={faFileCode} className={iconStatus} />
                    Selected code
                </p>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item as={Col} colspan={24}>
                <Editor
                  height="200px"
                  theme="light"
                  language={extension}
                  value={decodedCodeLines}
                  options={{
                    readOnly: true,
                  }}
                />
              </FlexboxGrid.Item>
            </FlexboxGrid>
          )}
        </>
        
      )}
      
    </div>
  );
};

export default ExternalPreview;
