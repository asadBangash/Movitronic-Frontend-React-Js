import React from "react";
import { Redirect } from "react-router-dom";
import Header from "../Header/Index.js";

import { Formik, Field, Form, FieldArray } from "formik";
import * as Yup from "yup";
import FlashMessage from "../FlashMessage/FlashMessage";
var { apiRequest } = require("../Api/Service");
var { AddUser, UserPermissions } = require("../Api/ApiRoutes");
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

function AddUsersDetail() {
  const DetailSchema = Yup.object().shape({
  name: Yup.string().required("This Field is Required"),
  email: Yup.string().email().required("This Field is Required"),
   contact_no: Yup.number().required("This Field is Required"),
    password: Yup.string().required("This Field is Required"),
    image: Yup.mixed().required(),
    password_confirmation: Yup.string().required("This Field is Required")
     .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const [LocalState, Localdispatch] = React.useReducer(reducer, initialState);
  const [redirectToReferrer, setredirectToReferrer] = React.useState(false);
  const [userpermissions, setPermissions] = React.useState([]);
  var user = Helper.getStorageData("SESSION");
  var user_permissions = user.permissions;

  const handleSubmit = (values) => {
    // const form_data = Helper.formData(values);
    const form_data = new FormData();
    form_data.append('name', values.name);
    form_data.append('email', values.email);
    form_data.append('contact_no', values.contact_no);
    form_data.append('password', values.password); 
    form_data.append('password_confirmation', values.password_confirmation);
    form_data.append('image', values.image); 
    form_data.append("type", 3);
    
    
    Localdispatch({ type: "DEFAULT", payload: true });
    apiRequest(AddUser.method, AddUser.url, form_data)
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

  if (redirectToReferrer) {
    return <Redirect to={"/admin/current-user-list"} />;
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
              <h4 className="mb-3">Add User</h4>
              <Formik 
                validateOnChange={false}
                validationSchema={DetailSchema}
                onSubmit={async (values) => {
                  // console.log("permissions: ", values);
                  handleSubmit(values);
                }}
                initialValues={{
                  name: "",
                  email: "",
                  contact_no: "",
                  password: "",
                  password_confirmation: "",
                  image: undefined,
                  permissions: [],
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
                        <label className="form-label">Your Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={values.name || ""}
                          onChange={handleChange}
                          placeholder="Enter Your Name"
                          className={`form-control form-control-user ${
                            errors.name ? "error" : ""
                          }`}
                        />
                        {errors.name && (
                          <div className="ft-14 mt-1 red">{errors.name}</div>
                        )}
                      </div>
                      <div className="form-group col-md-6">
                        <label className="form-label">Email</label>
                        <input
                          type="text"
                          name="email"
                          value={values.email || ""}
                          onChange={handleChange}
                          placeholder="Enter Your Email"
                          className={`form-control form-control-user ${
                            errors.email ? "error" : ""
                          }`}
                        />
                        {errors.email && (
                          <div className="ft-14 mt-1 red">{errors.email}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label className="form-label">Password</label>
                        <input
                          type="password"
                          name="password"
                          value={values.password || ""}
                          onChange={handleChange}
                          placeholder="**********"
                          className={`form-control form-control-user ${
                            errors.password ? "error" : ""
                          }`}
                        />
                        {errors.password && touched.password ? (
                          <div className="ft-14 mt-1 red">
                            {errors.password}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group col-md-6">
                        <label className="form-label">RepeatPassword</label>
                        <input
                          type="password"
                          name="password_confirmation"
                          value={values.password_confirmation || ""}
                          onChange={handleChange}
                          placeholder="*********"
                          className={`form-control form-control-user ${
                            errors.password_confirmation ? "error" : ""
                          }`}
                        />
                        {errors.password_confirmation && (
                          <div className="ft-14 mt-1 red">
                            {errors.password_confirmation}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label className="form-label">Contact</label>
                        <input
                          type="text"
                          name="contact_no"
                          value={values.contact_no || ""}
                          onChange={handleChange}
                          placeholder="Enter Your Contact"
                          className={`form-control form-control-user ${
                            errors.contact_no ? "error" : ""
                          }`}
                        />
                        {errors.contact_no && (
                          <div className="ft-14 mt-1 red">
                            {errors.contact_no}
                          </div>
                        )}
                      </div>
                      <div className="form-group col-md-6">
                        <label className="form-label" htmlFor="avatar">
                          Avatar
                        </label>
                        <input
                          id="image"
                          type="file"
                          name="image"
                          onChange={(event) => {
                            setFieldValue(
                              "image",
                              event.currentTarget.files[0]
                            );
                          }}
                          className={`form-control form-select-user ${
                            errors.image ? "error" : ""
                          }`}
                        />
                        {errors.image && (
                          <div className="ft-14 mt-1 red">{errors.image}</div>
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
                              className="ml-2 btn-user spinner-border spinner-border-sm"
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

export default AddUsersDetail;