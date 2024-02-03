import React from "react";
import { NavLink } from "react-router-dom";
import Header from "../Header/Index.js";
import { Redirect } from "react-router-dom";

import { Formik } from "formik";
import * as Yup from "yup";
import FlashMessage from "../FlashMessage/FlashMessage";

var { apiRequest } = require("../Api/Service");
var {
    KeyRegnAPI ,UserDetailAPI
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




function KeyRegenrate() {
  const DetailSchema = Yup.object().shape({
    //name: Yup.string().required("This Field is Required"),
    //image: Yup.mixed().required(), //.required("This Field is Required"),
    // email: Yup.string().required("This Field is Required"),
    // telephone: Yup.number().required("This Field is Required"),
    // password: Yup.string().required("This Field is Required"),
    // passwordrepeat: Yup.string().required("This Field is Required"),
    
  });
  var userr = Helper.getStorageData("SESSION");
  const [LocalState, Localdispatch] = React.useReducer(reducer, initialState);
  const [redirectToReferrer, setredirectToReferrer] = React.useState(false);
  const [record, setRecord] = React.useState(undefined);
  const [setsaccesstoken, setToken] = React.useState(userr.api_access_token);
  const [loader, setloader] = React.useState(false);


  React.useEffect(()=>{
    apiRequest(UserDetailAPI.method, UserDetailAPI.url )
      .then((response) => {
        
        if (response.data.code == 200) {
          let data = response.data.data;
          setRecord(data);
           //setToken(data);
        }
      })
      .catch((error) => {
        console.log(error);
      
      });
  },[])
  
  const handleSubmit = (values) => {
    const form_data = Helper.formData(values);
    Localdispatch({ type: "DEFAULT", payload: true });
    Helper.overlay(true);
    setloader(true);
    apiRequest(KeyRegnAPI.method, KeyRegnAPI.url, form_data)
      .then((response) => {
        if (response.data.code == 200) {
          
          let data = response.data.data;
         setToken(data.api_access_token);
          //console.log("dfdfdfdfdfd",data);
         // Helper.setStorageData('SESSION',data)
          Localdispatch({
            type: "FETCH_SUCCESS",
            payload: response.data.message,
          });
          setTimeout(() => {
            setredirectToReferrer(true);
          }, 2000);
          Helper.overlay(false);
          setloader(false);
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
            <h4 className="mb-3">Key Update</h4>
            {record && 
          <Formik 
            validateOnChange={false}
            validationSchema={DetailSchema}
            onSubmit={(values) => {
              // same shape as initial values
              console.log(values);
              handleSubmit(values);
            }}
            initialValues={{
              access_token: record && record.api_access_token,
                image: record.image,
                // email: user && user.email,
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
                <div className="form-row">
                  {/* <div className="form-group col-md-12 text-center">
                    <img src={user && user.image} alt="User image" style={{height:"150px",width:"150px",borderRadius:"50%",objectFit:"cover"}} />
                  </div> */}
                  <div className="form-group col-md-10 input-group">
                    

                    
                    <input
                      type="text"
                      name="access_token"
                      value={setsaccesstoken || ""}
                      onChange={handleChange}
                     
                      className={`form-control form-control-user ${
                        errors.access_token ? "error" : ""
                      }`}
                    readOnly/>
                    {errors.access_token && touched.access_token ? (
                      <div className="ft-14 mt-1 red">{errors.access_token}</div>
                    ) : null}
                     <div className="input-group-append">
    <button type="submit" className="btn btn-user btn-warning">Regenrate</button>
    <button className="btn btn-primary btn-user " type="button"  onClick={() => {navigator.clipboard.writeText(setsaccesstoken)}}>Copy</button>
  </div>
                  </div>
                  {loader && (
            <div className="d-flex justify-content-center">
               <div className="spinner-border  text-warning" role="status">
                  <span className="sr-only">Loading...</span>
               </div>
            </div>
            )}
                  {/* <div className="form-group col-md-6">
                

<label className="form-label" htmlFor="file">
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
                        )}
                  </div> */}
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
                    {/* <button type="submit" className="btn-submit">
                      Regenrate
                    </button> */}

                   
                  </div>
                </div>
              </form>
              
            )}
          </Formik>
          }
           {/* <button className="btn-submit">Copy</button>  */}
          </div>
        </div>
      {/* </div> */}
    </React.Fragment>
  );
}

export default KeyRegenrate;
