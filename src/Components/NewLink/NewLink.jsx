/* eslint-disable indent */
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  fetchCreateLink,
  handleApplicationType,
  handleCancelLink,
  handleIsTargetModalOpen,
  handleLinkType,
  handleProjectType,
} from '../../Redux/slices/linksSlice';
import { handleCurrPageTitle } from '../../Redux/slices/navSlice';
import AuthContext from '../../Store/Auth-Context.jsx';

import { FlexboxGrid, Col, Button, Message, toaster } from 'rsuite';
import SourceSection from '../SourceSection';
import UseLoader from '../Shared/UseLoader';
import GitlabSelector from '../SelectionDialog/GitlabSelector/GitlabSelector';
import styles from './NewLink.module.scss';
import CustomReactSelect from '../Shared/Dropdowns/CustomReactSelect';
import {
  BASIC_AUTH_APPLICATION_TYPES,
  MICROSERVICES_APPLICATION_TYPES,
  OAUTH2_APPLICATION_TYPES,
} from '../../App.jsx';
// eslint-disable-next-line max-len
import ExternalAppModal from '../AdminDasComponents/ExternalAppIntegrations/ExternalAppModal/ExternalAppModal.jsx';
import GlobalSelector from '../SelectionDialog/GlobalSelector/GlobalSelector';

const { newLinkMainContainer, targetBtnContainer } = styles;

const apiURL = import.meta.env.VITE_LM_REST_API_URL;
const thirdApiURL = `${apiURL}/third_party`;

