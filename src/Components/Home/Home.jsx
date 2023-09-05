import React from 'react';
import { useState } from 'react';
import AuthContext from '../../Store/Auth-Context';
import { useContext } from 'react';
import { Message, toaster } from 'rsuite';
import fetchAPIRequest from '../../apiRequests/apiRequest';
import { useQuery } from '@tanstack/react-query';
import RecentProjects from './RecentProjects';
import UseLoader from '../Shared/UseLoader';
import RecentPipeline from './RecentPipeline';
import RecentLink from './RecentLink';

const Home = () => {
  const [currPage] = useState(1);
  const [pageSize] = useState(5);
  const authCtx = useContext(AuthContext);
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
  // get data using react-query
  const {
    data: recentProject,
    isLoading: projectLoading,
    // refetch: refetchProjects,
  } = useQuery(['recentProject'], () =>
    fetchAPIRequest({
      urlPath: `project/recent?page=${currPage}&per_page=${pageSize}`,
      token: authCtx.token,
      method: 'GET',
      showNotification: showNotification,
    }),
  );
  const {
    data: recentPipelines,
    isLoading: pipelineLoading,
    // refetch: refetchPipeline,
  } = useQuery(['recentPipeline'], () =>
    fetchAPIRequest({
      urlPath: `pipeline_run/recent?page=${currPage}&per_page=${pageSize}`,
      token: authCtx.token,
      method: 'GET',
      showNotification: showNotification,
    }),
  );
  const {
    data: recentCreatedLinks,
    isLoading: linkLoading,
    // refetch: refetchPipeline,
  } = useQuery(['recentLink'], () =>
    fetchAPIRequest({
      urlPath: `link/recent?page=${currPage}&per_page=${pageSize}`,
      token: authCtx.token,
      method: 'GET',
      showNotification: showNotification,
    }),
  );
  const tableProps = {
    data: recentCreatedLinks?.data?.length ? recentCreatedLinks?.data : [],
  };
  return (
    <div style={{ padding: '20px 20px 0 30px' }}>
      {projectLoading || pipelineLoading || linkLoading ? (
        <UseLoader />
      ) : (
        <div>
          <div>
            <h3>Recent Projects</h3>
            {recentProject?.items?.length < 1 ? (
              <div>
                <h3 style={{ textAlign: 'center', marginTop: '10px', color: 'blue' }}>
                  There is no recent projects
                </h3>
              </div>
            ) : (
              <div>
                <RecentProjects recentProject={recentProject} />
              </div>
            )}
          </div>
          <div style={{ marginTop: '30px' }}>
            <h3>Recent Link Created</h3>
            {recentCreatedLinks?.items?.length < 1 ? (
              <div>
                <h3 style={{ textAlign: 'center', marginTop: '10px', color: 'blue' }}>
                  There is no link created
                </h3>
              </div>
            ) : (
              <div>
                <RecentLink recentCreatedLinks={tableProps} />
              </div>
            )}
          </div>
          <div style={{ marginTop: '30px' }}>
            <h3>Pipeline Executed</h3>
            {recentPipelines?.items?.length < 1 ? (
              <div>
                <h3 style={{ textAlign: 'center', marginTop: '10px', color: 'blue' }}>
                  There is no pipeline executed
                </h3>
              </div>
            ) : (
              <div>
                <RecentPipeline recentPipelines={recentPipelines} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
