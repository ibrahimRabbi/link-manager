/* eslint-disable indent */
/* eslint-disable max-len */
import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { handleCurrPageTitle } from '../../../Redux/slices/navSlice';
import { Button, ButtonToolbar, Col, FlexboxGrid, Message, toaster } from 'rsuite';
import { useState } from 'react';
import ExternalAppModal from '../ExternalAppIntegrations/ExternalAppModal/ExternalAppModal';
import {
  BASIC_AUTH_APPLICATION_TYPES,
  MICROSERVICES_APPLICATION_TYPES,
  OAUTH2_APPLICATION_TYPES,
} from '../../../App';
import { useContext } from 'react';
import AuthContext from '../../../Store/Auth-Context';
import UseIconSelect from '../../SelectionDialog/GlobalSelector/UseIconSelect';
import AppIconSelect from './AppIconSelect';
import UseLoader from '../../Shared/UseLoader';
import { TbArrowsHorizontal } from 'react-icons/tb';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import PropertyTable from './PropertyTable';
import EnumValueTable from './EnumValueTable';
import UseCustomProjectSelect from './UseCustomProjectSelect';
import { useNavigate } from 'react-router-dom';
import DirectionSelect from './DirectionSelect';

const apiURL = import.meta.env.VITE_LM_REST_API_URL;
const thirdApiURL = `${apiURL}/third_party`;
const direction = [
  {
    name: <HiOutlineArrowNarrowRight style={{ fontSize: '35px' }} />,
    value: 'right',
  },
  { name: <TbArrowsHorizontal style={{ fontSize: '35px' }} />, value: 'bidirectional' },
];
const SynchronizationConfig = () => {
  const authCtx = useContext(AuthContext);
  const [sourceExternalProjectUrl, setSourceExternalProjectUrl] = useState('');
  const [targetExternalProjectUrl, setTargetExternalProjectUrl] = useState('');
  const [restartExternalRequest, setRestartExternalRequest] = useState(false);
  const [authenticatedThirdApp, setAuthenticatedThirdApp] = useState(false);
  const [sourceApplication, setSourceApplication] = useState('');
  const [targetApplication, setTargetApplication] = useState('');
  const [sourceProjectList, setSourceProjectList] = useState([]);
  const [targetProjectList, setTargetProjectList] = useState([]);
  const [targetResourceList, setTargetResourceList] = useState([]);
  const [sourceResourceList, setSourceResourceList] = useState([]);
  const [targetProject, setTargetProject] = useState('');
  const [sourceProject, setSourceProject] = useState('');
  const [targetProjectID, setTargetProjectID] = useState('');
  const [sourceProjectID, setSourceProjectID] = useState('');
  const [sourceResourceTypeLoading, setSourceResourceTypeLoading] = useState(false);
  const [targetResourceTypeLoading, setTargetResourceTypeLoading] = useState(false);
  const [targetProjectLoading, setTargetProjectLoading] = useState(false);
  const [sourceProjectLoading, setSourceProjectLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [sourceResourceType, setSourceResourceType] = useState('');
  const [targetResourceType, setTargetResourceType] = useState('');
  const [propertyShow, setPropertyShow] = useState(false);
  const [selectDirection, setSelectDirection] = useState('');
  const [sourceProperties, setSourceProperties] = useState([]);
  const [targetProperties, setTargetProperties] = useState([]);
  const [normalRows, setNormalRows] = useState([]);
  const [enumRows, setEnumRows] = useState([]);
  const [sourceProperty, setSourceProperty] = useState('');
  const [targetProperty, setTargetProperty] = useState('');
  const [showAddEnum, setShowAddEnum] = useState(false);
  const [directions, setDirections] = useState(true);
  const [defaultProperty, setDefaultProperty] = useState('');
  const broadcastChannel = new BroadcastChannel('oauth2-app-status');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const organization = authCtx?.organization_name
    ? `/${authCtx?.organization_name?.toLowerCase()}`
    : '';

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

  const handleDirectChange = (selectedItem) => {
    if (selectedItem !== null) {
      setDirections(false);
      setSelectDirection(selectedItem);
    } else {
      setPropertyShow(false);
      setDirections(true);
      setSelectDirection(selectedItem);
    }
  };
  const handleSourceApplicationChange = (selectedItem) => {
    setEnumRows([]);
    setSourceProperty('');
    setTargetProperty('');
    setNormalRows([]);
    setSourceResourceType('');
    setSourceProjectID('');
    setSourceResourceList([]);
    setTargetProjectID('');
    setSourceProject('');
    setSourceProjectList([]);
    setTargetProjectList([]);
    setTargetApplication('');
    setTargetProject('');
    setTargetResourceType('');
    setSourceExternalProjectUrl('');
    setTargetExternalProjectUrl('');
    closeExternalAppResetRequest();
    setSourceApplication(selectedItem);
  };
  const handleTargetApplicationChange = (selectedItem) => {
    setSourceProperty('');
    setTargetProperty('');
    setEnumRows([]);
    setNormalRows([]);
    setTargetResourceType('');
    setTargetProjectID('');
    setTargetProject('');
    setTargetProjectList([]);
    setTargetApplication('');
    setTargetProjectList([]);
    setSourceExternalProjectUrl('');
    setTargetExternalProjectUrl('');
    closeExternalAppResetRequest();
    setTargetApplication(selectedItem);
  };
  const handleTargetProject = (selectedItem) => {
    setSourceProperty('');
    setTargetProperty('');
    setEnumRows([]);
    setNormalRows([]);
    setTargetResourceType('');
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
  const handleSourceProject = (selectedItem) => {
    setSourceProperty('');
    setTargetProperty('');
    setEnumRows([]);
    setNormalRows([]);
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
  const handleTargetResourceTypeChange = (selectedItem) => {
    setSourceProperty('');
    setTargetProperty('');
    setEnumRows([]);
    setNormalRows([]);
    setDefaultProperty('');
    setPropertyShow(true);
    setTargetResourceType(selectedItem);
  };
  const handleSourceResourceTypeChange = (selectedItem) => {
    setSourceProperty('');
    setTargetProperty('');
    setEnumRows([]);
    setNormalRows([]);
    setSourceResourceType(selectedItem);
  };

  useEffect(() => {
    // prettier-ignorec
    switch (sourceApplication?.type) {
      case 'valispace':
        setSourceExternalProjectUrl(`${thirdApiURL}/valispace/containers`);
        break;
      case 'jira':
        setSourceExternalProjectUrl(`${thirdApiURL}/jira/containers`);
        break;
      case 'codebeamer':
        setSourceExternalProjectUrl(`${thirdApiURL}/codebeamer/containers`);
        break;
    }
  }, [sourceApplication]);
  useEffect(() => {
    // prettier-ignore
    switch (targetApplication?.type) {
    case 'valispace':
      setTargetExternalProjectUrl(`${thirdApiURL}/valispace/containers`);
      break;
    case 'jira':
      setTargetExternalProjectUrl(`${thirdApiURL}/jira/containers`);
      break;
    case 'codebeamer':
      setTargetExternalProjectUrl(`${thirdApiURL}/codebeamer/containers`);
      break;
    }
  }, [targetApplication]);
  const handleResponse = (response) => {
    if (response.ok) {
      return response.json().then((data) => {
        showNotification('success', data.message);
        return data;
      });
    }
    switch (response.status) {
      case 400:
        setAuthenticatedThirdApp(true);
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
  // for getting projects
  useEffect(() => {
    if (sourceApplication && sourceExternalProjectUrl) {
      setSourceProjectLoading(true);
      let url;
      url = `${sourceExternalProjectUrl}?application_id=${sourceApplication?.id}`;
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
          setSourceProjectList(data?.items);
          setSourceProjectLoading(false);
        });
    }
  }, [sourceApplication, restartExternalRequest]);

  // for getting projects
  useEffect(() => {
    if (targetApplication && targetExternalProjectUrl) {
      setTargetProjectLoading(true);
      let url;
      url = `${targetExternalProjectUrl}?application_id=${targetApplication?.id}`;
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
          setTargetProjectList(data?.items);
          setTargetProjectLoading(false);
        });
    }
  }, [targetApplication, restartExternalRequest]);

  useEffect(() => {
    if (sourceProjectID) {
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
  }, [sourceProjectID, sourceProject]);
  useEffect(() => {
    if (targetProjectID) {
      setTargetResourceTypeLoading(true);
      let url;
      if (targetApplication?.type === 'codebeamer') {
        url = `${thirdApiURL}/${targetApplication?.type}/resource_types/${targetProjectID}?application_id=${targetApplication?.id}`;
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
  }, [targetProjectID, targetProject]);
  // for getting resource Properties
  useEffect(() => {
    if (sourceResourceType && sourceProject) {
      let url;
      if (sourceApplication?.type === 'jira') {
        url = `${thirdApiURL}/${sourceApplication?.type}/resource_properties?application_id=${sourceApplication?.id}&project_key=${sourceProject?.key}&resource_type=${sourceResourceType?.id}`;
      } else if (sourceApplication?.type === 'codebeamer') {
        url = `${thirdApiURL}/${sourceApplication?.type}/resource_properties?application_id=${sourceApplication?.id}&resource_id=${sourceResourceType?.id}`;
      } else {
        url = `${thirdApiURL}/${sourceApplication?.type}/resource_properties?application_id=${sourceApplication?.id}&resource_type=${sourceResourceType?.id}`;
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
          setSourceProperties(data?.items);
        });
    }
  }, [sourceResourceType, restartExternalRequest]);
  // for getting resource properties
  useEffect(() => {
    if (targetResourceType) {
      let url;
      if (targetApplication?.type === 'jira' && targetProject !== '') {
        url = `${thirdApiURL}/${targetApplication?.type}/resource_properties?application_id=${targetApplication?.id}&project_key=${targetProject?.key}&resource_type=${targetResourceType?.id}`;
      } else if (targetApplication?.type === 'codebeamer' && targetProject !== '') {
        url = `${thirdApiURL}/${targetApplication?.type}/resource_properties?application_id=${targetApplication?.id}&resource_id=${targetResourceType?.id}`;
      } else {
        url = `${thirdApiURL}/${targetApplication?.type}/resource_properties?application_id=${targetApplication?.id}&resource_type=${targetResourceType?.id}`;
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
          setTargetProperties(data?.items);
        });
    }
  }, [targetResourceType, restartExternalRequest]);
  // for getting default property mapping
  useEffect(() => {
    if (targetResourceType) {
      let url;
      url = `${apiURL}/${authCtx?.organization_id}/synchronization/property_mappings/?source_application_type=${sourceApplication?.type}&target_application_type=${targetApplication?.type}`;
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
          setDefaultProperty(data);
        });
    }
  }, [targetResourceType, sourceResourceType, restartExternalRequest]);
  const handleMakeMigration = async (value) => {
    setSubmitLoading(true);
    const body = {
      source_application_id: sourceApplication ? sourceApplication?.id : null,
      source_project: sourceProject ? sourceProject?.name : null,
      source_workspace: sourceProject?.workspace_name
        ? sourceProject?.workspace_name
        : null,
      source_resource:
        sourceApplication?.type === 'codebeamer'
          ? sourceResourceType?.name
          : sourceResourceType?.id,
      target_application_id: targetApplication ? targetApplication?.id : null,
      target_project: targetProject ? targetProject?.name : null,
      target_workspace: targetProject?.workspace_name
        ? targetProject?.workspace_name
        : null,
      target_resource:
        targetApplication?.type === 'codebeamer'
          ? targetResourceType?.name
          : targetResourceType?.id,
      bidirectional: selectDirection?.value !== 'right' ? true : false,
      active: value,
      link_type: 'syncedTo',
      property_mappings: normalRows ? normalRows : [],
    };

    try {
      const response = await fetch(
        `${apiURL}/${authCtx?.organization_id}/synchronization`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            Authorization: 'Bearer ' + authCtx.token, // Make sure 'Authorization' is capitalized correctly
          },
          body: JSON.stringify(body),
        },
      );
      if (response.ok) {
        navigate(`${organization}/admin/synchronization`);
        setSubmitLoading(false);
        setSourceApplication('');
        setSourceProject('');
        setSourceProjectID('');
        setSourceResourceType('');
        setTargetApplication('');
        setTargetProject('');
        setTargetProjectID('');
        setTargetResourceType('');
        setSelectDirection('');
        setEnumRows([]);
        setNormalRows([]);
        setPropertyShow(false);
        return response.json().then((data) => {
          showNotification('success', data.message);
          return data;
        });
      } else if (!response.ok) {
        setSubmitLoading(false);
      }
      switch (response.status) {
        case 400:
          return response.json().then((data) => {
            showNotification('error', data?.message);
            return { items: [] };
          });
        case 401:
          return response.json().then((data) => {
            showNotification('error', data?.message);
            return { items: [] };
          });
        case 403:
          if (authCtx.token) {
            showNotification('error', 'You do not have permission to access');
          } else {
            return { items: [] };
          }
          break;
        default:
          return response.json().then((data) => {
            showNotification('error', data?.message);
          });
      }
    } catch (error) {
      setSubmitLoading(false);
      console.log('error', error);
    }
  };
  const handleCancel = () => {
    navigate(`${organization}/admin/synchronization`);
  };
  return (
    <div style={{ position: 'relative' }}>
      {submitLoading && (
        <div
          style={{
            marginTop: '25px',
          }}
        >
          <UseLoader />
        </div>
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            border: '0.5px solid gray',
            borderRadius: '10px',
            padding: '25px 20px',
            marginTop: '50px',
            position: 'relative',
            width: '20%',
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
            <div style={{ marginTop: '0px' }}>
              <div>
                <FlexboxGrid align="middle">
                  <FlexboxGrid.Item colspan={24}>
                    <FlexboxGrid justify="center">
                      {/* --- Application dropdown ---   */}
                      <FlexboxGrid.Item
                        as={Col}
                        colspan={24}
                        style={{ paddingLeft: '0' }}
                      >
                        <DirectionSelect
                          name="application_type"
                          placeholder="Choose Direction"
                          onChange={handleDirectChange}
                          items={direction ? direction : []}
                        />
                      </FlexboxGrid.Item>
                    </FlexboxGrid>
                  </FlexboxGrid.Item>
                </FlexboxGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            width: '40%',
            border: '0.5px solid gray',
            borderRadius: '10px',
            padding: '25px 20px',
            marginTop: '50px',
            position: 'relative',
            marginRight: '20px',
            height: 'fit-content',
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
                    disabled={directions}
                    isApplication={true}
                    removeApplication={[
                      'gitlab',
                      'codebeamer',
                      'dng',
                      'bitbucket',
                      'glideyoke',
                    ]}
                  />
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </FlexboxGrid.Item>
          </FlexboxGrid>
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
                      <UseCustomProjectSelect
                        name="application_type"
                        placeholder="Choose Project"
                        onChange={handleSourceProject}
                        isLoading={sourceProjectLoading}
                        disabled={authenticatedThirdApp || directions}
                        items={sourceProjectList?.length ? sourceProjectList : []}
                      />
                    </FlexboxGrid.Item>
                  </FlexboxGrid>
                </FlexboxGrid.Item>
              </FlexboxGrid>
              {sourceProjectID && sourceApplication?.type !== 'gitlab' && (
                <FlexboxGrid style={{ marginBottom: '15px' }} align="middle">
                  <FlexboxGrid.Item colspan={4}>
                    <h5>Resource Type: </h5>
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
                          disabled={authenticatedThirdApp || directions}
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
            </div>
          )}
        </div>
        <div
          style={{
            width: '40%',
            border: '0.5px solid gray',
            borderRadius: '10px',
            padding: '25px 20px',
            marginTop: '50px',
            position: 'relative',
            height: 'fit-content',
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
                    disabled={sourceResourceType ? false : true}
                    isApplication={true}
                    removeApplication={[
                      sourceApplication?.type,
                      'gitlab',
                      'glideyoke',
                      'dng',
                      'bitbucket',
                    ]}
                  />
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </FlexboxGrid.Item>
          </FlexboxGrid>
          {targetApplication && (
            <div>
              <FlexboxGrid style={{ marginBottom: '15px' }} align="middle">
                <FlexboxGrid.Item colspan={4}>
                  <h5>Project: </h5>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={20}>
                  <FlexboxGrid justify="end">
                    {/* --- Application dropdown ---   */}
                    <FlexboxGrid.Item as={Col} colspan={20} style={{ paddingLeft: '0' }}>
                      <UseCustomProjectSelect
                        name="application_type"
                        placeholder="Choose Project"
                        onChange={handleTargetProject}
                        isLoading={targetProjectLoading}
                        disabled={
                          authenticatedThirdApp || !targetApplication || directions
                        }
                        items={targetProjectList?.length ? targetProjectList : []}
                      />
                    </FlexboxGrid.Item>
                  </FlexboxGrid>
                </FlexboxGrid.Item>
              </FlexboxGrid>
              {targetProjectID && targetApplication?.type !== 'gitlab' && (
                <FlexboxGrid style={{ marginBottom: '15px' }} align="middle">
                  <FlexboxGrid.Item colspan={4}>
                    <h5>Resource Type: </h5>
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
                          disabled={authenticatedThirdApp || directions}
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
      </div>
      {targetResourceType && defaultProperty && (
        <div
          style={{
            marginTop: '30px',
          }}
        >
          <h5 style={{ textAlign: 'center' }}>Property Mapping</h5>
          {propertyShow && defaultProperty ? (
            <div style={{ marginTop: '30px' }}>
              <PropertyTable
                rows={normalRows}
                setRows={setNormalRows}
                source={sourceProperties}
                target={targetProperties}
                setSource={setSourceProperty}
                setTarget={setTargetProperty}
                setShowAddEnum={setShowAddEnum}
                property={defaultProperty?.length ? defaultProperty : []}
                showNotification={showNotification}
              />
              {sourceProperty?.datatype === 'enum' &&
                targetProperty?.datatype === 'enum' && (
                  <div style={{ marginTop: '50px' }}>
                    <EnumValueTable
                      rows={enumRows}
                      setRows={setEnumRows}
                      source={sourceProperty}
                      target={targetProperty}
                      sourceProperty={sourceProperties}
                      TargetProperty={targetProperties}
                      setSource={setSourceProperties}
                      setTarget={setTargetProperties}
                      showAddEnum={showAddEnum}
                      addEnumId={setNormalRows}
                      normalProperty={normalRows}
                    />
                  </div>
                )}
            </div>
          ) : (
            ''
          )}
        </div>
      )}
      <div style={{ marginTop: '40px' }}>
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'end',
              marginTop: '20px',
              marginBottom: '40px',
            }}
          >
            <ButtonToolbar>
              <Button appearance="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                appearance="ghost"
                disabled={!targetResourceType || directions}
                onClick={() => handleMakeMigration(false)}
              >
                Save
              </Button>
              <Button
                appearance="primary"
                disabled={!targetResourceType || directions}
                onClick={() => handleMakeMigration(true)}
              >
                Save & Run
              </Button>
            </ButtonToolbar>
          </div>
        )}
      </div>
    </div>
  );
};
export default SynchronizationConfig;
