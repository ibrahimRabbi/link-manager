import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button } from 'rsuite';
import { handleIsAddNewModal } from '../../Redux/slices/navSlice';

const AddNewModal = ({ children, handleSubmit }) => {
  const { isAddNewModalOpen } = useSelector((state) => state.nav);
  const dispatch = useDispatch();

  const handleOk = () => {
    handleSubmit();
    dispatch(handleIsAddNewModal(false));
  };
  return (
    <Modal open={isAddNewModalOpen} onClose={handleOk}>
      <Modal.Header>
        <Modal.Title>Modal Title</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button onClick={handleOk} appearance="primary">
          Ok
        </Button>
        <Button onClick={handleOk} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddNewModal;
