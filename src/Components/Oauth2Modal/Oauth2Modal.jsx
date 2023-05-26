import React, { useState, forwardRef, useEffect } from 'react';
import { Button, Modal } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import { handleIsOauth2ModalOpen } from '../../Redux/slices/oauth2ModalSlice.jsx';

// eslint-disable-next-line react/display-name
const Oauth2Modal = forwardRef((props, ref) => {
  const { isOauth2ModalOpen } = useSelector((state) => state.oauth2Modal);
  const { consumerTokens } = useSelector((state) => state.associations);
  const [authorizeFrameSrc, setAuthorizeFrameSrc] = useState('');
  const [appId, setAppId] = useState('');
  const dispatch = useDispatch();

  const verifyAndOpenModal = (payload, selectedApplication) => {
    if (payload && selectedApplication) {
      setAppId(selectedApplication);
      const selectedData = payload?.oauth2_application[0];

      let query = `client_id=${selectedData?.client_id}&scope=${selectedData?.scopes}`;

      selectedData?.response_types?.forEach((response_type) => {
        if (selectedData?.response_types?.indexOf(response_type) === 0) {
          query += `&response_type=${response_type}`;
        } else {
          query += ` ${response_type}`;
        }
      }, query);

      query += `&redirect_uri=${selectedData?.redirect_uris[0]}`;
      const authUrl = `${selectedData?.authorization_uri}?${query}`;
      setAuthorizeFrameSrc(authUrl);
      dispatch(handleIsOauth2ModalOpen(true));
    }
  };

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
