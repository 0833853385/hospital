import axios from "axios";
import { createContext, useEffect, useState, useCallback } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
  const [theme, setTheme] = useState("light");
  const [staffList, setStaffList] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [accountList, setAccountList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [healthIndicatorList, setHealthIndicatorList] = useState([]);
  const [patientDetail, setPatientDetail] = useState({});
  const [patientRecordsDetail, setPatientRecordsDetail] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem('patientRecordsDetail');
    if (storedData) {
      setPatientRecordsDetail(JSON.parse(storedData));
    }
  }, []);

  const updatePatientRecordsDetail = (data) => {
    setPatientRecordsDetail(data);
    localStorage.setItem('patientRecordsDetail', JSON.stringify(data));
  };

  const fetchAllStaff = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/staff/get`);
      if (response.data.success) {
        setStaffList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching staff list", error);
    }
  };

  const fetchAllPatient = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/patient/get`);
      if (response.data.success) {
        setPatientList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching staff list", error);
    }
  };

  const fetchAllIndicators = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/health-indicator/get`);
      if (res.data.success) {
        setHealthIndicatorList(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching health indicators list", error);
    }
  };

  const fetchRole = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/role/get`);
      if (response.data.success) {
        setRoleList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching staff list", error);
    }
  };

  const fetchDepartment = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/departments/get`);
      if (response.data.success) {
        setDepartmentList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching department list", error);
    }
  };

  useEffect(() => {
    fetchAllStaff();
    fetchAllPatient();
    fetchAllIndicators();
    fetchRole();
    fetchDepartment();
  
  }, []);

  const contextValue = {
    theme,
    setTheme,
    staffList,
    setStaffList,
    patientList,
    setPatientList,
    accountList,
    healthIndicatorList,
    roleList,
    setRoleList,
    departmentList,
    patientDetail,
    setPatientDetail,
    patientRecordsDetail,
    setPatientRecordsDetail,
    updatePatientRecordsDetail
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
