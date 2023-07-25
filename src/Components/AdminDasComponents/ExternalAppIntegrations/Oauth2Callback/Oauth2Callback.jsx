import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import fetchAPIRequest from '../../../../apiRequests/apiRequest.js';
import Notification from '../../../Shared/Notification';

import AuthContext from '../../../../Store/Auth-Context';
import { FlexboxGrid, Panel } from 'rsuite';

import CloseOutlineIcon from '@rsuite/icons/CloseOutline';
import CheckOutlineIcon from '@rsuite/icons/CheckOutline';

const Oauth2Callback = () => {
  const authCtx = useContext(AuthContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const broadcastChannel = new BroadcastChannel('oauth2-app-status');

  const [errorDescription, setErrorDescription] = useState('');

  const applicationId = queryParams.get('application_id');
  const code = queryParams.get('code');
  const state = queryParams.get('state');

  const payload = {
    application_id: applicationId,
    code: code,
    state: state,
  };

  const [notificationType, setNotificationType] = React.useState('');
  const [notificationMessage, setNotificationMessage] = React.useState('');
  const sendSuccessMessage = () => {
    broadcastChannel.postMessage({
      status: 'success',
    });
  };

  const showNotification = (type, res) => {
    if (type === 'error') {
      setNotificationType(type);
      try {
        const data = JSON.parse(res);

        setErrorDescription(data?.error_description);
      } catch (err) {
        setErrorDescription(err?.message);
      }
    } else {
      setNotificationType('success');
      setNotificationMessage(res);
    }
  };

  const { mutate: createMutate, isLoading } = useMutation(
    () =>
      fetchAPIRequest({
        urlPath: 'third_party/gitlab/oauth2/token',
        token: authCtx.token,
        method: 'POST',
        body: payload,
        showNotification: showNotification,
      }),
    {
      onSuccess: (res) => {
        if (res) {
          if (res?.status) {
            if (res?.status === 'success') {
              sendSuccessMessage();
            }
          }
        }
      },
    },
  );

  useEffect(() => {
    createMutate();
  }, []);

  return (
    <>
      <FlexboxGrid style={{ marginTop: '50px' }} justify="center">
        {!isLoading && (
          <FlexboxGrid.Item colspan={16} style={{ padding: '0' }}>
            <Panel style={{ textAlign: 'center' }}>
              {notificationType === 'error' ? (
                <CloseOutlineIcon
                  style={{ width: '100px', height: '100px', color: 'red' }}
                />
              ) : (
                <CheckOutlineIcon
                  style={{ width: '100px', height: '100px', color: 'green' }}
                />
              )}
            </Panel>
            {/* prettier-ignore */}
            <h2 style={{ textAlign: 'center', marginTop: '2%' }}>
              {!notificationType
                ? 'You have successfully connected'
                : 'Something went wrong'}
            </h2>
            <div style={{ textAlign: 'center' }}>
              <h5 style={{ textAlign: 'center', marginTop: '2%' }}>
                {!notificationType
                  ? 'Close this window and go back to the main webpage'
                  : errorDescription}
              </h5>
            </div>
          </FlexboxGrid.Item>
        )}
        {notificationType && notificationMessage && (
          <Notification
            type={notificationType}
            message={notificationMessage}
            setNotificationType={setNotificationType}
            setNotificationMessage={setNotificationMessage}
          />
        )}
      </FlexboxGrid>
    </>
  );
};

export default Oauth2Callback;
