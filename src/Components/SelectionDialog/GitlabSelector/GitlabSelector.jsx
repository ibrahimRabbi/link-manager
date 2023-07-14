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

const lmApiUrl = process.env.REACT_APP_LM_REST_API_URL;

const GitlabSelector = () => {
  const [group, setGroup] = useState([]);
  const [groupId, setGroupId] = useState('');
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

  const handleGroupChange = (selectedItem) => {
    setGroupId(selectedItem?.id);
    setProjectId('');
    setProjects([]);
    setBranchList([]);
    setBranchId('');
    setCommitList([]);
    setCommitId('');
  };
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
    setGroupId('');
    fetch(`${lmApiUrl}/third_party/gitlab/workspace?application_id=185`, {
      headers: {
        'X-Auth-Gitlab': 'glpat-3najbsK12RyxrdjpHphe',
        Authorization: `Bearer ${authCtx.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setGroup(data?.items);
      });
  }, [authCtx]);
  useEffect(() => {
    if (groupId) {
      setProjectId(''); // Clear the project selection
      setProjects([]);
      setTreeData([]);
      fetch(
        `${lmApiUrl}/third_party/gitlab/containers/${groupId}?page=1&per_page=10&application_id=185`,
        {
          headers: {
            'X-Auth-Gitlab': 'glpat-3najbsK12RyxrdjpHphe',
            Authorization: `Bearer ${authCtx.token}`,
          },
        },
      )
        .then((response) => response.json())
        .then((data) => {
          setProjects(data?.items);
          console.log(data);
        });
    } else {
      setProjectId('');
      setProjects([]);
    }
  }, [groupId, authCtx]);

  useEffect(() => {
    if (projectId) {
      fetch(
        `${lmApiUrl}/third_party/gitlab/container/${projectId}/branch?page=1&per_page=10&application_id=185`,
        {
          headers: {
            'X-Auth-Gitlab': 'glpat-3najbsK12RyxrdjpHphe',
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
        `${lmApiUrl}/third_party/gitlab/container/${projectId}/commit?page=1&per_page=10&application_id=185&branch=${branchId}`,
        {
          headers: {
            'X-Auth-Gitlab': 'glpat-3najbsK12RyxrdjpHphe',
            Authorization: `Bearer ${authCtx.token}`,
          },
        },
      )
        .then((response) => response.json())
        .then((data) => {
          setCommitList(data?.items);
          console.log(data);
        });
    } else {
      setCommitList([]);
    }
  }, [projectId, branchId, authCtx]);
  useEffect(() => {
    if (projectId && branchId && commitId) {
      setTreeData([]);
      setLoading(true);
      fetch(
        `https://gitlab-oslc-api-dev.koneksys.com/rest/v2/provider/${projectId}/tree?commit_id=${commitId}`,
        {
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
          },
        },
      )
        .then((response) => response.json())
        .then((data) => {
          setTreeData(data);
          setLoading(false);
        });
    }
  }, [projectId, branchId, authCtx, commitId]);

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
      selectedNodes[0].isFolder === 'true' ||
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
        `https://gitlab-oslc-api-dev.koneksys.com/rest/v2/provider/${projectId}/tree?path=${node.value}`,
        {
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
          },
        },
      );
      const childrenData = await response.json();
      return childrenData;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={style.mainDiv}>
      <div className={style.select}>
        <h6>Gitlab Group</h6>
        <UseSelectPicker
          placeholder="Choose Gitlab Group"
          onChange={handleGroupChange}
          items={group}
        />
      </div>
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
          <Loader center content="loading" />
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
                      code={singleSelected}
                      fileExtension={fileExt}
                      setSelectedCodes={setSelectedCodes}
                      projectId={projectId}
                      branchId={branchId}
                    ></CodeEditor>
                  )
                )}
              </div>
            </div>
          </div>
          <div className={style.buttonDiv}>
            <ButtonGroup
              selectedCodes={selectedCodes}
              multipleSelected={multipleSelected}
              branchId={branchId}
              projectId={projectId}
              singleSelected={singleSelected}
            ></ButtonGroup>
          </div>
        </div>
      )}
    </div>
  );
};

export default GitlabSelector;
