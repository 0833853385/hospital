import React, { useContext, useEffect, useState } from "react";
import DeleteConfirmation from "../../common/DeleteConfirmation";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Patients.scss";
const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const Patients = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [patientList, setPatientList] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAllPatient = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/patient/get`);
        if (response.data.success) {
          setPatientList(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching staff list", error);
      }
    };

    fetchAllPatient()
  },[]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const cccd = searchInput;
    try {
      const res = await axios.post(`${baseUrl}/api/patient/search`, { cccd });
      if (res.data.success) {
        setPatientList(res.data.data);
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error("Failed to search patient.", error);
    }
  };

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleShowModal = (staffId) => {
    setSelectedStaffId(staffId);
    setShowModal(true);
  };

  const handleHideModal = () => {
    setShowModal(false);
    setSelectedStaffId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedStaffId) {
      handleDelete(selectedStaffId);
      handleHideModal();
    }
  };

  return (
    <div className="patients w-100 d-flex flex-column">
      <div className="d-flex align-items-center justify-content-between">
        <h1 className="fw-bold m-0">Patients</h1>

        <div className="d-flex align-items-center gap-3">
          <form action="" onSubmit={handleSearch}>
            <div class="input-group d-flex  w-100 border rounded-2">
              <input
                type="search"
                className="form-control border-0"
                placeholder="Search by id number"
                aria-label="Search"
                aria-describedby="search-addon"
                value={searchInput}
                onChange={handleChange}
                required
              />
              <button
                type="submit"
                class="btn btn-secondary input-group-text border-1 w-25 d-flex justify-content-center mt-0"
                id="search-addon"
              >
                <FaSearch />
              </button>
            </div>
          </form>
          <button
            onClick={() => {
              navigate("/user/face-recognition");
            }}
            className="btn btn-primary mt-0"
          >
            Camera
          </button>
        </div>
      </div>
      <button
        onClick={() => {
          navigate("/user/add-patient");
        }}
        className="btn fw-bold mt-1 pe-0 ms-auto"
      >
        Add new patient
      </button>

      <table className="table table-hover mt-4 table-striped">
        <thead>
          <tr>
            <th scope="col">Full name</th>
            <th scope="col">Phone number</th>
            <th scope="col">CCCD</th>
            <th scope="col">Date of birth</th>
            <th scope="col">Gender</th>
            <th scope="col">Email</th>
            <th scope="col">Address</th>
            <th scope="col">Blood type</th>
          </tr>
        </thead>

        <tbody>
          {patientList.length > 0 ? (
            patientList.map(
              (item) =>
                item.status === 1 && (
                  <tr
                    className="patient-item"
                    key={item.patient_id}
                    onClick={() =>
                      navigate(`/user/patients/${item.patient_id}`)
                    }
                  >
                    <td>{item.full_name}</td>
                    <td>{item.phone_number}</td>
                    <td>{item.cccd}</td>
                    <td>{item.date_of_birth}</td>
                    <td>{item.gender}</td>
                    <td>{item.email}</td>
                    <td>{item.address}</td>
                    <td>{item.blood_type}</td>
                  </tr>
                )
            )
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                Data is empty
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <DeleteConfirmation
        showModal={showModal}
        hideModal={handleHideModal}
        confirmModal={handleConfirmDelete}
      />
    </div>
  );
};

export default Patients;
