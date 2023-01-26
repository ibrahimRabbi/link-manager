import { Button, Checkbox, ProgressBar, Search } from '@carbon/react';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  fetchCreateLink,
  handleCancelLink,
  handleLinkType,
  handleOslcResponse,
  handleProjectType,
  handleResourceType,
  handleTargetDataArr,
  handleUpdateCreatedLink,
} from '../../Redux/slices/linksSlice';
import { handleCurrPageTitle } from '../../Redux/slices/navSlice';
import AuthContext from '../../Store/Auth-Context.jsx';
import UseDataTable from '../Shared/UseDataTable/UseDataTable';
import UseDropdown from '../Shared/UseDropdown/UseDropdown';
import jiraLogo from './jira_logo.png';
import gitlabLogo from './gitlab_logo.png';
import glideLogo from './glide_logo.png';

import styles from './NewLink.module.scss';
const {
  btnContainer,
  dropdownStyle,
  emptySearchWarning,
  inputContainer,
  linkTypeContainer,
  newLinkTable,
  searchContainer,
  searchInput,
  sourceContainer,
  sourceGrid,
  sourceProp,
  sourceValue,
  targetContainer,
  targetSearchContainer,
} = styles;

// dropdown items
const linkTypeItems = [
  { text: 'affectedBy' },
  { text: 'implementedBy' },
  { text: 'trackedBy' },
  { text: 'constrainedBy' },
  { text: 'decomposedBy' },
  { text: 'elaboratedBy' },
  { text: 'satisfiedBy' },
];
const projectItems = [
  {
    text: 'Cross-Domain Integration Demo (JIRA)',
    icon: <img src={jiraLogo} height={25} alt="Jira" />,
  },
  {
    text: 'Cross-Domain Integration Demo (GITLAB)',
    icon: <img src={gitlabLogo} height={22} alt="Gitlab" />,
  },
  {
    text: 'Jet Engine Design (GLIDE)',
    icon: <img src={glideLogo} height={23} alt="Glide" />,
  },
];
// const resourceItems = ['User story', 'Task', 'Epic', 'Bug', 'Improvement'];

// Table header
const headers = [
  { key: 'identifier', header: 'Identifier' },
  { key: 'name', header: 'Name' },
  { key: 'description', header: 'Description' },
  { key: 'checkbox', header: <Checkbox labelText="" id="" /> },
];

