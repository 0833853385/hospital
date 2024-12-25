import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import bodyImg from "../../../assets/image/body.png";
import axios from "axios";
import "./Record.scss"; // Import a CSS file for custom styles

const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const PatientInfo = ({ patient }) => (
  <div className="patient-info mt-4">
    <h3 className="">Patient Information</h3>
    <div className="row mt-2">
      <div className="col-md-6">
        <p>
          <strong>Patient ID:</strong> {patient.patient_id ?? "N/A"}
        </p>
        <p>
          <strong>Full Name:</strong> {patient.full_name ?? "N/A"}
        </p>
        <p>
          <strong>Phone Number:</strong> {patient.phone_number ?? "N/A"}
        </p>
        <p>
          <strong>ID Card:</strong> {patient.cccd ?? "N/A"}
        </p>
      </div>
      <div className="col-md-6">
        <p>
          <strong>Date of Birth:</strong> {patient.date_of_birth ?? "N/A"}
        </p>
        <p>
          <strong>Gender:</strong> {patient.gender ?? "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {patient.email ?? "N/A"}
        </p>
        <p>
          <strong>Address:</strong> {patient.address ?? "N/A"}
        </p>
      </div>
    </div>
  </div>
);

const HealthIndicators = ({ indicators }) => (
  <div className="health-indicators">
    <h3 className="fw-bold">Health Indicators</h3>
    <div className="indicator-container border border-1 rounded-3 p-3">
      <button className="btn btn-primary rounded-5 float-end">Update</button>
      <div className="row">
        <div className="col-md-6">
          <div className="indicator-header d-flex">
            <p className="col-6 fw-bold">Name</p>
            <p className="col-3 fw-bold">Value</p>
            <p className="col-3 fw-bold">Unit</p>
          </div>
          <div className="indicator-list">
            {indicators.map((item, index) => (
              <div key={index} className="indicator-item d-flex">
                <span className="col-6">{item.TenChiSo}</span>
                <span className="col-3">{item.GiaTri}</span>
                <span className="col-3">{item.DonVi}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-6 text-center">
          <img src={bodyImg} alt="Body" className="img-fluid" />
        </div>
      </div>
    </div>
  </div>
);

const Record = () => {
  const [healthIndicators, setHealthIndicators] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState({});
  const [patient, setPatient] = useState({});
  const { patientId } = useParams();
  const fetchData = useCallback(async (endpoint, payload, setter) => {
    try {
      const response = await axios.post(`${baseUrl}${endpoint}`, payload);
      if (response.data.success) {
        setter(response.data.data);
      }
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
    }
  }, []);
  useEffect(() => {
    const fetchAllData = async () => {
      await fetchData(
        "/api/medical-records/getById",
        { patient_id: patientId },
        setMedicalRecords
      );
      await fetchData("/api/patient/getById", { patientId }, setPatient);
      await fetchData(
        "/api/record-indicators/getByPatient",
        { record_id: patientId },
        setHealthIndicators
      );
    };

    fetchAllData();
  }, [patientId, fetchData]);

  return (
    <div className="record-medical h-100 container">
      <div className="d-flex flex-column align-items-start mt-2 gap-4">
        <div className="medical-record-details w-100">
          <div className="d-flex gap-3 mb-4">
            <div className="fw-bold">
              <p>Medical Record Code:</p>
              <p>Created At:</p>
              <p>Updated At:</p>
            </div>
            <div>
              <p>{medicalRecords.id || "N/A"}</p>
              <p>{medicalRecords.createdAt || "N/A"}</p>
              <p>{medicalRecords.updatedAt || "N/A"}</p>
            </div>
          </div>

          <PatientInfo patient={patient} />
        </div>

        {/* <HealthIndicators indicators={healthIndicators} /> */}
      </div>
    </div>
  );
};

export default Record;
