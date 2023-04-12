import { Checkbox, ProgressBar, Search } from '@carbon/react';
import { Button } from 'rsuite';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  fetchCreateLink,
  handleApplicationType,
  handleCancelLink,
  handleIsTargetModalOpen,
  handleLinkType,
  handleOslcResponse,
  handleProjectType,
  handleTargetDataArr,
  handleUpdateCreatedLink,
} from '../../Redux/slices/linksSlice';
import { handleCurrPageTitle } from '../../Redux/slices/navSlice';
import AuthContext from '../../Store/Auth-Context.jsx';
import WbeTopNav from '../Shared/NavigationBar/WbeTopNav';
import UseDataTable from '../Shared/UseDataTable/UseDataTable';

import styles from './NewLink.module.scss';
import UseSelectPicker from '../Shared/UseDropdown/UseSelectPicker';
import { FlexboxGrid, Col } from 'rsuite';
const {
  btnContainer,
  // dropdownStyle,
  // dropdownStyle2,
  emptySearchWarning,
  inputContainer,
  newLinkTable,
  searchContainer,
  searchInput,
  targetContainer,
  targetIframe,
  targetBtnContainer,
  targetSearchContainer,
  // applicationContainer,
  // appAndProjectContainer,
  cancelMargin,
} = styles;

