import React from "react";
import { NavLink } from "react-router-dom";
import Header from "../Header/Index.js";

import Helper from "../Helper";
var { VehicleListAPI } = require("../Api/ApiRoutes");
var { apiRequest } = require("../Api/Service");

function MapVehicles() {

  React.useEffect(() => {
    getVehicleList();
  }, []);

  const getVehicleList = () => {
    apiRequest(VehicleListAPI.method, VehicleListAPI.url)
      .then((response) => {
        if (response.data.code == 200) {
          initMap(response.data.data);
          Helper.overlay(false);
        } else {
          // console.log("Failure", response);
          Helper.overlay(false);
        }
      })
      .catch((error) => {
        //console.log(error);
        Helper.overlay(false);
      });
  };

  const initMap = (filterData) => {
    var map = new window.google.maps.Map(document.getElementById("map"), {
      zoom: 3,
      center: {
        lat: 30.2825098,
        lng: 64.8566929,
      },
    });

    var infowindow = new window.google.maps.InfoWindow();
    // The marker, positioned at Uluru

    var marker = "";
    filterData &&
      filterData.map((car, index) => {
        marker = new window.google.maps.Marker({
          position: new window.google.maps.LatLng(
            car.detail.latitude,
            car.detail.longitude
          ),
          map: map,
          icon: `/assets/images/car.png`,
        });
        window.google.maps.event.addListener(
          marker,
          "click",
          (function (marker) {
            return function () {
              infowindow.setContent(`
                        <div className="media" style="height:90px">
                          <img className="mr-3 rounded" src=${car.thumbnail} style="width:70px;height:70px;object-fit: cover;" alt="car image">
                          <div className="media-body">
                            <h6 className="font-weight-bold">${car.name}</h6>
                            <p className="mb-3"> ${car.detail.device_code}</p>
                            <a href=/admin/edit-vehicle-details/${car.id} className="sale text-capitalize p-2" target="_blank">View Details</a>
                          </div>
                        </div>
                      `);
              infowindow.open(map, marker);
            };
          })(marker, index)
        );
      });
  };

  return (
    <React.Fragment>
      {/* <div className="wrapper d-flex align-items-stretch">
        <Sidebar /> */}
        <div id="content">
          <Header />
          <div className="p-4">
            <div className="row">
              <div className="col-md-12">
                <div id="map" style={{ width: "100%", height: "100vh" }}></div>
              </div>
            </div>
          </div>
        </div>
      {/* </div> */}
    </React.Fragment>
  );
}

export default MapVehicles;
