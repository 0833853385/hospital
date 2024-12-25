import { Outlet } from 'react-router-dom';
import Navbar from './home-navbar';

const HomeLayout = () => {
  return (
    <div className="w-100 d-flex flex-column align-items-center mt-5">
      <Navbar />
      <div className="mt-5 rounded-3 bg-[#F9FAFB]" style={{ width: '90%' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default HomeLayout;
