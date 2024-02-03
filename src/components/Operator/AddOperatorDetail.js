import React from "react";
import Header from "../Header/Index.js";
import {Redirect } from "react-router-dom";

import { Formik } from "formik";
import * as Yup from "yup";
import FlashMessage from '../FlashMessage/FlashMessage';
var {apiRequest} = require('../Api/Service');
var {AddOperator} = require('../Api/ApiRoutes');
const Helper = require('../Helper');

const initialState = {
  isError: false,
  errors: [],
  isSuccess: false,
  success: '',
  disable:false,
}

const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_SUCCESS':
			return {
        ...state,
        isSuccess: true,
        success:action.payload,
        disable:true,
			}
		case 'FETCH_ERROR':
			return {
        ...state,
				isError: true,
				errors: action.payload,
				disable:false,
			}
      case 'DEFAULT':
        return {
          disable:action.payload,
        }
		default:
			return state
	}
}

function AddOperatorDetail() {
  const DetailSchema = Yup.object().shape({
    name: Yup.string().required("This Field is Required"),
    email: Yup.string().required("This Field is Required"),
    contact_no: Yup.number().required("This Field is Required"),
    password: Yup.string().required("This Field is Required"),
    avatar: Yup.mixed().required(),
    password_confirmation: Yup.string().required("This Field is Required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });
  const [LocalState, Localdispatch] = React.useReducer(reducer, initialState);
  const [redirectToReferrer, setredirectToReferrer] = React.useState(false);
  var user = Helper.getStorageData("SESSION");
  var permissions = user.permissions;

  const handleSubmit = (values) => {
    const form_data = Helper.formData(values);
    form_data.append("type", 3);
    Localdispatch({ type: 'DEFAULT', payload: true})
    apiRequest(AddOperator.method, AddOperator.url, form_data)
      .then((response) => {
        if (response.data.code == 200) {
          let data = response.data.data;
          Localdispatch({ type: 'FETCH_SUCCESS', payload: response.data.message })
          setTimeout(() => {
            setredirectToReferrer(true);
          }, 2000);

        } 
    })
    .catch((error) => {
        console.log(error);
        Localdispatch({ type: 'FETCH_ERROR', payload: error.response.data.data })
    });
    
  };

  if(redirectToReferrer){
    return <Redirect to={'/admin/operator-list'}/>
  }

  return (
  <React.Fragment>
   {/* <div className="wrapper d-flex align-items-stretch">
      <Sidebar /> */}
      <div id="content">
         <Header />
         {//Helper.getPermissions('operator-create',permissions) ?
         <div className="p-4">
            <h4 className="mb-3">Add Operator </h4>
            <Formik 
validateOnChange={false}
               validationSchema={DetailSchema}
               onSubmit={(values) =>
               {
               // same shape as initial values
               handleSubmit(values);
               }}
               initialValues={{
               name: "",
               email: "",
               contact_no: "",
               password: "",
               password_confirmation: "",
               avatar:undefined,
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
               <form className="mt-2" onSubmit={handleSubmit}>
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
                        className={`form-control ${
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
                        className={`form-control ${
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
                        <label className="form-label">Telephone</label>
                        <input
                        type="text"
                        name="contact_no"
                        value={values.contact_no || ""}
                        onChange={handleChange}
                        placeholder="Enter Your Telephone"
                        className={`form-control ${
                        errors.contact_no ? "error" : ""
                        }`}
                        />
                        {errors.contact_no && (
                        <div className="ft-14 mt-1 red">{errors.contact_no}</div>
                        )}
                     </div>
                     <div className="form-group col-md-6">
                        {/* <label className="mr-sm-3 form-label">User Type</label>
                        <select onChange={handleChange} className={`form-control ${errors.type ? "error" : ""}`} name="type">
                        <option value="">Select User Type</option>
                        <option value="driver">Driver</option>
                        <option value="operator">Operator</option>
                        <option value="admin">Admin</option>
                        </select>
                        {errors.type ? (
                        <div className="ft-14 mt-1 red">{errors.type}</div>
                        ) : null} */}
                
                         <label className="form-label" htmlFor="avatar">Avatar</label>
                         <input
                            id="avatar"
                            type="file"
                            name="avatar"
                            onChange={(event) => {
                         setFieldValue("avatar", event.currentTarget.files[0]);
                         }} 
                         className={`form-control  ${
                         errors.avatar ? "error" : ""
                         }`}
                         />
                         {errors.avatar && (
                         <div className="ft-14 mt-1 red">{errors.avatar}</div>
                         )}
              
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
                        {errors.password &&(
                        <div className="ft-14 mt-1 red">{errors.password}</div>
                        )}
                     </div>
                     <div className="form-group col-md-6">
                        <label className="form-label">Password Repeat</label>
                        <input
                        type="password"
                        name="password_confirmation"
                        value={values.password_confirmation || ""}
                        onChange={handleChange}
                        placeholder="*********"
                        className={`form-control ${
                        errors.password_confirmation ? "error" : ""
                        }`}
                        />
                        {errors.password_confirmation &&(
                        <div className="ft-14 mt-1 red">{errors.password_confirmation}</div>
                        )}
                     </div>
                  </div>
                  <div className="form-row">
                  
                     <div className="form-group d-flex justify-content-end col-md-12">
                        <button type="submit" className="btn-submit" disabled={LocalState.disable}>
                        confirm Details
                        {LocalState.disable ? <span className="ml-2 spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>: ''}
                        </button>
                     </div>
                  </div>
               </form>
               )}
            </Formik>
            <div className="row">
               <div className="col-md-12 mb-4">Vehicles: <u>20</u></div>
               <div className="col-md-12 mb-4">Engine running: <u>11</u></div>
               <div className="col-md-12 mb-4">Stand-by: <u>3</u></div>
               <div className="col-md-12 mb-4">Sleep mode: <u>6</u></div>
               <div className="col-md-12 mb-4">Not responding: <u>0</u></div>
            </div>
         </div>
         // :
         // <div className="p-4">
         //    <div className="text-center ft-14 mt-3 font-weight-bold">
         //       You are not allowed to visit this screen...
         //    </div>
         // </div>
         }
      </div>
   {/* </div> */}
</React.Fragment>
  );
}

export default AddOperatorDetail;
