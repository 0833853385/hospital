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
  Alert
} from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { StoreContext } from "../../../context/StoreContext";
import { useNavigate, useParams } from "react-router-dom";

const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const initialData = {
  temperature: 0,
  blood_pressure: 0,
  heart_rate: 0,
  respiratory: 0,
  oxygen_saturation: 0,
};

const vitalSignRanges = {
  temperature: { min: 36, max: 37.5, unit: "°C" },
  blood_pressure: { min: 90, max: 120, unit: "mmHg" },
  heart_rate: { min: 60, max: 100, unit: "bpm" },
  respiratory_rate: { min: 12, max: 20, unit: "brpm" },
  oxygen_saturation: { min: 95, max: 100, unit: "%" },
};

const PersonalInfoItem = ({ title, value, unit, onEdit, note, warning, range }) => {
  const isOutOfRange = () => {
    if (!range || value === null || value === undefined) return false;
    const numValue = parseFloat(value);
    return numValue < range.min || numValue > range.max;
  };

  const getAlertVariant = () => {
    if (!range || value === null || value === undefined) return "warning";
    const numValue = parseFloat(value);
    if (numValue < range.min) return "danger";
    if (numValue > range.max) return "danger";
    return "success";
  };

  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-center">
          {title}
          <FaEdit className="cursor-pointer" onClick={onEdit} />
        </Card.Title>
        <Card.Text className="display-6">
          {value || "N/A"} <small>{unit}</small>
        </Card.Text>
        <span className="text-secondary">{note}</span>
        {isOutOfRange() && (
          <Alert variant={getAlertVariant()} className="mt-2">
            {warning}
            {setSymptoms(warning)}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

const PersonalInformationContainer = ({ data, onEdit }) => {
  const personalInfo = [
    {
      title: "Nhiệt độ",
      value: data.temperature,
      unit: "°C",
      note: "36°C - 37.5°C",
      key: "temperature"
    },
    {
      title: "Huyết áp",
      value: data.blood_pressure,
      unit: "mmHg",
      note: "90 mmHg - 120 mmHg",
      key: "blood_pressure"
    },
    {
      title: "Nhịp tim",
      value: data.heart_rate,
      unit: "nhịp/phút",
      note: "60-100 nhịp/phút",
      key: "heart_rate"
    },
    {
      title: "Nhịp thở",
      value: data.respiratory_rate,
      unit: "nhịp/phút",
      note: "12-20 nhịp/phút",
      key: "respiratory_rate"
    },
    {
      title: "Độ bão hòa oxy",
      value: data.oxygen_saturation,
      unit: "%",
      note: "95% - 100%",
      key: "oxygen_saturation"
    },
  ];

  const getWarning = (key, value) => {
    const range = vitalSignRanges[key];
    if (!range) return null;
    
    if (value < range.min) {
      return `Giá trị thấp hơn mức bình thường (${range.min} - ${range.max} ${range.unit})`;
    } else if (value > range.max) {
      return `Giá trị cao hơn mức bình thường (${range.min} - ${range.max} ${range.unit})`;
    }
    return null;
  };

  if (!data) {
    return <div>Đang tải thông tin cá nhân...</div>;
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
            onEdit={() => onEdit(info.key)}
            warning={getWarning(info.key, info.value)}
            range={vitalSignRanges[info.key]}
          />
        </Col>
      ))}
    </Row>
  );
};

