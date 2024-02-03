import React from "react";
import { Redirect } from "react-router-dom";
import Header from "../Header/Index.js";

import moment from 'moment';
import { Formik, Field, Form, FieldArray } from "formik";
import * as Yup from "yup";
import FlashMessage from "../FlashMessage/FlashMessage";
var { apiRequest } = require("../Api/Service");
var { SoftwareAddAPI, UserPermissions, HardwareList ,DeviceAddAPI,DeviceEditAPI,DeviceUpdateAPI} = require("../Api/ApiRoutes");
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
        disable: true,
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

function EditDevicesCode(props) {
  const DetailSchema = Yup.object().shape({
    //serial: Yup.string().required("This Field is Required"),
    //device: Yup.mixed().required("This Field is Required"),
    //manufacturing_date:Yup.mixed().required(),
   
    
   
  });

  const [LocalState, Localdispatch] = React.useReducer(reducer, initialState);
  const [redirectToReferrer, setredirectToReferrer] = React.useState(false);
  const [userpermissions, setPermissions] = React.useState([]);
  const [record, setRecord] = React.useState(undefined);
  const [sethardwarelist, setHardwarelist] = React.useState([]);
  var user = Helper.getStorageData("SESSION");
  var user_permissions = user.permissions;
  let id = props.match.params.id;

  React.useEffect(()=>{
    // if(Helper.getPermissions(
    //   "share-update",
    //   user_permissions && user_permissions,
    //   "admin"
    // ) || (Helper.getPermissions('',[], user.type ))){
    apiRequest(DeviceEditAPI.method, DeviceEditAPI.url + id)
      .then((response) => {
        let data = response.data.data;
        setRecord(data);
        if (response.data.code == 200) {
         
        }
      })
      .catch((error) => {
        console.log(error);
      
      });

      // apiRequest(GetVehicles.method, GetVehicles.url)
      // .then((response) => {
      //   if (response.data.code == 200) {
      //     let data = response.data.data;
      //     setvehicles(data);
      //   }
      // })
      // .catch((error) => {
      //   console.log(error);
      // });
    //}
  },[])


  const handleSubmit = (values) => {
    // const form_data = Helper.formData(values);
    const form_data = new FormData();
    form_data.append("id", id);
    form_data.append('serial', values.serial);
    form_data.append('device', values.device);
    form_data.append('manufacturing_date', values.manufacturing_date);
    form_data.append('hardware_id', values.hardware_id);
    form_data.append('server_fallback_path', values.server_fallback_path);
    form_data.append('server_path', values.server_path);

    // for (let index = 0; index < values.hardwarelist.length; index++) {
    //   form_data.append('hardware_id', values.hardwarelist[index])
    // }
    
    
    Localdispatch({ type: "DEFAULT", payload: true });
    apiRequest(DeviceUpdateAPI.method, DeviceUpdateAPI.url + id, form_data)
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

  React.useEffect(() => {
    apiRequest(UserPermissions.method, UserPermissions.url)
      .then((response) => {
        if (response.data.code == 200) {
          let data = response.data.data;
          setPermissions(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  React.useEffect(() => {
    apiRequest(HardwareList.method, HardwareList.url)
      .then((response) => {
        if (response.data.code === 200) {
          let data = response.data.data;
          setHardwarelist(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  if (redirectToReferrer) {
    return <Redirect to={"/admin/devices-code-list"} />;
  }

  return (
    <React.Fragment>
      {/* <div className="wrapper d-flex align-items-stretch">
        <Sidebar /> */}
        <div id="content">
          <Header />
          {/* {Helper.getPermissions(
            "admin-create",
            user_permissions && user_permissions,
            "admin"
          ) || Helper.getPermissions("", [], user.type) ? ( */}
            <div className="p-4">
              <h4 className="mb-3">Edit Device Code</h4>
              {record && 
              <Formik 
                validateOnChange={false}
                validationSchema={DetailSchema}
                onSubmit={async (values) => {
                  // console.log("permissions: ", values);
                  handleSubmit(values);
                }}
                initialValues={{
                  serial: record.serial,
                  device: record.device,
                  manufacturing_date: record.manufacturing_date,
                  // hardwarelist:[],
                   hardware_id: record.hardware_id,
                   server_fallback_path: record.server_fallback_path,
                   server_path: record.server_path,
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
                  <Form className="mt-2 user">
                    <FlashMessage
                      success={LocalState.success}
                      isSuccess={LocalState.isSuccess}
                      isError={LocalState.isError}
                      errors={LocalState.errors}
                    />
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label className="form-label">Device Code#</label>
                        <input
                          type="text"
                          name="serial"
                          value={values.serial}
                          onChange={handleChange}
                          placeholder="Device Code"
                          className={`form-control form-control-user ${
                            errors.serial ? "error" : ""
                          }`}
                        />
                        {errors.serial && (
                          <div className="ft-14 mt-1 red">{errors.serial}</div>
                        )}
                      </div>
                      <div className="form-group col-md-6">
                      <label className="form-label">Device/Product</label>
                        <input
                          type="text"
                          name="device"
                          value={values.device}
                          onChange={handleChange}
                          placeholder="Device Product"
                          className={`form-control form-control-user ${
                            errors.device ? "error" : ""
                          }`}
                        />
                        {errors.device && (
                          <div className="ft-14 mt-1 red">{errors.device}</div>
                        )}
                      </div>
                    </div>
                    
                  
                    <div className="form-row">
                    <div className="form-group col-md-6">
                        <label className="form-label">Hardware Version List</label>
                        
                        <select
                          className={`form-control form-select-user ${
                            errors.id ? "error" : ""
                          }`}
                          name="hardware_id"
                          defaultValue={values.version}
                          value={values.hardware_id}
                          onChange={(e) => {
                          //   setkeyList([]);
                          //   handleCar(e);
                            handleChange(e);
                          }}
                        >
                          <option value="" selected="selected">Select Hardware Version</option>
                          {sethardwarelist &&
                            sethardwarelist.map((HardwareList, index) => (
                              <option value={HardwareList.id} key={index}>
                                {HardwareList.version}
                              </option>
                            ))}
                        </select>
                        {errors.id && (
                          <div className="ft-14 mt-1 red">
                            {errors.id}
                          </div>
                        )}
                      
                        {/* <FieldArray
                          name="hardwarelist"
                          render={(arrayHelpers) => (
                            <div>
                              {sethardwarelist &&
                                sethardwarelist.map((hardwarelist) => (
                                  <div key={hardwarelist.id}>
                                    <label
                                      htmlFor={`hardwarelist-${hardwarelist.id}`}
                                    >
                                      <input
                                        name="hardwarelist"
                                        type="checkbox"
                                        id={`hardwarelist-${hardwarelist.id}`}
                                        value={hardwarelist.id}
                                        checked={values.hardwarelist.includes(
                                          hardwarelist.id
                                        )}
                                        onChange={(e) => {
                                          if (e.target.checked)
                                            arrayHelpers.push(hardwarelist.id);
                                          else {
                                            const idx = values.hardwarelist.indexOf(
                                              hardwarelist.id
                                            );
                                            arrayHelpers.remove(idx);
                                          }
                                        }}
                                      />{" "}
                                      {hardwarelist.version}
                                    </label>
                                  </div>
                                ))}
                            </div>
                          )}
                        />
                       {errors.hardwarelist && (
                          <div className="ft-14 mt-1 red">
                            {errors.hardwarelist}
                          </div>
                        )} */}
                      </div>

                  <div className="form-group col-md-6">
                     
                <label className="mr-sm-3 form-label">Manufacturing date</label>
                <input
                  type="date"
                  name="manufacturing_date"
                  value={moment(values.manufacturing_date).format('YYYY-MM-DD')}
                  onChange={handleChange}
                  className={`form-control form-select-user ${errors.manufacturing_date ? "error" : ""}`}
                />
                {errors.manufacturing_date ? (
                  <div className="ft-14 mt-1 red">{errors.manufacturing_date}</div>
                ) : null}
              
                        
                      </div>
                      
                      <div className="form-group col-md-6">
                        <label className="form-label">Server fallback Path</label>
                        <input
                          type="text"
                          name="server_fallback_path"
                          value={values.server_fallback_path}
                          onChange={handleChange}
                          placeholder="Server fallback Path"
                          className={`form-control form-control-user ${
                            errors.server_fallback_path ? "error" : ""
                          }`}
                        />
                        {errors.server_fallback_path && (
                          <div className="ft-14 mt-1 red">{errors.server_fallback_path}</div>
                        )}
                      </div>
                      <div className="form-group col-md-6">
                      <label className="form-label">Server Path</label>
                        <input
                          type="text"
                          name="server_path"
                          value={values.server_path}
                          onChange={handleChange}
                          placeholder="Server Path"
                          className={`form-control form-control-user ${
                            errors.server_path ? "error" : ""
                          }`}
                        />
                        {errors.server_path && (
                          <div className="ft-14 mt-1 red">{errors.server_path}</div>
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
                  </Form>
                )}
              </Formik>
}
              {/* <div className="row">
                <div className="col-md-12 mb-4">
                  Usages: <u>20</u>
                </div>
                <div className="col-md-12">
                  Drivers behaviour score: <u>4.5</u>
                </div>
              </div> */}
            </div>
          {/* ) : (
            <div className="p-4">
              <div className="text-center ft-14 mt-3 font-weight-bold">
                You are not allowed to visit this screen...
              </div>
            </div>
          )} */}
        </div>
      {/* </div> */}
    </React.Fragment>
  );
}

export default EditDevicesCode;