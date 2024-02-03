import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import EditAdmin from "../AdminUser/EditAdmin.js";
import CompanyNameList from "../Vehicle/CompanyNameList.js";
import VechileModelListing from "../Vehicle/VechileModelListing.js";
import VechileKeyListing from "../Vehicle/VechileKeyListing.js";
import EditVehicleCompany from "../Vehicle/EditVehicleCompany.js";
import EditVehicleModel from "../Vehicle/EditVehicleModel.js";
import EditVehicleKey from "../Vehicle/EditVehicleKey.js";
import UpdateSoftwareUpload from "../SoftwareUpload/UpdateSoftwareUpload.js";
import DevicesCodeList from "../Devices/DevicesCodeList.js";
import AddDevicesCode from "../Devices/AddDevicesCode.js";
import EditDevicesCode from "../Devices/EditDevicesCode.js";
import UserList from "../User/UserList.js";
import EditUser from "../User/EditUser.js";
import CurrentUserList from "../User/CurrentUserList.js";
import AdminUserList from "../AdminUser/AdminUserList.js";
import MyAdminUserList from "../AdminUser/MyAdminUserList.js";
import OperatorList from "../Operator/OperatorList.js";
import AddVehicleCompany from "../Vehicle/AddVehicleCompany.js";
import AddVehicleModel from "../Vehicle/AddVehicleModel.js";
import AddVehicleKey from "../Vehicle/AddVehicleKey.js";
import AddAdminUsersDetail from "../AdminUser/AddAdminUsersDetail.js";
import AddOperatorDetail from "../Operator/AddOperatorDetail.js";
import DetailsUsagePage from "../Usage/DetailsUsagePage.js";
import VehicleList from "../Vehicle/VehicleList.js";
import AllVehicleList from "../Vehicle/AllVehicleList";
import UsageList from "../Usage/UsageList.js";
import UsageListMyAPI from "../Usage/UsageMyList.js";
import SharesList from "../Shares/SharesList.js";
import VerifyShareUser from "../Shares/VerifyShareUser.js";
import EditShare from "../Shares/EditShare.js";
import SharesMyList from "../Shares/SharesMyList.js";
import SharesWithMeList from "../Shares/SharesWithMeList.js";
import ThankYou from "../thankyou.js";
import AddVehicle from "../Vehicle/AddVehicle.js";
import VehicleMapList from "../Vehicle/VehicleMapList.js";
import VehicleMapAllList from "../Vehicle/VehicleMapAllList.js";
import VehicleDetials from "../Vehicle/VehicleDetials.js";
import AddDetail from "../Details/AddDetail.js";
import AddUsersDetail from "../User/AddUsersDetail.js";
import UpdateEmailDetail from "../Details/UpdateEmailDetail.js";
import UpdatePhoneDetail from "../Details/UpdatePhoneDetail.js";
import SoftwareUploadList from "../SoftwareUpload/SoftwareUploadList.js";
import AddSoftwareUpload from "../SoftwareUpload/AddSoftwareUpload.js";
import ChangPassword from "../Details/ChangPassword.js";
import VerifyEmailDetail from "../Details/VerifyEmailDetail.js";
import VerifyPhoneDetail from "../Details/VerifyPhoneDetail.js";
import NotFound from "../NotFound.jsx";
import Sidebar from "../Sidebar/Index.js";
import KeyRegenrate from "../Details/KeyRegenrate.js";
import Addwhitelabel from "../WhiteLabel/AddWhiteLabel.js";
import AddwhitelabelListing from "../WhiteLabel/WhiteLabelList.js";
import Editwhitelabel from "../WhiteLabel/EditWhiteLabel.js";

