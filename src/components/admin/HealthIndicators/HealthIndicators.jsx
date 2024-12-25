import React, { useContext, useEffect, useState } from "react";
import "./HealthIndicators.scss";
import { MdEdit } from "react-icons/md";
import { FaTrashCan } from "react-icons/fa6";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { StoreContext } from "../../../context/StoreContext";

const HealthIndicators = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const { healthIndicatorList } = useContext(StoreContext);
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
  const handleChange = (e) => {
    setSearchInput(e.target.value);
    console.log(searchInput);
  };
  return (
    <div className="health-indicator p-5 d-flex justify-content-center flex-column">
      <div className="d-flex align-items-center justify-content-between">
        <h1 className="fw-900">Health indicators</h1>

        <form action="" onSubmit={handleSearch}>
          <div class="input-group d-flex gap-3 w-100 border border-1 rounded-5">
            <input
              type="search"
              class="form-control rounded-5 border-0"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="search-addon"
              value={searchInput}
              onChange={handleChange}
            />
            <button
              type="submit"
              class="input-group-text border-0 rounded-5 w-25 d-flex justify-content-center"
              id="search-addon"
            >
              <CiSearch />
            </button>
          </div>
        </form>
      </div>
      <div className="d-flex justify-content-between align-items-center mt-4">
        {/* <ul className="nav d-flex gap-4">
          <li className="nav-item ">
            <a
              className="text-black nav-link active p-0"
              aria-current="page"
              href="#"
            >
              All
            </a>
          </li>
          <li className="nav-item">
            <a
              onClick={() => setSortBy("Managers")}
              className="text-black nav-link p-0"
              href="#"
            >
              Records Managers
            </a>
          </li>
          <li className="nav-item">
            <a
              onClick={() => setSortBy("Users")}
              className="text-black nav-link p-0"
              href="#"
            >
              Records Users
            </a>
          </li>
        </ul> */}
        <button
          onClick={() => navigate("/admin/add-staff")}
          className="btn fw-900 add-staff ms-auto"
        >
          Add health indicator
        </button>
      </div>

      <table className="table table-hover mt-4 table-striped">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Unit</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {healthIndicatorList.map((item) => (
            <tr key={item.indicator_id}>
              <td>{item.name}</td>
              <td>{item.unit}</td>
              <td>
                <div className="hstack gap-2 fs-6">
                  <button
                    title="Edit"
                    onClick={() =>
                      navigate(`/admin/edit-staff/${item.staff_id}`)
                    }
                    className="btn btn-sm btn-primary"
                  >
                    <MdEdit />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => handleShowModal(item.staff_id)}
                    className="btn btn-sm btn-danger"
                  >
                    <FaTrashCan />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ToastContainer />
    </div>
  );
};

export default HealthIndicators;
