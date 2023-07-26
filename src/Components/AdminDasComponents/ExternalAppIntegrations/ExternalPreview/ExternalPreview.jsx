import React, {useContext, useEffect, useState} from 'react';
import AuthContext from '../../../../Store/Auth-Context.jsx';
import { Button, Col, Divider, FlexboxGrid, Tooltip, Whisper } from 'rsuite';
import Editor from '@monaco-editor/react';
import hljs from 'highlight.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeCommit, faFileCode } from '@fortawesome/free-solid-svg-icons';
import ScatterIcon from '@rsuite/icons/Scatter';
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


const { title, iconStatus, iconButton, applicationIcon } = styles;
const ExternalPreview = (props) => {
  const authCtx = useContext(AuthContext);
  let { nodeData } = props;
  nodeData = { ...nodeData, resource_type: 'blockofCode' };
  let iconUrl = '';

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
    iconUrl = '/glideyoke_logo.png';
    break;
  }

  const [extension, setExtension] = useState('');


  const nodeTooltip = <Tooltip>Check node in graph view.</Tooltip>;
  const webAppTooltip = <Tooltip>Open link in web application.</Tooltip>;

  let decodedData = '';
  if (nodeData?.content_hash){
    decodedData = atob(nodeData?.content_hash);
  }

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

  const getIconResourceType = (resourceType) => {
    let resource = resourceType.toLowerCase().split('#');
    resource = resource[resource.length - 1];
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
    window.open(nodeData?.web_url, '_blank');
  };

  useEffect(() => {
    if (nodeData.api === 'gitlab') {
      const extension = nodeData?.name.split('.')[1];
      setExtension(getLanguageFromExtension(extension).toLowerCase());
    }
  }, []);

  return (
    <div style={{ width: '550px' }}>
      <FlexboxGrid>
        <FlexboxGrid.Item as={Col} colspan={2}>
          <img src={iconUrl} alt="icon" className={applicationIcon} />
        </FlexboxGrid.Item>
        <FlexboxGrid.Item as={Col} colspan={17}>
          <h4>{nodeData?.name ? nodeData.name : 'External link overview'}</h4>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item as={Col} colspan={5}>
          <Whisper
            placement="topEnd"
            controlId="control-id-hover"
            trigger="hover"
            speaker={nodeTooltip}
          >
            <Button>
              <ScatterIcon className={iconButton} />
            </Button>
          </Whisper>

          <Whisper
            placement="topEnd"
            controlId="control-id-hover"
            trigger="hover"
            speaker={webAppTooltip}
          >
            <Button>
              <GlobalIcon className={iconButton} onClick={sendToWebApplication} />
            </Button>
          </Whisper>

        </FlexboxGrid.Item>
      </FlexboxGrid>
      <Divider>
        <h5>Overview</h5>
      </Divider>
      {nodeData?.description && (
        <PreviewRow name="Description" value={nodeData?.description} />
      )}
      {nodeData?.status && (
        <PreviewRow
          name="Status"
          value={nodeData?.status}
          functionForIcon={getIconStatus}
          firstLetter={true}
        />
      )}
      {nodeData?.project_id && (
        <PreviewRow name="Project" value={nodeData?.project?.name} />
      )}
      {nodeData?.resource_type && (
        <PreviewRow
          name="Type"
          value={nodeData?.resource_type}
          functionForIcon={getIconResourceType}
        />
      )}
      <Divider style={{paddingRight: '250px', right: 0, display: 'flex'}}>
        <h5>Details</h5>
      </Divider>
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
          name="Selected lines in file"
          value={nodeData?.selected_lines}
          urlDescription={nodeData?.web_url}
          titleIcon={<CodeIcon className={iconStatus} />}
        />
      )}
      { decodedData && (
        <FlexboxGrid justify="space-around">
          <FlexboxGrid.Item as={Col} colspan={24}>
            <p className={title} style={{marginBottom: '10px'}}>
              <FontAwesomeIcon icon={faFileCode} className={iconStatus} />
                Selected code
            </p>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item as={Col} colspan={24}>
            <Editor
              height="200px"
              theme="light"
              language={extension}
              value={decodedData}
              options={{
                readOnly: true,
              }}
            />
          </FlexboxGrid.Item>
        </FlexboxGrid>
      )}
    </div>
  );
};

export default ExternalPreview;
