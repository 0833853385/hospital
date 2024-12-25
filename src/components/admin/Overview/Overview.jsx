import React, { useContext, useState } from "react";
import Calendar from "react-calendar";
import doctorImg from "../../../assets/image/doctor3d.png";
import { FaSearch } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import MyLineChart from "../../common/LineChart";
import "react-calendar/dist/Calendar.css";
import "./Overview.scss";

const Overview = () => {
  const [searchInput, setSearchInput] = useState("");

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

  return (
    <div className="overview d-flex flex-column p-5 h-100 gap-4">
      <div className="d-flex justify-content-between">
        <h2 className="fw-bold d-flex gap-2">
          Good Morning, <span className="text-primary">Dr.Dinh</span>
        </h2>

        <div className="d-flex align-items-center gap-3">
          <FaBell size={22}/>

          <form action="" onSubmit={handleSearch}>
            <div class="input-group d-flex  w-100 border rounded-2">
              <input
                type="search"
                className="form-control border-0"
                placeholder="Search"
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
        </div>
      </div>

      <div className="d-flex w-100 gap-2">
        <div className="w-75 d-flex flex-column gap-2">
          <div className="header rounded-3 p-5 position-relative">
            <h3 className="fw-bold">Visits for Today</h3>
            <span className="fs-5">10</span>
            <div className="d-flex gap-4 mt-4">
              <div className="rounded-3 d-flex flex-column bg-white p-4">
                <span className="fw-bolder">New Patiens</span>
                <span>40</span>
              </div>

              <div className="rounded-3 d-flex flex-column bg-white p-4">
                <span className="fw-bolder">Old Patiens</span>
                <span>20</span>
              </div>
            </div>
            <img
              src={doctorImg}
              alt="doctor image"
              className="position-absolute"
            />
          </div>

          <div className="d-flex w-100 gap-4 border border-1 p-3 rounded-3">
            <div className="w-100 chart">
              <h4 className=" fw-bold">Total number of patient</h4>
              <div className="d-flex">
                <MyLineChart />
                <MyLineChart />
              </div>
            </div>
          </div>
        </div>

        <div className="w-25 d-flex flex-column gap-2">
          <div className="calendar">
            <Calendar />
          </div>
          <div className="read-daily rounded-3 p-5 d-flex flex-column">
            <h4 className="fw-900">Daily Read</h4>
            <p>New rules in the dose of medicines to be consumed.</p>
            <button className="mt-auto btn btn-primary rounded-3 ms-auto">
              Read now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
