import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button } from 'rsuite';
import { handleIsAddNewModal } from '../../Redux/slices/navSlice';

const AddNewModal = ({ children, handleSubmit, title }) => {
  const { isAddNewModalOpen } = useSelector((state) => state.nav);
  const dispatch = useDispatch();

  const handleOk = () => {
    handleSubmit();
  };
  return (
    <Modal open={isAddNewModalOpen} onClose={() => dispatch(handleIsAddNewModal(false))}>
      <Modal.Header>
        <Modal.Title style={{ fontSize: '20px' }}>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button onClick={handleOk} appearance="primary">
          Ok
        </Button>
        <Button onClick={() => dispatch(handleIsAddNewModal(false))} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddNewModal;
