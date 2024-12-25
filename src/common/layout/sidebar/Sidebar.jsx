import React, { useContext, useState, useEffect } from 'react';
import './Sidebar.scss';
import { useNavigate } from 'react-router-dom';
import navLogo from '../../../assets/image/logo-new.png';
import avt from '../../../assets/image/avt-user.png';
import { FaUserCircle, FaUser } from 'react-icons/fa';
import { IoLogOut } from 'react-icons/io5';

import { CgDarkMode } from 'react-icons/cg';

const Sidebar = () => {
  const [selected, setSelected] = useState('overview');
  const [token, setToken] = useState('');
  const [userRole, setUserRole] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole');
    if (storedToken) {
      setToken(storedToken);
      setUserRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      localStorage.removeItem('token');
      setToken('');
      navigate('/');
    }
  };

  const settingsItems = [
    { key: 'overview', label: 'Overview', badge: 14, path: '' },
    { key: 'staffs', label: 'Staffs', badge: 14, path: 'staff' },
    {
      key: 'health-indicators',
      label: 'Health indicators',
      badge: 2,
      path: 'health-indicators',
    },
    { key: 'departments', label: 'Departments', badge: 2, path: 'departments' },
    { key: 'schedules', label: 'Schedules', badge: 2, path: 'schedules' },
    { key: 'report', label: 'Report', badge: 2, path: 'report' },
    {
      key: 'notifications',
      label: 'Notifications',
      badge: 2,
      path: 'notifications',
    },
    { key: 'setting', label: 'Setting', badge: 2, path: 'setting' },
  ];

  return (
    <div className="sidebar p-3 d-flex flex-column position-fixed">
      <div>
        <img src={navLogo} className="w-50 mb-3" alt="Navigation Logo" />

        <ul className="list-group">
          {settingsItems.map((item) => (
            <li
              key={item.key}
              onClick={() => {
                setSelected(item.key);
                navigate(item.path);
              }}
              className={`list-group-item d-flex p-2 ${selected === item.key ? 'isActive' : ''}`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto d-flex">
        <div className="profile position-relative d-flex align-items-center p-3 rounded-3 w-75 gap-2 mb-3">
          <FaUserCircle size={32} className="text-secondary" />

          <span className="user-name fw-bold me-4">Vo Quoc Dinh</span>

          <ul className="logout-modal">
            <li onClick={() => navigate('/infor')}>Vo Quoc Dinh</li>
            <li>Dark mode</li>
            <li onClick={handleLogout}>Log out</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
