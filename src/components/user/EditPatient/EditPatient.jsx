import React, { useContext, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

import axios from "axios";
import { StoreContext } from "../../../context/StoreContext";

const EditPatient = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
  const {patientDetail} = useContext(StoreContext)
  console.log(patientDetail)
  const [formValues, setFormValues] = useState({
    patientId: patientDetail.patient_id,
    email: patientDetail.email,
    phone: patientDetail.phone_number,
    fullName: patientDetail.full_name,
    gender: patientDetail.gender,
    dateOfBirth: patientDetail.date_of_birth,
    address: patientDetail.address,
    cccd: patientDetail.cccd,
    avtFile: patientDetail.avatar,
    emergency_contact_name: patientDetail.emergency_contact_name,
    emergency_contact_phone: patientDetail.emergency_contact_phone,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const addRes = await axios.post(`${baseUrl}/api/patient/edit`, formValues);
      if (addRes.data.success) {
        toast.success(addRes.data.data);
      }
    } catch (error) {
      console.error("Error updating patient:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to update patient. Please try again later.");
      }
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className="row g-4 mt-3">
        <div className="col ">
          <div className="d-flex col-md-4  align-items-center">
            <input
              type="file"
              className="form-control me-3"
              name="avtFile"
              onChange={handleChange}
            />
            <FaCamera size={24} />
          </div>

          <div className="row g-3 mt-2">
            <div className="col-md-6">
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
                required
              />
            </div>

            <div className="col-md-3">
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

            <div className="col-md-3">
              <label htmlFor="cccd" className="form-label">
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

            <div className="col-md-6">
              <label htmlFor="fullName" className="form-label">
                Full name
              </label>
              <input
                type="text"
                className="form-control"
                id="fullName"
                name="fullName"
                value={formValues.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="phone" className="form-label">
                Phone number
              </label>
              <input
                type="text"
                className="form-control"
                id="phone"
                name="phone"
                value={formValues.phone}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
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

            <div className="col-md-3">
              <label htmlFor="dateOfBirth" className="form-label">
                Date of birth
              </label>
              <input
                type="date"
                className="form-control"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formValues.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div className="col-3">
              <label htmlFor="address" className="form-label">
                Emergency contact phone
              </label>
              <input
                type="text"
                className="form-control"
                id="emergencyPhone"
                name="emergency_contact_phone"
                value={formValues.emergency_contact_phone}
                onChange={handleChange}
              />
            </div>
            <div className="col-6">
              <label htmlFor="address" className="form-label">
                Emergency contact name
              </label>
              <input
                type="text"
                className="form-control"
                id="emergencyName"
                name="emergency_contact_name"
                value={formValues.emergency_contact_name}
                onChange={handleChange}
              />
            </div>
            <div className="col-12 mt-4">
              <button
                className="btn btn-primary float-end fw-bold"
                type="submit"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
      <ToastContainer />

    </div>
  );
};

export default EditPatient;
