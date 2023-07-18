import React from 'react';
import { Button, Col, Modal, FlexboxGrid } from 'rsuite';
import ExternalLogin from '../ExternalLogin/ExternalLogin.jsx';
import Oauth2Waiting from '../Oauth2Waiting/Oauth2Waiting.jsx';
const ExternalAppModal = (props) => {
  const { formValue, openedModal, closeModal, isOauth2, isBasic, onDataStatus } = props;

  return (
    <>
      <Modal
        backdrop="static"
        keyboard={false}
        open={openedModal}
        style={{ marginTop: '25px' }}
        size="sm"
        onClose={closeModal}
      >
        <Modal.Header>
          <Modal.Title className="adminModalTitle">Waiting for authorization</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ textAlign: 'center', margin: '10px 15px' }}>
          <FlexboxGrid justify="center" align="middle">
            <FlexboxGrid.Item colspan={24} md={14} lg={16} xl={18} xxl={20}>
              {isOauth2 && (
                <Oauth2Waiting
                  data={formValue}
                  message={'Once you have authenticated the window will be closed'}
                />
              )}
              {isBasic && (
                <ExternalLogin appData={formValue} onDataStatus={onDataStatus} />
              )}
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ExternalAppModal;
