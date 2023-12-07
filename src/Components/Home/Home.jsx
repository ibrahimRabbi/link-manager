/* eslint-disable indent */
/* eslint-disable max-len */
import React from 'react';
import { useState } from 'react';
import AuthContext from '../../Store/Auth-Context';
import { useContext } from 'react';
import { Button, Message, toaster } from 'rsuite';
import fetchAPIRequest from '../../apiRequests/apiRequest';
import { useQuery } from '@tanstack/react-query';
import RecentProjects from './RecentProjects';
import UseLoader from '../Shared/UseLoader';
import RecentPipeline from './RecentPipeline';
import RecentLink from './RecentLink';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { handleCurrPageTitle, handleIsAddNewModal } from '../../Redux/slices/navSlice';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [currPage] = useState(1);
  const [pageSize] = useState(5);
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showNotification = (type, message) => {
    if (type && message) {
      const messages = (
        <Message closable showIcon type={type}>
          {message}
        </Message>
      );
      toaster.push(messages, { placement: 'bottomCenter', duration: 1000 });
    }
  };
  const organization = authCtx?.organization_name
    ? `/${authCtx?.organization_name?.toLowerCase()}`
    : '';

  useEffect(() => {
    dispatch(handleCurrPageTitle('Dashboard'));
  }, []);

  // get data using react-query
  const { data: recentProject, isLoading: projectLoading } = useQuery(
    ['recentProject'],
    () =>
      fetchAPIRequest({
        // eslint-disable-next-line max-len
        urlPath: `${authCtx.organization_id}/project/recent?page=${currPage}&per_page=${pageSize}`,
        token: authCtx.token,
        method: 'GET',
        showNotification: showNotification,
      }),
  );
  const { data: recentPipelines, isLoading: pipelineLoading } = useQuery(
    ['recentPipeline'],
    () =>
      fetchAPIRequest({
        urlPath: `pipeline_run/recent?page=${currPage}&per_page=${pageSize}`,
        token: authCtx.token,
        method: 'GET',
        showNotification: showNotification,
      }),
  );
  const { data: recentCreatedLinks, isLoading: linkLoading } = useQuery(
    ['recentLink'],
    () =>
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
  const handleExtension = () => {
    navigate(`${organization}/admin/projects`);
    dispatch(handleIsAddNewModal(true));
  };
  return (
    <div style={{ padding: '20px 20px 0 30px', marginBottom: '30px' }}>
      {projectLoading || pipelineLoading || linkLoading ? (
        <UseLoader />
      ) : recentProject?.items?.length ||
        recentPipelines?.items?.length ||
        recentCreatedLinks?.data?.length ? (
        <div>
          <div
            style={{
              marginTop: '10px',
              marginBottom: '30px',
            }}
          >
            {(authCtx?.user?.role === 'super_admin' ||
              authCtx?.user?.role === 'admin') && (
              <div>
                <Button appearance="primary" onClick={() => handleExtension()}>
                  Create New Project
                </Button>
              </div>
            )}
          </div>
          <div>
            <h5>Recent Projects</h5>
            {recentProject?.items?.length < 1 ? (
              <div>
                <h5
                  style={{
                    textAlign: 'center',
                    marginTop: '10px',
                  }}
                >
                  No recent projects
                </h5>
              </div>
            ) : (
              <div>
                <RecentProjects recentProject={recentProject} />
              </div>
            )}
          </div>
          <div style={{ marginTop: '30px' }}>
            <h5>Recently Created Links</h5>
            {tableProps?.data?.length < 1 ? (
              <div>
                <h5
                  style={{
                    textAlign: 'center',
                    marginTop: '10px',
                  }}
                >
                  No links created
                </h5>
              </div>
            ) : (
              <div>
                <RecentLink recentCreatedLinks={tableProps} />
              </div>
            )}
          </div>
          <div style={{ marginTop: '30px' }}>
            <h5>Recent Pipeline Runs</h5>
            {recentPipelines?.items?.length < 1 ? (
              <div>
                <h5
                  style={{
                    textAlign: 'center',
                    marginTop: '10px',
                  }}
                >
                  No pipelines executed
                </h5>
              </div>
            ) : (
              <div>
                <RecentPipeline recentPipelines={recentPipelines} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '250px' }}>
          <h5>
            You do not have any recent data. To see dashboard, please create a new links
            or projects. Download extension for create links by
            <a
              href="https://chrome.google.com/webstore/detail/tracelynx/mkpcjknonnajlmnlccbkppaiggobfjio?hl=en&authuser=4"
              target="_blank"
              rel="noreferrer"
            >
              click here
            </a>
            .
          </h5>
        </div>
      )}
    </div>
  );
};

export default Home;
