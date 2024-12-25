import React, { useState, useEffect } from "react";
import {useParams} from 'react-router-dom'
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import moment from 'moment';
import 'moment/locale/vi'; 
const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const PatientAppointment = () => {
  const [searchInput, setSearchInput] = useState("");
  const [appointmentList, setAppoinmentList] = useState([]);
    const patient_id  = useParams()
    console.log('patient_id',patient_id)
  const handleChange = (e) => {
    setSearchInput(e.target.value);
    console.log(searchInput);
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      console.log("searchInput:", searchInput);
      const full_name = searchInput;
      const res = await axios.post(`${baseUrl}/api/staff/search`, {
        full_name,
      });
      if (res.data.success) {
        setStaffList(res.data.data);
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      console.log("Failed to search staff.", error);
    }
  };

  const [data, setData] = useState({});

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.post(`${baseUrl}/api/appointment/getByPatient`, patient_id);
        if (response.data.success) {
          setAppoinmentList(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching appointment list", error);
      }
    };

    const addAppointment = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/appointment/add`,
          data
        );
        if (response.data.success) {
        }
      } catch (error) {
        console.error("Error fetching appointment list", error);
      }
    };

    fetchAppointment();
  }, []);

  return (
    <div className="patient-appointment">
      <div className="patients w-100 d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between">

          <div className="d-flex align-items-center gap-3 ms-auto">
            <form action="" onSubmit={handleSearch}>
              <div class="input-group float-end gap-3 w-100 border border-1 rounded-3 ">
                <input
                  type="search"
                  class="form-control rounded-3 border-0"
                  placeholder="Search"
                  aria-label="Search"
                  aria-describedby="search-addon"
                  value={searchInput}
                  onChange={handleChange}
                />
                <button
                  type="submit"
                  class="input-group-text border-0 rounded-3 w-25 d-flex justify-content-center"
                  id="search-addon"
                >
                  <CiSearch />
                </button>
              </div>
            </form>
          </div>
        </div>
        <button
          onClick={() => {
            navigate("/user/add-patient");
          }}
          className="btn fw-bold rounded-3 mt-1 pe-0 ms-auto"
        >
          Add new appointment
        </button>

        <table className="table table-hover mt-4 table-striped">
          <thead>
            <tr>
              <th scope="col">Code</th>
              <th scope="col">Doctor</th>
              <th scope="col">Type</th>
              <th scope="col">Department</th>
              <th scope="col">Notes</th>
              <th scope="col">Status</th>
              <th scope="col">Date</th>
              {/* <th scope="col">Action</th> */}
            </tr>
          </thead>

          <tbody>
            {appointmentList.map((item) => (
              <tr
                className="patient-item "
                key={item.staff_id}
                onClick={() => navigate(`/user/patients/${item.patient_id}`)}
              >
                <td>{item.id}</td>
                <td>{item.staff.full_name}</td>
                <td>{item.appointment_type}</td>
                <td>{item.department.name}</td>
                <td>{item.notes || 'N/A'}</td>
                <td>{item.status}</td>
                <td>{moment(item.appointment_date).format('LL')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientAppointment;
