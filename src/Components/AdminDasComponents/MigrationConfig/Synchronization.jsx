import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader, Message, toaster } from 'rsuite';
import AuthContext from '../../../Store/Auth-Context';
import { handleCurrPageTitle } from '../../../Redux/slices/navSlice';
import fetchAPIRequest from '../../../apiRequests/apiRequest';
import { useQuery } from '@tanstack/react-query';
import AdminDataTable from '../AdminDataTable';
import { useNavigate } from 'react-router-dom';
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
    header: 'Source Property',
    key: 'source_property',
  },
  {
    header: 'Target Project',
    key: 'target_project',
  },
  {
    header: 'Target Resource',
    key: 'target_resource',
  },
  {
    header: 'Target Property',
    key: 'target_property',
  },
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
    refetchPipelineSecrets();
  }, [isCreated, isUpdated, isDeleted, pageSize, currPage, refreshData, isCrudLoading]);
  // get all pipeline secrets
  const { data: allPipelineSecrets, refetch: refetchPipelineSecrets } = useQuery(
    ['pipelineSecret'],
    () =>
      fetchAPIRequest({
        // eslint-disable-next-line max-len
        urlPath: `${authCtx.organization_id}/sync?page=${currPage}&per_page=${pageSize}`,
        token: authCtx.token,
        method: 'GET',
        showNotification: showNotification,
      }),
  );
  // handle open add pipeline secret modal
  const handleAddNew = () => {
    navigate('/admin/createsync');
  };
  // send props in the batch action table
  const tableProps = {
    title: 'Synchronization',
    rowData: allPipelineSecrets?.items?.length ? allPipelineSecrets?.items : [],
    headerData,
    // handleEdit,
    // handleDelete,
    handleAddNew,
    // handleCopy,
    handlePagination,
    handleChangeLimit,
    totalItems: allPipelineSecrets?.total_items,
    totalPages: allPipelineSecrets?.total_pages,
    pageSize,
    page: allPipelineSecrets?.page,
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
