import React, { useContext, useEffect, useState } from 'react';
import { Loader, Message, toaster } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import AdminDataTable from '../AdminDataTable.jsx';
import { handleCurrPageTitle } from '../../../Redux/slices/navSlice.jsx';
import AuthContext from '../../../Store/Auth-Context.jsx';
import { fetchPipelineRun } from '../../../Redux/slices/pipelineRunSlice.jsx';
import { fetchDeleteData } from '../../../Redux/slices/useCRUDSlice';
import AlertModal from '../../Shared/AlertModal';

const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;

const headerData = [
  {
    header: 'Started',
    key: 'start_time',
  },
  {
    header: 'Ended',
    key: 'end_time',
  },
  {
    header: 'Timestamp',
    key: 'timestamp',
  },
  {
    header: 'Status',
    pipelinerunkey: 'status',
  },
  {
    header: 'Output',
    key: 'output',
  },
];

const PipelineRun = () => {
  const { allPipelineRun, isPipelineRunLoading } = useSelector(
    (state) => state.pipelinerun,
  );
  const { refreshData /*, isAdminEditing*/ } = useSelector((state) => state.nav);
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const [deleteData, setDeleteData] = useState({});
  const [open, setOpen] = useState(false);

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
  const handlePagination = (value) => {
    setCurrPage(value);
  };

  useEffect(() => {
    dispatch(handleCurrPageTitle('Pipeline Runs'));

    const getUrl = `${lmApiUrl}/pipeline_run?page=${currPage}&per_page=${pageSize}`;
    dispatch(
      fetchPipelineRun({
        url: getUrl,
        token: authCtx.token,
        authCtx: authCtx,
        showNotification: showNotification,
      }),
    );
  }, [pageSize, currPage, refreshData]);

  const handleChangeLimit = (dataKey) => {
    setCurrPage(1);
    setPageSize(dataKey);
  };

  const handleDelete = (data) => {
    setDeleteData(data);
    setOpen(true);
  };

  const handleConfirmed = (value) => {
    if (value) {
      const deleteUrl = `${lmApiUrl}/pipeline_run/${deleteData?.id}`;
      dispatch(
        fetchDeleteData({
          url: deleteUrl,
          token: authCtx.token,
          showNotification: showNotification,
        }),
      );
    }
  };

  const tableProps = {
    rowData: allPipelineRun?.items?.length ? allPipelineRun?.items : [],
    headerData,
    handleDelete,
    handlePagination,
    handleChangeLimit,
    totalItems: allPipelineRun?.total_items,
    totalPages: allPipelineRun?.total_pages,
    pageSize,
    page: allPipelineRun?.page,
    inpPlaceholder: 'Search Pipelines',
  };

  return (
    <div>
      {isPipelineRunLoading && (
        <Loader
          backdrop
          center
          size="md"
          vertical
          content="Loading"
          style={{ zIndex: '10' }}
        />
      )}
      {/* confirmation modal  */}
      <AlertModal
        open={open}
        setOpen={setOpen}
        content={'Do you want to delete the pipeline run?'}
        handleConfirmed={handleConfirmed}
      />
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default PipelineRun;
