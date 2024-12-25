import React from 'react';
import { Button, Modal, Alert, Badge } from 'react-bootstrap';

const InteractionModal = ({ showInteractionModal, setShowInteractionModal, drugInteractions }) => {
  const filteredInteractions = Object.entries(drugInteractions)
    .filter(([_, array]) => array.length > 0)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  return (
    <Modal show={showInteractionModal} onHide={() => setShowInteractionModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Cảnh báo tương tác thuốc</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {Object.entries(filteredInteractions).map(([severity, interactions]) =>
          interactions.map((interaction, i) => (
            <Alert
              key={`${severity}-${i}`}
              variant={severity === 'MAJOR' || severity === 'CONTRAINDICATED' ? 'danger' : 'warning'}
              className="mb-3"
            >
              <div className="d-flex align-items-center mb-2">
                <h6 className="mb-0 me-2">Mức độ:</h6>
                <Badge bg={severity === 'MAJOR' || severity === 'CONTRAINDICATED' ? 'danger' : 'warning'}>
                  {severity === 'MAJOR' || severity === 'CONTRAINDICATED' ? 'Nghiêm trọng' : 'Trung bình'}
                </Badge>
              </div>
              <p className="mb-2">
                <strong>Thuốc:</strong> {interaction.medicine1}
              </p>
              <p className="mb-2">
                <strong>Tương tác với thuốc:</strong> {interaction.medicine2}
              </p>
              <p className="mb-2">
                <strong>Mô tả:</strong> {interaction.description}
              </p>
              <p className="mb-2">
                <strong>Ảnh hưởng:</strong> {interaction.effects}
              </p>
              <p className="mb-0">
                <strong>Khuyến nghị:</strong> {interaction.recommendations}
              </p>
            </Alert>
          ))
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowInteractionModal(false)}>
          Đóng
        </Button>
        <Button variant="primary" onClick={() => setShowInteractionModal(false)}>
          Tiếp tục kê đơn
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InteractionModal;
