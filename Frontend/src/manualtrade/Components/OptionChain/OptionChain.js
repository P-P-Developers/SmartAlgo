import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
// import ExecutiveFilters from "./ExecutiveFilters";
import { Alert, Form, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
// import * as Config from "../../common/Config";
import * as Config from "../../../common/Config";
import AlertToast from "../../../common/AlertToast";
import Backdrop from '@mui/material/Backdrop';
// import * as Constant from "../../../ConstantMessage";
import CircularProgress from '@mui/material/CircularProgress';
import DataTable from "react-data-table-component";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { TextField } from '@mui/material';
import DataTableExtensions from "react-data-table-component-extensions";
import $ from "jquery";
import CryptoJS from "crypto-js";
import { dateFormate } from "../../../common/CommonDateFormate";
import { inputAdornmentClasses } from "@mui/material";
import { fontWeight } from "@mui/system";
import socketIOClient from "socket.io-client";
import { SyncLoader } from "react-spinners";






function OptionChain(e) {

  const manual_dash = localStorage.getItem("manual_dash");
  const client_token = localStorage.getItem('client_token');
  const client_id = localStorage.getItem("client_id");


  const [clientDetailsStatus, setClientDetailsStatus] = useState(0);
  const [clientClientKey, setClientClientKey] = useState("");


  const [clientDeatils, setClientDetails] = useState("");

  const [userPermissionType, setUserPermissionType] = useState([]);
  // console.log("clientDeatils", clientDeatils);
  //console.log("manual_dash  -- ",manual_dash);






  if (manual_dash == null) {
    // console.log("insideeeeeeeeeeeeeee   client");
    if (clientDetailsStatus == 0) {
      setClientDetailsStatus(1)
      axios({
        url: `${Config.base_url}client/profile`,
        method: "POST",
        data: {
          client_id: client_id,
        },
        headers: {
          'x-access-token': client_token
        }
      })
        .then((res) => {
          if (res.data) {
            console.log("daaaaata client", res.data.msg.client_key);
            setClientDetails(res.data.msg);
            setClientClientKey(res.data.msg.client_key);
            clientStartegyDataApi()
            UserPermissionApi()
          }

        });

    }

  }


  const UserPermissionApi = () => {
    axios({
      url: `${Config.base_url}getUserPermission`,
      method: "POST",
      data: {
        user_id: client_id,
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


  /// All Permissio Type set //

  const makeCall_condition = userPermissionType.filter((number) => number.permission_type_id == 1);

  const Segment_condition = userPermissionType.filter((number) => number.permission_type_id == 2);

  const optionChain_condition = userPermissionType.filter((number) => number.permission_type_id == 3);

  const stocks_option_condition = userPermissionType.filter((number) => number.permission_type_id == 4);

  const stock_index = userPermissionType.filter((number) => number.permission_type_id == 5);






  const [Bankniftyprint, setBankniftyprint] = useState('')
  const [Niftyprint, setniftyprint] = useState('')
  const admin_token = localStorage.getItem("token");

  //---------SOCKET----------------
  const [bankNiftyPriceShow, setBankNiftyPriceShow] = useState("")
  const [niftyPriceShow, setNiftyPriceShow] = useState("")


  const [strategy_data, setStrategy_data] = useState([]);
  const [OptionChainStockData, setOptionChainStockData] = useState([]);

  const [refreshscreen, setRefreshscreen] = useState(false);
  //    API Data States

  const [apiAllRoundToken2, setApiAllRoundToken2] = useState([])


  const [stockAllRoundToken, setStockAllRoundToken] = useState([])

  console.log("stockAllRoundToken", stockAllRoundToken)

  const [loader, setLoader] = useState(false);






  const [sockets, setSockets] = useState(null);

  const [expirydateSelect, setExpirydateSelect] = useState([])

  const [expiryOnChange, setExpiryOnChange] = useState("")
  const [singleStrategy, setSingleStrategy] = useState("")
  const [requestSiginals, setRequestSiginals] = useState([])
  const [panelKey, setPanelKey] = useState("")


  const [filterChannel, setFilterChannel] = useState("")
  const [oldChannel, setOldChannel] = useState("")
  const [disabled, setDisabled] = useState(false);

  // console.log("oldChannel", oldChannel);



  const thismonthdate = new Date().toString();
  const gettingThisMonth = thismonthdate.split(" ")[1].toUpperCase()
  const getDatetoken = new Date()
  const gettingdatetoken = getDatetoken.toTimeString()
  const splittime = gettingdatetoken.split(" ")[0]
  const navigate = useNavigate()




  // AlertToast
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");

  // model
  const [show, setShow] = useState(false);
  const [trdaesymbolArrayList, setTrdaesymbolArrayList] = useState([]);
  const handleClose = () => setShow(false);
  // model

  const [getTokenTradingApiDetails, setGetTokenTradingApiDetails] = useState([]);
  const [adminTradingType, setAdminTradingType] = useState("");


  const [socket1, setSocket1] = useState(null);


  const [buySell, setBuySell] = useState("");




  const [limitPrice, setLimitPrice] = useState(0.10);


  const currentChannel = useRef()
  const symbolRef = useRef("");
  const showrRoundChainRef = useRef(1);

  const userAliceblueIdRef = useRef("");
  const userAliceblueTokenRef = useRef("");




  const oldChannelRef = useRef("");

  const userAlicebluetype = useRef("");
  const userAliceblueBASEURL = useRef("");
  const userAliceblueSOCKETURL = useRef("");
  const middlestrikepriceRef = useRef("");

  const ApiSecretRef = useRef("");
  const ApiappIdeRef = useRef("");

  const handleClickDisabled = () => {
    setDisabled(true);
  }


  let socket;


  const GetNotification = async () => {
    var urls = Config.base_url;
    const socket11 = socketIOClient(`${urls}`);
    socket11.on("executed_trade_broadcast", (data) => {
      setSocket1(socket11)
      console.log("data socket", data);
      setShowAlert(true);
      setTextAlert(data.symbol.tradesymbol);
      setAlertColor("success");
      setRefreshscreen(!refreshscreen);
    });

  }




  const onAlertClose = e => {
    setShowAlert(false);
  }


  const Brokertoggle = (e, admiintokendetails) => {

    // console.log("admiintokendetails ", admiintokendetails[0].client_code)
    if (e.target.checked == true) {

      if (admiintokendetails[0].broker == 1) {

        window.location.href = "https://ant.aliceblueonline.com/?appcode=" + admiintokendetails[0].app_id;

      }


    } else {
      tradingOffAdminToken();

    }

  };



  function tradingOffAdminToken() {

    var config = {
      method: 'get',
      url: `${Config.base_url}api/alicebluetoken/tradingOff`
    };

    axios(config).then(function (response) {
      // console.log("openpostionapihit", response.data);
      setRefreshscreen(!refreshscreen);

    })
      .catch(function (error) {
        console.log(error);
      });


  }


  let AuthorizationToken;

  const runSocket = (channel) => {

    //alert(channel)

    // var userId = "788925";
    // var userSession = "pngllcaJWE1ArEgNx1g4aR1LpBuqNA7regzpstuu1NZrG7nvpEqKVf2uJ3DgEnoNVuLAxrJOHAfnurqx1d7jLWneYpFk75h6NVRClEgPhO2S2Ev0aMrNrpDdTnUptx222SI7gYObu5gsq1oVMKrVX7nZa3klZQfYWjWFe6ETnei2JJHdxJHT4iiG0VV3sSGHaid37Vlbv2WBVBj30y3jjciJYilNUyhmtrH2aozPqaH4jj6mQrRs9u2D1MTJACxG";

    console.log("running");

    var config = {
      method: "get",
      url: `${Config.base_url}api/alicebluetoken`,
      headers: {},
    };


    axios(config)
      .then(function (response) {
        // console.log("shakir response ", response.data);
        if (response.data.status == "true") {
          if (response.data.data[0].trading == 1) {
            userAliceblueIdRef.current = response.data.data[0].client_code;
            userAliceblueTokenRef.current = response.data.data[0].access_token;
            userAlicebluetype.current = response.data.data[0].type;
            userAliceblueBASEURL.current = response.data.data[0].baseurl_aliceblue;
            userAliceblueSOCKETURL.current = response.data.data[0].socket_url;

            invalidateSession(response.data.data[0].client_code, response.data.data[0].access_token, channel, response.data.data[0].type, response.data.data[0].baseurl_aliceblue, response.data.data[0].socket_url);
            // connect(response.data.data[0].client_code, response.data.data[0].access_token,channel,response.data.data[0].type,response.data.data[0].baseurl_aliceblue,response.data.data[0].socket_url);

          }

        } else {
          console.log('Token Not Available');
        }
      })
      .catch(function (error) {
        // console.log(error);
      });


  }

  function invalidateSession(userId, userSession, channel, type, BASEURL, SOCKETURL) {
    //alert(userId);

    AuthorizationToken = "Bearer " + userId + " " + userSession;
    //console.log('AuthorizationToken',AuthorizationToken);
    let jsonObj = {
      loginType: type,
    };
    $.ajax({
      url: BASEURL + "api/ws/invalidateSocketSess",
      headers: {
        Authorization: AuthorizationToken,
      },
      type: "post",
      data: JSON.stringify(jsonObj),
      contentType: "application/json",
      dataType: "json",
      async: false,
      success: function (msg) {

        console.log("msg", msg);
        var data = JSON.stringify(msg);

        if (msg.stat === "Ok") {
          createSession(userId, userSession, channel, type, BASEURL, SOCKETURL);
        }
      },
    });
  }

  function createSession(userId, userSession, channel, type, BASEURL, SOCKETURL) {
    //alert('create session')
    AuthorizationToken = "Bearer " + userId + " " + userSession;
    //console.log('AuthorizationToken cratesession',AuthorizationToken);

    let jsonObj = {
      loginType: type,
    };
    $.ajax({
      url: BASEURL + "api/ws/createSocketSess",
      headers: {
        Authorization: AuthorizationToken,
      },
      type: "post",
      data: JSON.stringify(jsonObj),
      contentType: "application/json",
      dataType: "json",
      async: false,
      success: function (msg) {
        var data = JSON.stringify(msg);
        if (msg.stat === "Ok") {
          connect(userId, userSession, channel, type, BASEURL, SOCKETURL)
        } else {
          alert(msg);
        }
      },
    });
  }


  function BackendSocketApi(userId, userSession, type, BASEURL, SOCKETURL) {

    var config = {
      method: 'get',
      url: `${Config.base_url}socket-api?userid=${userId}&usersession=${userSession}`,
      headers: {}
    };

    axios(config)
      .then(function (response) {


        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });



  }



  // const url = "wss://ws1.aliceblueonline.com/NorenWS/";


  function connect(userId, userSession, channel, type, BASEURL, SOCKETURL) {

    socket = new WebSocket(SOCKETURL);
    socket.onopen = function () {
      //  alert("socket open");

      console.log("socket running");
      connectionRequest(userId, userSession, type, BASEURL, SOCKETURL);
      setSockets(socket)
      //  console.log("socket connect ",sockets);

    };

    socket.onmessage = function (msg) {
      var response = JSON.parse(msg.data);

      // console.log("response", response)

      if (response.s == "OK") {
        console.log("second inside ");

        let json = {
          k: channel,
          t: "t",
        };
        socket.send(JSON.stringify(json));



        socket.onmessage = function (msg) {
          var response = JSON.parse(msg.data);

          // console.log("response", response);


          const old_val = $('.showdata' + response.tk).html();

          if (response.tk) {
            //console.log('response token', response.pc)
            if (response.lp != undefined) {
              $(".showdata" + response.tk).html(response.lp);

              const new_val = $('.showdata' + response.tk).html();


              if (new_val > old_val) {

                $('.showdata' + response.tk).css({ "color": "green" });

              } else if (new_val < old_val) {

                $('.showdata' + response.tk).css({ "color": "red" });
              } else if (new_val == old_val) {

                $('.showdata' + response.tk).css({ "color": "black" });
              }


            }
            else {
              $(".showdata" + response.tk).html(response.c);

            }

            if (response.bp1 != undefined) {
              $(".bp1_price" + response.tk).html(response.bp1);
            }
            if (response.sp1 != undefined) {
              $(".sp1_price" + response.tk).html(response.sp1);
            }


          }

        };

      }
    };

    socket.onclose = function (event) {
      if (event.wasClean) {

        // alert(`1 [close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);

      } else {


        connect(userAliceblueIdRef.current, userAliceblueTokenRef.current, oldChannelRef.current, userAlicebluetype.current, userAliceblueBASEURL.current, userAliceblueSOCKETURL.current);
        // alert('[close] Connection died');
      }
    };


    socket.onerror = function (error) {

    };


  }

  // $(".showdataEP").html("shakir");


  function connectionRequest(userId, userSession, type, BASEURL, SOCKETURL) {
    var encrcptToken = CryptoJS.SHA256(
      CryptoJS.SHA256(userSession).toString()
    ).toString();
    // alert(encrcptToken);
    var initCon = {
      susertoken: encrcptToken,
      t: "c",
      actid: userId + "_" + type,
      uid: userId + "_" + type,
      source: type,
    };
    console.log('initCon', JSON.stringify(initCon));
    socket.send(JSON.stringify(initCon));
  }




  const SymbolsFilter = (e) => {

    symbolRef.current = e.target.value;
    if (symbolRef.current != "") {
      setExpiryOnChange("")
      serachStockExpiry(symbolRef.current);
    } else {
      setStockAllRoundToken([]);
      setExpirydateSelect([]);
    }
  }


  const serachStockExpiry = (symbol) => {
    //  alert(expiryOnChange)
    const data = {
      "symbol": symbol
    }

    axios({
      method: "post",
      url: `https://api.smartalgo.in:3001/stochOptionChainExpiry`,
      data: data,

    }).then(res => {
      setExpiryOnChange("")
      showrRoundChainRef.current = 0
      setExpirydateSelect([])
      setStockAllRoundToken([]);
      // alert(expiryOnChange)
      setExpirydateSelect(res.data.data);
      if (expiryOnChange != "") {
        stockOptionChainData(symbol, expiryOnChange)
      }
    });

    
  }


  const ExpiryFilter = (e) => {


    if (symbolRef.current == "") {
      alert("please select stock");
      return
    }
    showrRoundChainRef.current = 1
    setExpiryOnChange(e.target.value);
    stockOptionChainData(symbolRef.current, e.target.value)
  }

  const stockOptionChainData = (symbol, expiry) => {
    // alert(symbol)
    // alert(expiry)
    // alert(showrRoundChainRef.current)

    if (showrRoundChainRef.current == 1) {
      setLoader(true);
      //conso e.log("lenght -- ",expirydateSelect);
      const data = {
        "symbol": symbol,
        "expiry": expiry
      }

      axios({
        method: "post",
        url: `https://api.smartalgo.in:3001/stochOptionAllRoundToken1`,
        data: data,

      }).then(res => {
        setStockAllRoundToken([]);
        setStockAllRoundToken(res.data.data);
        //  middlestrikepriceRef.current = res.data.data[5].strike_price

        const sortedArray = res.data.data.slice().sort((a, b) => a - b);
        // Step 2: Determine the middle index
        const middleIndex = Math.floor(sortedArray.length / 2);
        // console.log("middleIndex",middleIndex);
        // Step 3: Retrieve the middle value
        middlestrikepriceRef.current = res.data.data[middleIndex].strike_price;
        setLoader(false);
        if (sockets == null && res.data.channellist != "") {
          runSocket(res.data.channellist)
          oldChannelRef.current = res.data.channellist;

        } else {
          UnsubscribeChannel(oldChannelRef.current, sockets);
          sendNextRequest(res.data.channellist, sockets);
          oldChannelRef.current = res.data.channellist;
        }




      });


    }


  }



  


  const sendNextRequest = (newchannel, sockets) => {
    //alert("new channel")
    // alert(newchannel)
    let json = {
      k: newchannel,
      t: "t",
    };
    sockets.send(JSON.stringify(json));

    sockets.onmessage = function (msg) {
      var response = JSON.parse(msg.data);

      // console.log("response new channel", response);

      const old_val = $('.showdata' + response.tk).html();

      if (response.tk) {
        //console.log('response token', response.pc)
        if (response.lp != undefined) {
          $(".showdata" + response.tk).html(response.lp);

          const new_val = $('.showdata' + response.tk).html();


          if (new_val > old_val) {

            $('.showdata' + response.tk).css({ "color": "green" });

          } else if (new_val < old_val) {

            $('.showdata' + response.tk).css({ "color": "red" });
          } else if (new_val == old_val) {

            $('.showdata' + response.tk).css({ "color": "black" });
          }

        }
        else {
          $(".showdata" + response.tk).html(response.c);
        }
        if (response.bp1 != undefined) {
          $(".bp1_price" + response.tk).html(response.bp1);
        }
        if (response.sp1 != undefined) {
          $(".sp1_price" + response.tk).html(response.sp1);
        }


      }

    };


    sockets.onclose = function (event) {
      if (event.wasClean) {

        // console.log("iffffffffffff");

        // alert(`1 [close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);

      } else {

        // alert('[close] Connection died');
        // console.log("elseeeeeeeeeeee");
        connect(userAliceblueIdRef.current, userAliceblueTokenRef.current, oldChannelRef.current, userAlicebluetype.current, userAliceblueBASEURL.current, userAliceblueSOCKETURL.current);
      }
    };


    sockets.onerror = function (error) {

    };




  }

  const UnsubscribeChannel = (oldchannel, sockets) => {
    // alert("old channel")
    // alert(oldchannel)
    if (oldchannel != "") {

      let json = {
        k: oldchannel,
        t: "u",
      };
      sockets.send(JSON.stringify(json));
    }
  }



  const strategyDataApi = () => {


    axios({
      method: "get",
      url: `${Config.base_url}smartalgo/strategygroup`,
      data: {},
      headers: {
        'x-access-token': admin_token
      }
    }).then(res1 => {
      // console.log("res1  strategy", res1.data.strategy);
      setStrategy_data(res1.data.strategy);
    });
  }


  const clientStartegyDataApi = () => {
    axios({
      url: `${Config.base_url}client/services`,
      method: "post",
      data: {
        client_id: client_id,
      },
      headers: {
        'x-access-token': client_token
      }
    }).then((res) => {
      //console.log("strtegyyyyyy", res.data.strategy);
      setStrategy_data(res.data.strategy);

    });
  }


  const OptionChainStockDataApi = () => {
    axios({
      method: "get",
      url: `https://api.smartalgo.in:3001/stochOptionChain`,
      data: {},

    }).then(res => {

      console.log("dataaa ---- ", res.data.data);
      setOptionChainStockData(res.data.data);

    });
  }



  const getTokenTradingApi = () => {

    var config = {
      method: 'get',
      url: `${Config.base_url}api/getTokenTradingApi`
    };
    axios(config).then(function (response) {

      // console.log("openpostionapihit", response.data.data);
      setGetTokenTradingApiDetails(response.data.data)
      setAdminTradingType(response.data.data[0].trading)

    })
      .catch(function (error) {
        console.log(error);
      });




  }


  useEffect(() => {
    getPanelKey();
    strategyDataApi()
    OptionChainStockDataApi()
    getTokenTradingApi();
    GetNotification()
    GetBrokerKey()
  }, [refreshscreen, socket1])




  useEffect(() => {

  }, [sockets]);

  const getPanelKey = () => {

    var config = {
      method: 'get',
      url: `${Config.base_url}smartalgo/panelkey`,
      headers: {
        'x-access-token': admin_token
      }

    };
    axios(config)
      .then(function (response) {
        console.log("panel key - ", response.data.PanelKey[0].panel_key);
        setPanelKey(response.data.PanelKey[0].panel_key);

      })
      .catch(function (error) {
        console.log(error);
      });

  }



  const makerequest = (option_type, type, symbol, expiry, token, ischecked, index) => {
    var pre_tag = {
      option_type: option_type,
      type: type,
      token: token,
      indexcallput: option_type + index,
      indexing: index
    };




    if (type == "") {

      setRequestSiginals(oldValues => {
        return oldValues.filter(item => item.token !== token)
      })
    }
    else {
      setRequestSiginals(oldValues => {
        return oldValues.filter(item => item.indexcallput !== option_type + index)
      })

      setRequestSiginals((oldArray) => [pre_tag, ...oldArray]);
    }

  }


  //console.log("setRequestSiginals",requestSiginals)

  //console.log("middlestrikepriceRef.current --",middlestrikepriceRef.current);


  const executiveTrade = (e) => {

    if (adminTradingType == "" && sockets == null) {
      //  console.log("adminTradingType  -- ",adminTradingType);
      //    console.log("sockets  -- ",sockets);
      alert("Please login with broker Account")
      return
    }




    var tradesymbol_array = [];

    requestSiginals && requestSiginals.forEach((element, index) => {
      stockAllRoundToken && stockAllRoundToken.forEach((element1, index1) => {

        if (element.indexing == index1) {
          console.log("okk")
          if (element.option_type == "CALL") {


            var price;
            var price_get = $(".showdata" + element1.call_token).html();
            // alert(price_get);
            if (price_get == "") {
              price = "100";
            } else {
              price = $(".showdata" + element1.call_token).html();

            }

            // alert(price)
            let panel_key_trade = "";
            if (manual_dash == null) {
              panel_key_trade = clientClientKey
            } else {
              panel_key_trade = panelKey
            }


            var request = "id:11@@@@@input_symbol:" + symbolRef.current + "@@@@@type:" + element.type + "@@@@@price:" + (parseFloat(price) + parseFloat(limitPrice)) + "@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:" + panel_key_trade + "@@@@@exchange:NFO@@@@@product_type:MIS@@@@@strike:" + element1.strike_price + "@@@@@segment:O@@@@@option_type:" + element.option_type + "@@@@@expiry:" + expiryOnChange + "@@@@@strategy:" + singleStrategy + "@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@token:" + element1.call_token + "@@@@@chain:option_chain@@@@@by_side:OPTIONCHAIN@@@@@demo:demo";

            var option_type = element.option_type.toUpperCase();

            var is_CE_val_option = 'PE';
            if (option_type == 'CALL') {
              is_CE_val_option = 'CE';
            }

            var day_expiry = expiryOnChange.slice(0, 2);
            var moth_str = expiryOnChange.slice(2, 4);
            var year_expiry = expiryOnChange.slice(-2);

            // console.log("ffffffff  -  ", day_expiry);
            // console.log("mmmmmmmm -  ", moth_str);
            // console.log("day_year -  ", year_expiry);


            var month_string = ''

            if (moth_str == "01") {
              month_string = "JAN";
            } else if (moth_str == "02") {
              month_string = "FEB";
            }
            else if (moth_str == "03") {
              month_string = "MAR";
            }
            else if (moth_str == "04") {
              month_string = "APR";
            }
            else if (moth_str == "05") {
              month_string = "MAY";
            }
            else if (moth_str == "06") {
              month_string = "JUN";
            }
            else if (moth_str == "07") {
              month_string = "JUL";
            }
            else if (moth_str == "08") {
              month_string = "AUG";
            }
            else if (moth_str == "09") {
              month_string = "SEP";
            }
            else if (moth_str == "10") {
              month_string = "OCT";
            }
            else if (moth_str == "11") {
              month_string = "NOV";
            }
            else if (moth_str == "12") {
              month_string = "DEC";
            }


            var Transactions = "BUY";
            if (element.type == "SE") {
              Transactions = "SELL"
            }


            var tradesymbol = symbolRef.current + day_expiry + month_string + year_expiry + element1.strike_price + is_CE_val_option + "   -   " + Transactions;


            tradesymbol_array.push(tradesymbol)


          } else if (element.option_type == "PUT") {

            // console.log("symbol -", symbolRef.current)
            // console.log("panelKey -", panelKey)
            // console.log("expiry -", expiryOnChange)
            // console.log("singleStrategy -", singleStrategy)
            // console.log("token put-", element1.put_token)
            // console.log("type-", element.type)
            // console.log("strike price-", element1.strike_price)

            var price;
            var price_get = $(".showdata" + element1.put_token).html();
            // alert(price_get);
            if (price_get == "") {
              price = "100";
            } else {
              price = $(".showdata" + element1.put_token).html();
            }

            // alert(price)

            let panel_key_trade = "";
            if (manual_dash == null) {
              panel_key_trade = clientClientKey
            } else {
              panel_key_trade = panelKey
            }


            var request = "id:11@@@@@input_symbol:" + symbolRef.current + "@@@@@type:" + element.type + "@@@@@price:" + (parseFloat(price) + parseFloat(limitPrice)) + "@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:" + panel_key_trade + "@@@@@exchange:NFO@@@@@product_type:MIS@@@@@strike:" + element1.strike_price + "@@@@@segment:O@@@@@option_type:" + element.option_type + "@@@@@expiry:" + expiryOnChange + "@@@@@strategy:" + singleStrategy + "@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@token:" + element1.put_token + "@@@@@chain:option_chain@@@@@by_side:OPTIONCHAIN@@@@@demo:demo";


            var option_type = element.option_type.toUpperCase();



            var is_CE_val_option = 'PE';
            if (option_type == 'CALL') {
              is_CE_val_option = 'CE';
            }

            var day_expiry = expiryOnChange.slice(0, 2);
            var moth_str = expiryOnChange.slice(2, 4);
            var year_expiry = expiryOnChange.slice(-2);

            console.log("ffffffff  -  ", day_expiry);
            console.log("mmmmmmmm -  ", moth_str);
            console.log("day_year -  ", year_expiry);


            var month_string = ''



            if (moth_str == "01") {
              month_string = "JAN";
            } else if (moth_str == "02") {
              month_string = "FEB";
            }
            else if (moth_str == "03") {
              month_string = "MAR";
            }
            else if (moth_str == "04") {
              month_string = "APR";
            }
            else if (moth_str == "05") {
              month_string = "MAY";
            }
            else if (moth_str == "06") {
              month_string = "JUN";
            }
            else if (moth_str == "07") {
              month_string = "JUL";
            }
            else if (moth_str == "08") {
              month_string = "AUG";
            }
            else if (moth_str == "09") {
              month_string = "SEP";
            }
            else if (moth_str == "10") {
              month_string = "OCT";
            }
            else if (moth_str == "11") {
              month_string = "NOV";
            }
            else if (moth_str == "12") {
              month_string = "DEC";
            }


            var Transactions = "BUY";
            if (element.type == "SE") {
              Transactions = "SELL"
            }


            var tradesymbol = symbolRef.current + day_expiry + month_string + year_expiry + element1.strike_price + is_CE_val_option + "   -   " + Transactions;

            console.log("tradesymbol -- ", tradesymbol);
            tradesymbol_array.push(tradesymbol)


          }
        }
      });
    });


    setTrdaesymbolArrayList(tradesymbol_array)
    setShow(true);
  }


  const sendRequestPlaceOrder = () => {



    requestSiginals && requestSiginals.forEach((element, index) => {
      stockAllRoundToken && stockAllRoundToken.forEach((element1, index1) => {

        if (element.indexing == index1) {
          console.log("okk")
          if (element.option_type == "CALL") {


            var price;

            if (element.type == "LE") {
              price = $(".sp1_price" + element1.call_token).html();
            } else if (element.type == "SE") {
              price = $(".bp1_price" + element1.call_token).html();
            } else {
              price = "10";
            }


            let panel_key_trade = "";
            if (manual_dash == null) {
              panel_key_trade = clientClientKey
            } else {
              panel_key_trade = panelKey
            }

            var request = "id:11@@@@@input_symbol:" + symbolRef.current + "@@@@@type:" + element.type + "@@@@@price:" + (parseFloat(price) + parseFloat(limitPrice)) + "@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:" + panel_key_trade + "@@@@@exchange:NFO@@@@@product_type:MIS@@@@@strike:" + element1.strike_price + "@@@@@segment:O@@@@@option_type:" + element.option_type + "@@@@@expiry:" + expiryOnChange + "@@@@@strategy:" + singleStrategy + "@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@token:" + element1.call_token + "@@@@@chain:option_chain@@@@@by_side:OPTIONCHAIN@@@@@demo:demo";

            //console.log("return request-",request);

            placeOrderExcuted(request);


          }
          else if (element.option_type == "PUT") {


            var price;

            if (element.type == "LE") {
              price = $(".sp1_price" + element1.put_token).html();
            } else if (element.type == "SE") {
              price = $(".bp1_price" + element1.put_token).html();
            } else {
              price = "10";
            }

            // alert(price)

            let panel_key_trade = "";
            if (manual_dash == null) {
              panel_key_trade = clientClientKey
            } else {
              panel_key_trade = panelKey
            }

            var request = "id:11@@@@@input_symbol:" + symbolRef.current + "@@@@@type:" + element.type + "@@@@@price:" + (parseFloat(price) + parseFloat(limitPrice)) + "@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:" + panel_key_trade + "@@@@@exchange:NFO@@@@@product_type:MIS@@@@@strike:" + element1.strike_price + "@@@@@segment:O@@@@@option_type:" + element.option_type + "@@@@@expiry:" + expiryOnChange + "@@@@@strategy:" + singleStrategy + "@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@token:" + element1.put_token + "@@@@@chain:option_chain@@@@@by_side:OPTIONCHAIN@@@@@demo:demo";

            //  console.log("return request-",request);



            placeOrderExcuted(request);

          }
        }
      });
    });

    setShow(false);

  }


  function placeOrderExcuted(request) {
    //alert(limitPrice)
    //console.log("request", request)

    var config = {
      method: 'post',
      url: `${Config.broker_signal_url}`,
      headers: {
        'Content-Type': 'text/plain'
      },
      data: request
    };

    console.log("config", config);

    // return
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));



        if (response.data.status == false) {
          setShowAlert(true);
          setTextAlert(response.data.msg);
          setAlertColor("error");
          setDisabled(false)
          setRefreshscreen(!refreshscreen);
        } else {
          setShowAlert(true);
          setTextAlert("Trade Executed Successfully");
          setAlertColor("success");
          setDisabled(false)
          setRefreshscreen(!refreshscreen);

          if (manual_dash == null) {

            setTimeout(navigate("/client/manualopenpositions"), 3000);
          } else {

            setTimeout(navigate("/manual/manualopenpositions"), 3000);
          }

        }

        //   console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });



  }


  const PriceChangeLimitPrice = (e) => {
    if (e.target.value == '') {
      setLimitPrice(0.10);
    } else {
      setLimitPrice(e.target.value);
    }
  }


  const [showAliceModal, setShowAliceModal] = useState(false);
  const [secretKeyAlice, setSecretKeyAlice] = useState("")
  const [appIdAlice, setAppIdAlice] = useState("")
  const [getBrokerKey, setGetBrokerKey] = useState([])

  const handleCloseAliceModal = () => {
    setSecretKeyAlice("")
    setShowAliceModal(false)
  };

  const handleShowAliceModal = () => {
    setShowAliceModal(true)
  };

  const UpdateBrokerKey = () => {
    var data = JSON.stringify({
      "app_id": appIdAlice,
      "api_secret": secretKeyAlice
    });

    var config = {
      method: 'post',
      url: `${Config.base_url}updateAdminBrokerKey`,
      headers: {
        'x-access-token': admin_token,
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        if (response.data.status == true) {
          setShowAlert(true);
          setTextAlert("Data Update Successfully");
          setAlertColor("success");
          setRefreshscreen(!refreshscreen);
        }

      })
      .catch(function (error) {
        console.log(error);
      });
    setShowAliceModal(false)
  }



  function GetBrokerKey() {

    var config = {
      method: "get",
      url: `${Config.base_url}api/alicebluetoken/getBrokerKey`,
      headers: {},
    };

    axios(config)
      .then(function (response) {
        // console.log("shakir response ", response.data.status);
        if (response.data.status == "true") {
          ApiSecretRef.current = response.data.data[0].api_secret
          ApiappIdeRef.current = response.data.data[0].app_id
          setSecretKeyAlice(response.data.data[0].api_secret)
          setAppIdAlice(response.data.data[0].app_id)
          setGetBrokerKey(response.data.data[0])

        } else {
          console.log('Token Not Available');
        }
      })
      .catch(function (error) {
        // console.log(error);
      });


  }


  return (
    <>



      <div className='manual'>
        <div className='content'>
          <div className='card-dark'>
            <div className="col-md-12">
              <div className="">
                <div className="card-header">
                  <div className="row align-items-center">
                    <div className="col-md-12">
                      <h4 className="card-title font text-light">OPTION CHAIN - INDEX/STOCKS</h4>
                    </div>
                  </div>
                </div>
                <div className="card-header">
                  <div className="row">
                    <div className="col-md-12">
                      {
                        manual_dash == "ADMIN" ? <>
                          <div className="col-md-12 text-end">
                            <button type="button" onClick={() => handleShowAliceModal()} class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                              Set Key
                            </button>
                          </div>
                          <div className="col-md-6">
                            <div className="navbar-wrapper text-end d-flex justify-content-end align-items-center">
                              <p className="text-secondary mb-0 pe-2">Login with Get Live Price</p>
                              <Form.Check
                                className="broker_switch mb-2"
                                size="lg"
                                type="switch"
                                name="trading"
                                checked={adminTradingType == 1 ? true : false}
                                onChange={(e) => {
                                  Brokertoggle(e, getTokenTradingApiDetails);
                                }}
                              />
                            </div>
                          </div>
                        </> : ""
                      }
                      <div>
                        <div className="row">
                          <div className="col-md-2 text-secondary">
                            <label>SYMBOLS</label>
                            {
                              manual_dash == null ?
                                <>
                                  <select
                                    name="symbols_filter"
                                    className="form-select spacing text-secondary"
                                    onChange={(e) => SymbolsFilter(e)}
                                  >
                                    <option value="" >--Select stock--</option>


                                    {OptionChainStockData.map((sm, i) =>
                                      stock_index.length > 0 ? sm.symbol == "BANKNIFTY" || sm.symbol == "NIFTY" || sm.symbol == "FINNIFTY" ? <option value={sm.symbol}>{sm.symbol}</option> : "" : "")
                                    }
                                    {OptionChainStockData.map((sm, i) =>
                                      stocks_option_condition.length > 0 ? sm.symbol != "BANKNIFTY" || sm.symbol != "NIFTY" || sm.symbol != "FINNIFTY" ? <option value={sm.symbol}>{sm.symbol}</option> : "" : "")
                                    }
                                  </select>
                                </>
                                :
                                <select
                                  name="symbols_filter"
                                  className="form-select spacing text-secondary"
                                  onChange={(e) => SymbolsFilter(e)}
                                >
                                  <option value="" >--Select stock--</option>
                                  {OptionChainStockData.map((sm, i) =>
                                    <option value={sm.symbol}>{sm.symbol}</option>)
                                  }
                                </select>                            }
                          </div>
                          <div className="col-md-2">
                            <label className="text-secondary" style={{ fontWeight: 'bold', color: 'black' }}>EXPIRY DATE</label>
                            <select className="form-select" name="expiry_date" onChange={(e) => { ExpiryFilter(e); }}>
                              {/* <option value="">Select Expiry Date</option> */}
                              <option value="" >--Select expiry--</option>
                              {
                                expirydateSelect.map((sm, i) =>
                                  <option value={sm.expiry}>{sm.expiry_str}</option>)
                              }
                            </select>
                          </div>


                          {manual_dash == null ?
                            <>
                              <div className="col-md-2 ">
                                <label className="text-secondary" style={{ fontWeight: 'bold', color: 'black' }}>STRATEGY</label>
                                <select className="form-select" onChange={(e) => setSingleStrategy(e.target.value)} name="strategyname">
                                  <option value="">All</option>
                                  {strategy_data.map((sm, i) =>
                                    <option value={sm.strategy}>{sm.strategy}</option>)}
                                </select>
                              </div>

                            </>
                            :

                            <>


                              <div className="col-md-2 ">
                                <label className="text-secondary" style={{ fontWeight: 'bold', color: 'black' }}>STRATEGY</label>
                                <select className="form-select" onChange={(e) => setSingleStrategy(e.target.value)} name="strategyname">
                                  <option value="">All</option>
                                  {strategy_data.map((sm, i) =>
                                    <option value={sm.name}>{sm.name}</option>)}
                                </select>
                              </div>

                            </>}




                          <div className="col-md-2 ">
                            <label className="text-secondary" style={{ fontWeight: 'bold', color: 'black' }}>Price</label>
                            <input type="number" value={limitPrice} onChange={(e) => { PriceChangeLimitPrice(e) }} min="1" className="form-control" />

                          </div>



                        </div>

                        <div className="col-md-6">
                          {Bankniftyprint && Bankniftyprint[0].symbol}
                          <p className="ms-5"> {Niftyprint && Niftyprint[0].symbol}</p>
                        </div>

                      </div>
                    </div>


                    <div className="col-md-12 mb-3">
                      <p className="alert alert-warning mb-0"><b>{(singleStrategy != "" && expiryOnChange != "") ? "" : "* Please Select Strategy And Expiry Date To Buy/Sell"}</b></p>
                    </div>
                  </div>





                  <div className="row align-items-center mb-2">
                    <div className="col-md-4">
                      {/* <p className="mb-0 text-secondary"><b className="banknifty">BANKNIFTY :- {bankNiftyPriceShow}</b></p> */}
                    </div>
                    <div className="col-md-4">
                      {/* <p className="mb-0 text-secondary"><b className="nifty">NIFTY :- {niftyPriceShow}</b></p> */}
                    </div>
                    <div className="col-md-4">
                      {/* <button className='btn btn-success' onClick={(e) => runSocket(e)}>Run Socket</button> */}
                      <button className='btn btn-info float-end m-0' disabled={requestSiginals == "" ? true : false} onClick={executiveTrade}>Executive Trade</button>
                    </div>
                  </div>






                  <div className="table-responsive  position-relative p-0" >


                    <table className="table tbl-tradehostory executive-trade mb-0">

                      <thead className="tablecolor" >
                        <tr className="fontbold">
                          <th className="fontbold">Buy/Sell</th>
                          {/* <th className="fontbold">Sell</th> */}

                          <th>Call LP</th>
                          <th style={{ display: "none" }} >Call LP PC</th>
                          <th style={{ background: "red !important" }}>Strike Price</th>
                          <th>Put LP</th>

                          <th style={{ display: "none" }} >Put LP PC</th>
                          <th>Buy/Sell</th>
                          {/* <th>Sell</th> */}
                        </tr>
                      </thead>
                      <tbody>

                        <SyncLoader loading={loader} size={15} sizeUnit={"px"} color="#3498db" style={{ position: "absolute", left: "50%", top: "50%", zIndex: "99" }} />


                        {/* {apiAllRoundToken2 && apiAllRoundToken2.map((item, index) => ( */}
                        {stockAllRoundToken.length > 0 ? stockAllRoundToken && stockAllRoundToken.map((item, index) => (
                          // {middlestrikepriceRef.current == item.strike_price ? "" : ""} style={{ background: "#e0d8d8" }}
                          <tr style={middlestrikepriceRef.current == item.strike_price ? { background: "#d9ecff" } : { background: "#FFFFFF" }}>


                            <td >

                              <select
                                name="symbols_filter"
                                className="form-select spacing text-center mx-auto"
                                style={{ width: "100px" }}
                                onChange={(e) => { makerequest("CALL", e.target.value, item.symbol, item.expiry, item.call_token, e.target.checked, index); setBuySell(e.target.value) }}
                                disabled={(singleStrategy != "" && expiryOnChange != "") ? false : true}
                              >
                                {/* <option value="All" >All</option> */}
                                <option value="">Buy/Sell</option>
                                <option value="LE">Buy</option>
                                <option value="SE">Sell</option>
                              </select>

                            </td >

                            <div style={{ display: "none" }} className={"showdatapc" + item.call_token} ></div>

                            <div style={{ display: "none" }} className={"sp1_price" + item.call_token} ></div>

                            <div style={{ display: "none" }} className={"bp1_price" + item.call_token} ></div>

                            <td style={{ fontWeight: "bold" }} className={"showdata" + item.call_token}></td>
                            
                            

                            {/* <td><b>{item.call_token}</b></td> */}



                            <td style={middlestrikepriceRef.current == item.strike_price ? { background: "#d9ecff" } : { background: "#FFFFFF" }} ><b>{item.strike_price}</b></td>


                            {/* <td><b>{item.put_token}</b></td> */}

                            <div style={{ display: "none" }} className={"showdatapc" + item.put_token} ></div>

                            <div style={{ display: "none" }} className={"sp1_price" + item.put_token} ></div>

                            <div style={{ display: "none" }} className={"bp1_price" + item.put_token} ></div>

                            <td style={{ fontWeight: "bold" }} className={"showdata" + item.put_token}></td>




                            <td>
                              {/* <b>Buy/Sell</b> */}
                              <select
                                name="symbols_filter"
                                className="form-select spacing  mx-auto"
                                style={{ width: "100px" }}
                                onChange={(e) => makerequest("PUT", e.target.value, item.symbol, item.expiry, item.put_token, e.target.checked, index)}
                                disabled={(singleStrategy != "" && expiryOnChange != "") ? false : true}
                              >
                                {/* <option value="All" >All</option> */}
                                <option value="">Buy/Sell</option>
                                <option value="LE" >Buy</option>
                                <option value="SE">Sell</option>

                              </select>
                            </td>

                          </tr>
                        )) : "No records found"
                        }


                      </tbody>
                    </table>
                  </div>
                </div>





              </div>
              {showAlert &&
                <AlertToast
                  hideAlert={onAlertClose}
                  showAlert={showAlert}
                  message={textAlert}
                  alertColor={alertColor}
                />
              }
            </div>

          </div>
        </div>
      </div>





      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Stock Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            trdaesymbolArrayList?.map((item) => {
              return <>
                <p>{item}</p></>
            })
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <button className="btn btn-primary" variant="primary" disabled={disabled} onClick={() => { sendRequestPlaceOrder(); handleClickDisabled() }}>Done</button>
        </Modal.Footer>
      </Modal>


      <Modal show={showAliceModal} onHide={handleCloseAliceModal}>
        <Modal.Header closeButton>


          <Modal.Title>Set Alice Blue Keys</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <p><b>API Process Alice Blue - </b> Kindly click on below mention brokerage firm link it will redirect to your concern brokerage API link and generate API with this. Kindly follow instruction as your broker or sub broker link guide to you and update our link and connect your demat with our Algo software</p>
          <br />
          <p><b>Step 1 - </b> Click blow link and Login </p>
          <p>https://ant.aliceblueonline.com/?appcode=G9EOSWCEIF9ARCB</p>
          <br />
          <p><b>Step 2:-</b> Enter your Details and Redirect url</p>
          <p>{`${Config.broker_redirect_url}AliceBlue`}</p>
          <br />
          <p><b>Step 3:-</b> Create Api </p>
          <p>you will get Api Secret Key And App code please Update</p>

          <TextField
            id="outlined-required"
            label="SECRET KEY"
            defaultValue={ApiSecretRef.current}
            onChange={(e) => setSecretKeyAlice(e.target.value)}
          />
          <TextField
            id="outlined-required"
            label="APP ID"
            defaultValue={ApiappIdeRef.current}
            onChange={(e) => setAppIdAlice(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAliceModal}>
            Close
          </Button>
          <Button variant="primary" onClick={() => UpdateBrokerKey()}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>




    </>
  );
}



export default OptionChain;