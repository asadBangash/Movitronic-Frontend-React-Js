import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Store from "./Store/Store";
import PublicRoutes from "./Routes/PublicRoutes.jsx";
import PrivateRoutes from "./Routes/PrivateRoutes.jsx";
import 'rsuite/dist/styles/rsuite-default.css'; 
const _ = require("lodash");
const isAuth = !_.isEmpty(localStorage.getItem("SESSION")) ? true : false;

function App() {
  return (
    <Store>
      <Router>
          {!isAuth && <PublicRoutes isAuth={isAuth} />}
          {isAuth && <PrivateRoutes isAuth={isAuth} />}
      </Router>
    </Store>
  );
}

export default App;
