import React from "react";
import { useHistory } from "react-router-dom";
import Header from "../Header/Index.js";

import { Formik } from "formik";
import * as Yup from "yup";
import FlashMessage from "../FlashMessage/FlashMessage";
import AddShare from './AddShare';
var { apiRequest } = require("../Api/Service");
var { InvitationAPI,GetVehicles } = require("../Api/ApiRoutes");

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

function InviteUser(props) {
  const VerifySchema = Yup.object().shape({
    user: Yup.string().required("This Field is Required"),
    access_type: Yup.string().required("This Field is Required"),
  });
  const [LocalState, Localdispatch] = React.useReducer(reducer, initialState);
  const [vehicles, setvehicles] = React.useState(undefined);
  var user = Helper.getStorageData("SESSION");
  var permissions = user.permissions;
  let history = useHistory();


  React.useEffect(()=>{

    apiRequest(GetVehicles.method, GetVehicles.url)
      .then((response) => {
        if (response.data.code == 200) {
          let data = response.data.data;
          setvehicles(data);
        }
      })
      .catch((error) => {
        console.log(error);
        Localdispatch({
          type: "FETCH_ERROR",
          payload: error.response.data.data
        });
        window.scrollTo(500, 0);
      });

  },[])

  const handleSubmit = (values) => {
    const form_data = Helper.formData(values);
    Localdispatch({ type: "DEFAULT", payload: true });
    apiRequest(InvitationAPI.method, InvitationAPI.url, form_data)
      .then((response) => {
        if (response.data.code == 200) {
          let data = response.data.data;
          Localdispatch({
            type: "FETCH_SUCCESS",
            payload: response.data.message,
          });
          setTimeout(()=>{
            history.push('/admin/verify-user');
            props.setInvite(false);
          },1000)
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

 
  return (
    <React.Fragment>
   {/* <div className="wrapper d-flex align-items-stretch">
      <Sidebar /> */}
      <div id="content">
         <Header />
         <div className="p-4">
            <h4 className="mb-3">Invite User</h4>
            <Formik 
               validateOnChange={false}
               validationSchema={VerifySchema}
               onSubmit={(values) =>
               {
               // same shape as initial values
               handleSubmit(values);
               }}
               initialValues={{
               user: props.inputValue,
               access_type: "",
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
                        <label className="form-label">
                        Enter Email / Mobile No#
                        </label>
                        <input
                        type="text"
                        name="user"
                        value={values.user || ""}
                        onChange={handleChange}
                        placeholder="Email / Mobile No#"
                        className={`form-control ${
                        errors.user ? "error" : ""
                        }`}
                        />
                        {errors.user && (
                        <div className="ft-14 mt-1 red">
                           {errors.user}
                        </div>
                        )}
                     </div>
                     <div className="form-group col-md-6">
                        <label className="mr-sm-3 form-label">Access Type</label>
                        <select
                        onChange={handleChange}
                        className={`form-control ${
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
       
                  </div>
                  <div className="form-row">
                  <div className="form-group col-md-4">
                <label className="mr-sm-3 form-label">Vehciles</label>
                <select
                  onChange={handleChange}
                  className={`form-control ${
                    errors.vehicle_id ? "error" : ""
                  }`}
                  name="vehicle_id"
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
                {errors.vehicle_id ? (
                  <div className="ft-14 mt-1 red">{errors.vehicle_id}</div>
                ) : null}
              </div>
</div>
              
              <button
                        type="submit"
                        className="btn-submit"
                        disabled={LocalState.disable}
                        >
                     Invite
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
         </div>
      </div>
   {/* </div> */}
</React.Fragment>
  );
}

export default InviteUser;
