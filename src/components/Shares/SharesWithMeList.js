import React, { useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import Header from "../Header/Index.js";
import { Modal,Button,Icon,ButtonToolbar} from 'rsuite';
// import { Modal,Button } from 'react-bootstrap';
import { Context } from "../Store/Store";
import Echo from "laravel-echo";
import Pagination from "react-js-pagination";
import Helper from "../Helper";
var { overlay } = require("../Helper");
var { MySharesWithMeAPI ,deleteVehicle,alldeleteVechile,UpdateSoftwaree} = require("../Api/ApiRoutes");
var { apiRequest } = require("../Api/Service");
const _ = require("lodash");
window.Pusher = require("pusher-js");

const initialState = {
  isError: false,
  errors: [],
  isSuccess: false,
  success: '',
  disable:false,
}

const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_SUCCESS':
			return {
        ...state,
        isSuccess: true,
        success:action.payload,
        disable:false,
			}
		case 'FETCH_ERROR':
			return {
        ...state,
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

function SharesWithMeList() {
    const [state, dispatch] = useContext(Context);
    const [records, setrecords] = React.useState([]);
    const [listenerEvent, setListenerEvent] = React.useState(0);
    const [activePage, setactivePage] = React.useState(1);
    const [show, setShow] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState('');
    const [doorLoader, setDoorLoader] = React.useState(null);
    const [trunkLoader, setTrunkLoader] = React.useState(null);
    const [isSoftware, setIsSoftware] = React.useState(null);
    //const handleClose = () => setShow(false);
    const [LocalState, Localdispatch] = React.useReducer(reducer, initialState);
    const [loader, setloader] = React.useState(false);
    const [result, setResult] = React.useState({});
    const [hidePagination, sethidePagination] = React.useState(false);
    const [rsModal, setRsModal] = React.useState(false);

    const [currentId, setCurrentId] = React.useState(null);
  
    const Modalclose=()=> {
      setRsModal(false);
    }
    const Modalopen=(e)=> {
      setCurrentId(e.target.dataset.id);
      setRsModal(true);
    }
  
    var user = Helper.getStorageData("SESSION");
    //console.log("userrrr",user);
    var permissions = user.permissions;
    //console.log("user:::::::::",user);

    const handleClose = () => {
      setShow(false)
      setDoorLoader(null);
      setTrunkLoader(null);
    };

    const getVehicleList = (page = activePage) => {
      apiRequest(MySharesWithMeAPI.method, MySharesWithMeAPI.url+`?page=${page}`)
        .then((response) => {
          if (response.data.code == 200) {
            //console.log("response", response.data.data);
            setrecords(response.data.data);
            setResult(response.data.meta);
            Helper.overlay(false);
            setloader(false);
          } else {
           // console.log("Failure", response);
            Helper.overlay(false);
            setloader(false);
          }
        })
        .catch((error) => {
          //console.log(error);
          Helper.overlay(false);
          setloader(false);
        });
    };
  
    function getcheckbox() {
      var array = [];
      var checkboxes = document.querySelectorAll(
        "input[name='subcheckbox']:checked"
      );
      for (var i = 0; i < checkboxes.length; i++) {
        array.push(checkboxes[i].value);
      }
      console.log("array",array);
      let params = new FormData();
      params.append("ids", array);
      let delete_property = window.confirm(
        "Are you sure you want to delete these records!"
      );
      if (delete_property) {
        apiRequest(alldeleteVechile.method, alldeleteVechile.url, params)
          .then((response) => {
            let data = response.data;
            if (response.data.code == 200) {
              window.location.reload();
            
            } else {
              console.log("Failure", response);
            }
          })
          .catch((error) => {
            //console.log("error", error);
            alert(error);
          });
      
    }
  }
  
    function handleMainCheckBox(e) {
      var value = false;
  
      if (e.target.checked) {
        value = true;
      }
  
      Array.from(document.querySelectorAll("input[name='subcheckbox']")).forEach(
        (checkbox) => {
          checkbox.checked = value;
        }
      );
    }
  
  
    const deleteRecord = (e) => {
      //let params = new FormData();
      //params.append("id", e.target.dataset.id);
      // let delete_property = window.confirm(
      //   "Are you sure you want to delete this record!"
      // );
      // if (delete_property) {
  
        apiRequest(
          deleteVehicle.method,
          deleteVehicle.url + `${currentId}`
      )
        .then((response) => {
          let data = response.data;
          if (response.data.code == 200) {
            //setrecords(response.data.data);
            window.location.reload();
            //getVehicleList(activePage)
            console.log("Success", response);
          } else {
            console.log("Failure", response);
          }
        })
        .catch((error) => {
          //console.log("error", error);
          alert(error);
        });
  
      //}
    };
  
  
    const UpdateSoftware = (version_id , car_id) => {
      setIsSoftware(null);
      //let params = new FormData();
      //params.append("id", e.target.dataset.id);
      // let delete_property = window.confirm(
      //   "Are you sure you want to delete this record!"
      // );
      //if (delete_property) {
        //console.log("update function runungdddddd",e); return false;
        let params = new FormData();
      params.append("version", version_id);
      params.append("car_id", car_id);
      Localdispatch({ type: 'DEFAULT', payload: true})
      Helper.overlay(true);
      setloader(true);
        apiRequest(
          UpdateSoftwaree.method,
          UpdateSoftwaree.url , params
      )
        .then((response) => {
           let data = response.data;
        //console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa",response);
        if (response.data.code == 200) {
          setIsSoftware(car_id);
          //setrecords(response.data.data);
          //window.location.reload();
          //getVehicleList(activePage)
          console.log("Success", response);         
Localdispatch({ type: 'FETCH_SUCCESS', payload: response.data.message })
dispatch({type: 'SET_STATE', response:data, advanceSearch:true} );
Helper.overlay(false);
setloader(false);
          }
        })
        .catch((error) => {
          //console.log("error", error.response);
          // alert(error.response.data.message);
                 //console.log("error", error.response);
        Localdispatch({ type: 'FETCH_ERROR', payload: error.response.data.data })
        //Localdispatch({ type: 'FETCH_ERROR', payload: error.response.data.data })
        //dispatch({type: 'SET_STATE', response:[]} );
        console.log("FETCH_ERROR");
        Helper.overlay(false);
        setloader(false);
        //alert(error.response.data.message);
        setShow(true);
        setErrorMsg(error.response.data.message);
        });
  
      //}
    };
  
  
    // useEffect(() => {
    //   window.Echo = new Echo({
    //     broadcaster: "pusher",
    //     key: "app",
    //     wsHost: "dev.movitronic.com",
    //     wsPort: 6001,
    //     forceTLS: false,
    //     disableStats: true,
    //   });
    useEffect(() => {
      // if(Helper.getPermissions(
      //   "vehicle-read",
      //   permissions && permissions,
      //   "admin"
      // ) || Helper.getPermissions("", [], user.type)){
        window.Echo = new Echo({
          broadcaster: "pusher",
          key: "app",
          wsHost: "dev.movitronic.com",
          wsPort: 6001,
          wssPort: 6001,
          forceTLS: true,
          useTLS: true,
          disableStats: true,
          encrypted: true,
          authEndpoint: "https://dev.movitronic.com/broadcasting/auth",
          auth: { headers: { "Authorization": "Bearer "+user.access_token } }
        });
      
      console.log("pusherresult", window.Echo);
  
      window.Echo.channel(`private-movitronic`).listen("usage", (e) => {
        console.log("beforeEvent", e);
        if (e.data) {
          console.log("afterEvent", e);
          getVehicleList(activePage)
          setListenerEvent(e.data);
        } else {
          setListenerEvent(e.data);
          getVehicleList(activePage)
        }
      });
  
      window.Echo.channel(`private-movitronic`).listen("usage", (e) => {
        console.log("beforeEvent", e);
        if (e.data) {
          console.log("afterEvent", e);
          getVehicleList(activePage)
          setListenerEvent(e.data);
        } else {
          setListenerEvent(e.data);
          getVehicleList(activePage)
        }
      });
  
      overlay(true);
      setloader(true);
  
      getVehicleList(activePage)
    }, []);
  
    // useEffect(() => {
    //   if (state.data.length) {
    //     setrecords(state.data);
    //     sethidePagination(true);
    //   } else {
    //     console.log("Here");
    //     setrecords([]);
    //   }
    // }, [state.data]);
  
    const doorStatus = (e, carid, cmd) => {
      setDoorLoader(carid);
      document.getElementById(e.target.id).disabled = true;
      var formData = new FormData();
      let command = cmd ? false : true;
      formData.append("cmd", command);
      formData.append("car_id", carid);
      Localdispatch({ type: 'DEFAULT', payload: true})
      Helper.overlay(true);
      setloader(true);
      apiRequest("POST", "https://dev.movitronic.com/api/event/door", formData)
        .then((response) => {
          if (response.data.code == 200) {
            let data = response.data.data;
            console.log("Success", response.data.data);
            getVehicleList(activePage)
            document.getElementById(e.target.id).disabled = false;
            Localdispatch({ type: 'FETCH_SUCCESS', payload: response.data.message })
          dispatch({type: 'SET_STATE', response:data, advanceSearch:true} );
          Helper.overlay(false);
          setloader(false);
          } else if (response.data.code == 401) {
            document.getElementById(e.target.id).disabled = false;
            console.log("Failure", response);
          } else {
            document.getElementById(e.target.id).disabled = false;
            console.log("Failure", response);
          }
        })
        .catch((error) => {
          Localdispatch({ type: 'FETCH_ERROR', payload: error.response.data.data })
          //Localdispatch({ type: 'FETCH_ERROR', payload: error.response.data.data })
          //dispatch({type: 'SET_STATE', response:[]} );
          console.log("FETCH_ERROR");
          Helper.overlay(false);
          setloader(false);
          setShow(true);
          setErrorMsg(error.response.data.message);
        });
    };
  
    const trunkStatus = (e, carid, cmd) => {
      setTrunkLoader(carid);
      document.getElementById(e.target.id).disabled = true;
      var formData = new FormData();
      //let command = cmd ? false : true;
      let command = cmd ? false : true;
      formData.append("cmd", command);
      formData.append("car_id", carid);
      Localdispatch({ type: 'DEFAULT', payload: true})
      Helper.overlay(true);
      setloader(true);
      apiRequest("POST", "https://dev.movitronic.com/api/event/trunk", formData)
        .then((response) => {
          if (response.data.code == 200) {
            console.log("Success", response.data.data);
            getVehicleList(activePage)
            document.getElementById(e.target.id).disabled = false;
          } else if (response.data.code == 401) {
            document.getElementById(e.target.id).disabled = false;
            console.log("Failure", response);
          } else {
            document.getElementById(e.target.id).disabled = false;
            console.log("Failure", response);
          }
        })
        .catch((error) => {
          Localdispatch({ type: 'FETCH_ERROR', payload: error.response.data.data })
        //Localdispatch({ type: 'FETCH_ERROR', payload: error.response.data.data })
        //dispatch({type: 'SET_STATE', response:[]} );
        console.log("FETCH_ERROR");
        Helper.overlay(false);
        setloader(false);
        //alert(error.response.data.message);
        setShow(true);
        setErrorMsg(error.response.data.message);
 
        });
    };
    const handlePageChange = (pageNumber) => {
      //console.log(`active page is ${pageNumber}`);
      setactivePage(pageNumber);
      apiRequest(
        MySharesWithMeAPI.method,
        MySharesWithMeAPI.url + `?page=${pageNumber}`
      )
        .then((response) => {
          let data = response.data;
          if (response.data.code == 200) {
            setrecords(response.data.data);
            //console.log("Success", response);
          } else {
            //console.log("Failure", response);
          }
        })
        .catch((error) => {
          //console.log("error", error);
          alert(error);
        });
    };
  
    return (
      <React.Fragment>
             <Modal backdrop="static" show={rsModal} onHide={Modalclose} size="xs">
          <Modal.Body>
            <Icon
              icon="remind"
              style={{
                color: '#ffb300',
                fontSize: 24
              }}
            />
            {'  '}
            Are you sure you want to delete this record?
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={deleteRecord} appearance="primary">
              Ok
            </Button>
            <Button onClick={Modalclose} appearance="subtle">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>


       {/* <Modal show={show} onHide={handleClose}>
        
        <Modal.Body> <h4 className="text-center">{errorMsg}</h4>
        <Button variant="secondary" className="float-right" onClick={handleClose}>Close</Button>
        </Modal.Body>
      </Modal> */}

<Modal show={show} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title></Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <h5>{errorMsg}</h5>
          </Modal.Body>
          <Modal.Footer>
            
            <Button onClick={handleClose} appearance="subtle">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
          <div id="content">
            <Header showSearch={true} />
            <div className="p-4">
              <div className="row border-bottom">
                <div className="col-md-4">
                  <div className="d-flex flex-row mb-3">
                    {/* <div className="p-2">
                    {(Helper.getPermissions(
                          "vehicle-delete",
                          permissions && permissions,
                          "admin"
                        ) ||
                          Helper.getPermissions("", [], user.type)) && (
                    <input type="checkbox" onChange={handleMainCheckBox}/>
                          )}
                    </div> */}
                    <div className="p-2">
                      {/* <button className="btn btn-primary" onClick={getcheckbox}>Bulk Delete</button> */}
                    </div>
                    {/* {
                      Helper.getPermissions(
                        "vehicle-create",
                        permissions && permissions,
                        "admin"
                      ) || Helper.getPermissions("", [], user.type) && */}
                      {/* <div className="p-2">
                      {(Helper.getPermissions(
                    "vehicle-create",
                    permissions && permissions,
                    "admin"
                  ) ||
                    Helper.getPermissions("", [], user.type)) && (
                        <NavLink
                          exact
                          to={`/admin/add-vehicle`}
                          className="btn white bg-orange"
                        >
                          New Vehicle
                        </NavLink>
                    )}
                      </div> */}
                    {/* } */}
                  </div>
                </div>
  
  
                <div className="col-md-4 p-2 text-center font-weight-bold">
                  {/* <NavLink className="black" exact to={`/admin/vehicle-list`}>
                    Show My List
                  </NavLink> */}
                  {/* {(user.type === "superadmin" || user.type === "admin" && Helper.getPermissions(
                    "vehicle-read",
                    permissions && permissions,
                    "admin"
                  )) && (
                    <React.Fragment>
                      
                      <NavLink
                        className="black"
                        exact
                        to={`/admin/all-vehicle-list`}
                      >
                        Show All List
                      </NavLink>
                      {` | `}
                  <NavLink className="black" exact to={`/admin/vehicle-map-all-list`}>
                    Show All on Map
                  </NavLink>
                    </React.Fragment>
                  )}
                  {` | `}
                  <NavLink className="black" exact to={`/admin/vehicle-map-list`}>
                    Show on Map
                  </NavLink> */}
                 
                  
                </div>
  
                <div className="col-md-4">
                  <div className="d-flex flex-row mb-3">
                    <div className="p-2">Results: {result.total}</div>
                    <div className="pl-4 pt-1">
                      {/* <form className="form-inline">
                        <label className="my-1 mr-2">Sort:</label>
                        <select
                          className="form-control p-0"
                          style={{ height: "30px" }}
                          defaultValue={"Last seen online first"}
                        >
                          <option value="Last seen online first">
                            Last seen online first
                          </option>
                          <option value="Last used first">Last used first</option>
                          <option value="Error">Error</option>
                          <option value="Olderst firmware first">
                            Olderst firmware first
                          </option>
                        </select>
                      </form> */}
                    </div>
                  </div>
                </div>
              </div>
              {loader && (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border text-warning" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              )}
             <div className="row">
              {records.length ? (
                records.map((record, index) => {
                  return (
                    <div
                      className="col-md-4 mt-3 user border-bottom pb-3 ft-14"
                      key={index}
                    >
                    
                      <div class="card card-shadow">
                        <img
                          src={record.vehicle.file}
                          className="card-img-top"
                          alt="..."
                          width="100"
                          height="100"
                          
                        />
                        <div className="card-body">
                          <h5 className="card-title text-uppercase">
                            <div className="form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                name="subcheckbox"
                               defaultValue={record.vehicle && record.vehicle.detail.id}
                                id="exampleCheck1"
                              />
                              <NavLink
                                className="black"
                                exact
                                to={`/admin/vehicle-details`}
                              >
                                <label
                                  className="form-check-label font-weight-bold"
                                  htmlFor="exampleCheck1"
                                >
                                  <u>{record.vehicle && record.vehicle.detail.device_code}</u>
                                </label>
                              </NavLink>
                            </div>
                          </h5>
                          <p class="card-text">
                            <div className="d-flex justify-content-between">
                              <div>
                                Car name: <strong>{record.vehicle && record.vehicle.name}</strong>
                              </div>
                              <div>
                                Tags:<strong>{record.vehicle && record.vehicle.tags}</strong> 
                              </div>
                            </div>

                            <div className="d-flex justify-content-between">
                              <div>
                                Last seen: <strong>30 seconds ago</strong>
                              </div>
                              <div>
                                Status: <strong>Sleep mode</strong>
                              </div>
                            </div>

                            <div className="d-flex justify-content-between">
                              <div>
                               Color: <strong>{record.vehicle && record.vehicle.colour}</strong> 
                              </div>
                              <div>
                               Operator:
                                <span className="font-weight-bold">
                                <strong><u>AS004850 (Private)</u></strong>
                                </span>
                              </div>
                            </div>

                            <div>
                              Car alarms:
                              <span className="text-danger">
                                Engine light on (20 days)
                              </span>
                            </div>
                            <div>Device alarms: -</div>
                          </p>
                        </div>
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item">
                            <div className="d-flex justify-content-between">
                              <div>
                                {" "}
                               Odometer:  <strong>140 000 km</strong>
                              </div>
                              <div>
                                Fuel level:<strong>{record.vehicle.detail && record.vehicle.detail.fuel}%</strong> 
                              </div>
                            </div>

                            <div className="d-flex justify-content-between">
                              <div>
                               Engine: <strong>Not running</strong> 
                              </div>
                              <div>
                               Central lock:{" "}
                               <strong> <span className="text-danger">Open</span></strong>
                              </div>
                            </div>

                            <div className="d-flex justify-content-between">
                              <div>
                               Doors:
                               <strong> {record.doors ? "Open" : "Closed"}</strong>
                              </div>
                              <div>
                                Trunk:
                                <strong>{record.trunk ? "Open" : "Closed"}</strong>
                              </div>
                            </div>
                            <div className="d-flex justify-content-between">
                              <div>
                                Year: <strong>{record.vehicle && record.vehicle.year}</strong>
                              </div>
                              <div>
                               Car Make:
                               <strong> {record.vehicle && record.vehicle.vehicle_company_name}</strong>
                              </div>
                            </div>
                          </li>
                          <li class="list-group-item">
                            <div className="d-flex justify-content-between">
                              <div>
                              HW <strong> 1.0</strong>
                              </div>
                              <div>
                                FW: 
                                <strong> {record.fw_version}</strong>
                                {record.can_update &&
                                  (isSoftware !== record.id ? (
                                    <button
                                      className="btn btn-sm bg-danger text-white ml-1"
                                      onClick={() =>
                                        UpdateSoftware(
                                          record.fw_version,
                                          record.id
                                        )
                                      }
                                    >
                                      Update
                                    </button>
                                  ) : (
                                    <button className="btn btn-sm bg-success text-white ml-1">
                                      Installed
                                    </button>
                                  ))}
                              </div>
                            </div>
                            <div className="d-flex justify-content-between">
                              <div>
                                <strong>S:</strong>2102884885
                              </div>
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="shared"
                                  defaultChecked={record.share}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="shared"
                                >
                                  <strong>Shared</strong>
                                </label>
                              </div>
                            </div>
                            <div>
                              Active shares:
                              <span className="font-weight-bold">
                                <u>{record.active_shares}</u>
                              </span>
                            </div>
                          </li>
                          <li class="list-group-item">
                            <div className="d-flex justify-content-between">
                              <div>
                               Location:
                                <span className="font-weight-bold">
                                <strong>  <u>Tuukri 50, Tallinn, Estonia</u></strong>
                                  <i
                                    className="fa fa-map-marker-alt pl-1"
                                    style={{ color: "green" }}
                                  ></i>
                                </span>
                              </div>
                              <div>
                                <strong> License:</strong>
                                <span className="">
                                  <u>{record.license}</u>
                                </span>
                              </div>
                            </div>
                            <div className="d-flex justify-content-between">
                              <div>
                               Latitude: 
                               <strong> <span className="font-weight-bold">
                                  <u>{record.vehicle && record.vehicle.detail.latitude}</u>
                                </span></strong>
                              </div>
                              <div>
                               Longitude:
                               <strong> <span className="font-weight-bold">
                                  <u>{record.vehicle && record.vehicle.detail.longitude}</u>
                                </span> </strong>
                              </div>
                            </div>
                            <div>
                             Last usage<strong>14.12.2020 14:00, 6km</strong>
                            </div>
                            <div className="d-flex justify-content-between">
                              <div>
                                Pevious usage:
                                <strong><span className="font-weight-bold">
                                  <u>{record.previos_usage}</u>
                                </span></strong>
                              </div>
                              <div>
                               Current usage:
                               <strong><span className="font-weight-bold">
                                  <u>{record.current_usage}</u>
                                </span></strong>
                              </div>
                            </div>
                            <div>
                               Current user:
                               <strong><span className="font-weight-bold">
                                <u>{record.current_user}</u>
                              </span></strong>
                            </div>
                          </li>
                        </ul>
                        <div class="card-body">
                          <div className="row">
                            <div className="col-md-6">
                               <button
                              id={`door${record.vehicle.id}`}
                              disabled={record.vehicle.id === doorLoader ? true: false}
                              className={`btn btnn-user ${
                                record.door_button
                                  ? "btn-danger "
                                  : "btn-success "
                              } text-uppercase ft-14`}
                              data-id={record.vehicle.id}
                              onClick={(e) =>
                                doorStatus(
                                  e,
                                  record.vehicle.id,
                                  record.door_button
                                )
                              }
                            >
                              {`${
                                record.door_button
                                  ? "Lock a Car"
                                  : "Unlock a Car"
                              }`}
                                {record.vehicle.id === doorLoader ? <span className="ml-2 spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>: ''}
                            </button>
                            </div>
                            <div className="col-md-6">
                              <button
                            id={`trunk${record.vehicle.id}`}
                            disabled={record.vehicle.id === trunkLoader ? true : false}
                            className={`btn btn-success btnn-user text-uppercase ft-14`}
                            data-id={record.vehicle.id}
                            onClick={(e) =>
                              trunkStatus(
                                e,
                                record.vehicle.id,
                                record.trunk_button
                              )
                            }
                          >
                            {`Open Trunk`}
                            {record.vehicle.id === trunkLoader ? <span className="ml-2 spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>: ''}
                          </button>
                          
                            </div>
                          </div>

                          <br />

                          <br />
                          <div className="row">
                          <div className="col-md-6">
                          {/* {(Helper.getPermissions(
                            "vehicle-delete",
                            permissions && permissions,
                            "admin"
                          ) ||
                            Helper.getPermissions("", [], user.type)) && (
                            <button
                              className="btn btn-danger btn-user btn-block"
                              data-id={record.id}
                              onClick={Modalopen}
                            >
                              Delete
                            </button>
                          )} */}
                          </div>
                          <br />
                          <div className="col-md-6">
                          {/* {(Helper.getPermissions(
                            "vehicle-update",
                            permissions && permissions,
                            "admin"
                          ) ||
                            Helper.getPermissions("", [], user.type)) && (
                            <NavLink
                              className="black"
                              exact
                              to={`/admin/edit-vehicle-details/${record.id}`}
                            >
                              <button className="btn btn-info btn-block">
                                Edit
                              </button>
                            </NavLink>
                          )} */}
                          </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center ft-14 mt-3 font-weight-bold">
                  No Data Found...
                </div>
              )}
            </div>
              <div className="row mt-3 ft-14">
                <div className="col-md-12">
                  <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-end">
                      {!hidePagination && (
                        <Pagination
                          activePage={activePage}
                          itemsCountPerPage={result.to}
                          totalItemsCount={result.total ? result.total : 1}
                          pageRangeDisplayed={result.last_page}
                          itemClass="page-item"
                          linkClass="page-link"             
                          onChange={handlePageChange}
                        />
                      )}
                      <li className="pl-3">
                        {/* <form className="form-inline">
                          <label className="my-1 mr-2">Results on page:</label>
                          <select
                            className="form-control p-0"
                            style={{ height: "30px" }}
                            defaultValue={"10"}
                          >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                          </select>
                        </form> */}
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
            
          </div>
      </React.Fragment>
    );
  }
export default SharesWithMeList;
