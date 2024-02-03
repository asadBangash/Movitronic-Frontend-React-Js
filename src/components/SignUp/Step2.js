import React, { useReducer } from "react";
import { Redirect } from "react-router-dom";
import HeaderWithoutAuth from "../Header/HeaderWithoutAuth.js";
import { Formik } from "formik";
import * as Yup from "yup";
import FlashMessage from "../FlashMessage/FlashMessage";
var { formData } = require("../Helper");
var { SignUpStep2 } = require("../Api/ApiRoutes");
var { apiRequest } = require("../Api/Service");
const Helper = require("../Helper");

const initialState = {
  isError: false,
  errors: [],
  isSuccess: false,
  success: "",
  redirectToReferrer: false,
  disable: false,
  show: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return {
        ...state,
        isSuccess: true,
        success: action.payload,
        redirectToReferrer: true,
        disable: true,
        show: true,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        isError: true,
        errors: action.payload,
        disable: false,
      };
    case "DEFAULT":
      return initialState;
    default:
      return state;
  }
};

function Step2() {
  const SignUpSchema = Yup.object().shape({
    verification_code: Yup.string().required("This Field is Required"),
    password: Yup.string().required("This Field is Required"),
    password_confirmation: Yup.string()
      .required("This Field is Required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const [LocalState, Localdispatch] = useReducer(reducer, initialState);
  const [redirectToReferrer, setredirectToReferrer] = React.useState(false);

  const handleSubmit = (values) => {
    const form_data = formData(values);
    Localdispatch({ type: "DEFAULT" });
    apiRequest(SignUpStep2.method, SignUpStep2.url, form_data)
      .then((response) => {
        if (response.data.code == 200) {
          console.log("Success", response.data.data);
          Helper.setStorageData("SESSION", response.data.data);
          Localdispatch({
            type: "FETCH_SUCCESS",
            payload: response.data.message,
          });
          setTimeout(() => {
            setredirectToReferrer(true);
          }, 2000);
        } else {
          console.log("Failure", response.data.data);
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
                  <div class="col-lg-6 d-none d-lg-block bg-step-two-image"></div>
                  <div class="col-lg-6">
                    <div class="p-5">
                      <div class="text-center">
                        <h1 class="h4 text-gray-900 mb-3">Sign Up Step 2</h1>
                        {/* <p class="mb-4">We get it, stuff happens. Just enter your email address below
                                            and we'll send you a link to reset your password!</p> */}
                      </div>
                      <Formik
                        validateOnChange={false}
                        validationSchema={SignUpSchema}
                        onSubmit={(values) => {
                          handleSubmit(values);
                        }}
                        initialValues={{
                          verification_code: "",
                          password: "",
                          password_confirmation: "",
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
                            className="form user"
                            onSubmit={handleSubmit}
                          >
                            <FlashMessage
                              success={LocalState.success}
                              isSuccess={LocalState.isSuccess}
                              isError={LocalState.isError}
                              errors={LocalState.errors}
                            />
                            <p className="mb-4">
                              A security code has been e-mailed to your given
                              address. Please input the code below. NB! Security
                              code is valid for 30 minutes.
                            </p>
                            <div class="form-group">
                              <input
                                type="text"
                                placeholder="Security Code"
                                name="verification_code"
                                className="form-control"
                                value={values.verification_code || ""}
                                onChange={handleChange}
                                className={`form-control form-control-user ${
                                  errors.verification_code ? "error" : ""
                                }`}
                              />
                              {errors.verification_code ? (
                                <div className="ft-14 mt-1 red">
                                  {errors.verification_code}
                                </div>
                              ) : null}
                            </div>
                            <div className="form-group">
                              <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={values.password || ""}
                                onChange={handleChange}
                                className={`form-control form-control-user  ${
                                  errors.password ? "error" : ""
                                }`}
                              />
                              {errors.password ? (
                                <div className="ft-14 mt-1 red">
                                  {errors.password}
                                </div>
                              ) : null}
                            </div>
                            <div className="form-group">
                              <input
                                type="password"
                                name="password_confirmation"
                                placeholder="Password Repeat"
                                value={values.password_confirmation || ""}
                                onChange={handleChange}
                                className={`form-control form-control-user  ${
                                  errors.password_confirmation ? "error" : ""
                                }`}
                              />
                              {errors.password_confirmation ? (
                                <div className="ft-14 mt-1 red">
                                  {errors.password_confirmation}
                                </div>
                              ) : null}
                            </div>

                            <button
                              type="submit"
                              className="btn-submit btn btn-orange btn-user btn-block"
                              disabled={LocalState.disable}
                            >
                              Continue
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
                      <hr />
                      <div class="text-center">
                        <a class="small" href="/sign-up">
                          Create an Account!
                        </a>
                      </div>
                      <div class="text-center">
                        <a class="small" href="/">
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

export default Step2;
