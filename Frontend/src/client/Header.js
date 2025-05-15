import React, { useEffect, useState, useRef } from "react";
import Notifications, { notify } from "react-notify-toast";
import socketIOClient from "socket.io-client";
import { Dropdown } from "react-bootstrap";
import { SketchPicker } from "react-color";
import * as Config from "../common/Config";
import axios from "axios";
import reactCSS from "reactcss";
import { Modal } from "react-bootstrap";
import AlertToast from "../common/AlertToast";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import $, { data } from "jquery";
import { dateFormate, isForeignUserAllowedToLogin } from "../common/CommonDateFormate";
import { NavLink } from "react-router-dom";
import { Button, Collapse, Card, CardBody, NavbarToggler } from "reactstrap";
import jwt_decode from "jwt-decode";
import { encode, decode } from 'js-base64';
import Holidays from "date-holidays";


function Header() {
  const [refresh, setrefresh] = useState(true);
  var currentHour = new Date().getHours();
  const location = useLocation();
  const fromadmin = localStorage.getItem("from_admin");
  const fromsubadmin = localStorage.getItem("from_subadmin");
  const sidebarToggle = React.useRef();
  const locationname = window.location.host

  //  for toggee button
  var note = notify.createShowQueue();
  const [isOpen, setIsOpen] = React.useState(false);
  const [show, setShow] = useState(false);
  const [brokertoggle, setBrokertoggle] = useState("");
  const [bcolor, setbcolor] = useState("#fff");
  const [hcolor, sethcolor] = useState("#fff");
  const [tcolor, settcolor] = useState("#fff");
  const [displaybColorPicker, setdisplaybColorPicker] = useState(false);
  const [displayhColorPicker, setdisplayhColorPicker] = useState(false);
  const [displaytColorPicker, setdisplaytColorPicker] = useState(false);
  const [notificationsData, setNotificationsData] = useState("");
  const [usernameOnTop, setUsernameOnTop] = useState("");
  const [fullNameOnTop, setFullNameOnTop] = useState("");

  const [hideOnLoginExpire, setHideOnLoginExpire] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [printName, setPrintName] = useState("");
  const [clientCodeSet, setClientCodeSet] = useState("");
  const [brokerUnique, setBrokerUnique] = useState("");
  const [stateid, setstateId] = useState();
  const [color, setColor] = useState("");
  const navigate = useNavigate();
  var user_id = localStorage.getItem("client_id");
  const client_token = localStorage.getItem("client_token");
  const role_id = localStorage.getItem("roleId");
  const logintime = localStorage.getItem("log_in_time");


  var token = client_token;
  var decoded = jwt_decode(token);

  const onAlertClose = (e) => {
    setShowAlert(false);
  };

  const userNameOnTop = () => {
    axios({
      url: `${Config.base_url}client/profile`,
      method: "POST",
      data: {
        client_id: user_id,
      },
      headers: {
        "x-access-token": client_token,
      },
    }).then((res) => {
      if (res.data) {
        setUsernameOnTop(res.data.msg.username);
        setFullNameOnTop(res.data.msg.full_name);
      }
    });
  };

  const getNotifications = () => {
    axios({
      method: "get",
      url: `${Config.base_url}smartalgo/msg-added`,
      data: {},
      headers: {
        "x-access-token": client_token,
      },
    }).then((res1) => {
      var mm = res1.data.msg;
      setNotificationsData(mm);
    });
  };

  const toggle = () => {
    if (isOpen) {
      setColor("transparent");
    } else {
      setColor("white");
    }
    setIsOpen(!isOpen);
  };



  useEffect(() => {
    getThemeColors();
    axios({
      url: `${Config.base_url}client/profile`,
      method: "post",
      data: {
        client_id: user_id,
      },
      headers: {
        "x-access-token": client_token,
      },
    }).then((res) => {
      // console.log("loginstatus", res);
      console.log(res.data, "line no 169");
      setHideOnLoginExpire(res.data.msg.login_status);
      setBrokertoggle(res.data.msg.trading_type);
      setBrokerUnique(res.data.msg.broker);
    });


    getNotifications();
    // goToDashboardSession()
    userNameOnTop();
  }, [refresh]);

  const logout = () => {
    clientPanelStatus("PanelOFF");
    if (brokertoggle == "on") {
      // brokerTradingOff();
      // clientPanelStatus('TradingOFF')
    }
    localStorage.removeItem("client_token");
    localStorage.removeItem("client_id");
    localStorage.removeItem("client_name");

    if (fromadmin || fromsubadmin) {
      localStorage.removeItem("from_admin");
      localStorage.removeItem("from_subadmin");
    }

    navigate("/login");
  };

  const clientPanelStatus = (trading_type) => {
    axios({
      method: "post",
      url: `${Config.base_url}client/trading-status-update`,
      data: {
        client_id: user_id,
        trading: trading_type,
      },
      headers: {
        "x-access-token": client_token,
      },
    }).then(function (response) {
      if (response) {
      }
    });
  };
  const msgRead = (e, id) => {
    setstateId(id);
    // setfirst('text-secondary bg-dark')
    setColor("text-primary");
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

    $(".sidebar").css("background-color", bcolor);
    $(".btn-primary").css("background-color", bcolor);
    $(".btn-secondary").css("background-color", bcolor);
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

  const thandleClick = () => {
    setdisplaytColorPicker(!displaytColorPicker);
  };

  const thandleClose = () => {
    setdisplaytColorPicker(false);
  };

  const thandleChange = (color) => {
    sethcolor(color);
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


  // ------------------------ Date 31-07-2023 -----------


  function getCurrentDateTime() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = addLeadingZero(currentDate.getMonth() + 1); // Months are 0-indexed, so add 1 to get the actual month number (1-12)
    const day = addLeadingZero(currentDate.getDate());
    const hours = addLeadingZero(currentDate.getHours());
    const minutes = addLeadingZero(currentDate.getMinutes());
    const seconds = addLeadingZero(currentDate.getSeconds());
    return `${year}:${month}:${day}`
  }

  function addLeadingZero(number) {
    return number < 10 ? `0${number}` : number
  }

  // ------------------------ Date 31-07-2023 -----------

  const Brokertoggle = (e) => {


    if (e.target.checked) {
      axios({
        url: `${Config.base_url}client/profile1`,
        method: "post",
        data: {
          client_id: user_id,
        },
        headers: {
          "x-access-token": client_token,
        },
      }).then((res) => {
        console.log(res.data, "line no 983");
        if (res.data.msg != "already trading on") {
          var userEmail = res.data.msg.email;
          var broker = res.data.msg.broker;
          var state_string = '{"user_id":"' + user_id + `","panel":"${Config.panel_name}","url":"${Config.react_domain}"}`;
          state_string = btoa(state_string);


          // return
          if (broker == "1") {

            window.location.href =
              "https://ant.aliceblueonline.com/?appcode=" + res.data.msg.app_id;

          }

          if (broker == "2") {
            window.location.href =
              "https://kite.zerodha.com/connect/login?v=3&api_key=" + res.data.msg.api_key;
          }

          if (broker == "6") {
            window.location.href =
              "https://api-t1.fyers.in/api/v3/generate-authcode?client_id=" +
              res.data.msg.app_id +
              `&redirect_uri=${Config.broker_redirect_url}fyers/access_token&response_type=code&state=` +
              state_string +
              "";
          }

          if (broker == "3") {

            axios({
              url: `${Config.broker_redirect_url}zebu/accesstoken`,
              method: "post",
              data: {
                State: state_string,
              },
            }).then((res) => {
              if (res.data.status == true) {
                setrefresh(!refresh);
              } else {
                alert(res.data.msg);
              }
            });
          }

          if (broker == "4") {
            window.location.href =
              "https://smartapi.angelbroking.com/publisher-login?api_key=" +
              res.data.msg.api_key;
          }

          if (broker == "5") {
            window.location.href =
              `https://dev-openapi.5paisa.com/WebVendorLogin/VLogin/Index?VendorKey=${res.data.msg.api_key}&ResponseURL=${Config.broker_redirect_url}fivepaisa/access_token&State=` +
              state_string +
              "";
          }

          if (broker == "9") {
            axios({
              url: `${Config.broker_redirect_url}markethub/access_token`,
              method: "post",
              data: {
                State: state_string,
              },
            }).then((res) => {
              if (res.data.success) {
                window.location.href = `${Config.react_domain}`;
              }
            });
          }

          if (broker == "10") {
            console.log(
              "URL - ",
              "https://masterswift-beta.mastertrust.co.in/oauth2/auth?scope=orders%20holdings&state=" +
              state_string +
              `&redirect_uri=${Config.broker_redirect_url}mastertrust/access_token&response_type=code&client_id=` +
              res.data.msg.app_id
            );


            window.location.href =
              "https://masterswift-beta.mastertrust.co.in/oauth2/auth?scope=orders%20holdings&state=" +
              state_string +
              `&redirect_uri=${Config.broker_redirect_url}mastertrust/access_token&response_type=code&client_id=` +
              res.data.msg.app_id;
          }

          if (broker == "11") {
            axios({
              url: `${Config.broker_redirect_url}b2c/access_token`,
              method: "post",
              data: {
                State: state_string,
              },
            }).then((res) => {
              if (res.data.success) {
                window.location.href = `${Config.react_domain}`;
              }
            });
          }

          if (broker == "12") {
            window.location.href = `https://invest.motilaloswal.com/OpenAPI/Login.aspx?apikey=${res.data.msg.api_key}`;
          }

          if (broker == "13") {

            axios({
              url: `${Config.broker_redirect_url}anandrathi/access_token`,
              method: "post",
              data: {
                State: state_string,
              },
            }).then((res) => {
              if (res.data.success) {
                window.location.href = `${Config.react_domain}`;
              }
            });
          }

          if (broker == "14") {
            axios({
              url: `${Config.broker_redirect_url}choiceindia/access_token`,
              method: "post",
              data: {
                State: state_string,
              },
            }).then((res) => {
              if (res.data.success) {
                window.location.href = `${Config.react_domain}`;
              }
            });
          }

          if (broker == "15") {
            axios({
              url: `${Config.broker_redirect_url}mandotsecurities/access_token`,
              method: "post",
              data: {
                State: state_string,
              },
            }).then((res) => {
              // console.log("res", res);
              if (res.data.status == true) {
                setrefresh(!refresh);
                setShowAlert(true);
                setAlertColor("success");
                setTextAlert(res.data.msg);
              } else {
                setrefresh(!refresh);
                setShowAlert(true);
                setAlertColor("error");
                setTextAlert(res.data.msg);
              }
              // if (res.data.success) {
              //     window.location.href = `${Config.react_domain}`;
              // }
            });
          }

          if (broker == "16") {
            axios({
              url: `${Config.broker_redirect_url}kotak/get_token`,
              method: "post",
              data: {
                email: userEmail,
              },
            }).then((res) => {
              // console.log("res", res.data.data.error);
              if (res.data.data.error == "invalid_client") {
                alert("invalid_client");
              } else if (
                res.data.data.message ==
                "Request failed with status code 401"
              ) {
                alert("Access Token IS expired");
              } else if (
                res.data.data.message == "Authentication Successful."
              ) {
                let value = prompt("Enter Your Access Code");
                if (value === null) {
                  return; //break out of the function early
                }
                axios({
                  url: `${Config.broker_redirect_url}kotak/get_session`,
                  method: "post",
                  data: {
                    email: userEmail,
                    otp: value,
                  },
                }).then((res) => {
                  // console.log("res", res.data);
                  if (res.data.msg == "Success") {
                    setrefresh(!refresh);
                  } else {
                    alert("Access Token IS expired");
                  }
                });
              } else if (res.data.data.fault) {
                alert(res.data.data.fault.message);
              } else if (res.data.data.error) {
                alert(
                  res.data.data.error +
                  " " +
                  res.data.data.res.data.data.error
                );
              }
            });
          }

          if (broker == "17") {
            window.location.href = `https://api.upstox.com/index/dialog/authorize?apiKey=${res.data.msg.api_key}&redirect_uri=https://api.smartalgo.in:3001/uptox/${res.data.msg.username}&response_type=code`;
          }

          if (broker == "18") {
            axios({
              url: `${Config.broker_redirect_url}iiflsecurities/access_token`,
              method: "post",
              data: {
                State: state_string,
              },
            }).then((res) => {
              // console.log("res", res);
              if (res.data.status == true) {
                setrefresh(!refresh);
                setShowAlert(true);
                setAlertColor("success");
                setTextAlert(res.data.msg);
              } else {
                setrefresh(!refresh);
                setShowAlert(true);
                setAlertColor("error");
                setTextAlert(res.data.msg);
              }
          
            });
          }

          if (broker == "19") {
            axios({
              url: `${Config.broker_redirect_url}arihant/access_token`,
              method: "post",
              data: {
                State: state_string,
              },
            }).then((res) => {
              // console.log("res", res);
              if (res.data.status == true) {
                setrefresh(!refresh);
                setShowAlert(true);
                setAlertColor("success");
                setTextAlert("Trading On Successfully");
              } else if (res.data.status == false) {
                setrefresh(!refresh);
                setShowAlert(true);
                setAlertColor("error");
                setTextAlert(res.data.data.message);
              }
            });
          }

          if (broker == "20") {
            axios({
              url: `${Config.broker_redirect_url}mastertrust_dealer/accesstoken`,
              method: "post",
              data: {
                State: state_string,
              },
            }).then((res) => {
              if (res.data.status == true) {
                setrefresh(!refresh);
              } else {
                alert(res.data.msg);
              }
            });
          }

          if (broker == "21") {
            axios({
              url: `${Config.broker_redirect_url}laxmi/access_token`,
              method: "post",
              data: {
                State: state_string,
              },
            }).then((res) => {
              // console.log("res", res);
              if (res.data.data.type == "success") {
                setrefresh(!refresh);
                setShowAlert(true);
                setAlertColor("success");
                setTextAlert("Trading On Successfully");
              } else if (res.data.status == false) {
                setrefresh(!refresh);
                setShowAlert(true);
                setAlertColor("error");
                setTextAlert(res.data.data);
              }
            });
          }


          if (broker == "22") {
            // console.log("RUN");
            axios({
              url: `${Config.broker_redirect_url}kotak_neo/get_token`,
              method: "post",
              data: {
                email: userEmail,
              },
            }).then((res) => {
              // console.log("res", res);
              // return
              if (res.data.status == true) {
                let value = prompt("Enter Your OTP Here");
                if (value === null) {
                  // console.log("value", value);
                  return;
                }
                axios({
                  url: `${Config.broker_redirect_url}kotak_neo/get_session`,
                  method: "post",
                  data: {
                    email: userEmail,
                    otp: value,
                  },
                }).then((res) => {
                  // console.log("res", res.data);
                  if (res.data.status == true) {
                    setrefresh(!refresh);
                    setShowAlert(true);
                    setAlertColor("success");
                    setTextAlert("Trading On Successfully");
                  }
                  else if (res.data.status == false) {
                    setShowAlert(true);
                    setAlertColor("success");
                    setTextAlert(res.data.msg);
                  }
                });
              } else if (res.data.status == false) {
                setrefresh(!refresh);
                setShowAlert(true);
                setAlertColor("error");
                setTextAlert(res.data.msg);
              }
            })
          }


          if (broker == "23") {
            // alert("okk")
            var totp = prompt("Please Enter TOTP")
            console.log("totp", totp)

            if (totp == "" || totp == null) {
              return
            }
            axios({
              url: `${Config.broker_redirect_url}swastika/access_token`,
              method: "post",
              data: {
                State: state_string,
                totp: totp,
              },
            }).then((res) => {

              console.log(res.data, "Swastika related error")
              if (res.data.status == true) {
                setrefresh(!refresh);
                setShowAlert(true);
                setAlertColor("success");
                setTextAlert("Trading On Successfully");
              }
              if (res.data.status == false) {
                setrefresh(!refresh);
                setShowAlert(true);
                setAlertColor("error");
                setTextAlert(res.data.data);

              }

              // if(res.data)
              // console.log("res", res);
              // if (res.data.data.type == "success") {
              //   setrefresh(!refresh);
              //   setShowAlert(true);
              //   setAlertColor("success");
              //   setTextAlert("Trading On Successfully");
              // } else if (res.data.status == false) {
              //   setrefresh(!refresh);
              //   setShowAlert(true);
              //   setAlertColor("error");
              //   setTextAlert(res.data.data);
              // }
            });


            // axios({
            //   url: `${Config.broker_redirect_url}swastika/access_token`,
            //   method: "post",
            //   data: {
            //     State: state_string,
            //   },
            // }).then((res) => {
            //   // console.log("res", res);
            //   // if (res.data.data.type == "success") {
            //   //   setrefresh(!refresh);
            //   //   setShowAlert(true);
            //   //   setAlertColor("success");
            //   //   setTextAlert("Trading On Successfully");
            //   // } else if (res.data.status == false) {
            //   //   setrefresh(!refresh);
            //   //   setShowAlert(true);
            //   //   setAlertColor("error");
            //   //   setTextAlert(res.data.data);
            //   // }
            // });
          }

          if (broker == "24") {
            axios({
              url: `${Config.broker_redirect_url}indira_xts/access_token`,
              method: "post",
              data: {
                State: state_string,
              },
            }).then((res) => {
              // console.log("res", res);
              if (res.data.data.type == "success") {
                setrefresh(!refresh);
                setShowAlert(true);
                setAlertColor("success");
                setTextAlert("Trading On Successfully");
              } else if (res.data.status == false) {
                setrefresh(!refresh);
                setShowAlert(true);
                setAlertColor("error");
                setTextAlert(res.data.data);
              }
            });
          }

          if (broker === "25") {
            const encodedApiKey = encodeURIComponent(res.data.msg.api_key);
            // console.log("encodedApiKey", encodedApiKey);
            // return
            window.location.href = `https://api.icicidirect.com/apiuser/login?api_key=${encodedApiKey}`;
          }

          if (broker == "27") {
            axios({
              url: `${Config.broker_redirect_url}dhan/access_token`,
              method: "post",
              data: {
                State: state_string,
              },
            }).then((res) => {
              // console.log("res", res);
              // return
              if (res.data.status == true) {
                setrefresh(!refresh);
                setShowAlert(true);
                setAlertColor("success");
                setTextAlert("Trading On Successfully");
              } else if (res.data.status == false) {
                setrefresh(!refresh);
                setShowAlert(true);
                setAlertColor("error");
                setTextAlert("Incorrect Credentials");
              }
            });
          }

          if (broker === "28") {
            window.location.href = `https://api-v2.upstox.com/login/authorization/dialog?response_type=code&client_id=${res.data.msg.api_key}&redirect_uri=${Config.broker_redirect_url + "upstox/access_token"}&state=${userEmail}`;
          }

          if (broker === "29") {
            window.location.href = `https://api.sharekhan.com/skapi/auth/login.html?api_key=${res.data.msg.api_key}&state=${res.data.msg.username}`;
            // window.location.href = `https://api.sharekhan.com/skapi/auth/login.html?api_key=${res.data.msg.api_key}&state=${res.data.msg.username}&version_id=1005`;
          }

          if (broker === "30") {

            axios({
              url: `${Config.broker_redirect_url}smc/access_token`,
              method: "post",
              data: {
                State: state_string,
              },
            }).then((resp) => {
              console.log("response from smc", resp.data)
              if (resp.data.status == true) {
                setrefresh(!refresh);
                setShowAlert(true);
                setAlertColor("success");
                setTextAlert("Trading On Successfully");
              }
              if (resp.data.status == false) {
                setrefresh(!refresh);
                setShowAlert(true);
                setAlertColor("error");
                setTextAlert(resp.data.data);

              }
            }

            ).catch(
              err => console.log("error from smc", err)
            )

          }

          if (broker == "31") {

            axios({
              url: `${Config.broker_redirect_url}adroit/access_token`,
              method: "post",
              data: {
                State: state_string,
              },
            }).then((res) => {

              if (res.data.status == true) {
                setrefresh(!refresh);
                setShowAlert(true);
                setAlertColor("success");
                setTextAlert("Trading On successfully");
              } else {
                setrefresh(!refresh);
                setShowAlert(true);
                setAlertColor("error");
                setTextAlert(res.data.msg);
              }

            });
          }
          if (broker == "32") {


            axios({
              url: `${Config.broker_redirect_url}shoonya/access_token`,
              method: "post",
              data: {
                State: state_string,
                totp: totp,
              },
            }).then((res) => {

              if (res.data.status == true) {
                setrefresh(!refresh);
                setShowAlert(true);
                setAlertColor("success");
                setTextAlert("Trading On Successfully");
              }
              if (res.data.status == false) {
                setrefresh(!refresh);
                setShowAlert(true);
                setAlertColor("error");
                setTextAlert(res.data.data);

              }

            });



          }

          if (broker == "33") {


            axios({
              url: `${Config.broker_redirect_url}samco/access_token`,
              method: "post",
              data: {
                State: state_string,
         
              },
            }).then((res) => {
              console.log("res.data", res.data)
              if (res.data.status == true) {
                setrefresh(!refresh);
                setShowAlert(true);
                setAlertColor("success");
                setTextAlert("Trading On Successfully");
              }
              if (res.data.status == false) {
                setrefresh(!refresh);
                setShowAlert(true);
                setAlertColor("error");
                setTextAlert(res.data.data.statusMessage);

              }

            });



          }

        } else {
          alert("already trading on");
          // window.location.reload()
        }
      });
    } else {
      brokerTradingOff();
      // clientPanelStatus('TradingOFF')
    }
    // } else {
    //   alert(
    //     "You can only log in after 8:00 AM in the morning and before 8:00 PM in the evening."
    //   );
    // }
  }

  const brokerTradingOff = () => {
    axios({
      url: `${Config.base_url}client/tradingoff`,
      method: "post",
      data: {
        client_id: user_id,
      },
      headers: {
        "x-access-token": client_token,
      },
    }).then((res) => {
      console.log("res", res.data.msg);
      if (res.data.msg == "already trading Off") {
        alert("already trading Off");
        window.location.reload();
      } else {
        setBrokertoggle("off");
      }
    });
  };
  // for massage notification

  //  for toggle button
  const openSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    sidebarToggle.current.classList.toggle("toggled");
  };

  React.useEffect(() => {
    if (
      window.innerWidth < 576 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-");
      sidebarToggle.current.classList.toggle("toggled");
    }
  }, [location]);
  //  for toggle button

  // ---------------------------------------------------------

  const getThemeColors = () => {
    axios({
      method: "get",
      url: `${Config.base_url}admin/themecolors`,
    }).then(function (response) {
      var colorcode = response.data.theme_color_code[0];

      document.getElementsByClassName("sidebar")[0].style.background =
        colorcode.background_color;
      // document.getElementsByClassName('sidebar[data-color="orange"]')[0].style.color = colorcode.background_color
      // document.getElementsByClassName('sidebar-color1')[0].style.color = colorcode.background_color
      document.getElementsByClassName("panel-header")[0].style.background =
        colorcode.header_color;
      // document.getElementsByClassName('sidebarcolor')[0].style.color = colorcode.background_color
      // document.getElementsByClassName('btn')[0].style.color = colorcode.background_color

      $(".active,.nav,li>a,i  ,  .sidebarcolor ").css(
        "color",
        colorcode.background_color
      );
      $(
        ".btn , .btn  , .btn-primary,   .navbar .navbar-nav>a.btn , btn-secondary , export-btn,  button"
      ).css("background-color", colorcode.background_color);
    });
  };
  // ---------------------------------------------------------

  const redirectToAdmin = () => {
    localStorage.removeItem("from_admin");
    localStorage.removeItem("client_token");
    localStorage.removeItem("client_name");
    localStorage.removeItem("client_id");
  };

  const redirectToSubAdmin = () => {
    localStorage.removeItem("from_subadmin");
    localStorage.removeItem("client_token");
    localStorage.removeItem("client_name");
    localStorage.removeItem("client_id");
  };

  return (
    <>
      <Notifications options={{ zIndex: 200, top: "60px" }} />

      <nav className=" new-navbar navbar navbar-expand-lg navbar-transparent bg-primary navbar-absolute">
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

            </div>

          </div>


          {fromadmin == null && hideOnLoginExpire == 1 && (
            <div className="navbar-wrapper">
              <a className="navbar-brand">
                <h5>Login with API</h5>
              </a>
              <Form.Check
                className="broker_switch mb-2"
                size="lg"
                type="switch"
                name="trading"
                checked={brokertoggle == "on" ? true : false}
                onClick={(e) => Brokertoggle(e)}
              />
            </div>
          )}



          <div
            className="d-flex navbar-collapse justify-content-end"
            id="navigation"
          >
            {fromadmin != null && role_id == 1 && (
              <NavLink to="/admin/clients">
                {" "}
                <button
                  onClick={redirectToAdmin}
                  type="button"
                  className="btn btn-color btn-dark ms-4"
                >
                  Go to Admin
                </button>
              </NavLink>
            )}

            {fromsubadmin != null && role_id == 4 && (
              <NavLink to="/subadmin/clientlist">
                {" "}
                <button
                  onClick={redirectToSubAdmin}
                  type="button"
                  className="btn btn-color btn-dark ms-4"
                >
                  Go to SubAdmin
                </button>
              </NavLink>
            )}

            <h6>
              <i>{fullNameOnTop}</i>
            </h6>

            {/* <Collapse isOpen={isOpen} navbar className="justify-content-end" > */}
            <Dropdown className="profile client_up">
              <Dropdown.Toggle
                style={{ background: "transparent" }}
              // id="dropdown-autoclose-true"
              >
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
                            style={{ fontSize: "14px" }}
                          >
                            from Admin :-{item.message}
                            <span
                              className="fw-lighter"
                              style={{ color: "cadetblue" }}
                            >
                              {dateFormate(item.created_at)}
                            </span>
                          </li>
                          {/* <i className="fa-solid fa-trash ms-auto text-secondary mx-3 mt-2"  */}
                          {/* //  onClick={()=>deleteNotification(item.id)} */}
                          {/* ></i> */}

                          <hr />
                        </div>
                      </>
                    ))}
                </ul>
              </Dropdown.Menu>
            </Dropdown>

            <ul className="navbar-nav">
              {/* <li className="nav-item">
                <a className="nav-link" href="#" onClick={handleShow}  style={{background:'transparent'}}>
                  <i className="now-ui-icons design_palette mt-1   fs-5" style={{background:'transparent'}} ></i>
                  <p>
                    <span className="d-lg-none d-md-block">Stats</span>
                  </p>
                </a>
              </li> */}

              <li>
                <Dropdown className="profile ht ">
                  <Dropdown.Toggle style={{ background: "transparent" }}>
                    <span>
                      <i className="now-ui-icons users_single-02  mt-1 fs-5"></i>
                    </span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu id="dropdown-autoclose-true">
                    <ul className="dropdown-menu" id="dropdownMenu">
                      <Dropdown.Item href="#" className="p-0">
                        <li className="user-header p-0">
                          {/* <img
                            src="https://vignette3.wikia.nocookie.net/nation/images/6/61/Emblem_person_blue.png/revision/latest?cb=20120218131529"
                            className="img-circle"
                            alt="User Image"
                            style={{ width: "60px" }}
                          /> */}
                          <img
                            className="profile-user-img img-responsive img-circle mx-auto d-flex"
                            src="http://app.smartalgo.in/assets/dist/img/avatar.png"
                            alt="User profile picture"
                            style={{ width: "80px" }}
                          />
                          <p className="text-center">
                            <b>{usernameOnTop}</b>
                          </p>
                        </li>
                      </Dropdown.Item>
                      <Dropdown.Item href="#">
                        <NavLink
                          className="btn btn-color"
                          // to={fromadmin != null ? '#' : '/client-profile'}
                          to="/client-profile"
                          style={{ fontSize: "12px" }}
                        >
                          Profile
                        </NavLink>

                        <a
                          href="#"
                          className="btn btn-color"
                          onClick={logout}
                          style={{ fontSize: "12px" }}
                        >
                          Sign out
                        </a>
                      </Dropdown.Item>
                    </ul>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            </ul>
            {/* </Collapse> */}
          </div>
        </div>
      </nav>

      <div className="panel-header">
        <canvas id="bigDashboardChart"></canvas>
      </div>




      <Modal show={show} onHide={handleClosem}>
        <Modal.Header
        // closeButton
        >
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
                  <SketchPicker color={bcolor} onChange={hhandleChange} />
                </div>
              ) : null}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="btn btn-color" onClick={handleClosem}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

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

export default Header;