const PrivateRoutes = () => {

  return (
      <>
      <div className="wrapper d-flex align-items-stretch">
    <Sidebar />
    <Switch>
      <Route exact path={"/admin/thankyou"} component={ThankYou} />
      <Route exact path={"/admin/vehicle-list"} component={VehicleList} />
      <Route
        exact
        path={"/admin/all-vehicle-list"}
        component={AllVehicleList}
      />
      <Route
        exact
        path={"/admin/current-user-list"}
        component={CurrentUserList}
      />

      <Route exact path={"/admin/add-vehicle"} component={AddVehicle} />
      <Route
        exact
        path={"/admin/company-vehicle-list"}
        component={CompanyNameList}
      />
      <Route
        exact
        path={"/admin/company-key-list"}
        component={VechileKeyListing}
      />

      <Route
        exact
        path={"/admin/vehicle-map-list"}
        component={VehicleMapList}
      />
      <Route
        exact
        path={"/admin/vehicle-map-all-list"}
        component={VehicleMapAllList}
      />

      <Route exact path={"/admin/add-detail"} component={AddDetail} />

      <Route
        exact
        path={"/admin/add-users-detail"}
        component={AddUsersDetail}
      />

<Route
        exact
        path={"/admin/add-white-label"}
        component={Addwhitelabel}
      />
<Route
        exact
        path={"/admin/list-white-label"}
        component={AddwhitelabelListing}
      />


<Route
        exact
        path={"/admin/list-white-label-edit/:id"}
        component={Editwhitelabel}
      />


<Route
        exact
        path={"/admin/key-regenrate"}
        component={KeyRegenrate}
      />


      <Route
        exact
        path={"/admin/add-admin-users-detail"}
        component={AddAdminUsersDetail}
      />

      <Route
        exact
        path={"/admin/operator-list"}
        component={OperatorList}
      />

      <Route
        exact
        path="/admin/add-operator-detail"
        component={AddOperatorDetail}
      />

      <Route
        exact
        path="/admin/usage-details/:id"
        component={DetailsUsagePage}
      />

      <Route exact path="/admin/user-list" component={UserList} />

      <Route
        exact
        path="/admin/admin-user-list"
        component={AdminUserList}
      />
      <Route
        exact
        path="/admin/my-admin-user-list"
        component={MyAdminUserList}
      />

      <Route
        exact
        path="/admin/software-upload-list"
        component={SoftwareUploadList}
      />

      <Route
        exact
        path="/admin/software-upload-add"
        component={AddSoftwareUpload}
      />

      <Route
        exact
        path="/admin/edit-software-upload/:id"
        component={UpdateSoftwareUpload}
      />

      <Route
        exact
        path="/admin/devices-code-list"
        component={DevicesCodeList}
      />
      <Route
        exact
        path="/admin/devices-code-add"
        component={AddDevicesCode}
      />

      <Route exact path="/admin/usage-list" component={UsageList} />
      <Route
        exact
        path="/admin/usage-my-list"
        component={UsageListMyAPI}
      />

      <Route exact path="/admin/shares-list" component={SharesList} />

      <Route
        exact
        path="/admin/shares-my-list"
        component={SharesMyList}
      />

      <Route
        exact
        path="/admin/shares-with-me-list"
        component={SharesWithMeList}
      />

      <Route
        exact
        path="/admin/verify-user"
        component={VerifyShareUser}
      />

      <Route
        exact
        path="/admin/edit-vehicle-details/:id"
        component={VehicleDetials}
      />

      <Route
        exact
        path="/admin/add-company-name"
        component={AddVehicleCompany}
      />

      <Route
        exact
        path="/admin/add-model-name"
        component={AddVehicleModel}
      />

      <Route
        exact
        path="/admin/add-model-name-listing"
        component={VechileModelListing}
      />

      <Route exact path="/admin/add-key-name" component={AddVehicleKey} />

      <Route exact path="/admin/edit-admin/:id" component={EditAdmin} />
      <Route exact path="/admin/edit-user/:id" component={EditUser} />

      <Route
        exact
        path="/admin/edit-email"
        component={UpdateEmailDetail}
      />
      <Route
        exact
        path="/admin/verify-email"
        component={VerifyEmailDetail}
      />
      <Route
        exact
        path="/admin/verify-phone"
        component={VerifyPhoneDetail}
      />

      <Route
        exact
        path="/admin/update-phone"
        component={UpdatePhoneDetail}
      />
      <Route exact path="/admin/share-edit/:id" component={EditShare} />

      <Route
        exact
        path="/admin/change-password"
        component={ChangPassword}
      />

      <Route
        exact
        path="/admin/edit-vehicle-company/:id"
        component={EditVehicleCompany}
      />

      <Route
        exact
        path="/admin/edit-vehicle-model/:id"
        component={EditVehicleModel}
      />

      <Route
        exact
        path="/admin/edit-vehicle-key/:id"
        component={EditVehicleKey}
      />

      <Route
        exact
        path="/admin/edit-device-code/:id"
        component={EditDevicesCode}
      />
      <Route component={NotFound} />
    </Switch>
    </div>
    </>
  );
};

export default PrivateRoutes;
