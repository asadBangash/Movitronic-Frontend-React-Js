import React from "react";
import { Redirect } from "react-router-dom";
import Header from "../Header/Index.js";

import { Formik } from "formik";
import * as Yup from "yup";
import FlashMessage from "../FlashMessage/FlashMessage";
import moment from 'moment';
var { apiRequest } = require("../Api/Service");
var { ShareEditApI, UpdateShareAPI, GetVehicles } = require("../Api/ApiRoutes");
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

function EditShare(props) {
  const DetailSchema = Yup.object().shape({
    start_date: Yup.string().required("This Field is Required"),
    end_date: Yup.string().required("This Field is Required"),
    vehicles_id: Yup.string().required("This Field is Required"),
    access_type: Yup.string().required("This Field is Required"),
  });

  const [LocalState, Localdispatch] = React.useReducer(reducer, initialState);
  const [redirectToReferrer, setredirectToReferrer] = React.useState(false);
  const [record, setRecord] = React.useState(undefined);
  const [vehicles, setvehicles] = React.useState(undefined);
  var user = Helper.getStorageData("SESSION");
  var user_permissions = user.permissions;
  let id = props.match.params.id;
  
  React.useEffect(()=>{
    // if(Helper.getPermissions(
    //   "share-update",
    //   user_permissions && user_permissions,
    //   "admin"
    // ) || (Helper.getPermissions('',[], user.type ))){
    apiRequest(ShareEditApI.method, ShareEditApI.url + id)
      .then((response) => {
        if (response.data.code == 200) {
          let data = response.data.data;
          setRecord(data);
        }
      })
      .catch((error) => {
        console.log(error);
      
      });

      apiRequest(GetVehicles.method, GetVehicles.url)
      .then((response) => {
        if (response.data.code == 200) {
          let data = response.data.data;
          setvehicles(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    //}
  },[])

  const shareSubmit = (values) => {
    let form_data = Helper.formData(values);
    form_data.append('status',1);
    form_data.append('operator_id',record.user.id);
    Localdispatch({ type: "DEFAULT", payload: true });
    apiRequest(UpdateShareAPI.method, UpdateShareAPI.url + id, form_data)
      .then((response) => {
        if (response.data.code == 200) {
          let data = response.data.data;
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
        console.log("errors",error.response)
        Localdispatch({
          type: "FETCH_ERROR",
          payload: error.response.data.data,
        });
        window.scrollTo(500, 0);
      });
  };

  if (redirectToReferrer) {
    return <Redirect to={"/admin/shares-list"} />;
  }

  return (
    <React.Fragment>
   {/* <div className="wrapper d-flex align-items-stretch">
      <Sidebar /> */}
      <div id="content">
         <Header />
         {Helper.getPermissions(
            "share-update",
            user_permissions && user_permissions,
            "admin"
          ) || (Helper.getPermissions('',[], user.type )) ? (
         <div className="p-4">
            <h4 className="mb-3">Edit Share</h4>
            {record && 
            <Formik 
               validateOnChange={false}
               validationSchema={DetailSchema}
               onSubmit={(values) =>
               {
               // same shape as initial values
               shareSubmit(values);
               }}
               initialValues={{
               start_date: record.start_date,
               end_date: record.end_date,
               vehicles_id: record.vehicle && record.vehicle.id,
               access_type: record.access_type,
               
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
                        <label className="mr-sm-3 form-label">Start Date</label>
                        <input
                        type="datetime-local"
                        name="start_date"
                        value={moment(values.start_date).format('YYYY-MM-DD\THH:mm')}
                        onChange={handleChange}
                        className={`form-control form-select-user ${errors.start_date ? "error" : ""}`}
                        />
                        {errors.start_date ? (
                        <div className="ft-14 mt-1 red">{errors.start_date}</div>
                        ) : null}
                     </div>
                     <div className="form-group col-md-6">
                        <label className="mr-sm-3 form-label">End Date</label>
                        <input
                        type="datetime-local"
                        name="end_date"
                        value={moment(values.end_date).format('YYYY-MM-DD\THH:mm')}
                        onChange={handleChange}
                        className={`form-control form-select-user ${errors.end_date ? "error" : ""}`}
                        />
                        {errors.end_date ? (
                        <div className="ft-14 mt-1 red">{errors.end_date}</div>
                        ) : null}
                     </div>
                  </div>
                  <div className="form-row">
                     <div className="form-group col-md-6">
                        <label className="mr-sm-3 form-label">Access Type</label>
                        <select
                        value={values.access_type}
                        onChange={handleChange}
                        className={`form-control form-select-user ${
                        errors.access_type ? "error" : ""
                        }`}
                        name="access_type"
                        >
                        <option value="">Select Access Type</option>
                        <option value="1">Full Access</option>
                        <option value="2">Driver Access</option>
                        <option value="3">Door and Trunk Access</option>
                        </select>
                        {errors.access_type ? (
                        <div className="ft-14 mt-1 red">{errors.access_type}</div>
                        ) : null}
                     </div>
                     <div className="form-group col-md-6">
                        <label className="mr-sm-3 form-label">Vehciles</label>
                        <select
                        value={values.vehicles_id}
                        defaultValue={values.vehicles_id}
                        onChange={handleChange}
                        className={`form-control form-select-user ${
                        errors.vehicles_id ? "error" : ""
                        }`}
                        name="vehicles_id"
                        >
                        <option value="">Select Vehicles</option>
                        <optgroup value="me" label="My Vehicle">
                           {vehicles && vehicles.me && vehicles.me.map((my,index)=>(
                           <option value={my.id} key={index}>{my.name}</option>
                           ))}
                        </optgroup>
                        <optgroup value="me"  label="Shared Vehicle">
                           {vehicles && vehicles.shared && vehicles.shared.map((share,index)=>(
                           <option value={share.id} key={index}>{share.name}</option>
                           ))}
                        </optgroup>
                        </select>
                        {errors.vehicles_id ? (
                        <div className="ft-14 mt-1 red">{errors.vehicles_id}</div>
                        ) : null}
                     </div>
                  </div>
                  <div className="form-row">
                     <div className="form-group d-flex justify-content-end col-md-12">
                        <button
                           type="submit"
                           className="btn-submit btn-user"
                           disabled={LocalState.disable}
                           >
                        confirm Details
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
                     </div>
                  </div>
               </form>
               )}
            </Formik>
}
         </div>
         ) : (
          <div className="p-4">
           <div className="text-center ft-14 mt-3 font-weight-bold">
              You are not allowed to visit this screen...
            </div>
          </div>
        )} 
      </div>
   {/* </div> */}
</React.Fragment>
  );
}

export default EditShare;
