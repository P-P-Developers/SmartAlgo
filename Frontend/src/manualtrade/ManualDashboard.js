import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Form } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import * as Config from "../common/Config";
import AlertToast from "../common/AlertToast";
import Backdrop from "@mui/material/Backdrop";
import * as Constant from "../common/ConstantMessage";
import CircularProgress from "@mui/material/CircularProgress";
import $ from "jquery";
import CryptoJS from "crypto-js";
// import './manualtrade.css'

function Dashboard() {

  return (
    <div className="manual">
      <main className="content">
        <div className="row">
          <div className="col-md-3">
            <div className="card card-chart">
              <div className="card-header">
              <img src="https://cdn-icons-png.flaticon.com/512/9796/9796683.png" className="img-dashboard"/>
                <h5 className="card-category text-center ">Total Shipments</h5>
                <h3 className="card-title text-center "><i className="fa-light fa-layer-group"></i>763,215</h3>
              </div>

            </div>
          </div>
          <div className="col-md-3">
            <div className="card card-chart">
              <div className="card-header">
              <img src="https://cdn-icons-png.flaticon.com/512/9796/9796683.png" className="img-dashboard"/>
                <h5 className="card-category text-center">Total Shipments</h5>
                <h3 className="card-title text-center"><i className="fa-light fa-layer-group"></i>763,215</h3>
              </div>

            </div>
          </div>
          <div className="col-md-3">
            <div className="card card-chart">
              <div className="card-header">
              <img src="https://cdn-icons-png.flaticon.com/512/9796/9796683.png" className="img-dashboard"/>
                <h5 className="card-category text-center">Total Shipments</h5>
                <h3 className="card-title text-center"><i className="fa-light fa-layer-group"></i>763,215</h3>
              </div>

            </div>
          </div>
          <div className="col-md-3">
            <div className="card card-chart">
              <div className="card-header">
              <img src="https://cdn-icons-png.flaticon.com/512/9796/9796683.png" className="img-dashboard"/>
                <h5 className="card-category text-center">Total Shipments</h5>
                <h3 className="card-title text-center"><i className="fa-light fa-layer-group"></i>763,215</h3>
              </div>

            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-3">
            <div className="card card-chart">
              <div className="card-header">
              <img src="https://cdn-icons-png.flaticon.com/512/9796/9796683.png" className="img-dashboard"/>
                <h5 className="card-category text-center">Total Shipments</h5>
                <h3 className="card-title text-center"><i className="fa-light fa-layer-group"></i>763,215</h3>
              </div>

            </div>
          </div>
          <div className="col-md-3">
            <div className="card card-chart">
              <div className="card-header">
              <img src="https://cdn-icons-png.flaticon.com/512/9796/9796683.png" className="img-dashboard"/>
                <h5 className="card-category text-center">Total Shipments</h5>
                <h3 className="card-title text-center"><i className="fa-light fa-layer-group"></i>763,215</h3>
              </div>

            </div>
          </div>
          <div className="col-md-3">
            <div className="card card-chart">
              <div className="card-header">
              <img src="https://cdn-icons-png.flaticon.com/512/9796/9796683.png" className="img-dashboard"/>
                <h5 className="card-category text-center">Total Shipments</h5>
                <h3 className="card-title text-center"><i className="fa-light fa-layer-group"></i>763,215</h3>
              </div>

            </div>
          </div>
          <div className="col-md-3">
            <div className="card card-chart">
              <div className="card-header">
              <img src="https://cdn-icons-png.flaticon.com/512/9796/9796683.png" className="img-dashboard"/>
                <h5 className="card-category text-center">Total Shipments</h5>
                <h3 className="card-title text-center"><i className="fa-light fa-layer-group"></i>763,215</h3>
              </div>

            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Dashboard;
