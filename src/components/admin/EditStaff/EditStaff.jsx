import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { StoreContext } from "../../../context/StoreContext";

const EditStaff = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
  const { staff_id } = useParams();
  const { roleList, departmentList } = useContext(StoreContext);

  const [formValues, setFormValues] = useState({
    staffId: "",
    email: "",
    phone: "",
    fullName: "",
    gender: "Male",
    dateOfBirth: null,
    address: "",
    position: "Doctor",
    avtFile: null,
    department: 1,
    role: 1,
  });

  useEffect(() => {
    fetchDataForEditing();
  }, [staff_id]);

  const fetchDataForEditing = async () => {
    try {
      const res = await axios.post(`${baseUrl}/api/staff/getById`, {
        staffId:staff_id,
      });
      if (res.data.success) {
        const fetchedStaff = res.data.data;
        if (fetchedStaff.date_of_birth) {
          fetchedStaff.date_of_birth = fetchedStaff.date_of_birth.split("T")[0];
        }
        setFormValues({
          staffId: staff_id,
          email: fetchedStaff.email,
          phone: fetchedStaff.phone_number,
          fullName: fetchedStaff.full_name,
          gender: fetchedStaff.gender,
          dateOfBirth: fetchedStaff.date_of_birth,
          address: fetchedStaff.address,
          position: fetchedStaff.position,
          avtFile: fetchedStaff.avatar,
          department: fetchedStaff.department_id,
          role: fetchedStaff.role_id,
        });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch staff data.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newFormValues = { ...formValues };

    if (name === "role") {
      const selectedRole = roleList.find((role) => role.name === value);
      newFormValues.role = selectedRole ? selectedRole.id : formValues.role;
    } else if (name === "department") {
      const selectedDepartment = departmentList.find(
        (department) => department.name === value
      );
      newFormValues.department = selectedDepartment
        ? selectedDepartment.department_id
        : formValues.department;
    } else {
      newFormValues[name] = value;
    }

    setFormValues(newFormValues);
  };

  const handleSubmit = async (e) => {
    console.log(formValues);

    e.preventDefault();
    try {
      const addRes = await axios.post(`${baseUrl}/api/staff/edit`, formValues);
      if (addRes.data.success) {
        toast.success(addRes.data.data);
      }
    } catch (error) {
      console.error("Error updating staff:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to update staff. Please try again later.");
      }
    }
  };

  return (
    <div className="edit-staff p-5">
      <h1 className="mb-5 fw-bold">Edit Staff</h1>
      <form onSubmit={handleSubmit} className="row g-4">
        <div className="col-md-9 ">
          <div className="d-flex col-md-3">
            <input
              type="file"
              className="form-control"
              name="avtFile"
              onChange={handleChange}
            />
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
              <label htmlFor="position" className="form-label">
                Position
              </label>
              <select
                className="form-select"
                id="position"
                name="position"
                value={formValues.position}
                onChange={handleChange}
                required
              >
                <option>Doctor</option>
                <option>Nurse</option>
              </select>
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
                Phone
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

            <div className="col-md-3">
              <label htmlFor="role" className="form-label">
                Role
              </label>
              <select
                className="form-select"
                id="role"
                name="role"
                value={
                  roleList.find((role) => role.id === formValues.role)?.name ||
                  ""
                }
                onChange={handleChange}
              >
                {roleList.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="department" className="form-label">
                Department
              </label>
              <select
                className="form-select"
                id="department"
                name="department"
                value={
                  departmentList.find(
                    (dept) => dept.department_id === formValues.department
                  )?.name || ""
                }
                onChange={handleChange}
              >
                {departmentList.map((department) => (
                  <option
                    key={department.department_id}
                    value={department.name}
                  >
                    {department.name}
                  </option>
                ))}
              </select>
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

export default EditStaff;
