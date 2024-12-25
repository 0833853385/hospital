import React, { useState, useEffect, useCallback, useContext } from "react";
import Modal from "react-modal";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./PatientRecords.scss";
import moment from 'moment';
import 'moment/locale/vi';
import { StoreContext } from "../../../context/StoreContext";
const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const PatientRecords = () => {
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [note, setNote] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const { patientId } = useParams();
  const staffId = localStorage.getItem("staffId");
  const [patientRecordsList, setPatientRecordsList] = useState([]);
  const { setPatientRecordsDetail } = useContext(StoreContext);
  const { updatePatientRecordsDetail } = useContext(StoreContext);

  const getDepartments = useCallback(async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/departments/get`);
      if (response.data.success) {
        setDepartmentList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching department list", error);
    }
  }, []);

  useEffect(() => {
    getDepartments();
    getPatientRecords();
  }, [patientId, reloadTrigger, getDepartments]);

  const reloadData = () => {
    setReloadTrigger((prev) => prev + 1);
  };

  const getPatientRecords = useCallback(async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/patient-records/getByPatient`,
        { patientId }
      );
      if (response.data.success) {
        setPatientRecordsList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching patient records list", error);
    }
  }, [patientId]);

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
      maxWidth: "500px",
      width: "100%",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  const addVitalsign = async (patient_records_id) => {
    try {
      console.log(patientId)

      await axios.post(`${baseUrl}/api/vital-signs/add`, {
        patient_records_id,
        patientId,
      });

    } catch (error) {
      console.error("Error add patient records", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/api/patient-records/add`, {
        patientId,
        staffId,
        note,
        departmentId,
      });

      if (response.data.success) {
        addVitalsign(response.data.data.patient_records_id);
        console.log(response.data.data.patient_records_id)
        setIsOpen(false);
        alert(response.data.message);
        setNote("");
        setDepartmentId;
        reloadData();
      }
    } catch (error) {
      console.error("Error add patient records", error);
    }
  };
  return (
    <div className="patient-records w-100 d-flex flex-column">
      <div className="in-preogress rounded-3 mb-5">
        {patientRecordsList.length > 0 ? (
          patientRecordsList.map(
            (item) =>
              item.status === "In progress" && (
                <h5
                  className="patient-item m-0 p-3 fw-bold text-success"
                  key={item.patient_records_id}
                  onClick={() => {
                    updatePatientRecordsDetail(item);
                    setPatientRecordsDetail(item);
                    navigate(`/user/cure/${item.patient_records_id}`);
                  }}
                >
                  In Progress
                </h5>
              )
          )
        ) : (
          <tr>
            <td colSpan="9" className="text-center">
              Not found patinet records
            </td>
          </tr>
        )}
      </div>
      <button
        onClick={() => setIsOpen(true)}
        className="btn fw-bold btn-primary ms-auto"
      >
        Create new
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        style={customStyles}
        contentLabel="Create new patient record"
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="m-0 fw-bold">Create New Patient Record</h5>
          <button
            onClick={() => {
              setIsOpen(false);
            }}
            className="btn btn-close"
            aria-label="Close"
          ></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="department" className="form-label fw-bold">
              Department
            </label>
            <select
              id="department"
              className="form-select"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              required
            >
              <option value="">Select a department</option>
              {departmentList.map((item) => (
                <option key={item.department_id} value={item.department_id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="note" className="form-label fw-bold">
              Note
            </label>
            <input
              type="text"
              id="note"
              className="form-control"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter a note"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Create
          </button>
        </form>
      </Modal>
      <h3 className="m-0">Completed</h3>
      <table className="table table-hover mt-4 ">
        <thead>
          <tr>
            <th scope="col">Code</th>
            <th scope="col">Doctor</th>
            <th scope="col">Department</th>
            <th scope="col">Total amount</th>
            <th scope="col">Status</th>
            <th scope="col">Create at</th>
          </tr>
        </thead>

        <tbody>
          {patientRecordsList.length > 0 ? (
            patientRecordsList.map(
              (item) =>
                item.status === "Completed" && (
                  <tr
                    className="patient-item"
                    key={item.patient_records_id}
                    onClick={() => {
                      updatePatientRecordsDetail(item);
                      setPatientRecordsDetail(item);
                      navigate(
                        `/user/patient-records-detail/${item.patient_records_id}`
                      );
                    }}
                  >
                    <td>{item.patient_records_id}</td>
                    <td>{item.staff.full_name}</td>
                    <td>{item.department.name}</td>
                    <td>
                      {item.bill && item.bill.total_amount
                        ? item.bill.total_amount
                        : "N/A"}
                    </td>
                    <td>{item.status}</td>
                    <td>{moment(item.createdAt).format('LL')}</td>
                  </tr>
                )
            )
          ) : (
            <tr>
              <td colSpan="9" className="text-center">
                Not found patinet records
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PatientRecords;
