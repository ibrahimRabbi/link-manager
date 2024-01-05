import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button } from 'rsuite';
import { handleIsAddNewModal, handleIsAdminEditing } from '../../Redux/slices/navSlice';

const AddNewModal = ({
  children,
  handleSubmit,
  title,
  handleReset,
  size = null,
  minHeight,
  submitBtnText,
}) => {
  const { isAddNewModalOpen, isAdminEditing } = useSelector((state) => state.nav);
  const dispatch = useDispatch();

  const handleSave = () => {
    handleSubmit();
  };

  const handleClose = () => {
    dispatch(handleIsAddNewModal(false));
    setTimeout(() => {
      if (isAdminEditing) dispatch(handleIsAdminEditing(false));
      if (handleReset) handleReset();
    }, 500);
  };

  return (
    <Modal open={isAddNewModalOpen} size={size ? size : 'md'} onClose={handleClose}>
      <Modal.Header>
        <Modal.Title className="adminModalTitle">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{ padding: '10px 10px 30px', minHeight: minHeight ? minHeight : '150px' }}
      >
        {children}
      </Modal.Body>
      <Modal.Footer style={{ marginTop: '25px' }}>
        <Button
          onClick={handleClose}
          appearance="default"
          className="adminModalFooterBtn"
        >
          Cancel
        </Button>
        <Button onClick={handleSave} appearance="primary" className="adminModalFooterBtn">
          {submitBtnText ? submitBtnText : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddNewModal;
