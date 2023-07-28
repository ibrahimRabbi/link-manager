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
import UseReactSelect from './UseReactSelect';
import styles from './NewLink.module.scss';
import GlideSelector from '../SelectionDialog/GlideSelector/GlideSelector';

const { newLinkMainContainer, targetContainer, targetIframe, targetBtnContainer } =
  styles;

const apiURL = import.meta.env.VITE_LM_REST_API_URL;
const jiraDialogURL = import.meta.env.VITE_JIRA_DIALOG_URL;
const gitlabDialogURL = import.meta.env.VITE_GITLAB_DIALOG_URL;
const glideDialogURL = import.meta.env.VITE_GLIDE_DIALOG_URL;
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
  const [glideDialog, setGlideDialog] = useState(false);
  const [groupId, setGroupId] = useState('');
  const [linkTypeItems, setLinkTypeItems] = useState([]);
  const [applicationTypeItems, setApplicationTypeItems] = useState([]);
  let [projectTypeItems, setProjectTypeItems] = useState([]);
  const [projectFrameSrc, setProjectFrameSrc] = useState('');
  const [projectId, setProjectId] = useState('');
  const [appData, setAppData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);
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
  // Display project types conditionally by App name
  useEffect(() => {
    (async () => {
      // get link_types dropdown items
      fetch('.././gcm_context.json')
        .then((res) => res.json())
        // .then((data) => setStreamItems(data))
        .catch((err) => console.log(err));

      // get link_types dropdown items
      fetch('.././link_types.json')
        .then((res) => res.json())
        .then((data) => setLinkTypeItems(data))
        .catch((err) => console.log(err));

      // get application_types dropdown items
      fetch('.././application_types.json')
        .then((res) => res.json())
        .then((data) => {
          const { appName } = sourceDataList;
          const filteredApplications = data?.filter((app) => {
            if (app.name !== appName?.toUpperCase()) return app;
          });
          setApplicationTypeItems(filteredApplications);
        })
        .catch((err) => console.log(err));

      // get project_types dropdown items
      const projectsRes = await fetch('.././project_types.json')
        .then((res) => res.json())
        .catch((err) => console.log(err));

      // display projects conditionally
      const specificProject = projectsRes?.reduce((acc, curr) => {
        if (curr.name.includes(applicationType)) acc.push(curr);
        return acc;
      }, []);
      setProjectTypeItems(specificProject);
    })();
  }, [sourceDataList]);

  useEffect(() => {
    const updateProjectTypeItems = async () => {
      // get project_types dropdown items
      const projectsRes = await fetch('.././project_types.json')
        .then((res) => res.json())
        .catch((err) => console.log(err));

      // display projects conditionally
      const specificProject = projectsRes?.reduce((acc, curr) => {
        if (curr.name.includes(`(${applicationType})`)) acc.push(curr);
        return acc;
      }, []);
      setProjectTypeItems(specificProject);
    };
    updateProjectTypeItems();
  }, [applicationType]);

  useEffect(() => {
    dispatch(handleCurrPageTitle(isEditLinkPage ? isEditLinkPage : 'New Link'));
  }, []);

  useEffect(() => {
    isEditLinkPage ? null : dispatch(handleCancelLink());
  }, [location?.pathname]);

  // set iframe SRC conditionally
  useEffect(() => {
    if (projectType) {
      setGitlabDialog(false);
      setGlideDialog(false);
      const jiraApp = projectType?.includes('(JIRA)');
      const gitlabApp = projectType?.includes('(GITLAB)');
      const gitlabAppNative = projectType?.includes('(GITLAB-NATIVE)');
      const glideApp = projectType?.includes('(GLIDE)');
      const glideAppNative = projectType?.includes('(GLIDE-NATIVE)');
      const valispaceApp = projectType?.includes('(VALISPACE)');
      const codebeamerApp = projectType?.includes('(CODEBEAMER)');
      const jiraProjectApp = projectType?.includes('(JIRA-PROJECTS)');
      const valispaceProjectApp = projectType?.includes('(VALISPACE-PROJECTS)');
      const codebeamerProjectApp = projectType?.includes('(CODEBEAMER-PROJECTS)');

      if (jiraApp) {
        setProjectFrameSrc(
          // eslint-disable-next-line max-len
          `${jiraDialogURL}/oslc/provider/selector?provider_id=${projectId}#oslc-core-postMessage-1.0`,
        );
      } else if (gitlabApp) {
        setProjectFrameSrc(
          // eslint-disable-next-line max-len
          `${gitlabDialogURL}/oslc/provider/selector?provider_id=${projectId}&gc_context=${'st-develop'}`,
        );
      } else if (gitlabAppNative) {
        const tempAppData = projectTypeItems?.filter((app) => {
          if (app.name === projectType) return app;
        });
        tempAppData[0].name = tempAppData[0]?.appName;

        setAppData(tempAppData[0]);
        setGitlabDialog(true);
        setGlideDialog(false);
        setGroupId(projectId);
        setProjectFrameSrc('');
      } else if (glideAppNative) {
        const tempAppData = projectTypeItems?.filter((app) => {
          if (app.name === projectType) return app;
        });
        tempAppData[0].name = tempAppData[0].appName;
        setAppData(tempAppData[0]);
        setGlideDialog(true);
        setGitlabDialog(false);
        setProjectFrameSrc('');
      } else if (glideApp) {
        setProjectFrameSrc(
          // eslint-disable-next-line max-len
          `${glideDialogURL}/oslc/provider/selector?gc_context=${streamType}#oslc-core-postMessage-1.0`,
        );
      } else if (valispaceApp) {
        setProjectFrameSrc(
          // eslint-disable-next-line max-len
          `${valispaceDialogURL}/oslc/provider/selector?provider_id=${projectId}#oslc-core-postMessage-1.0`,
        );
      } else if (codebeamerApp) {
        setProjectFrameSrc(
          // eslint-disable-next-line max-len
          `${codebeamerDialogURL}/oslc/provider/selector?provider_id=${projectId}#oslc-core-postMessage-1.0`,
        );
      } else if (jiraProjectApp) {
        setProjectFrameSrc(
          // eslint-disable-next-line max-len
          `${jiraDialogURL}/oslc/provider/selector-project?provider_id=${projectId}`,
        );
      } else if (valispaceProjectApp) {
        setProjectFrameSrc(
          // eslint-disable-next-line max-len
          `${valispaceDialogURL}/oslc/provider/selector-project?gc_context=${streamType}`,
        );
      } else if (codebeamerProjectApp) {
        setProjectFrameSrc(
          // eslint-disable-next-line max-len
          `${codebeamerDialogURL}/oslc/provider/selector-project?gc_context=${streamType}`,
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
      setProjectId('');
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
    dispatch(handleLinkType(selectedItem?.name));
  };

  // Link type dropdown
  const handleApplicationChange = (selectedItem) => {
    dispatch(handleApplicationType(null));
    setTimeout(() => {
      dispatch(handleApplicationType(selectedItem?.name));
    }, 50);
  };

  // Project type dropdown
  const handleTargetProject = (selectedItem) => {
    dispatch(handleProjectType(selectedItem?.name));
    setProjectId(selectedItem?.id);
  };

  // cancel link handler
  const cancelLinkHandler = (value) => {
    console.log(value);
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
            type: item?.type,
            uri: targetUri,
            title: item?.label,
            provider_id: item?.provider_id,
            provider_name: item?.provider_name,
            api: item?.api,
            description: item?.description ? item?.description : '',
            extra_properties: {
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
          relation: linkType,
          status: 'valid',
        },
        target_data: mappedTargetData,
      };

      console.log('New Response: ', linkBodyData);

      dispatch(
        fetchCreateLink({
          url: `${apiURL}/link/new_link`,
          token: authCtx.token,
          bodyData: linkBodyData,
          message: 'link',
          showNotification: showNotification,
        }),
      );
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
          target_project: projectType,
          target_provider: data.target_provider,
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
        relation: linkType,
        status: 'valid',
        target_data: targetsData,
      };
      console.log('Link Obj: ', linkObj);
      dispatch(
        fetchCreateLink({
          url: `${apiURL}/link`,
          token: authCtx.token,
          bodyData: linkObj,
          message: 'link',
          showNotification: showNotification,
        }),
      );
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
                <UseReactSelect
                  name="link_type"
                  placeholder="Choose Link Type"
                  onChange={handleLinkTypeChange}
                  items={linkTypeItems?.length ? linkTypeItems : []}
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
                        <UseReactSelect
                          name="application_type"
                          placeholder="Choose Application"
                          onChange={handleApplicationChange}
                          items={applicationTypeItems?.length ? applicationTypeItems : []}
                        />
                      </FlexboxGrid.Item>

                      {/* --- Project dropdown ---   */}
                      {applicationType && (
                        <FlexboxGrid.Item
                          as={Col}
                          colspan={11}
                          style={{ paddingRight: '0', marginLeft: 'auto' }}
                        >
                          <UseReactSelect
                            name="target_project"
                            placeholder="Choose Project"
                            onChange={handleTargetProject}
                            items={projectTypeItems?.length ? projectTypeItems : []}
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
              {linkType && projectType && gitlabDialog && (
                <GitlabSelector
                  id={groupId}
                  appData={appData}
                  handleSaveLink={handleSaveLink}
                  cancelLinkHandler={cancelLinkHandler}
                ></GitlabSelector>
              )}
              {linkType && projectType && glideDialog && (
                <GlideSelector
                  handleSaveLink={handleSaveLink}
                  appData={appData}
                  cancelLinkHandler={cancelLinkHandler}
                ></GlideSelector>
              )}
            </div>
          </div>

          {/* Target Cancel button  */}
          <div className={targetBtnContainer}>
            <Button
              appearance="default"
              size="md"
              type="submit"
              onClick={() => {
                dispatch(handleCancelLink());
                isWbe ? navigate('/wbe') : navigate('/');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewLink;
