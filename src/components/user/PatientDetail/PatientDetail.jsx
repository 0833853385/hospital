import React, { useContext, useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { MdEdit } from "react-icons/md";

import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";
import axios from "axios";
import PatientRecords from "../PatientRecords/PatientRecords";
import Appointments from "../Appointments/Appointments";
import Record from "../Record/Record";
import Chart from "../Chart/Chart";
import EditPatient from "../EditPatient/EditPatient.jsx";
import { StoreContext } from "../../../context/StoreContext.jsx";
import PatientAppointment from "../PatientAppointment/PatientAppointment.jsx";
import ImagingTest from "../ImagingTest/ImagingTest.jsx";
import LabTest from "../LabTest/LabTest.jsx";
import VitalSigns from "../VitalSigns/VitalSigns.jsx";
const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";


const PersonalInformationContainer = ({ user, setSidebarSelect }) => {
  const personalInfo = [
    { title: "Full name", value: user.full_name },
    { title: "Birth", value: user.date_of_birth },
    { title: "Gender", value: user.gender },
    { title: "Address", value: user.address },
    { title: "Phone number", value: user.phone_number },
    { title: "CCCD", value: user.cccd },
    { title: "Email", value: user.email },
    { title: "Emergency contact name", value: user.emergency_contact_name },
    { title: "Emergency contact phone", value: user.emergency_contact_phone },
    { title: "Blood type", value: user.blood_type },
  ];
  if (!user) {
    return <div>Loading personal information...</div>;
  }
  return (
    <div className="row g-4 d-flex">
      <div
        onClick={() => setSidebarSelect("Edit patient")}
        className="d-flex justify-content-end"
      >
        <MdEdit size={24} />
      </div>
      {personalInfo.map((info, index) => (
        <div className="col-md-6 ps-0 mt-3" key={index}>
          <PersonalInfoItem title={info.title} value={info.value} />
        </div>
      ))}
    </div>
  );
};
const PersonalInfoItem = ({ title, value }) => (
  <div className="card">
    <div className="card-body">
      <h5 className="card-title">{title}</h5>
      <p className="card-text">{value || "N/A"}</p>
    </div>
  </div>
);

const SidebarItem = ({ children, isSelected, onClick }) => (
  <li
    onClick={onClick}
    className={`list-group-item border-0 ps-0 ${
      isSelected ? "text-primary" : ""
    }`}
    style={{ cursor: "pointer" }}
  >
    <span
      className={`text-decoration-none ${
        isSelected ? "text-primary" : "text-body"
      }`}
    >
      {children}
    </span>
  </li>
);

const PatientDetail = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [personalInformation, setPersonalInformation] = useState({});
  const {setPatientDetail} = useContext(StoreContext)
  const [sidebarSelect, setSidebarSelect] = useState("Personal information");
  const [modalIsOpen, setIsOpen] = useState(false);
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
      padding: "30px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  useEffect(() => {
    const getPatientById = async () => {
      try {
        const response = await axios.post(`${baseUrl}/api/patient/getById`, {
          patientId,
        });
        if (response.data.success) {
          setPersonalInformation(response.data.data);
          setPatientDetail(response.data.data)
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    getPatientById();
  }, [patientId]);

  const sidebarItems = [
    "Personal information",
    "Appointments",
    "Patient records",
    "Vital signs chart",
    "Medical records",
    "Vital signs",
    "Imaging tests",
    "Lab tests",
  ];

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete patient?"
    );
    if (confirmed) {
      try {
        const res = await axios.post(`${baseUrl}/api/patient/delete`, {
          patientId,
        });
        if (res.data.success) {
          alert(res.data.message);
          navigate("/user/patients");
        }
      } catch (error) {
        alert(error);
      }
    }
  };

  const Container = ({ sidebarSelect, personalInformation }) => {
    const renderContent = () => {
      switch (sidebarSelect) {
        case "Personal information":
          return (
            <PersonalInformationContainer
              user={personalInformation}
              setSidebarSelect={setSidebarSelect}
            />
          );
        case "Edit patient":
          return <EditPatient />;
        case "Patient records":
          return <PatientRecords />;
        case "Appointments":
          return <PatientAppointment />;
        case "Medical records":
          return <Record />;
        case "Vital signs chart":
          return <Chart patientId={patientId} />;
        case "Vital signs":
          return <VitalSigns/>;
        case "Lab tests":
          return <LabTest />;
        case "Imaging tests":
          return <ImagingTest/>;
        default:
          return <PersonalInformationContainer user={personalInformation} />;
      }
    };

    return <div className="container ps-0">{renderContent()}</div>;
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3">
          <div className="mb-4">
            <FaUserCircle size={64} className="text-secondary mb-3" />
            <h3>{personalInformation.full_name}</h3>
            <span className="text-muted">{personalInformation.email}</span>
          </div>

          <ul className="list-group list-group-flush">
            {sidebarItems.map((item, index) => (
              <SidebarItem
                key={index}
                isSelected={sidebarSelect === item}
                onClick={() => setSidebarSelect(item)}
              >
                {item}
              </SidebarItem>
            ))}
            <li
              onClick={handleDelete}
              style={{ cursor: "pointer", listStyle: "none" }}
              className="text-danger"
            >
              Delete
            </li>
          </ul>
        </div>

        <div className="col-md-9">
          <h1 className="mb-3">{sidebarSelect}</h1>
          <p className="text-muted mb-4">
            Manage your personal information, including phone numbers and email
            addresses that we may use to contact you.
          </p>
          <div className="container p-0">
            <Container
              sidebarSelect={sidebarSelect}
              personalInformation={personalInformation}
            />
          </div>
        </div>
      </div>

      <ToastContainer />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        style={customStyles}
        contentLabel="Take Photo"
      >
        <div className="text-center">
          <button
            className="btn btn-close float-end"
            onClick={() => setIsOpen(false)}
          ></button>
          <h2 className="mb-4">Take a Photo</h2>
        </div>
      </Modal>
    </div>
  );
};

export default PatientDetail;
