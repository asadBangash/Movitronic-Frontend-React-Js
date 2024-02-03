import React from "react";
import { Redirect } from "react-router-dom";
import Header from "../Header/Index.js";

import { Formik } from "formik";
import * as Yup from "yup";
import FlashMessage from "../FlashMessage/FlashMessage";
import AddShare from './AddShare';
import InviteUser from "./InviteUser.js";
var { apiRequest } = require("../Api/Service");
var { VerifyUser } = require("../Api/ApiRoutes");

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
      case "HIDE_ERROR":
      return {
        ...state,
        isError: action.payload,
        errors: [],
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

function VerifyShareUser() {
  const VerifySchema = Yup.object().shape({
    verify_user: Yup.string().required("This Field is Required"),
  });

  const [LocalState, Localdispatch] = React.useReducer(reducer, initialState);
  const [redirectToReferrer, setredirectToReferrer] = React.useState(false);
  const [verifiedUser, setverifiedUser] = React.useState(undefined);
  const [showAddShare, setshowAddShare] = React.useState(false);
  const [operator_id, setoperator_id] = React.useState(0);
  const inputRef = React.useRef();
  const [showInvite, setshowInvite] = React.useState(false);
  const [inputVal, setinputVal] = React.useState('');

  var user = Helper.getStorageData("SESSION");
  var permissions = user.permissions;

  React.useEffect(()=>{
    Localdispatch({
      type: "HIDE_ERROR",
      payload: false,
    });
  },[showInvite])

  const handleSubmit = (values) => {
    const form_data = Helper.formData(values);
     setinputVal(inputRef.current.value);
    Localdispatch({ type: "DEFAULT", payload: true });
    apiRequest(VerifyUser.method, VerifyUser.url, form_data)
      .then((response) => {
        if (response.data.code == 200) {
          let data = response.data.data;
          Localdispatch({
            type: "FETCH_SUCCESS",
            payload: response.data.message,
          });
          setverifiedUser(response.data.data);
        setshowAddShare(true);
        setoperator_id(response.data.data.id);
        }
      })
      .catch((error) => {
        console.log(error);
        if(error.response.data.code === 404){
          setTimeout(()=>{
            setshowInvite(true);
          },1000)
        }
        Localdispatch({
          type: "FETCH_ERROR",
          payload: error.response.data.data,
        });
        window.scrollTo(500, 0);
      });
  };

  if (redirectToReferrer) {
    return <Redirect to={"/admin/admin-user-list"} />;
  }

  return (
    <React.Fragment>
      {!showInvite &&
      // <div className="wrapper d-flex align-items-stretch">
      //   <Sidebar />
        <div id="content">
          <Header />
          <div className="p-4">
            
            <div class="text-left">
                                <h1 class="h4 text-gray-900 mb-4">Verify User</h1>
                            </div>
            <Formik 
              validateOnChange={false}
              validationSchema={VerifySchema}
              onSubmit={(values) => {
                // same shape as initial values
                handleSubmit(values);
              }}
              initialValues={{
                verify_user: "",
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
                      <input
                        type="text"
                        name="verify_user"
                        ref={inputRef}
                        value={values.verify_user || ""}
                        onChange={handleChange}
                        placeholder="Email / Mobile No#"
                        className={`form-control form-control-user ${
                          errors.verify_user ? "error" : ""
                        }`}
                      />
                      {errors.verify_user && (
                        <div className="ft-14 mt-1 red">
                          {errors.verify_user}
                        </div>
                      )}
                      <br />
                      <button
                        type="submit"
                        className="btn-submit btn-user"
                        disabled={LocalState.disable}
                      >
                        Verify
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
                    {showAddShare && 
                      <div className="form-group col-md-6 mt-2">
                      <p className="font-weight-bold">User Details</p>
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                            </tr>
                          </thead>
                          <tbody>
                          {verifiedUser && (
                            <tr>
                              <td>{verifiedUser.name}</td>
                              <td>{verifiedUser.email}</td>
                            </tr>
                             )}
                          </tbody>
                        </table>
                    </div>
                    }
                  </div>
                </form>
              )}
            </Formik>
            {showAddShare && <AddShare operator_identify={operator_id} />  }
          </div>
        </div>
      // </div>
      }
      {showInvite && <InviteUser inputValue={inputVal} setInvite={setshowInvite} />}
    </React.Fragment>
  );
}

export default VerifyShareUser;
