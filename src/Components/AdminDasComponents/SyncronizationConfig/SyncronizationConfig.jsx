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
import {
  handleApplicationType,
  handleLinkType,
  handleProjectType,
} from '../../../Redux/slices/linksSlice';
import UseReactSelect from '../../Shared/Dropdowns/UseReactSelect';
import { useContext } from 'react';
import AuthContext from '../../../Store/Auth-Context';
import CustomReactSelect from '../../Shared/Dropdowns/CustomReactSelect';

const apiURL = import.meta.env.VITE_LM_REST_API_URL;
const thirdApiURL = `${apiURL}/third_party`;

const SyncronizationConfig = () => {
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
  const [applicationList, setApplicationList] = useState([]);
  const [sourceApplication, setSourceApplication] = useState('');
  const [sourceProjectList, setSourceProjectList] = useState([]);
  const [targetProjectList, setTargetProjectList] = useState([]);
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
    dispatch(handleLinkType(''));
    setApiCall(true);
    setSourceProjectList([]);
    setExternalProjectUrl('');
    closeExternalAppResetRequest();
    setSourceApplication(selectedItem);
  };
  const handleApplicationChange = (selectedItem) => {
    setTargetApiCall(true);
    setTargetProjectList([]);
    setExternalProjectUrl('');
    closeExternalAppResetRequest();
    dispatch(handleApplicationType(selectedItem));
  };
  const handleTargetProject = (selectedItem) => {
    const newSelectedItem = {
      ...selectedItem,
      application_id: applicationType?.id,
      workspace_id: selectedItem?.id,
      application_type: applicationType?.type,
    };
    dispatch(handleProjectType(newSelectedItem));
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
          if (response.status === 401) {
            setAuthenticatedThirdApp(true);
            return { items: [] };
          }
        }
      })
      .then((data) => {
        setApplicationList(data?.items);
      });
  }, []);
  useEffect(() => {
    if ((apiCall || targetApiCall) && externalProjectUrl !== '') {
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
          } else if (response.status === 401) {
            setAuthenticatedThirdApp(true);
            return { items: [] };
          } else {
            // Handle other error cases here, e.g., show an error message
            throw new Error('API request failed');
          }
        })
        .then((data) => {
          if (data && apiCall) {
            setSourceProjectList(data?.items);
            setApiCall(false);
          } else {
            setTargetProjectList(data?.items);
            setTargetApiCall(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [applicationType, externalProjectUrl, apiCall]);
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
                    items={applicationList.length ? applicationList : []}
                  />
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </FlexboxGrid.Item>
          </FlexboxGrid>
          {sourceApplication && (
            <FlexboxGrid style={{ marginBottom: '15px' }} align="middle">
              <FlexboxGrid.Item colspan={24}>
                <FlexboxGrid justify="start">
                  {/* --- Application dropdown ---   */}
                  <FlexboxGrid.Item as={Col} colspan={24} style={{ paddingLeft: '0' }}>
                    <UseReactSelect
                      name="application_type"
                      placeholder="Choose Project"
                      onChange={handleTargetProject}
                      items={sourceProjectList?.length ? sourceProjectList : []}
                    />
                  </FlexboxGrid.Item>
                </FlexboxGrid>
              </FlexboxGrid.Item>
            </FlexboxGrid>
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
          {sourceApplication && (
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
                      onChange={handleLinkTypeChange}
                      isLinkCreation={true}
                      value={linkType?.label}
                    />
                  </FlexboxGrid.Item>
                </FlexboxGrid>
              </FlexboxGrid.Item>
            </div>
          )}
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
          {linkType && sourceApplication && (
            <FlexboxGrid style={{ marginBottom: '15px' }} align="middle">
              <FlexboxGrid.Item colspan={24}>
                <FlexboxGrid justify="start">
                  {/* --- Application dropdown ---   */}
                  <FlexboxGrid.Item as={Col} colspan={24} style={{ paddingLeft: '0' }}>
                    <CustomReactSelect
                      name="application_type"
                      placeholder="Choose Application"
                      apiURL={`${apiURL}/application`}
                      onChange={handleApplicationChange}
                      isLinkCreation={true}
                      value={applicationType?.label}
                      isUpdateState={linkType}
                      selectedLinkType={linkType}
                      isApplication={true}
                      removeApplication={sourceApplication?.type}
                    />
                  </FlexboxGrid.Item>
                </FlexboxGrid>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          )}
          <FlexboxGrid style={{ marginBottom: '15px' }} align="middle">
            <FlexboxGrid.Item colspan={24}>
              <FlexboxGrid justify="start">
                {/* --- Application dropdown ---   */}
                <FlexboxGrid.Item as={Col} colspan={24} style={{ paddingLeft: '0' }}>
                  <UseReactSelect
                    name="application_type"
                    placeholder="Choose Project"
                    onChange={handleTargetProject}
                    items={targetProjectList?.length ? targetProjectList : []}
                  />
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </FlexboxGrid.Item>
          </FlexboxGrid>
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

export default SyncronizationConfig;
