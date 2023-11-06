import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader, Message, toaster } from 'rsuite';
import AuthContext from '../../../Store/Auth-Context';
import { handleCurrPageTitle } from '../../../Redux/slices/navSlice';
import fetchAPIRequest from '../../../apiRequests/apiRequest';
import { useQuery } from '@tanstack/react-query';
import AdminDataTable from '../AdminDataTable';
import { useNavigate } from 'react-router-dom';

const fakeData = [
  {
    source_application_id: 1,
    source_workspace: 'training workspace',
    source_project: 'Valicopter_5000',
    source_resource: 'requirements',
    target_application_id: 2,
    target_workspace: null,
    target_project: 'Aras Oslc Api',
    target_resource: 'tasks',
    bidirectional: true,
    active: true,
    property_mappings: [
      {
        source_property: 'summary',
        target_property: 'description',
        source_datatype: 'string',
        target_datatype: 'string',
        enum_mapping: {},
      },
    ],
  },
  {
    source_application_id: 2,
    source_workspace: 'training workspace',
    source_project: 'Cross Domain Int',
    source_resource: 'requirements',
    target_application_id: 3,
    target_workspace: null,
    target_project: 'Link Manager',
    target_resource: 'tasks',
    bidirectional: true,
    active: false,
    property_mappings: [
      {
        source_property: 'summary',
        target_property: 'description',
        source_datatype: 'string',
        target_datatype: 'string',
        enum_mapping: {},
      },
    ],
  },
];
const headerData = [
  {
    header: 'Source Project',
    key: 'source_project',
  },
  {
    header: 'Source Resource',
    key: 'source_resource',
  },
  {
    header: 'Target Project',
    key: 'target_project',
  },
  {
    header: 'Target Resource',
    key: 'target_resource',
  },
  { header: 'Sync/Migrate', buttonKey: 'button' },
  { header: 'Status', syncStatus: 'active', width: 120 },
];
const Synchronization = () => {
  const { isCreated, isDeleted, isUpdated, isCrudLoading } = useSelector(
    (state) => state.crud,
  );

  const { refreshData } = useSelector((state) => state.nav);

  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Pagination
  const handlePagination = (value) => {
    setCurrPage(value);
  };

  const handleChangeLimit = (dataKey) => {
    setCurrPage(1);
    setPageSize(dataKey);
  };
  useEffect(() => {
    dispatch(handleCurrPageTitle('Synchronization'));
    refetchsyncConfigList();
  }, [isCreated, isUpdated, isDeleted, pageSize, currPage, refreshData, isCrudLoading]);
  // get all pipeline secrets
  const { data: syncConfigList, refetch: refetchsyncConfigList } = useQuery(
    ['pipelineSecret'],
    () =>
      fetchAPIRequest({
        // eslint-disable-next-line max-len
        urlPath: `${authCtx.organization_id}/sync?page=${currPage}&per_page=${pageSize}`,
        token: authCtx.token,
        method: 'GET',
        // showNotification: showNotification,
      }),
  );
  // handle open add pipeline secret modal
  const handleAddNew = () => {
    navigate('/admin/createsync');
  };
  const handleDelete = () => {
    showNotification('success', 'deleted');
  };
  // send props in the batch action table
  const tableProps = {
    title: 'Synchronization',
    rowData: fakeData?.length ? fakeData : [],
    headerData,
    // handleEdit,
    handleDelete,
    handleAddNew,
    handlePagination,
    handleChangeLimit,
    totalItems: syncConfigList?.total_items,
    totalPages: syncConfigList?.total_pages,
    pageSize,
    page: syncConfigList?.page,
    inpPlaceholder: 'Search Synchronization  Data',
  };
  return (
    <div>
      {isCrudLoading && (
        <Loader
          backdrop
          center
          size="md"
          vertical
          content="Loading"
          style={{ zIndex: '10' }}
        />
      )}
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default Synchronization;
