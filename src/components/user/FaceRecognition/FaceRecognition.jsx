import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Camera, Loader2, User, Phone, CreditCard, Mail, Calendar, MapPin } from "lucide-react";

const WebcamCapture = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
  const webcamRef = useRef(null);
  const [patientInfo, setPatientInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const cap = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const image = webcamRef.current.getScreenshot();
      const res = await axios.post(`${baseUrl}/api/patient/getByFace`, {
        image,
      });
      setPatientInfo(res.data.data);
    } catch (error) {
      console.error("Error recognizing face:", error);
      setError("Cannot recognize faces. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="mb-4">Face Recognition System</h1>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-100 rounded mb-3"
              />
              <button
                className="btn btn-primary w-100"
                onClick={cap}
                disabled={isLoading}
              >
                {isLoading ? (
                  <><Loader2 className="me-2" size={20} /> Processing...</>
                ) : (
                  <><Camera className="me-2" size={20} /> Take Photo and Identify</>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          {patientInfo && (
            <div className="card">
              <div className="card-body">
                <h2 className="card-title mb-4">Patient Information</h2>
                <InfoItem icon={<User />} label="Full name" value={patientInfo.full_name} />
                <InfoItem icon={<Phone />} label="Phone number" value={patientInfo.phone_number} />
                <InfoItem icon={<CreditCard />} label="ID card" value={patientInfo.cccd} />
                <InfoItem icon={<User />} label="Gender" value={patientInfo.gender} />
                <InfoItem icon={<Mail />} label="Email" value={patientInfo.email} />
                <InfoItem icon={<Calendar />} label="Date of birth" value={patientInfo.date_of_birth} />
                <InfoItem icon={<MapPin />} label="Address" value={patientInfo.address} />
                <button 
                  className="btn btn-primary mt-4"
                  onClick={() => navigate(`/user/patients/${patientInfo.patient_id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="mb-2">
    <span className="me-2">{icon}</span>
    <strong>{label}:</strong> {value}
  </div>
);

export default WebcamCapture;