import React, { useContext } from "react";
import { Context } from "../Store/Store";
import Helper from "../Helper";
var { apiRequest } = require("../Api/Service");
var { SearchApi } = require("../Api/ApiRoutes");
//const Helper = require('../Helper');

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

function AdvanceSearch() {
  const [state, dispatch] = useContext(Context);
  const [LocalState, Localdispatch] = React.useReducer(reducer, initialState);
  const [loader, setloader] = React.useState(false);
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
          dispatch({ type: "SET_STATE", response: data, advanceSearch: true });
          Helper.overlay(false);
          setloader(false);
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
    <div className="" id="">
      <div className="pt-3">
        {loader && (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-info" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
      
          <form className=" ft-14" onSubmit={handleSubmit}>
        <aside className="">
          <div className="card">
            <article className="card-group-item">
              <header className="card-header">
                <h6 className="title">Advanced Filter </h6>
              </header>
              <div className="filter-content">
                <div className="card-body">
                  <div className="form-group row">
                    <label className="col-md-6 font-weight-bold">Number Plate</label>
                    <input
                      type="text"
                      className="form-control col-md-6"
                      name="license"
                    />
                  </div>
                  <div className="form-group row">
                    <label className="col-md-6 font-weight-bold">Car Name</label>
                    <input
                      type="text"
                      className="form-control col-md-6"
                      name="name"
                    />
                  </div>
                  <div className="form-group row">
                    <label className="col-md-6 font-weight-bold">Car make/model</label>
                    <input
                      type="text"
                      name="model"
                      className="form-control col-md-6"
                    />
                  </div>
                  <div className="form-group row">
                    <label className="col-md-6 font-weight-bold">Car Year</label>
                    <div className="input-group col-md-6 p-0">
                      <input type="text" className="form-control" name="year" />
                      {/* <input type="text" className="form-control" /> */}
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="inlineCheckbox1"
                        defaultValue={1}
                        name="ignition"
                      />
                      <label
                        className="form-check-label font-weight-bold"
                        htmlFor="inlineCheckbox1"
                      >
                        Push Start
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="inlineCheckbox2"
                        defaultValue={1}
                        name="ignition"
                      />
                      <label
                        className="form-check-label font-weight-bold"
                        htmlFor="inlineCheckbox2"
                      >
                        Key-ignition
                      </label>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-6 font-weight-bold">Tags</label>
                    <input
                      type="text"
                      className="form-control col-md-6"
                      name="tags"
                    />
                  </div>
                  <div className="form-group row">
                    <label className="col-md-6 font-weight-bold">Location</label>
                    <input
                      type="text"
                      className="form-control col-md-6"
                      name="location"
                    />
                  </div>
                  <div className="form-group row">
                    <label className="col-md-6 font-weight-bold">Operator</label>
                    <input
                      type="text"
                      className="form-control col-md-6"
                      name="operator"
                    />
                  </div>
                </div>
              </div>
            </article>

            <article className="card-group-item">
              <header className="card-header">
                <h6 className="title">Status </h6>
              </header>
              <div className="filter-content">
                <div className="card-body">
                  <div className="mb-2">
                    <strong></strong>
                  </div>

                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="engine_running"
                      name="engine_running"
                      value="true"
                    />
                    <label
                      className="form-check-label font-weight-bold"
                      htmlFor="engine_running"
                    >
                      Engine running
                    </label>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="Stand_by"
                      name="Stand_by"
                      value="true"
                    />
                    <label className="form-check-label font-weight-bold" htmlFor="Stand_by">
                      Stand-by
                    </label>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="sleep_mode"
                      name="sleep_mode"
                      value="true"
                    />
                    <label className="form-check-label font-weight-bold" htmlFor="sleep_mode">
                      Sleep mode
                    </label>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="not_responding"
                      name="not_responding"
                      value="true"
                    />
                    <label
                      className="form-check-label font-weight-bold"
                      htmlFor="not_responding"
                    >
                      Not responding
                    </label>
                  </div>
                  <div className="mb-2 mt-2">
                    <strong>Usage:</strong>
                  </div>
                  <div className="form-group">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="in_use"
                        value="true"
                        name="in_use"
                      />
                      <label className="form-check-label font-weight-bold" htmlFor="in_use">
                        In Use
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="idle"
                        value="false"
                        name="idle"
                      />
                      <label className="form-check-label font-weight-bold" htmlFor="idle">
                        Idle
                      </label>
                    </div>
                  </div>

                  <div className="mb-2 mt-2">
                    <strong>Shared:</strong>
                  </div>
                  <div className="form-group">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="shared"
                        value="true"
                        name="share"
                      />
                      <label className="form-check-label font-weight-bold" htmlFor="shared">
                        Shared
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="not_shared"
                        name="not_shared"
                        value="false"
                      />
                      <label className="form-check-label font-weight-bold" htmlFor="not_shared">
                        Not Shared
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <article className="card-group-item">
              <header className="card-header">
                <h6 className="title">Car Alarms</h6>
              </header>
              <div className="filter-content">
                <div className="card-body">
                  <div className="mb-2">
                    <strong></strong>
                  </div>

                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="low_fuel"
                      value="true"
                      name="low_fuel"
                    />
                    <label className="form-check-label font-weight-bold" htmlFor="low_fuel">
                      Low fuel
                    </label>
                  </div>

                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="car_battery_low"
                      value="true"
                      name="car_battery_low"
                    />
                    <label
                      className="form-check-label font-weight-bold"
                      htmlFor="car_battery_low"
                    >
                      Car battery low
                    </label>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="car_disconnected"
                      value="true"
                      name="car_disconnected"
                    />
                    <label
                      className="form-check-label font-weight-bold"
                      htmlFor="car_disconnected"
                    >
                      Car battery disconnected
                    </label>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input font-weight-bold"
                      id="breakdown_light"
                      name="breakdown_light"
                      value="true"
                    />
                    <label
                      className="form-check-label font-weight-bold"
                      htmlFor="breakdown_light"
                    >
                      Engine breakdown light on
                    </label>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input font-weight-bold"
                      id="Lightbulb_error"
                      name="Lightbulb_error"
                      value="true"
                    />
                    <label
                      className="form-check-label font-weight-bold"
                      htmlFor="Lightbulb_error"
                    >
                      Lightbulb error
                    </label>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="Service_light_on"
                      name="Service_light_on"
                      value="true"
                    />
                    <label
                      className="form-check-label font-weight-bold"
                      htmlFor="Service__light_on"
                    >
                      Service due light on
                    </label>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="Door_Trunk_left_open"
                      value="true"
                      name="Door_Trunk_left_open"
                    />
                    <label
                      className="form-check-label font-weight-bold"
                      htmlFor="Door_Trunk_left_open"
                    >
                      Door/Trunk left open
                    </label>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="Possible_crash"
                      value="true"
                      name="Possible_crash"
                    />
                    <label
                      className="form-check-label font-weight-bold"
                      htmlFor="Possible_crash"
                    >
                      Possible crash
                    </label>
                  </div>
                </div>
              </div>
            </article>

            <article className="card-group-item">
              <header className="card-header">
                <h6 className="title">Device Alarms </h6>
              </header>
              <div className="filter-content">
                <div className="card-body">
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="Damper_alarm"
                      value="true"
                      name="Damper_alarm"
                    />
                    <label className="form-check-label font-weight-bold" htmlFor="Damper_alarm">
                      Damper alarm
                    </label>
                  </div>

                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="Device_battery_low"
                      value="true"
                      name="Device_battery_low"
                    />
                    <label
                      className="form-check-label font-weight-bold"
                      htmlFor="Device_battery_low"
                    >
                      Device battery low
                    </label>
                  </div>

                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="Hardware_error"
                      value="true"
                      name="Hardware_error"
                    />
                    <label
                      className="form-check-label font-weight-bold"
                      htmlFor="Hardware_error"
                    >
                      Hardware error
                    </label>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="Not_configured"
                      value="true"
                      name="Not_configured"
                    />
                    <label
                      className="form-check-label font-weight-bold"
                      htmlFor="Not_configured"
                    >
                      Not configured
                    </label>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="Key_missing"
                      value="true"
                      name="Key_missing"
                    />
                    <label className="form-check-label font-weight-bold" htmlFor="Key_missing">
                      Key missing from holder
                    </label>
                  </div>
                  <div className="mb-2">
                    <strong>Central lock:</strong>
                  </div>

                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input " 
                      id="Closed"
                      value="true"
                      name="Closed"
                    />
                    <label className="form-check-label font-weight-bold" htmlFor="Closed">
                      Closed
                    </label>
                  </div>

                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="Open"
                      value="true"
                      name="Open"
                    />
                    <label className="form-check-label font-weight-bold" htmlFor="Open">
                      Open
                    </label>
                  </div>
                  <button
            type="submit"
            className="btn btnn-user btn-primary"
            disabled={LocalState.disable}
          >
            Submit
            {LocalState.disable ? (
              <span
                className="ml-2 spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              ""
            )}
          </button>
                </div>
              </div>
            </article>
          </div>
        </aside>
        </form>
      </div>
    </div>
  );
}

export default AdvanceSearch;
