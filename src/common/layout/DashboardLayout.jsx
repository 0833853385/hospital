import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Navbar from './navbar/Navbar';
import { loginSelector } from '../../auth/auth.slice';
import { PATH_AUTHENTICATION } from '../routes/path';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(loginSelector);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(PATH_AUTHENTICATION.login);
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="admin w-100 d-flex flex-column align-items-center">
      <div className="d-block w-100 mx-auto">
        <Navbar />
      </div>
      <div className="content rounded-3 bg-[#F9FAFB]" style={{ width: '90%' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
