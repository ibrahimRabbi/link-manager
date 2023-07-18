import { Button, FlexboxGrid } from 'rsuite';
import React from 'react';

import './Oauth2TokenResponse.scss';

const Oauth2TokenResponse = (props) => {
  const { authorizedConsumption, closeModal } = props;
  return (
    <>
      {authorizedConsumption ? (
        <h4>Authorized successfully</h4>
      ) : (
        <h4>You have not been authorized yet</h4>
      )}

      {authorizedConsumption ? (
        <h5>
          You have been authenticated to use the external application. You can close this
          window.
        </h5>
      ) : (
        <h5>
          Once you try to use the application data ou will be redirected to login to the
          application
        </h5>
      )}

      <FlexboxGrid justify="end" style={{ marginTop: '30px' }}>
        <Button
          appearance="primary"
          color="blue"
          className="adminModalFooterBtn"
          onClick={closeModal}
        >
          Close
        </Button>
      </FlexboxGrid>
    </>
  );
};

export default Oauth2TokenResponse;
