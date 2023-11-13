import React from 'react';
import { Modal, Progress } from 'rsuite';

const ProgressModal = ({ open }) => {
  const [percent /*setPercent*/] = React.useState(30);
  const status = percent === 100 ? 'success' : null;
  const color = percent === 100 ? '#52c41a' : '#3385ff';
  return (
    <div>
      <Modal open={open}>
        <Modal.Header>
          <Modal.Title>Sync Progress</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Progress.Line
            percent={percent}
            strokeColor={color}
            status={status}
            showInfo={false}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProgressModal;
