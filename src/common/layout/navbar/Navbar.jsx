import { useState } from 'react';
import logo from '../../../assets/image/logo-no-bgr.png';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';

import './Navbar.scss';
import { PATH_DASHBOARD } from '../../routes/path';
import { logoutSelector, setLogout, userSelector } from '@/auth/auth.slice';

const Nav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(logoutSelector);
  const userRole = useSelector(userSelector)?.role || '';
  const [isSelected, setIsSelected] = useState('Home');

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      dispatch(setLogout());
      navigate('/auth/login');
    }
  };

  const handleNavigation = (route, selected) => {
    navigate(route);
    setIsSelected(selected);
  };

  const navItems = [
    { label: 'Dashboard', route: PATH_DASHBOARD.overview.root },
    { label: 'Tổng quan', route: PATH_DASHBOARD.treatment.common },
    { label: 'Cuộc hẹn', route: PATH_DASHBOARD.appointment.calendar },
    { label: 'Bệnh nhân', route: PATH_DASHBOARD.manage_patient.list },
  ];

  return (
    <div className="d-flex align-items-center justify-content-center">
      <nav className="navbar navbar-expand-lg rounded-4">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="d-flex justify-content-between collapse navbar-collapse"
            id="navbarTogglerDemo01"
          >
            <div className="d-flex">
              <img
                onClick={() => navigate(PATH_DASHBOARD.overview.root)}
                className="nav__logo me-3"
                src={logo}
                alt="navbar logo"
              />

              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {navItems.map((item, index) => (
                  <li className="nav-item" key={index}>
                    <button
                      onClick={() => handleNavigation(item.route, item.label)}
                      className={`nav-link ${isSelected === item ? 'active' : ''}`}
                      aria-current={isSelected === item ? 'page' : undefined}
                      disabled={userRole === '4' && item !== 'Patients'}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {!isAuthenticated ? (
              <div className="login">
                <button onClick={() => navigate('/')} className="me-3">
                  Login
                </button>
              </div>
            ) : (
              <div className="auth d-flex align-items-center">
                <FaUserCircle size={32} className="text-secondary" />
                <ul className="select">
                  <span>My profile</span>
                  <li onClick={() => navigate('/infor')} className="item">
                    Personal Information
                  </li>
                  <li onClick={handleLogout} className="item">
                    Log out
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
