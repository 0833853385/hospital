import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ListGroup,
  Badge,
  Modal,
} from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import "./PatientRecordsDetail.scss";
import { StoreContext } from "../../../context/StoreContext";
import { useNavigate, useParams } from "react-router-dom";
const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const initialData = {
  temperature: 65,
  blood_pressure: 65,
  heart_rate: 98,
  respiratory: 67,
  oxygen_saturation: 89,
};

const PersonalInfoItem = ({ title, value, unit, onEdit, note }) => (
  <Card className="h-100" style={{overflow: "hidden"}}>
    <Card.Body>
      <Card.Title className="d-flex justify-content-between align-items-center">
        {title}
      </Card.Title>
      <Card.Text className="display-6 ">
        {value || "N/A"} <small>{unit}</small>
      </Card.Text>
      <span className="text-secondary">{note}</span>
    </Card.Body>
  </Card>
);

const PersonalInformationContainer = ({ data, onEdit }) => {
  const personalInfo = [
    {
      title: "Temperature",
      value: data.temperature,
      unit: "°C",
      note: "36°C - 37.5°C",
    },
    {
      title: "Blood pressure",
      value: data.blood_pressure,
      unit: "mmHg",
      note: "90 mmHg - 129 mmHg/60 mmHg - 84 mmHg",
    },
    {
      title: "Heart rate",
      value: data.heart_rate,
      unit: "bpm",
      note: "60-90bpm",
    },
    {
      title: "Respiratory rate",
      value: data.respiratory_rate,
      unit: "brpm",
      note: "16brpm - 20brpm",
    },
    {
      title: "Oxygen saturation",
      value: data.oxygen_saturation,
      unit: "%",
      note: "95% - 100%",
    },

    {
      title: "Blood sugar",
      value: "N/A",
      unit: "mg/dL",
      note: "80mg/dL - 100mg/dL",
    },
  ];

  if (!data) {
    return <div>Loading personal information...</div>;
  }

  return (
    <Row xs={1} md={2} lg={3} className="g-4 ">
      {personalInfo.map((info, index) => (
        <Col key={index}>
          <PersonalInfoItem
            title={info.title}
            value={info.value}
            unit={info.unit}
            note={info.note}
            onEdit={() => onEdit(info.title.toLowerCase().replace(" ", "_"))}
          />
        </Col>
      ))}
    </Row>
  );
};

const PatientRecordsDetail = () => {
  const navigate = useNavigate();
  const { patient_records_id } = useParams();
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [newMedicine, setNewMedicine] = useState({ name: "", dosage: "" });
  const [vitalSigns, setVitalSigns] = useState({});
  const [editingVitalSign, setEditingVitalSign] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { patientRecordsDetail } = useContext(StoreContext);
  const [isLoading, setIsLoading] = useState(true);
  const handleAddMedicine = () => {
    if (newMedicine.name && newMedicine.dosage) {
      setSelectedMedicines([...selectedMedicines, newMedicine]);
      setNewMedicine({ name: "", dosage: "" });
    }
  };

  const handleRemoveMedicine = (index) => {
    const updatedMedicines = selectedMedicines.filter((_, i) => i !== index);
    setSelectedMedicines(updatedMedicines);
  };

  const handleEditMedicine = (index) => {
    const medicineToEdit = selectedMedicines[index];
    setNewMedicine(medicineToEdit);
    handleRemoveMedicine(index);
  };

  const handleEditVitalSign = (key) => {
    setEditingVitalSign(key);
    setShowModal(true);
  };

  const handleSaveVitalSign = () => {
    setShowModal(false);
    setEditingVitalSign(null);
  };

  useEffect(() => {
    const getVitalSign = async () => {
      const patient_records_id = patientRecordsDetail.patient_records_id;
      try {
        const response = await axios.post(
          `${baseUrl}/api/vital-signs/getByPatientRecords`,
          { patient_records_id }
        );
        if (response.data.success) {
          setVitalSigns(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching vital signs", error);
      }
    };

    getVitalSign();
  }, []);

  useEffect(() => {
    if (!patientRecordsDetail) {
      navigate("/patient-records");
    } else {
      setIsLoading(false);
    }
  }, [patientRecordsDetail, patient_records_id, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="patient-records-detail ">
      <Card.Title as="h1" className=" mb-4">
        Patient Records Detail
      </Card.Title>

      <Card className=" infor mb-4">
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item className="border-0">
              <strong>Code:</strong>{" "}
              {patientRecordsDetail.patient_records_id || "N/A"}
            </ListGroup.Item>
            <ListGroup.Item className="border-0">
              <strong>Patient:</strong>{" "}
              {patientRecordsDetail.patient?.full_name || "N/A"}
            </ListGroup.Item>
            <ListGroup.Item className="border-0">
              <strong>Doctor:</strong>{" "}
              {patientRecordsDetail.staff?.full_name || "N/A"}
            </ListGroup.Item>
            <ListGroup.Item className="border-0">
              <strong>Department:</strong>{" "}
              {patientRecordsDetail.department?.name || "N/A"}
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      <Card className="mb-4 vital-sign">
        <Card.Body>
          <Card.Title as="h3">Vital Signs</Card.Title>
          <div className="mt-3">
            <p>
              <strong>Measured at:</strong> {vitalSigns.measured_at || "N/A"}
            </p>
            <p>
              <strong>Measured by:</strong>{" "}
              {vitalSigns.staff?.full_name || "N/A"}
            </p>
          </div>
          <PersonalInformationContainer
            data={vitalSigns}
            onEdit={handleEditVitalSign}
          />
        </Card.Body>
      </Card>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Symptoms</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder={patientRecordsDetail.symptoms}
              disabled
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Diagnosis</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder={patientRecordsDetail.diagnosis}
              disabled
            />
          </Form.Group>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title as="h4" className="mb-3">
            Prescription And Dosage
          </Card.Title>
          <p>Medicin 1: Morning - Noon - Evening / 1 pill</p>
          <p>Medicin 2: Morning - Evening / 2 pill</p>
          <p>Medicin 3: Morning - Noon - Evening / 1 pill</p>
          <button className="btn btn-secondary float-end">View detail</button>
        </Card.Body>

      </Card>

      <div className="d-flex justify-content-end gap-3 mb-5">
        <Button variant="primary">Save Record</Button>
        <Button variant="secondary">PDF Export</Button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit {editingVitalSign}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="number"
            value={vitalSigns[editingVitalSign]}
            onChange={(e) =>
              setVitalSigns({
                ...vitalSigns,
                [editingVitalSign]: e.target.value,
              })
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveVitalSign}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PatientRecordsDetail;
