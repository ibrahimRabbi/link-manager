/* eslint-disable indent */
/* eslint-disable max-len */
import React, { useContext, useEffect, useState } from 'react';
import style from './GlobalSelector.module.scss';
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
import { columnDefWithCheckBox as glideColumns } from './GlideColumns';
import { columnDefWithCheckBox as jiraColumns } from './JiraColumns';
import { columnDefWithCheckBox as valispaceColumns } from './ValispaceColumns.jsx';
import { columnDefWithCheckBox as codebeamerColumns } from './CodebeamerColumns';
import { Button, ButtonToolbar, FlexboxGrid, Message, Pagination, toaster } from 'rsuite';
import { useSelector } from 'react-redux';
import Filter from './FilterFunction';
import UseReactSelect from '../../Shared/Dropdowns/UseReactSelect';
import { isEqual } from 'rsuite/cjs/utils/dateUtils.js';

const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;
const nativeAppUrl = `${lmApiUrl}/third_party/`;
const GlobalSelector = ({
  appData,
  defaultProject,
  cancelLinkHandler,
  handleSaveLink,
  workspace,
}) => {
  const { isDark } = useSelector((state) => state.nav);
  const [pExist, setPExist] = useState(false);
  const [projects, setProjects] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [projectId, setProjectId] = useState(
    defaultProject?.id ? defaultProject?.id : '',
  );
  const [projectName, setProjectName] = useState('');
  const [resourceTypeId, setResourceTypeId] = useState('');
  const [currPage, setCurrPage] = useState(1);
  const [limit, setLimit] = React.useState(50);
  const [page, setPage] = React.useState(1);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [previousColumnFilters, setPreviousColumnFilters] = React.useState([]);
  const [resourceLoading, setResourceLoading] = useState(false);
  const [filterIn, setFilterIn] = useState('');

  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [tableshow, setTableShow] = useState(false);
  const [authenticatedThirdApp, setAuthenticatedThirdApp] = useState(false);
  const broadcastChannel = new BroadcastChannel('oauth2-app-status');

  const showNotification = (type, message) => {
    if (type && message) {
      const messages = (
        <Message closable showIcon type={type}>
          {message}
        </Message>
      );
      toaster.push(messages, { placement: 'bottomCenter', duration: 5000 });
    }
  };
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
    setProjectName(selectedItem?.name);
    setResourceTypes([]);
    setResourceTypeId('');
  };
  const handleResourceTypeChange = (selectedItem) => {
    if (appData.application_type === 'codebeamer') {
      setResourceTypeId(selectedItem?.id);
    } else {
      setResourceTypeId(selectedItem?.name);
    }
  };

  const getProjectUrl = () => {
    let url = '';
    if (appData) {
      url = nativeAppUrl;
      if (workspace) {
        url += `${appData?.application?.type || appData?.application_type}/containers/${
          appData?.workspace_id
        }`;
      } else {
        url += `${appData?.application?.type || appData?.application_type}/containers`;
      }
      url = getQueryArgs(url);
    }
    return url;
  };

  const getResourceTypeUrl = () => {
    let url;
    if (appData?.application_type === 'codebeamer') {
      url = `${nativeAppUrl}${
        appData?.application?.type || appData?.application_type
      }/resource_types/${projectId}?application_id=${appData?.application_id}`;
    } else {
      url = `${nativeAppUrl}${
        appData?.application?.type || appData?.application_type
      }/resource_types`;
    }
    return url;
  };

  const getResourceListUrl = (filters = null) => {
    let url = '';
    if (appData && projectId && resourceTypeId) {
      url = nativeAppUrl;
      if (workspace) {
        url += `${
          appData?.application?.type || appData?.application_type
        }/container/${projectId}/${resourceTypeId}`;
      } else {
        url += `${appData?.application?.type || appData?.application_type}/container/${
          appData?.application_type === 'glideyoke'
            ? 'tenant'
            : appData?.application_type === 'codebeamer'
            ? 'tracker'
            : appData?.id
        }/${resourceTypeId}`;
      }
      url = getQueryArgs(url);
      if (filters) {
        url += getFilterQuery(filters);
      }
    }
    return url;
  };

  const getFilterQuery = (columnFilters) => {
    let queryPath = '';
    for (let i = 0; i < columnFilters.length; i++) {
      if (columnFilters[i].value) {
        queryPath += `&${columnFilters[i].id.toLowerCase()}=${columnFilters[i].value}`;
      }
    }
    return queryPath;
  };

  const executeRequestQuery = (url) => {
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${authCtx.token}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        switch (response.status) {
          case 400:
            setAuthenticatedThirdApp(true);
            return response.json().then((data) => {
              showNotification('error', data?.message?.message);
              return { items: [] };
            });
          case 401:
            setAuthenticatedThirdApp(true);
            return response.json().then((data) => {
              showNotification('error', data?.message);
              return { items: [] };
            });
          case 403:
            if (authCtx.token) {
              showNotification('error', 'You do not have permission to access');
            } else {
              setAuthenticatedThirdApp(true);
              return { items: [] };
            }
            break;
          default:
            return response.json().then((data) => {
              showNotification('error', data?.message);
            });
        }
      }
    });
  };

  const getQueryArgs = (url) => {
    url += `?page=${page}&per_page=${limit}&application_id=${appData?.application_id}`;
    return url;
  };

  useEffect(() => {
    setResourceTypes([]);
    setResourceTypeId('');
    if (defaultProject) {
      setProjectId(defaultProject?.id);
      setProjectName(defaultProject?.name);
    } else {
      setProjectId('');
      setProjectName('');
    }
    setProjects([]);
    setLoading(true);
    setTableData([]);
    const url = getProjectUrl();
    if (url !== '') {
      executeRequestQuery(url).then((data) => {
        if (data?.total_items === 0) {
          setLoading(false);
          setPExist(true);
        } else {
          setLoading(false);
          setPExist(false);
          setProjects(data?.items ? data?.items : []);
        }
      });
    }
  }, [authCtx, authenticatedThirdApp, appData]);

  useEffect(() => {
    if (projectId) {
      setResourceLoading(true);
      setTableData([]);
      const url = getResourceTypeUrl();
      executeRequestQuery(url).then((data) => {
        if (data?.length > 0) {
          setResourceLoading(false);
          setResourceTypes(data);
        } else if (appData.application_type === 'codebeamer') {
          if (data?.items.length > 0) {
            setResourceLoading(false);
            setResourceTypes(data?.items);
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      });
      setColumnFilters([]);
      setPreviousColumnFilters([]);
      setFilterIn('');
    }
  }, [authCtx, projectId]);

  useEffect(() => {
    if (filterIn === '') {
      if (projectId && resourceTypeId && currPage && limit) {
        const url = getResourceListUrl();
        if (url) {
          executeRequestQuery(url).then((data) => {
            setTableShow(true);
            setTableData(data);
          });
        }
      } else {
        setTableData([]);
      }
    }
    // }
  }, [projectId, resourceTypeId, authCtx, currPage, limit, filterIn]);

  useEffect(() => {
    if (
      columnFilters.length > 0 &&
      tableshow &&
      !isEqual(columnFilters, previousColumnFilters)
    ) {
      const url = getResourceListUrl(columnFilters);
      if (url) {
        executeRequestQuery(url).then((data) => {
          if (data.items.length > 0) {
            setTableData(data);
          } else {
            setFilterIn('');
          }
          setPreviousColumnFilters(columnFilters);
        });
      }
    }
  }, [columnFilters]);

  useEffect(() => {
    if (resourceTypes.length === 1) {
      if (appData.application_type === 'codebeamer') {
        setResourceTypeId(resourceTypes[0]?.id);
      } else {
        setResourceTypeId(resourceTypes[0]?.name);
      }
    }
  }, [resourceTypes]);

  const finalData = React.useMemo(() => tableData?.items);
  const finalColumnDef = React.useMemo(() => {
    if (appData?.application_type === 'jira') {
      return jiraColumns;
    } else if (appData?.application_type === 'valispace') {
      return valispaceColumns;
    } else if (appData?.application_type === 'codebeamer') {
      return codebeamerColumns;
    } else {
      return glideColumns;
    }
  });
  const tableInstance = useReactTable({
    columns: finalColumnDef,
    data: finalData,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      rowSelection: rowSelection,
      columnFilters: columnFilters,
    },
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
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
        let newRow = row;
        if (!newRow?.provider_name) {
          newRow = { ...newRow, provider_name: projectName };
        }
        if (!newRow?.label) {
          newRow = { ...newRow, label: newRow?.label };
        }
        return JSON.stringify(newRow);
      })
      .filter((item) => item !== null);
    let response = `[${items.join(',')}]`;
    handleSaveLink(response);
    setRowSelection({});
  };
  const handleCancel = () => {
    cancelLinkHandler();
  };
  return (
    <div
      className={
        tableshow && projectId && resourceTypeId && finalData?.length > 0
          ? style.mainContainerTwo
          : style.mainContainerOne
      }
    >
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
          isOauth2={OAUTH2_APPLICATION_TYPES?.includes(appData?.application?.type)}
          isBasic={(
            BASIC_AUTH_APPLICATION_TYPES + MICROSERVICES_APPLICATION_TYPES
          ).includes(appData?.application?.type)}
          onDataStatus={getExtLoginData}
          integrated={false}
        />
      ) : (
        <div>
          {!defaultProject && (
            <FlexboxGrid style={{ margin: '15px 0' }} align="middle">
              <FlexboxGrid.Item colspan={3}>
                <h3>Projects: </h3>
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={21}>
                <UseReactSelect
                  name="glide_native_projects"
                  placeholder="Choose Project"
                  onChange={handleProjectChange}
                  disabled={authenticatedThirdApp}
                  items={projects?.length ? projects : []}
                />
              </FlexboxGrid.Item>
            </FlexboxGrid>
          )}
          {projectId && resourceTypes.length > 1 && (
            <FlexboxGrid style={{ margin: '15px 0' }} align="middle">
              <FlexboxGrid.Item colspan={3}>
                <h3>Resource: </h3>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={21}>
                <UseReactSelect
                  name="glide_native_resource_type"
                  placeholder="Choose resource type"
                  onChange={handleResourceTypeChange}
                  disabled={authenticatedThirdApp}
                  isLoading={resourceLoading}
                  items={resourceTypes?.length ? resourceTypes : []}
                />
              </FlexboxGrid.Item>
            </FlexboxGrid>
          )}
          {tableData?.items?.length < 1 ? (
            <h3 style={{ textAlign: 'center', marginTop: '50px', color: '#1675e0' }}>
              Selected resource type has no data.
            </h3>
          ) : tableshow && projectId && resourceTypeId && finalData?.length > 0 ? (
            <div className={style.mainTableContainer}>
              <div className={style.tableContainer}>
                <table className={style.styled_table}>
                  <thead>
                    {tableInstance.getHeaderGroups().map((headerEl) => {
                      return (
                        <tr key={headerEl.id} style={{ fontSize: '20px' }}>
                          {headerEl.headers.map((columnEl) => {
                            return (
                              <th
                                key={columnEl.id}
                                style={
                                  columnEl.column.id.includes('select')
                                    ? { width: '5%' }
                                    : null
                                }
                              >
                                {columnEl.isPlaceholder
                                  ? null
                                  : flexRender(
                                      columnEl.column.columnDef.header,
                                      columnEl.getContext(),
                                    )}
                                {columnEl.column.getCanFilter() ? (
                                  <div>
                                    <Filter
                                      column={columnEl.column}
                                      table={tableInstance}
                                      setFilterIn={setFilterIn}
                                    />
                                  </div>
                                ) : null}
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
                                style={
                                  cellEl.column.id.includes('select')
                                    ? { width: '5px' }
                                    : { width: '30px', fontSize: '17px' }
                                }
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
                {!tableInstance.getRowModel().rows[0] && (
                  <p className={style.emptyTableContent}>There is no resource found</p>
                )}
              </div>
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
            </div>
          ) : (
            ''
          )}
        </div>
      )}
      {!loading && (
        <div
          className={
            tableshow && projectId && resourceTypeId && finalData?.length > 0
              ? style.targetBtnContainerTwo
              : style.targetBtnContainerOne
          }
        >
          <ButtonToolbar>
            <Button appearance="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              appearance="primary"
              size="md"
              disabled={Object.keys(rowSelection).length > 0 ? false : true}
              onClick={handleSelect}
            >
              OK
            </Button>
          </ButtonToolbar>
        </div>
      )}
    </div>
  );
};

export default GlobalSelector;
