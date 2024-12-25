import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { StoreContext } from "../../../context/StoreContext";
import { useNavigate, useParams } from "react-router-dom";
import moment from 'moment';
import 'moment/locale/vi';
const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const PersonalInfoItem = ({ title, value, unit, onEdit, note }) => (
  <Card className="h-100 ">
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
  const [vitalSigns, setVitalSigns] = useState({});
  const { patientRecordsDetail } = useContext(StoreContext);
  const patient_id = useParams();
  useEffect(() => {
    const getVitalSign = async () => {
      console.log(patient_id);

      try {
        const response = await axios.post(
          `${baseUrl}/api/vital-signs/getByDate`,
          patient_id
        );
        if (response.data.success) {
          console.log(vitalSigns);
          setVitalSigns(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching vital signs", error);
      }
    };

    getVitalSign();
  }, []);

  return (
    <Container className="vital-sign p-0">
      <Card className="mb-4 vital-sign-card border-0">
        <Card.Body className="p-0">
          <div className="mt-3">
            <p>
              <strong>Measured at:</strong> {moment(vitalSigns?.measured_at).format('LL')}
            </p>
            <p>
              <strong>Measured by:</strong>{" "}
              {vitalSigns?.staff?.full_name || "N/A"}
            </p>
          </div>
          <PersonalInformationContainer data={vitalSigns} />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PatientRecordsDetail;
