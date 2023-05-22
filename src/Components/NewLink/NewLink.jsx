import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  fetchCreateLink,
  handleCancelLink,
  handleIsTargetModalOpen,
  // handleLinkType,
  handleOslcResponse,
  handleOslcIntegration,
  handleTargetDataArr,
} from '../../Redux/slices/linksSlice';
import { handleCurrPageTitle } from '../../Redux/slices/navSlice';
import AuthContext from '../../Store/Auth-Context.jsx';

import styles from './NewLink.module.scss';
import UseSelectPicker from '../Shared/UseDropdown/UseSelectPicker';
import { FlexboxGrid, Col, Button } from 'rsuite';
import SourceSection from '../SourceSection';
import UseLoader from '../Shared/UseLoader';
import { fetchGetData } from '../../Redux/slices/useCRUDSlice.jsx';
import { fetchOslcResource } from '../../Redux/slices/oslcResourcesSlice.jsx';
import CustomSelect from '../AdminDasComponents/CustomSelect.jsx';
// import SelectField from '../AdminDasComponents/SelectField.jsx';
const { targetContainer, targetIframe, targetBtnContainer, cancelMargin } = styles;

const apiURL = `${process.env.REACT_APP_LM_REST_API_URL}/link`;
const lmApiUrl = process.env.REACT_APP_LM_REST_API_URL;

