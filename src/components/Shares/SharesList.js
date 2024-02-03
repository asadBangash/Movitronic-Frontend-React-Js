import React from "react";
import { NavLink } from "react-router-dom";
import Header from "../Header/Index.js";
import { Context } from "../Store/Store";
import Echo from "laravel-echo";
import Pagination from "react-js-pagination";
import Helper from '../Helper';
import { Modal,Button,Icon,ButtonToolbar} from 'rsuite';
var { ShareListAPI , deleteShare,alldeleteShare} = require("../Api/ApiRoutes");
var { apiRequest } = require("../Api/Service");


function SharesList() {
  const [records, setrecords] = React.useState([]);
  const [activePage, setactivePage] = React.useState(1);
  const [result, setResult] = React.useState({});
  const [loader, setloader] = React.useState(false);
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
  var permissions = user.permissions;

  React.useEffect(() => {
    if(Helper.getPermissions("share-read",permissions && permissions,"admin") || (user.type === 'superadmin') || (user.type === 'operator')){
    Helper.overlay(true);
    setloader(true);
    apiRequest(ShareListAPI.method, ShareListAPI.url)
      .then((response) => {
        if (response.data.code == 200) {
          setrecords(response.data.data);
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
    }
  }, []);

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
      apiRequest(alldeleteShare.method, alldeleteShare.url, params)
        .then((response) => {
          let data = response.data;
          if (response.data.code == 200) {
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
        deleteShare.method,
        deleteShare.url + `${currentId}`
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

  const handlePageChange = (pageNumber) => {
    console.log(`active page is ${pageNumber}`);
    setactivePage(pageNumber);
    apiRequest(ShareListAPI.method, ShareListAPI.url + `?page=${pageNumber}`)
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
      {/* <div className="wrapper d-flex align-items-stretch">
        <Sidebar /> */}
        <div id="content">
          <Header />
          {((Helper.getPermissions('share-read',permissions && permissions ,'admin')) || (Helper.getPermissions('',[], user.type ))) ?
          <div className="p-4">
            <div className="row border-bottom">
              <div className="col-md-4">
                <div className="d-flex flex-row mb-3">
                  <div className="p-2">
                  {(Helper.getPermissions(
                        "share-delete",
                        permissions && permissions,
                        "admin"
                      ) ||
                        Helper.getPermissions("", [], user.type)) && (
                    <input type="checkbox" onChange={handleMainCheckBox}  />
                        )}
                  </div>
                  <div className="p-2">
                  {(Helper.getPermissions(
                        "share-delete",
                        permissions && permissions,
                        "admin"
                      ) ||
                        Helper.getPermissions("", [], user.type)) && (
                    <button className="btn btn-primary btnn-user" onClick={getcheckbox}>Bulk Delete</button>
                        )}
                  </div>
                  <div className="p-2">
                  {(Helper.getPermissions(
                  "share-create",
                  permissions && permissions,
                  "admin"
                ) ||
                  Helper.getPermissions("", [], user.type)) && (
                  <NavLink
                        exact
                        to={`/admin/verify-user`}
                        className="btn btnn-user white bg-orange"
                      >
                        Add Share
                      </NavLink>
                  )}
                  </div>
                </div>
              </div>
              <div className="col-md-4 p-2 text-center font-weight-bold">
                {/* <NavLink className="black" exact to={`/admin/shares-my-list`}>
                  Show My List
                </NavLink> */}
                {/* {(user.type === "superadmin" ||user.type === "operator" || user.type === "admin" && Helper.getPermissions(
                  "share-read",
                  permissions && permissions,
                  "admin"
                )) && (
                  Helper.getPermissions("", [], user.type)) && (
                  <React.Fragment>
                   
                    <NavLink
                      className="black"
                      exact
                      to={`/admin/shares-list`}
                    >
                      Show All List
                    </NavLink>
                  </React.Fragment>
                )}
                {` | `}
                <NavLink className="black" exact to={`/admin/shares-with-me-list`}>
                  Shared With Me
                </NavLink>  */}
              </div>
              <div className="col-md-4">
                <div className="d-flex flex-row mb-3">
                  <div className="p-2">Results: {result.total}</div>
                  <div className="pl-4 pt-1">
                    {/* <form className="form-inline">
                      <label className="my-1 mr-2">Sort:</label>
                      <select
                        className="form-control p-0"
                        style={{ height: "30px", width: "200px" }}
                        defaultValue={"Chronologically"}
                      >
                        <option value="Chronologically">Chronologically</option>
                        <option value="Longest usage on top">
                          Longest usage on top
                        </option>
                        <option value="Error">Error</option>
                        <option value="Lowest drivers behaviour score usages on top">
                          Lowest drivers behaviour score usages on top
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
            records.map((record, index) => (
            <div className="col-md-4 mt-3 border-bottom pb-3 ft-14" key={index}>
            
            <div className="card card-shadow">
                        <img
                          src={record.vehicle.file}
                          className="card-img-top"
                          alt="..."
                          width="100"
                         height="100"
                         style={{borderRadius: '50% !important'}}
                        />
                        <div className="card-body">
                          <h5 className="card-title text-uppercase">
                            <div className="form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                name="subcheckbox"
                                defaultValue={record.id}
                                id="exampleCheck1"
                              />
                              {/* <NavLink
                                className="black"
                                exact
                                to={`/admin/edit-admin/${record.id}`}
                              > */}
                                <label
                                  className="form-check-label font-weight-bold"
                                  htmlFor="exampleCheck1"
                                >
                                  <u>{record.user.id}</u>
                                </label>
                              {/* </NavLink> */}
                            </div>
                          </h5>
                          <p className="card-text">
                            <div className="d-flex justify-content-between">
                              <div>
                               Name: <br/> <strong>{record.user.name}</strong> 
                              </div>
                              <div>
                                Email:  <br/> <strong>{record.user.email}</strong> 
                              </div>
                            </div>

                            <div className="d-flex justify-content-between">
                              <div>
                              TelePhone:<br/> <strong>{record.user.contact}</strong>
                              </div>
                              <div>
                                Shared Vehcile Name:<br/> <strong> {record.vehicle.name}</strong> 
                              </div>
                            </div>

                            <div className="d-flex justify-content-between">
                              <div>
                                ADD_BT Share Key:<br/> <strong>{record.ADD_BT_share_key}</strong>
                              </div>
                              <div>
                                Drivers behaviour score:{" "}: <br/>
                                <strong> <span className="text-success">4.5</span></strong>
                              </div>
                            </div>
                          </p>

                          <p className="list-group-flush">
                          <div className="d-flex justify-content-between">
                              <div>
                                Start: <br/> <strong> {record.start_date}</strong>
                              </div>
                              <div>
                                Pick-up:<br/> <strong>Tuukri 50, Tallinn, Estonia</strong>
                              </div>
                            </div>

                            <div className="d-flex justify-content-between">
                              <div>
                               Stop:<br/> <strong>{record.end_date}</strong> 
                              </div>
                              <div>
                              Drop-off from: <br/><strong> Tuukri 50, Tallinn, Estonia</strong>
                              </div>
                            </div>
                          </p>

                             <p className="list-group-flush">
                          <div className="d-flex justify-content-between">
                              <div>
                                <strong className="btn-success">Start:</strong> {record.start_date}
                              </div>
                              <div>
                               Pick-up: <br/>  <strong>Tuukri 50, Tallinn, Estonia </strong>
                              </div>
                            </div>

                            <div className="d-flex justify-content-between">
                              <div>
                                <strong className="btn-danger">Stop:</strong> {record.end_date}
                              </div>
                              <div>
                                Drop-off from: <br/> <strong>Tuukri 50, Tallinn, Estonia</strong> 
                              </div>
                            </div>
                          </p>
                        </div>
              
                        <div class="card-body">
                          <div className="row">
                            <div className="col-md-6">
                            {(Helper.getPermissions(
                        "share-delete",
                        permissions && permissions,
                        "admin"
                      ) ||
                        Helper.getPermissions("", [], user.type)) && (
               <button
                            className="btn btn-block btn-danger"
                            data-id={record.id}
                            onClick={Modalopen}
                          >
                           Delete
                          </button>
                        )}
                            </div>
                            <div className="col-md-6">
                            {(Helper.getPermissions(
                        "share-update",
                        permissions && permissions,
                        "admin"
                      ) ||
                        Helper.getPermissions("", [], user.type)) && (
                          <NavLink
                          className=""
                          exact
                          to={`/admin/share-edit/${record.id}`}
                        >
                          <button className="btn btn-block btn-info">Edit</button>
                        </NavLink>
                        )}
                            </div>
                          </div>
                        </div>
                      </div>
            </div>
            ))
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
         
         :
         <div className="p-4">
            <div className="text-center ft-14 mt-3 font-weight-bold">
               You are not allowed to visit this screen...
            </div>
         </div>
         }
      </div>
   {/* </div> */}
    </React.Fragment>
 );
}
export default SharesList;
