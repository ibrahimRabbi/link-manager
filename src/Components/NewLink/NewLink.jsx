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
} from '../../Redux/slices/linksSlice';
import { handleCurrPageTitle } from '../../Redux/slices/navSlice';
import AuthContext from '../../Store/Auth-Context.jsx';

import styles from './NewLink.module.scss';
import UseSelectPicker from '../Shared/UseDropdown/UseSelectPicker';
import { FlexboxGrid, Col, Button } from 'rsuite';
import SourceSection from '../SourceSection';
import UseLoader from '../Shared/UseLoader';
const { targetContainer, targetIframe, targetBtnContainer, cancelMargin } = styles;

const apiURL = `${process.env.REACT_APP_LM_REST_API_URL}/link`;
const jiraDialogURL = process.env.REACT_APP_JIRA_DIALOG_URL;
const gitlabDialogURL = process.env.REACT_APP_GITLAB_DIALOG_URL;
const glideDialogURL = process.env.REACT_APP_GLIDE_DIALOG_URL;

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
  } = useSelector((state) => state.links);
  const [linkTypeItems, setLinkTypeItems] = useState([]);
  const [applicationTypeItems, setApplicationTypeItems] = useState([]);
  const [projectTypeItems, setProjectTypeItems] = useState([]);
  const [projectFrameSrc, setProjectFrameSrc] = useState('');
  const [projectId, setProjectId] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);
  const isJIRA = sourceDataList?.appName?.includes('jira');
  const isGitlab = sourceDataList?.appName?.includes('gitlab');
  const isGlide = sourceDataList?.appName?.includes('glide');

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
        .then((data) => setApplicationTypeItems(data))
        .catch((err) => console.log(err));

      // get project_types dropdown items
      const projectsRes = await fetch('.././project_types.json')
        .then((res) => res.json())
        .catch((err) => console.log(err));

      // display projects conditionally
      const specificProject = projectsRes?.reduce((acc, curr) => {
        if (isJIRA) {
          const jira = curr.name.includes('JIRA');
          if (!jira) acc.push(curr);
        } else if (isGitlab) {
          const gitlab = curr.name.includes('GITLAB');
          if (!gitlab) acc.push(curr);
        } else if (isGlide) {
          const glide = curr.name.includes('GLIDE');
          if (!glide) acc.push(curr);
        } else {
          acc.push(curr);
        }

        return acc;
      }, []);
      setProjectTypeItems(specificProject);
    })();
  }, [sourceDataList]);

  useEffect(() => {
    dispatch(handleCurrPageTitle(isEditLinkPage ? isEditLinkPage : 'New Link'));
  }, []);

  useEffect(() => {
    isEditLinkPage ? null : dispatch(handleCancelLink());
  }, [location?.pathname]);

  // set iframe SRC conditionally
  useEffect(() => {
    if (projectType) {
      const jiraApp = projectType?.includes('(JIRA)');
      const gitlabApp = projectType?.includes('(GITLAB)');
      const glideApp = projectType?.includes('(GLIDE)');

      if (jiraApp) {
        setProjectFrameSrc(
          // eslint-disable-next-line max-len
          `${jiraDialogURL}/oslc/provider/selector?provider_id=CDID#oslc-core-postMessage-1.0&gc_context=${streamType}`,
        );
      } else if (gitlabApp) {
        setProjectFrameSrc(
          // eslint-disable-next-line max-len
          `${gitlabDialogURL}/oslc/provider/selector?provider_id=${projectId}&gc_context=${'st-develop'}`,
        );
      } else if (glideApp) {
        setProjectFrameSrc(
          // eslint-disable-next-line max-len
          `${glideDialogURL}/oslc/provider/selector?gc_context=${streamType}`,
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
          console.log('dialog response: ', results);
          const targetArray = [];
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
        }
      }
    },
    false,
  );

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
    dispatch(handleApplicationType(selectedItem?.name));
  };

  // stream type dropdown
  // const handleStreamChange = ({ selectedItem }) => {
  //   dispatch(handleStreamType(selectedItem.key));
  // };

  const targetProjectItems =
    linkType === 'constrainedBy' ? ['Jet Engine Design (GLIDE)'] : projectTypeItems;
  // const targetResourceItems =
  //   linkType === 'constrainedBy' ? ['Document (PLM)', 'Part (PLM)'] : resourceItems;

  // Project type dropdown
  const handleTargetProject = (selectedItem) => {
    dispatch(handleProjectType(selectedItem?.name));
    setProjectId(selectedItem?.id);
  };

  // Create new link
  const handleSaveLink = () => {
    const { projectName, title, uri, appName } = sourceDataList;

    const targetsData = targetDataArr?.map((data) => {
      const id = data?.selected_lines ? data.uri + '#' + data?.selected_lines : data.uri;
      return {
        koatl_uri: data.koatl_uri,
        koatl_path: data.koatl_path,
        content_lines: data.content_lines,
        selected_lines: data.selected_lines,
        branch_name: data.branch_name,
        provider_id: data.provider_id,
        resource_id: data.resource_id,
        resource_type: data.type,
        content: data.content,
        target_type: data.resource_type,
        target_title: data.label,
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
      stream: streamType,
      source_type: title,
      source_title: title,
      source_project: projectName,
      source_provider: appNameTwo,
      source_id: uri,
      relation: linkType,
      status: 'active',
      target_data: targetsData,
    };
    console.log('Link Obj: ', linkObj);
    dispatch(
      fetchCreateLink({
        url: apiURL,
        token: authCtx.token,
        bodyData: linkObj,
      }),
    );
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
      {/* <WbeTopNav /> */}
      <SourceSection />

      <div className="mainContainer">
        <div className="container">
          {/* --- Link types --- */}
          <FlexboxGrid style={{ margin: '15px 0' }} align="middle">
            <FlexboxGrid.Item colspan={3}>
              <h3>Link: </h3>
            </FlexboxGrid.Item>

            <FlexboxGrid.Item colspan={21}>
              <UseSelectPicker
                placeholder="Choose Link Type"
                onChange={handleLinkTypeChange}
                items={linkTypeItems}
                // className={dropdownStyle}
              />
            </FlexboxGrid.Item>
          </FlexboxGrid>

          {/* {configuration_aware && (
              <UseDropdown
                onChange={handleStreamChange}
                items={streamItems}
                title="GCM Configuration Context"
                selectedValue={editLinkData?.linkType}
                label={'Select GCM Configuration Context'}
                id="newLink_stream"
                className={dropdownStyle}
              />
            )} */}

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
                    <FlexboxGrid.Item as={Col} colspan={11} style={{ paddingLeft: '0' }}>
                      <UseSelectPicker
                        placeholder="Choose Application"
                        onChange={handleApplicationChange}
                        items={applicationTypeItems}
                      />
                    </FlexboxGrid.Item>

                    {/* --- Project dropdown ---   */}
                    {applicationType && (
                      <FlexboxGrid.Item
                        as={Col}
                        colspan={11}
                        style={{ paddingRight: '0', marginLeft: 'auto' }}
                      >
                        <UseSelectPicker
                          placeholder="Choose Project"
                          onChange={handleTargetProject}
                          items={targetProjectItems}
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
              {linkType && applicationType && projectType && projectFrameSrc && (
                <iframe className={targetIframe} src={projectFrameSrc} />
              )}
            </div>
          )}

          {/* Target Cancel button  */}
          <div
            className={`
          ${targetBtnContainer} 
          ${projectFrameSrc && projectType ? '' : cancelMargin}`}
          >
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
