import React, { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import fetchAPIRequest from '../../../../apiRequests/apiRequest.js';
import AuthContext from '../../../../Store/Auth-Context.jsx';
import AdminDataTable from '../../AdminDataTable.jsx';

const ProjectPipelines = () => {
  const authCtx = useContext(AuthContext);
  const [pipelinesData, setPipelinesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const showNotification = (type, message) => {
    console.log(type, message);
  };

  const handlePagination = (value) => {
    setCurrentPage(value);
  };

  //prettier-ignore
  const {
    // eslint-disable-next-line no-unused-vars
    data: pipelineRunsData,
  } = useQuery(
    ['projectPipelineRuns'],
    () =>
      fetchAPIRequest({
        // eslint-disable-next-line max-len
        urlPath: `${authCtx.organization_id}/pipeline_run`,
        token: authCtx.token,
        method: 'GET',
        showNotification: showNotification,
      }),
    {
      onSuccess: (pipelineRunsData) => {
        const completeData = pipelineRunsData?.items?.map((item) => {
          return {
            ...item,
            name: `Pipeline ${item?.id}`,
          };
        });
        setPipelinesData(completeData);
      },
    },
  );
  const headerData = [
    {
      header: 'Name',
      key: 'name',
    },
    {
      header: 'Status',
      pipelinerunkey: 'status',
    },
  ];

  const tableProps = {
    title: 'Users',
    rowData: pipelinesData ? pipelinesData : [],
    handlePagination,
    headerData,
    pageSize: pageSize,
    page: currentPage,
    showAddNewButton: false,
    showSearchBar: false,
    showActions: false,
    showPagination: false,
    minHeight: 50,
  };

  return <AdminDataTable props={tableProps} />;
};

export default ProjectPipelines;
