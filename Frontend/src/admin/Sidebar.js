import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import "font-awesome/css/font-awesome.min.css";
import * as Config from "../common/Config";

function Sidebar() {

  const navigate = useNavigate();
  const [isActive, setActive] = useState("false");
  const [companyDetails, setCompanyDetails] = useState("");
  const [defaultName, setDefaultName] = useState();
  const [forPermission, setForPermission] = useState([])
  // const [roleId, setRoleId] = useState()
  const [displayhColorPicker, setdisplayhColorPicker] = useState("#000");

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const adminId = localStorage.getItem("adminId");
  var roleId = localStorage.getItem("roleId");
  // const colorCode = useRef();
  const activeClass = () => {
    setActive(!isActive);
  };

  const getPermissions = () => {
    axios({
      method: "post",
      url: `${Config.base_url}subadmins/get`,
      data: {
        userId: adminId,
      },
    }).then(function (response) {
      setForPermission(response.data.subadmins[0])
    });
  }

  useEffect(() => {
    // getThemeColors()/

    axios({
      method: "get",
      url: `${Config.base_url}admin/system_company`,
    }).then(function (response) {
      setCompanyDetails(response.data.data);
      document.getElementById("title").innerText = response.data.data[0].name;
  
    });


    getPermissions()
  }, [displayhColorPicker]);

  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/admin");
  const splitLocation1 = pathname.split("/admin");
  const locationname = window.location.host


  const AddUrl = (name) => {
    return (document.getElementById("title").innerText = name.innerText);
  };

  function getFaviconEl() {
    return document.getElementById("favicon");
  }


  if (roleId === "4" && pathname === "/admin/dashboard") {
    navigate("/signals");
  }

  const getThemeColors = () => {
    axios({
      method: "get",
      url: `${Config.base_url}admin/themecolors`,
    }).then(function (response) {
      let colorcode = response.data.theme_color_code[0];
    });
  };


  return (
    <>
      <div className="sidebar" data-color="orange" style={{ height: '100vh' }}>
        <div className="logo">

          {roleId == "4" ?
            (<NavLink to="/admin/signals">
              <img
                className="simple-text logo-normal fix-image"
                src={`/images/${companyDetails && companyDetails[0].image}`}
              />
            </NavLink>) :
            (<NavLink to="/admin/dashboard">
              <img
                className="simple-text logo-normal fix-image"
                src={`/images/${companyDetails && companyDetails[0].image}`}
              />
            </NavLink>)
          }

          {/* || locationname == '180.149.241.128:3000' */}

          {(locationname == 'test.smartalgo.in' || locationname == 'client.quickalgoplus.in' || locationname == 'software.chartology.in' || locationname == 'software.algoitech.com' || locationname == 'software.adonomist.com' || locationname == '180.149.241.128:3000' || locationname == 'software.skyiqinfotech.com' || locationname == 'software.primaxsolution.com' || locationname == 'software.advancetechnos.com' || locationname == 'client.roboticalgo.com' || locationname == 'software.algovertex.com') &&

            <div>
              <span className="ms-5 text-light">{companyDetails && companyDetails[0].withbroker}</span><br />
              <span className="ms-5 text-light">{companyDetails && companyDetails[0].versions}</span>
            </div>}

        </div>
        <div className="sidebar-wrapper" id="sidebar-wrapper" >
          <PerfectScrollbar component="div">
            <ul className="nav">
              {roleId == "4" ? (
                ""
              ) : (
                <li className={splitLocation1[1] == "/dashboard" ? "active" : ""}
                  name="dashboard"
                  onClick={(e) => AddUrl(e.target)}
                >
                  <NavLink to="/admin/dashboard">
                    <i className={splitLocation1[1] == "/dashboard" ? "fa fa-home sidebarcolor" : "fa fa-home text-white"}></i>
                    <p className={splitLocation1[1] == "/dashboard" ? "sidebarcolor " : "text-white"}>Dashboard</p>
                  </NavLink>
                </li>
              )}
              {roleId == "4" ? (
                ""
              ) : (
                <li
                  className={splitLocation[1] == "/subadmin" ? "active" : ""}
                  name="subadmin"
                  onClick={(e) => AddUrl(e.target)}
                >
                  <NavLink to="/admin/subadmin">
                    <i className={splitLocation[1] == "/subadmin" ? "fa fa-user sidebarcolor" : "fa fa-user text-white"}></i>
                    <p className={splitLocation[1] == "/subadmin" ? "sidebarcolor " : "text-white"}>Sub-Admin</p>
                  </NavLink>
                </li>
              )}
              {`${Config.panel_name}` == 'adonomist' || `${Config.panel_name}` == 'smartalgo' ?

                roleId == "4" ? (
                  ""
                ) : (
                  <li
                    className={splitLocation[1] == "/subadminclients" ? "active" : ""}
                    name="subadmin"
                    onClick={(e) => AddUrl(e.target)}
                  >
                    <NavLink to="/admin/subadminclients">
                      <i className={splitLocation[1] == "/subadminclients" ? "fa-duotone fa-people-group  sidebarcolor" : "fa-duotone fa-people-group text-white"}></i>
                      <p className={splitLocation[1] == "/subadminclients" ? "sidebarcolor " : "text-white"}>Sub-Admin Client</p>
                    </NavLink>
                  </li>
                ) : ""}
              {/* <i class="fa-duotone fa-people-group"></i> */}
              <li
                className={splitLocation[1] == "/signals" ? "active" : ""}
                onClick={(e) => AddUrl(e.target)}
              >
                <NavLink to="/admin/signals">
                  <i className={splitLocation[1] == "/signals" ? "fa fa-signal  sidebarcolor" : "fa fa-signal text-white"}></i>
                  <p className={splitLocation[1] == "/signals" ? "sidebarcolor " : "text-white"}>Signals</p>
                </NavLink>
              </li>

              {/* {roleId == "4" ? "" :
                <li
                className={splitLocation[1] == "/executivetrade" ? "active" : ""}
                onClick={(e) => AddUrl(e.target)}
              >
                <NavLink to="/admin/executivetrade">
                  <i className={splitLocation[1] == "/executivetrade" ? "fa-sharp fa-solid fa-arrow-trend-up  sidebarcolor" : "fa-sharp fa-solid fa-arrow-trend-up text-white"}></i>
                  <p className={splitLocation[1] == "/executivetrade" ? "sidebarcolor " : "text-white"}>Executive Trade</p>
                </NavLink>
              </li>} */}

              {/*  For Only Sub- ADmin */}

              {roleId == "4" ? (
                <li
                  className={splitLocation1[0] == "/subadmin/clientlist" ? "active" : ""}
                  onClick={(e) => AddUrl(e.target)}
                >
                  <NavLink to="/subadmin/clientlist">
                    <i class={splitLocation1[0] == "/subadmin/clientlist" ? "  fa-solid fa-list-check  sidebarcolor" : "  fa-solid fa-list-check text-white"}></i>
                    <p className={splitLocation1[0] == "/subadmin/clientlist" ? "sidebarcolor " : "text-white"}>Client List</p>
                  </NavLink>
                </li>
              ) :
                (
                  <li
                    className={splitLocation[1] == "/system" ? "active" : "text-"}
                    onClick={(e) => AddUrl(e.target)}
                  >
                    <NavLink to="/admin/system">
                      <i className={splitLocation[1] == "/system" ? "fa fa-asterisk sidebarcolor" : "fa fa-asterisk text-white"} ></i>
                      <p className={splitLocation[1] == "/system" ? "sidebarcolor " : "text-white"}>System</p>
                    </NavLink>
                  </li>
                )}
              {roleId == "4" ? (
                ""
              ) : (
                <li
                  className={splitLocation[1] == "/strategy" ? "active" : ""}
                  onClick={(e) => AddUrl(e.target)}
                >
                  <NavLink to="/admin/strategy">
                    <i className={splitLocation[1] == "/strategy" ? "fas fa-chess-board  sidebarcolor" : "fas fa-chess-board text-white"} ></i>
                    <p className={splitLocation[1] == "/strategy" ? "sidebarcolor " : "text-white"}>Strategy</p>
                  </NavLink>
                </li>
              )}

              {/* {roleId == "4" ? (
                ""
              ) : (
                <li
                  className={splitLocation[1] == "/strategydevelopment" ? "active" : ""}
                  onClick={(e) => AddUrl(e.target)}
                >
                  <NavLink to="/admin/strategydevelopment">
                    <i className={splitLocation[1] == "/strategydevelopment" ? "fa-sharp fa-regular fa-bullseye  sidebarcolor" : "fa-sharp fa-regular fa-bullseye text-white"} ></i>
                    <p className={splitLocation[1] == "/strategydevelopment" ? "sidebarcolor" : "text-white"}>Strategy Development</p>
                  </NavLink>
                </li>
              )} */}

              <li
                className={splitLocation[1] == "/services" ? "active" : ""}
                onClick={(e) => AddUrl(e.target)}
              >
                <NavLink to="/admin/services">
                  <i className={splitLocation[1] == "/services" ? "fa fa-wrench  sidebarcolor" : "fa fa-wrench text-white"} ></i>
                  <p className={splitLocation[1] == "/services" ? "sidebarcolor " : "text-white"}>Services</p>
                </NavLink>
              </li>

              {roleId == "4" && forPermission.groupServicesPermission == 0 ? (
                ""
              ) : (
                <li
                  className={splitLocation[1] == "/group-services" ? "active" : ""}
                  onClick={(e) => AddUrl(e.target)}
                >
                  <NavLink to="/admin/group-services">
                    <i className={splitLocation[1] == "/group-services" ? "fa fa-cogs  sidebarcolor" : "fa fa-cogs text-white"} ></i>
                    <p className={splitLocation[1] == "/group-services" ? "sidebarcolor " : "text-white"}>Group Services</p>
                  </NavLink>
                </li>
              )}

              {/* {roleId == "4" && locationname == 'software.adroitalgorithms.com' ?
                <li
                  className={splitLocation[1] == "/group-services" ? "active" : ""}
                  onClick={(e) => AddUrl(e.target)}
                >
                  <NavLink to="/admin/group-services">
                    <i className={splitLocation[1] == "/group-services" ? "fa fa-cogs  sidebarcolor" : "fa fa-cogs text-white"} ></i>
                    <p className={splitLocation[1] == "/group-services" ? "sidebarcolor " : "text-white"}>Group Services</p>
                  </NavLink>
                </li>
                : ""} */}

              {roleId == "4" ? (
                ""
              ) : (
                <li
                  className={splitLocation[1] == "/reports" ? "active" : ""}
                  onClick={(e) => AddUrl(e.target)}
                >
                  <NavLink to="/admin/reports">
                    <i className={splitLocation[1] == "/reports" ? "fa fa-clipboard  sidebarcolor" : "fa fa-clipboard text-white"} ></i>
                    <p className={splitLocation[1] == "/reports" ? "sidebarcolor " : "text-white"}>Reports</p>
                  </NavLink>
                </li>
              )}

              {roleId == "4" ? (
                ""
              ) : (
                <li
                  className={splitLocation[1] == "/clients" ? "active" : ""}
                  onClick={(e) => AddUrl(e.target)}
                >
                  <NavLink to="/admin/clients">
                    <i className={splitLocation[1] == "/clients" ? "fa fa-user-plus  sidebarcolor" : "fa fa-user-plus text-white"} ></i>
                    <p className={splitLocation[1] == "/clients" ? "sidebarcolor " : "text-white"}>Clients</p>
                  </NavLink>
                </li>
              )}

              {roleId == "4" ? (
                ""
              ) : (
                <li
                  className={splitLocation[1] == "/signupclients" ? "active" : ""}
                  onClick={(e) => AddUrl(e.target)}
                >
                  <NavLink to="/admin/signupclients">
                    <i className={splitLocation[1] == "/signupclients" ? "fa-solid fa-right-to-bracket  sidebarcolor" : "fa-solid fa-right-to-bracket text-white"} ></i>
                    <p className={splitLocation[1] == "/signupclients" ? "sidebarcolor " : "text-white"}>Signup Clients</p>
                  </NavLink>
                </li>
              )}


              <li
                className={splitLocation[1] == "/tradehistory" ? "active" : ""}
                onClick={(e) => AddUrl(e.target)}
              >
                <NavLink to="/admin/tradehistory">
                  <i className={splitLocation[1] == "/tradehistory" ? "fa fa-history  sidebarcolor" : "fa fa-history text-white"} ></i>
                  <p className={splitLocation[1] == "/tradehistory" ? "sidebarcolor " : "text-white"}>Trade History</p>
                </NavLink>
              </li>
              {/* {roleId == "4" ? (
                ""
              ) : (
                <li
                  className={
                    splitLocation[1] == "/tradehistory_entry" ? "active" : ""
                  }
                  onClick={(e) => AddUrl(e.target)}
                >
                  <NavLink to="/admin/tradehistory_entry">
                    <i className={splitLocation[1] == "/tradehistory_entry" ? "fa fa-bullhorn  sidebarcolor" : "fa fa-bullhorn text-white"}></i>
                    <p className={splitLocation[1] == "/tradehistory_entry" ? "sidebarcolor" : "text-white"}>7 Day Only Entry</p>
                  </NavLink>
                </li>
              )} */}


              {roleId == "4" ? (
                <li
                  className={
                    splitLocation1[0] == "/subadmin/subtradingstatus" ? "active" : " "
                  }
                  onClick={(e) => AddUrl(e.target)}
                >
                  <NavLink to="/subadmin/subtradingstatus">
                    <i class={splitLocation1[0] == "/subadmin/subtradingstatus" ? "fa-solid fa-stairs  sidebarcolor" : "fa-solid fa-stairs text-white"} ></i>
                    <p className={splitLocation1[0] == "/subadmin/subtradingstatus" ? "sidebarcolor" : "text-white"}>Sub Trading Status</p>
                  </NavLink>
                </li>
              ) : (
                <li
                  className={
                    splitLocation[1] == "/tradingstatusadmin" ? "active" : ""
                  }
                  onClick={(e) => AddUrl(e.target)}
                >
                  <NavLink to="/admin/tradingstatusadmin">
                    <i class={splitLocation[1] == "/tradingstatusadmin" ? "fa-solid fa-stairs  sidebarcolor" : "fa-solid fa-stairs text-white"} ></i>
                    <p className={splitLocation[1] == "/tradingstatusadmin" ? "sidebarcolor" : "text-white"}>Trading Status</p>
                  </NavLink>
                </li>
              )}

              {roleId == "4" ? "" :
                <li
                  className={splitLocation[1] == "/tradeexecutiondetails" ? "active" : ""}
                  onClick={(e) => AddUrl(e.target)}
                >
                  <NavLink to="/admin/tradeexecutiondetails">
                    <i className={splitLocation[1] == "/tradeexecutiondetails" ? "fa-sharp fa-solid fa-circle-info  sidebarcolor" : "fa-sharp fa-solid fa-circle-info text-white"}></i>
                    <p className={splitLocation[1] == "/tradeexecutiondetails" ? "sidebarcolor " : "text-white"}>Trade Execution Reports</p>
                  </NavLink>
                </li>}

              {roleId == "4" ? (
                ""
              ) : (
                <li
                  className={
                    splitLocation[1] == "/message-broadcast" ? "active" : ""
                  }
                  onClick={(e) => AddUrl(e.target)}
                >
                  <NavLink to="/admin/message-broadcast">
                    <i className={splitLocation[1] == "/message-broadcast" ? "fa fa-bullhorn  sidebarcolor" : "fa fa-bullhorn text-white"}></i>
                    <p className={splitLocation[1] == "/message-broadcast" ? "sidebarcolor" : "text-white"}>Message Broadcast</p>
                  </NavLink>
                </li>
              )}

              {roleId == "4" ? (
                ""
              ) : (
                <li
                  className={
                    splitLocation[1] == "/transactionlicence" ? "active" : ""
                  }
                  onClick={(e) => AddUrl(e.target)}
                >
                  <NavLink to="/admin/transactionlicence">
                    <i className={splitLocation[1] == "/transactionlicence" ? "fa fa-exchange   sidebarcolor" : "fa fa-exchange text-white"} ></i>
                    <p className={splitLocation[1] == "/transactionlicence" ? "sidebarcolor" : " text-white"}>Transaction Licence</p>
                  </NavLink>
                </li>
              )}

              <li
                className={
                  splitLocation[1] == "/ApiClientInformation" ? "active" : ""
                }
                onClick={(e) => AddUrl(e.target)}
              >
                <NavLink to="/admin/ApiClientInformation">
                  <i class={splitLocation[1] == "/ApiClientInformation" ? "fa-solid fa-info sidebarcolor" : "fa-solid fa-info text-white"} ></i>
                  <p className={splitLocation[1] == "/ApiClientInformation" ? "sidebarcolor" : " text-white"}>Api Create Information</p>
                </NavLink>
              </li>
              <li
                className={splitLocation[1] == "/helpadmin" ? "active" : ""}
                onClick={(e) => AddUrl(e.target)}
              >
                <NavLink to="/admin/helpadmin">
                  <i className={splitLocation[1] == "/helpadmin" ? "fa fa-handshake" : "fa fa-handshake text-white"}></i>
                  <p className={splitLocation[1] == "/helpadmin" ? "sidebarcolor " : " text-white"}>Help Center</p>
                </NavLink>
              </li>


              {roleId == "4" ? "" :
                <li
                  className={splitLocation[1] == "/releaseupdates" ? "active" : ""}
                  onClick={(e) => AddUrl(e.target)}
                >
                  <NavLink to="/admin/releaseupdates">
                    <i className={splitLocation[1] == "/releaseupdates" ? "fa-thin fa-calendar-pen" : "fa-thin fa-calendar-pen  text-white"}></i>
                    <p className={splitLocation[1] == "/releaseupdates" ? "sidebarcolor " : " text-white"}>Release Updates</p>
                  </NavLink>
                </li>}

              {roleId == "4" ? "" :
                <li
                  className={splitLocation[1] == "/expiredlicence" ? "active" : ""}
                  onClick={(e) => AddUrl(e.target)}
                >
                  <NavLink to="/admin/expiredlicence">
                    <i className={splitLocation[1] == "/expiredlicence" ? "fa-regular fa-id-card" : "fa-regular fa-id-card text-white"}></i>
                    <p className={splitLocation[1] == "/expiredlicence" ? "sidebarcolor " : " text-white"}>Expired Licence</p>
                  </NavLink>
                </li>
                
              }

              {/* Demo */}

              {/* <li
                className={splitLocation[1] == "/democlients" ? "active" : ""}
                onClick={(e) => AddUrl(e.target)}
              >
                <NavLink to="/admin/democlients">
                  <i className={splitLocation[1] == "/democlients" ? "fa fa-signal  sidebarcolor" : "fa fa-signal text-white"}></i>
                  <p className={splitLocation[1] == "/democlients" ? "sidebarcolor " : "text-white"}>Demo Clients</p>
                </NavLink>
              </li> */}


              {/* <li
                className={splitLocation[1] == "/logs" ? "active" : ""}
              // onClick={(e) => AddUrl(e.target)}
              >
                <NavLink to="/admin/logs">
                  <i className={splitLocation[1] == "/logs" ? "fa fa-handshake" : "fa fa-handshake  text-white"}></i>
                  <p className={splitLocation[1] == "/logs" ? "sidebarcolor " : " text-white"}>Logs</p>
                </NavLink>
              </li> */}
            </ul>
            <div style={{ height: '160px' }}></div>
          </PerfectScrollbar>
        </div>
      </div>
    </>
  );

  // else if(roleId == 4){
  //   return <>
  //   <div className="sidebar" data-color="orange">
  //         <div className="logo">
  //           <NavLink to="/admin/dashboard">
  //             <img
  //               className="simple-text logo-normal"
  //               src={`/images/${companyDetails && companyDetails[0].image}`}
  //             />
  //           </NavLink>
  //         </div>
  //         <div className="sidebar-wrapper" id="sidebar-wrapper">
  //           <PerfectScrollbar component="div">
  //             <ul className="nav">
  //               <li
  //                 className={splitLocation[1] == "/signals" ? "active" : ""}
  //                 onClick={(e) => AddUrl(e.target)}
  //               >
  //                 <NavLink to="/admin/signals">
  //                   <i className="fa fa-signal"></i>
  //                   <p>Signals</p>
  //                 </NavLink>
  //               </li>

  //             </ul>
  //           </PerfectScrollbar>
  //         </div>
  //       </div>
  //    </>
  // }
}

export default Sidebar;
