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
import {
  Button,
  ButtonToolbar,
  FlexboxGrid,
  Loader,
  Message,
  Pagination,
  toaster,
} from 'rsuite';
import { useSelector } from 'react-redux';
import Filter from './FilterFunction';
import UseReactSelect from '../../Shared/Dropdowns/UseReactSelect';

const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;

const GlobalSelector = ({
  appData,
  defaultProject,
  cancelLinkHandler,
  handleSaveLink,
}) => {
  const { isDark } = useSelector((state) => state.nav);
  const [pExist, setPExist] = useState(false);
  const [projects, setProjects] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [projectId, setProjectId] = useState(
    defaultProject?.id ? defaultProject?.id : '',
  );
  const [resourceTypeId, setResourceTypeId] = useState('');
  const [currPage, setCurrPage] = useState(1);
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [resourceLoading, setResourceLoading] = useState(false);
  const [filterLoad, setFilterLoad] = useState(false);
  const [filterIn, setFilterIn] = useState('');

  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
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
    setResourceTypes([]);
    setResourceTypeId('');
  };
  const handleResourceTypeChange = (selectedItem) => {
    setResourceTypeId(selectedItem?.name);
  };

  useEffect(() => {
    setResourceTypes([]);
    setResourceTypeId('');
    if (defaultProject) {
      setProjectId(defaultProject?.id);
    } else {
      setProjectId(''); // Clear the project selection
    }
    setProjects([]);
    setLoading(true);
    setTableData([]);
    fetch(
      `${lmApiUrl}/third_party/${
        appData?.application?.type || appData?.application_type
      }/containers?page=1&per_page=10&application_id=${appData?.application_id}`,
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
          if (response.status === 400) {
            setAuthenticatedThirdApp(true);
            return response.json().then((data) => {
              showNotification('error', data?.message?.message);
              return { items: [] };
            });
          } else if (response.status === 401) {
            setAuthenticatedThirdApp(true);
            return response.json().then((data) => {
              showNotification('error', data?.message);
              return { items: [] };
            });
          } else if (response.status === 403) {
            if (authCtx.token) {
              showNotification('error', 'You do not have permission to access');
            } else {
              setAuthenticatedThirdApp(true);
              return { items: [] };
            }
          } else {
            return response.json().then((data) => {
              showNotification('error', data.message);
            });
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
  }, [authCtx, defaultProject, authenticatedThirdApp]);

  useEffect(() => {
    if (projectId) {
      setResourceLoading(true);
      setTableData([]);
      fetch(
        `${lmApiUrl}/third_party/${
          appData?.application?.type || appData?.application_type
        }/resource_types`,
      )
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            return response.json().then((data) => {
              showNotification('error', data.message);
            });
          }
        })
        .then((data) => {
          if (data?.length > 0) {
            setResourceLoading(false);
            setResourceTypes(data);
          } else {
            setLoading(false);
          }
        });
    }
  }, [authCtx, projectId]);

  useEffect(() => {
    if (filterIn === '') {
      if (projectId && resourceTypeId && currPage && limit) {
        setTableLoading(true);
        fetch(
          `${lmApiUrl}/third_party/${
            appData?.application?.type || appData?.application_type
          }/container/${
            appData?.application_type !== 'glideyoke' ? appData?.id : 'tenant'
          }/${resourceTypeId}?page=${currPage}&per_page=${limit}&application_id=${
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
              if (response.status === 400) {
                setAuthenticatedThirdApp(true);
                return response.json().then((data) => {
                  showNotification('error', data?.message?.message);
                  return { items: [] };
                });
              } else if (response.status === 401) {
                setAuthenticatedThirdApp(true);
                return response.json().then((data) => {
                  showNotification('error', data?.message);
                  return { items: [] };
                });
              } else if (response.status === 403) {
                if (authCtx.token) {
                  showNotification('error', 'You do not have permission to access');
                } else {
                  setAuthenticatedThirdApp(true);
                  return { items: [] };
                }
              } else {
                return response.json().then((data) => {
                  showNotification('error', data.message);
                });
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
    }
    // }
  }, [projectId, resourceTypeId, authCtx, currPage, limit, filterIn]);
  useEffect(() => {
    if (columnFilters[0]?.id && columnFilters[0]?.value) {
      setFilterLoad(true);
      fetch(
        `${lmApiUrl}/third_party/${
          appData?.application?.type || appData?.application_type
        }/container/${
          appData?.application_type !== 'glideyoke' ? appData?.id : 'tenant'
        }/${resourceTypeId}?page=1&per_page=10&application_id=${
          appData?.application_id
        }&${
          appData?.application_type !== 'glideyoke'
            ? columnFilters[0]?.id.toLowerCase() === 'name'
              ? 'key'
              : columnFilters[0]?.id.toLowerCase()
            : columnFilters[0]?.id.toLowerCase()
        }=${columnFilters[0]?.value}`,
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
            if (response.status === 400) {
              setAuthenticatedThirdApp(true);
              return response.json().then((data) => {
                showNotification('error', data?.message?.message);
                return { items: [] };
              });
            } else if (response.status === 401) {
              setAuthenticatedThirdApp(true);
              return response.json().then((data) => {
                showNotification('error', data?.message);
                return { items: [] };
              });
            } else if (response.status === 403) {
              if (authCtx.token) {
                showNotification('error', 'You do not have permission to access');
              } else {
                setAuthenticatedThirdApp(true);
                return { items: [] };
              }
            } else {
              return response.json().then((data) => {
                showNotification('error', data.message);
              });
            }
          }
        })
        .then((data) => {
          if (data.items.length > 0) {
            setFilterLoad(false);
            setTableData(data);
            setColumnFilters([]);
          } else {
            setFilterLoad(false);
            setColumnFilters([]);
            console.log(resourceTypeId);
            setFilterIn('');
          }
        });
    }
  }, [columnFilters[0]]);
  const finalData = React.useMemo(() => tableData?.items);
  const finalColumnDef = React.useMemo(() => {
    if (appData?.application_type === 'jira') {
      return jiraColumns;
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
        return JSON.stringify(row);
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
          isOauth2={OAUTH2_APPLICATION_TYPES?.includes(appData?.application?.type)}
          isBasic={(
            BASIC_AUTH_APPLICATION_TYPES + MICROSERVICES_APPLICATION_TYPES
          ).includes(appData?.application?.type)}
          onDataStatus={getExtLoginData}
          integrated={false}
        />
      ) : (
        <div className={style.mainContainer}>
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
          {projectId && (
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
          {filterLoad && (
            <Loader backdrop center size="md" vertical style={{ zIndex: '10' }} />
          )}
          {tableLoading ? (
            <div style={{ marginTop: '50px' }}>
              <UseLoader />
            </div>
          ) : tableData?.items?.length < 1 ? (
            <h3 style={{ textAlign: 'center', marginTop: '50px', color: '#1675e0' }}>
              Selected resource type has no data.
            </h3>
          ) : tableshow && projectId && resourceTypeId && finalData?.length > 0 ? (
            <div>
              <div
                style={{
                  marginTop: '20px',
                  padding: '0',
                  overflowY: 'auto',
                  height: '70vh',
                }}
              >
                <table className={`${style.styled_table}`}>
                  <thead style={{ borderBottom: '0.5px solid rgb(238, 238, 238)' }}>
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
        <div className={style.buttonDiv}>
          <ButtonToolbar>
            <Button appearance="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              appearance="primary"
              size="md"
              disabled={Object.keys(rowSelection).length > 0 ? false : true}
              style={{ width: '65px' }}
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
