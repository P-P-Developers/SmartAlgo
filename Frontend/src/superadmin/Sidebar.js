import React, { useState, useEffect,useRef  } from "react";
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
  // const [roleId, setRoleId] = useState()
  const [displayhColorPicker, setdisplayhColorPicker] = useState("#000");
  
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  var roleId = localStorage.getItem("roleId");
  const user_id = localStorage.getItem("superadminId")
  // console.log("user_id", user_id);
  // const colorCode = useRef();
  const activeClass = () => {
    setActive(!isActive);
  };

  useEffect(() => {
    // getThemeColors()/

    axios({
      method: "get",
      url: `${Config.base_url}admin/system_company`,
    }).then(function (response) {
      setCompanyDetails(response.data.data);
      document.getElementById("title").innerText = response.data.data[0].name;

    });

    // axios({
    //   method: "post",
    //   data: {'adminId':adminId},
    //   url: "http://180.149.241.17:3001/admin/subAdminRoleId"
    // }).then(function (response1) {
    // //  console.log('eee-',response1.data.data[0].roleId);
    //   setRoleId(response1.data.data[0].roleId);
    // });
  }, [displayhColorPicker]);

  const location = useLocation();

  const { pathname } = location;

  const splitLocation = pathname.split("/superadmin");
  const splitLocation1 = pathname.split("/superadmin");
  // console.log("pathname" ,pathname);
  // console.log("splitLocation1" ,splitLocation);
  // Change Admin Side Title
  // console.log("splitLocation1" , splitLocation1);
  // console.log("splitLocation" , splitLocation);


  
  const AddUrl = (name) => {
    return (document.getElementById("title").innerText = name.innerText);
  };

  function getFaviconEl() {
    return document.getElementById("favicon");
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

      <div className="sidebar" data-color="orange" style={{height:'100vh'}}>
        <div className="logo">
          <NavLink to="/superadmin/dashboard">
            <img
              className="simple-text logo-normal fix-image"
              src={`/images/${companyDetails && companyDetails[0].image}`}
            />
          </NavLink>
        </div>
        <div className="sidebar-wrapper" id="sidebar-wrapper" >
          <PerfectScrollbar component="div">
            <ul className="nav">
                <li className={splitLocation1[1] == "/superadmin/dashboard" ? "active" : ""}
                  name="dashboard"
                  onClick={(e) => AddUrl(e.target)}
                >
                  <NavLink to="/superadmin/dashboard">
                    <i className= {splitLocation1[1] == "/superadmin/dashboard" ? "fa fa-home sidebarcolor" : "fa fa-home text-white"}></i>
                    <p className= {splitLocation1[1] == "/superadmin/dashboard" ? "sidebarcolor " : "text-white"}>Dashboard</p>
                  </NavLink>
                </li>

                <li className={splitLocation1[1] == "/superadmin/adminlist" ? "active" : ""}
                  name="dashboard"
                  onClick={(e) => AddUrl(e.target)}
                >
                  <NavLink to="/superadmin/adminlist">
                    <i className= {splitLocation1[1] == "/superadmin/adminlist" ? "fa-solid fa-list sidebarcolor" : "fa-solid fa-list text-white"}></i>
                    <p className= {splitLocation1[1] == "/superadmin/adminlist" ? "sidebarcolor " : "text-white"}>Admin List</p>
                  </NavLink>
                </li>

                <li className={splitLocation1[1] == "/superadmin/superadminhistory" ? "active" : ""}
                  name="dashboard"
                  onClick={(e) => AddUrl(e.target)}
                >
                  <NavLink to="/superadmin/superadminhistory">
                    <i className= {splitLocation1[1] == "/superadmin/superadminhistory" ? "fa fa-history sidebarcolor" : "fa fa-history text-white"}></i>
                    <p className= {splitLocation1[1] == "/superadmin/superadminhistory" ? "sidebarcolor " : "text-white"}>SuperAdmin History</p>
                  </NavLink>
                </li>

                <li className={splitLocation1[1] == "/superadmin/supermessagebroadcast" ? "active" : ""}
                  name="dashboard"
                  onClick={(e) => AddUrl(e.target)}
                >
                  <NavLink to="/superadmin/supermessagebroadcast">
                    <i className= {splitLocation1[1] == "/superadmin/supermessagebroadcast" ? "fa fa-bullhorn sidebarcolor" : "fa fa-bullhorn text-white"}></i>
                    <p className= {splitLocation1[1] == "/superadmin/supermessagebroadcast" ? "sidebarcolor " : "text-white"}>Message Broadcast</p>
                  </NavLink>
                </li>

                {user_id == "5" ?
                  <li className={splitLocation1[1] == "/superadmin/transactionlicencesa" ? "active" : ""}
                  name="dashboard"
                  onClick={(e) => AddUrl(e.target)}
                >
                  <NavLink to="/superadmin/transactionlicencesa">
                    <i className= {splitLocation1[1] == "/superadmin/transactionlicencesa" ? "fa fa-id-card-o sidebarcolor" : "fa fa-id-card-o text-white"}></i>
                    <p className= {splitLocation1[1] == "/superadmin/transactionlicencesa" ? "sidebarcolor " : "text-white"}>Dublicate Licence </p>
                  </NavLink>
                </li>
                : ""}

                {user_id == "5" ?
                  <li className={splitLocation1[1] == "/superadmin/columnaddquery" ? "active" : ""}
                  name="dashboard"
                  onClick={(e) => AddUrl(e.target)}
                >
                  <NavLink to="/superadmin/columnaddquery">
                    <i className= {splitLocation1[1] == "/superadmin/columnaddquery" ? "fa-solid fa-columns-3 sidebarcolor" : "fa-solid fa-columns-3 text-white"}></i>
                    <p className= {splitLocation1[1] == "/superadmin/columnaddquery" ? "sidebarcolor " : "text-white"}>Column Add Query </p>
                  </NavLink>
                </li>
                : ""}
             
            </ul>
            <div style={{height:'100px'}}></div>
       
    
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
