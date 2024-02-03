import React from "react";
import { NavLink } from "react-router-dom";
import Header from "../Header/Index.js";
import { Redirect } from "react-router-dom";

import { Formik } from "formik";
import * as Yup from "yup";
import FlashMessage from '../FlashMessage/FlashMessage';
var {apiRequest} = require('../Api/Service');
var {AddVehicleCompanyAPI} = require('../Api/ApiRoutes');
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
        disable:false,
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

function AddVehicleCompany() {
  const VehicleSchema = Yup.object().shape({
    name: Yup.string().required("This Field is Required"),
    file: Yup.mixed().required(), 
  });

  const [makeList, setmakeList] = React.useState([]);
  const [modelList, setmodelList] = React.useState([]);
  const [keyList, setkeyList] = React.useState([]);


  const [LocalState, Localdispatch] = React.useReducer(reducer, initialState);
  const [redirectToReferrer, setredirectToReferrer] = React.useState(false);
  var user = Helper.getStorageData("SESSION");
  var permissions = user.permissions;


  const handleSubmit = (values) => {
    const form_data = Helper.formData(values);
    Localdispatch({ type: 'DEFAULT', payload: true})
    apiRequest(AddVehicleCompanyAPI.method, AddVehicleCompanyAPI.url, form_data)
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
          window.scrollTo(500, 0);
    });
    
  };

  if(redirectToReferrer){
    return <Redirect to={'/admin/company-vehicle-list'}/>
  }


  return (
    <React.Fragment>
    {/* <div className="wrapper d-flex align-items-stretch">
       <Sidebar /> */}
       <div id="content">
          <Header  />
          {Helper.getPermissions(
                      "vehicle-create",
                      permissions && permissions,
                      "admin"
                    ) || Helper.getPermissions("", [], user.type)  ?
          <div className="p-4">
             <Formik 
validateOnChange={false}
                validationSchema={VehicleSchema}
                onSubmit={(values) =>
                {
                // same shape as initial values
                handleSubmit(values);
                }}
                initialValues={{
                name: "",
                file: undefined,
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
                         <label className="form-label">Vehicle Company Name</label>
                         <input
                         type="text"
                         name="name"
                         onChange={handleChange}
                         placeholder="Vehicle Company Name"
                         className={`form-control ${
                         errors.device_code ? "error" : ""
                         }`}
                         />
                         {errors.device_code && (
                         <div className="ft-14 mt-1 red">{errors.device_code}</div>
                         )}
                      </div>

                      <div className="form-group col-md-6">
                        <label className="form-label" htmlFor="file">
                          Car Company Image
                        </label>
                        <input
                          id="file"
                          type="file"
                          name="file"
                          accept="images/*"
                          onChange={(event) => {
                            setFieldValue("file", event.currentTarget.files[0]);
                          }}
                          className={`form-control  ${
                            errors.file ? "error" : ""
                          }`}
                        />
                        {errors.file && (
                          <div className="ft-14 mt-1 red">{errors.file}</div>
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
          </div>
         :
          <div className="p-4">
             <div className="text-center ft-14 mt-3 font-weight-bold">
                You are not allowed to visit this screen...
             </div>
          </div>
          }
       </div>
    {/* </div> */}
 </React.Fragment>

  );
}

export default AddVehicleCompany;
