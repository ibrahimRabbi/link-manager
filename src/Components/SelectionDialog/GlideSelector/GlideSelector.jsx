/* eslint-disable indent */
/* eslint-disable max-len */
import React, { useContext, useEffect, useState } from 'react';
import style from './GlideSelector.module.scss';
import UseSelectPicker from '../../Shared/UseDropdown/UseSelectPicker';
import AuthContext from '../../../Store/Auth-Context';
import UseLoader from '../../Shared/UseLoader';
import ExternalAppModal from '../../AdminDasComponents/ExternalAppIntegrations/ExternalAppModal/ExternalAppModal.jsx';
import {
  BASIC_AUTH_APPLICATION_TYPES,
  MICROSERVICES_APPLICATION_TYPES,
  OAUTH2_APPLICATION_TYPES,
} from '../../../App.jsx';
import { useReactTable, flexRender, getCoreRowModel } from '@tanstack/react-table';
import { columnDefWithCheckBox } from './Columns';

const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;

const GlideSelector = ({ appData }) => {
  const [pExist, setPExist] = useState(false);
  const [projects, setProjects] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [projectId, setProjectId] = useState('');
  const [resourceTypeId, setResourceTypeId] = useState('');

  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableshow, setTableShow] = useState(false);
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
    setResourceTypes([]);
    setResourceTypeId('');
    setProjectId(''); // Clear the project selection
    setProjects([]);
    setLoading(true);
    setTableData([]);
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
      setTableData([]);
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
      setTableLoading(true);
      fetch(
        `${lmApiUrl}/third_party/${appData?.type}/container/tenant/${resourceTypeId}?page=1&per_page=10&application_id=${appData?.application_id}`,
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
          setTableLoading(false);
          setTableShow(true);
          console.log(data);
          setTableData(data.items);
        });
    } else {
      setTableData([]);
    }
  }, [projectId, resourceTypeId, authCtx]);
  const finalData = React.useMemo(() => tableData);
  const finalColumnDef = React.useMemo(() => columnDefWithCheckBox);

  const [rowSelection, setRowSelection] = React.useState({});

  const tableInstance = useReactTable({
    columns: finalColumnDef,
    data: finalData,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection: rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
  });

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
            <h6>Resource Type</h6>
            <UseSelectPicker
              placeholder="Choose a resource type"
              onChange={handleResourceTypeChange}
              disabled={authenticatedThirdApp}
              items={resourceTypes}
            />
          </div>
          {tableLoading ? (
            <div style={{ marginTop: '50px' }}>
              <UseLoader />
            </div>
          ) : (
            tableshow && (
              <div className="w3-container">
                <table className="w3-table-all w3-centered">
                  <thead>
                    {tableInstance.getHeaderGroups().map((headerEl) => {
                      return (
                        <tr key={headerEl.id}>
                          {headerEl.headers.map((columnEl) => {
                            return (
                              <th key={columnEl.id} colSpan={columnEl.colSpan}>
                                {columnEl.isPlaceholder
                                  ? null
                                  : flexRender(
                                      columnEl.column.columnDef.header,
                                      columnEl.getContext(),
                                    )}
                              </th>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </thead>
                  <tbody>
                    {tableInstance.getRowModel().rows.map((rowEl) => {
                      return (
                        <tr key={rowEl.id}>
                          {rowEl.getVisibleCells().map((cellEl) => {
                            return (
                              <td key={cellEl.id} style={{ width: '100px' }}>
                                {flexRender(
                                  cellEl.column.columnDef.cell,
                                  cellEl.getContext(),
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          )}
          <hr />
          <div>
            <ul>
              {tableInstance.getSelectedRowModel().flatRows.map((el) => {
                return <li key={el.id}>{JSON.stringify(el.original)}</li>;
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlideSelector;
