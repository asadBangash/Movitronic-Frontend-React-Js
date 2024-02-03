import React from "react";
import {NavLink, Redirect } from "react-router-dom";
import HeaderWithoutAuth from "../Header/HeaderWithoutAuth.js";
import { Formik } from "formik";
import * as Yup from "yup";
import {formData}  from '../Helper';
import FlashMessage from '../FlashMessage/FlashMessage';
var {SignUpStep1} = require('../Api/ApiRoutes');
var {apiRequest} = require('../Api/Service');

const initialState = {
  isError: false,
  errors: [],
  isSuccess: false,
  success: '',
  disable:false,
  show:false,
}

const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_SUCCESS':
			return {
        isSuccess: true,
        success:action.payload,
        disable:true,
        show:true
			}
		case 'FETCH_ERROR':
			return {
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


function Index() {
  const [LocalState, Localdispatch] = React.useReducer(reducer, initialState);
  const [redirectToReferrer, setredirectToReferrer] = React.useState(false);

  const SignUpSchema = Yup.object().shape({
    name: Yup.string().required("This Field is Required").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
    user: Yup.string().required("This Field is Required"),
  });
 
  const handleSubmit = (values) => {
    const form_data = formData(values); 
    Localdispatch({ type: 'DEFAULT', payload: true})
    apiRequest(SignUpStep1.method, SignUpStep1.url, form_data)
      .then((response) => {
        if (response.data.code == 200) {
          Localdispatch({ type: 'FETCH_SUCCESS', payload: response.data.message });
          setTimeout(() => {
            setredirectToReferrer(true);
          }, 2000);
          
        } else {
          Localdispatch({ type: 'FETCH_ERROR', payload: response.data.data })
          console.log("Failure",response.data.data);
        }
    })
    .catch((error) => {
        console.log(error);
        Localdispatch({ type: 'FETCH_ERROR', payload: error.response.data.data })
    });
    
  };
  console.log("LocalState",LocalState);

    if (redirectToReferrer) {
     return  <Redirect to={"/sign-up-2"} />
  }
  
return (
    <React.Fragment>
      <HeaderWithoutAuth />
      <div class="container">

        <div class="card o-hidden border-0 shadow-lg my-5">
            <div class="card-body p-0">
                
                <div class="row">
                    <div class="col-lg-5 d-none d-lg-block bg-register-image"></div>
                    <div class="col-lg-7">
                        <div class="p-5">
                            <div class="text-center">
                                <h1 class="h4 text-gray-900 mb-4">Create an Account!</h1>
                            </div>
                            <Formik 
validateOnChange={false}
          validationSchema={SignUpSchema}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
          initialValues={{
            name: "",
            email: "",
            type:"",
          }}
        >
          {({
            handleSubmit,
            handleChange,
            isSubmitting,
            handleBlur,
            values,
            touched,
            isValid,
            errors,
          }) => (
            <form className="pt-5 mt-5 form user" onSubmit={handleSubmit}>
               <FlashMessage
                    success={LocalState.success}
                    isSuccess={LocalState.isSuccess}
                    isError={LocalState.isError}
                    errors={LocalState.errors}
                  />
                                <div class="form-group row">
                                    <div class="col-sm-12 mb-3 mb-sm-0">
                                        <input 
                                            type="text"
                                            name="name"
                                            id="name"
                                            placeholder="Your full name"
                                            value={values.name || ""}
                                            onChange={handleChange}
                                            className={`form-control form-control-user ${errors.name ? "error" : ""}`}
                                          />
                                          {errors.name ? (
                                            <div className="ft-14 mt-1 red">{errors.name}</div>
                                          ) : null}
                                    </div>
                                    {/* <div class="col-sm-6">
                                        <input type="text" class="form-control form-control-user" id="exampleLastName"
                                            placeholder="Last Name"/>
                                    </div> */}
                                </div>
                                <div class="form-group">
                                    <input 
                                        type="text"
                                        name="user"
                                        id="email"
                                        value={values.user || ""}
                                        placeholder="Enter Your Email or Phone Number"
                                        onChange={handleChange}
                                        className={`form-control form-control-user ${errors.user ? "error" : ""}`}
                                      />
                                      {errors.user ? (
                                        <div className="ft-14 mt-1 red">{errors.user}</div>
                                      ) : null}
                                        
                                        
                                </div>
                                {/* <div class="form-group row">
                                    <div class="col-sm-6 mb-3 mb-sm-0">
                                        <input type="password" class="form-control form-control-user"
                                            id="exampleInputPassword" placeholder="Password"/>
                                    </div>
                                    <div class="col-sm-6">
                                        <input type="password" class="form-control form-control-user"
                                            id="exampleRepeatPassword" placeholder="Repeat Password"/>
                                    </div>
                                </div> */}
                                {/* <a href="login.html" class="btn btn-primary btn-user btn-block">
                                    Register Account
                                </a> */}
                          
                            <button type="submit" className="btn-submit btn bg-orange text-white btn-user btn-block " disabled={LocalState.disable}>
                            Register Account
                  {LocalState.disable ? <span className="ml-2 spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>: ''}
                </button>
                                {/* <hr/>
                                <a href="index.html" class="btn btn-google btn-user btn-block">
                                    <i class="fab fa-google fa-fw"></i> Register with Google
                                </a>
                                <a href="index.html" class="btn btn-facebook btn-user btn-block">
                                    <i class="fab fa-facebook-f fa-fw"></i> Register with Facebook
                                </a> */}
                            </form>
                             )}
                             </Formik>
                             <div class="text-center">
                       
                       <NavLink to="/forgot-password" className="small">
                 Forgot Password?
               </NavLink>
                     </div>
                            <hr/>
<div class="text-center">
                       
                       <NavLink to="/" className="small">
                       Already have an account? Login!
               </NavLink>
                     </div>
                            {/* <div class="text-center">
                                <a class="small" href="login.html">Already have an account? Login!</a>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </React.Fragment>
  );
}

export default Index;
