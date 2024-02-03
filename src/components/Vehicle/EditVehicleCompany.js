import React from "react";
import { NavLink } from "react-router-dom";
import Header from "../Header/Index.js";
import { Redirect } from "react-router-dom";

import { Formik } from "formik";
import * as Yup from "yup";
import FlashMessage from '../FlashMessage/FlashMessage';
var {apiRequest} = require('../Api/Service');
var {EditCompanyAPI, UpdateCompanyAPI} = require('../Api/ApiRoutes');
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

function EditVehicleCompany(props) {
  const VehicleSchema = Yup.object().shape({
    name: Yup.string().required("This Field is Required")
  });

  const [makeList, setmakeList] = React.useState([]);
  const [modelList, setmodelList] = React.useState([]);
  const [keyList, setkeyList] = React.useState([]);
  const [record, setRecord] = React.useState(undefined);

  const [LocalState, Localdispatch] = React.useReducer(reducer, initialState);
  const [redirectToReferrer, setredirectToReferrer] = React.useState(false);
  var user = Helper.getStorageData("SESSION");
  var permissions = user.permissions;
  var user_permissions = user.permissions;
  let id = props.match.params.id;
  React.useEffect(()=>{
    if(Helper.getPermissions(
      "admin-update",
      user_permissions && user_permissions,
      "admin"
    ) || (Helper.getPermissions('',[], user.type ))){
    apiRequest(EditCompanyAPI.method, EditCompanyAPI.url + id)
      .then((response) => {

        let data = response.data.data;
        setRecord(data);
        if (response.data.code == 200) {
         
        }
      })
      .catch((error) => {
        console.log(error);
      
      });

  
    }
  },[])

  const handleSubmit = (values) => {
    const form_data = Helper.formData(values);
    Localdispatch({ type: 'DEFAULT', payload: true})
    apiRequest(UpdateCompanyAPI.method, UpdateCompanyAPI.url + id, form_data)
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
          {/* {Helper.getPermissions(
                      "vehicle-create",
                      permissions && permissions,
                      "admin"
                    ) || Helper.getPermissions("", [], user.type)  ? */}
          <div className="p-4">
          {record && 
             <Formik 
validateOnChange={false}
                validationSchema={VehicleSchema}
                onSubmit={(values) =>
                {
                // same shape as initial values
                handleSubmit(values);
                }}
                initialValues={{
                name: record.name,
                file:record.file
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
                <form className="mt-2 user" onSubmit={handleSubmit}>
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
                         value={values.name}
                         onChange={handleChange}
                         placeholder="Vehicle Company Name"
                         className={`form-control form-control-user ${
                         errors.name ? "error" : ""
                         }`}
                         />
                         {errors.name && (
                         <div className="ft-14 mt-1 red">{errors.name}</div>
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
                          onChange={(event) => {
                            setFieldValue("file", event.currentTarget.files[0]);
                          }}
                          className={`form-control form-control-user ${
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
                         <button type="submit" className="btn-submit btn-user" disabled={LocalState.disable}>
                         confirm Details
                         {LocalState.disable ? <span className="ml-2 spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>: ''}
                         </button>
                      </div>
                   </div>
                </form>
                )}
             </Formik>
}
          </div>
        {/* //  :
        //   <div className="p-4">
        //      <div className="text-center ft-14 mt-3 font-weight-bold">
        //         You are not allowed to visit this screen...
        //      </div>
        //   </div>
        //   } */}
       </div>
    {/* </div> */}
 </React.Fragment>

  );
}

export default EditVehicleCompany;
