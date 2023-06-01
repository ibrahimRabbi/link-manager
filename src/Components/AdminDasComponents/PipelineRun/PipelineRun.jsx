import React, { useContext, useEffect, useState } from 'react';
import { Loader } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import AdminDataTable from '../AdminDataTable.jsx';
import { handleCurrPageTitle } from '../../../Redux/slices/navSlice.jsx';
import AuthContext from '../../../Store/Auth-Context.jsx';
import { fetchPipelineRun } from '../../../Redux/slices/pipelineRunSlice.jsx';

const lmApiUrl = process.env.REACT_APP_LM_REST_API_URL;

const headerData = [
  {
    header: 'ID',
    key: 'id',
  },
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
    key: 'status',
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
  const [pageSize /*, setPageSize*/] = useState(10);
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  const handlePagination = (value) => {
    setCurrPage(value);
  };

  useEffect(() => {
    dispatch(handleCurrPageTitle('Pipeline Results'));

    const getUrl = `${lmApiUrl}/pipeline_run?page=${currPage}&per_page=${pageSize}`;
    dispatch(fetchPipelineRun({ url: getUrl, token: authCtx.token, authCtx: authCtx }));
  }, [pageSize, currPage, refreshData]);

  const tableProps = {
    title: 'Pipeline Results',
    rowData: allPipelineRun?.items?.length ? allPipelineRun?.items : [],
    headerData,
    // handleEdit,
    // handleDelete,
    // handleAddNew,
    handlePagination,
    // handleChangeLimit,
    totalItems: allPipelineRun?.total_items,
    totalPages: allPipelineRun?.total_pages,
    pageSize,
    page: allPipelineRun?.page,
    inpPlaceholder: 'Search Pipelines',
  };

  return (
    <div>
      <h1>PipelineRun</h1>
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
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default PipelineRun;
