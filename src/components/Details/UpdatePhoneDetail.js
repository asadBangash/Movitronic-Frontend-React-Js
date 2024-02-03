import React from "react";
import { NavLink,useHistory } from "react-router-dom";
import Header from "../Header/Index.js";
import { Redirect } from "react-router-dom";

import { Formik, validateYupSchema } from "formik";
import * as Yup from "yup";
import FlashMessage from "../FlashMessage/FlashMessage";

var { apiRequest } = require("../Api/Service");
var {
    VerifyPhoneApI
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




function UpdatePhoneDetail() {
  const DetailSchema = Yup.object().shape({
    //name: Yup.string().required("This Field is Required"),
    //image: Yup.mixed().required(), //.required("This Field is Required"),
    //email: Yup.string().required("This Field is Required"),
     number: Yup.number().required("This Field is Required"),
    // password: Yup.string().required("This Field is Required"),
    // passwordrepeat: Yup.string().required("This Field is Required"),
    
  });

  const [LocalState, Localdispatch] = React.useReducer(reducer, initialState);
  const [redirectToReferrer, setredirectToReferrer] = React.useState(false);
  const [inputVal, setInputVal] = React.useState("");
  const inputRef = React.useRef();
  let history = useHistory();
  
  const handleSubmit = (values) => {
   
    const form_data = Helper.formData(values);
    Localdispatch({ type: "DEFAULT", payload: true });
    apiRequest(VerifyPhoneApI.method, VerifyPhoneApI.url, form_data)
      .then((response) => {
        if (response.data.code == 200) {
          
          //let data = response.data.data;
          //Helper.setStorageData('SESSION',data)
          setTimeout(function(){ 
            history.push({pathname:'/admin/verify-email',
          state:{
            number:values.number
          }})
             }, 1000);
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

  let user = Helper.getStorageData("SESSION");
  console.log("user",user);

  return (
    <React.Fragment>
      {/* <div className="wrapper d-flex align-items-stretch">
        <Sidebar /> */}
        <div id="content">
        <Header />
        <div className="p-4">
            <h4 className="mb-3">User Phone Update</h4>
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
                //email: user && user.email,
                 number: user && user.contact,
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
                <div className="form-row">

                    <input
                      type="text"
                      name="number"
                      ref={inputRef}
                      value={values.number || ""}
                      onChange={handleChange}
                      placeholder="Enter Your Phone"
                      className={`form-control form-control-user ${
                        errors.number ? "error" : ""
                      }`}
                    />
                    {errors.number && touched.number ? (
                      <div className="ft-14 mt-1 red">{errors.number}</div>
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
                    <button type="submit" className="btn-submit btn-user">
                      confirm Details
                    </button>
                  </div>
                </div>
              </form>
            )}
          </Formik>
          </div>
        </div>
      {/* </div> */}
    </React.Fragment>
  );
}

export default UpdatePhoneDetail;
