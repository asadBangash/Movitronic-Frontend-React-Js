import React, { useContext, useEffect } from "react";
import { NavLink, Redirect, useHistory } from "react-router-dom";
import HeaderWithoutAuth from "../Header/HeaderWithoutAuth.js";
import { Formik } from "formik";
import * as Yup from "yup";
import { Context } from "../Store/Store";
import FlashMessage from "../FlashMessage/FlashMessage";
var { Login } = require("../Api/ApiRoutes");
var { apiRequest } = require("../Api/Service");
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

function Index() {
  const [state, dispatch] = useContext(Context);
  const [LocalState, Localdispatch] = React.useReducer(reducer, initialState);
  const [redirectToReferrer, setredirectToReferrer] = React.useState(false);
  const LoginSchema = Yup.object().shape({
    user: Yup.string().required("This Field is Required"),
    password: Yup.string().required("This Field is Required"),
  });
  let history = useHistory();

  const handleSubmit = (values) => {
    const form_data = Helper.formData(values);
    Localdispatch({ type: "DEFAULT", payload: true });
    apiRequest(Login.method, Login.url, form_data)
      .then((response) => {
        if (response.data.code == 200) {
          let data = response.data.data;
          Helper.setStorageData("SESSION", data);
          dispatch({ type: "SET_STATE", user: response.data.data });
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
        //console.log("Catch Here",error.response);
        let status = error.response.data.code;
        if (status === 403) {
          setTimeout(() => {
            history.push("/verify-user-email");
          }, 2000);
        }
        Localdispatch({
          type: "FETCH_ERROR",
          payload: error.response.data.data,
        });
      });
  };

  if (redirectToReferrer) {
    window.location.reload();
    return <Redirect to={"/admin/thankyou"} />;
  }

  return (
    <React.Fragment>
      <HeaderWithoutAuth />
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-xl-10 col-lg-12 col-md-9">
            <div class="card o-hidden border-0 shadow-lg my-5">
              <div class="card-body p-0">
                <div class="row">
                  <div class="col-lg-6 d-none d-lg-block bg-login-image"></div>
                  <div class="col-lg-6">
                    <div class="p-5">
                      <div class="text-center">
                        <h1 class="h4 text-gray-900 mb-4">Welcome Back!</h1>
                      </div>
                      <Formik
                        validateOnChange={false}
                        validationSchema={LoginSchema}
                        onSubmit={(values) => {
                          // same shape as initial values
                          handleSubmit(values);
                        }}
                        initialValues={{
                          email: "",
                          password: "",
                          type: "",
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
                          <form
                            className="pt-5 mt-5 form user"
                            onSubmit={handleSubmit}
                          >
                            <FlashMessage
                              success={LocalState.success}
                              isSuccess={LocalState.isSuccess}
                              isError={LocalState.isError}
                              errors={LocalState.errors}
                            />
                            <div class="form-group">
                              <input
                                type="text"
                                name="user"
                                value={values.user || ""}
                                onChange={handleChange}
                                placeholder="Enter Your Email or Phone Number"
                                className={`form-control form-control-user ${
                                  errors.user ? "error" : ""
                                }`}
                              />
                              {errors.user ? (
                                <div className="ft-14 mt-1 red">
                                  {errors.user}
                                </div>
                              ) : null}
                            </div>
                            <div class="form-group">
                              <input
                                type="password"
                                name="password"
                                value={values.password || ""}
                                onChange={handleChange}
                                placeholder="Password"
                                className={`form-control form-control-user ${
                                  errors.password ? "error" : ""
                                }`}
                              />
                              {errors.password ? (
                                <div className="ft-14 mt-1 red">
                                  {errors.password}
                                </div>
                              ) : null}
                            </div>
                            <div class="form-group">
                              <div class="custom-control custom-checkbox small">
                                <input
                                  type="checkbox"
                                  class="custom-control-input"
                                  id="customCheck"
                                />
                                <label
                                  class="custom-control-label"
                                  for="customCheck"
                                >
                                  Remember Me
                                </label>
                              </div>
                            </div>
                            <button
                              type="submit"
                              class="btn bg-orange text-white btn-user btn-block"
                            >
                              Login
                            </button>

                            {/* <a href="index.html" class="btn btn-google btn-user btn-block">
                                            <i class="fab fa-google fa-fw"></i> Login with Google
                                        </a>
                                        <a href="index.html" class="btn btn-facebook btn-user btn-block">
                                            <i class="fab fa-facebook-f fa-fw"></i> Login with Facebook
                                        </a> */}
                          </form>
                        )}
                      </Formik>
                      <div class="text-center">
                  <NavLink to="/forgot-password" className="small">
                  Forgot Password?
                </NavLink>
                      </div>
                      <hr />
                      <div class="text-center">
                       <NavLink to="/sign-up" className="small">
                       Create an Account!
               </NavLink>
                     </div>
                      {/* <div class="text-center">
                                        <a class="small" href="register.html">Create an Account!</a>
                                    </div> */}
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
