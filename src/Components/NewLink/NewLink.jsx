import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  fetchCreateLink,
  handleApplicationType,
  handleCancelLink,
  handleIsTargetModalOpen,
  handleLinkType,
  handleOslcResponse,
  handleProjectType,
  handleTargetDataArr,
  handleOslcCancelResponse,
  resetOslcCancelResponse,
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
// import application from "../AdminDasComponents/Application/Application.jsx";

const { newLinkMainContainer, targetContainer, targetIframe, targetBtnContainer } =
  styles;

const apiURL = import.meta.env.VITE_LM_REST_API_URL;
const thirdApiURL = `${apiURL}/third_party`;
const gitlabDialogOslcURL = import.meta.env.VITE_GITLAB_DIALOG_URL;
const jiraDialogURL = import.meta.env.VITE_JIRA_DIALOG_URL;
const valispaceDialogURL = import.meta.env.VITE_VALISPACE_DIALOG_URL;
const codebeamerDialogURL = import.meta.env.VITE_CODEBEAMER_DIALOG_URL;

const NewLink = ({ pageTitle: isEditLinkPage }) => {
  // links states
  const {
    configuration_aware,
    isWbe,
    oslcResponse,
    sourceDataList,
    linkType,
    applicationType,
    streamType,
    projectType,
    targetDataArr,
    createLinkRes,
    linkCreateLoading,
    oslcCancelResponse,
  } = useSelector((state) => state.links);
  const [gitlabDialog, setGitlabDialog] = useState(false);
  const [globalDialog, setGlobalDialog] = useState(false);
  const [appWithWorkspace, setAppWithWorkspace] = useState(false);
  const [projectFrameSrc, setProjectFrameSrc] = useState('');
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
    dispatch(handleCurrPageTitle(isEditLinkPage ? isEditLinkPage : 'New Link'));
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
    setProjectFrameSrc('');
    if (projectType) {
      const valispaceApp = projectType?.application?.type?.includes('valispace');
      const jiraApp = projectType?.application?.type?.includes('jira');
      if (projectType?.application?.type) {
        const jiraApp = projectType?.application?.type?.includes('jira');
        const gitlabApp = projectType?.application?.type?.includes('gitlab');
        const glideApp = projectType?.application?.type?.includes('glide');
        const valispaceApp = projectType?.application?.type?.includes('valispace');
        const codebeamerApp = projectType?.application?.type?.includes('codebeamer');
        const isOslc = projectType?.application?.type?.includes('oslc');

        // get service provider id
        const project_id = projectType?.service_provider_id;

        if (isOslc) {
          setProjectFrameSrc(
            // eslint-disable-next-line max-len
            `${gitlabDialogOslcURL}/oslc/provider/selector?provider_id=${project_id}#oslc-core-postMessage-1.0`,
          );
        } else if (gitlabApp) {
          setGitlabDialog(true);
        } else if (glideApp) {
          setGlobalDialog(true);
        } else if (jiraApp) {
          setProjectFrameSrc(
            // eslint-disable-next-line max-len
            `${jiraDialogURL}/oslc/provider/selector?provider_id=${project_id}#oslc-core-postMessage-1.0`,
          );
        } else if (valispaceApp) {
          setProjectFrameSrc(
            // eslint-disable-next-line max-len
            `${valispaceDialogURL}/oslc/provider/selector-project?gc_context=${streamType}`,
          );
        } else if (codebeamerApp) {
          setProjectFrameSrc(
            // eslint-disable-next-line max-len
            `${codebeamerDialogURL}/oslc/provider/selector?provider_id=${project_id}#oslc-core-postMessage-1.0`,
          );
        }
      } else if (projectType?.value && applicationType.type === 'gitlab') {
        setGitlabDialog(true);
      } else if (projectType?.value && applicationType?.type === 'glideyoke') {
        setGlobalDialog(true);
      } else if (projectType?.value && applicationType?.type === 'jira') {
        setGlobalDialog(true);
      } else if (valispaceApp) {
        setProjectFrameSrc(
          // eslint-disable-next-line max-len
          `${valispaceDialogURL}/oslc/provider/selector-project?gc_context=${streamType}`,
        );
      } else if (projectType?.value && applicationType?.type === 'valispace') {
        setAppWithWorkspace(true);
        setGlobalDialog(true);
      } else if (jiraApp) {
        const project_id = projectType?.service_provider_id;
        setProjectFrameSrc(
          // eslint-disable-next-line max-len
          `${jiraDialogURL}/oslc/provider/selector?provider_id=${project_id}#oslc-core-postMessage-1.0`,
        );
      }
    }
  }, [projectType]);

  //// Get Selection dialog response data
  window.addEventListener(
    'message',
    function (event) {
      let message = event.data;
      if (!message.source && !oslcResponse) {
        if (message.toString()?.startsWith('oslc-response')) {
          const response = JSON.parse(message?.substr('oslc-response:'?.length));
          const results = response['oslc:results'];
          const isCancelled = response['oslc:cancel'];
          const targetArray = [];
          if (results?.length > 0) {
            results?.forEach((v, i) => {
              const koatl_path = results[i]['koatl:apiPath'];
              const koatl_uri = results[i]['koatl:apiUrl'];
              const branch_name = results[i]['oslc:branchName'];
              const target_provider = results[i]['oslc:api'];
              const content = results[i]['oslc:content'];
              const content_lines = results[i]['oslc:contentLine'];
              const provider_id = results[i]['oslc:providerId'];
              const resource_id = results[i]['oslc:resourceId'];
              const resource_type = results[i]['oslc:resourceType'];
              const selected_lines = results[i]['oslc:selectedLines'];
              const label = results[i]['oslc:label'];
              const uri = results[i]['rdf:resource'];
              const type = results[i]['rdf:type'];
              targetArray.push({
                koatl_uri,
                koatl_path,
                branch_name,
                target_provider,
                provider_id,
                resource_id,
                resource_type,
                content_lines,
                selected_lines,
                uri,
                label,
                type,
                content,
              });
            });
            dispatch(handleOslcResponse(true));
            dispatch(handleTargetDataArr([...targetArray]));
          } else if (isCancelled) {
            dispatch(handleOslcCancelResponse());
          }
        }
      }
    },
    false,
  );

  useEffect(() => {
    if (oslcCancelResponse) {
      dispatch(resetOslcCancelResponse());
      dispatch(handleApplicationType(null));
      setTimeout(() => {
        dispatch(handleApplicationType(applicationType));
      }, 50);
    }
  }, [oslcCancelResponse]);

  // Call create link function
  useEffect(() => {
    if (projectType && oslcResponse && targetDataArr.length) {
      handleSaveLink();
    }
  }, [oslcResponse, targetDataArr]);

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
    const { projectName, sourceType, title, uri, appName, branch, commit } =
      sourceDataList;
    const selectedLines = title?.split('#');

    // create link with new response formate with new endpoint
    if (res) {
      const targetRes = JSON.parse(res);
      const mappedTargetData = targetRes?.map((item) => {
        const properties = item?.extended_properties;
        // eslint-disable-next-line max-len
        const targetUri = properties?.selected_lines
          ? item?.uri + '#' + properties?.selected_lines
          : item?.uri;
        return {
          target_properties: {
            type: item?.type || item?.resource_type,
            uri: targetUri || item?.link,
            title: item?.name || item?.label,
            provider_id: item?.provider_id || item?.id,
            provider_name: item?.provider_name ? item?.provider_name : '',
            api: item?.api ? item?.api : '',
            description: item?.description ? item?.description : '',
            extra_properties: {
              application_id: applicationType?.id,
              parent_properties: item?.parent_properties ? item?.parent_properties : '',
              branch_name: properties?.branch_name ? properties?.branch_name : '',
              commit_id: properties?.commit_id ? properties?.commit_id : '',
              content_hash: properties?.content_hash ? properties?.content_hash : '',
              selected_lines: properties?.selected_lines
                ? properties?.selected_lines
                : '',
              path: properties?.path ? properties?.path : '',
              web_url: item?.web_url ? item?.web_url : '',
            },
          },
        };
      });

      const linkBodyData = {
        source_properties: {
          type: sourceType,
          uri: uri,
          title: title ? title : '',
          provider_id: '',
          provider_name: projectName,
          api: appName,
          description: '',
          extra_properties: {
            branch_name: branch ? branch : '',
            commit_id: commit ? commit : '',
            selected_lines: selectedLines
              ? selectedLines[1]
                ? selectedLines[1]
                : ''
              : '',
            content_hash: '',
            path: '',
            web_url: '',
          },
        },
        link_properties: {
          relation: linkType?.label,
          status: 'valid',
        },
        target_data: mappedTargetData,
      };

      // console.log('New Response: ', linkBodyData);

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
    } else if (!res && targetDataArr?.length) {
      const targetsData = targetDataArr?.map((data) => {
        const id = data?.selected_lines
          ? data.koatl_uri + '#' + data?.selected_lines
          : data.koatl_uri;
        const platform_uri = data?.uri;
        return {
          koatl_uri: platform_uri,
          koatl_path: data.koatl_path ? data.koatl_path : '',
          content_lines: data.content_lines ? data.content_lines : '',
          selected_lines: data.selected_lines ? data.selected_lines : '',
          branch_name: data.branch_name ? data.branch_name : '',
          provider_id: data.provider_id ? data.provider_id : '',
          resource_id: data.resource_id ? data.resource_id : '',
          resource_type: data.type ? data.type : '',
          content: data.content ? data.content : '',
          target_type: data.resource_type ? data.resource_type : '',
          target_title: data.label ? data.label : '',
          target_id: id,
          target_project: projectType?.label ? projectType?.label : '',
          target_provider: data.target_provider ? data?.target_provider : '',
        };
      });
      let appNameTwo = '';
      if (appName === null) {
        appNameTwo = 'JIRA';
      } else {
        appNameTwo = appName;
      }

      const linkObj = {
        stream: streamType ? streamType : '',
        source_type: sourceType ? sourceType : '',
        source_title: title ? title : '',
        source_project: projectName,
        source_provider: appNameTwo,
        source_id: uri,
        relation: linkType?.label,
        status: 'valid',
        target_data: targetsData,
      };
      // console.log('Link Obj: ', linkObj);
      if (sourceDataList?.uri) {
        dispatch(
          fetchCreateLink({
            url: `${apiURL}/link`,
            token: authCtx.token,
            bodyData: linkObj,
            message: 'link',
            showNotification: showNotification,
          }),
        );
        setExternalProjectUrl('');
      } else {
        showNotification('info', 'Sorry, Source data not found found !!!');
      }
    }
  };

  // eslint-disable-next-line max-len
  // GCM Config_Aware This value manages the GCM context dropdown and conditional rendering.
  const [withConfigAware, setWith] = useState(false);
  const [withoutConfigAware, setWithout] = useState(false);

  useEffect(() => {
    if (configuration_aware) {
      if (streamType && linkType && projectType) setWith(true);
    } else {
      if (linkType && projectType) setWithout(true);
    }
  }, [configuration_aware, linkType, projectType, streamType]);

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
    }
  }, [applicationType]);
  return (
    <>
      <SourceSection />

      <div className="mainContainer">
        <div className="container">
          <div className={newLinkMainContainer}>
            {/* --- Link types --- */}
            <FlexboxGrid style={{ margin: '15px 0' }} align="middle">
              <FlexboxGrid.Item colspan={3}>
                <h3>Link: </h3>
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={21}>
                <CustomReactSelect
                  name="link_type"
                  placeholder="Choose Link Type"
                  apiURL={sourceDataList?.sourceType ? `${apiURL}/link-type` : ''}
                  // after configure the source_type endpoints we need to uncomment line
                  // apiQueryParams={`source_resource=${sourceDataList?.sourceType}`}
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
                  <FlexboxGrid.Item colspan={3}>
                    <h3>Target: </h3>
                  </FlexboxGrid.Item>

                  <FlexboxGrid.Item colspan={21}>
                    <FlexboxGrid justify="start">
                      {/* --- Application dropdown ---   */}
                      <FlexboxGrid.Item
                        as={Col}
                        colspan={11}
                        style={{ paddingLeft: '0' }}
                      >
                        <CustomReactSelect
                          name="application_type"
                          placeholder="Choose Application"
                          apiURL={
                            sourceDataList?.sourceType ? `${apiURL}/application` : ''
                          }
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
                              // eslint-disable-next-line max-len
                              applicationType?.id
                                ? `application_id=${applicationType?.id}`
                                : ''
                            }
                            onChange={handleTargetProject}
                            isLinkCreation={true}
                            isUpdateState={applicationType?.label}
                            isValispace={applicationType?.label === 'Valispace'}
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

            {(withConfigAware || withoutConfigAware) && (
              <div className={targetContainer}>
                {linkType && projectType && projectFrameSrc && (
                  <iframe className={targetIframe} src={projectFrameSrc} />
                )}
              </div>
            )}

            <div>
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
            </div>
          </div>

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
      </div>
    </>
  );
};

export default NewLink;
