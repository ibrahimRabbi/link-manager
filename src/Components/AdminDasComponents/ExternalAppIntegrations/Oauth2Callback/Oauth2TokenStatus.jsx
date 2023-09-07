import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { FlexboxGrid, Panel } from 'rsuite';

import CloseOutlineIcon from '@rsuite/icons/CloseOutline';
import CheckOutlineIcon from '@rsuite/icons/CheckOutline';
import AuthContext from '../../../../Store/Auth-Context.jsx';

const Oauth2TokenStatus = () => {
  const location = useLocation();
  const authCtx = useContext(AuthContext);

  const queryParams = new URLSearchParams(location.search);
  const broadcastChannel = new BroadcastChannel('oauth2-app-status');

  const status = queryParams.get('status');
  const message = queryParams.get('message');

  const sendSuccessMessage = () => {
    broadcastChannel.postMessage({
      status: 'success',
    });
  };

  useEffect(() => {
    if (status === 'success') {
      sendSuccessMessage();
    }
  }, [status]);

  return (
    <div>
      <FlexboxGrid style={{ marginTop: '50px' }} justify="center">
        {status && message && authCtx && (
          <FlexboxGrid.Item colspan={16} style={{ padding: '0' }}>
            <Panel style={{ textAlign: 'center' }}>
              {status === 'success' ? (
                <CheckOutlineIcon
                  style={{
                    width: '100px',
                    height: '100px',
                    color: 'green',
                  }}
                />
              ) : (
                <CloseOutlineIcon
                  style={{
                    width: '100px',
                    height: '100px',
                    color: 'red',
                  }}
                />
              )}
            </Panel>
            {/* prettier-ignore */}
            <h2 style={{ textAlign: 'center', marginTop: '2%' }}>
              {status === 'success'
                ? 'You have successfully connected'
                : 'Something went wrong'}
            </h2>
            <div style={{ textAlign: 'center' }}>
              <h5 style={{ textAlign: 'center', marginTop: '2%' }}>
                {status === 'success'
                  ? 'Close this window and go back to the main webpage'
                  : message}
              </h5>
            </div>
          </FlexboxGrid.Item>
        )}
      </FlexboxGrid>
    </div>
  );
};

export default Oauth2TokenStatus;
