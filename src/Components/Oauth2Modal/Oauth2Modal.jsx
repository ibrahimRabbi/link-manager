import { Button, Modal } from 'rsuite';
import React, { useState } from 'react';

import { handleIsOauth2ModalOpen } from '../../Redux/slices/oauth2ModalSlice.jsx';
import { useDispatch, useSelector } from 'react-redux';

// eslint-disable-next-line react/display-name
const Oauth2Modal = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();

  const verifyAndOpenModal = (payload, selectedApplication) => {
    console.log('verifyAndOpenModal');
    console.log('payload', payload);
    console.log('selectedApplication', selectedApplication);
    if (payload && selectedApplication) {
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

  // Assign the childFunction to the ref
  React.useImperativeHandle(ref, () => ({
    verifyAndOpenModal,
  }));

  const { isOauth2ModalOpen } = useSelector((state) => state.oauth2Modal);

  const [authorizeFrameSrc, setAuthorizeFrameSrc] = useState('');

  return (
    <>
      <Modal
        backdrop="static"
        keyboard={false}
        open={isOauth2ModalOpen}
        style={{ marginTop: '25px' }}
        size="sm"
        onClose={() => dispatch(handleIsOauth2ModalOpen(false))}
      >
        <Modal.Header>
          <Modal.Title className="adminModalTitle">Please authorize</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <iframe className={'authorize-iframe'} src={authorizeFrameSrc} />
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => dispatch(handleIsOauth2ModalOpen(false))}
            appearance="default"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
});

export default Oauth2Modal;
