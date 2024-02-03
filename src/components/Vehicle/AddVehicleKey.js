import React from "react";

import Header from "../Header/Index.js";
import { Redirect } from "react-router-dom";

import { Formik } from "formik";
import * as Yup from "yup";
import FlashMessage from '../FlashMessage/FlashMessage';
var {apiRequest} = require('../Api/Service');
var {AddVehicleKeyAPI, VehicleMakeList,VehicleModelList,KeyModelList} = require('../Api/ApiRoutes');
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

function AddVehicleKey() {
  const VehicleSchema = Yup.object().shape({
    
    name: Yup.string().required("This Field is Required"),
    vehicle_model_id: Yup.string().required("This Field is Required"),
  });

  const [makeList, setmakeList] = React.useState([]);
  const [modelList, setmodelList] = React.useState([]);
  const [keyList, setkeyList] = React.useState([]);

  React.useEffect(()=>{

        apiRequest(VehicleMakeList.method, VehicleMakeList.url)
          .then((response) => {
            if (response.data.code === 200) {
              setmakeList(response.data.data);
            } else {
    
              console.log("Failure",response);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    
      },[])

  const [LocalState, Localdispatch] = React.useReducer(reducer, initialState);
  const [redirectToReferrer, setredirectToReferrer] = React.useState(false);
  var user = Helper.getStorageData("SESSION");
  var permissions = user.permissions;

  const handleCar = (event) =>{
    let id = event.target.value;

    apiRequest(VehicleModelList.method, VehicleModelList.url + `vehicle_company_id=${id}` )
          .then((response) => {
            if (response.data.code === 200) {
              setmodelList(response.data.data);
            } else {
    
              console.log("Failure",response);
            }
        })
        .catch((error) => {
            console.log(error);
        });
  }

  const handleModel = (event) =>{
    
    let id = event.target.value;
    apiRequest(KeyModelList.method, KeyModelList.url + `vehicle_model_id=${id}` )
          .then((response) => {
            if (response.data.code === 200) {
              setkeyList(response.data.data);
            } else {
    
              console.log("Failure",response);
            }
        })
        .catch((error) => {
            console.log(error);
        });
  }


  const handleSubmit = (values) => {
    const form_data = Helper.formData(values);
    Localdispatch({ type: 'DEFAULT', payload: true})
    apiRequest(AddVehicleKeyAPI.method,  AddVehicleKeyAPI.url, form_data)
      .then((response) => {
        if (response.data.code === 200) {
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
    return <Redirect to={'/admin/company-key-list'}/>
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
                device_code: "",
                name: "",
                vehicle_model_id:"",
                vehicle_company_id:"",
                year:"",
                key_id:"",
                license:"",
                color:"",
                tags:"",
                doors:"",
                button:"",
                ignition:"", 
                file:undefined,
                trunk:""
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
                         <label className="form-label">Vehicle Key Name</label>
                         <input
                         type="text"
                         name="name"
                         onChange={handleChange}
                         placeholder="B2c-0921"
                         className={`form-control ${
                         errors.name ? "error" : ""
                         }`}
                         />
                         {errors.device_code && (
                         <div className="ft-14 mt-1 red">{errors.name}</div>
                         )}
                      </div>
                      <div className="form-group col-md-6">
                      <label className="form-label">Car Make</label>
                         <select className={`form-control ${
                         errors.vehicle_company_id ? "error" : ""
                         }`}  name="vehicle_company_id" defaultValue={values.name}  onChange={(e) => {
                         handleCar(e)
                         handleChange(e)
                         }}>
                         <option value="">Select Car Make</option>
                         {makeList && makeList.map((carMake,index)=>(
                         <option value={carMake.id} key={index}>{carMake.name}</option>
                         ))}
                         </select>
                         {errors.vehicle_company_id && (
                         <div className="ft-14 mt-1 red">{errors.vehicle_company_id}</div>
                         )}
                      </div>
                   </div>
                   <div className="form-row">
                   <div className="form-group col-md-6">
                       

<label className="form-label">Car Model</label>
                         <select className={`form-control ${
                         errors.vehicle_model_id ? "error" : ""
                         }`} name="vehicle_model_id" onChange={(e) => {
                         handleModel(e)
                         handleChange(e)
                         }}>
                         <option value="">Select Car Model</option>
                         {modelList && modelList.map((modelName,index)=>(
                         <option value={modelName.id} key={index}>{modelName.name}</option>
                         ))}
                         </select>
                         {errors.vehicle_model_id && (
                         <div className="ft-14 mt-1 red">{errors.vehicle_model_id}</div>
                         )}
                      </div>
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

export default AddVehicleKey;
