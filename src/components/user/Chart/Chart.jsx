import React, { useEffect, useState } from "react";
import VitalSignsChart from "../../common/VitalSignsChart";
import axios from "axios";
import { Table, Spinner, Alert, Button, Form } from 'react-bootstrap';
import { format } from 'date-fns';

const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const Chart = ({ patientId }) => {
  const [vitalSignsList, setVitalSignsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    getVitalSigns();
  }, [patientId]);

  const getVitalSigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${baseUrl}/api/vital-signs/getByPatient`,
        { patientId, ...dateRange }
      );
      if (response.data.success) {
        setVitalSignsList(response.data.data);
      } else {
        setError("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching vital signs", error);
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  const handleFilter = (e) => {
    e.preventDefault();
    getVitalSigns();
  };

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  }

  if (error) {
    return <Alert variant="danger" className="mt-3">{error}</Alert>;
  }

  return (
    <div className="container mt-4 p-0">
      
      <Form onSubmit={handleFilter} className="mb-4">
        <div className="row">
          <div className="col-md-4">
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Form.Control 
                type="date" 
                name="start" 
                value={dateRange.start} 
                onChange={handleDateChange}
              />
            </Form.Group>
          </div>
          <div className="col-md-4">
            <Form.Group>
              <Form.Label>End Date</Form.Label>
              <Form.Control 
                type="date" 
                name="end" 
                value={dateRange.end} 
                onChange={handleDateChange}
              />
            </Form.Group>
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <Button type="submit" variant="primary">Filter</Button>
          </div>
        </div>
      </Form>

      <div className="mb-5">
        <VitalSignsChart data={vitalSignsList} />
      </div>

      <Table responsive striped hover className="mt-4">
        <thead>
          <tr>
            <th>Patient Records Code</th>
            <th>Temperature (°C)</th>
            <th>Blood Pressure (mmHg)</th>
            <th>Heart Rate (bpm)</th>
            <th>Respiratory Rate (breaths/min)</th>
            <th>Oxygen Saturation (%)</th>
            <th>Measured At</th>
          </tr>
        </thead>
        <tbody>
          {vitalSignsList.length > 0 ? (
            vitalSignsList.map((item) => (
              <tr key={item.patient_records_id}>
                <td>{item.patient_records_id}</td>
                <td>{item.temperature}</td>
                <td>{item.blood_pressure}</td>
                <td>{item.heart_rate}</td>
                <td>{item.respiratory_rate}</td>
                <td>{item.oxygen_saturation}</td>
                <td>{format(new Date(item.measured_at), 'dd/MM/yyyy HH:mm')}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No data available</td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="mt-5">
        <h3>Health assessment</h3>
        <div className="border border-1">
          
        </div>
      </div>
    </div>
  );
};

export default Chart;