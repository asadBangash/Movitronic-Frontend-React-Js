import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import Login from "../Login/Index.js";
import SignUp from "../SignUp/Index.js";
import Step2 from "../SignUp/Step2.js";
import ForgotPassword from "../ForgotPassword/Index.js";
import VerifyUserEmail from "../Details/VerifyUserEmail.js";
import NotFound from "../NotFound.jsx";

const PublicRoutes = () => {

  return (
    <Switch>
      <Route exact path={"/"} component={Login} />

      <Route exact path={"/sign-up"} component={SignUp} />

      <Route exact path={"/sign-up-2"} component={Step2} />

      <Route
        exact
        path={"/forgot-password"}
        component={ForgotPassword}
      />

      <Route
        exact
        path={"/verify-user-email"}
        component={VerifyUserEmail}
      />
      <Route component={NotFound} />
    </Switch>
  );
};

export default PublicRoutes;