const apiURL = `${process.env.REACT_APP_LM_REST_API_URL}/link`;
const NewLink = ({ pageTitle: isEditLinkPage }) => {
  const {
    isWbe,
    oslcResponse,
    sourceDataList,
    linkType,
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
  const [projectTypeItems, setProjectTypeItems] = useState([]);
  const [projectFrameSrc, setProjectFrameSrc] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const authCtx = useContext(AuthContext);
  const isJIRA = sourceDataList?.appName?.includes('jira');
  const isGitlab = sourceDataList?.appName?.includes('gitlab');
  const isGlide = sourceDataList?.appName?.includes('glide');

  // Display project types conditionally by App name
  useEffect(() => {
    if (isJIRA) {
      setProjectTypeItems([
        {
          text: 'Cross-Domain Integration Demo (GITLAB)',
          icon: <img src={gitlabLogo} height={22} alt="Gitlab" />,
        },
        {
          text: 'Jet Engine Design (GLIDE)',
          icon: <img src={glideLogo} height={23} alt="Glide" />,
        },
      ]);
    } else if (isGitlab) {
      setProjectTypeItems([
        {
          text: 'Cross-Domain Integration Demo (JIRA)',
          icon: <img src={jiraLogo} height={25} alt="Jira" />,
        },
        {
          text: 'Jet Engine Design (GLIDE)',
          icon: <img src={glideLogo} height={23} alt="Glide" />,
        },
      ]);
    } else if (isGlide) {
      setProjectTypeItems([
        {
          text: 'Cross-Domain Integration Demo (JIRA)',
          icon: <img src={jiraLogo} height={25} alt="Jira" />,
        },
        {
          text: 'Cross-Domain Integration Demo (GITLAB)',
          icon: <img src={gitlabLogo} height={22} alt="Gitlab" />,
        },
      ]);
    } else {
      setProjectTypeItems(projectItems);
    }
  }, []);

  let sourceTitles = [];
  let sourceValues = {};
  if (isGlide) {
    sourceTitles = ['Glide Project', 'Title', 'Resource', 'URI'];
    sourceValues = {
      projectName: sourceDataList['projectName'],
      title: sourceDataList['title'],
      sourceType: sourceDataList['sourceType'],
      uri: sourceDataList['uri'],
      origin: sourceDataList['origin'],
    };
  } else if (isJIRA) {
    sourceTitles = ['JIRA Project', 'Title', 'Issue Type', 'URI'];
    sourceValues = {
      projectName: sourceDataList['projectName'],
      title: sourceDataList['title'],
      sourceType: sourceDataList['sourceType'],
      uri: sourceDataList['uri'],
    };
    console.log(sourceValues);
  } else {
    sourceTitles = ['GitLab Project', 'Filename', 'URI'];
    sourceValues = sourceDataList;
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
        // eslint-disable-next-line max-len
        setProjectFrameSrc('https://jira-oslc-api-dev.koneksys.com/oslc/provider/selector?provider_id=CDID#oslc-core-postMessage-1.0');
      } else if (gitlabApp) {
        // eslint-disable-next-line max-len
        setProjectFrameSrc(
          'https://gitlab-oslc-api-dev.koneksys.com/oslc/provider/selector',
        );
      } else if (glideApp) {
        // eslint-disable-next-line max-len
        setProjectFrameSrc(
          'https://glide-oslc-api-dev.koneksys.com/oslc/provider/selector',
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
          const targetArray = [];
          results?.forEach((v, i) => {
            const label = results[i]['oslc:label'];
            const uri = results[i]['rdf:resource'];
            const type = results[i]['rdf:type'];
            targetArray.push({ uri, label, type });
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
      console.log('link creating');
    }
  }, [projectType, oslcResponse, targetDataArr]);

  useEffect(() => {
    if (createLinkRes) {
      console.log(createLinkRes);
      navigate('/wbe');
    }
  }, [createLinkRes]);

  // Link type dropdown
  const handleLinkTypeChange = ({ selectedItem }) => {
    dispatch(handleResourceType(null));
    dispatch(handleLinkType(selectedItem.text));
  };

  const targetProjectItems =
    linkType === 'constrainedBy' ? ['Jet Engine Design (GLIDE)'] : projectTypeItems;
  // const targetResourceItems =
  //   linkType === 'constrainedBy' ? ['Document (PLM)', 'Part (PLM)'] : resourceItems;

  // Project type dropdown
  const handleTargetProject = ({ selectedItem }) => {
    dispatch(handleProjectType(selectedItem.text));
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

    // console.log('NewLink.jsx -> handleSaveLink -> targetDataArr', targetDataArr);
    const targetsData = targetDataArr?.map((data) => {
      // console.log('NewLink.jsx -> handleSaveLink -> targetDataArr -> data', data);
      return {
        target_type: data.type,
        target_title: data.label,
        target_id: data.uri,
        target_project: projectType,
        target_provider: 'JIRA',
      };
    });

    const linkObj = {
      source_type: title,
      source_title: title,
      source_project: projectName,
      source_provider: appName,
      source_id: uri,
      relation: linkType,
      status: 'active',
      target_data: targetsData,
    };
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

  return (
    <div className="mainContainer">
      <div className="container">
        <div className={sourceContainer}>
          <h5>Source</h5>
          {sourceTitles.map((properties, index) => (
            <div className={sourceGrid} key={properties}>
              <p className={sourceProp}>{properties} :</p>
              <p className={sourceValue}>{Object.values(sourceValues)[index]}</p>
            </div>
          ))}
        </div>

        <div className={linkTypeContainer}>
          <UseDropdown
            onChange={handleLinkTypeChange}
            items={linkTypeItems}
            title="Link type"
            selectedValue={editLinkData?.linkType}
            label={'Select link type'}
            id="newLink_linkTypes"
            className={dropdownStyle}
          />

          <UseDropdown
            onChange={handleTargetProject}
            items={targetProjectItems}
            title="Target project"
            label={'Select target project'}
            selectedValue={editLinkData?.projectType}
            id="target-project-dropdown"
            className={dropdownStyle}
          />

          {/*{linkType && !isJiraDialog && !isGitlabDialog && !isGlideDialog && (*/}
          {/*  <UseDropdown*/}
          {/*    items={targetResourceItems}*/}
          {/*    onChange={handleTargetResource}*/}
          {/*    title="Target resource type"*/}
          {/*    selectedValue={editLinkData?.resource}*/}
          {/*    label={'Select target resource type'}*/}
          {/*    id="resourceType-dropdown"*/}
          {/*    className={dropdownStyle}*/}
          {/*  />*/}
          {/*)}*/}
        </div>

        {
          linkCreateLoading && <ProgressBar label=''/>
        }
        {/* --- After selected link type ---  */}
        {((linkType && projectType) || isEditLinkPage) && (
          <div className={targetContainer}>
            <h5>Target</h5>

            {/* Show the selection dialogs */}
            {projectFrameSrc && (
              <iframe src={projectFrameSrc} height="600px" width="100%" />
            )}

            {isGlide && (
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

            {targetDataArr.length && (
              <>
                {/* // new link btn  */}
                {projectType && resourceType && targetDataArr[0] && !isEditLinkPage && (
                  <div className={btnContainer}>
                    <Button kind="secondary" onClick={handleCancelOpenedLink} size="md">
                      Cancel
                    </Button>
                    <Button kind="primary" onClick={handleSaveLink} size="md">
                      Save
                    </Button>
                  </div>
                )}

                {/* // edit link btn  */}
                {isEditLinkPage && editLinkData?.id && (
                  <div className={btnContainer}>
                    <Button kind="secondary" onClick={handleCancelOpenedLink} size="md">
                      Cancel
                    </Button>
                    <Button kind="primary" onClick={handleLinkUpdate} size="md">
                      Save
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewLink;
