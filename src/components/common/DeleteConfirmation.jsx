import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteConfirmation = ({ showModal, hideModal, confirmModal }) => {
  return (
    <Modal show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận xóa</Modal.Title>
      </Modal.Header>
      <Modal.Body>Bạn có chắc chắn muốn xóa mục này không?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hideModal}>
          Hủy
        </Button>
        <Button variant="danger" onClick={confirmModal}>
          Xóa
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmation;