const Cure = () => {
  const navigate = useNavigate();
  const { patientRecordsId } = useParams();
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [newMedicine, setNewMedicine] = useState({ name: "", dosage: "" });
  const [vitalSigns, setVitalSigns] = useState(initialData);
  const [editingVitalSign, setEditingVitalSign] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { patientRecordsDetail } = useContext(StoreContext);
  const [isLoading, setIsLoading] = useState(true);
  const [updateState, setUpdateState] = useState(false);
  const [symptoms, setSymptoms] = useState(patientRecordsDetail.symptoms || "");
  const [diagnosis, setDiagnosis] = useState(patientRecordsDetail.diagnosis || "");
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

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
    const newValue = parseFloat(vitalSigns[editingVitalSign]);
    setVitalSigns({
      ...vitalSigns,
      [editingVitalSign]: newValue,
    });
    setUpdateState(true);
    setShowModal(false);
    setEditingVitalSign(null);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${baseUrl}/api/vital-signs/edit`, {
        patient_records_id: patientRecordsId,
        vital_signs: vitalSigns,
      });
      if (response.data.success) {
        setAlertVariant("success");
        setAlertMessage("Vital signs updated successfully");
        setShowAlert(true);
        setUpdateState(false);
      }
    } catch (error) {
      console.error("Error updating vital signs", error);
      setAlertVariant("danger");
      setAlertMessage("Error updating vital signs");
      setShowAlert(true);
    }
  };

  const handleComplete = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/patient-records/update`,
        {
          patient_records_id: patientRecordsId,
          symptoms: symptoms,
          diagnosis: diagnosis,
        }
      );
      if (response.data.success) {
        setAlertVariant("success");
        setAlertMessage("Patient record updated successfully");
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error updating patient record", error);
      setAlertVariant("danger");
      setAlertMessage("Error updating patient record");
      setShowAlert(true);
    }
  };

  useEffect(() => {
    const getVitalSign = async () => {
      const patient_records_id = patientRecordsId;
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
      } finally {
        setIsLoading(false);
      }
    };

    getVitalSign();
  }, [patientRecordsId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="patient-records-detail pb-4">
      {showAlert && (
        <Alert 
          variant={alertVariant} 
          onClose={() => setShowAlert(false)} 
          dismissible
          className="mt-3"
        >
          {alertMessage}
        </Alert>
      )}

      <Card.Title as="h1" className="mb-4">
        Patient Records Detail
      </Card.Title>

      <Card className="infor mb-4">
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item className="border-0">
              <strong>Code:</strong> {patientRecordsDetail.patient_records_id || "N/A"}
            </ListGroup.Item>
            <ListGroup.Item className="border-0">
              <strong>Patient:</strong> {patientRecordsDetail.patient?.full_name || "N/A"}
            </ListGroup.Item>
            <ListGroup.Item className="border-0">
              <strong>Create by:</strong> {patientRecordsDetail.staff?.full_name || "N/A"}
            </ListGroup.Item>
            <ListGroup.Item className="border-0">
              <strong>Department:</strong> {patientRecordsDetail.department?.name || "N/A"}
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      <Card className="mb-4 vital-sign">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Card.Title as="h3">Vital Signs</Card.Title>
            <button
              className="btn btn-success m-0"
              disabled={!updateState}
              onClick={handleSubmit}
            >
              Save
            </button>
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
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder={patientRecordsDetail.symptoms}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Diagnosis</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder={patientRecordsDetail.diagnosis}
            />
          </Form.Group>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title as="h4" className="mb-3">
            Medical Service
          </Card.Title>
          <Row>
            <Col className="d-flex gap-3">
              <Form.Select
                value={newMedicine.name}
                onChange={(e) =>
                  setNewMedicine({ ...newMedicine, name: e.target.value })
                }
              >
                <option value="">Lab tests</option>
                <option value="Pandon">Pandon</option>
                <option value="Medicine 1">Medicine 1</option>
                <option value="Medicine 2">Medicine 2</option>
                <option value="Medicine 3">Medicine 3</option>
              </Form.Select>

              <Form.Select
                value={newMedicine.name}
                onChange={(e) =>
                  setNewMedicine({ ...newMedicine, name: e.target.value })
                }
              >
                <option value="">Imaging tests</option>
                <option value="Medicine 1">Medicine 1</option>
                <option value="Medicine 2">Medicine 2</option>
                <option value="Medicine 3">Medicine 3</option>
              </Form.Select>
            </Col>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Designated Service</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mt-3">
            <Form.Group className="mb-3">
              <Form.Label>Result</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Row>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title as="h4" className="mb-3">
            Medical Examination Process
          </Card.Title>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Select
                value={newMedicine.name}
                onChange={(e) =>
                  setNewMedicine({ ...newMedicine, name: e.target.value })
                }
              >
                <option value="">Select Medicine</option>
                <option value="Medicine 1">Medicine 1</option>
                <option value="Medicine 2">Medicine 2</option>
                <option value="Medicine 3">Medicine 3</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Dosage"
                value={newMedicine.dosage}
                onChange={(e) =>
                  setNewMedicine({ ...newMedicine, dosage: e.target.value })
                }
              />
            </Col>
            <Col md={2}>
              <Button
                className="m-0 w-100"
                variant="primary"
                onClick={handleAddMedicine}
              >
                Add
              </Button>
            </Col>
          </Row>
          <Card>
            <Card.Body>
              <Card.Title>Selected Medicines</Card.Title>
              <ListGroup>
                {selectedMedicines.map((medicine, index) => (
                  <ListGroup.Item
                    key={index}
                    className="d-flex justify-content-between align-items-center"
                  >
                    {medicine.name} - {medicine.dosage}
                    <div>
                      <Badge
                        bg="warning"
                        className="me-2"
                        pill
                        onClick={() => handleEditMedicine(index)}
                        style={{ cursor: "pointer" }}
                      >
                        Edit
                      </Badge>
                      <Badge
                        bg="danger"
                        pill
                        onClick={() => handleRemoveMedicine(index)}
                        style={{ cursor: "pointer" }}
                      >
                        X
                      </Badge>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>

      <h3>Follow-up appointment</h3>
      <button className="btn btn-success mb-5">Create an appoinment</button>

      <h3>Treatment plan</h3>
      <button className="btn btn-success">Create treatment plan</button>

      <div className="d-flex justify-content-end gap-3 mb-5">
        <Button variant="secondary">PDF Export</Button>
        <Button variant="primary">Save Record</Button>
        <Button variant="success" onClick={handleComplete}>
          Complete
        </Button>
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
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Cure;
