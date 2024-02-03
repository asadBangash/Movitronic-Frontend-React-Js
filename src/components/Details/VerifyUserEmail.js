import React, { useReducer } from "react";
import { Redirect } from "react-router-dom";
import HeaderWithoutAuth from "../Header/HeaderWithoutAuth.js";
import { Formik } from "formik";
import * as Yup from "yup";
import FlashMessage from "../FlashMessage/FlashMessage";

var { apiRequest } = require("../Api/Service");
var { VerifyUserEmailApI, ResendOTP } = require("../Api/ApiRoutes");

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

function VerifyUserEmail() {
  const DetailSchema = Yup.object().shape({
    //name: Yup.string().required("This Field is Required"),
    //image: Yup.mixed().required(), //.required("This Field is Required"),
    code: Yup.string().required("This Field is Required"),
    // telephone: Yup.number().required("This Field is Required"),
    // password: Yup.string().required("This Field is Required"),
    // passwordrepeat: Yup.string().required("This Field is Required"),
  });
  const [counter, setCounter] = React.useState(30);
  const [showbutton, showbuttonappear] = React.useState(false);
  const [LocalState, Localdispatch] = React.useReducer(reducer, initialState);
  const [redirectToReferrer, setredirectToReferrer] = React.useState(false);

  //let history = useHistory();

  React.useEffect(() => {
    const countTimer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    if (counter === 0) {
      showbuttonappear(true);
    }
    return () => clearInterval(countTimer);
  }, [counter]);

  const handleSubmit = (values) => {
    const form_data = Helper.formData(values);
    Localdispatch({ type: "DEFAULT", payload: true });
    apiRequest(VerifyUserEmailApI.method, VerifyUserEmailApI.url, form_data)
      .then((response) => {
        if (response.data.code == 200) {
          let data = response.data.data;
          Helper.setStorageData("SESSION", data);
          Localdispatch({
            type: "FETCH_SUCCESS",
            payload: response.data.message,
          });
          setTimeout(() => {
            setredirectToReferrer(true);
            window.location.reload();
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

  const resendotp = (e) => {
    //const form_data = Helper.formData(values);
    apiRequest(ResendOTP.method, ResendOTP.url)
      .then((response) => {
        let data = response.data;
        if (response.data.code == 200) {
          //setrecords(response.data.data);
          window.location.reload();
          //getVehicleList(activePage)
          console.log("Success", response);
        } else {
          console.log("Failure", response);
        }
      })
      .catch((error) => {
        //console.log("error", error);
        alert(error);
      });
  };

  let user = Helper.getStorageData("SESSION");

  if (redirectToReferrer) {
    return <Redirect to={"/admin/thankyou"} />;
  }

  return (
    <React.Fragment>
      <HeaderWithoutAuth />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-12 col-md-9">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-lg-6 d-none d-lg-block bg-verfiy"></div>
                  <div className="col-lg-6">
                    <div className="p-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-2">Verification</h1>
                        <p className="mb-4">
                          We get it, stuff happens. Just enter verfication code
                          below
                        </p>
                      </div>
                      <Formik
                        validateOnChange={false}
                        validationSchema={DetailSchema}
                        onSubmit={(values) => {
                          // same shape as initial values
                          console.log(values);
                          handleSubmit(values);
                        }}
                        initialValues={{
                          //name: user && user.name,
                          //image: undefined,
                          code: user && user.code,
                          // telephone: user && user.contact,
                          // password: "",
                          // passwordrepeat: "",
                        }}
                      >
                        {({
                          handleSubmit,
                          handleChange,
                          isSubmitting,
                          handleBlur,
                          setFieldValue,
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
                            <div className="form-group">
                              <input
                                name="code"
                                value={values.code || ""}
                                onChange={handleChange}
                                placeholder="Enter Verfication Code"
                                className={`form-control form-control-user ${
                                  errors.code ? "error" : ""
                                }`}
                              />
                              {errors.code && touched.code ? (
                                <div className="ft-14 mt-1 red">
                                  {errors.code}
                                </div>
                              ) : null}
                            </div>
                            <div className="form-group">
                              <button
                                type="submit"
                                className="btn-submit btn btn-oranage btn-user btn-block"
                              >
                                confirm Details
                              </button>
                            </div>
                            <div className="form-group">
                                <button type="button"
                                  className="btn-submit btn btn-oranage btn-user btn-block"
                                  onClick={resendotp}
                                  disabled={!showbutton}
                                  style={{cursor: counter>0 && "not-allowed"}}
                                >
                                  Resend OTP {counter>0 &&counter}
                                </button>
                              
                            </div>
                          </form>
                        )}
                      </Formik>
                      <hr />
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
export default VerifyUserEmail;
