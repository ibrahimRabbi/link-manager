import React, { useContext, useEffect, useState } from 'react';
import { Message, Panel, toaster } from 'rsuite';
import ViewsAuthorizeIcon from '@rsuite/icons/ViewsAuthorize';
import styles from './Oauth2Waiting.scss?inline';
import { useQuery } from '@tanstack/react-query';
import fetchAPIRequest from '../../../../apiRequests/apiRequest.js';
import AuthContext from '../../../../Store/Auth-Context.jsx';

const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;
const defaultMessage =
  'Once you have authenticated you will be redirected to the next step';

const { appImage } = styles;
const Oauth2Waiting = (props) => {
  const authCtx = useContext(AuthContext);
  let iconUrl = '';
  const [url, setUrl] = useState('');
  let defaultAppType = false;
  const requestDataBroadcastChannel = new BroadcastChannel('request-oauth2-app');
  const applicationChannel = new BroadcastChannel('application-data');

  const [applicationId, setApplicationId] = useState(null);

  requestDataBroadcastChannel.onmessage = (event) => {
    if (event.data?.status) {
      applicationData();
    }
  };
  const applicationData = () => {
    applicationChannel.postMessage({
      application: oauth2Data?.items[0]?.id,
    });
  };

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
  const { data, message, preview } = props;

  const { data: oauth2Data, refetch: refetchOauth2Data } = useQuery(
    ['oauth2DataApp'],
    () =>
      fetchAPIRequest({
        // eslint-disable-next-line max-len
        urlPath: `${authCtx.organization_id}/application?name=${data?.name}&organization_id=${data?.organization_id}`,
        token: authCtx.token,
        method: 'GET',
        showNotification: showNotification,
      }),
  );
  const openOauth2Login = () => {
    window.open(url, '_blank');
  };

  useEffect(() => {
    if (applicationId) {
      // eslint-disable-next-line max-len
      const openUrl = `${lmApiUrl}/third_party/${data?.type}/oauth2/login?application_id=${applicationId}`;
      setUrl(openUrl);
    } else if (oauth2Data) {
      // eslint-disable-next-line max-len
      const openUrl = `${lmApiUrl}/third_party/${data?.type}/oauth2/login?application_id=${oauth2Data?.items[0]?.id}`;
      setUrl(openUrl);
    }
  }, [oauth2Data, applicationId]);

  useEffect(() => {
    if (url) {
      openOauth2Login();
    }
  }, [url]);

  useEffect(() => {
    refetchOauth2Data({ data: null });
    setUrl('');
  }, [data]);

  useEffect(() => {
    if (data?.application_id && !applicationId) {
      setApplicationId(data.application_id);
    }
  }, []);

  // prettier-ignore
  switch (data?.type) {
  case 'gitlab':
    iconUrl = '/gitlab_logo.png';
    break;
  case 'jira':
    iconUrl = '/jira_logo.png';
    break;
  case 'codebeamer':
    iconUrl = '/codebeamer_logo.png';
    break;
  case 'bitbucket':
    iconUrl = '/bitbucket_logo.png';
    break;
  case 'github':
    iconUrl = '/github_logo.png';
    break;
  default:
    defaultAppType = true;
  }

  return (
    <div>
      <Panel>
        {defaultAppType ? (
          <ViewsAuthorizeIcon style={{ width: '100px', height: '100px' }} />
        ) : preview ? (
          <img
            src={iconUrl}
            alt="Application logo"
            className={appImage}
            width={75}
            height={75}
          />
        ) : (
          <img
            src={iconUrl}
            alt="Application logo"
            className={appImage}
            width={150}
            height={150}
          />
        )}
      </Panel>
      <h3>Waiting for user verification</h3>
      {/* eslint-disable-next-line max-len */}
      <p>
        A new tab will be displayed in the browser to authenticate with{' '}
        {data?.type.charAt(0).toUpperCase() + data?.type.slice(1)}. If not{' '}
        <span style={{ color: 'blue' }} onClick={() => openOauth2Login(url)}>
          click here
        </span>
      </p>
      <p>{message ? message : defaultMessage}.</p>
    </div>
  );
};

export default Oauth2Waiting;
