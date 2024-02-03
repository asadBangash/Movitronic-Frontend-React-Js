import { Redirect } from "react-router-dom";
const _ = require("lodash");

const NotFound = () => {
    const user = !_.isEmpty(localStorage.getItem("SESSION")) ? true : false;

    if(user){
        return <Redirect to={'/admin/thankyou'} exact />
    }
    else{
        return <Redirect to={'/'} exact />
    }
}
export default NotFound;