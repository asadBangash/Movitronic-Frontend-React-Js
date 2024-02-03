import React from "react";
import { NavLink } from "react-router-dom";
import Header from "../Header/Index.js";
import { Redirect } from "react-router-dom";

import { Formik } from "formik";
import * as Yup from "yup";
import FlashMessage from "../FlashMessage/FlashMessage";
var { apiRequest } = require("../Api/Service");
var {
  AddVehicleAPI,
  VehicleMakeList,
  VehicleModelList,
  KeyModelList,
} = require("../Api/ApiRoutes");
const Helper = require("../Helper");

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

function AddVehicle() {
  const VehicleSchema = Yup.object().shape({
    device_code: Yup.string().required("This Field is Required"),
    name: Yup.string().required("This Field is Required"),
    year: Yup.string().required("This Field is Required"),
    vehicle_model_id: Yup.string().required("This Field is Required"),
    vehicle_company_id: Yup.string().required("This Field is Required"),
    key_id: Yup.string().required("This Field is Required"),
    license: Yup.string().required("This Field is Required"),
    color: Yup.string().required("This Field is Required"),
    tags: Yup.string().required("This Field is Required"),
    door: Yup.string().required("This Field is Required"),
    door_button: Yup.string().required("This Field is Required"),
    ignition: Yup.string().required("This Field is Required"),
    file: Yup.mixed().required(), //.required("This Field is Required"),
    trunk_button: Yup.string().required("This Field is Required"),
  });

  const [makeList, setmakeList] = React.useState([]);
  const [modelList, setmodelList] = React.useState([]);
  const [keyList, setkeyList] = React.useState([]);

  React.useEffect(() => {
    apiRequest(VehicleMakeList.method, VehicleMakeList.url)
      .then((response) => {
        if (response.data.code == 200) {
          setmakeList(response.data.data);
        } else {
          console.log("Failure", response);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [LocalState, Localdispatch] = React.useReducer(reducer, initialState);
  const [redirectToReferrer, setredirectToReferrer] = React.useState(false);
  var user = Helper.getStorageData("SESSION");
  var permissions = user.permissions;

  const handleCar = (event) => {
    let id = event.target.value;

    apiRequest(
      VehicleModelList.method,
      VehicleModelList.url + `vehicle_company_id=${id}`
    )
      .then((response) => {
        if (response.data.code == 200) {
          setmodelList(response.data.data);
        } else {
          console.log("Failure", response);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleModel = (event) => {
    let id = event.target.value;
    apiRequest(KeyModelList.method, KeyModelList.url + `vehicle_model_id=${id}`)
      .then((response) => {
        if (response.data.code == 200) {
          setkeyList(response.data.data);
        } else {
          console.log("Failure", response);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = (values) => {
    const form_data = Helper.formData(values);
    Localdispatch({ type: "DEFAULT", payload: true });
    apiRequest(AddVehicleAPI.method, AddVehicleAPI.url, form_data)
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
        console.log(error);
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
            "vehicle-create",
            permissions && permissions,
            "admin"
          ) || Helper.getPermissions("", [], user.type) ? ( */}
            <div className="p-4">
            <div className="text-left">
                                <h1 className="h4 text-gray-900 mb-4">Create Vehicle</h1>
                            </div>
              <Formik
                validateOnChange={false}
                validationSchema={VehicleSchema}
                onSubmit={(values) => {
                  // same shape as initial values
                  handleSubmit(values);
                }}
                initialValues={{
                  device_code: "",
                  name: "",
                  vehicle_model_id: "",
                  vehicle_company_id: "",
                  year: "",
                  key_id: "",
                  license: "",
                  color: "",
                  tags: "",
                  door: "",
                  door_button: "",
                  ignition: "",
                  file: undefined,
                  trunk_button: "",
                }}
              >
                {({
                  handleSubmit,
                  handleChange,
                  isSubmitting,
                  setFieldValue,
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
                    {/* <div className="p-2">
                      <NavLink
                        exact
                        to={`/admin/add-company-name`}
                        className="btn white bg-orange"
                      >
                        Add Company Vehicle
                      </NavLink>
                    </div> */}
                    <div className="form-row">
                      <div className="form-group col-md-6">
                      
                        <input
                          type="text"
                          name="device_code"
                          onChange={handleChange}
                          placeholder="Enter Device Code"
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
                        
                        <select
                          className={`form-control form-select-user ${
                            errors.vehicle_company_id ? "error" : ""
                          }`}
                          name="vehicle_company_id"
                          defaultValue={values.name}
                          onChange={(e) => {
                            setkeyList([]);
                            handleCar(e);
                            handleChange(e);
                          }}
                        >
                          <option value="" selected="selected">Select Car Make</option>
                          {makeList &&
                            makeList.map((carMake, index) => (
                              <option value={carMake.id} key={index}>
                                {carMake.name}
                              </option>
                            ))}
                        </select>
                        {errors.vehicle_company_id && (
                          <div className="ft-14 mt-1 red">
                            {errors.vehicle_company_id}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-6">
                      
                        <select
                          className={`form-control form-select-user ${
                            errors.vehicle_model_id ? "error" : ""
                          }`}
                          name="vehicle_model_id"
                          onChange={(e) => {
                            handleModel(e);
                            handleChange(e);
                          }}
                        >
                          <option value="" selected="selected">Select Car Model</option>
                          {modelList &&
                            modelList.map((modelName, index) => (
                              <option value={modelName.id} key={index}>
                                {modelName.name}
                              </option>
                            ))}
                        </select>
                        {errors.vehicle_model_id && (
                          <div className="ft-14 mt-1 red">
                            {errors.vehicle_model_id}
                          </div>
                        )}
                      </div>
                      <div className="form-group col-md-6">
                    
                        <select
                          className={`form-control form-select-user ${
                            errors.key_id ? "error" : ""
                          }`}
                          name="key_id"
                          onChange={handleChange}
                        >
                          <option value="" selected="selected">Select Key Model</option>
                          {keyList && 
                            keyList.map((keyName, index) => (
                              <option value={keyName.id} key={index}>
                                {keyName.name}
                              </option>
                            ))}
                        </select>
                        {errors.key_id && (
                          <div className="ft-14 mt-1 red">{errors.key_id}</div>
                        )}

                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-6">
          
                        <input
                          type="number"
                          name="year" 
                         value={values.year || ""}
                          onChange={handleChange}
                          placeholder="2011"
                          className={`form-control form-control-user ${
                            errors.year ? "error" : ""
                          }`}
                        />
                        {errors.year && (
                          <div className="ft-14 mt-1 red">{errors.year}</div>
                        )}
                      </div>
                      <div className="form-group col-md-6">
                      
                        <input
                          type="text"
                          name="license"
                          value={values.license || ""}
                          onChange={handleChange}
                          placeholder="999 UFO"
                          className={`form-control form-control-user ${
                            errors.license ? "error" : ""
                          }`}
                        />
                        {errors.license && (
                          <div className="ft-14 mt-1 red">{errors.license}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-6">
                       
                        <input
                          type="text"
                          name="name"
                          value={values.name || ""}
                          onChange={handleChange}
                          placeholder="Car Name"
                          className={`form-control form-control-user ${
                            errors.name ? "error" : ""
                          }`}
                        />
                        {errors.name && (
                          <div className="ft-14 mt-1 red">{errors.name}</div>
                        )}
                      </div>
                      <div className="form-group col-md-6">
                      
                        <input
                          id="file"
                          type="file"
                          name="file"
                          accept="images/*"
                          onChange={(event) => {
                            setFieldValue("file", event.currentTarget.files[0]);
                          }}
                          className={`form-control form-select-user  ${
                            errors.file ? "error" : ""
                          }`}
                        />
                        {errors.file && (
                          <div className="ft-14 mt-1 red">{errors.file}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-6">
                      
                        <input
                          type="text"
                          name="color"
                          value={values.color || ""}
                          onChange={handleChange}
                          placeholder="White"
                          className={`form-control form-control-user ${
                            errors.color ? "error" : ""
                          }`}
                        />
                        {errors.color && (
                          <div className="ft-14 mt-1 red">{errors.color}</div>
                        )}
                      </div>
                      <div className="form-group col-md-6">
                     
                        <input
                          type="text"
                          name="tags"
                          value={values.tags || ""}
                          onChange={handleChange}
                          placeholder="Sportscar, Eco, Supercar, Electric, Hybrid, Hydrogen"
                          className={`form-control form-control-user ${
                            errors.tags ? "error" : ""
                          }`}
                        />
                        {errors.tags && (
                          <div className="ft-14 mt-1 red">{errors.tags}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        
                        <select
                          className={`form-control form-select-user ${
                            errors.door ? "error" : ""
                          }`}
                          name="door"
                          onChange={handleChange}
                        >
                          <option value="">Select Doors</option>
                          <option value="2">2</option>
                          <option value="4">4</option>
                        </select>
                        {errors.door && (
                          <div className="ft-14 mt-1 red">{errors.door}</div>
                        )}
                      </div>
                      <div className="form-group col-md-6">
                     
                        <select
                          className={`form-control form-select-user${
                            errors.trunk_button ? "error" : ""
                          }`}
                          name="trunk_button"
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
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-6">
                       
                        <select
                          className={`form-control form-select-user ${
                            errors.ignition ? "error" : ""
                          }`}
                          name="ignition"
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
                      <div className="form-group col-md-6">
                     
                        <select
                          className={`form-control  form-select-user ${
                            errors.door_button ? "error" : ""
                          }`}
                          name="door_button"
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
                    <div className="form-row">
                      <div className="form-group d-flex justify-content-end col-md-12">
                        <button
                          type="submit"
                          className="btn-submit btn-user"
                          disabled={LocalState.disable}
                        >
                          confirm Details
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
                  </form>
                )}
              </Formik>
            </div>
          {/* // ) : (
          //   <div className="p-4">
          //     <div className="text-center ft-14 mt-3 font-weight-bold">
          //       You are not allowed to visit this screen...
          //     </div>
          //   </div>
          // )} */}
        </div>
      {/* </div> */}


    </React.Fragment>
    
  );
  
}

export default AddVehicle;