// Table header
const headers = [
  { key: 'identifier', header: 'Identifier' },
  { key: 'name', header: 'Name' },
  { key: 'description', header: 'Description' },
  { key: 'checkbox', header: <Checkbox labelText="" id="" /> },
];

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
    resourceType,
    editLinkData,
    targetDataArr,
    editTargetData,
    createLinkRes,
    linkCreateLoading,
  } = useSelector((state) => state.links);
  const { register, handleSubmit } = useForm();
  const [searchText, setSearchText] = useState(null);
  const [displayTableData, setDisplayTableData] = useState([]);
  // const [streamItems, setStreamItems] = useState([]);
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

  let sourceTitles = [];
  let sourceValues = {};
  if (isGlide) {
    sourceTitles = ['Glide Project', 'Title', 'Resource'];
    sourceValues = {
      projectName: sourceDataList['projectName'],
      title: sourceDataList['title'],
      sourceType: sourceDataList['sourceType'],
      uri: sourceDataList['uri'],
      origin: sourceDataList['origin'],
    };
  } else if (isJIRA) {
    sourceTitles = ['JIRA Project', 'Title', 'Issue Type'];
    sourceValues = {
      projectName: sourceDataList['projectName'],
      title: sourceDataList['title'],
      sourceType: sourceDataList['sourceType'],
      uri: sourceDataList['uri'],
    };
  } else {
    sourceTitles = ['GitLab Project', 'Filename'];
    sourceValues = sourceDataList;
    console.log(sourceTitles, sourceValues);
  }

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

  // Edit link options start
  useEffect(() => {
    if (editTargetData?.identifier) {
      const string = editTargetData?.description?.split(' ')[0]?.toLowerCase();
      setSearchText(
        string === 'document' ? 'document' : string === 'user' ? 'data' : null,
      );
    }
  }, [isEditLinkPage]);
  // Edit link options end

  // search data or document
  useEffect(() => {
    setDisplayTableData([]);
    // eslint-disable-next-line max-len
    // const URL = editTargetData?.identifier ? `../../${searchText}.json` : `../../${searchText}.json`;
    // if(searchText){
    //   fetch(URL)
    //     .then(res => res.json())
    //     .then(data => setDisplayTableData(data))
    //     .catch(() => { });
    // }
  }, [searchText]);

  const handleSearchData = (data) => {
    dispatch(handleTargetDataArr(null));
    fetch(
      // eslint-disable-next-line max-len
      'https://192.241.220.34:9443/jts/j_security_check?j_username=koneksys&j_password=koneksys',
    )
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    setSearchText(data?.searchText);
  };

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

  // Resource type dropdown
  // const handleTargetResource = ({ selectedItem }) => {
  //   dispatch(handleResourceType(selectedItem));
  // };

  // Selected target data
  const handleSelectedData = (data, value) => {
    dispatch(handleTargetDataArr({ data, value }));
  };

  // Edit created link
  const handleLinkUpdate = () => {
    dispatch(handleUpdateCreatedLink());
    Swal.fire({
      icon: 'success',
      title: 'Link Updated success!',
      timer: 3000,
    });
    isWbe ? navigate('/wbe') : navigate('/');
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
        target_provider: 'JIRA',
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

  // cancel create link
  const handleCancelOpenedLink = () => {
    dispatch(handleCancelLink());
    isWbe ? navigate('/wbe') : navigate('/');
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
      <WbeTopNav />

      <div className="mainContainer">
        <div className="container">
          {/* --- Link types --- */}
          <FlexboxGrid style={{ marginBottom: '15px' }} align="middle">
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

          {linkCreateLoading && <ProgressBar label="" />}
          {/* --- Target Selection dialog ---  */}

          {(withConfigAware || withoutConfigAware) && (
            <div className={targetContainer}>
              {linkType && applicationType && projectType && projectFrameSrc && (
                <iframe className={targetIframe} src={projectFrameSrc} />
              )}

              {isGlide && isJIRA && (
                <>
                  <div className={targetSearchContainer}>
                    <form
                      onSubmit={handleSubmit(handleSearchData)}
                      className={searchContainer}
                    >
                      <div className={inputContainer}>
                        <Search
                          id=""
                          labelText=""
                          className={searchInput}
                          type="text"
                          placeholder="Search by identifier or name"
                          {...register('searchText')}
                          size="md"
                        />
                      </div>
                      <Button kind="primary" size="md" type="submit">
                        Search
                      </Button>
                    </form>
                  </div>

                  {((searchText && displayTableData[0]) || isEditLinkPage) && (
                    <div className={newLinkTable}>
                      <UseDataTable
                        headers={headers}
                        tableData={displayTableData}
                        isCheckBox={true}
                        isChecked={editLinkData?.targetData?.identifier}
                        editTargetData={editTargetData}
                        isPagination={displayTableData[0] ? true : false}
                        selectedData={handleSelectedData}
                      />
                    </div>
                  )}
                  {searchText && !displayTableData[0] && (
                    <h2 className={emptySearchWarning}>
                      Please search by valid identifier or name
                    </h2>
                  )}
                </>
              )}

              {targetDataArr[0] && (
                <>
                  {/* // new link btn  */}
                  {projectType && resourceType && !isEditLinkPage && (
                    <div className={btnContainer}>
                      <Button
                        appearance="default"
                        onClick={handleCancelOpenedLink}
                        size="md"
                      >
                        Cancel
                      </Button>
                      <Button appearance="primary" onClick={handleSaveLink} size="md">
                        Save
                      </Button>
                    </div>
                  )}

                  {/* // edit link btn  */}
                  {isEditLinkPage && editLinkData?.id && (
                    <div className={btnContainer}>
                      <Button
                        appearance="default"
                        onClick={handleCancelOpenedLink}
                        size="md"
                      >
                        Cancel
                      </Button>
                      <Button appearance="primary" onClick={handleLinkUpdate} size="md">
                        Save
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* Target Cancel button  */}
              {/* <div className={targetBtnContainer}>
                    <Button kind="secondary"
                      onClick={()=>{
                        dispatch(handleCancelLink());
                      // isWbe ? navigate('/wbe') : navigate('/');
                      }}
                      size="md" type="submit">Cancel</Button>
                  </div> */}
            </div>
          )}

          {/* Target Cancel button  */}
          <div className={`${targetBtnContainer} ${projectFrameSrc ? '' : cancelMargin}`}>
            <Button
              appearance="default"
              onClick={() => {
                dispatch(handleCancelLink());
                isWbe ? navigate('/wbe') : navigate('/');
              }}
              size="md"
              type="submit"
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
