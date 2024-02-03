import React from "react";
import { NavLink } from "react-router-dom";
import Header from "../Header/Index.js";
import { Modal,Button,Icon,ButtonToolbar} from 'rsuite';
import Pagination from "react-js-pagination";
import Helper from "../Helper";
var { UserListAPI, deleteUser, alldeleteUser } = require("../Api/ApiRoutes");
var { apiRequest } = require("../Api/Service");

function UserList() {
  const [records, setrecords] = React.useState([]);
  const [activePage, setactivePage] = React.useState(1);
  const [result, setResult] = React.useState({});
  const [loader, setloader] = React.useState(false);
  var user = Helper.getStorageData("SESSION");
  var permissions = user.permissions;
  const [rsModal, setRsModal] = React.useState(false);

  const [currentId, setCurrentId] = React.useState(null);

  const Modalclose=()=> {
    setRsModal(false);
  }
  const Modalopen=(e)=> {
    setCurrentId(e.target.dataset.id);
    setRsModal(true);
  }

  React.useEffect(() => {
    if(Helper.getPermissions("user-read",permissions && permissions,"admin") || (user.type === 'superadmin')){
    Helper.overlay(true);
    setloader(true);
    apiRequest(UserListAPI.method, UserListAPI.url)
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
      apiRequest(alldeleteUser.method, alldeleteUser.url, params)
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
      apiRequest(deleteUser.method, deleteUser.url + `${currentId}`)
        .then((response) => {
          let data = response.data;
          if (response.data.code == 200) {
            //setrecords(response.data.data);
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
    apiRequest(UserListAPI.method, UserListAPI.url + `?page=${pageNumber}`)
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
          {((Helper.getPermissions('user-read',permissions && permissions ,'admin')) || (Helper.getPermissions('',[], user.type ))) ?
            <div className="p-4">
              <div className="row border-bottom">
                <div className="col-md-4">
                  <div className="d-flex flex-row mb-3">
                    <div className="p-2">
                    {(Helper.getPermissions(
                        "user-delete",
                        permissions && permissions,
                        "admin"
                      ) ||
                        Helper.getPermissions("", [], user.type)) && (
                      <input type="checkbox" onChange={handleMainCheckBox} />
                        )}
                    </div>
                    <div className="p-2">
                    {(Helper.getPermissions(
                        "user-delete",
                        permissions && permissions,
                        "admin"
                      ) ||
                        Helper.getPermissions("", [], user.type)) && (
                      <button className="btn btnn-user btn-primary" onClick={getcheckbox}>
                        Bulk Delete
                      </button>
                        )}
                    </div>
                    {
                      //Helper.getPermissions('usage-create',permissions) &&
                      <div className="p-2">
                          {(Helper.getPermissions(
                  "user-create",
                  permissions && permissions,
                  "admin"
                ) || Helper.getPermissions("", [], user.type)) && (
                        <NavLink
                          exact
                          to={`/admin/add-users-detail`}
                          className="btn white btnn-user bg-orange"
                        >
                          New User
                        </NavLink>
                  )}
                      </div>
                    }
                  </div>
                </div>
                <div className="col-md-4 p-2 text-center font-weight-bold">
                {/* <NavLink className="black" exact to={`/admin/current-user-list`}>
                  Show My List
                </NavLink> */}
                {/* {(Helper.getPermissions(
                  "user-read",
                  permissions && permissions,
                  "admin"
                ) ||
                  Helper.getPermissions("", [], user.type)) && (
                  <React.Fragment>
               
                    <NavLink
                      className="black"
                      exact
                      to={`/admin/user-list`}
                    >
                      Show All List
                    </NavLink>
                  </React.Fragment>
                )} */}
                {/* {` | `}
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
                          style={{ height: "30px", width: "200px" }}
                          defaultValue={"Alphabetically"}
                        >
                          <option value="Alphabetically">Alphabetically</option>
                          <option value="Last seen on top">
                            Last seen on top
                          </option>
                          <option value="Last usage">Last usage</option>
                          <option value="Most active user on top">
                            Most active user on top
                          </option>
                          <option value="Highest drivers behaviour score on top">
                            Highest drivers behaviour score on top
                          </option>
                          <option value="Lowest dirvers behaviour score on top">
                            Lowest dirvers behaviour score on top
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
                          src={record.thumbnail}
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
                              <NavLink
                                className="black"
                                exact
                                to={`/admin/edit-admin/${record.id}`}
                              >
                                <label
                                  className="form-check-label font-weight-bold"
                                  htmlFor="exampleCheck1"
                                >
                                  <u>{record.id}</u>
                                </label>
                              </NavLink>
                            </div>
                          </h5>
                          <p className="card-text">
                            <div className="d-flex justify-content-between">
                              <div>
                               Name: <br/><strong>{record.name}</strong> 
                              </div>
                              <div>
                                Email: <br/><strong>{record.email}</strong> 
                              </div>
                            </div>

                            <div className="d-flex justify-content-between">
                              <div>
                            TelePhone:  <br/>  <strong>{record.contact}</strong> 
                              </div>
                              <div>
                               Usages: <br/><strong>10</strong> 
                              </div>
                            </div>

                            <div className="d-flex justify-content-between">
                              <div>
                                Type: <br/><strong>{record.type}</strong> 
                              </div>
                              <div>
                               Drivers behaviour score:{" "}: <br/>
                               <strong> <span className="text-success">4.5</span></strong>
                              </div>
                            </div>

                          </p>
                        </div>
              
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                            {(Helper.getPermissions(
                        "user-delete",
                        permissions && permissions,
                        "admin"
                      ) ||
                        Helper.getPermissions("", [], user.type)) && (
               <button
                            className="btn btn-block btnn-user btn-danger"
                            data-id={record.id}
                            onClick={Modalopen}
                          >
                           Delete
                          </button>
                        )}
                            </div>
                            <div className="col-md-6">
                            {(Helper.getPermissions(
                        "user-update",
                        permissions && permissions,
                        "admin"
                      ) ||
                        Helper.getPermissions("", [], user.type)) && (
                          <NavLink
                          className=""
                          exact
                          to={`/admin/edit-user/${record.id}`}
                        >
                          <button className="btn btn-block btnn-user btn-info">Edit</button>
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
                      
                      <Pagination
                        activePage={activePage}
                        itemsCountPerPage={result.to}
                        totalItemsCount={result.total ? result.total : 1}
                        pageRangeDisplayed={result.last_page}
                        itemClass="page-item"
                        linkClass="page-link"
                        onChange={handlePageChange}
                        />
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
export default UserList;
