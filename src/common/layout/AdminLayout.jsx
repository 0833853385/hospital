import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="w-100 d-flex p-3 overflow-scroll" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="content w-90 rounded-3">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
