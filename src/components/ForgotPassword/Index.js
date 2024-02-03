import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import HeaderWithoutAuth from "../Header/HeaderWithoutAuth.js";
import { Formik } from "formik";
import * as Yup from "yup";
import FlashMessage from "../FlashMessage/FlashMessage";
var { formData } = require("../Helper");
var { ForgotPassword } = require("../Api/ApiRoutes");
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
        redirectToReferrer: true,
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

function Index() {
  const [show, setShow] = useState(false);
  const [LocalState, Localdispatch] = React.useReducer(reducer, initialState);
  const [error, setError] = React.useState(undefined);

  const handleSubmit = (values) => {
    const form_data = formData(values);
    Localdispatch({ type: "DEFAULT", payload: true });
    apiRequest(ForgotPassword.method, ForgotPassword.url, form_data)
      .then((response) => {
        if (response.data.code === 200) {
          Localdispatch({
            type: "FETCH_SUCCESS",
            payload: response.data.message,
          });
          setShow(true);
        }
      })
      .catch((error) => {
        console.log(error);
        Localdispatch({
          type: "FETCH_ERROR",
          payload: error.response.data.data,
        });
      });
  };
  const ForgotPasswordSchema = Yup.object().shape({
    user: Yup.string().required("This Field is Required"),
  });
  return (
    <React.Fragment>
      <HeaderWithoutAuth />
      {/* <div className="container">
        <div className="pt-5 mt-5 form">
          <FlashMessage
            success={LocalState.success}
            isSuccess={LocalState.isSuccess}
            isError={LocalState.isError}
            errors={LocalState.errors}
          />
          {show ? (
            <p>
              Please check now password recover URL from your e-mail, in case
              you provided valid registered e-mail address. URL is valid for 20
              minutes.
            </p>
          ) : (
            <div>
              <p>
                Password recover URL would be sent only to registered e-mail
                addresses
              </p>
              <Formik
                validateOnChange={false}
                validationSchema={ForgotPasswordSchema}
                onSubmit={(values) => {
                  handleSubmit(values);
                }}
                initialValues={{
                  email: "",
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
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label className="mr-sm-3 form-label">Email</label>
                      <input
                        type="text"
                        placeholder="Your Email or Phone"
                        name="user"
                        value={values.user || ""}
                        onChange={handleChange}
                        className={`form-control ${errors.user ? "error" : ""}`}
                      />
                      {errors.user && touched.user ? (
                        <div className="ft-14 mt-1 red">{errors.user}</div>
                      ) : null}
                    </div>
                    <div className="form-group d-flex justify-content-end">
                      <button
                        type="submit"
                        className="btn-submit"
                        disabled={LocalState.disable}
                      >
                        Send
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
                  </form>
                )}
              </Formik>
            </div>
          )}
        </div>
      </div> */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-12 col-md-9">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-lg-6 d-none d-lg-block bg-password-image"></div>
                  <div className="col-lg-6">
                    <div className="p-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-3">
                          Forgot Your Password?
                        </h1>
                       
                      </div>
                      <FlashMessage
                        success={LocalState.success}
                        isSuccess={LocalState.isSuccess}
                        isError={LocalState.isError}
                        errors={LocalState.errors}
                      />
{show ? (
            <p className="mb-4">
              Please check now password recover URL from your e-mail, in case
              you provided valid registered e-mail address. URL is valid for 20
              minutes.
            </p>
          ) : (
            <div>
              <p className="mb-4">
                Password recover URL would be sent only to registered e-mail
                addresses
              </p>
                      <Formik
                        validateOnChange={false}
                        validationSchema={ForgotPasswordSchema}
                        onSubmit={(values) => {
                          handleSubmit(values);
                        }}
                        initialValues={{
                          email: "",
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
                          <form className="user" onSubmit={handleSubmit}>
                            <div className="form-group">
                              <input
                                type="text"
                                placeholder="Your Email or Phone"
                                name="user"
                                value={values.user || ""}
                                onChange={handleChange}
                                className={`form-control form-control-user ${
                                  errors.user ? "error" : ""
                                }`}
                              />
                              {errors.user && touched.user ? (
                                <div className="ft-14 mt-1 red">
                                  {errors.user}
                                </div>
                              ) : null}
                            </div>
                            {/* <a href="login.html" class="btn btn-primary btn-user btn-block">
                                            Reset Password
                                        </a> */}
                            <button
                              type="submit"
                              className="btn-submit btn btn-orange btn-user btn-block"
                              disabled={LocalState.disable}
                            >
                              Reset Password
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
                          </form>
                        )}
                      </Formik>
            </div>
          )}
                      <hr />
                      <div className="text-center">
                        <a className="small" href="register.html">
                          Create an Account!
                        </a>
                      </div>
                      <div className="text-center">
                        <a className="small" href="login.html">
                          Already have an account? Login!
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Index;
