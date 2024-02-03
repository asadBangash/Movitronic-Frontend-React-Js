import React, { useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import Header from "../Header/Index.js";
import { Formik, Field, Form, FieldArray } from "formik";
import { ToastContainer, toast } from "react-toastify";
import AdvanceSearch from "../Header/AdvanceSearch";
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from "yup";
import { Context } from "../Store/Store";
//import { Modal, Button } from "react-bootstrap";
import { Modal,Button,Icon,ButtonToolbar} from 'rsuite';
import Echo from "laravel-echo";
import Pagination from "react-js-pagination";
import Helper from "../Helper";
var {
  AllVehicleListAPI,
  Updatewhitelabeltovechile,
   Addwhitelabeltovechile,
   SearchListAPI,
   AddWhitelabelListing,
   Sharewhitelabeltovechile,
  deleteVehicle,
  alldeleteVechile,
  UpdateSoftwaree,
} = require("../Api/ApiRoutes");
var { apiRequest } = require("../Api/Service");
const _ = require("lodash");
window.Pusher = require("pusher-js");

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

function AllVehicleList(props) {
  const DetailSchema = Yup.object().shape({
    hprice: Yup.string().required("This Field is Required"),
    dprice: Yup.string().required("This Field is Required"),
  });
  
  const [state, dispatch] = useContext(Context);
  const [records, setrecords] = React.useState([]);
  const [whiterecords, setwhiterecords] = React.useState([]);
  const [activePage, setactivePage] = React.useState(1);
  const [wactivePage, setwactivePage] = React.useState(1);
  const [wresult, whitelabelsetResult] = React.useState({});
  const [loader, setloader] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  //const handleClose = () => setShow(false);
  const [LocalState, Localdispatch] = React.useReducer(reducer, initialState);
  const [doorLoader, setDoorLoader] = React.useState(null);
  const [trunkLoader, setTrunkLoader] = React.useState(null);
  const [isSoftware, setIsSoftware] = React.useState(null);
  const [result, setResult] = React.useState({});
  const [hidePagination, sethidePagination] = React.useState(false);
  const [listenerEvent, setListenerEvent] = React.useState(0);
  const [searchData, setSearchData] = React.useState(false);
  const [rsModal, setRsModal] = React.useState(false);

  const [currentId, setCurrentId] = React.useState(null);

  const [whitelabelModal, setWhitelabelModal] = React.useState(false);
  const [sharewhitelabelModal, setshareWhitelabelModal] = React.useState(false);
  const [currentLabelId, setCurrentLabelId] = React.useState(null);


  const Modalclose=()=> {
    setRsModal(false);
  }
  const Modalopen=(e)=> {
    setCurrentId(e.target.dataset.id);
    setRsModal(true);
  }

  const getWhiteLabelList = () => {
    Helper.overlay(true);
    setloader(true);
    apiRequest(AddWhitelabelListing.method, AddWhitelabelListing.url)
      .then((response) => {
        if (response.data.code == 200) {
          setwhiterecords(response.data.data);
          whitelabelsetResult(response.data.meta);
          Helper.overlay(false);
          setloader(false);
        }
      })
      .catch((error) => {
        console.log(error);
        Helper.overlay(false);
        setloader(false);
      });
  };

  const whitelabelModalclose = () => {
    setWhitelabelModal(false);
  };
  const whitelabelModalopen = (e) => {
    getWhiteLabelList();
    setwactivePage(1);
    setCurrentId(e.target.dataset.id);
    setWhitelabelModal(true);
    setCurrentLabelId(e.target.dataset.label);
  };

  const sharewhitelabelModalclose = () => {
    setshareWhitelabelModal(false);
  };
  const sharewhitelabelModalopen = (e) => {
    setCurrentId(e.target.dataset.id);
    setshareWhitelabelModal(true);
  };

  
  var user = Helper.getStorageData("SESSION");
  var permissions = user.permissions;

  const handleClose = () => {
    setShow(false);
    setDoorLoader(null);
    setTrunkLoader(null);
  };

  const getwhitelabellist = () => {
    apiRequest(AddWhitelabelListing.method, AddWhitelabelListing.url)
      .then((response) => {
        if (response.data.code == 200) {
          setwhiterecords(response.data.data);
          whitelabelsetResult(response.data.meta);
          Helper.overlay(false);
          setloader(false);
        }
      })
      .catch((error) => {
        console.log(error);
        Helper.overlay(false);
        setloader(false);
      });
  };

  React.useEffect(() => {
    // if(Helper.getPermissions("user-read",permissions && permissions,"admin") || (user.type === 'superadmin')){
    Helper.overlay(true);
    setloader(true);
    apiRequest(AddWhitelabelListing.method, AddWhitelabelListing.url)
      .then((response) => {
        if (response.data.code == 200) {
          setwhiterecords(response.data.data);
          setResult(response.data.meta);
          Helper.overlay(false);
          setloader(false);
        }
      })
      .catch((error) => {
        console.log(error);
        Helper.overlay(false);
        setloader(false);
      });
   // }
  }, []);
  
  const handleLabel = (id) => {
    setCurrentLabelId(id);
  };
  
  const getVehicleList = () => {
    apiRequest(AllVehicleListAPI.method, AllVehicleListAPI.url)
      .then((response) => {
        if (response.data.code == 200) {
          console.log("response", response.data.data);
          setrecords(response.data.data);
          setResult(response.data.meta);
          // dispatch({
          //   type: "SET_STATE",
          //   response: response.data.data,
          //   advanceSearch: false,
          // });
          Helper.overlay(false);
          setloader(false);
        } else {
          console.log("Failure", response);
          Helper.overlay(false);
          setloader(false);
        }
      })
      .catch((error) => {
        console.log(error);
        Helper.overlay(false);
        setloader(false);
      });
  };


  function whiteSearch(e){
    let val = e.target.value;

    apiRequest(SearchListAPI.method, SearchListAPI.url+`?search=${val}`)
    .then((response) => {
      if (response.data.code == 200) {
        setwhiterecords(response.data.data);
        
        Helper.overlay(false);
        setloader(false);
      } else {
     
        Helper.overlay(false);
        setloader(false);
      }
    })
    .catch((error) => {
    
      Helper.overlay(false);
      setloader(false);
    });

    
  }

  useEffect(() => {
    //if(Helper.getPermissions('vehicle-read',permissions)){
    // window.Echo = new Echo({
    //   broadcaster: "pusher",
    //   key: "app",
    //   wsHost: "api.movitronic.com",
    //   wsPort: 6001,
    //   forceTLS: false,
    //   disableStats: true,
    // });

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
      auth: { headers: { Authorization: "Bearer " + user.access_token } },
    });

    console.log("pusherresult", window.Echo);

    window.Echo.channel(`private-movitronic`).listen("door", (e) => {
      console.log("beforeEvent", e);
      if (e.data) {
        console.log("afterEvent", e);
        getVehicleList();
      } else {
        getVehicleList();
      }
    });

    window.Echo.channel(`private-movitronic`).listen("truck", (e) => {
      console.log("beforeEvent", e);
      if (e.data) {
        console.log("afterEvent", e);
        getVehicleList();
      } else {
        getVehicleList();
      }
    });

    window.Echo.channel(`private-movitronic`).listen("fw_update_apply", (e) => {
      console.log("beforeEventttttttttttttttttttttttttttttt", e);
      if (e.data) {
        console.log("afterEvent", e);
        getVehicleList(activePage);
        setListenerEvent(e.data);
      } else {
        setListenerEvent(e.data);
        getVehicleList(activePage);
      }
    });

    console.log("pusherresultttttttttttttt", window.Echo);

    Helper.overlay(true);
    setloader(true);

    if (props.location.hash !== "#search") {
      getVehicleList(activePage);
      sethidePagination(false);
    } else {
      setSearchData(true);
      Helper.overlay(false);
      setloader(false);
      sethidePagination(true);
    }
    //}
  }, []);

  useEffect(() => {
    if (state.data.length) {
      setrecords(state.data);
      if (state.advanceSearch) {
        sethidePagination(true);
      }
    } else {
      console.log("Here");
      setrecords([]);
    }
  }, [state.data]);

  // const doorStatus = (e, carid, cmd) => {
  //   document.getElementById(e.target.id).disabled = true;
  //   var formData = new FormData();
  //   let command = cmd ? false : true;
  //   formData.append("cmd", command);
  //   formData.append("car_id", carid);
  //   apiRequest("POST", "https://dev.movitronic.com/api/event/door", formData)
  //     .then((response) => {
  //       if (response.data.code == 200) {
  //         console.log("Success", response.data.data);
  //         getVehicleList();
  //         document.getElementById(e.target.id).disabled = false;
  //       } else if (response.data.code == 401) {
  //         document.getElementById(e.target.id).disabled = false;
  //         console.log("Failure", response);
  //       } else {
  //         document.getElementById(e.target.id).disabled = false;
  //         console.log("Failure", response);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  const doorStatus = (e, carid, cmd) => {
    setDoorLoader(carid);
    document.getElementById(e.target.id).disabled = true;
    var formData = new FormData();
    let command = cmd ? false : true;
    formData.append("cmd", command);
    formData.append("car_id", carid);
    Localdispatch({ type: "DEFAULT", payload: true });
    Helper.overlay(true);
    setloader(true);
    apiRequest("POST", "https://dev.movitronic.com/api/event/door", formData)
      .then((response) => {
        if (response.data.code == 200) {
          let data = response.data.data;
          console.log("Success", response.data.data);
          getVehicleList(activePage);
          document.getElementById(e.target.id).disabled = false;
          Localdispatch({
            type: "FETCH_SUCCESS",
            payload: response.data.message,
          });
          dispatch({ type: "SET_STATE", response: data, advanceSearch: true });
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
        Localdispatch({
          type: "FETCH_ERROR",
          payload: error.response.data.data,
        });
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
    let command = cmd ? false : true;
    formData.append("cmd", command);
    formData.append("car_id", carid);
    Localdispatch({ type: "DEFAULT", payload: true });
    Helper.overlay(true);
    setloader(true);
    apiRequest("POST", "https://dev.movitronic.com/api/event/trunk", formData)
      .then((response) => {
        if (response.data.code == 200) {
          console.log("Success", response.data.data);
          getVehicleList();
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
        Localdispatch({
          type: "FETCH_ERROR",
          payload: error.response.data.data,
        });
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
    console.log(`active page is ${pageNumber}`);
    setactivePage(pageNumber);
    apiRequest(
      AllVehicleListAPI.method,
      AllVehicleListAPI.url + `?page=${pageNumber}`
    )
      .then((response) => {
        let data = response.data;
        if (response.data.code == 200) {
          setrecords(response.data.data);
          console.log("Success", response);
        } else {
          console.log("Failure", response);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const handlePageChangewhitelabel = (pageNumber) => {
    //console.log(`active page is ${pageNumber}`);
    setwactivePage(pageNumber);
    apiRequest(
      AddWhitelabelListing.method,
      AddWhitelabelListing.url + `?page=${pageNumber}`
    )
      .then((response) => {
        let data = response.data;
        if (response.data.code == 200) {
          setwhiterecords(response.data.data);
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
            setRsModal(false);
            window.location.reload();
            console.log("Success", response);
          } else {
            console.log("Failure", response);
          }
        })
        .catch((error) => {
          console.log("error", error);
          alert(error);
        });
    //}
  };

  const UpdateSoftware = (version_id, car_id) => {
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
    setloader(true);
    Helper.overlay(true);
    apiRequest(UpdateSoftwaree.method, UpdateSoftwaree.url, params)
      .then((response) => {
        let data = response.data;
        //console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa",response);
        if (response.data.code == 200) {
          setIsSoftware(car_id);
          //setrecords(response.data.data);
          //window.location.reload();
          //getVehicleList(activePage)
          console.log("Success", response);
          Localdispatch({
            type: "FETCH_SUCCESS",
            payload: response.data.message,
          });
          dispatch({ type: "SET_STATE", response: data, advanceSearch: true });
          Helper.overlay(false);
          setloader(false);
        }
      })
      .catch((error) => {
        //console.log("error", error.response);
        Localdispatch({
          type: "FETCH_ERROR",
          payload: error.response.data.data,
        });
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


  const AddWhiteLabelwithVehicle = (car_id) => {
    //setIsSoftware(null);
      let params = new FormData();
    params.append("vehicle_id", currentId);
    params.append("label_id", car_id);
    //Localdispatch({ type: 'DEFAULT', payload: true})
    setloader(true);
    Helper.overlay(true);   
      apiRequest(
        Addwhitelabeltovechile.method,
        Addwhitelabeltovechile.url , params
    )
      .then((response) => {
        let data = response.data;
        if (response.data.code == 200) {
          //setIsSoftware(car_id);
          toast.success(response.data.message)
          //getVehicleList(activePage)
          setWhitelabelModal(false);
Localdispatch({ type: 'FETCH_SUCCESS', payload: response.data.message })
Helper.overlay(false);
setloader(false);
        }
      })
      .catch((error) => {
        //console.log("error", error.response);
        //alert(error.response.data.message);
   Localdispatch({ type: 'FETCH_ERROR', payload: error.response.data.data })
   //Localdispatch({ type: 'FETCH_ERROR', payload: error.response.data.data })
   //dispatch({type: 'SET_STATE', response:[]} );
   console.log("FETCH_ERROR");
   Helper.overlay(false);
   setloader(false);
   //alert(error.response.data.message);
   //setShow(true);
   //setErrorMsg(error.response.data.data.label_id);
   toast.error(error.response.data.data.label_id)
      });

    //}
  };


  const UpdatehiteLabelwithVehicle = (car_id, vid) => {
    //console.log(vid,"sfsfsfsfsdfsdfsdfsd");
    //setIsSoftware(null);
    let params = new FormData();
    params.append("vehicle_id", vid);
    params.append("label_id", car_id);
    //Localdispatch({ type: 'DEFAULT', payload: true})
    setloader(true);
    Helper.overlay(true);
    apiRequest(
      Updatewhitelabeltovechile.method,
      Updatewhitelabeltovechile.url + vid,
      params
    )
      .then((response) => {
        let data = response.data;
        if (response.data.code == 200) {
          //setIsSoftware(car_id);
          toast.success(response.data.message);
          getVehicleList(activePage);
          getwhitelabellist();
          setWhitelabelModal(false);
          Localdispatch({
            type: "FETCH_SUCCESS",
            payload: response.data.message,
          });
          Helper.overlay(false);
          setloader(false);
        }
      })
      .catch((error) => {
        //console.log("error", error.response);
        //alert(error.response.data.message);
        Localdispatch({
          type: "FETCH_ERROR",
          payload: error.response.data.data,
        });
        //Localdispatch({ type: 'FETCH_ERROR', payload: error.response.data.data })
        //dispatch({type: 'SET_STATE', response:[]} );
        console.log("FETCH_ERROR");
        Helper.overlay(false);
        setloader(false);
        //alert(error.response.data.message);
        //setShow(true);
        //setErrorMsg(error.response.data.data.label_id);
        toast.error(error.response.data.message);
      });

    //}
  };


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


  const handleSubmit = (values) => {
    // const form_data = Helper.formData(values);
    const form_data = new FormData();
    form_data.append("hprice", values.hprice);
    form_data.append("dprice", values.dprice);
    form_data.append("vehicle_id", currentId);
    form_data.append("label_id", currentLabelId);
    //form_data.append('contact_no', values.contact_no);
    //form_data.append('color', values.color);
    //form_data.append('file', values.file);

    Localdispatch({ type: "DEFAULT", payload: true });
    apiRequest(
      Sharewhitelabeltovechile.method,
      Sharewhitelabeltovechile.url,
      form_data
    )
      .then((response) => {
        if (response.data.code == 200) {
          let data = response.data.data;
          Localdispatch({
            type: "FETCH_SUCCESS",
            payload: response.data.message,
          });
          setshareWhitelabelModal(false);
          setWhitelabelModal(false);
          getVehicleList(activePage);

          toast.success(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        Localdispatch({
          type: "FETCH_ERROR",
          payload: error.response.data.data,
        });
        toast.error(error.response.data.message);
        window.scrollTo(500, 0);
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
    console.log("array", array);
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


        <Modal
        backdrop="static"
        show={whitelabelModal}
        onHide={whitelabelModalclose}
        size="xs"
      >
        <Modal.Header>
          <Modal.Title className="pb-3">Assgin To</Modal.Title>
          <input
            type="search"
            className="form-control"
            onChange={whiteSearch}
            placeholder="Search.."
          />
        </Modal.Header>
        <Modal.Body className=" ">
          {loader && (
            <div className="d-flex justify-content-center">
              <div className="spinner-border text-warning" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}

          {currentLabelId && (
            <div
              class="d-flex media-list big px-3 mt-3 justify-content-between align-items-center"
              onClick={() =>
                UpdatehiteLabelwithVehicle(currentLabelId, currentId)
              }
            >
              <div>
                <div class="media">
                  <i
                    class="fa fa-question-circle  my-1 fa-3x"
                    aria-hidden="true"
                  ></i>
                  <div class="media-body align-self-center">
                    <h5 class="mt-0 ml-2 fs"> Unassgin</h5>
                  </div>
                </div>
              </div>
            </div>
          )}

          {whiterecords.length ? (
            whiterecords.map((record, index) => (
              <label class="big">
              <div
                key={index}
                htmlFor={`radio${record.id}`}
                class="d-flex media-list big px-3 mt-3 justify-content-between align-items-center"
              >
                 
                <div>
                  <div class="media">
                    <img src={record.file} className="mr-2 user-image my-1"  />
                    <div class="media-body align-self-center">
                      <strong class="mt-0 fs">{record.name}</strong>
                      
                    </div>
                  </div>
                </div>
                <div >
                 
                  
                  <div>
                 
                  
                  <input
                    type="radio"
                    defaultChecked={currentId == record.vehicle_id && true}
                    checked={currentLabelId == record.id && true}
                    class="form-check-input"
                    name="radios"
                    id={`radio${record.id}`}
                    onChange={() => handleLabel(record.id)}
                  />
                 
                  </div>
                </div>
               
              </div>
              </label>
            ))
          ) : (
            <div className="text-center ft-14 mt-3 font-weight-bold">
              No Data Found...
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="row mt-3  ft-14">
            <div className="col-md-12">
              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                  {!hidePagination && (
                    <Pagination
                    activePage={wactivePage}
                      itemsCountPerPage={wresult.to}
                      totalItemsCount={wresult.total ? wresult.total : 1}
                      pageRangeDisplayed={wresult.last_page}
                      itemClass="page-item"
                      linkClass="page-link"
                      onChange={handlePageChangewhitelabel}
                    />
                  )}
                </ul>
              </nav>
            </div>
          </div>
          <Button onClick={whitelabelModalclose} appearance="subtle">
            <b className="text-primary">Cancel</b>
          </Button>
                
          <button
            className=" btn btn-successs  ml-1"
            disabled={!currentLabelId  && true}
            data-id={currentId}
            onClick={sharewhitelabelModalopen}
          >
            Assgin
          </button>

          
        </Modal.Footer>
      </Modal>


      <Modal
        backdrop="static"
        show={sharewhitelabelModal}
        onHide={sharewhitelabelModalclose}
        size="lg"
      >
        <Modal.Body>
          <div className="p-4">
            <h4 className="mb-3">Share WhiteLabel</h4>
            <Formik
              validateOnChange={false}
              validationSchema={DetailSchema}
              onSubmit={async (values) => {
                handleSubmit(values);
              }}
              initialValues={{
                hprice: "",
                dprice: "",
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
                <Form className="mt-2 user">
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label className="form-label">H Price</label>
                      <input
                        type="text"
                        name="hprice"
                        value={values.hprice || ""}
                        onChange={handleChange}
                        placeholder="Enter H Price"
                        className={`form-control form-control-user ${
                          errors.hprice ? "error" : ""
                        }`}
                      />
                      {errors.hprice && (
                        <div className="ft-14 mt-1 red">{errors.hprice}</div>
                      )}
                    </div>
                    <div className="form-group col-md-6">
                      <label className="form-label">D Price</label>
                      <input
                        type="text"
                        name="dprice"
                        value={values.dprice || ""}
                        onChange={handleChange}
                        placeholder="Enter Your D Price"
                        className={`form-control form-control-user ${
                          errors.dprice ? "error" : ""
                        }`}
                      />
                      {errors.dprice && (
                        <div className="ft-14 mt-1 red">{errors.dprice}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group d-flex justify-content-end col-md-12">
                      <button
                        type="submit"
                        className="btn-submit btn-user"
                        disabled={LocalState.disable}
                      >
                        confirm Details
                        {LocalState.disable ? (
                          <span
                            className="ml-2 btn-user spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : (
                          ""
                        )}
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
            {/* <div className="row">
                <div className="col-md-12 mb-4">
                  Usages: <u>20</u>
                </div>
                <div className="col-md-12">
                  Drivers behaviour score: <u>4.5</u>
                </div>
              </div> */}
          </div>{" "}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={sharewhitelabelModalclose} appearance="subtle">
            <b className="text-danger">Cancel</b>
          </Button>
        </Modal.Footer>
      </Modal>


      {/* <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          {" "}
          <h4 className="text-center">{errorMsg}</h4>
          <Button
            variant="secondary"
            className="float-right"
            onClick={handleClose}
          >
            Close
          </Button>
        </Modal.Body>
      </Modal> */}
      {/* <div className="wrapper d-flex align-items-stretch">
        <Sidebar /> */}
      <div id="content">
        <Header showSearch={false} showAdvanceSearch={false} />
        {Helper.getPermissions(
          "vehicle-read",
          permissions && permissions,
          "admin"
        ) || Helper.getPermissions("", [], user.type) ? (
          <div className="p-4 user">
            <div className="row border-bottom">
              <div className="col-md-4">
                <div className="d-flex flex-row mb-3">
                  <div className="p-2">
                    <input type="checkbox" onChange={handleMainCheckBox} />
                  </div>
                  <div className="p-2">
                    {(Helper.getPermissions(
                      "vehicle-delete",
                      permissions && permissions,
                      "admin"
                    ) ||
                      Helper.getPermissions("", [], user.type)) && (
                      <button className="btn btnn-user  btn-primary" onClick={getcheckbox}>
                        Bulk Delete
                      </button>
                    )}
                  </div>
                  <div className="p-2">
                    {(Helper.getPermissions(
                      "vehicle-create",
                      permissions && permissions,
                      "admin"
                    ) ||
                      Helper.getPermissions("", [], user.type)) && (
                      <NavLink
                        exact
                        to={`/admin/add-vehicle`}
                        className="btn btnn-user white bg-orange"
                      >
                        New Vehicle
                      </NavLink>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-4 p-2 text-center font-weight-bold">
                {/* <NavLink className="black" exact to={`/admin/vehicle-list`}>
                Show My List
                </NavLink>
                {` | `} */}
                {/* { (Helper.getPermissions(
                  "vehicle-read",
                  permissions && permissions,
                  "admin"
                )  ||
                  Helper.getPermissions("", [], user.type)) && (
                <NavLink className="black" exact to={`/admin/all-vehicle-list`}>
                  Show All List
                </NavLink>
                  )}
                {` | `}
                <NavLink className="black" exact to={`/admin/vehicle-map-list`}>
                  Show on Map
                </NavLink>
                {` | `}
                <NavLink className="black" exact to={`/admin/vehicle-map-all-list`}>
                  Show All on Map
                </NavLink> */}
              </div>

              <div className="col-md-4">
                <div className="d-flex flex-row mb-3">
                  <div className="p-2">Results: 4</div>
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
              <div className="col-md-4">

              <AdvanceSearch/>
              </div>
              <div className="col-md-8">
              <div className="row">
              {records.length ? (
                records.map((record, index) => {
                  return (
                    <div
                      className="col-md-6 mt-3 user border-bottom pb-3 ft-14"
                      key={index}
                    >
                    
                      <div className="card card-shadow">
                        <img
                          src={record.file}
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
                                defaultValue={record.detail.id}
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
                                  <u>{record.detail.device_code}</u>
                                </label>
                              </NavLink>
                            </div>
                          </h5>
                          <p className="card-text">
                            <div className="d-flex justify-content-between">
                              <div className="mr-4">
                                Car name:<strong> {record.name}</strong>
                              </div>
                              <div className=""> 
                               Tags:  <strong>{record.tags}</strong>
                              </div>
                            </div>

                            <div className="d-flex justify-content-between">
                              <div>
                               Last seen: <strong> 30 seconds ago</strong>
                              </div>
                              <div>
                               Status: <strong>Sleep mode</strong> 
                              </div>
                            </div>

                            <div className="d-flex justify-content-between">
                              <div>
                               Color: <strong>{record.colour}</strong> 
                              </div>
                              <div>
                               Operator:
                                <span className="font-weight-bold">
                                <strong>  <u>AS004850 (Private)</u></strong>
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
                                Odometer:<strong> 140 000 km</strong>
                              </div>
                              <div>
                               Fuel level: <strong>{record.fuel}%</strong> 
                              </div>
                            </div>

                            <div className="d-flex justify-content-between">
                              <div>
                                <strong>Engine:</strong> Not running
                              </div>
                              <div>
                                <strong>Central lock:</strong>{" "}
                                <span className="text-danger">Open</span>
                              </div>
                            </div>

                            <div className="d-flex justify-content-between">
                              <div>
                                <strong>Doors:</strong>{" "}
                                {record.doors ? "Open" : "Closed"}
                              </div>
                              <div>
                                <strong>Trunk:</strong>{" "}
                                {record.trunk ? "Open" : "Closed"}
                              </div>
                            </div>
                            <div className="d-flex justify-content-between">
                              <div>
                                <strong>Year:</strong> {record.year}
                              </div>
                              <div>
                                <strong>Car Make:</strong>{" "}
                                {record.vehicle_company_name}
                              </div>
                            </div>
                          </li>
                          <li className="list-group-item">
                            <div className="d-flex justify-content-between">
                              <div>
                                <strong>HW</strong> 1.0
                              </div>
                              <div>
                                <strong>FW: </strong>
                                {record.fw_version}
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
                                  disabled
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
                          <li className="list-group-item">
                            <div className="d-flex justify-content-between">
                              <div>
                                <strong>Location:</strong>
                                <span className="font-weight-bold">
                                  <u>Tuukri 50, Tallinn, Estonia</u>
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
                                <strong>Latitude: </strong>
                                <span className="font-weight-bold">
                                  <u>{record.detail.latitude}</u>
                                </span>
                              </div>
                              <div>
                                <strong>Longitude: </strong>
                                <span className="font-weight-bold">
                                  <u>{record.detail.longitude}</u>
                                </span>
                              </div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div>
                                  Hprice: <br />
                                  <span className="font-weight-bold">
                                    <strong>
                                      {" "}
                                      {record.label_share &&
                                        record.label_share.hprice}
                                    </strong>
                                  </span>
                                </div>
                                <div>
                                  D Price: <br />
                                  <span className="font-weight-bold">
                                    <strong>
                                      <u>
                                        {" "}
                                        {record.label_share &&
                                          record.label_share.dprice}
                                      </u>
                                    </strong>
                                  </span>
                                </div>
                              </div>

                              <div className="d-flex justify-content-between">
                                <div>
                                  Label ID: <br />
                                  <span className="font-weight-bold">
                                    <strong>
                                      {" "}
                                      {record.label && record.label.id}
                                    </strong>
                                  </span>
                                </div>
                                <div>
                                  Label Name: <br />
                                  <span className="font-weight-bold">
                                    <strong>
                                      <u>
                                        {" "}
                                        {record.label && record.label.name}
                                      </u>
                                    </strong>
                                  </span>
                                </div>
                              </div>
                            <div>
                              <strong>Last usage:</strong> 14.12.2020 14:00, 6km
                            </div>
                            <div className="d-flex justify-content-between">
                              <div>
                                <strong>Pevious usage:</strong>
                                <span className="font-weight-bold">
                                  <u>{record.previos_usage}</u>
                                </span>
                              </div>
                              <div>
                                <strong>Current usage:</strong>
                                <span className="font-weight-bold">
                                  <u>{record.current_usage}</u>
                                </span>
                              </div>
                            </div>
                            <div>
                              <strong> Current user:</strong>
                              <span className="font-weight-bold">
                                <u>{record.current_user}</u>
                              </span>
                            </div>
                          </li>
                        </ul>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <button
                                id={`door${record.id}`}
                                disabled={
                                  record.id === doorLoader ? true : false
                                }
                                className={`btn  btnn-user btn-block ${
                                  record.door_button
                                    ? "btn-danger "
                                    : "btn-success "
                                } text-uppercase ft-14`}
                                data-id={record.id}
                                onClick={(e) =>
                                  doorStatus(e, record.id, record.door_button)
                                }
                              >
                                {`${
                                  record.door_button
                                    ? "Lock a Car"
                                    : "Unlock a Car"
                                }`}
                                {record.id === doorLoader ? (
                                  <span
                                    className="ml-2 spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                ) : (
                                  ""
                                )}
                              </button>{" "}
                            </div>
                            <div className="col-md-6">
                              <button
                                id={`trunk${record.id}`}
                                disabled={
                                  record.id === trunkLoader ? true : false
                                }
                                className={`btn btn-success text-uppercase btnn-user btn-block ft-14`}
                                data-id={record.id}
                                onClick={(e) =>
                                  trunkStatus(e, record.id, record.trunk_button)
                                }
                              >
                                {`Open Trunk`}
                                {record.id === trunkLoader ? (
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
                          </div>

                          <br />

                          <br />
                          <div className="row">
                          <div className="col-md-6">
                          {(Helper.getPermissions(
                            "vehicle-delete",
                            permissions && permissions,
                            "admin"
                          ) ||
                            Helper.getPermissions("", [], user.type)) && (
                            <button
                              className="btn btn-danger btnn-user btn-block"
                              data-id={record.id}
                              onClick={Modalopen}
                            >
                              Delete
                            </button>
                          )}
                          </div>
                          <br />
                          <div className="col-md-6">
                          {(Helper.getPermissions(
                            "vehicle-update",
                            permissions && permissions,
                            "admin"
                          ) ||
                            Helper.getPermissions("", [], user.type)) && (
                            <NavLink
                              className=""
                              exact
                              to={`/admin/edit-vehicle-details/${record.id}`}
                            >
                              <button className="btn btnn-user btn-info btn-block">
                                Edit
                              </button>
                            </NavLink>
                          )}
                          </div>
                          </div>
                          <div className="row mt-3">
                              <div className="col-md-6">
                                {Helper.getPermissions(
                                  "label-create",
                                  permissions && permissions,
                                  "admin"
                                ) ||
                                  (user.type === "superadmin" && (
                                    <>
                                      {Object.keys(record.label).length !==
                                        0 && (
                                        <div>
                                          <div className="media d-flex align-items-center">
                                            <img src = {record.label.file} class="mr-2 user-image" width="20px" 
                                            data-label={record.label.id}
                                            data-id={record.id}
                                            onClick={whitelabelModalopen}
                                            />
                                            <strong
                                              class="badge label-assg badge-success mt-2"
                                              data-label={record.label.id}
                                              data-id={record.id}
                                              onClick={whitelabelModalopen}
                                            >
                                              Assigned:{record.label.name}
                                            </strong>
                                           
                                          </div>
                                        </div>
                                      )}

                                      {Object.keys(record.label).length ===
                                        0 && (

                                          <div>
                                          <div className="media d-flex align-items-center">
                                            
                                        
                                            <img src ="/assets/images/picicon.png" class="mr-2 user-image" width="20px" 
                                            data-id={record.id}
                                            data-label = {null}
                                            onClick={whitelabelModalopen}
                                            />
                                            <strong
                                              class="badge label-assg badge-danger "
                                              data-id={record.id}
                                              data-label = {null}
                                          onClick={whitelabelModalopen}
                                            >
                                               {" "}
                                          UnAssgin
                                            </strong>
                                           
                                          </div>
                                        </div>


                                        // <i
                                        //   class="fas ml-3 fa-tasks badge label-assg badge-danger "
                                        //   data-id={record.id}
                                        //   onClick={whitelabelModalopen}
                                        // >
                                        //   {" "}
                                        //   UnAssgin
                                        // </i>
                                      )}

                                      {/* {Object.keys(record.label).length !== 0 && 
                            
                              <button
                              className="btn btn-primary btnn-user btn-block"
                              data-id={record.id}
                              onClick={whitelabelModalopen}
                            > 
                            update
                            </button>
                            
                            }   */}
                                    </>
                                  ))}
                              </div>
                              <div className="col-md-6"></div>
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
              </div>
           
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
        ) : (
          <div className="p-4">
            <div className="text-center ft-14 mt-3 font-weight-bold">
              You are not allowed to visit this screen...
            </div>
          </div>
        )}
      </div>
      {/* </div> */}

      <ToastContainer />
    </React.Fragment>
  );
}
export default AllVehicleList;
