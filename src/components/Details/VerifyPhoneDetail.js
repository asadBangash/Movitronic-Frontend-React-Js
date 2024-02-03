import React from "react";
import { NavLink,useHistory } from "react-router-dom";
import Header from "../Header/Index.js";
import { Redirect } from "react-router-dom";

import { Formik } from "formik";
import * as Yup from "yup";
import FlashMessage from "../FlashMessage/FlashMessage";

var { apiRequest } = require("../Api/Service");
var {
    VerifyEmailApI,ResendOTP
} = require("../Api/ApiRoutes");

const Helper = require("../Helper");
const initialState = {
  isError: false,
  errors: [],
  isSuccess: false,
  success: "",
  disable: false,
};
const state = {
  button: 1
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




function VerifyPhoneDetail(props) {
  
  let email = props.location.state.user;

  console.log("sdfsdfsfsdfsdfsd",email);
  
  //console.log("agagagagagaga",getnumber);
  const DetailSchema = Yup.object().shape({
    //name: Yup.string().required("This Field is Required"),
    //image: Yup.mixed().required(), //.required("This Field is Required"),
    verification_code: Yup.string().required("This Field is Required"),
    // telephone: Yup.number().required("This Field is Required"),
    // password: Yup.string().required("This Field is Required"),
    // passwordrepeat: Yup.string().required("This Field is Required"),
    
  });

  const [LocalState, Localdispatch] = React.useReducer(reducer, initialState);
  const [counter, setCounter] = React.useState(30);
  const [showbutton, showbuttonappear] = React.useState(false);
  const [redirectToReferrer, setredirectToReferrer] = React.useState(false);
  
  let history = useHistory();

  React.useEffect(() => {
    const countTimer =
    counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    if(counter === 0){
      showbuttonappear(true);
    }
    return () => clearInterval(countTimer);
  
  }, [counter]);
  
  const handleSubmit = (values) => {
    if(state.button === 1){
    const form_data = Helper.formData(values);
    Localdispatch({ type: "DEFAULT", payload: true });
    apiRequest(VerifyEmailApI.method, VerifyEmailApI.url, form_data)
      .then((response) => {
        if (response.data.code == 200) {
          let data = response.data.data;
          Helper.setStorageData('SESSION',data)
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
    }
    
    if(state.button === 2){
   
    
        
     //};
    }
  };
  
  const otpresend = (e) => {
    const form_data = new FormData();
    
    form_data.append('user', email);
    //const resendotp = (e) => {
      console.log("Button 2 clicked!");
      //const form_data = Helper.formData(values);
      apiRequest(ResendOTP.method, ResendOTP.url,form_data)
        .then((response) => {
          let data = response.data;
          if (response.data.code == 200) {
            //let data = response.data.data;
            Localdispatch({
              type: "FETCH_SUCCESS",
              payload: response.data.message,
            })

          } else {
            console.log("Failure", response);
          }
        })
        .catch((error) => {
          //console.log("error", error);
          Localdispatch({
            type: "FETCH_ERROR",
            payload: error.response.data.data
          });
          setTimeout(function(){ 
            history.push('/admin/edit-email')

           }, 3000);
        });
  };
  

  let user = Helper.getStorageData("SESSION");
  //console.log("user",user);

  return (
    <React.Fragment>
      {/* <div className="wrapper d-flex align-items-stretch">
        <Sidebar /> */}
        <div id="content">
        <Header />
        <div className="p-4">
            <h4 className="mb-3">Enter Verification Code</h4>
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
                verification_code: user && user.verification_code,
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
              <form className="mt-2" onSubmit={handleSubmit}>
                 <FlashMessage
                      success={LocalState.success}
                      isSuccess={LocalState.isSuccess}
                      isError={LocalState.isError}
                      errors={LocalState.errors}
                    />
                <div className="form-row">
                <label className="form-label">Enter Verfication Code</label>
                    <input
                      type="text"
                      name="verification_code"
                      value={values.verification_code || ""}
                      onChange={handleChange}
                      placeholder="Enter Verfication Code"
                      className={`form-control ${
                        errors.verification_code ? "error" : ""
                      }`}
                    />
                    {errors.verification_code && touched.email ? (
                      <div className="ft-14 mt-1 red">{errors.verification_code}</div>
                    ) : null}
        
                  <div className="form-group col-md-6">
               

                        {/* <label className="form-label" htmlFor="file">
                          User Profile Image
                        </label>
                        <input
                          id="file"
                          type="file"
                          name="image"
                          onChange={(event) => {
                            setFieldValue("image", event.currentTarget.files[0]);
                          }}
                          className={`form-control  ${
                            errors.image ? "error" : ""
                          }`}
                        />
                        {errors.image && (
                          <div className="ft-14 mt-1 red">{errors.image}</div>
                        )} */}
                  </div>
                </div>
{/* 
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label className="form-label">Telephone</label>
                    <input
                      type="text"
                      name="telephone"
                      value={values.telephone || ""}
                      onChange={handleChange}
                      placeholder="Enter Your Telephone"
                      className={`form-control ${
                        errors.telephone ? "error" : ""
                      }`}
                    />
                    {errors.telephone && touched.telephone ? (
                      <div className="ft-14 mt-1 red">{errors.telephone}</div>
                    ) : null}
                  </div>
        
                  <div className="form-group col-md-6">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={values.password || ""}
                      onChange={handleChange}
                      placeholder="**********"
                      className={`form-control ${
                        errors.password ? "error" : ""
                      }`}
                    />
                    {errors.password && touched.password ? (
                      <div className="ft-14 mt-1 red">{errors.password}</div>
                    ) : null}
                  </div>
                </div>


                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label className="form-label">Password Repeat</label>
                    <input
                      type="password"
                      name="repeatpassword"
                      value={values.repeatpassword || ""}
                      onChange={handleChange}
                      placeholder="*********"
                      className={`form-control ${
                        errors.repeatpassword ? "error" : ""
                      }`}
                    />
                    {errors.repeatpassword && touched.repeatpassword ? (
                      <div className="ft-14 mt-1 red">{errors.repeatpassword}</div>
                    ) : null}
                  </div>
        
                </div> */}
                <div className="form-row">
                  <div className="form-group d-flex justify-content-end col-md-12">
                    <button onClick={() => (state.button = 1)} type="submit" className="btn-submit">
                      confirm Details
                    </button>
                  </div>
                </div>

               

              </form>
            )}
          </Formik>
          <div className="form-row">
                  <div className="form-group d-flex justify-content-end col-md-12">
                  {showbutton && 
                       <button
                       className="btn btn-primary"
                       
                       onClick={otpresend}
                     >
                      Resend Otpp
                     </button>
                    }
                  </div>

                  <div>Time Remaining {counter}</div>
                </div>
          </div>
        </div>
      {/* </div> */}
    </React.Fragment>
  );
}

export default VerifyPhoneDetail;
