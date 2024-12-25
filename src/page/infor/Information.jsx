import React, { useState, useEffect } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import logo from "../assets/image/logo-new.png";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const PersonalInfoItem = ({ title, value }) => (
  <div className="card">
    <div className="card-body">
      <h5 className="card-title">{title}</h5>
      <p className="card-text">{value}</p>
    </div>
  </div>
);

const PersonalInformationContainer = ({ user }) => {
  const personalInfo = [
    { title: "Full name", value: user.full_name },
    { title: "Birth", value: user.date_of_birth },
    { title: "Gender", value: user.gender },
    { title: "Address", value: user.address },
    { title: "Phone number", value: user.phone_number },
    { title: "Email", value: user.email },
    { title: "Position", value: user.position },
    { title: "Date join", value: user.date_joined },
  ];
  if (!user) {
    return <div>Loading personal information...</div>;
  }
  return (
    <div className="row g-4">
      {personalInfo.map((info, index) => (
        <div className="col-md-6 ps-0 mt-3" key={index}>
          <PersonalInfoItem title={info.title} value={info.value} />
        </div>
      ))}
    </div>
  );
};

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

const Information = () => {
  const [sidebarSelect, setSidebarSelect] = useState("Personal information");
  const [personalInformation, setPersonalInformation] = useState({});

  const sidebarItems = [
    "Personal information",
    "Appointment",
    "Schedules",
    "Notifications",
  ];

  const Container = ({ sidebarSelect, personalInformation }) => {
    const renderContent = () => {
      switch (sidebarSelect) {
        case "Personal information":
          return <PersonalInformationContainer user={personalInformation} />;
        case "Appointment":
          return <HealthIndicatorContainer />;
        case "Patient records":
          return <PatientRecords />;
        case "Appointments":
          return <Appointments />;
        case "Medical records":
          return <Record />;
        default:
          return <PersonalInformationContainer user={personalInformation} />;
      }
    };

    return <div className="container ps-0">{renderContent()}</div>;
  };
  const staffId = localStorage.getItem("staffId");
  console.log({staffId})

  useEffect(() => {
    const getStaffById = async () => {
      try {
        const response = await axios.post(`${baseUrl}/api/staff/getById`, {
          staffId
        });
        if (response.data.success) {
          setPersonalInformation(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    getStaffById();
  }, [staffId]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="w-75">
          <img src={logo} alt="Logo" className="w-25" />
        </div>
        <button className="btn btn-primary">
          <FaSignOutAlt className="me-2" />
          Log out
        </button>
      </div>
      <hr />

      <div className="row mt-5">
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
    </div>
  );
};

export default Information;
