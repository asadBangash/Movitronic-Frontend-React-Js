//import React, { useState } from "react";
import AdvanceSearch from "./AdvanceSearch";
import { Context } from "../Store/Store";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
var { apiRequest } = require("../Api/Service");
var { SearchApi } = require("../Api/ApiRoutes");

const Helper = require("../Helper");
const _ = require("lodash");
const initialState = {
  isError: false,
  errors: [],
  isSuccess: false,
  success: "",
  disable: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return {
        ...state,
        isSuccess: true,
        success: action.payload,
        disable: false,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        isError: true,
        errors: action.payload,
        disable: false,
      };
    case "DEFAULT":
      return {
        disable: action.payload,
      };
    default:
      return state;
  }
};

function Index({ showSearch = true, showAdvanceSearch = false }) {
  const isAuth = !_.isEmpty(localStorage.getItem("SESSION"))
    ? Helper.getStorageData("SESSION")
    : {};
  //console.log("isAuth",isAuth)

  const toggleClass = (evt) => {
    document.body.classList.toggle("showToggle");
  };

  const handleLogout = () => {
    localStorage.removeItem("SESSION");
    window.location.href = "/";
  };

  const [state, dispatch] = useContext(Context);
  const [LocalState, Localdispatch] = React.useReducer(reducer, initialState);
  const [loader, setloader] = React.useState(false);
  let history = useHistory();
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    let params = new FormData(form);
    Localdispatch({ type: "DEFAULT", payload: true });
    Helper.overlay(true);
    setloader(true);
    apiRequest(SearchApi.method, SearchApi.url, params)
      .then((response) => {
        if (response.data.code === 200) {
          let data = response.data.data;
          console.log("FETCH_SUCCESS", data);
          Localdispatch({
            type: "FETCH_SUCCESS",
            payload: response.data.message,
          });
          dispatch({ type: "SET_STATE", response: data });
          Helper.overlay(false);
          setloader(false);
          history.push("/admin/vehicle-list#search");
        }
      })
      .catch((error) => {
        Localdispatch({
          type: "FETCH_ERROR",
          payload: error.response.data.data,
        });
        //Localdispatch({ type: 'FETCH_ERROR', payload: error.response.data.data })
        dispatch({ type: "SET_STATE", response: [] });
        console.log("FETCH_ERROR");
        Helper.overlay(false);
        setloader(false);
      });
  };

  return (
    <>
      {/* <div className="container-fluid bg-orange py-3">
      <div className="d-flex justify-content-between">
        <div>
          <button className={`btn ml-2 menu-toggle`} onClick={toggleClass}>
            <i className="fas fa-bars white"></i>
          </button>
          
          <form className="white ft-14" onSubmit={handleSubmit}>
          <ul className="nav-ul">
            {showSearch &&
            <li className="nav-li">
            <div className="input-group">
  <input type="search" name="name" className="form-control" placeholder="Search here" />
  <div className="input-group-append">
  <button className="btn btn-primary"type="submit"><i className="fa fa-search"></i></button>
  </div>
</div>
            </li>
}
            {showAdvanceSearch &&
            <li className="nav-li white">
            <span
            className="navbar-toggler ft-14 font-weight-bold panel-title "
            data-toggle="collapse"
            data-target="#navbarToggleExternalContent"
            aria-controls="navbarToggleExternalContent"
            aria-expanded="false"
          >
            Advanced Search
          </span>
            </li>
            }
          </ul>
          </form>
          
        </div>
        <div className="align-self-center white font-weight-bold text-capitalize">
        Hello, {isAuth.name}
        </div>
      </div>
      {showAdvanceSearch && <AdvanceSearch /> }
    </div> */}

      <nav className="navbar navbar-expand navbar-light bg-orange topbar  static-top shadow">
        <button
          id="sidebarToggleTop"
          className="btn btn-link d-md-none rounded-circle mr-3 btn ml-2 menu-toggle"
         
        >
          <i className="fa fa-bars"></i>
        </button>

        {/* <form
        class="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
        <div class="input-group">
            <input type="text" class="form-control bg-light border-0 small" placeholder="Search for..."
                aria-label="Search" aria-describedby="basic-addon2"/>
            <div class="input-group-append">
                <button class="btn btn-primary" type="button">
                    <i class="fas fa-search fa-sm"></i>
                </button>
            </div>
        </div>
    </form> */}

        <form
          className="white d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search"
          onSubmit={handleSubmit}
        >
          <ul className="nav-ul">
            {showSearch && (
              <li className="nav-li">
                <div className="input-group">
                  <input
                    type="search"
                    name="name"
                    className="form-control bg-light border-0 small"
                    placeholder="Search here"
                  />
                  <div className="input-group-append">
                    <button className="btn btn-primary" type="submit">
                      <i className="fas fa-search fa-sm"></i>
                    </button>
                  </div>
                </div>
              </li>
            )}
            {showAdvanceSearch === true && (
              <li className="nav-li white">
                <span
                  className="navbar-toggler text-white custom-toggler ft-14 font-weight-bold panel-title "
                  data-toggle="collapse"
                  data-target="#navbarToggleExternalContent"
                  aria-controls="navbarToggleExternalContent"
                  aria-expanded="false"
                >
                  Advanced Search
                </span>
              </li>
            )}
          </ul>
        </form>
        <ul className="navbar-nav ml-auto">
          {/* <li class="nav-item dropdown no-arrow d-sm-none">
            <a class="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-search fa-fw"></i>
            </a>
  
            <div class="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                aria-labelledby="searchDropdown">
                <form class="form-inline mr-auto w-100 navbar-search">
                    <div class="input-group">
                        <input type="text" class="form-control bg-light border-0 small"
                            placeholder="Search for..." aria-label="Search"
                            aria-describedby="basic-addon2"/>
                        <div class="input-group-append">
                            <button class="btn btn-primary" type="button">
                                <i class="fas fa-search fa-sm"></i>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </li> */}

          {/* <li class="nav-item dropdown no-arrow mx-1">
            <a class="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-bell fa-fw"></i>
                
                <span class="badge badge-danger badge-counter">3+</span>
            </a>
        
            <div class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                aria-labelledby="alertsDropdown">
                <h6 class="dropdown-header">
                    Alerts Center
                </h6>
                <a class="dropdown-item d-flex align-items-center" href="#">
                    <div class="mr-3">
                        <div class="icon-circle bg-primary">
                            <i class="fas fa-file-alt text-white"></i>
                        </div>
                    </div>
                    <div>
                        <div class="small text-gray-500">December 12, 2019</div>
                        <span class="font-weight-bold">A new monthly report is ready to download!</span>
                    </div>
                </a>
                <a class="dropdown-item d-flex align-items-center" href="#">
                    <div class="mr-3">
                        <div class="icon-circle bg-success">
                            <i class="fas fa-donate text-white"></i>
                        </div>
                    </div>
                    <div>
                        <div class="small text-gray-500">December 7, 2019</div>
                        $290.29 has been deposited into your account!
                    </div>
                </a>
                <a class="dropdown-item d-flex align-items-center" href="#">
                    <div class="mr-3">
                        <div class="icon-circle bg-warning">
                            <i class="fas fa-exclamation-triangle text-white"></i>
                        </div>
                    </div>
                    <div>
                        <div class="small text-gray-500">December 2, 2019</div>
                        Spending Alert: We've noticed unusually high spending for your account.
                    </div>
                </a>
                <a class="dropdown-item text-center small text-gray-500" href="#">Show All Alerts</a>
            </div>
        </li> */}

          {/* <li class="nav-item dropdown no-arrow mx-1">
            <a class="nav-link dropdown-toggle" href="#" id="messagesDropdown" role="button"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-envelope fa-fw"></i>
           
                <span class="badge badge-danger badge-counter">7</span>
            </a>
            
            <div class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                aria-labelledby="messagesDropdown">
                <h6 class="dropdown-header">
                    Message Center
                </h6>
                <a class="dropdown-item d-flex align-items-center" href="#">
                    <div class="dropdown-list-image mr-3">
                        <img class="rounded-circle" src="img/undraw_profile_1.svg"
                            alt="..."/>
                        <div class="status-indicator bg-success"></div>
                    </div>
                    <div class="font-weight-bold">
                        <div class="text-truncate">Hi there! I am wondering if you can help me with a
                            problem I've been having.</div>
                        <div class="small text-gray-500">Emily Fowler · 58m</div>
                    </div>
                </a>
                <a class="dropdown-item d-flex align-items-center" href="#">
                    <div class="dropdown-list-image mr-3">
                        <img class="rounded-circle" src="img/undraw_profile_2.svg"
                            alt="..."/>
                        <div class="status-indicator"></div>
                    </div>
                    <div>
                        <div class="text-truncate">I have the photos that you ordered last month, how
                            would you like them sent to you?</div>
                        <div class="small text-gray-500">Jae Chun · 1d</div>
                    </div>
                </a>
                <a class="dropdown-item d-flex align-items-center" href="#">
                    <div class="dropdown-list-image mr-3">
                        <img class="rounded-circle" src="img/undraw_profile_3.svg"
                            alt="..."/>
                        <div class="status-indicator bg-warning"></div>
                    </div>
                    <div>
                        <div class="text-truncate">Last month's report looks great, I am very happy with
                            the progress so far, keep up the good work!</div>
                        <div class="small text-gray-500">Morgan Alvarez · 2d</div>
                    </div>
                </a>
                <a class="dropdown-item d-flex align-items-center" href="#">
                    <div class="dropdown-list-image mr-3">
                        <img class="rounded-circle" src="https://source.unsplash.com/Mv9hjnEUHR4/60x60"
                            alt="..."/>
                        <div class="status-indicator bg-success"></div>
                    </div>
                    <div>
                        <div class="text-truncate">Am I a good boy? The reason I ask is because someone
                            told me that people say this to all dogs, even if they aren't good...</div>
                        <div class="small text-gray-500">Chicken the Dog · 2w</div>
                    </div>
                </a>
                <a class="dropdown-item text-center small text-gray-500" href="#">Read More Messages</a>
            </div>
        </li> */}

          <div className="topbar-divider d-none d-sm-block"></div>

          <li className="nav-item dropdown no-arrow">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="userDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span className="mr-2 d-none d-lg-inline  small text-white">
                Hello, {isAuth.name}
              </span>
              {/* <img class="img-profile rounded-circle"
                    src="img/undraw_profile.svg"/> */}
            </a>

            <div
              className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
              aria-labelledby="userDropdown"
            >
              {/* <a class="dropdown-item" href="#">
                    <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                    Profile
                </a>
                <a class="dropdown-item" href="#">
                    <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                    Settings
                </a>
                <a class="dropdown-item" href="#">
                    <i class="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                    Activity Log
                </a> */}
              {/* <div class="dropdown-divider"></div> */}
              <a
                className="dropdown-item"
                onClick={handleLogout}
                data-toggle="modal"
                data-target="#logoutModal"
              >
                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                Logout
              </a>
            </div>
          </li>
        </ul>
      </nav>
      {showAdvanceSearch === true && <AdvanceSearch />}
    </>
  );
}

export default Index;
