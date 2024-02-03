import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function Index() {
  const toggleClass = (evt) => {
    document.body.classList.toggle("showToggle");
  };
  return (
    <div className="container-fluid bg-orange py-3">
      <div className="d-flex justify-content-between">
        <div>
        <NavLink exact to="/admin/thankyou" className="pl-0">
            <img
              src="/assets/images/logo.png"
              className="img-fluid"
              style={{ width: "150px" }}
            />
          </NavLink>
        </div>
        {/* <div className="align-self-center">
          <NavLink
            to="/sign-up"
            activeClassName="selected"
            className="white ft-14 font-weight-bold pr-3"
          >
            Sign Up
          </NavLink>
          <NavLink
            to="/"
            activeClassName="selected"
            className="white ft-14 font-weight-bold pr-3"
          >
            Login
          </NavLink>
        </div> */}
      </div>
    </div>
  );
}

export default Index;
