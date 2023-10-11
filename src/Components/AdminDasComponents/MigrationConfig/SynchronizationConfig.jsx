/* eslint-disable indent */
/* eslint-disable max-len */
import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { handleCurrPageTitle } from '../../../Redux/slices/navSlice';
import {
  Button,
  ButtonToolbar,
  Checkbox,
  Col,
  FlexboxGrid,
  Message,
  toaster,
} from 'rsuite';
import { useState } from 'react';
import ExternalAppModal from '../ExternalAppIntegrations/ExternalAppModal/ExternalAppModal';
import {
  BASIC_AUTH_APPLICATION_TYPES,
  MICROSERVICES_APPLICATION_TYPES,
  OAUTH2_APPLICATION_TYPES,
} from '../../../App';
import UseReactSelect from '../../Shared/Dropdowns/UseReactSelect';
import { useContext } from 'react';
import AuthContext from '../../../Store/Auth-Context';
// import CustomReactSelect from '../../Shared/Dropdowns/CustomReactSelect';
import UseIconSelect from '../../SelectionDialog/GlobalSelector/UseIconSelect';
import AppIconSelect from './AppIconSelect';
import UseLoader from '../../Shared/UseLoader';
import { TbArrowsHorizontal } from 'react-icons/tb';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';

const apiURL = import.meta.env.VITE_LM_REST_API_URL;
const thirdApiURL = `${apiURL}/third_party`;
// const direction = [
//   { name: <TbArrowsHorizontal style={{ fontSize: '35px' }} /> },
//   { name: <HiOutlineArrowNarrowRight style={{ fontSize: '35px' }} /> },
// ];
const SynchronizationConfig = () => {
  const authCtx = useContext(AuthContext);
  const [externalProjectUrl, setExternalProjectUrl] = useState('');
  const [restartExternalRequest, setRestartExternalRequest] = useState(false);
  const [authenticatedThirdApp, setAuthenticatedThirdApp] = useState(false);
  const [sourceApplication, setSourceApplication] = useState('');
  const [targetApplication, setTargetApplication] = useState('');
  const [sourceProjectList, setSourceProjectList] = useState([]);
  const [targetProjectList, setTargetProjectList] = useState([]);
  const [targetResourceList, setTargetResourceList] = useState([]);
  const [sourceResourceList, setSourceResourceList] = useState([]);
  const [targetWorkspaceList, setTargetWorkspaceList] = useState([]);
  const [sourceWorkspaceList, setSourceWorkspaceList] = useState([]);
  const [targetProject, setTargetProject] = useState('');
  const [sourceProject, setSourceProject] = useState('');
  const [sourceWorkspace, setSourceWorkspace] = useState('');
  const [targetWorkspace, setTargetWorkspace] = useState('');
  const [targetProjectID, setTargetProjectID] = useState('');
  const [sourceProjectID, setSourceProjectID] = useState('');
  const [apiCall, setApiCall] = useState(false);
  const [targetApiCall, setTargetApiCall] = useState(false);
  const [sourceLoading, setSourceLoading] = useState(false);
  const [targetLoading, setTargetLoading] = useState(false);
  const [sourceResourceTypeLoading, setSourceResourceTypeLoading] = useState(false);
  const [targetResourceTypeLoading, setTargetResourceTypeLoading] = useState(false);
  const [targetProjectLoading, setTargetProjectLoading] = useState(false);
  const [sourceProjectLoading, setSourceProjectLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [sourceResourceType, setSourceResourceType] = useState('');
  const [targetResourceType, setTargetResourceType] = useState('');
  const [disbaledDropdown, setDisableDropdown] = useState(false);
  const [rightDirection, setRightDirection] = useState(false);
  const [biDirection, setBiDirection] = useState(false);
  const broadcastChannel = new BroadcastChannel('oauth2-app-status');
  const dispatch = useDispatch();

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

  const closeExternalAppResetRequest = () => {
    setAuthenticatedThirdApp(false);
    setRestartExternalRequest(true);
  };

  broadcastChannel.onmessage = (event) => {
    const { status } = event.data;
    if (status === 'success') {
      closeExternalAppResetRequest();
    }
  };
  const getExtLoginData = (data) => {
    if (data?.status) {
      closeExternalAppResetRequest();
    }
  };
  useEffect(() => {
    if (restartExternalRequest) {
      setRestartExternalRequest(false);
    }
  }, [restartExternalRequest]);
  useEffect(() => {
    dispatch(handleCurrPageTitle('Synchronization Configuration'));
  }, []);
  const handleSourceApplicationChange = (selectedItem) => {
    setSourceProjectID('');
    setSourceResourceList([]);
    setTargetProjectID('');
    setSourceWorkspace('');
    setSourceProject('');
    setSourceProjectList([]);
    setTargetApplication('');
    setSourceWorkspaceList([]);
    setTargetApiCall(false);
    setApiCall(true);
    setExternalProjectUrl('');
    closeExternalAppResetRequest();
    setSourceApplication(selectedItem);
  };
  const handleTargetApplicationChange = (selectedItem) => {
    setDisableDropdown(false);
    setTargetProjectID('');
    setTargetProject('');
    setTargetProjectList([]);
    setTargetWorkspace('');
    setTargetApplication('');
    setTargetWorkspaceList([]);
    setApiCall(false);
    setTargetApiCall(true);
    setTargetProjectList([]);
    setExternalProjectUrl('');
    closeExternalAppResetRequest();
    setTargetApplication(selectedItem);
  };
  const handleTargetProject = (selectedItem) => {
    setTargetProject('');
    setTargetProjectID('');
    setTargetResourceList([]);
    const newSelectedItem = {
      ...selectedItem,
      application_id: targetApplication?.id,
      workspace_id: selectedItem?.id,
      application_type: targetApplication?.type,
    };
    setTargetProjectID(selectedItem?.id);
    setTargetProject(newSelectedItem);
  };
  const handleSourceWorkspace = (selectedItem) => {
    setSourceWorkspace('');
    setSourceResourceList([]);
    setSourceProject('');
    setSourceProjectID('');
    setSourceProjectList([]);
    setSourceWorkspace(selectedItem);
  };
  const handleSourceProject = (selectedItem) => {
    setSourceProjectID('');
    setSourceProject('');
    setSourceResourceList([]);
    const newSelectedItem = {
      ...selectedItem,
      application_id: sourceApplication?.id,
      workspace_id: selectedItem?.id,
      application_type: sourceApplication?.type,
    };
    setSourceProjectID(selectedItem?.id);
    setSourceProject(newSelectedItem);
  };
  const handleTargetWorkspace = (selectedItem) => {
    setTargetWorkspace(selectedItem);
  };
  // const handleLinkTypeChange = (selectedItem) => {
  //   dispatch(handleLinkType(selectedItem));
  // };
  const handleTargetResourceTypeChange = (selectedItem) => {
    setTargetResourceType(selectedItem);
  };
  const handleSourceResourceTypeChange = (selectedItem) => {
    setSourceResourceType(selectedItem);
  };
  const handleDirectChange = (selectedItem) => {
    if (selectedItem === 'rightdirection') {
      setBiDirection(false);
      setRightDirection(true);
    } else {
      setRightDirection(false);
      setBiDirection(true);
    }
  };
  const handleCreateProject = () => {
    setDisableDropdown(!disbaledDropdown);
    setTargetProjectList([]);
    setTargetProjectID('');
    setTargetProject('');
    setTargetResourceType('');
  };
  useEffect(() => {
    // prettier-ignore
    switch (targetApplication?.type) {
    case 'gitlab':
      setExternalProjectUrl(`${thirdApiURL}/gitlab/workspace`);
      break;
    case 'valispace':
      setExternalProjectUrl(`${thirdApiURL}/valispace/workspace`);
      break;
    case 'jira':
      setExternalProjectUrl(`${thirdApiURL}/jira/containers`);
      break;
    case 'glideyoke':
      setExternalProjectUrl(`${thirdApiURL}/glideyoke/containers`);
      break;
    case 'codebeamer':
      setExternalProjectUrl(`${thirdApiURL}/codebeamer/containers`);
      break;
    case 'dng':
      setExternalProjectUrl(`${thirdApiURL}/dng/containers`);
      break;
    }
  }, [targetApplication]);
  useEffect(() => {
    // prettier-ignorec
    switch (sourceApplication?.type) {
      case 'gitlab':
        setExternalProjectUrl(`${thirdApiURL}/gitlab/workspace`);
        break;
      case 'valispace':
        setExternalProjectUrl(`${thirdApiURL}/valispace/workspace`);
        break;
      case 'jira':
        setExternalProjectUrl(`${thirdApiURL}/jira/containers`);
        break;
      case 'glideyoke':
        setExternalProjectUrl(`${thirdApiURL}/glideyoke/containers`);
        break;
      case 'codebeamer':
        setExternalProjectUrl(`${thirdApiURL}/codebeamer/containers`);
        break;
      case 'dng':
        setExternalProjectUrl(`${thirdApiURL}/dng/containers`);
        break;
    }
  }, [sourceApplication]);
  const handleResponse = (response) => {
    if (response.ok) {
      return response.json().then((data) => {
        showNotification('success', data.message);
        return data;
      });
    }
    switch (response.status) {
      case 400:
        return response.json().then((data) => {
          showNotification('error', data?.message);
          return { items: [] };
        });
      case 401:
        setAuthenticatedThirdApp(true);
        return response.json().then((data) => {
          showNotification('error', data?.message);
          return { items: [] };
        });
      case 403:
        if (authCtx.token) {
          showNotification('error', 'You do not have permission to access');
        } else {
          setAuthenticatedThirdApp(true);
          return { items: [] };
        }
        break;
      default:
        return response.json().then((data) => {
          showNotification('error', data?.message);
        });
    }
  };
  // for getting workspace
  useEffect(() => {
    if (
      (apiCall || targetApiCall) &&
      externalProjectUrl !== '' &&
      (sourceApplication || targetApplication)
    ) {
      setSourceLoading(true);
      setTargetLoading(true);
      fetch(
        `${externalProjectUrl}?page=1&per_page=10&application_id=${
          targetApplication?.id || sourceApplication?.id
        }`,
        {
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
          },
        },
      )
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            handleResponse(response);
          }
        })
        .then((data) => {
          if (
            data &&
            apiCall &&
            (sourceApplication?.type === 'gitlab' ||
              sourceApplication?.type === 'valispace')
          ) {
            setSourceWorkspaceList(data?.items);
            setSourceLoading(false);
            setTargetLoading(false);
          } else {
            setTargetWorkspaceList(data?.items);
            setTargetLoading(false);
            setSourceLoading(false);
            setTargetApiCall(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [
    externalProjectUrl,
    apiCall,
    sourceApplication,
    targetApplication,
    restartExternalRequest,
  ]);
  // for getting projects
  useEffect(() => {
    if (
      sourceWorkspace ||
      sourceApplication?.type === 'jira' ||
      sourceApplication?.type === 'codebeamer' ||
      sourceApplication?.type === 'dng' ||
      sourceApplication?.type === 'glideyoke'
    ) {
      setSourceProjectLoading(true);
      let url;
      if (sourceWorkspace && sourceApplication) {
        url = `${thirdApiURL}/${sourceApplication?.type}/containers/${sourceWorkspace?.id}
?page=1&per_page=10&application_id=${sourceApplication?.id}`;
      } else {
        url = `${thirdApiURL}/${sourceApplication?.type}/containers?page=1&per_page=10&application_id=${sourceApplication?.id}`;
      }
      fetch(url, {
        headers: {
          Authorization: `Bearer ${authCtx.token}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            handleResponse(response);
          }
        })
        .then((data) => {
          if (sourceWorkspace) {
            setSourceProjectList(data?.items);
            setSourceProjectLoading(false);
          } else {
            setSourceProjectList(data?.items);
            setSourceProjectLoading(false);
          }
        });
    }
  }, [sourceApplication, sourceWorkspace, restartExternalRequest]);
  // for getting projects
  useEffect(() => {
    if (
      targetWorkspace ||
      targetApplication?.type === 'jira' ||
      targetApplication?.type === 'codebeamer' ||
      targetApplication?.type === 'dng' ||
      targetApplication?.type === 'glideyoke'
    ) {
      setTargetProjectLoading(true);
      let url;
      if (targetWorkspace && targetApplication) {
        url = `${thirdApiURL}/${targetApplication?.type}/containers/${targetWorkspace?.id}
?page=1&per_page=10&application_id=${targetApplication?.id}`;
      } else {
        url = `${thirdApiURL}/${targetApplication?.type}/containers?page=1&per_page=10&application_id=${targetApplication?.id}`;
      }
      fetch(url, {
        headers: {
          Authorization: `Bearer ${authCtx.token}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            handleResponse(response);
          }
        })
        .then((data) => {
          if (targetWorkspace) {
            setTargetProjectList(data?.items);
            setTargetProjectLoading(false);
          } else {
            setTargetProjectList(data?.items);
            setTargetProjectLoading(false);
          }
        });
    }
  }, [targetApplication, targetWorkspace]);

  useEffect(() => {
    if (sourceProjectID && sourceApplication?.type !== 'gitlab') {
      setSourceResourceTypeLoading(true);
      let url;
      if (sourceApplication?.type === 'codebeamer') {
        url = `${thirdApiURL}/${sourceApplication?.type}/resource_types/${sourceProjectID}?application_id=${sourceApplication?.id}`;
      } else if (sourceProjectID) {
        url = `${thirdApiURL}/${sourceApplication?.type}/resource_types`;
      }
      fetch(url, {
        headers: {
          Authorization: `Bearer ${authCtx.token}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            handleResponse(response);
          }
        })
        .then((data) => {
          if (sourceProjectID) {
            setSourceResourceList(data?.items);
            setSourceResourceTypeLoading(false);
          }
        });
    }
  }, [sourceProjectID]);
  useEffect(() => {
    if ((targetProjectID && targetApplication?.type !== 'gitlab') || disbaledDropdown) {
      setTargetResourceTypeLoading(true);
      let url;
      if (targetApplication?.type === 'codebeamer' && !disbaledDropdown) {
        url = `${thirdApiURL}/${targetApplication?.type}/resource_types/${targetProjectID}?application_id=${targetApplication?.id}`;
      } else if (disbaledDropdown) {
        url = `${thirdApiURL}/${targetApplication?.type}/resource_types?application_id=${targetApplication?.id}`;
      } else {
        url = `${thirdApiURL}/${targetApplication?.type}/resource_types`;
      }
      fetch(url, {
        headers: {
          Authorization: `Bearer ${authCtx.token}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            handleResponse(response);
          }
        })
        .then((data) => {
          setTargetResourceList(data?.items);
          setTargetResourceTypeLoading(false);
        });
    }
  }, [targetProjectID, disbaledDropdown]);
  const handleMakeMigration = async () => {
    setSubmitLoading(true);
    const body = {
      source_application_id: sourceApplication ? sourceApplication?.id : null,
      source_workspace: sourceWorkspace ? sourceWorkspace?.name : null,
      source_project: sourceProject ? sourceProject?.name : null,
      source_resource:
        sourceApplication?.type === 'codebeamer'
          ? sourceResourceType?.name
          : sourceResourceType?.id,
      target_application_id: targetApplication ? targetApplication?.id : null,
      target_workspace: targetWorkspace ? targetWorkspace?.name : null,
      target_project: targetProject ? targetProject?.name : null,
      target_resource:
        targetApplication?.type === 'codebeamer'
          ? targetResourceType?.name
          : targetResourceType?.id,
    };
    try {
      const response = await fetch(`${apiURL}/migrations`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + authCtx.token, // Make sure 'Authorization' is capitalized correctly
        },
        body: JSON.stringify(body),
      });
      handleResponse(response);
      if (!response.ok) {
        setSubmitLoading(false);
      } else {
        setSubmitLoading(false);
        setSourceApplication('');
        setSourceWorkspace('');
        setSourceProject('');
        setSourceProjectID('');
        setSourceResourceType('');
        setTargetApplication('');
        setTargetWorkspace('');
        setTargetProject('');
        setTargetProjectID('');
        setTargetResourceType('');
        setDisableDropdown(false);
      }
    } catch (error) {
      setSubmitLoading(false);
      console.log('error', error);
    }
  };
  return (
    <div style={{ position: 'relative' }}>
      {submitLoading && (
        <div
          style={{ position: 'absolute', top: '100', left: '0', right: '0', bottom: '0' }}
        >
          <UseLoader />
        </div>
      )}
      <div style={{ display: 'flex' }}>
        <div
          style={{
            width: '100%',
            border: '0.5px solid gray',
            borderRadius: '10px',
            padding: '25px 20px',
            marginTop: '50px',
            position: 'relative',
            marginRight: '20px',
          }}
        >
          <h3
            style={{
              position: 'absolute',
              top: '-22px',
              bottom: '0',
              right: '0',
              left: '0',
            }}
          >
            <span
              style={{
                backgroundColor: 'white',
                color: '#575757',
                fontWeight: 'bolder',
                padding: '5px',
                borderRadius: '10px',
                marginLeft: '10px',
              }}
            >
              Source
            </span>
          </h3>
          <FlexboxGrid style={{ marginBottom: '15px' }} align="middle">
            <FlexboxGrid.Item colspan={4}>
              <h5>Application: </h5>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={20}>
              <FlexboxGrid justify="end">
                {/* --- Application dropdown ---   */}
                <FlexboxGrid.Item as={Col} colspan={20} style={{ paddingLeft: '0' }}>
                  <AppIconSelect
                    name="application_type"
                    placeholder="Choose Application"
                    apiURL={`${apiURL}/${authCtx.organization_id}/application`}
                    onChange={handleSourceApplicationChange}
                    isLinkCreation={false}
                    value={sourceApplication?.label}
                    isUpdateState={sourceApplication}
                    restartRequest={restartExternalRequest}
                    isApplication={true}
                    removeApplication={''}
                  />
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </FlexboxGrid.Item>
          </FlexboxGrid>
          {(sourceApplication?.type === 'gitlab' ||
            sourceApplication?.type === 'valispace') && (
            <FlexboxGrid style={{ marginBottom: '15px' }} align="middle">
              <FlexboxGrid.Item colspan={4}>
                <h5>Workspace: </h5>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={20}>
                <FlexboxGrid justify="end">
                  {/* --- Application dropdown ---   */}
                  <FlexboxGrid.Item as={Col} colspan={20} style={{ paddingLeft: '0' }}>
                    <UseReactSelect
                      name="application_type"
                      placeholder="Choose Workspace"
                      onChange={handleSourceWorkspace}
                      disabled={authenticatedThirdApp}
                      isLoading={sourceLoading}
                      items={sourceWorkspaceList?.length ? sourceWorkspaceList : []}
                    />
                  </FlexboxGrid.Item>
                </FlexboxGrid>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          )}
          {sourceApplication && (
            <div>
              <FlexboxGrid style={{ marginBottom: '15px' }} align="middle">
                <FlexboxGrid.Item colspan={4}>
                  <h5>Project: </h5>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={20}>
                  <FlexboxGrid justify="end">
                    {/* --- Application dropdown ---   */}
                    <FlexboxGrid.Item as={Col} colspan={20} style={{ paddingLeft: '0' }}>
                      <UseReactSelect
                        name="application_type"
                        placeholder="Choose Project"
                        onChange={handleSourceProject}
                        isLoading={sourceProjectLoading}
                        disabled={authenticatedThirdApp}
                        items={sourceProjectList?.length ? sourceProjectList : []}
                      />
                    </FlexboxGrid.Item>
                  </FlexboxGrid>
                </FlexboxGrid.Item>
              </FlexboxGrid>
              {sourceProjectID && sourceApplication?.type !== 'gitlab' && (
                <FlexboxGrid style={{ marginBottom: '15px' }} align="middle">
                  <FlexboxGrid.Item colspan={4}>
                    <h5>Resource: </h5>
                  </FlexboxGrid.Item>
                  <FlexboxGrid.Item colspan={20}>
                    <FlexboxGrid justify="end">
                      {/* --- Application dropdown ---   */}
                      <FlexboxGrid.Item
                        as={Col}
                        colspan={20}
                        style={{ paddingLeft: '0' }}
                      >
                        <UseIconSelect
                          name="resource_type"
                          placeholder="Choose resource type"
                          onChange={handleSourceResourceTypeChange}
                          disabled={authenticatedThirdApp}
                          isLoading={sourceResourceTypeLoading}
                          value={sourceResourceType?.name}
                          appData={sourceApplication}
                          items={sourceResourceList?.length ? sourceResourceList : []}
                        />
                      </FlexboxGrid.Item>
                    </FlexboxGrid>
                  </FlexboxGrid.Item>
                </FlexboxGrid>
              )}
              {sourceResourceType && (
                <FlexboxGrid style={{ marginBottom: '10px' }} align="middle">
                  <FlexboxGrid.Item colspan={4}>
                    <h5>Properties: </h5>
                  </FlexboxGrid.Item>
                  <FlexboxGrid.Item colspan={20}>
                    <FlexboxGrid justify="end">
                      {/* --- Application dropdown ---   */}
                      <FlexboxGrid.Item
                        as={Col}
                        colspan={20}
                        style={{ paddingLeft: '0' }}
                      >
                        <UseIconSelect
                          name="glide_native_resource_type"
                          placeholder="Choose resource type"
                          onChange={handleTargetResourceTypeChange}
                          disabled={authenticatedThirdApp}
                          isLoading={targetResourceTypeLoading}
                          value={targetResourceType?.name}
                          appData={targetApplication}
                          items={targetResourceList?.length ? targetResourceList : []}
                        />
                      </FlexboxGrid.Item>
                    </FlexboxGrid>
                  </FlexboxGrid.Item>
                </FlexboxGrid>
              )}
            </div>
          )}
        </div>
        <div
          style={{
            width: '80%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '300px',
              border: '0.5px solid gray',
              borderRadius: '10px',
              padding: '25px 20px',
              marginTop: '50px',
              position: 'relative',
              height: '120px',
              marginRight: '20px',
            }}
          >
            <div>
              <h3
                style={{
                  position: 'absolute',
                  top: '-22px',
                  bottom: '0',
                  right: '0',
                  left: '0',
                }}
              >
                <span
                  style={{
                    backgroundColor: 'white',
                    color: '#575757',
                    fontWeight: 'bolder',
                    padding: '5px',
                    borderRadius: '10px',
                    marginLeft: '10px',
                  }}
                >
                  Direction
                </span>
              </h3>
              <div style={{ marginTop: '10px' }}>
                <div>
                  <Checkbox
                    value="rightdirection"
                    checked={rightDirection}
                    onChange={handleDirectChange}
                    style={{ marginTop: '-10px' }}
                  >
                    <HiOutlineArrowNarrowRight
                      style={{ fontSize: '35px', marginTop: '-8px' }}
                    />
                  </Checkbox>
                </div>
                <div>
                  <Checkbox
                    value="bidirection"
                    checked={biDirection}
                    onChange={handleDirectChange}
                    style={{ marginTop: '-10px' }}
                  >
                    <TbArrowsHorizontal style={{ fontSize: '35px', marginTop: '-8px' }} />
                  </Checkbox>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            width: '100%',
            border: '0.5px solid gray',
            borderRadius: '10px',
            padding: '25px 20px',
            marginTop: '50px',
            position: 'relative',
          }}
        >
          <h3
            style={{
              position: 'absolute',
              top: '-22px',
              bottom: '0',
              right: '0',
              left: '0',
            }}
          >
            <span
              style={{
                backgroundColor: 'white',
                color: '#575757',
                fontWeight: 'bolder',
                padding: '5px',
                borderRadius: '10px',
                marginLeft: '10px',
              }}
            >
              Target
            </span>
          </h3>
          <FlexboxGrid style={{ marginBottom: '15px' }} align="middle">
            <FlexboxGrid.Item colspan={4}>
              <h5>Application: </h5>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={20}>
              <FlexboxGrid justify="end">
                {/* --- Application dropdown ---   */}
                <FlexboxGrid.Item as={Col} colspan={20} style={{ paddingLeft: '0' }}>
                  <AppIconSelect
                    name="application_type"
                    placeholder="Choose Application"
                    apiURL={`${apiURL}/${authCtx.organization_id}/application`}
                    onChange={handleTargetApplicationChange}
                    isLinkCreation={true}
                    value={targetApplication?.label}
                    isUpdateState={sourceApplication}
                    disabled={authenticatedThirdApp || sourceResourceType ? false : true}
                    isApplication={true}
                    removeApplication={sourceApplication?.type}
                  />
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </FlexboxGrid.Item>
          </FlexboxGrid>
          {(targetApplication?.type === 'gitlab' ||
            targetApplication?.type === 'valispace') && (
            <FlexboxGrid style={{ marginBottom: '15px' }} align="middle">
              <FlexboxGrid.Item colspan={4}>
                <h5>Workspace: </h5>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={20}>
                <FlexboxGrid justify="end">
                  {/* --- Application dropdown ---   */}
                  <FlexboxGrid.Item as={Col} colspan={20} style={{ paddingLeft: '0' }}>
                    <UseReactSelect
                      name="application_type"
                      placeholder="Choose Workspace"
                      onChange={handleTargetWorkspace}
                      isLoading={targetLoading}
                      disabled={authenticatedThirdApp}
                      items={targetWorkspaceList?.length ? targetWorkspaceList : []}
                    />
                  </FlexboxGrid.Item>
                </FlexboxGrid>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          )}
          {targetWorkspace?.type === 'gitlab' ||
            targetWorkspace?.type === 'valispace' ||
            (targetApplication && (
              <div>
                <FlexboxGrid style={{ marginBottom: '15px' }} align="middle">
                  <FlexboxGrid.Item colspan={4}>
                    <h5>Project: </h5>
                  </FlexboxGrid.Item>
                  <FlexboxGrid.Item colspan={20}>
                    <FlexboxGrid justify="end">
                      {/* --- Application dropdown ---   */}
                      <FlexboxGrid.Item
                        as={Col}
                        colspan={20}
                        style={{ paddingLeft: '0' }}
                      >
                        <UseReactSelect
                          name="application_type"
                          placeholder="Choose Project"
                          onChange={handleTargetProject}
                          isLoading={targetProjectLoading}
                          disabled={
                            authenticatedThirdApp ||
                            !targetApplication ||
                            disbaledDropdown
                          }
                          items={targetProjectList?.length ? targetProjectList : []}
                        />
                      </FlexboxGrid.Item>
                    </FlexboxGrid>
                  </FlexboxGrid.Item>
                </FlexboxGrid>
                {targetApplication?.type === 'jira' ||
                targetApplication?.type === 'codebeamer' ||
                targetApplication?.type === 'valispace' ? (
                  <div style={{ marginBottom: '15px' }}>
                    <Checkbox
                      value="Create New Project"
                      checked={disbaledDropdown}
                      onChange={handleCreateProject}
                    >
                      Create New Project
                    </Checkbox>
                  </div>
                ) : (
                  ' '
                )}
                {targetProjectID && targetApplication?.type !== 'gitlab' && (
                  <FlexboxGrid style={{ marginBottom: '15px' }} align="middle">
                    <FlexboxGrid.Item colspan={4}>
                      <h5>Resource: </h5>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item colspan={20}>
                      <FlexboxGrid justify="end">
                        {/* --- Application dropdown ---   */}
                        <FlexboxGrid.Item
                          as={Col}
                          colspan={20}
                          style={{ paddingLeft: '0' }}
                        >
                          <UseIconSelect
                            name="glide_native_resource_type"
                            placeholder="Choose resource type"
                            onChange={handleTargetResourceTypeChange}
                            disabled={authenticatedThirdApp}
                            isLoading={targetResourceTypeLoading}
                            value={targetResourceType?.name}
                            appData={targetApplication}
                            items={targetResourceList?.length ? targetResourceList : []}
                          />
                        </FlexboxGrid.Item>
                      </FlexboxGrid>
                    </FlexboxGrid.Item>
                  </FlexboxGrid>
                )}
                {disbaledDropdown && (
                  <FlexboxGrid style={{ marginBottom: '15px' }} align="middle">
                    <FlexboxGrid.Item colspan={4}>
                      <h5>Resource: </h5>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item colspan={20}>
                      <FlexboxGrid justify="end">
                        {/* --- Application dropdown ---   */}
                        <FlexboxGrid.Item
                          as={Col}
                          colspan={20}
                          style={{ paddingLeft: '0' }}
                        >
                          <UseIconSelect
                            name="glide_native_resource_type"
                            placeholder="Choose resource type"
                            onChange={handleTargetResourceTypeChange}
                            disabled={authenticatedThirdApp}
                            isLoading={targetResourceTypeLoading}
                            value={targetResourceType?.name}
                            appData={targetApplication}
                            items={targetResourceList?.length ? targetResourceList : []}
                          />
                        </FlexboxGrid.Item>
                      </FlexboxGrid>
                    </FlexboxGrid.Item>
                  </FlexboxGrid>
                )}
                {targetResourceType && (
                  <FlexboxGrid style={{ marginBottom: '0px' }} align="middle">
                    <FlexboxGrid.Item colspan={4}>
                      <h5>Properties: </h5>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item colspan={20}>
                      <FlexboxGrid justify="end">
                        {/* --- Application dropdown ---   */}
                        <FlexboxGrid.Item
                          as={Col}
                          colspan={20}
                          style={{ paddingLeft: '0' }}
                        >
                          <UseIconSelect
                            name="glide_native_resource_type"
                            placeholder="Choose resource type"
                            onChange={handleTargetResourceTypeChange}
                            disabled={authenticatedThirdApp}
                            isLoading={targetResourceTypeLoading}
                            value={targetResourceType?.name}
                            appData={targetApplication}
                            items={targetResourceList?.length ? targetResourceList : []}
                          />
                        </FlexboxGrid.Item>
                      </FlexboxGrid>
                    </FlexboxGrid.Item>
                  </FlexboxGrid>
                )}
              </div>
            ))}
        </div>
      </div>
      <div>
        {targetResourceType && (
          <div>
            <h3 style={{ textAlign: 'center' }}>Sync Frequency</h3>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Checkbox style={{ marginRight: '20px' }}>
                <span style={{ fontSize: '18px' }}>One Time</span>
              </Checkbox>
              <Checkbox style={{ marginLeft: '20px' }}>
                <span style={{ fontSize: '18px' }}>Automatic</span>
              </Checkbox>
            </div>
            <div style={{ textAlign: 'center', marginTop: '15px ' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '15px' }}>
                Sync newly created resources
              </span>
              <Checkbox style={{ marginBottom: '5px' }}></Checkbox>
            </div>
          </div>
        )}
      </div>
      <div>
        {authenticatedThirdApp ? (
          <ExternalAppModal
            showInNewLink={true}
            formValue={targetApplication || sourceApplication}
            isOauth2={OAUTH2_APPLICATION_TYPES?.includes(
              targetApplication?.type || sourceApplication?.type,
            )}
            isBasic={(
              BASIC_AUTH_APPLICATION_TYPES + MICROSERVICES_APPLICATION_TYPES
            ).includes(targetApplication?.type || sourceApplication?.type)}
            onDataStatus={getExtLoginData}
            integrated={false}
          />
        ) : (
          <div style={{ display: 'flex', justifyContent: 'end', marginTop: '20px' }}>
            <ButtonToolbar>
              <Button appearance="ghost">Cancel</Button>
              <Button
                appearance="primary"
                disabled={!sourceProject || !sourceResourceType || !targetApplication}
                onClick={handleMakeMigration}
              >
                Submit
              </Button>
            </ButtonToolbar>
          </div>
        )}
      </div>
    </div>
  );
};
export default SynchronizationConfig;
