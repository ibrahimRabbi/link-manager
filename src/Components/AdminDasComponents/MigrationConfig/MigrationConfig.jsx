/* eslint-disable indent */
/* eslint-disable max-len */
import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleCurrPageTitle } from '../../../Redux/slices/navSlice';
import { Col, FlexboxGrid } from 'rsuite';
import { useState } from 'react';
import ExternalAppModal from '../ExternalAppIntegrations/ExternalAppModal/ExternalAppModal';
import {
  BASIC_AUTH_APPLICATION_TYPES,
  MICROSERVICES_APPLICATION_TYPES,
  OAUTH2_APPLICATION_TYPES,
} from '../../../App';
import { handleApplicationType, handleLinkType } from '../../../Redux/slices/linksSlice';
import UseReactSelect from '../../Shared/Dropdowns/UseReactSelect';
import { useContext } from 'react';
import AuthContext from '../../../Store/Auth-Context';
import CustomReactSelect from '../../Shared/Dropdowns/CustomReactSelect';
import UseIconSelect from '../../SelectionDialog/GlobalSelector/UseIconSelect';

const apiURL = import.meta.env.VITE_LM_REST_API_URL;
const thirdApiURL = `${apiURL}/third_party`;

const MigrationConfig = () => {
  const {
    // isWbe,
    applicationType,
    linkType,
    // createLinkRes,
    // linkCreateLoading,
  } = useSelector((state) => state.links);
  const authCtx = useContext(AuthContext);
  const [externalProjectUrl, setExternalProjectUrl] = useState('');
  const [restartExternalRequest, setRestartExternalRequest] = useState(false);
  const [authenticatedThirdApp, setAuthenticatedThirdApp] = useState(false);
  const [sourceApplicationList, setSourceApplicationList] = useState([]);
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
  const [targetProjectLoading, setTargetProjectLoading] = useState(false);
  const [sourceProjectLoading, setSourceProjectLoading] = useState(false);
  const broadcastChannel = new BroadcastChannel('oauth2-app-status');
  const dispatch = useDispatch();
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
    dispatch(handleCurrPageTitle('Migration Configuration'));
  }, []);
  const handleSourceApplicationChange = (selectedItem) => {
    setSourceResourceList([]);
    setTargetProjectID('');
    setSourceWorkspace('');
    setSourceProject('');
    setSourceProjectList([]);
    setTargetApplication('');
    setSourceWorkspaceList([]);
    dispatch(handleLinkType(''));
    setTargetApiCall(false);
    setApiCall(true);
    setExternalProjectUrl('');
    closeExternalAppResetRequest();
    setSourceApplication(selectedItem);
    console.log(targetProject, sourceProject);
  };
  const handleTargetApplicationChange = (selectedItem) => {
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
    dispatch(handleApplicationType(selectedItem));
    setTargetApplication(selectedItem);
  };
  const handleTargetProject = (selectedItem) => {
    setTargetProjectID('');
    setTargetResourceList([]);
    const newSelectedItem = {
      ...selectedItem,
      application_id: applicationType?.id,
      workspace_id: selectedItem?.id,
      application_type: applicationType?.type,
    };
    setTargetProjectID(selectedItem?.id);
    console.log(newSelectedItem);
    setTargetProject(newSelectedItem);
  };
  const handleSourceWorkspace = (selectedItem) => {
    console.log(selectedItem);
    setSourceProject('');
    setSourceProjectList([]);
    setSourceWorkspace(selectedItem);
  };
  const handleSourceProject = (selectedItem) => {
    setSourceResourceList([]);
    const newSelectedItem = {
      ...selectedItem,
      application_id: applicationType?.id,
      workspace_id: selectedItem?.id,
      application_type: applicationType?.type,
    };
    console.log(newSelectedItem);
    setSourceProjectID(selectedItem?.id);
    setSourceProject(newSelectedItem);
  };
  const handleTargetWorkspace = (selectedItem) => {
    setTargetWorkspace(selectedItem);
  };
  const handleLinkTypeChange = (selectedItem) => {
    dispatch(handleLinkType(selectedItem));
  };
  const handleResourceTypeChange = (selectedItem) => {
    console.log(selectedItem);
  };
  const handleSourceResourceTypeChange = (selectedItem) => {
    console.log(selectedItem);
  };
  useEffect(() => {
    // prettier-ignore
    switch (applicationType?.type) {
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
  }, [applicationType]);
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
    switch (response.status) {
      case 400:
        setAuthenticatedThirdApp(true);
        return response.json().then((data) => {
          console.log('error', data?.message?.message);
          return { items: [] };
        });
      case 401:
        setAuthenticatedThirdApp(true);
        return response.json().then((data) => {
          console.log('error', data?.message);
          return { items: [] };
        });
      case 403:
        if (authCtx.token) {
          console.log('error', 'You do not have permission to access');
        } else {
          setAuthenticatedThirdApp(true);
          return { items: [] };
        }
        break;
      default:
        return response.json().then((data) => {
          console.log('error', data?.message);
        });
    }
  };
  // for getting application
  useEffect(() => {
    setSourceLoading(true);
    fetch(`${apiURL}/application?page=1&per_page=10`, {
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
        setSourceApplicationList(data?.items);
        setSourceLoading(false);
      });
  }, []);
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
          applicationType?.id || sourceApplication?.id
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
              sourceApplication?.type === 'valispace') &&
            sourceApplication
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
  }, [externalProjectUrl, apiCall, sourceApplication, targetApplication]);
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
  }, [sourceApplication, sourceWorkspace]);
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
      setTargetProjectLoading(true);
      let url;
      if (sourceApplication?.type === 'codebeamer') {
        url = `${thirdApiURL}/${sourceApplication?.type}}/resource_types/${sourceProjectID}?application_id=${sourceApplication?.id}`;
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
            console.log(data);
            setSourceResourceList(data?.items);
            setTargetProjectLoading(false);
          }
        });
    }
  }, [sourceProjectID]);
  useEffect(() => {
    if (targetProjectID && targetApplication?.type !== 'gitlab') {
      setTargetProjectLoading(true);
      let url;
      if (targetApplication?.type === 'codebeamer') {
        url = `${thirdApiURL}/${targetApplication?.type}}/resource_types/${targetProjectID}?application_id=${targetApplication?.id}`;
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
          console.log(data);
          setTargetResourceList(data?.items);
          setTargetProjectLoading(false);
        });
    }
  }, [targetProjectID]);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
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
                backgroundColor: '#2196f3',
                color: 'white',
                padding: '5px',
                borderRadius: '10px',
                marginLeft: '10px',
              }}
            >
              Source
            </span>
          </h3>
          <FlexboxGrid style={{ marginBottom: '15px' }} align="middle">
            <FlexboxGrid.Item colspan={24}>
              <FlexboxGrid justify="start">
                {/* --- Application dropdown ---   */}
                <FlexboxGrid.Item as={Col} colspan={24} style={{ paddingLeft: '0' }}>
                  <UseReactSelect
                    name="application_type"
                    placeholder="Choose Application"
                    onChange={handleSourceApplicationChange}
                    isLoading={sourceLoading}
                    items={sourceApplicationList.length ? sourceApplicationList : []}
                  />
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </FlexboxGrid.Item>
          </FlexboxGrid>
          {(sourceApplication?.type === 'gitlab' ||
            sourceApplication?.type === 'valispace') && (
            <FlexboxGrid style={{ marginBottom: '15px' }} align="middle">
              <FlexboxGrid.Item colspan={24}>
                <FlexboxGrid justify="start">
                  {/* --- Application dropdown ---   */}
                  <FlexboxGrid.Item as={Col} colspan={24} style={{ paddingLeft: '0' }}>
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
                <FlexboxGrid.Item colspan={24}>
                  <FlexboxGrid justify="start">
                    {/* --- Application dropdown ---   */}
                    <FlexboxGrid.Item as={Col} colspan={24} style={{ paddingLeft: '0' }}>
                      <UseReactSelect
                        name="application_type"
                        placeholder="Choose Project"
                        onChange={handleSourceProject}
                        isLoading={sourceProjectLoading}
                        value={sourceProject?.label}
                        disabled={authenticatedThirdApp}
                        items={sourceProjectList?.length ? sourceProjectList : []}
                      />
                    </FlexboxGrid.Item>
                  </FlexboxGrid>
                </FlexboxGrid.Item>
              </FlexboxGrid>
              {sourceProjectID && sourceApplication?.type !== 'gitlab' && (
                <FlexboxGrid style={{ marginBottom: '15px' }} align="middle">
                  <FlexboxGrid.Item colspan={24}>
                    <FlexboxGrid justify="start">
                      {/* --- Application dropdown ---   */}
                      <FlexboxGrid.Item
                        as={Col}
                        colspan={24}
                        style={{ paddingLeft: '0' }}
                      >
                        <UseIconSelect
                          name="glide_native_resource_type"
                          placeholder="Choose resource type"
                          onChange={handleSourceResourceTypeChange}
                          disabled={authenticatedThirdApp}
                          isLoading={sourceProjectLoading}
                          // value={sourceResourceList}
                          appData={sourceApplication}
                          items={sourceResourceList?.length ? sourceResourceList : []}
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
            width: '60%',
            border: '0.5px solid gray',
            borderRadius: '10px',
            padding: '25px 20px',
            marginTop: '50px',
            position: 'relative',
            height: '100px',
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
                  backgroundColor: '#2196f3',
                  color: 'white',
                  padding: '5px',
                  borderRadius: '10px',
                  marginLeft: '10px',
                }}
              >
                Link Type
              </span>
            </h3>
            <FlexboxGrid.Item colspan={24}>
              <FlexboxGrid justify="start">
                {/* --- Application dropdown ---   */}
                <FlexboxGrid.Item as={Col} colspan={24} style={{ paddingLeft: '0' }}>
                  <CustomReactSelect
                    name="link_type"
                    placeholder="Choose Link Type"
                    apiURL={`${apiURL}/link-type`}
                    apiQueryParams={''}
                    isLinkType={true}
                    disabled={sourceApplication ? false : true}
                    onChange={handleLinkTypeChange}
                    isLinkCreation={true}
                    value={linkType?.label}
                  />
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </FlexboxGrid.Item>
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
                backgroundColor: '#2196f3',
                color: 'white',
                padding: '5px',
                borderRadius: '10px',
                marginLeft: '10px',
              }}
            >
              Target
            </span>
          </h3>
          <FlexboxGrid style={{ marginBottom: '15px' }} align="middle">
            <FlexboxGrid.Item colspan={24}>
              <FlexboxGrid justify="start">
                {/* --- Application dropdown ---   */}
                <FlexboxGrid.Item as={Col} colspan={24} style={{ paddingLeft: '0' }}>
                  <CustomReactSelect
                    name="application_type"
                    placeholder="Choose Application"
                    apiURL={`${apiURL}/application`}
                    onChange={handleTargetApplicationChange}
                    isLinkCreation={true}
                    value={applicationType?.label}
                    isUpdateState={linkType}
                    selectedLinkType={linkType}
                    disabled={sourceApplication && linkType ? false : true}
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
              <FlexboxGrid.Item colspan={24}>
                <FlexboxGrid justify="start">
                  {/* --- Application dropdown ---   */}
                  <FlexboxGrid.Item as={Col} colspan={24} style={{ paddingLeft: '0' }}>
                    <UseReactSelect
                      name="application_type"
                      placeholder="Choose Workspace"
                      onChange={handleTargetWorkspace}
                      isLoading={targetLoading}
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
                  <FlexboxGrid.Item colspan={24}>
                    <FlexboxGrid justify="start">
                      {/* --- Application dropdown ---   */}
                      <FlexboxGrid.Item
                        as={Col}
                        colspan={24}
                        style={{ paddingLeft: '0' }}
                      >
                        <UseReactSelect
                          name="application_type"
                          placeholder="Choose Project"
                          onChange={handleTargetProject}
                          isLoading={targetProjectLoading}
                          disabled={targetWorkspace || targetApplication ? false : true}
                          items={targetProjectList?.length ? targetProjectList : []}
                        />
                      </FlexboxGrid.Item>
                    </FlexboxGrid>
                  </FlexboxGrid.Item>
                </FlexboxGrid>
                {targetProjectID && targetApplication?.type !== 'gitlab' && (
                  <FlexboxGrid style={{ marginBottom: '15px' }} align="middle">
                    <FlexboxGrid.Item colspan={24}>
                      <FlexboxGrid justify="start">
                        {/* --- Application dropdown ---   */}
                        <FlexboxGrid.Item
                          as={Col}
                          colspan={24}
                          style={{ paddingLeft: '0' }}
                        >
                          <UseIconSelect
                            name="glide_native_resource_type"
                            placeholder="Choose resource type"
                            onChange={handleResourceTypeChange}
                            disabled={authenticatedThirdApp}
                            isLoading={targetProjectLoading}
                            appData={targetProject}
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
        {authenticatedThirdApp && (
          <ExternalAppModal
            showInNewLink={true}
            formValue={applicationType || sourceApplication}
            isOauth2={OAUTH2_APPLICATION_TYPES?.includes(
              applicationType?.type || sourceApplication?.type,
            )}
            isBasic={(
              BASIC_AUTH_APPLICATION_TYPES + MICROSERVICES_APPLICATION_TYPES
            ).includes(applicationType?.type || sourceApplication?.type)}
            onDataStatus={getExtLoginData}
            integrated={false}
          />
        )}
      </div>
    </div>
  );
};

export default MigrationConfig;
