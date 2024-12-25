import React, { useContext, useState } from "react";
import avtUser from "../../../assets/image/avt-user.png";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { StoreContext } from "../../../context/StoreContext";

const AddStaff = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
  const { roleList, departmentList } = useContext(StoreContext);
  const [formValues, setFormValues] = useState({
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
    e.preventDefault();
    try {
      const addRes = await axios.post(`${baseUrl}/api/staff/add`, { formValues });
      console.log(addRes);
      if (addRes.data.success) {
        toast.success(addRes.data.data);
      } else {
        toast.error(addRes.data.data);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.data) {
        toast.error(error.response.data.data);
      } else {
        toast.error("Failed to add staff. Please try again later.");
      }
    }
  };
  return (
    <div className="add-staff p-5">
      <h1 className="mb-5 fw-bold">Add Staff</h1>
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
                Add New Staff
              </button>
            </div>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddStaff;
