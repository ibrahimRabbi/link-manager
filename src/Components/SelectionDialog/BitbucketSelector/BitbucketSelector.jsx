/* eslint-disable indent */
/* eslint-disable max-len */
import React, { useContext, useEffect, useState } from 'react';
import { CheckTree, FlexboxGrid } from 'rsuite';
import style from './BitbucketSelector.module.scss';
import FolderFillIcon from '@rsuite/icons/FolderFill';
import PageIcon from '@rsuite/icons/Page';
import CodeEditor from './CodeEditor';
import ButtonGroup from './ButtonGroup';
import AuthContext from '../../../Store/Auth-Context';
import UseLoader from '../../Shared/UseLoader';
import ExternalAppModal from '../../AdminDasComponents/ExternalAppIntegrations/ExternalAppModal/ExternalAppModal.jsx';
import {
  BASIC_AUTH_APPLICATION_TYPES,
  MICROSERVICES_APPLICATION_TYPES,
  OAUTH2_APPLICATION_TYPES,
} from '../../../App.jsx';
import UseReactSelect from '../../Shared/Dropdowns/UseReactSelect';
import UseDefaultSelect from './UseDefaultSelect';

const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;

const BitbucketSelector = ({ handleSaveLink, appData, cancelLinkHandler }) => {
  const [pExist, setPExist] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [selectedCodes, setSelectedCodes] = useState('');
  const [fileExt, setFileExt] = useState('');
  const [multipleSelected, setMultipleSelected] = useState([]);
  const [singleSelected, setSingleSelected] = useState('');
  const [checkedValues, setCheckedValues] = React.useState([]);
  const [branchList, setBranchList] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [commitId, setCommitId] = useState('');
  const [commitList, setCommitList] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [treeLoading, setTreeLoading] = useState(false);
  const [branchLoading, setBranchLoading] = useState(false);
  const [commitLoading, setCommitLoading] = useState(false);
  const [authenticatedThirdApp, setAuthenticatedThirdApp] = useState(false);
  const broadcastChannel = new BroadcastChannel('oauth2-app-status');
  const [defaultBranch, setDefaultBranch] = useState('');
  const [defaultCommit, setDefaultCommit] = useState('');
  const [defaultCommitId, setDefaultCommitId] = useState('');

  const getExtLoginData = (data) => {
    if (data?.status) {
      setAuthenticatedThirdApp(false);
    }
  };

  broadcastChannel.onmessage = (event) => {
    const { status } = event.data;
    if (status === 'success') {
      setAuthenticatedThirdApp(false);
    }
  };

  const handleProjectChange = (selectedItem) => {
    setDefaultBranch('');
    setDefaultCommit('');
    setDefaultCommitId('');
    setBranchList([]);
    setBranchId('');
    setCommitList([]);
    setCommitId('');
    setProjectId(selectedItem?.id);
    setDefaultBranch(selectedItem?.default_branch);
    setDefaultCommit(selectedItem?.last_commit?.name);
    setDefaultCommitId(selectedItem?.last_commit?.id);
    setBranchList([]);
    setTreeData([]);
  };
  const handleBranchChange = (selectedItem) => {
    if (branchId !== selectedItem?.id) {
      setDefaultBranch('');
      setDefaultCommit('');
      setDefaultCommitId('');
      setBranchId(selectedItem?.id);
      setTreeData([]);
      setCommitList([]);
      setCommitId('');
    }
  };
  const handleCommit = (selectedItem) => {
    if (commitId !== selectedItem?.id) {
      setCommitId(selectedItem?.id);
      setDefaultCommit('');
      setDefaultCommitId('');
      setTreeData([]);
    }
  };

  useEffect(() => {
    if (appData?.workspace_id) {
      setProjectId(''); // Clear the project selection
      setProjects([]);
      setTreeData([]);
      setLoading(true);
      fetch(
        `${lmApiUrl}/third_party/bitbucket/containers/${appData?.workspace_id}?page=1&per_page=10&application_id=${appData?.application_id}`,
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
            if (response.status === 401) {
              setAuthenticatedThirdApp(true);
              return { items: [] };
            }
          }
        })
        .then((data) => {
          if (data?.total_items === 0) {
            setLoading(false);
            setPExist(true);
          } else {
            setLoading(false);
            setPExist(false);
            setProjects(data?.items ? data?.items : []);
          }
        });
    } else {
      setProjectId('');
      setProjects([]);
    }
  }, [appData?.workspace_id, authCtx, authenticatedThirdApp]);

  useEffect(() => {
    if (projectId) {
      setBranchLoading(true);
      fetch(
        `${lmApiUrl}/third_party/bitbucket/containers/${appData?.workspace_id}/${projectId}/branch?page=1&per_page=10&application_id=${appData?.application_id}`,
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
            if (response.status === 401) {
              setAuthenticatedThirdApp(true);
              return { items: [] };
            }
          }
        })
        .then((data) => {
          setBranchLoading(false);
          setBranchList(data?.items);
        });
    } else {
      setBranchList([]);
    }
  }, [projectId, authCtx]);
  useEffect(() => {
    if ((projectId && branchId) || (projectId && defaultBranch)) {
      setCommitLoading(true);
      fetch(
        `${lmApiUrl}/third_party/bitbucket/containers/${
          appData?.workspace_id
        }/${projectId}/commit?page=1&per_page=10&application_id=${
          appData?.application_id
        }&branch=${branchId || defaultBranch}`,
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
            if (response.status === 401) {
              setAuthenticatedThirdApp(true);
              return { items: [] };
            }
          }
        })
        .then((data) => {
          setCommitLoading(false);
          setCommitList(data?.items);
        });
    } else {
      setCommitList([]);
    }
  }, [projectId, branchId, defaultBranch, authCtx]);
  useEffect(() => {
    if ((projectId && commitId) || (projectId && defaultCommitId)) {
      setTreeLoading(true);
      setTreeData([]);
      fetch(
        `${lmApiUrl}/third_party/bitbucket/containers/${
          appData?.workspace_id
        }/${projectId}/files?ref=${commitId || defaultCommitId}&application_id=${
          appData?.application_id
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
            if (response.status === 401) {
              setAuthenticatedThirdApp(true);
              return { items: [] };
            }
          }
        })
        .then((data) => {
          setTreeLoading(false);
          setTreeData(data?.items);
        });
    }
  }, [projectId, authCtx, defaultCommitId, commitId]);

  const handleTreeChange = (value) => {
    setCheckedValues(value);
    const selectedNodes = value.map((value) => {
      // Find the corresponding nodeData in the treeData
      const findNode = (nodes) => {
        for (const node of nodes) {
          if (node.value === value) {
            return node;
          }
          if (node.children) {
            const found = findNode(node.children);
            if (found) {
              return found;
            }
          }
        }
        return null;
      };

      return findNode(treeData);
    });
    setMultipleSelected([]);
    setSelectedFile('');
    if (selectedNodes.length === 0) {
      //   setCheckedNodes([]);
    } else if (
      selectedNodes[0].value.endsWith('.pdf') ||
      selectedNodes[0].value.endsWith('.zip') ||
      selectedNodes[0].value.endsWith('.png') ||
      selectedNodes[0].value.endsWith('.jpg') ||
      selectedNodes[0].value.endsWith('.jpeg') ||
      selectedNodes[0].is_folder === true ||
      selectedNodes.length > 1
    ) {
      setSingleSelected('');
      setSelectedCodes('');
      setMultipleSelected(selectedNodes);
    } else {
      setSelectedFile(selectedNodes[0]);
      if (selectedNodes[0]?.name) {
        const fileName = selectedNodes[0]?.name;
        const fileExtension = fileName.split('.').pop();
        setFileExt(fileExtension);
      }
      setMultipleSelected([]);
      setSelectedCodes('');
      setSingleSelected(selectedNodes[0]);
    }
  };
  const getChildren = async (node) => {
    try {
      const response = await fetch(
        `${lmApiUrl}/third_party/bitbucket/containers/${appData?.workspace_id}/${projectId}/files?path=${node?.extended_properties?.path}&ref=${node?.extended_properties?.commit_id}&application_id=${appData?.application_id}`,
        {
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
          },
        },
      );
      const childrenData = await response.json();
      return childrenData?.items;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {loading ? (
        <div style={{ marginTop: '50px' }}>
          <UseLoader />
        </div>
      ) : pExist ? (
        <h3 style={{ textAlign: 'center', marginTop: '50px', color: '#1675e0' }}>
          Selected group has no projects.
        </h3>
      ) : authenticatedThirdApp ? (
        <ExternalAppModal
          showInNewLink={true}
          formValue={appData}
          isOauth2={OAUTH2_APPLICATION_TYPES?.includes(appData?.type)}
          isBasic={(
            BASIC_AUTH_APPLICATION_TYPES + MICROSERVICES_APPLICATION_TYPES
          ).includes(appData?.type)}
          onDataStatus={getExtLoginData}
          integrated={false}
        />
      ) : (
        <div>
          {/* --- Projects ---  */}
          <FlexboxGrid style={{ margin: '15px 0' }} align="middle">
            <FlexboxGrid.Item colspan={4}>
              <h3>Projects: </h3>
            </FlexboxGrid.Item>

            <FlexboxGrid.Item colspan={20}>
              <UseReactSelect
                name="gitlab_native_projects"
                placeholder="Choose Project"
                onChange={handleProjectChange}
                disabled={authenticatedThirdApp}
                items={projects?.length ? projects : []}
              />
            </FlexboxGrid.Item>
          </FlexboxGrid>

          {/* --- Branches ---  */}
          {(projectId || defaultBranch) && (
            <FlexboxGrid style={{ margin: '15px 0' }} align="middle">
              <FlexboxGrid.Item colspan={4}>
                <h3>Branches: </h3>
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={20}>
                <UseDefaultSelect
                  name="gitlab_native_branches"
                  placeholder="Choose Branch"
                  onChange={handleBranchChange}
                  disabled={authenticatedThirdApp}
                  isLoading={branchLoading}
                  items={branchList?.length ? branchList : []}
                  value={defaultBranch}
                />
              </FlexboxGrid.Item>
            </FlexboxGrid>
          )}

          {/* --- Commits ---  */}
          {(projectId && branchId) || defaultCommit || defaultBranch ? (
            <FlexboxGrid style={{ margin: '15px 0' }} align="middle">
              <FlexboxGrid.Item colspan={4}>
                <h3>Commits: </h3>
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={20}>
                <UseDefaultSelect
                  name="gitlab_native_commits"
                  placeholder="Choose Commit"
                  onChange={handleCommit}
                  isLoading={commitLoading}
                  disabled={authenticatedThirdApp}
                  items={commitList?.length ? commitList : []}
                  value={defaultCommit}
                />
              </FlexboxGrid.Item>
            </FlexboxGrid>
          ) : null}

          {treeLoading && (
            <div style={{ marginTop: '50px' }}>
              <UseLoader />
            </div>
          )}
          {treeData.length > 0 &&
            projectId &&
            ((branchId && commitId) || defaultCommitId || defaultBranch) && (
              <div>
                <div className={style.treeDiv}>
                  <div className={style.tree}>
                    <CheckTree
                      data={treeData}
                      style={{ width: 280 }}
                      value={checkedValues}
                      onChange={(value) => handleTreeChange(value)}
                      getChildren={getChildren}
                      renderTreeNode={(node) => {
                        return (
                          <>
                            {node.children ? <FolderFillIcon /> : <PageIcon />}{' '}
                            {node.name}
                          </>
                        );
                      }}
                    />
                  </div>
                  <div className={style.codemirror}>
                    <div>
                      {multipleSelected.length > 1 ? (
                        <div className={style.error}>
                          File content cannot be displayed when multiple files are
                          selected
                        </div>
                      ) : (
                        selectedFile && (
                          <CodeEditor
                            singleSelected={singleSelected}
                            fileExtension={fileExt}
                            setSelectedCodes={setSelectedCodes}
                            projectId={projectId}
                            commitId={commitId ? commitId : defaultCommitId}
                            appId={appData?.application_id}
                            workspaceId={appData?.workspace_id}
                          ></CodeEditor>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      )}
      <div
        className={
          treeData.length > 0 &&
          projectId &&
          ((branchId && commitId) || defaultCommitId || defaultBranch)
            ? style.buttonDivOne
            : style.buttonDivTwo
        }
      >
        <ButtonGroup
          handleSaveLink={handleSaveLink}
          selectedCodes={selectedCodes}
          multipleSelected={multipleSelected}
          singleSelected={singleSelected}
          branchName={branchId ? branchId : defaultBranch}
          cancelLinkHandler={cancelLinkHandler}
          checkedValues={checkedValues}
        ></ButtonGroup>
      </div>
    </div>
  );
};

export default BitbucketSelector;
