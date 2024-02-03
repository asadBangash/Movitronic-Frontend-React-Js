import React from "react";
import { NavLink } from "react-router-dom";
import Header from "./Header/Index.js";
import {Context} from "../components/Store/Store";
function ThankYou() {
  const [state, dispatch] = React.useContext(Context);
  console.log("state",state);
  return (
    <React.Fragment>
        <div id="content">
        <Header />
        <div className="p-4">
          <div className="row justify-content-center mt-5 pt-4">
             <div className="col-md-6">
                <p>Thank you for signing up. You can now start using the system. Please add and configure your vehicle now.</p>
                <div className="form-group d-flex justify-content-end"><NavLink className="btn-submit" to="/admin/add-vehicle">Continue</NavLink></div>
             </div>
          </div>
          </div>
        </div>
    </React.Fragment>
  );
}

export default ThankYou;
