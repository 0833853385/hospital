import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const Department = () => {
  const [searchInput, setSearchInput] = useState("");
  const [departmentList, setDepartmentList] = useState([]);

  useEffect(() => {
    const getDepartments = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/departments/get`);
        if (response.data.success) {
          setDepartmentList(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching department list", error);
      }
    };
    getDepartments();
  }, []);

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

  
  return (
    <div className="department p-5">
      <div className="patients w-100 d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="fw-bold m-0">Departments</h1>

          <div className="d-flex align-items-center gap-3">
            <form action="" onSubmit={handleSearch}>
              <div class="input-group d-flex gap-3 w-100 border border-1 rounded-3">
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
                  class="input-group-text border-0 3 w-25 d-flex justify-content-center"
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
          Add new department
        </button>

        <table className="table table-hover mt-4 table-striped">
          <thead>
            <tr>
              <th scope="col">Code</th>
              <th scope="col">Name</th>
             
              {/* <th scope="col">Action</th> */}
            </tr>
          </thead>

          <tbody>
            {departmentList.map((item) => (
              <tr
                className="patient-item "
                key={item.department_id}
                
              >
                <td>{item.department_id}</td>
                <td>{item.name}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Department;
