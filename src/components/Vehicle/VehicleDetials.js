import React from "react";
import { NavLink } from "react-router-dom";
import { Redirect } from "react-router-dom";
import Header from "../Header/Index.js";

import { Formik } from "formik";
import * as Yup from "yup";
import Helper from "../Helper";
import FlashMessage from "../FlashMessage/FlashMessage";
var {
  EditVehicle,
  VehicleMakeList,
  VehicleModelList,
  KeyModelList,
  UpdateVehicleApI
} = require("../Api/ApiRoutes");
var { apiRequest } = require("../Api/Service");

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

function VehicleDetials(props) {
  const [loader, setloader] = React.useState(false);
  const [records, setrecords] = React.useState(undefined);
  const [makeList, setmakeList] = React.useState([]);
  const [modelList, setmodelList] = React.useState([]);
  const[keyDisable,setkeyDisable] = React.useState(false);
  const [keyList, setkeyList] = React.useState([]);
  const [LocalState, Localdispatch] = React.useReducer(reducer, initialState);
  const [redirectToReferrer, setredirectToReferrer] = React.useState(false);
  let id = props.match.params.id;
  var user = Helper.getStorageData("SESSION");
  var user_permissions = user.permissions;

  const VehicleSchema = Yup.object().shape({
    device_code: Yup.string().required("This Field is Required"),
    car_year: Yup.string().required("This Field is Required"),
  });

  React.useEffect(() => {

    // if(Helper.getPermissions(
    //   "vehicle-update",
    //   user_permissions && user_permissions,
    //   "admin"
    // ) || Helper.getPermissions("", [], user.type))
    // {
      Promise.all([
        getVehicle(id),
        getVehicleMakeList(),
      ])
        .then(
          ([
            getVehicle,
            getVehicleMakeList,
          ]) => {
              if (getVehicle.data.code === 200) {
                let data = getVehicle.data.data;
                setrecords(data);
                  getVehicleModelList(data.vehicle_company_id);
                  getKeyModelList(data.vehicle_model_id);
              }
              if (getVehicleMakeList.data.code === 200) {
                setmakeList(getVehicleMakeList.data.data);
              }
            }
        )
        .catch((error) => {
          //console.log(error);
        });

    //}
    
  }, []);

  const getVehicle = (id) => {
    return apiRequest(EditVehicle.method, EditVehicle.url + id);
  };

  const getVehicleMakeList = () => {
    return apiRequest(VehicleMakeList.method, VehicleMakeList.url);
  };
  
  const getVehicleModelList = (vehicle_company_id) => {
    apiRequest(
      VehicleModelList.method,
      VehicleModelList.url + `vehicle_company_id=${vehicle_company_id}`
    )
      .then((response) => {
        if (response.data.code == 200) {
          setmodelList(response.data.data);

        } else {
          //console.log("Failure", response);
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  const getKeyModelList = (vehicle_model_id) => {
    apiRequest(KeyModelList.method, KeyModelList.url + `vehicle_model_id=${vehicle_model_id}`)
      .then((response) => {
        if (response.data.code == 200) {
          setkeyList(response.data.data);
        } else {
          //console.log("Failure", response);
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };

  const handleCar = (event) => {
    let id = event.target.value;
    getVehicleModelList(id);
  };

  const handleModel = (event) => {
    let id = event.target.value;
    getKeyModelList(id);
  };


  const handleSubmit = (values) => {
    const form_data = Helper.formData(values);
    Localdispatch({ type: "DEFAULT", payload: true });
    apiRequest(UpdateVehicleApI.method, UpdateVehicleApI.url + id, form_data)
      .then((response) => {
        if (response.data.code == 200) {
          let data = response.data.data;
          Localdispatch({
            type: "FETCH_SUCCESS",
            payload: response.data.message,
          });
          setTimeout(() => {
            setredirectToReferrer(true);
          }, 2000);
        }
      })
      .catch((error) => {
        //console.log(error);
        Localdispatch({
          type: "FETCH_ERROR",
          payload: error.response.data.data,
        });
        window.scrollTo(500, 0);
      });
  };

  if (redirectToReferrer) {
    return <Redirect to={"/admin/vehicle-list"} />;
  }

  return (
    <React.Fragment>
      {/* <div className="wrapper d-flex align-items-stretch">
        <Sidebar /> */}
        <div id="content">
          <Header />
          {/* {Helper.getPermissions(
            "vehicle-update",
            user_permissions && user_permissions,
            "admin"
          ) || Helper.getPermissions("", [], user.type) ? ( */}
          <div className="p-4">
            {records && (
              <Formik
                validateOnChange={false}
                validationSchema={VehicleSchema}
                onSubmit={(values) => {
                  // same shape as initial values
                  handleSubmit(values);
                }}
                initialValues={{
                  device_code: records && records.detail.device_code,
                  car_year: records && records.year,
                  vehicle_company_id: records && records.vehicle_company_id,
                  vehicle_model_id: records && records.vehicle_model_id,
                  key_id: records && records.key_id,
                  license:records && records.license,
                  color:records && records.colour,
                  tags:records && records.tags,
                  doors: records && records.door_button,
                  trunk_button: records && records.trunk_button,
                  ignition: records && records.ignition,
                  file: records && records.file,
                  share:records && records.share,
                  name:records && records.name,
                  door_button:records && records.door_button,
                  button:0
                }}
              >
                {({
                  handleSubmit,
                  handleChange,
                  isSubmitting,
                  handleBlur,
                  values,
                  touched,
                  isValid,
                  errors,
                }) => (
                  <form className="mt-2 user" onSubmit={handleSubmit}>
                    <FlashMessage
                      success={LocalState.success}
                      isSuccess={LocalState.isSuccess}
                      isError={LocalState.isError}
                      errors={LocalState.errors}
                    />
                    <div className="row">
                      <div className="col-md-7">
                        <div>
                          <p>HW 1.0</p>
                          <p>
                            FW: 1.26{" "}
                            <span className="btn-danger p-1">Update</span>
                          </p>
                          <p>S: 2102884885</p>
                          <p>
                            Operator: <u>ED004850 (Agor Eiskop)</u>
                          </p>
                          <p>
                            Shared <input type="checkbox" name="share"  defaultChecked={values.share} />
                          </p>
                        </div>

                        <div className="form-row">
                      <div className="form-group col-md-6">
                        <label className="form-label">Device code</label>
                        <input
                          type="text"
                          name="device_code"
                          defaultValue={values.device_code}
                          onChange={handleChange}
                          placeholder="DA00504EX0040DF"
                          className={`form-control form-control-user ${
                            errors.device_code ? "error" : ""
                          }`}
                        />
                        {errors.device_code && (
                          <div className="ft-14 mt-1 red">
                            {errors.device_code}
                          </div>
                        )}
                      </div>

                      <div className="form-group col-md-6">
                          <label className="form-label">Car Make</label>
                          <select
                            className="form-control form-select-user"
                            name="vehicle_company_id"
                            value={values.vehicle_company_id}
                            onChange={(e) => {
                              handleCar(e);
                              handleChange(e);
                            }}
                          >
                            <option value="">Select Car Make</option>
                            {makeList &&
                              makeList.map((carMake, index) => (
                                <option value={carMake.id} key={index}>
                                  {carMake.name}
                                </option>
                              ))}
                          </select>
                          {errors.username && touched.username ? (
                            <div className="ft-14 mt-1 red">
                              {errors.username}
                            </div>
                          ) : null}
                        </div>
</div>
<div className="form-row">
                      <div className="form-group col-md-6">
                          <label className="form-label">Car Model</label>
                          <select
                            className="form-control form-select-user"
                            name="vehicle_model_id"
                            value={values.vehicle_model_id}
                            onChange={(e) => {
                              handleModel(e);
                              handleChange(e);
                            }}
                          >
                            <option value="">Select Car Model</option>
                            {modelList &&
                              modelList.map((record, index) => (
                                <option value={record.id} key={index}>
                                  {record.name}
                                </option>
                              ))}
                          </select>
                          {errors.username && touched.username ? (
                            <div className="ft-14 mt-1 red">
                              {errors.username}
                            </div>
                          ) : null}
                        </div>

                        <div className="form-group col-md-6">
                          <label className="form-label">Key Model</label>
                          <select
                            className="form-control form-select-user"
                            name="key_id"
                            disabled={keyDisable}
                            value={values.key_id}
                            onChange={(e) => {
                              handleChange(e);
                            }}
                          >
                            <option value="">Select Key Model</option>
                            {keyList &&
                              keyList.map((record, index) => (
                                <option value={record.id} key={index}>
                                  {record.name}
                                </option>
                              ))}
                          </select>
                          {errors.username && touched.username ? (
                            <div className="ft-14 mt-1 red">
                              {errors.username}
                            </div>
                          ) : null}
                        </div>
</div>
<div className="form-row">
                      <div className="form-group col-md-6">
                        <label className="form-label">Car Name</label>
                        <input
                          type="text"
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          placeholder="Car Name"
                          className={`form-control form-select-user ${
                            errors.name ? "error" : ""
                          }`}
                        />
                        {errors.name && (
                          <div className="ft-14 mt-1 red">{errors.name}</div>
                        )}
                      </div>

                        <div className="form-group col-md-6">
                          <label className="form-label">Car Year</label>
                          <input
                            type="text"
                            name="car_year"
                            defaultValue={values.car_year}
                            onChange={handleChange}
                            placeholder="2011"
                            className={`form-control form-control-user ${
                              errors.car_year ? "error" : ""
                            }`}
                          />
                          {errors.car_year && touched.car_year ? (
                            <div className="ft-14 mt-1 red">
                              {errors.car_year}
                            </div>
                          ) : null}
                        </div>
</div>
<div className="form-row">
                      <div className="form-group col-md-6">
                          <label className="form-label">Licence plate</label>
                          <input
                            type="text"
                            name="licence_plate"
                            defaultValue={records && records.license}
                            onChange={handleChange}
                            placeholder=""
                            className={`form-control form-control-user`}
                          />
                        </div>

                        <div className="form-group col-md-6">
                          <label className="form-label">Car Colour</label>
                          <input
                            type="text"
                            name="color"
                            defaultValue={values.color}
                            onChange={handleChange}
                            placeholder="White"
                            className={`form-control form-control-user`}
                          />
                        </div>
</div>
<div className="form-row">
                      <div className="form-group col-md-6">
                          <label className="form-label">Tags</label>
                          <input
                            type="text"
                            name="tags"
                            defaultValue={values.tags}
                            onChange={handleChange}
                            placeholder="Sportscar, Eco, Supercar, Electric, Hybrid, Hydrogen"
                            className={`form-control form-select-user`}
                          />
                        </div>

                        <div className="form-group  col-md-6">
                          <label className="form-label">Doors</label>
                          <select
                          className={`form-control form-control-user ${
                            errors.doors ? "error" : ""
                          }`}
                          name="doors"
                          value={values.doors}
                          onChange={handleChange}
                        >
                          <option value="">Select Doors</option>
                          <option value="2">2</option>
                          <option value="4">4</option>
                        </select>
                        {errors.doors && (
                          <div className="ft-14 mt-1 red">{errors.doors}</div>
                        )}
                        </div>
</div>
<div className="form-row">
                      <div className="form-group col-md-6">
                          <label className="form-label">
                            Open trunk button
                          </label>
                          <select
                          className={`form-control form-select-user ${
                            errors.trunk_button ? "error" : ""
                          }`}
                          name="trunk_button"
                          value={values.trunk_button}
                          onChange={handleChange}
                        >
                          <option value="">Select Open trunk button</option>
                          <option value={1}>Yes</option>
                          <option value={0}>No</option>
                        </select>
                        {errors.trunk_button && (
                          <div className="ft-14 mt-1 red">{errors.trunk_button}</div>
                        )}
                        </div>

                        <div className="form-group col-md-6">
                          <label className="form-label">Ignition</label>
                          <select
                          className={`form-control form-select-user  ${
                            errors.ignition ? "error" : ""
                          }`}
                          name="ignition"
                          value={values.ignition}
                          onChange={handleChange}
                        >
                          <option value="">Select Ignition</option>
                          <option value={1}>Push-button</option>
                          <option value={0}>Key-ignition</option>
                        </select>
                        {errors.ignition && (
                          <div className="ft-14 mt-1 red">
                            {errors.ignition}
                          </div>
                        )}
                        </div>
                        </div>
                        <div className="form-group">
                        <label className="form-label">Open Door button</label>
                        <select
                          className={`form-control form-select-user ${
                            errors.door_button ? "error" : ""
                          }`}
                          name="door_button"
                          value={values.door_button}
                          onChange={handleChange}
                        >
                          <option value="">Select Open Door button</option>
                          <option value={1}>Yes</option>
                          <option value={0}>No</option>
                        </select>
                        {errors.door_button && (
                          <div className="ft-14 mt-1 red">{errors.door_button}</div>
                        )}
                      </div>
                      </div>
                      <div className="col-md-5">
                        {/* <div className="mb-3">
                          <button className="btn btn-danger">LOCK A CAR</button>
                        </div>
                        <div className="mb-3">
                          <button className="btn btn-success">
                            OPEN A TRUNK
                          </button>
                        </div>
                        <div className="mb-3">
                          <button className="btn btn-danger">UPDATE FW</button>
                        </div> */}

                        {/* <div>
                          <p>Device alarms: -</p>
                          <p>
                            Car alarms:{" "}
                            <span style={{ color: "red" }}>
                              Engine light on (20 days)
                            </span>
                          </p>
                        </div> */}

                        {/* <div>
                          <p>Last seen: 30 seconds ago</p>
                          <p>Status: Sleep mode</p>
                        </div>

                        <div>
                          <p>Odometer: 140 000 km</p>
                          <p>Fuel level: 20%</p>
                          <p>Engine: Not running</p>
                          <p>Central lock: Open</p>
                          <p>Doors: Closed</p>
                          <p>Trunk: Closed</p>
                        </div> */}
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group d-flex justify-content-end col-md-12">
                        <button type="submit " className="btn-submit btn-user">
                          confirm Details
                        </button>
                      </div>
                    </div>
                    <div className="">
                      <p>
                        Location: <u>Tuukri 50, Tallinn, Estonia</u>
                        <i
                          style={{ color: "green" }}
                          className="fa fa-map-marker-alt pl-1"
                        ></i>
                      </p>
                      <p>
                        Current user: <u>AHDKKRD (A. Eiskop)</u>
                      </p>
                      <p>Last usage: 14.12.2020 14:00, 6km</p>
                    </div>

                    <div className="">
                      <p>Last usage: 14.12.2020 14:00, 6km</p>
                      <p>
                        <b>Usage list</b>
                      </p>
                    </div>

                    <div className="">
                      <p>Last shared: 10.11.2020 11:20</p>
                      <p>
                        <b>Shared list</b>
                      </p>
                    </div>

                    <div className="">
                      <p>
                        Last action: Open door 14.12.2020 14:00, by Agor Eiskop
                        (user)
                      </p>
                      <p>
                        <b>Action history will be on that page</b>
                      </p>
                    </div>
                  </form>
                )}
              </Formik>
            )}
          </div>
          {/* ) : (
            <div className="p-4">
              <div className="text-center ft-14 mt-3 font-weight-bold">
                You are  to visit this screen...
              </div>
            </div>
          )} */}
        </div>
      {/* </div> */}
    </React.Fragment>
  );
}

export default VehicleDetials;
