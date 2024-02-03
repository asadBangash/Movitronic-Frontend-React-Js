import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Helper from "../Helper";
import enablepush from "./enable-push.js";
const _ = require("lodash");

function Index() {
  React.useEffect(() => {
    enablepush();
  });
  const handleLogout = () => {
    localStorage.removeItem("SESSION");
    window.location.href = "/";
  };
  var user = Helper.getStorageData("SESSION");
  var permissions = user.permissions;
  //let myclass = document.getElementsByClassName("collapse-item active")[0].parentElement;
  //console.log("hereree",myclass)
  React.useEffect(() => {
   
    Helper.loadScript('https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js');
    Helper.loadScript('/assets/js/sb-admin-2.js');

    
  },[]);
  return (
    <>
      <ul
        className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
        id="accordionSidebar"
      >
        {/* <a className="" href="index.html">
                <div className="sidebar-brand-icon rotate-n-15">
                    <i className="fas fa-laugh-wink"></i>
                </div>  */}
        <div className="sidebar-brand-text mx-3 sidebar-brand d-flex align-items-center ">
          <NavLink exact to="/admin/thankyou" className="nav-link">
            <img
              src="/assets/images/logo.png"
              className="img-fluid"
              style={{ width: "150px" }}
            />
          </NavLink>
        </div>
        {/* </a> */}

        <hr className="sidebar-divider my-0" />

        <li className="nav-item">
          <a className="nav-link" href="index.html">
            <i className="fas fa-fw fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </a>
        </li>

        <hr className="sidebar-divider" />

        {/* <div className="sidebar-heading">
                Interface
            </div> */}

        {(user.type === "superadmin" ||
          user.type === "operator" ||
          (user.type === "admin" &&
            Helper.getPermissions(
              "vehicle-read",
              permissions && permissions,
              "admin"
            ))) && (
          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="#"
              data-toggle="collapse"
              data-target="#collapseTwo"
              aria-expanded="true"
              aria-controls="collapseTwo"
            >
              <i className="fas fa-car"></i>
              <span>Vehicles</span>
            </a>
            <div
              id="collapseTwo"
              className="collapse"
              aria-labelledby="headingTwo"
              data-parent="#accordionSidebar"
            >
              <div className="bg-orange-light  py-2 collapse-inner rounded">
                <NavLink
                  className="dropdown-item collapse-item"
                  exact
                  to="/admin/vehicle-list"
                >
                  <span className="ft-12 text-white">Vehicles My List</span>
                </NavLink>
                {(user.type === "superadmin" ||
                  (user.type === "admin" &&
                    Helper.getPermissions(
                      "vehicle-read",
                      permissions && permissions,
                      "admin"
                    ))) && (
                  <NavLink
                    className="dropdown-item collapse-item"
                    exact
                    to="/admin/all-vehicle-list"
                  >
                    <span className="ft-12 text-white">Vehicles All List</span>
                  </NavLink>
                )}
                {(user.type === "superadmin" ||
                  (user.type === "admin" &&
                    Helper.getPermissions(
                      "vehicle-read",
                      permissions && permissions,
                      "admin"
                    ))) && (
                  <NavLink
                    className="dropdown-item collapse-item"
                    exact
                    to="/admin/vehicle-map-all-list"
                  >
                    {" "}
                    <span className="ft-12 text-white">Vehicles All Map</span>
                  </NavLink>
                )}
                <NavLink
                  className="dropdown-item collapse-item"
                  exact
                  to="/admin/vehicle-map-list"
                >
                  {" "}
                  <span className="ft-12 text-white">Vehicles My Map</span>
                </NavLink>
                <NavLink
                  className="dropdown-item collapse-item"
                  exact
                  to="/admin/shares-with-me-list"
                >
                  <span className="ft-12 text-white">Shared Vehicles </span>
                </NavLink>
              </div>
            </div>
          </li>
        )}

        {(user.type === "superadmin" ||
          user.type === "operator" ||
          (user.type === "admin" &&
            Helper.getPermissions(
              "share-read",
              permissions && permissions,
              "admin"
            ))) && (
          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="#"
              data-toggle="collapse"
              data-target="#collapseUtilities"
              aria-expanded="true"
              aria-controls="collapseUtilities"
            >
              <i className="fas fa-share-alt"></i>
              <span>Shares</span>
            </a>
            <div
              id="collapseUtilities"
              class="collapse"
              aria-labelledby="headingUtilities"
              data-parent="#accordionSidebar"
            >
              <div className="bg-orange-light py-2 collapse-inner rounded">
                {user.type === "admin" ||
                  (user.type === "superadmin" && (
                    <NavLink
                      className="dropdown-item collapse-item"
                      exact
                      to="/admin/shares-my-list"
                    >
                      <span className="ft-12 text-white">Shares My List</span>
                    </NavLink>
                  ))}
                {(user.type === "superadmin" ||
                  (user.type === "admin" &&
                    Helper.getPermissions(
                      "share-read",
                      permissions && permissions,
                      "admin"
                    ))) && (
                  <NavLink
                    className="dropdown-item collapse-item"
                    exact
                    to="/admin/shares-list"
                  >
                    <span className="ft-12 text-white">Shares All List</span>
                  </NavLink>
                )}
                {user.type === "operator" && (
                  <NavLink
                    className="dropdown-item collapse-item"
                    exact
                    to="/admin/shares-list"
                  >
                    <span className="ft-12 text-white">Shares My List</span>
                  </NavLink>
                )}
              </div>
            </div>
          </li>
        )}

        <hr className="sidebar-divider" />

        {/* <div className="sidebar-heading">
                Addons
            </div> */}

        {(user.type === "superadmin" ||
          user.type === "operator" ||
          (user.type === "admin" &&
            Helper.getPermissions(
              "usage-read",
              permissions && permissions,
              "admin"
            ))) && (
          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="#"
              data-toggle="collapse"
              data-target="#usageCollapse"
              aria-expanded="true"
              aria-controls="usageCollapse"
            >
              <i className="fas fa-taxi"></i>
              <span>Usages</span>
            </a>
            <div
              id="usageCollapse"
              class="collapse"
              aria-labelledby="usageCollapse"
              data-parent="#accordionSidebar"
            >
              <div className="bg-orange-light py-2 collapse-inner rounded">
                <NavLink
                  className="dropdown-item collapse-item"
                  exact
                  to="/admin/usage-my-list"
                >
                  <span className="ft-12 text-white">Usages My List</span>
                </NavLink>
                {(user.type === "superadmin" ||
                  (user.type === "admin" &&
                    Helper.getPermissions(
                      "usage-read",
                      permissions && permissions,
                      "admin"
                    ))) && (
                  <NavLink
                    className="dropdown-item collapse-item"
                    exact
                    to="/admin/usage-list"
                  >
                    <span className="ft-12 text-white">Usages All List</span>
                  </NavLink>
                )}
              </div>
            </div>
          </li>
        )}

        {(user.type === "superadmin" ||
          user.type === "operator" ||
          (user.type === "admin" &&
            Helper.getPermissions(
              "user-read",
              permissions && permissions,
              "admin"
            ))) && (
          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="#"
              data-toggle="collapse"
              data-target="#userCollapse"
              aria-expanded="true"
              aria-controls="userCollapse"
            >
              <i className="fas fa-user"></i>
              <span>Users</span>
            </a>
            <div
              id="userCollapse"
              class="collapse"
              aria-labelledby="userCollapse"
              data-parent="#accordionSidebar"
            >
              <div className="bg-orange-light py-2 collapse-inner rounded">
                <NavLink
                  className="dropdown-item collapse-item"
                  exact
                  to="/admin/current-user-list"
                >
                  <span className="ft-12 text-white">User My List</span>
                </NavLink>
                {(user.type === "superadmin" ||
                  (user.type === "admin" &&
                    Helper.getPermissions(
                      "user-read",
                      permissions && permissions,
                      "admin"
                    ))) && (
                  <NavLink
                    className="dropdown-item collapse-item"
                    exact
                    to="/admin/user-list"
                  >
                    <span className="ft-12 text-white">User All List</span>
                  </NavLink>
                )}
              </div>
            </div>
          </li>
        )}
<hr className="sidebar-divider" />

        {(user.type === "superadmin" ||
          (user.type === "admin" &&
            Helper.getPermissions(
              "admin-read",
              permissions && permissions,
              "admin"
            ))) && (
          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="#"
              data-toggle="collapse"
              data-target="#adminCollapse"
              aria-expanded="true"
              aria-controls="adminCollapse"
            >
              <i className="fas fa-user"></i>
              <span>Admin</span>
            </a>
            <div
              id="adminCollapse"
              class="collapse"
              aria-labelledby="adminCollapse"
              data-parent="#accordionSidebar"
            >
              <div className="bg-orange-light py-2 collapse-inner rounded">
                <NavLink
                  className="dropdown-item collapse-item"
                  exact
                  to="/admin/my-admin-user-list"
                >
                  <span className="ft-12 text-white">Admin My List</span>
                </NavLink>
                {(user.type === "superadmin" ||
                  (user.type === "admin" &&
                    Helper.getPermissions(
                      "user-read",
                      permissions && permissions,
                      "admin"
                    ))) && (
                  <NavLink
                    className="dropdown-item collapse-item"
                    exact
                    to="/admin/admin-user-list"
                  >
                    <span className="ft-12 text-white">Admin All List</span>
                  </NavLink>
                )}
              </div>
            </div>
          </li>
        )}

        {(user.type === "superadmin" ||
          (user.type === "admin" &&
            Helper.getPermissions(
              "firmware-read",
              permissions && permissions,
              "admin"
            ))) && (
          <li class="nav-item">
            <NavLink
              exact
              to="/admin/software-upload-list"
              className="nav-link"
            >
              <span>
                <i className="fas fa-edit"></i>
              </span>
              <span>Soft Upload</span>
            </NavLink>
          </li>
        )}

        {(user.type === "superadmin" ||
          (user.type === "admin" &&
            Helper.getPermissions(
              "serial-read",
              permissions && permissions,
              "admin"
            ))) && (
          <li class="nav-item">
            <NavLink exact to="/admin/devices-code-list" className="nav-link">
              <span>
                <i className="fas fa-cog"></i>
              </span>
              <span>Devices</span>
            </NavLink>
          </li>
        )}

{(user.type === "superadmin" ||
          (user.type === "admin" &&
            Helper.getPermissions(
              "label-read",
              permissions && permissions,
              "admin"
            ))) && (
          <li class="nav-item">
            <NavLink
              exact
              to="/admin/list-white-label"
              className="nav-link"
            >
              <span>
                <i className="fas fa-edit"></i>
              </span>
              <span>White Label</span>
            </NavLink>
          </li>
        )}


<hr className="sidebar-divider" />

        {user.type === "superadmin" && (
          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="#"
              data-toggle="collapse"
              data-target="#dropdownMenuLink"
              aria-expanded="true"
              aria-controls="dropdownMenuLink"
            >
              <i className="fas fa-user"></i>
              <span>Veh Details</span>
            </a>
            <div
              id="dropdownMenuLink"
              class="collapse"
              aria-labelledby="dropdownMenuLink"
              data-parent="#accordionSidebar"
            >
              <div className="bg-orange-light py-2 collapse-inner rounded">
                <NavLink
                  className="dropdown-item collapse-item"
                  exact
                  to="/admin/company-vehicle-list"
                >
                  <span className="ft-12 text-white">Add Company</span>
                </NavLink>
                <NavLink
                  className="dropdown-item collapse-item"
                  exact
                  to="/admin/add-model-name-listing"
                >
                  <span className="ft-12 text-white">Add Model</span>
                </NavLink>
                <NavLink
                  className="dropdown-item collapse-item"
                  exact
                  to="/admin/company-key-list"
                >
                  <span className="ft-12 text-white">Add Key</span>
                </NavLink>
              </div>
            </div>
          </li>
        )}

        {(user.type === "superadmin" ||
          user.type === "operator" ||
          (user.type === "admin" &&
            Helper.getPermissions(
              "profile-update",
              permissions && permissions,
              "admin"
            ))) && (
          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="#"
              data-toggle="collapse"
              data-target="#settingsCollapse"
              aria-expanded="true"
              aria-controls="settingsCollapse"
            >
              <i className="fas fa-cog"></i>
              <span className="">Settings</span>
            </a>
            <div
              id="settingsCollapse"
              class="collapse"
              aria-labelledby="settingsCollapse"
              data-parent="#accordionSidebar"
            >
              <div className="bg-orange-light py-2 collapse-inner rounded">
                <NavLink
                  className="dropdown-item collapse-item"
                  exact
                  to="/admin/change-password"
                >
                  <span className="ft-12 text-white">Change Password</span>
                </NavLink>
                <NavLink
                  className="dropdown-item collapse-item"
                  exact
                  to="/admin/update-phone"
                >
                  <span className="ft-12  text-white">Phone Update</span>
                </NavLink>
                <NavLink
                  className="dropdown-item collapse-item"
                  exact
                  to="/admin/edit-email"
                >
                  {" "}
                  <span className="ft-12  text-white">Email Update</span>
                </NavLink>
                <NavLink
                  className="dropdown-item collapse-item"
                  exact
                  to="/admin/add-detail"
                >
                  {" "}
                  <span className="ft-12  text-white">My Details</span>
                </NavLink>

                <NavLink
                  className="dropdown-item collapse-item"
                  exact
                  to="/admin/key-regenrate"
                >
                  {" "}
                  <span className="ft-12  text-white">API Key</span>
                </NavLink>
              </div>
            </div>
          </li>
        )}

        {/* <li className="nav-item active">
                <a className="nav-link" href="#" data-toggle="collapse" data-target="#collapsePages" aria-expanded="true"
                    aria-controls="collapsePages">
                    <i className="fas fa-fw fa-folder"></i>
                    <span>Pages</span>
                </a>
                <div id="collapsePages" className="collapse show" aria-labelledby="headingPages"
                    data-parent="#accordionSidebar">
                    <div class="bg-white py-2 collapse-inner rounded">
                        <h6 class="collapse-header">Login Screens:</h6>
                        <a class="collapse-item" href="login.html">Login</a>
                        <a class="collapse-item" href="register.html">Register</a>
                        <a class="collapse-item" href="forgot-password.html">Forgot Password</a>
                        <div class="collapse-divider"></div>
                        <h6 class="collapse-header">Other Pages:</h6>
                        <a class="collapse-item" href="404.html">404 Page</a>
                        <a class="collapse-item active" href="blank.html">Blank Page</a>
                    </div>
                </div>
            </li> */}

        <li className="nav-item ">
          <a onClick={handleLogout} className="nav-link">
            <span>
              <i className="fas fa-sign-out-alt"></i>
            </span>
            <span>Logout</span>
          </a>
        </li>
        {/* <li class="nav-item">
                <a class="nav-link" href="charts.html">
                    <i class="fas fa-fw fa-chart-area"></i>
                    <span>Charts</span></a>
            </li>

        
            <li class="nav-item">
                <a class="nav-link" href="tables.html">
                    <i class="fas fa-fw fa-table"></i>
                    <span>Tables</span></a>
            </li> */}

        <hr class="sidebar-divider d-none d-md-block" />

        <div class="text-center d-none d-md-inline">
          <button class="rounded-circle border-0" id="sidebarToggle"></button>
        </div>
      </ul>
    </>
  );
}

export default Index;
