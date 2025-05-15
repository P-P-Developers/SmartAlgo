import React, { useEffect, useState, useRef } from "react";
import Notifications, { notify } from "react-notify-toast";
import socketIOClient from "socket.io-client";
import { Dropdown } from "react-bootstrap";
import { SketchPicker } from "react-color";
import * as Config from "../common/Config";
import axios from "axios";
import reactCSS from "reactcss";
import { Modal } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { Form } from "react-bootstrap";
import $ from "jquery";
import { dateFormate } from "../common/CommonDateFormate";
import { NavLink } from "react-router-dom";
import { Button, Collapse, Card, CardBody, NavbarToggler, } from "reactstrap";


function Header() {
  useEffect(() => {
    // add the class to the body element
    document.body.classList.add('my-page-class');
    // remove the class when the component unmounts
    return () => {
      document.body.classList.remove('my-page-class');
    };
  }, []);


  const [socket1, setSocket1] = useState(null);




  // const GetNotification = async () => {

  //   var urls = Config.base_url;
  //   console.log("gggg", urls)

  //   const socket11 = socketIOClient(`${urls}`);
  //   socket11.on("executed_trade_broadcast", (data) => {
  //     setSocket1(socket11)
  //     console.log("data socket", data);
  //     alert(data)
  //     // setShowAlert(true);
  //     // setTextAlert(data.symbol.tradesymbol);
  //     // setAlertColor("success");
  //     // setRefreshscreen(!refreshscreen);
  //   });

  // }


  // useEffect(() => {

  //   GetNotification()

  // }, [ socket1])



  const navigate = useNavigate();


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminId");
    localStorage.removeItem("roleId");
    localStorage.removeItem("createdBy");
    navigate("/manualtrade/login");
  };

  return (
    <div className="manual">
      <header className="header">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-6 d-flex"></div>
            {/* <div className="col-md-6 d-flex">
              <button className="toggle-btn" onClick={toggleSidebar}></button>
              <h1>Dashboard</h1>
            </div> */}
            <div className="col-md-6 d-flex justify-content-end">
              <div className="dropdown nav-item">
                <a href="#" className="dropdown-toggle nav-link d-flex align-items-center" data-toggle="dropdown">
                  <div className="photo">
                    <img src="https://demos.creative-tim.com/black-dashboard/assets/img/anime3.png" alt="Profile Photo" />
                  </div>

                  <p className="d-lg-none">
                    Log out
                  </p>
                </a>
                <ul className="dropdown-menu dropdown-navbar">
                  <li className="nav-link"><a className="nav-item dropdown-item" style={{ cursor: 'pointer' }}>Profile</a></li>
                  <li className="nav-link"><a className="nav-item dropdown-item" style={{ cursor: 'pointer' }}>Settings</a></li>
                  <li className="dropdown-divider" />
                  <li className="nav-link"><a onClick={logout} className="nav-item dropdown-item" style={{ cursor: 'pointer' }}>Log out</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>


      </header>
    </div>
  );
}

export default Header;
