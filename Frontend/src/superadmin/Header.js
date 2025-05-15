import React, { useEffect, useState } from "react";
import axios from "axios";
import * as Config from "../common/Config";
import { Button, Dropdown } from "react-bootstrap";
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";
import ".././App.css";
import { Modal } from "react-bootstrap";
import { GetColorName } from "hex-color-to-color-name";
import { useNavigate, useLocation } from "react-router-dom";
import $ from "jquery";
// import socketIOClient from "socket.io-client";
import Notifications, { notify } from "react-notify-toast";
import { dateFormate } from "../common/CommonDateFormate";
// import Translator from "./Translator";
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";

function Header() {
  var note = notify.createShowQueue();
  const [show, setShow] = useState(false);
  const [bcolor, setbcolor] = useState("#000");
  const [hcolor, sethcolor] = useState("#000");
  const [tcolor, settcolor] = useState("#000");

  const [displaybColorPicker, setdisplaybColorPicker] = useState(false);
  const [displayhColorPicker, setdisplayhColorPicker] = useState(false);
  const [displaytColorPicker, setdisplaytColorPicker] = useState(false);
  const [notificationsData, setNotificationsData] = useState("");
  const [subAdminInactiveClient, setSubAdminInActiveClient] = useState([]);
  const [refreshscreen, setRefreshscreen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [date, setDate] = useState("");
  var roleId = localStorage.getItem("roleId");
  const AdminID = localStorage.getItem("adminId");
  const admin_token = localStorage.getItem("token");
  const adminId = localStorage.getItem("adminId");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("superadmin_token");
    localStorage.removeItem("superadminId");
    localStorage.removeItem("roleId");
    localStorage.removeItem("createdBy");
    navigate("/superadmin/login");
  };

  const Profile = () => {
    navigate("/superadmin/AdminProfile");
  };

  const handleClosem = () => setShow(false);
  const handleShow = () => setShow(true);

  const bhandleClick = () => {
    setdisplaybColorPicker(!displaybColorPicker);
  };

  const bhandleClose = () => {
    setdisplaybColorPicker(false);
  };

  const bhandleChange = (color) => {
    setbcolor(color.hex);
    $(".sidebar").css("background", bcolor);
    $(".sidebar").css("background-color", bcolor);
    $(".btn-primary").css("background-color", bcolor);
  };

  const hhandleClick = () => {
    setdisplayhColorPicker(!displayhColorPicker);
  };

  const hhandleClose = () => {
    setdisplayhColorPicker(false);
  };

  const hhandleChange = (color) => {
    sethcolor(color.hex);
    $(".panel-header").css("background", hcolor);
  };

  // --------------------------

  const thandleClick = () => {
    setdisplaytColorPicker(!displaytColorPicker);
  };

  const thandleClose = () => {
    setdisplaytColorPicker(false);
  };

  const thandleChange = (color) => {
    // $(".sidebar-color").css("color", hcolor);
    // sethcolor(color.hex);
    sethcolor(color);
    $(".sidebar-color").css("color", hcolor);
  };
  const bstyles = reactCSS({
    default: {
      color: {
        width: "36px",
        height: "14px",
        borderRadius: "2px",
        backgroundColor: bcolor,
      },
      swatch: {
        padding: "5px",
        background: "#fff",
        borderRadius: "1px",
        boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
        display: "inline-block",
        cursor: "pointer",
      },
      popover: {
        position: "absolute",
        zIndex: "2",
      },
      cover: {
        position: "fixed",
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
    },
  });
  const hstyles = reactCSS({
    default: {
      color: {
        width: "36px",
        height: "14px",
        borderRadius: "2px",
        backgroundColor: hcolor,
      },
      swatch: {
        padding: "5px",
        background: "#fff",
        borderRadius: "1px",
        boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
        display: "inline-block",
        cursor: "pointer",
      },
      popover: {
        position: "absolute",
        zIndex: "2",
      },
      cover: {
        position: "fixed",
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
    },
  });
  const fontstyles = reactCSS({
    default: {
      color: {
        width: "36px",
        height: "14px",
        borderRadius: "2px",
        color: hcolor,
      },
      swatch: {
        padding: "5px",
        background: "#fff",
        borderRadius: "1px",
        boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
        display: "inline-block",
        cursor: "pointer",
      },
      popover: {
        position: "absolute",
        zIndex: "2",
      },
      cover: {
        position: "fixed",
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
    },
  });

  const showNotification = (msg) => {
    let myColor = { background: "#008000", text: "#FFFFFF" };
    note(
      <div>
        <p>
          <i className="now-ui-icons ui-1_bell-53"></i>

          {`Mail Receveid from ${msg}`}
        </p>
      </div>,
      "custom",
      2000,
      myColor
    );
  };

  const getNotifications = () => {
    axios({
      url: `${Config.base_url}client/notifications`,
      method: "POST",
      data: {
        adminId: adminId,
        admin_id: AdminID,
      },
      headers: {
        "x-access-token": admin_token,
      },
    }).then((res) => {
      if (res) {
        setNotificationsData(res.data.notifications);
      }
    });
  };




  const showSubInActiveClients = () => {
    axios
      .get(`${Config.base_url}admin/client`, {
        headers: {
          "x-access-token": admin_token,
        },
        data: {},
      })
      .then((res) => {
        if (res.data) {
          const InactiveClients = res.data.client.filter((item) => {
            if (
              item.subadmin_client_status.includes("0") &&
              item.licence_type.toString().includes("2")
            ) {
              return item;
            }
          });

          setSubAdminInActiveClient(InactiveClients);
          // if (InactiveClients.length !== 0) {
          //   console.log("InactiveClients", InactiveClients);
          // }
        }
      });
  };

  useEffect(() => {
    getThemeColors();
    getNotifications();
    
    // showSubInActiveClients();

    // const socket = socketIOClient(`${Config.base_url}`);

    // socket.on("notifi_onAdmin", (data) => {
    //   showNotification(data);
    //   getNotifications();
    // });
  }, [refreshscreen, refresh]);

  // massage read
  //  for toggee button

  const location = useLocation();
  const sidebarToggle = React.useRef();

  //  for toggee button

  const [first, setfirst] = useState("");
  const [stateid, setstateId] = useState();
  const [color, setColor] = useState("");
  const [colorr, setColorr] = useState("");
  const msgRead = (e, id) => {
    setstateId(id);
    setColor("text-primary");
    setColorr("blue");
  };

  const deleteNotification = (id) => {
    // console.log("Id", id);
    if (window.confirm("Do you want to delete this notification ?")) {
      axios({
        method: "post",
        url: `${Config.base_url}client/delete-notification`,
        data: { adminId: adminId, id: id },
        headers: {
          "x-access-token": admin_token,
        },
      }).then(function (response) {
        setRefreshscreen(!refreshscreen);
      });
    }
  };

  const urlWithUserName = (id) => {
    return `/admin/clients?client_id=${id}`;
  };

  const openSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    sidebarToggle.current.classList.toggle("toggled");
  };

  React.useEffect(() => {
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      sidebarToggle.current.classList.toggle("toggled");
    }
  }, [location]);

  //  set color

  const updateTheme = () => {
    axios({
      method: "post",
      url: `${Config.base_url}admin/themecolorupdate`,
      data: { headerColor: hcolor, backgroundColor: bcolor, fontColor: hcolor },
      headers: {
        "x-access-token": admin_token,
      },
    }).then(function (response) {
      // console.log("okkkkk");
      handleClosem(false);
    });

    setRefresh(!refresh)
    navigate('/admin/dashboard')
  };

  //  --------------------------------------------------------------------------------------
  const getThemeColors = () => {
    axios({
      method: "get",
      url: `${Config.base_url}admin/themecolors`,
    }).then(function (response) {
      var colorcode = response.data.theme_color_code[0];
      // console.log("aaaa", colorcode);

      sethcolor(colorcode.header_color);
      setbcolor(colorcode.background_color);
      document.getElementsByClassName("sidebar")[0].style.background =
        colorcode.background_color;
      // document.getElementsByClassName('sidebar[data-color="orange"]')[0].style.color = colorcode.background_color
      // document.getElementsByClassName('sidebar-color1')[0].style.color = colorcode.background_color
      document.getElementsByClassName("panel-header")[0].style.background =
        colorcode.header_color;
      // document.getElementsByClassName('panel-header')[0].style.background = colorcode.header_color

      $(".active,.nav,li>a,i, .sidebarcolor ").css(
        "color",
        colorcode.background_color
      );

      // $(".btn,.navbar .navbar-nav>a.btn").css("background-color", colorcode.background_color)

      // console.log("btnClor",$(".btn,.navbar .navbar-nav>a.btn").css("background-color", colorcode.background_color))

      // $(".btn,.btn-color, .navbar .navbar-nav>a.btn").css("background-color", colorcode.background_color);
      // $(".now-ui-icons gestures_tap-01").css("color", colorcode.header_color);
      // $("button ").css("color", colorcode.header_color );
      // document.getElementsByClassName('btn-color')[0].style.backgroundColor = colorcode.background_color
      // document.getElementsByClassName('btn-color')[0].style.background = colorcode.background_color
      // $('btn-color').attr('style', 'width: 100px !important');

      $(document).ready(function () {
        $(".hover-card").hover(
          function () {
            $(this).css("background-color", colorcode.header_color);
            $(this).css("transition", ".3s all linear");
          },
          function () {
            $(this).css("background-color", "");
          }
        );
      });
    });
  };

  //  -------------------------------------------------------------------------------------------




  return (
    <>
      <Notifications options={{ zIndex: 200, top: "60px" }} />
      <nav className="navbar navbar-expand-lg navbar-transparent  bg-primary  navbar-absolute">
        <div className="container-fluid">
          <div className="navbar-wrapper">
            <div className="navbar-wrapper">
              <div className="navbar-toggle">
                <button
                  type="button"
                  ref={sidebarToggle}
                  className="navbar-toggler"
                  onClick={() => openSidebar()}
                >
                  <span className="navbar-toggler-bar bar1" />
                  <span className="navbar-toggler-bar bar2" />
                  <span className="navbar-toggler-bar bar3" />
                </button>
              </div>
              {/* <NavbarBrand href="/">{getBrand()}</NavbarBrand> */}
            </div>
            <a className="navbar-brand" href="#pablo">
              {/* Dashboard */}
            </a>
          </div>
          {/* <button
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
          </button> */}

          {/* <div
            className="collapse navbar-collapse justify-content-end"
            id="navigation"
          > */}
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navigation"
          >
            <ul className="navbar-nav">
              <Dropdown
                className={roleId === "4" ? "profile d-none" : "profile"}
              >
                <Dropdown.Toggle
                  style={{ background: "transparent" }}
                // id="dropdown-autoclose-true"
                >
                  <p>
                    <i className="now-ui-icons ui-2_chat-round   fs-5 mt-1"></i>
                  </p>
                </Dropdown.Toggle>
                <span className="bedge">
                  {subAdminInactiveClient && subAdminInactiveClient.length > 9
                    ? `9+`
                    : subAdminInactiveClient.length}
                </span>
                <Dropdown.Menu style={{ backgroundColor: "none" }}>
                  <ul class="dropdown-menu " id="dropdownMenuu">
                    <p className="fs-5 justify-content-center  d-flex border-bottom">
                      <b> SubAdmin InActive Clients </b>
                    </p>
                    {subAdminInactiveClient &&
                      subAdminInactiveClient.map((item, id) => (
                        <>
                          <div
                            className="d-flex border-bottom align-items-center mx-2 curser-pointer"
                            onClick={(e) => msgRead(e, id)}
                            key={id}
                          >
                            <i
                              className={
                                stateid === id
                                  ? `${color} fa-solid fa-check-double`
                                  : `fa-solid fa-check-double`
                              }
                            ></i>
                            <NavLink
                              to={urlWithUserName(item.id)}
                              className="flex-column d-flex ms-1"
                              style={{ fontSize: "14px" }}
                            >
                              <li href="#">
                                <span
                                  className="flex-column d-flex ms-1 text-dark"
                                  style={{ fontSize: "14px" }}
                                >
                                  {" "}
                                  {item.subadmin_name} added new client{" "}
                                  {item.username}
                                </span>
                                <span
                                  className="fw-lighter"
                                  style={{ color: "cadetblue" }}
                                >
                                  {dateFormate(item.created_at)}
                                </span>
                              </li>
                            </NavLink>
                            {/* <i
                              className="fa-solid fa-trash ms-auto fs-6 mx-3 hover"
                              // onClick={() => deleteNotification(item.id)}
                            ></i> */}

                            <hr />
                          </div>
                        </>
                      ))}
                  </ul>
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown
                className={roleId === "4" ? "profile d-none" : "profile "}
                style={{ background: "none !important" }}
              >
                <Dropdown.Toggle style={{ background: "none !important" }}>
                  <p>
                    <i className="now-ui-icons ui-1_bell-53   fs-5 mt-1"></i>
                  </p>
                </Dropdown.Toggle>
                <span className="bedge">
                  {notificationsData && notificationsData.length > 9
                    ? `9+`
                    : notificationsData.length}
                </span>
                <Dropdown.Menu>
                  <ul class="dropdown-menu " id="dropdownMenuu">
                    <p className="fs-5 justify-content-center  d-flex border-bottom">
                      <b> Notifications </b>
                    </p>
                    {notificationsData &&
                      notificationsData.map((item, id) => (
                        <>
                          <div
                            className="d-flex border-bottom align-items-center mx-2 curser-pointer"
                            onClick={(e) => msgRead(e, id)}
                            key={id}
                          >
                            <i
                              className={
                                stateid === id
                                  ? `${color} fa-solid fa-check-double`
                                  : `fa-solid fa-check-double`
                              }
                            ></i>
                            <li
                              href="#"
                              className="flex-column d-flex ms-1"
                              style={{ fontSize: "12px" }}
                            >
                              Mail Receveid from {item.client_username}
                              <span
                                className="fw-lighter"
                                style={{ color: "cadetblue" }}
                              >
                                {dateFormate(item.created_at)}
                              </span>
                            </li>
                            <i
                              className="fa-solid fa-trash ms-auto fs-6 mx-3 hover"
                              onClick={() => deleteNotification(item.id)}
                            ></i>

                            <hr />
                          </div>
                        </>
                      ))}
                  </ul>
                </Dropdown.Menu>
              </Dropdown>
              {/* ============================================= */}
              {/* {roleId == "4" ? (
                " "
              ) : (
                <>
                  <li className="nav-item mt-1">
                    <a
                      className="nav-link"
                      onClick={handleShow}
                      style={{ background: "transparent", cursor: "pointer" }}
                    >
                      <i className="now-ui-icons design_palette    fs-5"></i>
                      <p>
                        <span className="d-lg-none d-md-block"></span>
                      </p>
                    </a>
                  </li>
                </>
              )} */}

              {/* ---------------------------------------------- */}

              <Dropdown className="profile">
                <Dropdown.Toggle
                  style={{ background: "transparent" }}
                  id="dropdown-autoclose-true"
                >
                  <span>
                    <i className="now-ui-icons users_single-02  mt-1 fs-5"></i>
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <ul className="dropdown-menu " id="dropdownMenu">
                    <Dropdown.Item href="#" className="p-0">
                      {/* <li className="user-header ">
                        <img
                          src="https://vignette3.wikia.nocookie.net/nation/images/6/61/Emblem_person_blue.png/revision/latest?cb=20120218131529"
                          className="img-circle mb-0"
                          alt="User Image"
                          style={{ width: "60px" }}
                        />
                      </li> */}
                      <img
                        className="profile-user-img img-responsive img-circle mx-auto d-flex"
                        src="http://app.smartalgo.in/assets/dist/img/avatar.png"
                        alt="User profile picture"
                        style={{ width: "80px" }}
                      />
                    </Dropdown.Item>
                    <Dropdown.Item href="#" className="d-flex" style={{textAlign: "center" ,justifyContent: "center"}}>
                      {/* <a
                        href="#"
                        className="btn-color btn"
                        style={{ fontSize: "12px" }}
                        onClick={Profile}
                      >
                        Profile
                      </a> */}
                      <a
                        href="#"
                        className="btn-color text-center btn"
                        onClick={logout}
                        style={{ fontSize: "12px" }}
                      >
                        Sign out
                      </a>
                    </Dropdown.Item>
                  </ul>
                </Dropdown.Menu>
              </Dropdown>

              {/* <Translator /> */}
            </ul>
          </div>
        </div>
      </nav>

      <div className="panel-header">
        <canvas id="bigDashboardChart"></canvas>
      </div>

      <Modal show={show} onHide={handleClosem}>
        <Modal.Header closeButton>
          <Modal.Title>Theme Colors</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <label>Background Color </label>
            </div>
            <div className="col-md-4">
              <div style={bstyles.swatch} onClick={bhandleClick}>
                <div style={bstyles.color} />
              </div>
              {displaybColorPicker ? (
                <div style={bstyles.popover}>
                  <div style={bstyles.cover} onClick={bhandleClose} />
                  <SketchPicker color={bcolor} onChange={bhandleChange} />
                </div>
              ) : null}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <label>Header Color </label>
            </div>
            <div className="col-md-4">
              <div style={hstyles.swatch} onClick={hhandleClick}>
                <div style={hstyles.color} />
              </div>
              {displayhColorPicker ? (
                <div style={hstyles.popover}>
                  <div style={hstyles.cover} onClick={hhandleClose} />
                  <SketchPicker color={hcolor} onChange={hhandleChange} />
                </div>
              ) : null}
            </div>
          </div>
          {/* ---------------------------------------------- */}
          {/* <div className="row">
            <div className="col-md-6">
              <label>Font Color </label>
            </div>
            <div className="col-md-4">
              <div style={fontstyles.swatch} onClick={thandleClick}>
                <div style={fontstyles.color} />
              </div>
              {displaytColorPicker ? (
                <div style={fontstyles.popover}>
                  <div style={fontstyles.cover} onClick={thandleClose} />
                  <SketchPicker color={bcolor} onChange={thandleChange} />
                </div>
              ) : null}
            </div>
          </div> */}
          {/* ---------------------------------------------------- */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="btn" className="btn-color" onClick={updateTheme}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Header;
