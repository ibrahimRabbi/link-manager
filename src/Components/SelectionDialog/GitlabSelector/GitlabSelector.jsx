/* eslint-disable max-len */
import React, { useContext, useEffect, useState } from 'react';
import { CheckTree, SelectPicker, Loader, Placeholder } from 'rsuite';
import style from './GitlabSelector.module.css';
import FolderFillIcon from '@rsuite/icons/FolderFill';
import PageIcon from '@rsuite/icons/Page';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import CodeEditor from './CodeEditor';
import ButtonGroup from './ButtonGroup';
import SelectionAuthContext from '../../../Store/SelectionAuthContext';

const FixedLoader = () => (
  <h5
    style={{
      display: 'flex',
      justifyContent: 'center',
      position: 'absolute',
      bottom: '0',
      background: '#fff',
      width: '100%',
      padding: '4px 0',
    }}
  >
    <SpinnerIcon spin style={{ fontSize: '35px' }} />
  </h5>
);
const GitlabSelector = () => {
  const [projects, setProjects] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [selectedCodes, setSelectedCodes] = useState('');
  const [fileExt, setFileExt] = useState('');
  const [multipleSelected, setMultipleSelected] = useState([]);
  const [singleSelected, setSingleSelected] = useState('');
  const [checkedValues, setCheckedValues] = React.useState([]);
  //   const [/*checkedNodes,*/ setCheckedNodes] = React.useState([]);
  const [branchList, setBranchList] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [commitId, setCommitId] = useState('');
  const [commitList, setCommitList] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const authCtx = useContext(SelectionAuthContext);
  const [loading, setLoading] = useState(false);
  React.useEffect(() => {
    fetch('https://gitlab-oslc-api-dev.koneksys.com/rest/v2/projects', {
      headers: {
        Authorization: `Bearer ${authCtx.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
      });
  }, [authCtx]);
  const projectList = projects?.map((item) => ({
    label: item?.name,
    value: item?.name,
    data: item,
  }));
  const branch = branchList?.map((item) => ({
    label: item?.name,
    value: item?.id,
    data: item,
  }));
  const commit = commitList?.map((item) => ({
    label: item?.title,
    value: item?.short_id,
    data: item,
  }));
  const handleSelect = (value) => {
    const selectedItem = projects?.find((v) => v?.name === value);
    setProjectId(selectedItem?.id);
    setTreeData([]);
    setBranchId('');
    setCommitId('');
  };
  React.useEffect(() => {
    if (projectId) {
      setTreeData([]);
      fetch(
        `https://gitlab-oslc-api-dev.koneksys.com/rest/v2/provider/${projectId}/branch`,
        {
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
          },
        },
      )
        .then((response) => response.json())
        .then((data) => {
          setBranchList(data);
        });
    } else {
      setBranchList([]); // Reset branchList if projectId is not available
    }
  }, [projectId, authCtx]);

  React.useEffect(() => {
    if (projectId && branchId) {
      fetch(
        `https://gitlab-oslc-api-dev.koneksys.com/rest/v2/provider/${projectId}/branch/${branchId}/commit`,
        {
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
          },
        },
      )
        .then((response) => response.json())
        .then((data) => {
          setCommitList(data);
        });
    } else {
      setCommitList([]);
    }
  }, [projectId, authCtx, branchId]);
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
  const handleBranch = (value) => {
    setCommitId('');
    setTreeData([]);
    const selectedItem = branchList?.find((v) => v?.id === value);
    setBranchId(selectedItem?.name);
  };
  const handleCommit = (value) => {
    const selectedItem = commitList?.find((v) => v?.short_id === value);
    setCommitId(selectedItem?.id);
    setTreeData([]);
  };
  const renderMenuP = (menu) => {
    if (projects.length === 0) {
      return <FixedLoader />;
    }
    return menu;
  };
  const renderMenuB = (menu) => {
    if (branchList.length === 0) {
      return <FixedLoader />;
    }
    return menu;
  };
  const renderMenuC = (menu) => {
    if (commitList.length === 0) {
      return <FixedLoader />;
    }
    return menu;
  };

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
        <h6>Gitlab Project</h6>
        <SelectPicker
          data={projectList}
          onChange={(v) => handleSelect(v)}
          block
          renderMenu={renderMenuP}
        />
      </div>
      <div className={style.select}>
        <h6>Branch</h6>
        <SelectPicker
          data={branch}
          onChange={(v) => handleBranch(v)}
          block
          renderMenu={renderMenuB}
        />
      </div>
      <div className={style.select}>
        <h6>Commit</h6>
        <SelectPicker
          data={commit}
          block
          onChange={(v) => handleCommit(v)}
          renderMenu={renderMenuC}
        />
      </div>
      {loading && (
        <div>
          <Placeholder.Paragraph rows={8} />
          <Loader backdrop content="loading..." vertical />
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