const NewLink = ({ pageTitle: isEditLinkPage }) => {
  // links states
  const {
    configuration_aware,
    isWbe,
    oslcResponse,
    sourceDataList,
    linkType,
    // applicationType,
    streamType,
    integrationType,
    targetDataArr,
    createLinkRes,
    linkCreateLoading,
  } = useSelector((state) => state.links);

  const { oslcSelectionDialogData } = useSelector((state) => state.oslcResources);
  const [selectedApplication, setSelectedApplication] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [projectUrlQueryParams, setProjectUrlQueryParams] = useState('');
  const [integration, setIntegration] = useState('');
  const [integrationUrlQueryParams, setIntegrationUrlQueryParams] = useState('');
  const [selectedIntegration, setSelectedIntegration] = useState('');

  // Hardcoded section
  const [linkTypeItems, setLinkTypeItems] = useState([]);
  const [selectedLinkType, setSelectedLinkType] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);

  // Display link types
  useEffect(() => {
    (async () => {
      // get link_types dropdown items
      fetch('.././link_types.json')
        .then((res) => res.json())
        .then((data) => setLinkTypeItems(data))
        .catch((err) => console.log(err));
    })();
  }, [sourceDataList]);

  useEffect(() => {
    setIntegration(oslcSelectionDialogData[0]?.value);
  }, [oslcSelectionDialogData]);

  useEffect(() => {
    dispatch(handleCurrPageTitle(isEditLinkPage ? isEditLinkPage : 'New Link'));
    const currPage = 1;
    const pageSize = 100;
    const getUrl = `${lmApiUrl}/project?page=${currPage}&per_page=${pageSize}`;
    dispatch(
      fetchGetData({
        url: getUrl,
        token: authCtx.token,
        stateName: 'allProjects',
      }),
    );
  }, []);

  useEffect(() => {
    isEditLinkPage ? null : dispatch(handleCancelLink());
  }, [location?.pathname]);

  //// Get Selection dialog response data
  window.addEventListener(
    'message',
    function (event) {
      let message = event.data;
      if (!message.source && !oslcResponse) {
        if (message.toString()?.startsWith('oslc-response')) {
          const response = JSON.parse(message?.substr('oslc-response:'?.length));
          const results = response['oslc:results'];
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
    if (integrationType && oslcResponse && targetDataArr.length) {
      console.log('integrationType: ', integrationType);
      console.log('oslcResponse: ', oslcResponse);
      console.log('targetDataArr: ', targetDataArr);
      handleSaveLink();
    }
  }, [oslcResponse, targetDataArr]);

  useEffect(() => {
    if (createLinkRes) {
      isWbe ? navigate('/wbe') : navigate('/');
    }
  }, [createLinkRes]);

  // Link type dropdown
  const handleLinkTypeChange = (linkType) => {
    if (linkType) {
      if (linkType?.name !== selectedLinkType) {
        setSelectedLinkType(linkType?.name);
        if (selectedApplication) setSelectedApplication('');
        if (selectedProject) setSelectedProject('');
        if (selectedIntegration) setSelectedIntegration('');
      }
    } else {
      setSelectedLinkType('');
      if (selectedApplication) setSelectedApplication('');
      if (selectedProject) setSelectedProject('');
      if (selectedIntegration) setSelectedIntegration('');
    }
  };

  // Application dropdown handler
  const handleApplicationChange = (applicationId) => {
    console.log('handling application: ', applicationId);
    if (applicationId) {
      if (applicationId !== selectedApplication) {
        const newProjectUrlQuery = `application_id=${applicationId}`;
        setSelectedApplication(applicationId);
        setProjectUrlQueryParams(newProjectUrlQuery);
        if (selectedProject) setSelectedProject('');
        if (selectedIntegration) setSelectedIntegration('');
      }
    } else {
      setSelectedApplication('');
      if (selectedProject) setSelectedProject('');
      if (selectedIntegration) setSelectedIntegration('');
    }
  };

  // Link type dropdown
  const handleProjectChange = (projectId) => {
    console.log('handling project: ', projectId);
    if (projectId) {
      if (projectId !== selectedProject) {
        setSelectedProject(projectId);
        // eslint-disable-next-line max-len
        const newApplicationUrlQuery = `project_id=${projectId}&application_id=${selectedApplication}`;
        setIntegrationUrlQueryParams(newApplicationUrlQuery);
        setSelectedIntegration('');
      }
    } else {
      setSelectedProject('');
      if (selectedIntegration) setSelectedIntegration('');
    }
  };

  // Project type dropdown
  const handleIntegration = (integrationData) => {
    console.log('handling integration: ', integrationData);
    if (integrationData) {
      setSelectedIntegration(integrationData);
      const selectedItem = JSON.parse(integrationData);
      dispatch(handleOslcIntegration(selectedItem?.name));

      const consumerToken = localStorage.getItem('consumerToken');
      dispatch(
        fetchOslcResource({
          url: selectedItem.service_provider_url,
          token: 'Bearer ' + consumerToken,
          dialogLabel: selectedItem.service_label,
        }),
      );
    } else {
      setSelectedIntegration('');
    }
  };

  // Create new link
  const handleSaveLink = () => {
    const { projectName, sourceType, title, uri, appName } = sourceDataList;

    const targetsData = targetDataArr?.map((data) => {
      // eslint-disable-next-line max-len
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
        target_project: oslcSelectionDialogData[0].serviceProviderTitle,
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
      relation: selectedLinkType,
      status: 'active',
      target_data: targetsData,
    };
    console.log('Link Obj: ', linkObj);
    dispatch(
      fetchCreateLink({
        url: apiURL,
        token: authCtx.token,
        bodyData: linkObj,
        message: 'link',
      }),
    );
  };

  // eslint-disable-next-line max-len
  // GCM Config_Aware This value manages the GCM context dropdown and conditional rendering.
  const [withConfigAware, setWith] = useState(false);
  const [withoutConfigAware, setWithout] = useState(false);

  useEffect(() => {
    if (configuration_aware) {
      setWith(true);
    } else {
      setWithout(true);
    }
  }, [selectedIntegration]);

  useEffect(() => {
    if (linkType && integrationType) {
      dispatch(handleIsTargetModalOpen(true));
    }
  }, [linkType, integrationType]);

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

          {/* --- Project and associated applications --- */}
          {selectedLinkType && (
            <>
              <FlexboxGrid style={{ marginBottom: '15px' }} align="middle">
                <FlexboxGrid.Item colspan={3}>
                  <h3>Target: </h3>
                </FlexboxGrid.Item>

                <FlexboxGrid.Item colspan={21}>
                  <FlexboxGrid justify="start">
                    {/* --- Application dropdown ---   */}
                    <FlexboxGrid.Item as={Col} colspan={7} style={{ paddingLeft: '0' }}>
                      <CustomSelect
                        name="application"
                        placeholder="Select application"
                        apiURL={`${lmApiUrl}/application`}
                        value={selectedApplication}
                        onChange={(value) => handleApplicationChange(value)}
                      />
                    </FlexboxGrid.Item>

                    {/* --- Project dropdown ---   */}
                    <FlexboxGrid.Item as={Col} colspan={7} style={{ paddingLeft: '20' }}>
                      <CustomSelect
                        name="project"
                        placeholder="Select project"
                        apiURL={`${lmApiUrl}/project`}
                        value={selectedProject}
                        apiQueryParams={projectUrlQueryParams}
                        onChange={(value) => handleProjectChange(value)}
                      />
                    </FlexboxGrid.Item>

                    {/* --- Project dropdown ---   */}
                    <FlexboxGrid.Item as={Col} colspan={7} style={{ paddingLeft: '20' }}>
                      <CustomSelect
                        name="integration"
                        placeholder="Select integration"
                        customSelectLabel={'service_description'}
                        apiURL={`${lmApiUrl}/association`}
                        value={selectedIntegration}
                        apiQueryParams={integrationUrlQueryParams}
                        onChange={(value) => handleIntegration(value)}
                      />
                    </FlexboxGrid.Item>
                  </FlexboxGrid>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </>
          )}

          {linkCreateLoading && <UseLoader />}
          {/* --- Target Selection dialog ---  */}

          {(withConfigAware || withoutConfigAware) && (
            <div className={targetContainer}>
              {selectedLinkType && selectedProject && selectedIntegration && (
                <iframe className={targetIframe} src={integration} />
              )}
            </div>
          )}

          {/* Target Cancel button  */}
          <div
            className={`
          ${targetBtnContainer} 
          ${integrationType ? '' : cancelMargin}`}
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
