import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar/Navbar";
import { Outlet, useLocation } from "react-router-dom";

const CustomerLayout = () => {
  const [showBackground, setShowBackground] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/user/home") {
      setShowBackground(true);
    } else {
      setShowBackground(false);
    }
  }, [location]);
  return (
    <div
      className={`user d-flex flex-column ${
        showBackground ? "home-background" : ""
      }`}
    >
      <div className={`w-100 z-1 position-fixed ${showBackground ? "" : "nav-background"}`}>
        <Navbar />
      </div>

      <div className="content h-100 w-100 p-5">
        <Outlet />
      </div>
    </div>
  );
};

export default CustomerLayout;
