import React, { useState, useEffect } from "react";
import { useNavigate, Navigate, NavLink } from "react-router-dom";
import * as Config from "../common/Config";
import axios from "axios";
import { Icon } from '@iconify/react';
import * as Constant from '../common/ConstantMessage';
import AlertToast from '../common/AlertToast';

export default function ClientSignup() {

  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [getUpdate, setGetUpdate] = useState("");

  // ERROR MESSAGE
  const [userNameErr, setUserNameErr] = useState("");
  const [fullNameErr, setFullNameErr] = useState("");
  const [mobileNumberErr, setMobileNumberErr] = useState("");
  const [emailErr, setEmailErr] = useState("");

  // Email & Phone Number Validation
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const phoneNumberRegex = /^\d{10}$/;

  // const [email, setEmail] = useState("");
  // const [emailErrorMsg, setEmailErrMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const navigate = useNavigate();

  // const clientId = localStorage.getItem("adminId");
  const admin_token = localStorage.getItem("token");


  const submitForm = (e) => {

    if (userName == "") {
      setUserNameErr("Please enter Username")
      return
    }
    if (fullName == "") {
      setFullNameErr("Please enter Full Name")
      return
    }
    if (!phoneNumberRegex.test(mobileNumber)) {
      setMobileNumberErr("Please enter valid Mobile Number")
      return
    }
    if (!emailRegex.test(email)) {
      setEmailErr("Please enter email")
      return
    }


    axios({
      url: `${Config.base_url}admin/verify-client`,
      method: 'POST',
      data: {
        "mobileNumber": mobileNumber,
      }
    }).then(res => {
      if (res) {
        // console.log("res.data.otp", res.data.otp);

        const userOTP = prompt("Please enter the OTP:");
        // console.log("userOTP", userOTP);
        if (res.data.otp == userOTP) {
          // Matched OTP, perform additional API call
          axios({
            url: `${Config.base_url}admin/client/add_signup`,
            method: 'POST',
            data: {
              "userName": userName,
              "fullName": fullName,
              "mobileNumber": mobileNumber,
              "email": email,
            }
          }).then(res => {
            if (res) {
              if (res.data.status == 'username_error') {
                setShowAlert(true)
                setAlertColor('error');
                setTextAlert(res.data.msg);
                return
              } else if (res.data.status == 'email_error') {
                setShowAlert(true)
                setAlertColor('error');
                setTextAlert(res.data.msg);
                return
              } else {
                setShowAlert(true)
                setAlertColor('success');
                setTextAlert(res.data.msg + " Please Check Your Mail");
                setTimeout(() => navigate('/'), 2000);
              }
            }
          }).catch(error => {
            // Handle error if additional API call fails
          });
        } else {
          // Invalid OTP
          alert("Invalid OTP");
        }
      }
    }).catch(error => {
      // Handle error if verify-client API call fails
    });
  }


  const onAlertClose = e => {
    setShowAlert(false);
  }

  return (
    <>
      <div className="wrapper ">
        <div
          className="main-panel"
          id="main-panel"
          style={{ float: "none", width: "100%" }}
        >
          <nav className="navbar navbar-expand-lg navbar-transparent bg-primary navbar-absolute">
            <div className="container-fluid">
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navigation"
                aria-controls="navigation-index"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-bar navbar-kebab"></span>
                <span className="navbar-toggler-bar navbar-kebab"></span>
                <span className="navbar-toggler-bar navbar-kebab"></span>
              </button>
            </div>
          </nav>
          <div className="panel-header">
            <canvas id="bigDashboardChart"></canvas>
          </div>
          <div className="content">
            <div className="row">
              <div className="col-md-4" style={{ margin: "auto" }}>
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title text-center fw-bold">SIGN UP</h4><br />
                  </div>
                  <div className="card-body">
                    <form>
                      <div className="row  px-3">
                        <div className="col-md-12">
                          <div className="form-group">
                            <input
                              type="text"
                              name="username"
                              onChange={(e) => {
                                setUserName(e.target.value);
                                setUserNameErr("");
                              }}
                              className="form-control"
                              placeholder="Username"
                            // value={email}
                            />
                            <span style={{ color: "red" }}> {userNameErr}</span>
                            {/* <p>{emailErrorMsg}</p> */}
                          </div>
                          <div className="form-group">
                            <input
                              type="text"
                              name="full name"
                              onChange={(e) => {
                                setFullName(e.target.value);
                                setFullNameErr("");
                                // setEmailErrMsg("");
                              }}
                              className="form-control"
                              placeholder="Full Name"
                            // value={email}
                            />
                            <span style={{ color: "red" }}> {fullNameErr}</span>
                            {/* <p>{emailErrorMsg}</p> */}
                          </div>
                          <div className="form-group">
                            <input
                              type="number"
                              name="mobile_number"
                              onChange={(e) => {
                                setMobileNumber(e.target.value);
                                setMobileNumberErr("");
                                // setEmailErrMsg("");
                              }}
                              className="form-control"
                              placeholder="Mobile Number"
                            // value={email}
                            />
                            <span style={{ color: "red" }}> {mobileNumberErr}</span>
                            {/* <p>{emailErrorMsg}</p> */}
                          </div>
                          <div className="form-group">
                            <input
                              type="email"
                              name="email"
                              onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailErr("");
                                // setEmailErrMsg("");
                              }}
                              className="form-control"
                              placeholder="Email Address"
                            // value={email}
                            />
                            <span style={{ color: "red" }}> {emailErr}</span>
                            {/* <p>{emailErrorMsg}</p> */}
                          </div>
                        </div>
                      </div>
                      {/* <div>
                        <NavLink to="/login">Log In</NavLink>
                      </div> */}
                      <div className="row">
                        <div className="col-md-12 pr-1">
                          <div className="row"></div>
                        </div>
                      </div> <br />
                      <div className="row px-3">
                        <div className="col-md-6">
                          <NavLink to="/login" className="btn btn-primary btn-color btn-block fw-bold"><Icon icon="ep:back" /> Go Back to Login</NavLink>

                        </div>
                        <div className="col-md-6 d-flex flex-row-reverse">
                          <button
                            type="button"
                            onClick={(e) => {
                              submitForm(e);
                            }}
                            className="btn btn-primary btn-color btn-block fw-bold"
                          >
                            Sign Up
                          </button>
                        </div>
                      </div> <br />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      {showAlert && (
        <AlertToast
          hideAlert={onAlertClose}
          showAlert={showAlert}
          message={textAlert}
          alertColor={alertColor}
        />
      )}
    </>
  );
}
