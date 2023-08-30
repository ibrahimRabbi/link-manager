import React, { useContext, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import fetchAPIRequest from '../../../../apiRequests/apiRequest.js';

import AuthContext from '../../../../Store/Auth-Context';
import { FlexboxGrid } from 'rsuite';

const Oauth2Callback = () => {
  const authCtx = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const code = queryParams.get('code');
  const state = queryParams.get('state');

  const requestSentRef = useRef(false);

  const { data: accessToken } = useQuery(['oauth2AccessToken'], () =>
    fetchAPIRequest({
      urlPath: `external-integrations/oauth2/token?code=${code}&state=${state}`,
      token: authCtx.token,
      method: 'GET',
      showNotification: (status, message) => {
        redirectUrl(status, message);
      },
    }),
  );

  const redirectUrl = (tokenStatus, code) => {
    const url = `/oauth2/status?status=${tokenStatus}&message=${code}`;
    navigate(url);
  };

  useEffect(() => {
    if (!requestSentRef.current && authCtx.token && accessToken) {
      redirectUrl(accessToken?.status, accessToken?.message);
      requestSentRef.current = true;
    }
  }, [accessToken]);

  return (
    <>
      <FlexboxGrid style={{ marginTop: '50px' }} justify="center">
        <h2>Processing...</h2>
      </FlexboxGrid>
    </>
  );
};

export default Oauth2Callback;
