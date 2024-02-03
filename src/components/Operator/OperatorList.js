import React from "react";
import { NavLink } from "react-router-dom";
import Header from "../Header/Index.js";
import Pagination from "react-js-pagination";

import Helper from '../Helper';
var { OperatorListAPI } = require("../Api/ApiRoutes");
var { apiRequest } = require("../Api/Service");

function OperatorList() {
  const [records, setrecords] = React.useState([]);
  const [activePage, setactivePage] = React.useState(1);
  const [result, setResult] = React.useState({});
  const [loader, setloader] = React.useState(false);
  var user = Helper.getStorageData("SESSION");
  var permissions = user.permissions;

  React.useEffect(() => {
    //if(Helper.getPermissions('operator-read',permissions)){
      Helper.overlay(true);
      setloader(true);
      apiRequest(OperatorListAPI.method, OperatorListAPI.url)
        .then((response) => {
          if (response.data.code == 200) {
            setrecords(response.data.data);
            setResult(response.data.meta);
            Helper.overlay(false);
            setloader(false);
          } else {
            console.log("Failure", response);
          }
        })
        .catch((error) => {
          console.log(error);
          Helper.overlay(false);
          setloader(false);
        });
    //}
  }, []);

  const handlePageChange = (pageNumber) => {
    console.log(`active page is ${pageNumber}`);
    setactivePage(pageNumber);
    apiRequest(
      OperatorListAPI.method,
      OperatorListAPI.url + `?page=${pageNumber}`
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
        alert(error);
      });
  };

  return (
    <React.Fragment>
      {/* <div className="wrapper d-flex align-items-stretch">
        <Sidebar /> */}
        <div id="content">
          <Header />
          {//Helper.getPermissions('operator-read',permissions) ?
          <div className="p-4">
            <div className="row border-bottom">
              <div className="col-md-4">
                <div className="d-flex flex-row mb-3">
                  <div className="p-2">
                    <input type="checkbox" />
                  </div>
                  <div className="p-2">
                  {(Helper.getPermissions(
                        "operator-delete",
                        permissions && permissions,
                        "admin"
                      ) ||
                        Helper.getPermissions("", [], user.type)) && (
                    <button className="btn btn-primary">Bulk Delete</button>
                        )}
                  </div>
                  {//.getPermissions('operator-create',permissions) &&
                  <div className="p-2">
                    
                    <NavLink
                      exact
                      to={`/admin/add-operator-detail`}
                      className="btn white bg-orange"
                    >
                      New Operator
                    </NavLink>
                  </div>
                  }
                </div>
              </div>
              <div className="col-md-4 offset-md-4">
                <div className="d-flex flex-row mb-3">
                  <div className="p-2">Results: 4</div>
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
            {records.length ? (
              records.map((record, index) => (
                <div className="row mt-3 border-bottom pb-3 ft-14" key={index}>
                  <div className="col-md-6">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="exampleCheck1"
                      />
                      <NavLink
                        className="black"
                        exact
                        to={`/admin/add-operator-detail`}
                      >
                        <label
                          className="form-check-label font-weight-bold"
                          htmlFor="exampleCheck1"
                        >
                          <u>{record.usercode}</u>
                        </label>
                      </NavLink>
                    </div>
                    <div>{record.fullname}</div>
                    <div>E-mail: {record.email}</div>
                    <div>Telephone: {record.contact}</div>
                  </div>

                  <div className="col-md-4">
                    <div>Vehicles: 16</div>
                    <div>Last login: 30 seconds ago</div>
                  </div>

                  <div className="col-md-2">
                    <div><img src={record.image} width="50px"/></div>
                  </div>
                  
                </div>
              ))
            ) : (
              <div className="text-center ft-14 mt-3 font-weight-bold">
                No Data Found...
              </div>
            )}
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
          // :
          // <div className="p-4">
          //   <div className="text-center ft-14 mt-3 font-weight-bold">
          //      You are not allowed to visit this screen...
          //     </div>
          // </div>
}
        </div>
      {/* </div> */}
    </React.Fragment>
  );
}
export default OperatorList;
