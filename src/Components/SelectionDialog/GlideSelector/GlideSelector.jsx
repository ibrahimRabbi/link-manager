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
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { columnDefWithCheckBox } from './Columns';
import { Button, ButtonToolbar, Input, Pagination } from 'rsuite';
import { useSelector } from 'react-redux';

const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;

const GlideSelector = ({ appData }) => {
  const { isDark } = useSelector((state) => state.nav);
  const [pExist, setPExist] = useState(false);
  const [projects, setProjects] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [projectId, setProjectId] = useState('');
  const [resourceTypeId, setResourceTypeId] = useState('');
  const [currPage, setCurrPage] = useState(1);
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [rowSelection, setRowSelection] = React.useState({});
  const [filtering, setFiltering] = useState('');

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
    if (projectId && resourceTypeId && currPage && limit) {
      setTableLoading(true);
      fetch(
        `${lmApiUrl}/third_party/${appData?.type}/container/tenant/${resourceTypeId}?page=${currPage}&per_page=${limit}&application_id=${appData?.application_id}`,
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
          setTableData(data);
        });
    } else {
      setTableData([]);
    }
  }, [projectId, resourceTypeId, authCtx, currPage, limit]);

  const finalData = React.useMemo(() => tableData?.items);
  const finalColumnDef = React.useMemo(() => columnDefWithCheckBox);
  const tableInstance = useReactTable({
    columns: finalColumnDef,
    data: finalData,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      rowSelection: rowSelection,
      globalFilter: filtering,
    },
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setFiltering,
    enableRowSelection: true,
  });
  useEffect(() => {
    setCurrPage(page);
  }, [page]);
  const handleChangeLimit = (dataKey) => {
    setCurrPage(1);
    setLimit(dataKey);
  };
  const handleSelect = () => {
    let selectd = tableInstance.getSelectedRowModel().flatRows.map((el) => el.original);
    let items = selectd
      .map((row) => {
        return JSON.stringify(row);
      })
      .filter((item) => item !== null);
    let response = `[${items.join(',')}]`;
    setRowSelection({});
    console.log(response);
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
              <div className="w3-container" style={{ marginTop: '20px', padding: '0' }}>
                <Input
                  className="w3-input w3-border"
                  style={{ marginBottom: '5px', width: '300px' }}
                  type="text"
                  placeholder="search data"
                  value={filtering}
                  onChange={(e) => setFiltering(e.target.value)}
                />
                <table
                  className="w3-table w3-bordered w3-border w3-centered"
                  style={{ height: '20px' }}
                >
                  <thead>
                    {tableInstance.getHeaderGroups().map((headerEl) => {
                      return (
                        <tr key={headerEl.id} style={{ fontSize: '20px' }}>
                          {headerEl.headers.map((columnEl) => {
                            return (
                              <th key={columnEl.id}>
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
                        <tr
                          key={rowEl.id}
                          className={
                            isDark === 'dark'
                              ? style.table_row_dark
                              : style.table_row_light
                          }
                        >
                          {rowEl.getVisibleCells().map((cellEl) => {
                            return (
                              <td
                                key={cellEl.id}
                                style={{ width: '50px', fontSize: '17px' }}
                              >
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
                <div style={{ padding: 20 }}>
                  <Pagination
                    prev
                    next
                    first
                    last
                    ellipsis
                    boundaryLinks
                    maxButtons={2}
                    size="lg"
                    layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                    total={tableData?.total_items}
                    limitOptions={[5, 10, 25, 50]}
                    limit={limit}
                    activePage={page}
                    onChangePage={setPage}
                    onChangeLimit={(v) => handleChangeLimit(v)}
                  />
                </div>
                <div className={style.buttonDiv}>
                  <ButtonToolbar>
                    <Button appearance="ghost">Cancel</Button>
                    <Button
                      appearance="primary"
                      size="md"
                      style={{ width: '65px' }}
                      onClick={handleSelect}
                    >
                      OK
                    </Button>
                  </ButtonToolbar>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default GlideSelector;
