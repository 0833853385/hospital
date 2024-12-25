import Sidebar from "../../components/layout/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="admin w-100 d-flex p-3">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="content w-100 rounded-3">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
