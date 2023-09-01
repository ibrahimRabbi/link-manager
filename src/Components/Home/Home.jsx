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
    data: recentPipeline,
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

  console.log(recentPipeline);
  return (
    <div style={{ padding: '20px 20px 0 30px' }}>
      {projectLoading || pipelineLoading ? (
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
            <h3>Pipeline Executed</h3>
            {recentPipeline?.items?.length < 1 ? (
              <div>
                <h3 style={{ textAlign: 'center', marginTop: '10px', color: 'blue' }}>
                  There is no pipeline executed
                </h3>
              </div>
            ) : (
              <div>
                <RecentPipeline recentPipeline={recentPipeline} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
