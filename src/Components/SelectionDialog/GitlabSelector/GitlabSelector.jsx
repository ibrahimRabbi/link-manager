/* eslint-disable max-len */
import React, { useContext, useEffect, useState } from 'react';
import { CheckTree, Loader, Placeholder } from 'rsuite';
import style from './GitlabSelector.module.css';
import FolderFillIcon from '@rsuite/icons/FolderFill';
import PageIcon from '@rsuite/icons/Page';
import CodeEditor from './CodeEditor';
import ButtonGroup from './ButtonGroup';
import UseSelectPicker from '../../Shared/UseDropdown/UseSelectPicker';
import AuthContext from '../../../Store/Auth-Context';
import UseLoader from '../../Shared/UseLoader';

const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;

const GitlabSelector = ({ id, handleSaveLink, appId }) => {
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
  const handleProjectChange = (selectedItem) => {
    setProjectId(selectedItem?.id);
    setBranchList([]);
    setBranchId('');
    setCommitList([]);
    setCommitId('');
  };
  const handleBranchChange = (selectedItem) => {
    setBranchId(selectedItem?.id);
    setCommitList([]);
    setCommitId('');
  };
  const handleCommitChange = (selectedItem) => {
    setCommitId(selectedItem?.id);
  };
  useEffect(() => {
    if (id) {
      setProjectId(''); // Clear the project selection
      setProjects([]);
      setTreeData([]);
      setLoading(true);
      fetch(
        `${lmApiUrl}/third_party/gitlab/containers/${id}?page=1&per_page=10&application_id=${appId}`,
        {
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
          },
        },
      )
        .then((response) => response.json())
        .then((data) => {
          if (data?.total_items === 0) {
            setLoading(false);
            setPExist(true);
            // showNotification('info', 'There is no project for selected group.');
          } else {
            setLoading(false);
            setPExist(false);
            setProjects(data?.items);
          }
        });
    } else {
      setProjectId('');
      setProjects([]);
    }
  }, [id, authCtx]);

  useEffect(() => {
    if (projectId) {
      fetch(
        `${lmApiUrl}/third_party/gitlab/container/${projectId}/branch?page=1&per_page=10&application_id=${appId}`,
        {
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
          },
        },
      )
        .then((response) => response.json())
        .then((data) => {
          setBranchList(data?.items);
        });
    } else {
      setBranchList([]);
    }
  }, [projectId, authCtx]);
  useEffect(() => {
    if (projectId && branchId) {
      fetch(
        `${lmApiUrl}/third_party/gitlab/container/${projectId}/commit?page=1&per_page=10&application_id=${appId}&branch=${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
          },
        },
      )
        .then((response) => response.json())
        .then((data) => {
          setCommitList(data?.items);
        });
    } else {
      setCommitList([]);
    }
  }, [projectId, branchId, authCtx]);
  useEffect(() => {
    if (projectId && commitId) {
      setTreeData([]);
      fetch(
        `${lmApiUrl}/third_party/gitlab/container/${projectId}/files?ref=${commitId}&application_id=${appId}`,
        {
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
          },
        },
      )
        .then((response) => response.json())
        .then((data) => {
          setTreeData(data?.items);
        });
    }
  }, [projectId, authCtx, commitId]);

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
    // setCheckedNodes(selectedNodes);
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
      if (selectedNodes[0]?.label) {
        const fileName = selectedNodes[0]?.label;
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
        `${lmApiUrl}/third_party/gitlab/container/${projectId}/files?path=${node?.extended_properties?.path}&ref=${node?.extended_properties?.commit_id}&application_id=${appId}`,
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
    <div className={style.mainDiv}>
      {loading ? (
        <div style={{ marginTop: '50px' }}>
          <UseLoader />
        </div>
      ) : pExist ? (
        <h3 style={{ textAlign: 'center', marginTop: '50px', color: '#1675e0' }}>
          Selected group has no projects.
        </h3>
      ) : (
        <div className={style.mainDiv}>
          <div className={style.select}>
            <h6>Projects</h6>
            <UseSelectPicker
              placeholder="Choose Project"
              onChange={handleProjectChange}
              items={projects}
            />
          </div>
          <div className={style.select}>
            <h6>Branch</h6>
            <UseSelectPicker
              placeholder="Choose Branch"
              onChange={handleBranchChange}
              items={branchList}
            />
          </div>
          <div className={style.select}>
            <h6>Commit</h6>
            <UseSelectPicker
              placeholder="Choose Commit"
              onChange={handleCommitChange}
              items={commitList}
            />
          </div>
          {loading && (
            <div>
              <Placeholder.Paragraph rows={8} />
              <Loader center content="loading" style={{ marginTop: '50px' }} />
            </div>
          )}
          {treeData.length > 0 && (
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
                          {node.children ? <FolderFillIcon /> : <PageIcon />} {node.label}
                        </>
                      );
                    }}
                  />
                </div>
                <div className={style.codemirror}>
                  <div>
                    {multipleSelected.length > 1 ? (
                      <div className={style.error}>
                        File content cannot be displayed when multiple files are selected
                      </div>
                    ) : (
                      selectedFile && (
                        <CodeEditor
                          singleSelected={singleSelected}
                          fileExtension={fileExt}
                          setSelectedCodes={setSelectedCodes}
                          projectId={projectId}
                          commitId={commitId}
                          appId={appId}
                        ></CodeEditor>
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className={style.buttonDiv}>
                <ButtonGroup
                  handleSaveLink={handleSaveLink}
                  selectedCodes={selectedCodes}
                  multipleSelected={multipleSelected}
                  singleSelected={singleSelected}
                ></ButtonGroup>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GitlabSelector;