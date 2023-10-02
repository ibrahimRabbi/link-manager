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
  const [targetWorkspaceList, setTargetWorkspaceList] = useState([]);
  const [sourceWorkspaceList, setSourceWorkspaceList] = useState([]);
  const [targetProject, setTargetProject] = useState('');
  const [sourceProject, setSourceProject] = useState('');
  const [sourceWorkspace, setSourceWorkspace] = useState('');
  const [targetWorkspace, setTargetWorkspace] = useState('');
  const [apiCall, setApiCall] = useState(false);
  const [targetApiCall, setTargetApiCall] = useState(false);
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
    dispatch(handleCurrPageTitle('Syncronization Configuration'));
  }, []);
  const handleSourceApplicationChange = (selectedItem) => {
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
    const newSelectedItem = {
      ...selectedItem,
      application_id: applicationType?.id,
      workspace_id: selectedItem?.id,
      application_type: applicationType?.type,
    };
    setTargetProject(newSelectedItem);
  };
  const handleSourceProject = (selectedItem) => {
    const newSelectedItem = {
      ...selectedItem,
      application_id: applicationType?.id,
      workspace_id: selectedItem?.id,
      application_type: applicationType?.type,
    };
    setSourceProject(newSelectedItem);
  };
  const handleSourceWorkspace = (selectedItem) => {
    setSourceWorkspace(selectedItem);
  };
  const handleTargetWorkspace = (selectedItem) => {
    setTargetWorkspace(selectedItem);
  };
  const handleLinkTypeChange = (selectedItem) => {
    dispatch(handleLinkType(selectedItem));
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
  // for getting application
  useEffect(() => {
    fetch(`${apiURL}/application?page=1&per_page=10`, {
      headers: {
        Authorization: `Bearer ${authCtx.token}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
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
        }
      })
      .then((data) => {
        setSourceApplicationList(data?.items);
      });
  }, []);
  // for getting workspace
  useEffect(() => {
    if (
      (apiCall || targetApiCall) &&
      externalProjectUrl !== '' &&
      (sourceApplication || targetApplication)
    ) {
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
          } else {
            setTargetWorkspaceList(data?.items);
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
          }
        })
        .then((data) => {
          if (sourceWorkspace) {
            setSourceProjectList(data?.items);
          } else {
            console.log(data);
            setSourceProjectList(data?.items);
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
          }
        })
        .then((data) => {
          if (targetWorkspace) {
            setTargetProjectList(data?.items);
          } else {
            console.log(data);
            setTargetProjectList(data?.items);
          }
        });
    }
  }, [targetApplication, targetWorkspace]);
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
                      items={sourceWorkspaceList?.length ? sourceWorkspaceList : []}
                    />
                  </FlexboxGrid.Item>
                </FlexboxGrid>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          )}
          {sourceWorkspace?.type === 'gitlab' ||
            sourceWorkspace?.type === 'valispace' ||
            (sourceApplication && (
              <FlexboxGrid style={{ marginBottom: '15px' }} align="middle">
                <FlexboxGrid.Item colspan={24}>
                  <FlexboxGrid justify="start">
                    {/* --- Application dropdown ---   */}
                    <FlexboxGrid.Item as={Col} colspan={24} style={{ paddingLeft: '0' }}>
                      <UseReactSelect
                        name="application_type"
                        placeholder="Choose Project"
                        onChange={handleSourceProject}
                        disabled={sourceWorkspace || sourceApplication ? false : true}
                        items={sourceProjectList?.length ? sourceProjectList : []}
                      />
                    </FlexboxGrid.Item>
                  </FlexboxGrid>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            ))}
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
              <FlexboxGrid style={{ marginBottom: '15px' }} align="middle">
                <FlexboxGrid.Item colspan={24}>
                  <FlexboxGrid justify="start">
                    {/* --- Application dropdown ---   */}
                    <FlexboxGrid.Item as={Col} colspan={24} style={{ paddingLeft: '0' }}>
                      <UseReactSelect
                        name="application_type"
                        placeholder="Choose Project"
                        onChange={handleTargetProject}
                        disabled={targetWorkspace || targetApplication ? false : true}
                        items={targetProjectList?.length ? targetProjectList : []}
                      />
                    </FlexboxGrid.Item>
                  </FlexboxGrid>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            ))}
        </div>
      </div>
      <div>
        {authenticatedThirdApp && (
          <ExternalAppModal
            showInNewLink={true}
            formValue={applicationType || sourceApplication}
            isOauth2={OAUTH2_APPLICATION_TYPES?.includes(applicationType?.type)}
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
