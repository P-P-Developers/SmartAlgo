import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import * as Config from '../common/Config';

function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (!sidebarOpen) {
      return document.body.classList.add('body-wrapper');
    }
    else {
      document.body.classList.remove('body-wrapper');
    }
  };

  return (

    <div className="manual">
      <div className={`dashboard ${sidebarOpen ? 'open' : ''}`}>
        <div className="main-sidebar">
          <div className="col-md-6 ps-lg-3 d-flex">
            <button className="toggle-btn" onClick={toggleSidebar}></button>
            <h1 className="main-haeding">Manual Trade</h1>
            <hr />
          </div>
          <aside className="sidebar">

            <hr className="border-white" />
            <ul className="list-unstyled sidebar-body">

              {/* <li>
                <NavLink to="/manual/manualdashboard" activeClassName="active">
                  <div className="icon-sidebar">
                    <i className="fa-sharp fa-solid fa-house"></i>
                  </div>
                  <span className="menu-title">Dashboard</span>
                </NavLink>
              </li> */}

              {/* <li>
                <NavLink to="/manual/optionchain" activeClassName="active">
                  <div className="icon-sidebar">
                    <i className="fa-sharp fa-solid fa-house"></i>
                    <i class="fa-thin fa-money-bill-trend-up"></i>
                  </div>
                  <span className="menu-title">OPTION CHAIN</span>
                </NavLink>
              </li> */}


              <li>
                <NavLink to="/manual/optionchain" activeClassName="active">
                  <div className="icon-sidebar">
                    {/* <i className="fa-sharp fa-solid fa-house"></i> */}
                    <i class="fa-thin fa-money-bill-trend-up"></i>
                  </div>
                  <span className="menu-title">STOCK OPTION CHAIN</span>
                </NavLink>
              </li>




              <li>
                <NavLink to="/manual/newmessenger" activeClassName="active">
                  <div className="icon-sidebar">
                    <i class="fa-light fa-ship"></i>
                    {/* <i className="fa-sharp fa-solid fa-house"></i> */}
                  </div>
                  <span className="menu-title">New Messenger</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/manual/manualopenpositions" activeClassName="active">
                  <div className="icon-sidebar">
                    <i class="fa-light fa-ship"></i>
                    {/* <i className="fa-sharp fa-solid fa-house"></i> */}
                  </div>
                  <span className="menu-title">Open Positions</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/manual/manualclosepositions" activeClassName="active">
                  <div className="icon-sidebar">
                    <i class="fa-light fa-ship"></i>
                    {/* <i className="fa-sharp fa-solid fa-house"></i> */}
                  </div>
                  <span className="menu-title">Close Positions</span>
                </NavLink>
              </li>



             
              

              {/* <li>
              <a href="">
                <div className="icon-sidebar">
                  <i className="fa-sharp fa-solid fa-house"></i>
                </div>
                <span class="menu-title">Dashboard</span>
              </a>
            </li>

            <li>
              <a href="">
                <div className="icon-sidebar">
                  <i className="fa-sharp fa-solid fa-house"></i>
                </div>
                <span class="menu-title">Dashboard</span>
              </a>
            </li> */}

            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
