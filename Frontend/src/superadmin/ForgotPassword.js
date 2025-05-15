import React, { useState } from "react";
import { useNavigate, Navigate, NavLink } from "react-router-dom";
import * as Config from "../common/Config";
import axios from "axios";
import * as Constant from '../common/ConstantMessage';
import AlertToast from '../common/AlertToast';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailErrorMsg, setEmailErrMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const navigate = useNavigate();

  const submitform = (e) => {
    if (email === "") {
      setEmailErrMsg(Constant.CLIENT_EMAIL);
      return;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      setEmailErrMsg(Constant.EMAIL_VALIDATION);
      return;
    }
 
    

    axios({
        url:`${Config.base_url}smartalgo/admin/forgotpassword`,
        method:'POST',
        data:{
         "email":email
        }
      }).then(res => {
        if(res.data.status === "success"){
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

  };

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
                    <h4 className="card-title">Admin Forgot Password</h4>
                  </div>
                  <div className="card-body">
                    <form>
                      <div className="row">
                        <div className="col-md-10 pr-1">
                          <div className="form-group">
                            <label>Email</label>
                            <input
                              type="text"
                              name="email"
                              onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailErrMsg("");
                              }}
                              className="form-control"
                              placeholder="Enter email"
                              value={email}
                            />
                            <p>{emailErrorMsg}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <NavLink to="/admin/login">Login</NavLink>
                      </div>
                      <div className="row">
                        <div className="col-md-10 pr-1">
                          <div className="row"></div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-10 pr-1">
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
  );
}
