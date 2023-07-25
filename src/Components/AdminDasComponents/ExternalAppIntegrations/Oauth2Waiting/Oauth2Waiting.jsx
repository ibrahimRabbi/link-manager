import React, { useContext } from 'react';
import { Message, Panel, toaster } from 'rsuite';
import ViewsAuthorizeIcon from '@rsuite/icons/ViewsAuthorize';
import styles from './Oauth2Waiting.scss?inline';
import { useQuery } from '@tanstack/react-query';
import fetchAPIRequest from '../../../../apiRequests/apiRequest.js';
import AuthContext from '../../../../Store/Auth-Context.jsx';

const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;
// eslint-disable-next-line max-len
const defaultMessage =
  'Once you have authenticated you will be redirected to the next step';

const { appImage } = styles;
const Oauth2Waiting = (props) => {
  const authCtx = useContext(AuthContext);
  let iconUrl = '';
  let url = '';
  let defaultAppType = false;
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
  const { data, message } = props;

  const { data: oauth2Data } = useQuery(['oauth2DataApp'], () =>
    fetchAPIRequest({
      // eslint-disable-next-line max-len
      urlPath: `application?name=${data?.name}&organization_id=${data?.organization_id}`,
      token: authCtx.token,
      method: 'GET',
      showNotification: showNotification,
    }),
  );

  const openOauth2Login = (url) => {
    window.open(url, '_blank');
  };

  if (oauth2Data) {
    // eslint-disable-next-line max-len
    url = `${lmApiUrl}/third_party/${data?.type}/oauth2/login?application_id=${oauth2Data?.items[0]?.id}`;
    openOauth2Login(url);
  }

  // prettier-ignore
  switch (data?.type) {
  case 'gitlab':
    iconUrl = '/gitlab_logo.png';
    break;
  case 'jira':
    iconUrl = '/jira_logo.png';
    break;
  default:
    defaultAppType = true;
  }

  return (
    <div>
      <Panel>
        {defaultAppType ? (
          <ViewsAuthorizeIcon style={{ width: '100px', height: '100px' }} />
        ) : (
          <img src={iconUrl} alt="Application logo" className={appImage} />
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
