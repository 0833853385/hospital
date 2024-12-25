import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, TimePicker } from 'react-bootstrap';

const MedicationScheduleForm = ({ prescription, onSubmit }) => {
  const [scheduleData, setScheduleData] = useState({
    medications: prescription.medications.map(med => ({
      ...med,
      times: [],
      reminders: true
    }))
  });

  const handleTimeChange = (medIndex, timeIndex, value) => {
    const newMedications = [...scheduleData.medications];
    newMedications[medIndex].times[timeIndex] = value;
    setScheduleData({ ...scheduleData, medications: newMedications });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await MedicationScheduleService.createSchedule({
        prescriptionId: prescription.id,
        medications: scheduleData.medications,
        startDate: new Date()
      });

      if (response.success) {
        onSubmit(response.data);
      } else {
        toast.error('Failed to create medication schedule');
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
      toast.error('An error occurred while creating the schedule');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h4 className="mb-4">Tạo lịch uống thuốc</h4>
      
      {scheduleData.medications.map((med, medIndex) => (
        <Card key={medIndex} className="mb-3">
          <Card.Body>
            <h5>{med.name}</h5>
            <p className="text-muted">
              {med.dosage} - {med.frequency} lần/ngày
            </p>
            
            <Row className="mb-3">
              {[...Array(med.frequency)].map((_, timeIndex) => (
                <Col key={timeIndex} md={4}>
                  <Form.Group>
                    <Form.Label>Lần {timeIndex + 1}</Form.Label>
                    <TimePicker
                      value={med.times[timeIndex]}
                      onChange={(value) => handleTimeChange(medIndex, timeIndex, value)}
                      format="HH:mm"
                      required
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>

            <Form.Check
              type="switch"
              label="Bật nhắc nhở"
              checked={med.reminders}
              onChange={(e) => {
                const newMedications = [...scheduleData.medications];
                newMedications[medIndex].reminders = e.target.checked;
                setScheduleData({ ...scheduleData, medications: newMedications });
              }}
            />
          </Card.Body>
        </Card>
      ))}

      <div className="d-flex justify-content-end">
        <Button type="submit" variant="primary">
          Tạo lịch uống thuốc
        </Button>
      </div>
    </Form>
  );
};

export default MedicationScheduleForm;