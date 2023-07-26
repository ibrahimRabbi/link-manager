/* eslint-disable max-len */
import React, { useContext, useEffect, useState } from 'react';
import { Loader, Placeholder } from 'rsuite';
import style from './ListView.module.css';
import UseSelectPicker from '../../Shared/UseDropdown/UseSelectPicker';
import AuthContext from '../../../Store/Auth-Context';
import UseLoader from '../../Shared/UseLoader';
import ExternalAppModal from '../../AdminDasComponents/ExternalAppIntegrations/ExternalAppModal/ExternalAppModal.jsx';
import {
  BASIC_AUTH_APPLICATION_TYPES,
  MICROSERVICES_APPLICATION_TYPES,
  OAUTH2_APPLICATION_TYPES,
} from '../../../App.jsx';

const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;

const ListView = ({ handleSaveLink, appData }) => {
  const [pExist, setPExist] = useState(false);
  const [projects, setProjects] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);

  const [projectId, setProjectId] = useState('');
  const [resourceTypeId, setResourceTypeId] = useState('');

  // const [selectedFile, setSelectedFile] = useState('');
  // const [selectedCodes, setSelectedCodes] = useState('');
  // const [fileExt, setFileExt] = useState('');
  // const [multipleSelected, setMultipleSelected] = useState([]);
  // const [singleSelected, setSingleSelected] = useState('');
  // const [checkedValues, setCheckedValues] = React.useState([]);
  // const [branchList, setBranchList] = useState([]);
  // const [commitId, setCommitId] = useState('');
  // const [commitList, setCommitList] = useState([]);

  const [treeData, setTreeData] = useState([]);
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [authenticatedThirdApp, setAuthenticatedThirdApp] = useState(false);
  const broadcastChannel = new BroadcastChannel('oauth2-app-status');

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
    setProjectId(selectedItem?.id);
    setResourceTypes([]);
    setResourceTypeId('');
  };
  const handleResourceTypeChange = (selectedItem) => {
    setResourceTypeId(selectedItem?.name);
  };

  useEffect(() => {
    setProjectId(''); // Clear the project selection
    setProjects([]);
    setTreeData([]);
    setLoading(true);
    fetch(
      `${lmApiUrl}/third_party/${appData?.type}/containers?page=1&per_page=10&application_id=${appData?.application_id}`,
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
  }, [authCtx, authenticatedThirdApp]);

  useEffect(() => {
    if (projectId) {
      fetch(`${lmApiUrl}/third_party/${appData?.type}/resource_types`)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
        })
        .then((data) => {
          if (data?.length > 0) {
            setResourceTypes(data);
          } else {
            setLoading(false);
          }
        });
    }
  }, [authCtx, projectId]);

  useEffect(() => {
    if (projectId && resourceTypeId) {
      fetch(
        `${lmApiUrl}/third_party/gitlab/container/tenant/${resourceTypeId}?page=1&per_page=10&application_id=${appData?.application_id}`,
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
          console.log(data);
          // setBranchList(data?.items);
        });
    } else {
      // setBranchList([]);
    }
  }, [projectId, resourceTypeId, authCtx]);

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
        <div className={style.mainDiv}>
          <div className={style.select}>
            <h6>Projects</h6>
            <UseSelectPicker
              placeholder="Choose Project"
              onChange={handleProjectChange}
              disabled={authenticatedThirdApp}
              items={projects}
            />
          </div>
          <div className={style.select}>
            <h6>Branch</h6>
            <UseSelectPicker
              placeholder="Choose a resource type"
              onChange={handleResourceTypeChange}
              disabled={authenticatedThirdApp}
              items={resourceTypes}
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
                  {/*<CheckTree*/}
                  {/*  data={treeData}*/}
                  {/*  style={{ width: 280 }}*/}
                  {/*  value={checkedValues}*/}
                  {/*  onChange={(value) => handleTreeChange(value)}*/}
                  {/*  getChildren={getChildren}*/}
                  {/*  renderTreeNode={(node) => {*/}
                  {/*    return (*/}
                  {/*      <>*/}
                  {/*        {node.children ? <FolderFillIcon /> : <PageIcon />} {node.label}*/}
                  {/*      </>*/}
                  {/*    );*/}
                  {/*  }}*/}
                  {/*/>*/}
                </div>
              </div>
              <div className={style.buttonDiv}>
                {/*<ButtonGroup*/}
                {/*  handleSaveLink={handleSaveLink}*/}
                {/*  // selectedCodes={selectedCodes}*/}
                {/*  // multipleSelected={multipleSelected}*/}
                {/*  // singleSelected={singleSelected}*/}
                {/*></ButtonGroup>*/}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ListView;
