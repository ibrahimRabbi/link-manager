import React from 'react';
import { Button, Modal } from 'rsuite';
import InfoRoundIcon from '@rsuite/icons/InfoRound';

const AlertModal = ({ setOpen, open, content, handleConfirmed }) => {
  const handleClose = () => setOpen(false);
  const handleConfirm = () => {
    handleConfirmed(true);
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
        <Modal.Body style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>
          Are you sure? <br />
          {content}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
          <Button onClick={handleConfirm} appearance="primary">
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AlertModal;
