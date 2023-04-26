import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button } from 'rsuite';
import { handleIsAddNewModal, handleIsAdminEditing } from '../../Redux/slices/navSlice';

const AddNewModal = ({ children, handleSubmit, title, handleReset }) => {
  const { isAddNewModalOpen, isAdminEditing } = useSelector((state) => state.nav);
  const dispatch = useDispatch();

  const handleOk = () => {
    handleSubmit();
  };

  const handleClose = () => {
    dispatch(handleIsAddNewModal(false));
    handleReset();
    if (isAdminEditing) dispatch(handleIsAdminEditing(false));
  };

  return (
    <Modal open={isAddNewModalOpen} size="md" onClose={handleClose}>
      <Modal.Header>
        <Modal.Title className="adminModalTitle">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: '10px' }}>{children}</Modal.Body>
      <Modal.Footer>
        <Button onClick={handleOk} appearance="primary">
          Ok
        </Button>
        <Button onClick={handleClose} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddNewModal;
