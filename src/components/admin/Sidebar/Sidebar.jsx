import React from "react";
import { CiSearch } from "react-icons/ci";

const Sidebar = () => {
  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 min-vh-100">
            <ul
              className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
              id="menu"
            >
              <li className="nav-item">
                <a href="#" className="nav-link align-middle px-0">
                  <CiSearch />
                  <span className="ms-1 d-none d-sm-inline">
                    Thông tin cá nhân
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="#submenu1"
                  data-bs-toggle="collapse"
                  className="nav-link px-0 align-middle"
                >
                  <CiSearch />
                  <span className="ms-1 d-none d-sm-inline">
                    Tùy chọn bảo mật
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="#submenu1"
                  data-bs-toggle="collapse"
                  className="nav-link px-0 align-middle"
                >
                  <CiSearch />
                  <span className="ms-1 d-none d-sm-inline">
                    Cài đặt ứng dụng
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="#submenu1"
                  data-bs-toggle="collapse"
                  className="nav-link px-0 align-middle"
                >
                  <CiSearch />
                  <span className="ms-1 d-none d-sm-inline">
                    Quyền riêng tư
                  </span>
                </a>
              </li>
              <li>
                <a href="#" className="nav-link px-0 align-middle">
                  <CiSearch />
                  <span className="ms-1 d-none d-sm-inline">
                    Trợ giúp và hỗ trợ
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="#submenu2"
                  data-bs-toggle="collapse"
                  className="nav-link px-0 align-middle"
                >
                  <CiSearch />
                  <span className="ms-1 d-none d-sm-inline">Về ứng dụng</span>
                </a>
              </li>
            </ul>
            {/* <hr /> */}
            {/* <div className="dropdown pb-4">
              <a
                href="#"
                className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                id="dropdownUser1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="https://github.com/mdo.png"
                  alt="hugenerd"
                  width="30"
                  height="30"
                  className="rounded-circle"
                />
                <span className="d-none d-sm-inline mx-1">loser</span>
              </a>
              <ul
                className="dropdown-menu dropdown-menu-dark text-small shadow"
                aria-labelledby="dropdownUser1"
              >
                <li>
                  <a className="dropdown-item" href="#">
                    New project...
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Settings
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Profile
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Sign out
                  </a>
                </li>
              </ul>
            </div> */}
          </div>
        </div>

        <div className="col py-3">
          <h3>Left Sidebar with Submenus</h3>
          <p className="lead">
            An example 2-level sidebar with collapsible menu items. The menu
            functions like an "accordion" where only a single menu is be open at
            a time. While the sidebar itself is not toggle-able, it does
            responsively shrink in width on smaller screens.
          </p>
          <ul className="list-unstyled">
            <li>
              <h5>Responsive</h5> shrinks in width, hides text labels and
              collapses to icons only on mobile
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
