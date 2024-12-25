import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

const Setting = () => {
  return (
    <div className="p-5">
      <h1 className="fw-900 mt-5">Setting</h1>
      <div className="d-flex h-100">
        <Sidebar/>
        <Outlet/>
      </div>
    </div>
  );
};

export default Setting;
