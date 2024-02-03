import React from "react";
import { NavLink } from "react-router-dom";
import Header from "../Header/Index.js";
import { Context } from "../Store/Store";

import Echo from "laravel-echo";
import Pagination from "react-js-pagination";
import Helper from '../Helper';
var { UsageDetailAPI} = require("../Api/ApiRoutes");
var { apiRequest } = require("../Api/Service");


function DetailsUsagePage(props) {
  // const DetailSchema = Yup.object().shape({
  //   // fullname: Yup.string().required("This Field is Required"),
  //   // email: Yup.string().required("This Field is Required"),
  //   // telephone: Yup.number().required("This Field is Required"),
  //   // password: Yup.string().required("This Field is Required"),
  //   // passwordrepeat: Yup.string().required("This Field is Required"),
  // });

  const [records, setrecords] = React.useState([]);
  const [activePage, setactivePage] = React.useState(1);
  const [result, setResult] = React.useState({});
  const [loader, setloader] = React.useState(false);
  const [hidePagination, sethidePagination] = React.useState(false);
  var user = Helper.getStorageData("SESSION");
  var permissions = user.permissions;
  let usage_id = props.match.params.id;

  React.useEffect(() => {
    //if(Helper.getPermissions('user-read',permissions)){
    Helper.overlay(true);
    setloader(true);
    apiRequest(UsageDetailAPI.method, UsageDetailAPI.url + `/${usage_id}`)
      .then((response) => {
        setrecords(response.data.data);
        Helper.overlay(false);
        if (response.data.code == 200) {
          //setrecords(response.data.data);
          setResult(response.data.meta);
          //Helper.overlay(false);
          setloader(false);
        }
      })
      .catch((error) => {
        console.log(error);
        Helper.overlay(false);
        setloader(false);
      });
    //}
  }, []);


  return (
    <React.Fragment>
      {/* <div className="wrapper d-flex align-items-stretch">
        <Sidebar /> */}
        <div id="content">
          <Header />
      
          <div className="p-4">
            <h4 className="mb-3">Usage no: <u>{records && records.id}</u></h4>

            <div className="row mb-4">
              <div className="col-md-12 ">
                <p className="mb-0">Name:{records.vehicle && records.vehicle.user && records.vehicle.user.name}</p>
              </div>
              <div className="col-md-12 ">
                <p className="mb-0">Email:{records.vehicle && records.vehicle.user && records.vehicle.user.email}</p>
              </div>

              <div className="col-md-12 ">
                <p className="mb-0">Telephone:{records.vehicle && records.vehicle.user && records.vehicle.user.contact}</p>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-12 ">
                <p className="mb-0">Via: Movitronic app</p>
              </div>
              <div className="col-md-12 ">
                <p className="mb-0">Type: Shared (15:11 12.12.2020)</p>
                <p className="mb-0">Tages: {records.vehicle && records.vehicle.tags} </p>
                <p className="mb-0">Color: {records.vehicle && records.vehicle.colour}  </p>
                <p className="mb-0">Vehicle Name: {records.vehicle && records.vehicle.vehicle_company_name}  </p>
                <p className="mb-0">Vehicle Year: {records.vehicle && records.vehicle.year}  </p>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-12 ">
                <p className="mb-0">BT Key exhange ID: AB99599003</p>
              </div>
              <div className="col-md-12 ">
                <p className="mb-0">BT Key exhanged: 14:03 12.12.2020</p>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-12 ">
                <p className="mb-0">Start: {records.from}</p>
              </div>
              <div className="col-md-12 ">
                <p className="mb-0">Pick-up from Latitude: {records && records.from_latitude}  <i className="fa fa-map-marker-alt pl-1" style={{color: "green"}}></i></p>
                <p className="mb-0">Pick-up from Longitude: {records && records.from_longitude}  <i className="fa fa-map-marker-alt pl-1" style={{color: "green"}}></i></p>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-12 ">
                <p className="mb-0">Stop: {records.to}</p>
              </div>
              <div className="col-md-12 ">
                <p className="mb-0">
                  Drop-off from:Tuukri 50, Tallinn, Estonia <i className="fa fa-map-marker-alt pl-1" style={{color: "green"}}></i>
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 ">
                <p className="mb-0">Usage Details</p>
              </div>
              <div className="col-md-12 ">
              <table className="table table-bordered">
    <thead>
      <tr>
         <th>Sno</th>
        <th>Name</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
      <th>1</th>
      <th>Doors</th>
      <th className={`${(records && records.vehicle && records.vehicle.detail && records.vehicle.detail.doors === 'Open')? 'bg-success' : 'bg-danger' } text-white`}>{records && records.vehicle && records.vehicle.detail && records.vehicle.detail.doors}</th>
      </tr>
      <tr>
        <th>2</th>
        <th>Trunk</th>
        <th className={`${(records && records.vehicle && records.vehicle.detail && records.vehicle.detail.trunk === 'Open')? 'bg-success' : 'bg-danger' } text-white`}>{records && records.vehicle && records.vehicle.detail && records.vehicle.detail.trunk}</th>
      </tr>
      <tr>
      <th>3</th>
      <th>Fuel</th>
      <th className="bg-success text-white">{records && records.vehicle  &&  records.vehicle.detail && records.vehicle.detail.fuel}</th> 
      </tr>

    </tbody>
  </table>
              </div>
            </div>
          </div>
         
         
        </div>
      {/* </div> */}
      
    </React.Fragment>
  );
}

export default DetailsUsagePage;
