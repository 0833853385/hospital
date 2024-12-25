import React, { useContext, useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { FaTrashCan } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "./Staff.scss";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import DeleteConfirmation from "../../common/DeleteConfirmation";
import { CiSearch } from "react-icons/ci";
import { StoreContext } from "../../../context/StoreContext";
import { FaSearch } from "react-icons/fa";

const Staff = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
  const navigate = useNavigate();
  // const [staffList, setStaffList] = useState([]);
  const [sortBy, setSortBy] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const { staffList, setStaffList } = useContext(StoreContext);

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

  const handleShowModal = (staffId) => {
    setSelectedStaffId(staffId);
    setShowModal(true);
  };

  const handleHideModal = () => {
    setShowModal(false);
    setSelectedStaffId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedStaffId) {
      handleDelete(selectedStaffId);
      handleHideModal();
    }
  };

  const searchStaff = async () => {};

  useEffect(() => {
    searchStaff();
  }, []);

  const handleDelete = async (staffId) => {
    try {
      const response = await axios.post(`${baseUrl}/api/staff/delete`, 
        {staffId}
      );
      console.log(response)
      if (response.data.success) {
        toast.success(response.data.message);

        setStaffList((prevList) =>
          prevList.filter((staff) => staff.staff_id !== staffId)
        );
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || "Error deleting staff", error);
    }
  };

  return (
    <div className="staff p-5 d-flex justify-content-center flex-column">
      <div className="d-flex align-items-center justify-content-between">
        <h1 className="fw-bold">Staffs</h1>
        <div className=" d-flex gap-2">
          <form action="" onSubmit={handleSearch}>
            <div class="input-group d-flex w-100 border border-1 rounded-3 gap-1">
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
                class="btn btn-secondary input-group-text border-1 w-25 d-flex justify-content-center mt-0"
                id="search-addon"
              >
                <FaSearch />
              </button>
            </div>
          </form>
          <button
            onClick={() => navigate("/admin/add-staff")}
            className="fw-bold add-staff btn btn-primary m-0"
          >
            Add Staff
          </button>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <ul className="nav d-flex gap-4">
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
              Doctor
            </a>
          </li>
          <li className="nav-item">
            <a
              onClick={() => setSortBy("Users")}
              className="text-black nav-link p-0"
              href="#"
            >
              Nurse
            </a>
          </li>
        </ul>
      </div>

      <table className="table table-hover mt-4 table-striped">
        <thead>
          <tr>
            <th scope="col">Full name</th>
            <th scope="col">Email</th>
            <th scope="col">Phone number</th>
            <th scope="col">Gender</th>
            <th scope="col">Date of birth</th>
            <th scope="col">Address</th>
            <th scope="col">Position</th>
            <th scope="col">Department</th>
            <th scope="col">Date joined</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map(
            (item) =>
              item.status === 1 && (
                <tr key={item.staff_id}>
                  <td>{item.full_name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone_number}</td>
                  <td>{item.gender}</td>
                  <td>{item.date_of_birth}</td>
                  <td>{item.address}</td>
                  <td>{item.position}</td>
                  <td>{item.department.name}</td>
                  <td>{item.date_joined}</td>
                  <td>
                    <div className="hstack gap-2 fs-6">
                      <button
                        title="Edit"
                        onClick={() =>
                          navigate(`/admin/edit-staff/${item.staff_id}`)
                        }
                        className="btn btn-sm btn-primary m-0"
                      >
                        <MdEdit />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => handleShowModal(item.staff_id)}
                        className="btn btn-sm btn-danger m-0"
                      >
                        <FaTrashCan />
                      </button>
                    </div>
                  </td>
                </tr>
              )
          )}
        </tbody>
      </table>
      <DeleteConfirmation
        showModal={showModal}
        hideModal={handleHideModal}
        confirmModal={handleConfirmDelete}
      />
      <ToastContainer />
    </div>
  );
};

export default Staff;
