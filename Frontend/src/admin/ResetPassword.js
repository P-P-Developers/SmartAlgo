import React, { useState } from "react";
import { useNavigate, Navigate, NavLink } from "react-router-dom";
import * as Config from "../common/Config";
import axios from "axios";
import * as Constant from '../common/ConstantMessage';
import AlertToast from '../common/AlertToast';
import { Icon } from '@iconify/react';

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [passwordErrorMsg, setPasswordErrMsg] = useState("");
  const [conformPassword, setConformPassword] = useState("");
  const [conformPasswordErrorMsg, setConformPasswordErrMsg] = useState("");
  const [email,setEmail] = useState("");
  const [emailErrMsg,setEmailErrMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const adminId = localStorage.getItem('adminId');

  const navigate = useNavigate();


const submitform = () =>{
  if(email === ""){
    setEmailErrMsg(Constant.CLIENT_EMAIL);
    return
  }
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
    setEmailErrMsg(Constant.EMAIL_VALIDATION);
    return;
  }
  if(password === ""){
    setPasswordErrMsg(Constant.PASSWORD);
    return
  }
  if(conformPassword === ""){
    setConformPasswordErrMsg(Constant.CONFORM_PASSWORD);
    return
  }
  if(password !== conformPassword){
    setConformPasswordErrMsg(Constant.PASSWORD_NOT_MATCH);
    return
  }


  axios({
    url:`${Config.base_url}smartalgo/admin/resetpassword`,
    method:'POST',
    data:{
      "email":email,
     "password":password
    }
  }).then(res => {
    if(res.data.status == true){
    setShowAlert(true)
    setAlertColor('success');
    setTextAlert(res.data.msg);
    setTimeout(() => navigate('/admin/login'),1000)
    
    }else{
      setShowAlert(true)
      setAlertColor('error');
      setTextAlert(res.data.msg);
    }
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
          <nav className="navbar navbar-expand-lg navbar-transparent  bg-primary  navbar-absolute">
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
                    <h4 className="card-title fw-bold text-dark text-center">Reset Password</h4>
                  </div>
                  <div className="card-body">
                    <form>
                      <div className="row">
                        <div className="col-md-12 pr-1">
                        <div className="form-group">
                            <label>Email</label>
                            <input
                              type="text"
                              name="password"
                              onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailErrMsg("");
                              }}
                              className="form-control"
                              placeholder="Enter your Email address"
                              value={email}
                            />
                            <p style={{color:"red"}}>{emailErrMsg}</p>
                          </div>
                          <div className="form-group">
                            <label>New Password</label>
                            <input
                              type="password"
                              name="password"
                              onChange={(e) => {
                                setPassword(e.target.value);
                                setPasswordErrMsg("");
                              }}
                              className="form-control"
                              placeholder="Enter New Password"
                              value={password}
                            />
                            <p>{passwordErrorMsg}</p>
                          </div>
                          <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                              type="password"
                              name="conformpassword"
                              onChange={(e) => {
                                setConformPassword(e.target.value);
                                setConformPasswordErrMsg("");
                              }}
                              className="form-control"
                              placeholder="Enter Confirm Password"
                              value={conformPassword}
                            />
                            <p>{conformPasswordErrorMsg}</p>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-10 pr-1">
                          <div className="row"></div>
                        </div>
                      </div>
                      <div className="row">
                      <div className="col-md-6 pr-1">
                        <NavLink to="/admin/login" className="btn btn-primary btn-color btn-block"><Icon icon="ep:back" /> Go Back to Login</NavLink>
                      </div>
                        <div className="col-md-6 pr-1 d-flex flex-row-reverse">
                          <button
                            type="button"
                            onClick={(e) => {
                              submitform(e);
                            }}
                            className="btn btn-primary btn-color btn-block"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer className="footer">
            <div className=" container-fluid ">
              <nav>
                <ul>
                  <li>
                    <a href="https://www.creative-tim.com">Creative Tim</a>
                  </li>
                  <li>
                    <a href="http://presentation.creative-tim.com">About Us</a>
                  </li>
                  <li>
                    <a href="http://blog.creative-tim.com">Blog</a>
                  </li>
                </ul>
              </nav>
              <div className="copyright" id="copyright">
                ©{" "}
                <script>
                  document.getElementById('copyright').appendChild(document.createTextNode(new
                  Date().getFullYear()))
                </script>
                , Designed by{" "}
                <a href="#" target="_blank">
                  P & P Infotech
                </a>
                . Coded by{" "}
                <a href="#" target="_blank">
                  Creative Team
                </a>
                .
              </div>
              { showAlert && 
<AlertToast
 hideAlert={onAlertClose}
 showAlert={showAlert}
 message={textAlert}
 alertColor={alertColor}
/>
}
            </div>
          </footer>
        </div>
      </div>{" "}
    </>
  )
}
