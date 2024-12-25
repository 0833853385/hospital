import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const AddAccount = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formValues;
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(
        `${baseUrl}/api/account/register`,
        formValues
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to add account. Please try again later.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  return (
    <div className="add-account p-4 mt-5">
      <h1 className="fw-900">Add Account</h1>
      <form
        onSubmit={handleSubmit}
        className="row g-3 needs-validatio flex-row m-3"
      >
        <div className="w-75 d-flex flex-column gap-3 pe-5">
          <div className="col-6">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              aria-describedby="emailHelp"
              required
            />
          </div>
          
          <div className="col-6">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-6">
            <label htmlFor="comfirmPassword">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              value={formValues.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <div className="col-4">
              <label htmlFor="gender">Role</label>
              <select
                className="form-select"
                id="role"
                name="role"
                value={formValues.role}
                onChange={handleChange}
              >
                <option>1</option>
                <option>0</option>
              </select>
            </div>
          </div>

          <div className="col-12 ">
            <button className="btn btn-primary" type="submit">
              Add new account
            </button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddAccount;
