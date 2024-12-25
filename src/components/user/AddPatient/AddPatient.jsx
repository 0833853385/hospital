import React, { useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Webcam from "react-webcam";
import Modal from "react-modal";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./AddPatient.scss";
const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    border: "none",
    borderRadius: "15px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

const AddPatient = () => {
  const navigate = useNavigate()
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [modalIsOpen, setIsOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    full_name: "",
    phone_number: "",
    cccd: "",
    date_of_birth: null,
    avatar: "C:\Users\vqdin\OneDrive\Pictures\Camera Roll\WIN_20240721_23_29_16_Pro.jpg",
    gender: "Male",
    email: "",
    address: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    blood_type: "",
  });
  const webcamRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const addRes = await axios.post(`${baseUrl}/api/patient/add`, 
        formValues,
      );
      
      if (addRes.data.success) {        
        setPatientId(addRes.data.patientId)
        setIsDisabled(false)
        const patientId = addRes.data.patientId;
        const addMedicalRecordRes = await axios.post(`${baseUrl}/api/medical-records/add`, {patientId});
        if (addMedicalRecordRes.data.success) {
        alert("Patient and medical record added successfully!");
        setFormValues({
          full_name: "",
          phone_number: "",
          cccd: "",
          date_of_birth: null,
          avatar: "C:\Users\vqdin\OneDrive\Pictures\Camera Roll\WIN_20240721_23_29_16_Pro.jpg",
          gender: "Male",
          email: "",
          address: "",
          emergency_contact_name: "",
          emergency_contact_phone: "",
          blood_type: "",
        })
        } else {
          alert("Failed to add medical record. Please try again.");
        }
      } else {
        alert("Failed to add patient. Please try again.");
      }
    } catch (error) {
      alert(
        'Patient is exited'
        // error.response?.data?.error ||
        //   "Failed to add patient. Please try again later."
      );
    }
  };

  const cap = async () => {
    setIsLoading(true);
    try {
      const image = webcamRef.current.getScreenshot();
      alert("Successful identification")
      setIsOpen(false)

    } catch (error) {
      console.error("Error recognizing face:", error);
      toast.error("Không thể nhận diện khuôn mặt. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormFields = () => (
    <>
      <div className="col-md-6 mb-3">
        <label htmlFor="email" className="form-label">
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6 mb-3">
        <label htmlFor="email" className="form-label">
          Id card
        </label>
        <input
          type="text"
          className="form-control"
          id="cccd"
          name="cccd"
          value={formValues.cccd}
          onChange={handleChange}
          required
        />
      </div>

      <div className="col-md-3 mb-3">
        <label htmlFor="gender" className="form-label">
          Gender
        </label>
        <select
          className="form-select"
          id="gender"
          name="gender"
          value={formValues.gender}
          onChange={handleChange}
        >
          <option>Male</option>
          <option>Female</option>
        </select>
      </div>

      <div className="col-md-6 mb-3">
        <label htmlFor="fullName" className="form-label">
          Full name
        </label>
        <input
          type="text"
          className="form-control"
          id="fullName"
          name="full_name"
          value={formValues.full_name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="col-md-6 mb-3">
        <label htmlFor="phone" className="form-label">
          Phone number
        </label>
        <input
          type="text"
          className="form-control"
          id="phone"
          name="phone_number"
          value={formValues.phone_number}
          onChange={handleChange}
        />
      </div>

      <div className="col-12 mb-3">
        <label htmlFor="address" className="form-label">
          Address
        </label>
        <input
          type="text"
          className="form-control"
          id="address"
          name="address"
          value={formValues.address}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6 mb-3">
        <label htmlFor="dateOfBirth" className="form-label">
          Date of birth
        </label>
        <input
          type="date"
          className="form-control"
          id="dateOfBirth"
          name="date_of_birth"
          value={formValues.date_of_birth}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6 mb-3">
        <label htmlFor="emergencyContactName" className="form-label">
          Emergency Contact Name
        </label>
        <input
          type="text"
          className="form-control"
          id="emergencyContactName"
          name="emergency_contact_name"
          value={formValues.emergency_contact_name}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6 mb-3">
        <label htmlFor="emergencyContactPhone" className="form-label">
          Emergency Contact Phone
        </label>
        <input
          type="text"
          className="form-control"
          id="emergencyContactPhone"
          name="emergency_contact_phone"
          value={formValues.emergency_contact_phone}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6 mb-3">
        <label htmlFor="bloodType" className="form-label">
          Blood Type
        </label>
        <input
          type="text"
          className="form-control"
          id="bloodType"
          name="blood_type"
          value={formValues.blood_type}
          onChange={handleChange}
        />
      </div>
    </>
  );

  return (
    <div className="container ">
      <div className="add-patient card rounded-4 p-3">
        <div className="card-body d-flex flex-column">
          <h1 className="card-title text-center mb-4 me-auto">Add Patient</h1>
          <form onSubmit={handleSubmit} className="row g-3 needs-validation">
            <div className="col-md-3 mb-4 text-center d-flex flex-column align-items-center gap-3">
              <FaUserCircle size={150} className="text-secondary" />
              <button
                onClick={() => setIsOpen(true)}
                className="btn btn-outline-secondary w-75"
                type="button"
              >
                Take Photo
              </button>
            </div>

            <div className="col-md-9">
              <div className="row">{renderFormFields()}</div>
            </div>

            <div className="col-12 text-center mt-4 d-flex gap-3 justify-content-end">
              <button className="btn btn-primary " type="submit">
                Add new patient
              </button>
              <button onClick={()=>navigate(`/user/patients/${patientId}`)} className="btn btn-secondary" type="button" disabled={isDisabled} >View detail</button>
              {console.log(isDisabled)}
            </div>
          </form>
        </div>
      </div>

      <ToastContainer />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        style={customStyles}
        contentLabel="Take Photo"
      >
        <div className="d-flex flex-column align-items-center text-center">
          <div className="d-flex align-items-center justify-content-between w-100">
            <h5>Take a photo</h5>
            <button
              className="btn btn-close mb-2"
              onClick={() => setIsOpen(false)}
            ></button>
          </div>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="img-fluid rounded w-100"
          />
          <button
            className="btn btn-primary px-4 py-2 mt-3"
            onClick={cap}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Capture and Identify"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AddPatient;