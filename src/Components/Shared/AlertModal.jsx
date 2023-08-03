import React from 'react';
import { Button, Modal } from 'rsuite';
import InfoRoundIcon from '@rsuite/icons/InfoRound';

const AlertModal = ({ setOpen, open, setConfirm }) => {
  const handleClose = () => setOpen(false);
  const handleConfirm = () => {
    setConfirm(true);
    setOpen(false);
  };
  return (
    <div>
      <Modal
        size="xs"
        backdrop="static"
        role="alertdialog"
        open={open}
        onClose={handleClose}
      >
        <Modal.Header>
          <Modal.Title
            style={{
              textAlign: 'center',
              fontSize: '50px',
              color: 'rgb(22, 117, 224)',
            }}
          >
            <InfoRoundIcon />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: '17px', fontWeight: 'bold' }}>
          Are you sure? You want to logout!
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleConfirm} appearance="primary">
            Yes
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AlertModal;
