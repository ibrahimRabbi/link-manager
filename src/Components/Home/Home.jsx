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
import { handleCurrPageTitle } from '../../Redux/slices/navSlice';
import { useNavigate } from 'react-router-dom';
const wbeUrl = import.meta.env.VITE_GENERIC_WBE;

const Home = () => {
  const [currPage] = useState(1);
  const [pageSize] = useState(5);
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const organization = authCtx?.organization_name
    ? `/${authCtx?.organization_name?.toLowerCase()}`
    : '';
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
  return (
    <div style={{ marginBottom: '30px' }}>
      {projectLoading || pipelineLoading || linkLoading ? (
        <UseLoader />
      ) : recentProject?.items?.length ||
        recentPipelines?.items?.length ||
        recentCreatedLinks?.data?.length ? (
        <div>
          <div>
            <h5>Recent Projects</h5>
            {recentProject?.items?.length < 1 &&
            (authCtx?.user?.role === 'super_admin' || authCtx?.user?.role === 'admin') ? (
              <div>
                <h5
                  style={{
                    textAlign: 'center',
                    marginTop: '10px',
                  }}
                >
                  <Button
                    appearance="primary"
                    onClick={() => navigate(`${organization}/admin/project/new`)}
                  >
                    Create Project
                  </Button>
                </h5>
              </div>
            ) : (
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
            )}
            {recentProject?.items?.length > 1 && (
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
        <div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0px' }}>
            <img src="/no_data.jpg" style={{ width: '75vh' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0px' }}>
            <h5>
              To see dashboard, download the extension by
              <a
                href={wbeUrl}
                target="_blank"
                rel="noreferrer"
                style={{ marginLeft: '2px' }}
              >
                click here
              </a>
              .
            </h5>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
