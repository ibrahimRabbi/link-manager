/* eslint-disable max-len */
/* eslint-disable indent */
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Message, toaster } from 'rsuite';
import AuthContext from '../../../Store/Auth-Context';
import { handleCurrPageTitle } from '../../../Redux/slices/navSlice';
import fetchAPIRequest from '../../../apiRequests/apiRequest';
import { useMutation, useQuery } from '@tanstack/react-query';
import AdminDataTable from '../AdminDataTable';
import { useNavigate } from 'react-router-dom';
import AlertModal from '../../Shared/AlertModal';
import UseLoader from '../../Shared/UseLoader';
import ExternalAppModal from '../ExternalAppIntegrations/ExternalAppModal/ExternalAppModal';
import {
  BASIC_AUTH_APPLICATION_TYPES,
  MICROSERVICES_APPLICATION_TYPES,
  OAUTH2_APPLICATION_TYPES,
} from '../../../App';

const apiURL = import.meta.env.VITE_LM_REST_API_URL;
const headerData = [
  {
    header: 'Source Project',
    key: 'source_project',
    source_icon: 'source_application_type',
  },
  {
    header: 'Source Resource',
    key: 'source_resource',
  },
  {
    header: 'Direction',
    directKey: 'bidirectional',
    width: 100,
  },
  {
    header: 'Target Project',
    key: 'target_project',
    target_icon: 'target_application_type',
  },
  {
    header: 'Target Resource',
    key: 'target_resource',
  },
  { header: 'Last Synced', syncTime: 'last_synced' },
  { header: 'Status', syncStatus: 'migration_status', width: 80 },
];
const Synchronization = () => {
  const { isCreated, isDeleted, isUpdated, isCrudLoading } = useSelector(
    (state) => state.crud,
  );

  const { refreshData } = useSelector((state) => state.nav);

  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({});
  const [syncData, setSyncData] = useState({});
  const [sourceApplication, setSourceApplication] = useState('');
  const [targetApplication, setTargetApplication] = useState('');
  const [restartExternalRequest, setRestartExternalRequest] = useState(false);
  const [authenticatedThirdApp, setAuthenticatedThirdApp] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncAgain, setSyncAgain] = useState(false);

  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const organization = authCtx?.organization_name
    ? `/${authCtx?.organization_name?.toLowerCase()}`
    : '';
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

  const closeExternalAppResetRequest = () => {
    setAuthenticatedThirdApp(false);
    setSyncAgain(true);
    setRestartExternalRequest(true);
  };

  broadcastChannel.onmessage = (event) => {
    const { status } = event.data;
    if (status === 'success') {
      closeExternalAppResetRequest();
    }
  };
  const getExtLoginData = (data) => {
    if (data?.status) {
      closeExternalAppResetRequest();
    }
  };
  useEffect(() => {
    if (restartExternalRequest) {
      setRestartExternalRequest(false);
    }
  }, [restartExternalRequest]);

  // Pagination
  const handlePagination = (value) => {
    setCurrPage(value);
  };

  const handleChangeLimit = (dataKey) => {
    setCurrPage(1);
    setPageSize(dataKey);
  };
  // get all sync list
  const {
    data: syncConfigList,
    refetch: refetchsyncConfigList,
    isLoading,
  } = useQuery(['sync'], () =>
    fetchAPIRequest({
      // eslint-disable-next-line max-len
      urlPath: `${authCtx.organization_id}/synchronization?page=${currPage}&per_page=${pageSize}`,
      token: authCtx.token,
      method: 'GET',
      showNotification: showNotification,
    }),
  );
  // DELETE: Delete data using react query
  const {
    isLoading: deleteLoading,
    isSuccess: deleteSuccess,
    mutate: deleteMutate,
  } = useMutation(
    () =>
      fetchAPIRequest({
        urlPath: `${authCtx.organization_id}/synchronization/${deleteData?.id}`,
        token: authCtx.token,
        method: 'DELETE',
        showNotification: showNotification,
      }),
    {
      onSuccess: () => {
        setDeleteData({});
      },
    },
  );

  useEffect(() => {
    dispatch(handleCurrPageTitle('Synchronization'));
    refetchsyncConfigList();
  }, [
    isCreated,
    isUpdated,
    isDeleted,
    pageSize,
    currPage,
    refreshData,
    isCrudLoading,
    deleteSuccess,
  ]);
  // handle open add pipeline secret modal
  const handleAddNew = () => {
    navigate(`${organization}/admin/createsync`);
  };
  const handleDelete = (data) => {
    setDeleteData(data);
    setOpen(true);
  };
  const handleConfirmed = (value) => {
    if (value) deleteMutate();
  };
  const handleSync = (data) => {
    setSyncData(data);
    setSyncAgain(true);
    // createMutate();
  };

  useEffect(() => {
    if (syncAgain) {
      (async () => {
        try {
          setSyncLoading(true);
          const response = await fetch(
            `${apiURL}/${authCtx.organization_id}/synchronization/run/?sync_resource_id=${syncData?.id}`,
            {
              method: 'POST',
              headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer ' + authCtx.token,
              },
            },
          );

          if (response.ok) {
            setSourceApplication('');
            setTargetApplication('');
            setSyncLoading(false);
            setSyncAgain(false);
            const data = await response.json();
            showNotification('success', data.message);
            return data;
          } else if (!response.ok) {
            setSyncLoading(false);
            setSyncAgain(false);
          }

          switch (response.status) {
            case 400: {
              const errorData400 = await response.json();
              showNotification('error', errorData400?.message);
              return false;
            }
            case 401: {
              const errorData401 = await response.json();
              showNotification('error', errorData401?.message);
              setSyncAgain(false);
              if (errorData401?.application_type) {
                if (
                  errorData401?.application_type === syncData?.source_application_type
                ) {
                  setSourceApplication(syncData?.source_application);
                  setAuthenticatedThirdApp(true);
                } else {
                  setTargetApplication(syncData?.target_application);
                  setAuthenticatedThirdApp(true);
                }
              } else {
                authCtx?.logout();
              }
              return false;
            }
            case 403: {
              if (authCtx.token) {
                showNotification('error', 'You do not have permission to access');
              } else {
                authCtx?.logout();
                return false;
              }
              break;
            }
            default: {
              const errorDataDefault = await response.json();
              showNotification('error', errorDataDefault?.message);
              return false;
            }
          }
        } catch (error) {
          console.error('An error occurred:', error);
          setSyncLoading(false);
        }
      })();
    }
  }, [restartExternalRequest, syncAgain]);

  const data = !syncConfigList?.items
    ? []
    : syncConfigList.items.map((sync_resource) => {
        return {
          id: sync_resource.id,
          bidirectional: sync_resource.bidirectional,
          last_synced: sync_resource.last_synced,
          source_resource: sync_resource.source_resource,
          target_resource: sync_resource.target_resource,
          source_project: sync_resource.sync_project.source_project,
          target_project: sync_resource.sync_project.target_project,
          sourceApplication:
            sync_resource.sync_project.synchronization.source_application,
          source_application_type:
            sync_resource.sync_project.synchronization.source_application.type,
          targetApplication:
            sync_resource.sync_project.synchronization.target_application,
          target_application_type:
            sync_resource.sync_project.synchronization.target_application.type,
        };
      });

  const tableProps = {
    title: 'Synchronization',
    rowData: data ? data : [],
    headerData,
    handleDelete,
    handleAddNew,
    handleSync,
    handlePagination,
    handleChangeLimit,
    totalItems: data?.length,
    totalPages: syncConfigList?.total_pages,
    pageSize,
    page: syncConfigList?.page,
    inpPlaceholder: 'Search Synchronization  Data',
  };
  return (
    <div>
      {(isLoading || isCrudLoading || deleteLoading || syncLoading) && <UseLoader />}
      <AdminDataTable props={tableProps} />
      {/* confirmation modal  */}
      <AlertModal
        open={open}
        setOpen={setOpen}
        content={'Do you want to delete the sync?'}
        handleConfirmed={handleConfirmed}
      />
      <div>
        {authenticatedThirdApp && (
          <ExternalAppModal
            showInNewLink={true}
            formValue={targetApplication || sourceApplication}
            isOauth2={OAUTH2_APPLICATION_TYPES?.includes(
              targetApplication?.type || sourceApplication?.type,
            )}
            isBasic={(
              BASIC_AUTH_APPLICATION_TYPES + MICROSERVICES_APPLICATION_TYPES
            ).includes(targetApplication?.type || sourceApplication?.type)}
            onDataStatus={getExtLoginData}
            integrated={false}
          />
        )}
      </div>
    </div>
  );
};

export default Synchronization;