const NewLink = ({ pageTitle: isEditLinkPage }) => {
  // links states
  const {
    isWbe,
    sourceDataList,
    linkType,
    applicationType,
    projectType,
    createLinkRes,
    linkCreateLoading,
  } = useSelector((state) => state.links);
  const [gitlabDialog, setGitlabDialog] = useState(false);
  const [globalDialog, setGlobalDialog] = useState(false);
  const [appWithWorkspace, setAppWithWorkspace] = useState(false);
  const [externalProjectUrl, setExternalProjectUrl] = useState('');
  const [externalProjectDisabled, setExternalProjectDisabled] = useState(false);
  const [authenticatedThirdApp, setAuthenticatedThirdApp] = useState(false);
  const [restartExternalRequest, setRestartExternalRequest] = useState(false);
  const broadcastChannel = new BroadcastChannel('oauth2-app-status');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);

  const closeExternalAppResetRequest = () => {
    setAuthenticatedThirdApp(false);
    setExternalProjectDisabled(false);
    setRestartExternalRequest(true);
  };

  broadcastChannel.onmessage = (event) => {
    const { status } = event.data;
    if (status === 'success') {
      closeExternalAppResetRequest();
    }
  };

  const getFailedExternalAuthentication = () => {
    // Deactivate project dropdown
    setExternalProjectDisabled(true);
    // Send option to show external authentication method
    setAuthenticatedThirdApp(true);
  };

  const getExtLoginData = (data) => {
    if (data?.status) {
      closeExternalAppResetRequest();
    }
  };

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

  useEffect(() => {
    dispatch(handleCurrPageTitle('New Link'));
  }, []);

  useEffect(() => {
    if (restartExternalRequest) {
      setRestartExternalRequest(false);
    }
  }, [restartExternalRequest]);

  useEffect(() => {
    isEditLinkPage ? null : dispatch(handleCancelLink());
  }, [location?.pathname]);

  // set iframe SRC conditionally
  useEffect(() => {
    setGitlabDialog(false);
    setGlobalDialog(false);
    setAppWithWorkspace(false);

    if (projectType?.value) {
      switch (applicationType?.type) {
        case 'gitlab':
          setGitlabDialog(true);
          break;
        case 'glideyoke':
          setGlobalDialog(true);
          break;
        case 'jira':
          setGlobalDialog(true);
          break;
        case 'valispace':
          setAppWithWorkspace(true);
          setGlobalDialog(true);
          break;
        case 'codebeamer':
          setGlobalDialog(true);
          break;
        case 'dng':
          setGlobalDialog(true);
          break;
      }
    }
  }, [projectType]);

  useEffect(() => {
    if (createLinkRes) {
      isWbe ? navigate('/wbe') : navigate('/');
    }
  }, [createLinkRes]);

  // Link type dropdown
  const handleLinkTypeChange = (selectedItem) => {
    dispatch(handleLinkType(selectedItem));
  };

  // Link type dropdown
  const handleApplicationChange = (selectedItem) => {
    setExternalProjectUrl('');
    closeExternalAppResetRequest();
    dispatch(handleApplicationType(selectedItem));
  };

  // Project type dropdown
  const handleTargetProject = (selectedItem) => {
    const newSelectedItem = {
      ...selectedItem,
      application_id: applicationType?.id,
      workspace_id: selectedItem?.id,
      application_type: applicationType?.type,
    };
    dispatch(handleProjectType(newSelectedItem));
  };

  // cancel link handler
  const cancelLinkHandler = () => {
    dispatch(handleCancelLink());
    isWbe ? navigate('/wbe') : navigate('/');
  };

  // Create new link
  const handleSaveLink = (res) => {
    const {
      projectName,
      sourceType,
      resourceTypeLabel,
      title,
      uri,
      appName,
      branch,
      commit,
      searchString,
      parentSourceType,
      parentFileUri,
      projectId,
    } = sourceDataList;
    const selectedLines = title?.split('#');

    // create link with new response formate with new endpoint
    if (res) {
      const targetRes = JSON.parse(res);
      const mappedTargetData = targetRes?.map((item) => {
        const properties = item?.extended_properties;

        const targetUri = properties?.selected_lines
          ? item?.web_url.replace(properties.commit_id, properties.branch_name) +
            '#' +
            properties?.selected_lines
          : item?.web_url;
        return {
          target_properties: {
            type: item?.type || item?.resource_type,
            uri: targetUri || item?.web_url,
            title: item?.name || item?.label,
            provider_id: item?.provider_id || item?.id,
            provider_name: item?.provider_name ? item?.provider_name : '',
            api: item?.api ? item?.api : '',
            description: item?.description ? item?.description : '',
            extra_properties: {
              application_id: applicationType?.id,
              parent_properties: item?.parent_properties
                ? {
                    ...item?.parent_properties,
                    web_url: item?.web_url.replace(
                      properties.commit_id,
                      properties.branch_name,
                    ),
                    extended_properties: {
                      ...item?.parent_properties?.extended_properties,
                      branch_name: properties?.branch_name,
                    },
                  }
                : '',
              branch_name: properties?.branch_name ? properties?.branch_name : '',
              commit_id: properties?.commit_id ? properties?.commit_id : '',
              content_hash: properties?.content_hash ? properties?.content_hash : '',
              selected_lines: properties?.selected_lines
                ? properties?.selected_lines
                : '',
              path: properties?.path ? properties?.path : '',
              api_url: item?.link ? item?.link : '',
              web_application_resource_type: item?.resourceTypes
                ? item?.resourceTypes
                : item?.web_application_resource_type
                ? item?.web_application_resource_type
                : '',
              web_url_with_commit: item?.parent_properties?.extended_properties
                ?.web_url_with_commit
                ? item?.parent_properties?.extended_properties?.web_url_with_commit +
                  '#' +
                  properties?.selected_lines
                : '',
            },
          },
        };
      });

      // parents properties for the source if source is gitlab
      const source_parent_properties = {
        api: appName,
        description: '',
        label: selectedLines ? selectedLines[0] : '',
        type: parentSourceType ? decodeURIComponent(parentSourceType) : '',
        provider_id: projectId ? projectId : '',
        provider_name: appName,
        uri: parentFileUri ? decodeURIComponent(parentFileUri) : '',
        web_url: parentFileUri ? decodeURIComponent(parentFileUri) : '',
        extended_properties: {
          branch_name: branch ? branch : '',
          commit_id: commit ? commit : '',
          path: selectedLines ? selectedLines[0] : '',
        },
      };

      const linkBodyData = {
        source_properties: {
          type: sourceType,
          uri: uri,
          title: title ? title : '',
          provider_id: projectId ? projectId : '',
          provider_name: appName,
          api: appName,
          description: '',
          extra_properties: {
            branch_name: branch ? branch : '',
            commit_id: commit ? commit : '',
            parent_properties: parentFileUri ? source_parent_properties : '',
            search_params: searchString ? searchString : '',
            selected_lines: selectedLines
              ? selectedLines[1]
                ? selectedLines[1]
                : ''
              : '',
            project_name: projectName ? projectName : '',
            content_hash: '',
            web_application_resource_type: resourceTypeLabel ? resourceTypeLabel : '',
            path: '',
            web_url: uri,
          },
        },
        link_properties: {
          relation: linkType?.label,
          status: 'valid',
        },
        target_data: mappedTargetData,
      };

      if (sourceDataList?.uri) {
        dispatch(
          fetchCreateLink({
            url: `${apiURL}/link/new_link`,
            token: authCtx.token,
            bodyData: linkBodyData,
            message: 'link',
            showNotification: showNotification,
          }),
        );
      } else {
        showNotification('info', 'Sorry, Source data not found !!!');
      }
    }
  };

  useEffect(() => {
    if (linkType && projectType) {
      dispatch(handleIsTargetModalOpen(true));
    }
  }, [linkType, projectType]);

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

  return (
    <>
      <SourceSection />
      <div className={newLinkMainContainer}>
        {/* --- Link types --- */}
        <FlexboxGrid style={{ margin: '15px 0' }} align="middle">
          <FlexboxGrid.Item colspan={4}>
            <h3>Link: </h3>
          </FlexboxGrid.Item>

          <FlexboxGrid.Item colspan={20}>
            <CustomReactSelect
              name="link_type"
              placeholder="Choose Link Type"
              apiURL={sourceDataList?.sourceType ? `${apiURL}/link-type` : ''}
              apiQueryParams={`source_resource=${
                sourceDataList?.sourceType
                  ? encodeURIComponent(sourceDataList?.sourceType)
                  : ''
              }`}
              isLinkType={true}
              onChange={handleLinkTypeChange}
              isLinkCreation={true}
              value={linkType?.label}
            />
          </FlexboxGrid.Item>
        </FlexboxGrid>

        {/* --- Application and project types --- */}
        {linkType && (
          <>
            <FlexboxGrid style={{ marginBottom: '15px' }} align="middle">
              <FlexboxGrid.Item colspan={4}>
                <h3>Target: </h3>
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={20}>
                <FlexboxGrid justify="start">
                  {/* --- Application dropdown ---   */}
                  <FlexboxGrid.Item as={Col} colspan={11} style={{ paddingLeft: '0' }}>
                    <CustomReactSelect
                      name="application_type"
                      placeholder="Choose Application"
                      apiURL={sourceDataList?.sourceType ? `${apiURL}/application` : ''}
                      onChange={handleApplicationChange}
                      isLinkCreation={true}
                      value={applicationType?.label}
                      isUpdateState={linkType}
                      selectedLinkType={linkType}
                      isApplication={true}
                      removeApplication={sourceDataList?.appName}
                    />
                  </FlexboxGrid.Item>

                  {/* --- Project dropdown ---   */}
                  {applicationType?.name && externalProjectUrl && (
                    <FlexboxGrid.Item
                      as={Col}
                      colspan={11}
                      style={{ paddingRight: '0', marginLeft: 'auto' }}
                    >
                      <CustomReactSelect
                        name="target_project_type"
                        placeholder="Choose Project"
                        apiURL={externalProjectUrl}
                        apiQueryParams={
                          applicationType?.id
                            ? `application_id=${applicationType?.id}`
                            : ''
                        }
                        onChange={handleTargetProject}
                        isLinkCreation={true}
                        isUpdateState={applicationType?.label}
                        value={projectType?.label}
                        disabled={externalProjectDisabled}
                        restartRequest={restartExternalRequest}
                        getErrorStatus={getFailedExternalAuthentication}
                      />
                    </FlexboxGrid.Item>
                  )}
                </FlexboxGrid>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </>
        )}

        {linkCreateLoading && <UseLoader />}

        {/* --- Target Selection dialog ---  */}
        <>
          {authenticatedThirdApp && (
            <ExternalAppModal
              showInNewLink={true}
              formValue={applicationType}
              isOauth2={OAUTH2_APPLICATION_TYPES?.includes(applicationType?.type)}
              isBasic={(
                BASIC_AUTH_APPLICATION_TYPES + MICROSERVICES_APPLICATION_TYPES
              ).includes(applicationType?.type)}
              onDataStatus={getExtLoginData}
              integrated={false}
            />
          )}
          {linkType && gitlabDialog && (
            <GitlabSelector
              appData={projectType}
              handleSaveLink={handleSaveLink}
              cancelLinkHandler={cancelLinkHandler}
            ></GitlabSelector>
          )}
          {linkType && globalDialog && (
            <GlobalSelector
              handleSaveLink={handleSaveLink}
              appData={projectType}
              defaultProject={appWithWorkspace ? '' : projectType}
              cancelLinkHandler={cancelLinkHandler}
              workspace={appWithWorkspace}
            />
          )}
        </>

        {/* Target Cancel button  */}
        {!projectType?.id && (
          <div className={targetBtnContainer}>
            <Button
              appearance="ghost"
              size="md"
              onClick={() => {
                dispatch(handleCancelLink());
                isWbe ? navigate('/wbe') : navigate('/');
              }}
            >
              Cancel
            </Button>
            <Button appearance="primary" size="md" disabled={true}>
              OK
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default NewLink;
