import React, {useContext} from 'react';
import AuthContext from '../../../../Store/Auth-Context.jsx';
import {Button, Col, Divider, FlexboxGrid, Tooltip, Whisper} from 'rsuite';
import ScatterIcon from '@rsuite/icons/Scatter';
import CloseIcon from '@rsuite/icons/Close';
import GlobalIcon from '@rsuite/icons/Global';
import CheckRoundIcon from '@rsuite/icons/CheckRound';
import RemindFillIcon from '@rsuite/icons/RemindFill';
import WarningRoundIcon from '@rsuite/icons/WarningRound';
import MinusRoundIcon from '@rsuite/icons/MinusRound';

//Icons for resource type
//files in Gitlab
import CodeIcon from '@rsuite/icons/Code';
//Documents in Glideyoke
import IdInfoIcon from '@rsuite/icons/IdInfo';
// Change requests
import ChangeListIcon from '@rsuite/icons/ChangeList';
// JIRA tasks
import TaskIcon from '@rsuite/icons/Task';

import styles from './ExternalPreview.module.scss';

const { title, description, iconStatus, iconButton, applicationIcon } = styles;
const ExternalPreview = (props) => {
  console.log('title', title);
  const authCtx = useContext(AuthContext);
  let { nodeData } = props;
  nodeData = {...nodeData, resource_type: 'blockofCode'};
  console.log('ExternalPreview', authCtx.token);
  console.log('ExternalPreview', nodeData);

  // Get icon URL
  let iconUrl = '';
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

  const nodeTooltip = (
    <Tooltip>
        Check node in graph view.
    </Tooltip>
  );
  
  const webAppTooltip = (
    <Tooltip>
            Open link in web application.
    </Tooltip>
  );
  
  const closeTooltip = (
    <Tooltip>
            Close preview.
    </Tooltip>
  );
  
  const getIconStatus = (status) => {
    switch (status.toLowerCase()) {
    case 'valid':
      return <CheckRoundIcon className={iconStatus} style={{ color: 'green' }}/>;
    case 'suspect':
      return <RemindFillIcon className={iconStatus} style={{ color: 'orange' }}/>;
    case 'invalid':
      return <WarningRoundIcon className={iconStatus} style={{ color: 'red' }}/>;
    default:
      return <MinusRoundIcon className={iconStatus} style={{ color: 'grey' }}/>;
    }
  };

  const validateLinkType = (linkType, linkList) => {
    return linkList.some(substring => linkType.includes(substring));
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
      return <CodeIcon className={iconStatus} style={{ color: 'blue' }}/>;
    }
    const isDocument = validateLinkType(resource, documents);
    if (isDocument){
      return <IdInfoIcon className={iconStatus} style={{ color: 'blue' }}/>;
    }
    const isChangeRequest = validateLinkType(resource, changeRequests);
    if (isChangeRequest){
      return <ChangeListIcon className={iconStatus} style={{ color: 'blue' }}/>;
    }
    const isTask = validateLinkType(resource, tasks);
    if (isTask){
      return <TaskIcon className={iconStatus} style={{ color: 'blue' }}/>;
    }
    return <GlobalIcon className={iconStatus} style={{ color: 'blue' }}/>;
  };
  
  const sendToWebApplication = () => {
    window.open(nodeData?.web_url, '_blank');
  };
    
  return (
    <div style={{width: '500px'}}>
      <FlexboxGrid justify="space-around">
        <FlexboxGrid.Item as={Col} colspan={2}>
          <img src={iconUrl} alt="icon" className={applicationIcon}/>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item as={Col} colspan={14}>
          <h4>
            {nodeData?.name ? nodeData.name : 'External link overview'}
          </h4>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item as={Col} colspan={7}>
          <Whisper
            placement="topEnd"
            controlId="control-id-hover"
            trigger="hover"
            speaker={nodeTooltip}
          >
            <Button><ScatterIcon className={iconButton}/></Button>
          </Whisper>

          <Whisper
            placement="topEnd"
            controlId="control-id-hover"
            trigger="hover"
            speaker={webAppTooltip}
          >
            <Button>
              <GlobalIcon
                className={iconButton}
                onClick={sendToWebApplication}
              />
            </Button>
          </Whisper>

          <Whisper
            placement="topEnd"
            controlId="control-id-hover"
            trigger="hover"
            speaker={closeTooltip}
          >
            <Button>
              <CloseIcon className={iconButton}/>
            </Button>
          </Whisper>
        </FlexboxGrid.Item>
      </FlexboxGrid>
      <Divider>
        <h4>Overview</h4>
      </Divider>
      { nodeData?.description && (
        <FlexboxGrid justify="space-around">
          <FlexboxGrid.Item as={Col} colspan={6}>
            <p className={title}>Description</p>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item as={Col} colspan={14}>
            <p className={description}>{nodeData?.description}</p>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      )}
      { nodeData?.status && (
        <FlexboxGrid justify="space-around">
          <FlexboxGrid.Item as={Col} colspan={6}>
            <p className={title}>Status</p>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item as={Col} colspan={14}>
            <p className={description}>
              {getIconStatus(nodeData?.status)}
              {nodeData?.status.charAt(0).toUpperCase() + nodeData?.status.slice(1)}
            </p>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      )}
      { nodeData?.project_id && (
        <FlexboxGrid justify="space-around">
          <FlexboxGrid.Item as={Col} colspan={6}>
            <p className={title}>Project</p>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item as={Col} colspan={14}>
            <p className={description}>{nodeData?.project?.name}</p>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      )}
      { nodeData?.resource_type && (
        <FlexboxGrid justify="space-around">
          <FlexboxGrid.Item as={Col} colspan={6}>
            <p className={title}>Type</p>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item as={Col} colspan={14}>
            <p className={description}>
              {getIconResourceType(nodeData?.resource_type)}
              {nodeData?.resource_type}
            </p>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      )}
      
  
        
    
  
      
    </div>
  );
};

export default ExternalPreview;