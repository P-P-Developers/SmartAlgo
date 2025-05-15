import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Form } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import * as Config from "../common/Config";
import AlertToast from "../common/AlertToast";
import Backdrop from '@mui/material/Backdrop';
import * as Constant from "../common/ConstantMessage";
import CircularProgress from '@mui/material/CircularProgress';
import $ from "jquery";
import CryptoJS from "crypto-js";

function Dashboard() {
  let navigate = useNavigate();
  const [services, setServices] = useState([]);
  // console.log("services", services);
  const [strategy, setStrategy] = useState([]);
  const [getBroker, setBroker] = useState("");

  // console.log("strategy", getBroker);
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [refreshscreen, setRefreshscreen] = useState(true);
  const [orderTypeValue, setOrderTypeValue] = useState("");
  const [rerender, setRerender] = useState()
  const [loader, setLoader] = useState(false);
  const [clientCode, setClientCode] = useState("");
  const [tokenPrice, setTokenPrice] = useState("")
  const [price, setPrice] = useState("");
  const [match, setMatch] = useState("");
  const [qty_typeValue, setQty_typeValue] = useState("");
  const [ipAddress, setIpAddress] = useState('');
  console.log("ipAddress", ipAddress);

  // console.log("  qty_typeValue", qty_typeValue);
  const socketRef = useRef(null);
  // console.log("clientCode", clientCode);
  const [aliceuserSession, setAliceuserSession] = useState("");

  const cl = useRef();
  const alices = useRef();
      

  const client_token = localStorage.getItem('client_token');
  const fromadmin = localStorage.getItem('from_admin');
  const fromsubadmin = localStorage.getItem('from_subadmin');
  const location = useLocation();

  const locationname = window.location.host
  // console.log("location", locationname);

  var user_id = localStorage.getItem("client_id");
  var data_array = [];
  var updatedata_array = [];

  // const [data, setData] = useState([])

  // var socket;
  // let type = 'API';
  // var userId = '741220';
  // var userSession = 'PgtyyiNguy4NYlhZHbsNA99nGpaOASLgTgXYSi9pfLRdM630SgxoPcPcNpRcr4ARDxIhkSCE6xE0GRPhR5HlYbBn6WE3LcAr03C4B2bFJ2mN8QKGJEbO8THLzHYTDKczksXFP0aHDu2ajclLxoW9zacuUYyQWEHoiRSyL91AYn3pVo96YCK5gyvQikf0LekKnT4STmtTNTAieJBLpaoFS50RZHgRWrZaqaCf0rRqnuncv7778ymPLA2vtEp3diPl';


  //   function createSession() {

  //     // let jsonObj = {
  //     //     loginType: type
  //     // }
  //     // $.ajax({

  //     //     url: BASEURL + 'api/ws/createSocketSess',
  //     //     headers: {
  //     //         Authorization: AuthorizationToken
  //     //     },
  //     //     type: 'post',
  //     //     data: JSON.stringify(jsonObj),
  //     //     contentType: 'application/json',
  //     //     dataType: 'json',
  //     //     async: false,
  //     //     success: function (msg) {
  //     //         var data = JSON.stringify(msg)
  //     //         console.log('create session socket -',data)
  //     //         if (msg.stat == 'Ok') {
  //     //             connect()
  //     //         } else {
  //     //             alert(msg)
  //     //         }
  //     //     }
  //     // });


  //     var userId = '741220';
  //     var userSession = 'PgtyyiNguy4NYlhZHbsNA99nGpaOASLgTgXYSi9pfLRdM630SgxoPcPcNpRcr4ARDxIhkSCE6xE0GRPhR5HlYbBn6WE3LcAr03C4B2bFJ2mN8QKGJEbO8THLzHYTDKczksXFP0aHDu2ajclLxoW9zacuUYyQWEHoiRSyL91AYn3pVo96YCK5gyvQikf0LekKnT4STmtTNTAieJBLpaoFS50RZHgRWrZaqaCf0rRqnuncv7778ymPLA2vtEp3diPl';

  //     // console.log('userSession', userSession);

  //     var AuthorizationToken = 'Bearer ' + userId + ' ' + userSession;
  //     var BASEURL = 'https://a3.aliceblueonline.com/rest/AliceBlueAPIService/';


  //     var data = JSON.stringify({
  //       "loginType": "API"
  //     });

  //     var config = {
  //       method: 'post',
  //       url: 'https://a3.aliceblueonline.com/rest/AliceBlueAPIService/api/ws/createWsSession',
  //       headers: { 
  //         'Authorization': 'Bearer 741220 PgtyyiNguy4NYlhZHbsNA99nGpaOASLgTgXYSi9pfLRdM630SgxoPcPcNpRcr4ARDxIhkSCE6xE0GRPhR5HlYbBn6WE3LcAr03C4B2bFJ2mN8QKGJEbO8THLzHYTDKczksXFP0aHDu2ajclLxoW9zacuUYyQWEHoiRSyL91AYn3pVo96YCK5gyvQikf0LekKnT4STmtTNTAieJBLpaoFS50RZHgRWrZaqaCf0rRqnuncv7778ymPLA2vtEp3diPl', 
  //         'Content-Type': 'application/json'
  //       },
  //       data : data
  //     };

  //     axios(config)
  //     .then(function (response) {
  //       console.log('ganpat -',JSON.stringify(response.data));
  //       connect()
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });


  // }


  //   function connectionRequest() {
  //     var encrcptToken = CryptoJS.SHA256(CryptoJS.SHA256(userSession).toString()).toString();

  //       console.log('encrcptToken', encrcptToken);
  //     var initCon = {
  //       susertoken: encrcptToken,
  //       t: "c",
  //       actid: userId + "_" + type,
  //       uid: userId + "_" + type,
  //       source: type
  //     }
  //     console.log('initCon',initCon);
  //     socket.send(JSON.stringify(initCon))
  //   }


  //   const connect = () => {
  //     const url = "wss://ws1.aliceblueonline.com/NorenWS/"

  //     alert('okk');
  //     console.log('okkk run function');

  //     socket = new WebSocket(url)

  //     socket.onopen = function () {
  //       alert('socketopen')
  //       connectionRequest()
  //     }
  //     socket.onmessage = function (msg) {
  //       var response = JSON.parse(msg.data);

  //     // setData(response)

  //        console.log('response -', response);
  //       //  document.getElementById('websocket').value = JSON.stringify(response)

  //       if (response.s == 'OK') {
  //         var channel = 'BSE|1#NSE|26017#NSE|26040#NSE|26009#NSE|26000#MCX|232615#MCX|235517#MCX|233042#MCX|234633#MCX|240085#NSE|5435#NSE|20182#NSE|212#NSE|11439#NSE|2328#NSE|772#NSE|14838#NSE|14428#NSE|1327#NSE|7229#NSE|1363#NSE|14366#NSE|1660#NSE|11763#NSE|10576#NSE|14977#NSE|15032#NSE|2885#NSE|3045#NSE|5948#NSE|2107#NSE|3426#NSE|11536#NSE|11915#NSE|5097';
  //         let json = {
  //             k: channel,
  //             t: 't'
  //         };
  //         socket.send(JSON.stringify(json))
  //     }
  //     }


  //   }

  //----------------------------------------------------------------------------------

  //Jquery Socket Code -

  var BASEURL = 'https://a3.aliceblueonline.com/rest/AliceBlueAPIService/'
  let AuthorizationToken;
  let type = 'API';
  // var userId = cl.current;
  // var userSession =alices.current;
  // AuthorizationToken = 'Bearer ' + userId + ' ' + userSession


  function invalidateSession(userId, userSession, services) {

    //alert('0');
    AuthorizationToken = 'Bearer ' + userId + ' ' + userSession

    //console.log('AuthorizationToken',AuthorizationToken);

    let jsonObj = {
      loginType: type
    }
    $.ajax({

      url: BASEURL + 'api/ws/invalidateSocketSess',
      headers: {
        Authorization: AuthorizationToken
      },
      type: 'post',
      data: JSON.stringify(jsonObj),
      contentType: 'application/json',
      dataType: 'json',
      async: false,
      success: function (msg) {
        var data = JSON.stringify(msg)
        if (msg.stat == 'Ok') {
          createSession(userId, userSession, services)
        }
      }
    });
  }


  function createSession(userId, userSession, services) {

    //alert('create session')
    AuthorizationToken = 'Bearer ' + userId + ' ' + userSession
    //console.log('AuthorizationToken cratesession',AuthorizationToken);

    let jsonObj = {
      loginType: type
    }
    $.ajax({

      url: BASEURL + 'api/ws/createSocketSess',
      headers: {
        Authorization: AuthorizationToken
      },
      type: 'post',
      data: JSON.stringify(jsonObj),
      contentType: 'application/json',
      dataType: 'json',
      async: false,
      success: function (msg) {
        var data = JSON.stringify(msg)
        if (msg.stat == 'Ok') {
          connect(userId, userSession, services)
        } else {
          alert(msg)
        }
      }
    });
  }

  const url = "wss://ws1.aliceblueonline.com/NorenWS/"
  let socket;
  function connect(userId, userSession, services) {
    socket = new WebSocket(url)

    socket.onopen = function () {
      connectionRequest(userId, userSession)
      //alert('okk socket open')
    }
    socket.onmessage = function (msg) {
      var response = JSON.parse(msg.data)
      // console.log('response', response)
      setTokenPrice(response.tk)
      setPrice(response.lp)

      socketRef.current = response;

      //  console.log('services',services)
      //  console.log('socketRef.current',socketRef.current)


      if (response.s == 'OK') {

        // services.forEach(token => {
        // if(token.cat_name == "CASH"){
        var channel = 'NSE|14366#NSE|3045#NSE|6705#NSE|11536#NSE|17388';
        // var channel = "NSE|" + token.instrument_token

        let json = {
          k: channel,
          t: 't'
        };
        socket.send(JSON.stringify(json))

        // }

        // });

      }
    }
  }

  function connectionRequest(userId, userSession) {

    var encrcptToken = CryptoJS.SHA256(CryptoJS.SHA256(userSession).toString()).toString();
    // alert(encrcptToken);
    var initCon = {
      susertoken: encrcptToken,
      t: "c",
      actid: userId + "_" + type,
      uid: userId + "_" + type,
      source: type
    }
    // console.log('initCon', initCon);
    socket.send(JSON.stringify(initCon))

  }


  function TokenAndClientCode(services) {
    // alert('okkkkkk');
    var config = {
      method: 'get',
      url: 'https://api.smartalgo.in:3001/dashboard/alicebluetoken',
      headers: {}
    };

    axios(config)
      .then(function (response) {
        console.log('shakir response ', response.data.status);
        if (response.data.status == "true") {
          console.log('Token Available', response.data.data[0].client_code + '  ' + response.data.data[0].access_token);
          // console.log('clientcode',response.data.data[0].client_code);
          // console.log('assecctoken',response.data.data[0].access_token);
          //  setClientCode(response.data.data[0].client_code);
          //  setAliceuserSession(response.data.data[0].access_token);
          //  cl.current = response.data.data[0].client_code;
          //  alices.current = response.data.data[0].access_token;
          invalidateSession(response.data.data[0].client_code, response.data.data[0].access_token, services)

        } else {
          console.log('Token Not Available');
        }
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  //Jquery Socket Code  End-

  //----------------------------------------------------------------------------------

  const getIpAdress = () => {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data =>
        setIpAddress(data.ip)
      )
      .catch(error => console.error(error));
  }


  useEffect(() => {

    setLoader(true)
    axios({
      url: `${Config.base_url}client/services`,
      method: "post",
      data: {
        client_id: user_id,
      },
      headers: {
        'x-access-token': client_token
      }
    }).then((res) => {
      // console.log("symbols", res);

      setStrategy(res.data.strategy);
      setServices(res.data.services);
      setQty_typeValue(res.data.QTY_TYPE[0].qty_type);
      setBroker(res.data.broker[0].broker);

      // res.data.services.forEach(element => {
      //   console.log('ttt',element.id)
      // });
      //  console.log('services clieent services',services)
      //console.log('setStrategy setStrategy',strategy)

      setLoader(false)
      if (services && services) {
        TokenAndClientCode(res.data.services);
      }

    });

    getIpAdress()
  }, [rerender, refreshscreen]);

  const onAlertClose = (e) => {
    setShowAlert(false);
  };

  // const onShowClick = (id) => {
  //   if (window.confirm(Constant.DELETE_GROUP_CONFIRM_MSG)) {
  //     axios({
  //       method: "post",
  //       url: `${Config.base_url}smartalgo/group-services/delete`,
  //       data: { id: id },
  //     }).then(function (response) {
  //       setRefreshscreen(!refreshscreen);
  //     });
  //   }
  // };

  const setAllToSetStrategy = (e) => {
    if (e.target.value === "all") {
      setRerender(!rerender)
    }
    setServices(
      services.map((item, index) => {
        item.strategy = e.target.value
        return item
      }
      )
    )
  }


  const serviceChange = (e, id, sig) => {


    //  if (e.target.value == "") {

    //     setServices(
    //       services.map(
    //         (item, index) => (item.qty = index == id ? "" : item)
    //       )
    //     );
    //     return
    //   } 
    if (e.target.name == "qty") {
      // console.log('qty',typeof e.target.value);
      const re = /^[0-9\b]+$/;

      if (sig.quantity != "0" && e.target.value > sig.quantity) {
        setShowAlert(true);
        setAlertColor("error");
        setTextAlert(`Can't update more than ${sig.quantity} in ${sig.ser_name}`);
        e.target.value = sig.quantity;
        return
      }
      else {
        setServices(
          services.filter(
            (item, index) => {
              if (index == id) {
                item.qty = e.target.value
              } else {
                item.qty = item.qty
              }
              return item
            }
          )
        );
      }
    }

    if (e.target.name == "cstrategy") {
      setServices(
        services.filter(
          (item, index) =>
            (item.strategy = index == id ? e.target.value : item.strategy)
        )
      );
    }

    if (e.target.name == "order_type") {
      setServices(
        services.filter(
          (item, index) =>
            (item.order_type = index == id ? e.target.value : item.order_type)
        )
      );
    }

    if (e.target.name == "product_type") {
      setOrderTypeValue(e.target.value);
      setServices(
        services.filter(
          (item, index) =>
          (item.product_type =
            index == id ? e.target.value : item.product_type)
        )
      );
    }

    if (e.target.name == "trading") {
      setServices(
        services.filter((item, index) => {
          if (index == id) {
            item.trading = item.trading == 0 ? 1 : 0;
          }
          return item;
        })
      );
    }

  };

  const handleSubmit = () => {

    const ServiceArr = services.map((item) => {
      // console.log('item.qty',item.qty);
      // var item_qty= parseInt(item.qty);

      if ((locationname == 'software.goalgos.com' || locationname == 'client.algomaster.in') && item.ser_name == "BANKNIFTY" && item.qty > 100 && item.strategy == "STRAT1") {
        // item.qty = 100;
        setShowAlert(true);
        setAlertColor("error");
        setTextAlert("BANKNIFTY Can't Update More Than 100");
        return
      }

      if ((locationname == 'software.goalgos.com' || locationname == 'client.algomaster.in') && item.ser_name == "NIFTY" && item.qty > 200 && item.strategy == "STRAT1") {
        setShowAlert(true);
        setAlertColor("error");
        setTextAlert("NIFTY Can't Update More Than 200");
        // item.qty = 200;
        return
      }

      if (item.qty < -1) {
        setShowAlert(true);
        setAlertColor("error");
        setTextAlert("Can't update less than -1");
        // item.qty = 200;
        return
      }

      if (item.qty == 0 || item.qty == "" || item.qty == null) {
        item.qty = 1;
      }
      if (item.strategy == 'null' || strategy.length == 1) {
        item.strategy = strategy[0].strategy
      } else if (strategy.length > 0) {
        return item
      }
      return item

    })

    axios({
      method: "post",
      url: `${Config.base_url}client/updateservices`,
      data: {
        client_signal: ServiceArr,
        client_id: user_id,
      },
      headers: {
        'x-access-token': client_token
      }
    }).then(function (response) {
      if (response) {
        setShowAlert(true);
        setAlertColor("success");
        setTextAlert(Constant.UPDATED_SUCCESS);
        setRefreshscreen(!refreshscreen);
        //
        // navigate('../client/Dashboard.js')
      }
    });
  };



  // ------------------my Code ganpat -----
  // const [maxValue, setMaxValue] = useState(23);
  // const [value, setValue] = useState(0);

  // const qtyonChange = (event, straQty, actualqty) => {
  //   setMaxValue(straQty)
  //   const newValue = parseInt(event.target.value);
  //   if (newValue > maxValue) {
  //     setValue(maxValue);
  //   } else {
  //     setValue(newValue);
  //   }
  // };


  const qtyonChange = (event, straQty, actualqty) => {
    // setStraValue(straQty)

    const newValue = parseInt(event);
    if (newValue > parseInt(straQty)) {
      alert("tt")
      //setStraValue(straQty);
    } else {
      //  setStraValue(newValue);
    }
  }


  // ------------------my Code ganpat -----

  // const onKeyPressQuantity = (quantity, qty, e) => {
  //   console.log("quantity",typeof quantity);
  //   console.log("qty",typeof qty);
  //   console.log("e",typeof e.target.value);

  //   if(qty > quantity){
  //     alert(`You can't update more than ${quantity} quantity`);
  //     return e.target.value = toString(quantity)

  //   }
  // }



  return (
    <>
      <Backdrop
        sx={{ color: '#000000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
      // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title font">Dashboard</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <b>Set All Strategy</b>
                    <select
                      name="cstrategy"
                      // value={sig.strategy}
                      onChange={(e) => {
                        setAllToSetStrategy(e);
                      }}
                      className="form-control spacing"
                      style={{ width: "100px" }}
                    >
                      <option value="all">All</option>
                      {strategy && strategy.map((star, i) => (
                        <option value={star.strategy} key={i}>{star.strategy}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {getBroker == 12 ? <div className="col-md-4 ">
                  <b style={{ "color": "red" }}>*** Please Enter Lot Size</b>
                </div> : ""}

                <div className="table-responsive tableheight" >
                  <table className="table tbl-tradehostory">
                    <thead className="tablecolor">
                      <tr className="fontbold">
                        <th className="fontbold">No.</th>
                        <th className="fontbold">Symbol</th>
                        <th>{getBroker == 12 ? "Lot Size" : "Quantity"}</th>
                        {/* <th>Price</th> */}
                        <th>Segment</th>
                        <th>Strategy</th>
                        <th>Order Type</th>
                        <th>Product Type</th>
                        <th>Trading</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services && services.map((sig, index) => (
                        <tr key={index}>
                          {/* <td>{sig.quantity}</td> */}
                          <td>{index + 1}</td>
                          <td>{sig.ser_name}</td>
                          <td>

                            {/* <input type="number" value={value} onChange={(e) => qtyonChange(e, sig.quantity, sig.qty, index)
                            } max={sig.quantity}
                             disabled
                            ={qty_typeValue && qty_typeValue == 0 || qty_typeValue == "0"}  */}
                            {/* /> */}

                            <input
                              name="qty"
                              type="number"
                              pattern=" ^[1-9]?[0-9]{1}$|^100$"
                              onChange={(e) => {
                                serviceChange(e, index, sig);
                                // qtyonChange(e, sig.quantity, sig.qty, index);
                              }}
                              disabled={qty_typeValue && qty_typeValue == 0 || qty_typeValue == "0"}
                              // disabled={index ? "" :maxValue }
                              style={{ width: "150px" }}
                              value={sig.qty}
                              //   value={StraValue}
                              className="form-control"
                              min="-1"
                              max={sig.quantity == 0 ? "" : sig.quantity}
                            />
                          </td>

                          {/* <td>
                            {console.log('tokenPrice -', price)}
                            {tokenPrice == sig.instrument_token ? price : ''}
                          </td> */}

                          <td>{sig.cat_name}</td>
                          <td>
                            <select
                              name="cstrategy"
                              value={sig.strategy}
                              onChange={(e) => {
                                serviceChange(e, index);

                              }}
                              className="form-control"
                              style={{ width: "100px" }}
                            >

                              {strategy && strategy.map((star, i) => (

                                sig.strategy == star.strategy ? <><option style={{ color: "green", fontWeight: "bold" }} key={i}>{star.strategy}</option></> : <><option style={{ color: "red", fontWeight: "bold" }} key={i}>{star.strategy}</option></>
                              ))}
                              {/* <option key={i} style={{ color: "green" }}>{star.strategy}</option> */}
                            </select>
                          </td>
                          <td>
                            <select
                              className="order_type form-control"
                              name="order_type"
                              value={sig.order_type}
                              onChange={(e) => {
                                serviceChange(e, index);
                              }}

                              style={{ width: "100px" }}
                            >
                              {sig.product_type == "1" ||
                                sig.product_type == "2" ? (
                                <>
                                  <option value="1">MARKET</option>
                                  <option value="2">LIMIT</option>
                                  <option value="3">STOPLOSS LIMIT</option>
                                  <option value="4">STOPLOSS MARKET</option>
                                </>
                              ) : sig.product_type == "3" ? (
                                <>
                                  <option value="2">LIMIT</option>
                                  <option value="3">STOPLOSS LIMIT</option>
                                </>
                              ) : sig.product_type == "4" ? (
                                <>
                                  <option value="1">MARKET</option>
                                  <option value="2">LIMIT</option>
                                </>
                              ) : (
                                ""
                              )}
                            </select>
                          </td>
                          <td>
                            <select
                              className="product_type form-control"
                              name="product_type"
                              value={sig.product_type}
                              onChange={(e) => {
                                serviceChange(e, index);
                              }}

                              style={{ width: "100px" }}
                            >
                              <option value="1">CNC</option>
                              <option value="2">MIS</option>
                              <option value="3">BO</option>
                              <option value="4">CO</option>
                            </select>
                          </td>
                          <td>
                            <Form.Check
                              type="switch"
                              name="trading"
                              checked={sig.trading == "1" ? true : false}
                              onChange={(e) => {
                                serviceChange(e, index);
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="row">
                  <div className="col-md-10 pr-1">
                    {fromadmin == null &&
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="btn btn-color btn-block"
                      >
                        Update
                      </button>}
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

export default Dashboard;
