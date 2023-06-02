import React, { useState, forwardRef, useEffect } from 'react';
import { Button, Modal } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import { handleIsOauth2ModalOpen } from '../../Redux/slices/oauth2ModalSlice.jsx';

import { fetchOslcResource } from '../../Redux/slices/oslcResourcesSlice.jsx';

// eslint-disable-next-line react/display-name
const Oauth2Modal = forwardRef((props, ref) => {
  const { isOauth2ModalOpen } = useSelector((state) => state.oauth2Modal);
  const { consumerTokens } = useSelector((state) => state.associations);
  const [authorizeFrameSrc, setAuthorizeFrameSrc] = useState('');
  const [appId, setAppId] = useState('');
  const dispatch = useDispatch();
  const { userStatusUrl } = useSelector((state) => state.oslcResources);

  const verifyAndOpenModal = (payload, selectedApplication, userStatus = false) => {
    const oauth2AppData = payload?.oauth2_application[0];
    const appData = payload;
    let authUrl = '';
    if (userStatus) {
      //Request OSLC Rootservices to get the URL to check the user status
      dispatch(
        fetchOslcResource({
          url: appData?.rootservices_url,
          token: 'Bearer notRequired',
        }),
      );
      authUrl = userStatusUrl;
    } else if (payload && selectedApplication) {
      setAppId(selectedApplication);
      let query = `client_id=${oauth2AppData?.client_id}&scope=${oauth2AppData?.scopes}`;

      oauth2AppData?.response_types?.forEach((response_type) => {
        if (oauth2AppData?.response_types?.indexOf(response_type) === 0) {
          query += `&response_type=${response_type}`;
        } else {
          query += ` ${response_type}`;
        }
      }, query);

      query += `&redirect_uri=${oauth2AppData?.redirect_uris[0]}`;
      authUrl = `${oauth2AppData?.authorization_uri}?${query}`;
    }
    setAuthorizeFrameSrc(authUrl);
    dispatch(handleIsOauth2ModalOpen(true));
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.url) {
        const receivedUrl = event.data.url;
        if (
          receivedUrl.includes('status=ok') &&
          receivedUrl.includes('authorizedUser=true')
        ) {
          console.log('Message: ', receivedUrl);
          handleCloseModal();
        }
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // handle close modal
  const handleCloseModal = () => {
    dispatch(handleIsOauth2ModalOpen(false));
  };

  useEffect(() => {
    if (consumerTokens[appId]) handleCloseModal();
  }, [consumerTokens[appId]]);

  // Assign the childFunction to the ref
  React.useImperativeHandle(ref, () => ({
    verifyAndOpenModal,
  }));

  return (
    <>
      <Modal
        backdrop="static"
        keyboard={false}
        open={isOauth2ModalOpen}
        style={{ marginTop: '25px' }}
        size="sm"
        onClose={handleCloseModal}
      >
        <Modal.Header>
          <Modal.Title className="adminModalTitle">Please authorize</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <iframe className={'authorize-iframe'} src={authorizeFrameSrc} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseModal} appearance="default">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
});

export default Oauth2Modal;
