import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import * as Config from '../common/Config';

function Sidebar() {

  const [clientCompanyDetails, setClientCompanyDetails] = useState("");
  // const [defaultName, setDefaultName] = useState();
  const location = useLocation();
  const fromadmin = localStorage.getItem('from_admin');
  const roleId = localStorage.getItem('roleId');
  // console.log("consoleget", fromadmin);
  const user_id = localStorage.getItem("client_id");
  const { pathname } = location;
  const locationname = window.location.host
  // console.log("pathname", location);
  const splitLocation = pathname.split("/client");


  const [userPermissionType, setUserPermissionType] = useState([]);


if (window.location.hash.includes("/client/services")) {
  console.log("Redirecting from:", window.location.pathname);
  window.location.replace("/"); // `replace` avoids adding to history
}



  useEffect(() => {
    axios({
      method: "get",
      url: `${Config.base_url}admin/system_company`,
      data: {},
    }).then(function (response) {
      setClientCompanyDetails(response.data.data);
      document.getElementById("title").innerText = response.data.data[0].name;
    });

    UserPermissionApi();
  }, []);

  const UserPermissionApi = () => {
    axios({
      url: `${Config.base_url}getUserPermission`,
      method: "POST",
      data: {
        user_id: user_id,
      },
      // headers: {
      //   'x-access-token': client_token
      // }
    })
      .then((res) => {
        //  console.log("res.data sidebaar",res.data);
        if (res.data.status) {
          setUserPermissionType(res.data.data);
        }

      });
  }




  const AddUrl = (name) => {
    return (document.getElementById("title").innerText = name.innerText);
  };


  /// All Permissio set //

  const makeCall_condition = userPermissionType.filter((number) => number.permission_type_id == 1);

  const Segment_condition = userPermissionType.filter((number) => number.permission_type_id == 2);

  const optionChain_condition = userPermissionType.filter((number) => number.permission_type_id == 3);

  const stocks_option_condition = userPermissionType.filter((number) => number.permission_type_id == 4);

  const stock_index = userPermissionType.filter((number) => number.permission_type_id == 5);



  //////////////


  return (
    <>
      <div className="sidebar" data-color="orange">
        <div className="logo">
          <NavLink to="/">
            <img
              className="simple-text logo-normal"
              src={`/images/${clientCompanyDetails && clientCompanyDetails[0].image
                }`}
            />
          </NavLink>

          {(locationname == 'test.smartalgo.in' || locationname == 'client.quickalgoplus.in' || locationname == 'software.chartology.in' || locationname == 'software.algoitech.com' || locationname == 'software.adonomist.com' || locationname == '180.149.241.128:3000' || locationname == 'software.skyiqinfotech.com' || locationname == 'software.primaxsolution.com' || locationname == 'software.advancetechnos.com' || locationname == 'client.roboticalgo.com' || locationname == 'software.algovertex.com') &&

            <div>
              <span className="ms-5 text-light">{clientCompanyDetails && clientCompanyDetails[0].withbroker}</span><br />
              <span className="ms-5 text-light">{clientCompanyDetails && clientCompanyDetails[0].versions}</span>
            </div>}

        </div>


        <div className="sidebar-wrapper" id="sidebar-wrapper">
          <PerfectScrollbar component="div">
            <ul className="nav">
              <li
                className={splitLocation[0] == "/" ? "active" : ""}
                onClick={(e) => AddUrl(e.target)}
              >
                <NavLink to="/">
                  <i className={splitLocation[0] == "/" ? "fa fa-home sidebarcolor" : "fa fa-home text-white"}></i>
                  <p className={splitLocation[0] == "/" ? "sidebarcolor" : " text-white"}>Dashboard</p>
                </NavLink>
              </li>
              <li
                className={splitLocation[0] == "/signals" ? "active" : ""}
                onClick={(e) => AddUrl(e.target)}
              >
                <NavLink to="/signals">
                  <i className={splitLocation[0] == "/signals" ? "fa fa-signal sidebarcolor" : "fa fa-signal  text-white"}></i>
                  <p className={splitLocation[0] == "/signals" ? "sidebarcolor" : " text-white"}>Signals</p>
                </NavLink>
              </li>
              <li
                className={splitLocation[0] == "/tradehistory" ? "active" : ""}
                onClick={(e) => AddUrl(e.target)}
              >
                <NavLink to="/tradehistory">
                  <i className={splitLocation[0] == "/tradehistory" ? "fa fa-history sidebarcolor" : "fa fa-history  text-white"}></i>
                  <p className={splitLocation[0] == "/tradehistory" ? "sidebarcolor" : " text-white"}>Trade History</p>
                </NavLink>
              </li>
              <li
                className={
                  splitLocation[1] == "/tradingstatus" ? "active" : ""
                }
                onClick={(e) => AddUrl(e.target)}
              >
                <NavLink to="/client/tradingstatus">
                  <i className={splitLocation[1] == "/tradingstatus" ? "fa-solid fa-money-bill-trend-up sidebarcolor" : "fa-solid fa-money-bill-trend-up text-white"}></i>
                  <p className={splitLocation[1] == "/tradingstatus" ? "sidebarcolor " : " text-white"}>Trading Status</p>
                </NavLink>
              </li>
              <li
                className={
                  splitLocation[1] == "/brokerresponse" ? "active" : ""
                }
                onClick={(e) => AddUrl(e.target)}
              >
                <NavLink to="/client/brokerresponse">
                  <i className={splitLocation[1] == "/brokerresponse" ? "fa-solid fa-reply-all" : "fa-solid fa-reply-all  text-white"}></i>
                  <p className={splitLocation[1] == "/brokerresponse" ? "sidebarcolor" : " text-white"}>Broker Response</p>
                </NavLink>
              </li>

              <li
                className={
                  splitLocation[1] == "/apicreateinformation" ? "active" : ""
                }
                onClick={(e) => AddUrl(e.target)}
              >
                <NavLink to="/client/apicreateinformation">
                  <i className={splitLocation[1] == "/apicreateinformation" ? "fa fa-database" : "fa fa-database  text-white"}></i>
                  <p className={splitLocation[1] == "/apicreateinformation" ? "sidebarcolor " : " text-white"}>API Create Information</p>
                </NavLink>
              </li>

              <li
                className={splitLocation[1] == "/help" ? "active" : ""}
                onClick={(e) => AddUrl(e.target)}
              >
                <NavLink to="/client/help">
                  <i className={splitLocation[1] == "/help" ? "fa fa-handshake" : "fa fa-handshake  text-white"}></i>
                  <p className={splitLocation[1] == "/help" ? "sidebarcolor " : " text-white"}>Help Center</p>
                </NavLink>
              </li>

              {/* Manual Trade */}

              <ul >

                {
                  optionChain_condition.length > 0 ?
                    <>
                      <li
                        className={splitLocation[1] == "/optionchain" ? "active" : ""}
                        onClick={(e) => AddUrl(e.target)}
                      >
                        <NavLink to="/client/optionchain">
                          <i className={splitLocation[1] == "/optionchain" ? "fa fa-ship" : "fa fa-ship  text-white"}></i>
                          <p className={splitLocation[1] == "/optionchain" ? "sidebarcolor " : " text-white"}>Option Chain</p>
                        </NavLink>
                      </li>
                    </>
                    : ""
                }


                {
                  makeCall_condition.length > 0 ?
                    <>
                      <li
                        className={splitLocation[1] == "/newmessenger" ? "active" : ""}
                        onClick={(e) => AddUrl(e.target)}
                      >
                        <NavLink to="/client/newmessenger">
                          <i className={splitLocation[1] == "/newmessenger" ? "fa fa-ship" : "fa fa-ship  text-white"}></i>
                          <p className={splitLocation[1] == "/newmessenger" ? "sidebarcolor " : " text-white"}>Make Call</p>
                        </NavLink>
                      </li>
                    </> : ""
                }


                {
                  makeCall_condition.length > 0 || optionChain_condition.length > 0 ?
                    <>

                      <li
                        className={splitLocation[1] == "/manualopenpositions" ? "active" : ""}
                        onClick={(e) => AddUrl(e.target)}
                      >
                        <NavLink to="/client/manualopenpositions">
                          <i className={splitLocation[1] == "/manualopenpositions" ? "fa fa-ship" : "fa fa-ship  text-white"}></i>
                          <p className={splitLocation[1] == "/manualopenpositions" ? "sidebarcolor " : " text-white"}>Open Positions</p>
                        </NavLink>
                      </li>

                      <li
                        className={splitLocation[1] == "/manualclosepositions" ? "active" : ""}
                        onClick={(e) => AddUrl(e.target)}
                      >
                        <NavLink to="/client/manualclosepositions">
                          <i className={splitLocation[1] == "/manualclosepositions" ? "fa fa-ship" : "fa fa-ship  text-white"}></i>
                          <p className={splitLocation[1] == "/manualclosepositions" ? "sidebarcolor " : " text-white"}>Close Positions</p>
                        </NavLink>
                      </li>
                    </>
                    : ""
                }



              </ul>

              
              <li
                className={splitLocation[1] == "/strategydescription" ? "active" : ""}
                onClick={(e) => AddUrl(e.target)}
              >
                <NavLink to="/client/strategydescription">
                  <i className={splitLocation[1] == "/strategydescription" ? "fa fa-file-text-o" : "fa fa-file-text-o  text-white"}></i>
                  <p className={splitLocation[1] == "/strategydescription" ? "sidebarcolor " : " text-white"}>Strategy Description</p>
                </NavLink>
              </li>

              {(fromadmin != null && (user_id == 13 || user_id == 14 || user_id == 92) && locationname == 'client.algomaster.in' || fromadmin != null && user_id == 53 && locationname == 'software.algoking.in' || fromadmin != null && (user_id == 2 || user_id == 125 || user_id == 126) && locationname == 'software.goalgos.com' || fromadmin != null && (user_id == 125 || user_id == 126) && locationname == 'software.beefortune.com' || fromadmin != null && (user_id == 4 || user_id == 5)) &&

                <li
                  className={splitLocation[1] == "/tradehistoryd" ? "active" : ""}
                  onClick={(e) => AddUrl(e.target)}
                >
                  <NavLink to="/client/tradehistoryd">
                    <i className={splitLocation[1] == "/tradehistoryd" ? "fa fa-history" : "fa fa-history  text-white"}></i>
                    <p className={splitLocation[1] == "/tradehistoryd" ? "sidebarcolor " : " text-white"}>Trade History D</p>
                  </NavLink>
                </li>}

            </ul>
          </PerfectScrollbar>
        </div>
      </div>
    </>
  );
}

export default Sidebar;



// (fromadmin != null && user_id == 53 && locationname == 'software.algoking.in') &&
//                 (fromadmin != null && user_id == 2 && locationname == 'software.goalgos.com') &&
