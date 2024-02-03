import React from "react";
import { Redirect } from "react-router-dom";
import Header from "../Header/Index.js";

import { Formik, Field, Form, FieldArray } from "formik";
import * as Yup from "yup";
import FlashMessage from "../FlashMessage/FlashMessage";
var { apiRequest } = require("../Api/Service");
var { SoftwareAddAPI, UserPermissions , HardwareList} = require("../Api/ApiRoutes");
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

function AddSoftwareUpload() {
  const DetailSchema = Yup.object().shape({
    version: Yup.string().required("This Field is Required"),
    file: Yup.mixed().required(),
   
  });

  const [LocalState, Localdispatch] = React.useReducer(reducer, initialState);
  const [redirectToReferrer, setredirectToReferrer] = React.useState(false);
  const [userpermissions, setPermissions] = React.useState([]);
  const [sethardwarelist, setHardwarelist] = React.useState([]);
  
  var user = Helper.getStorageData("SESSION");
  var user_permissions = user.permissions;

  const handleSubmit = (values) => {
    // const form_data = Helper.formData(values);
    const form_data = new FormData();
    form_data.append('version', values.version);
    form_data.append('file', values.file); 
    for (let index = 0; index < values.hardwarelist.length; index++) {
      form_data.append('hardware[]', values.hardwarelist[index])
    }
    
    
    
    Localdispatch({ type: "DEFAULT", payload: true });
    apiRequest(SoftwareAddAPI.method, SoftwareAddAPI.url, form_data)
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

  if (redirectToReferrer) {
    return <Redirect to={"/admin/software-upload-list"} />;
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
              <h4 className="mb-3">Upload Software</h4>
              <Formik 
                validateOnChange={false}
                validationSchema={DetailSchema}
                onSubmit={async (values) => {
                  // console.log("permissions: ", values);
                  handleSubmit(values);
                }}
                initialValues={{
                  version: "",
                  file: undefined,
                  hardwarelist:[],
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
                      <div className="form-group  col-md-6">
                        <label className="form-label">Version#</label>
                        <input
                          type="text"
                          name="version"
                          value={values.version || ""}
                          onChange={handleChange}
                          placeholder="Enter Version"
                          className={`form-control form-control-user ${
                            errors.version ? "error" : ""
                          }`}
                        />
                        {errors.version && (
                          <div className="ft-14 mt-1 red">{errors.version}</div>
                        )}
                      </div>
                      <div className="form-group col-md-6">
                      <label className="form-label" htmlFor="file">
                          File
                        </label>
                        <input
                          id="file"
                          type="file"
                          name="file"
                          onChange={(event) => {
                            setFieldValue(
                              "file",
                              event.currentTarget.files[0]
                            );
                          }}
                          className={`form-control form-control-user ${
                            errors.file ? "error" : ""
                          }`}
                        />
                        {errors.file && (
                          <div className="ft-14 mt-1 red">{errors.file}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-group col-md-2">
                        <label className="form-label">Hardware Version List</label>
                        <FieldArray
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
                        )}
                      </div>
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        
                      </div>
                      <div className="form-group col-md-6">
                        
                      </div>
                 


                    </div>
                    <div className="form-row">
                      <div className="form-group d-flex justify-content-end col-md-12">
                        <button
                          type="submit"
                          className="btn-submit"
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

export default AddSoftwareUpload;