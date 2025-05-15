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




function ExecutiveTrad(e) {



  const [getSymbolsFilter, setGetSymbolsFilter] = useState([])
  const [showStrikePrice, setShowStrikePrice] = useState([])
  const [thisMonthSymbols, setThisMonthSymbols] = useState([])
  const [Bankniftyprint, setBankniftyprint] = useState('')
  const [Niftyprint, setniftyprint] = useState('')
  const [channelShow, setChannelShow] = useState("")
  const admin_token = localStorage.getItem("token");

  //---------SOCKET----------------
  const [bankNiftyPriceShow, setBankNiftyPriceShow] = useState("")
  const [niftyPriceShow, setNiftyPriceShow] = useState("")
  const [bankNiftyStrikePrice, setBankNiftyStrikePrice] = useState([])
  const [niftyStrikePrice, setNiftyStrikePrice] = useState([])
  const [socketPriceShow, setSocketPriceShow] = useState([])
  const [strategy_data, setStrategy_data] = useState([]);
  const [refreshscreen, setRefreshscreen] = useState(false);
  //    API Data States
  const [apiAllRoundToken, setApiAllRoundToken] = useState([])
  const [apiAllRoundToken2, setApiAllRoundToken2] = useState([])
  const [apiChannelList, setApiChannelList] = useState([])
  const [apiStrikePrice, setApiStrikePrice] = useState([])
  const [arrayobject, setArrayobject] = useState([]);
  const [tokenAndPrice, setTokenAndPrice] = useState([])
  const [sockets, setSockets] = useState(null);
  const [sss, setSss] = useState("");
  const [responseSocket, setResponseSocket] = useState([])
  const [responseResult, setResponseResult] = useState([])
  const [callToken, setCallToken] = useState([])
  const [putToken, setPutToken] = useState([])
  const [listDataExcSeg, setListDataExcSeg] = useState([]);
  const [stratValue, setStratValue] = useState("")
  const [valChecked, setValChecked] = useState("")
  const [expirydateSelect, setExpirydateSelect] = useState([])
  // console.log("expirydateSelect", expirydateSelect);
  const [expiryOnChange, setExpiryOnChange] = useState("")
  const [singleStrategy, setSingleStrategy] = useState("")
  const [requestSiginals, setRequestSiginals] = useState([])
  const [panelKey, setPanelKey] = useState("")
  const [openPositionData, setOpenPositionData] = useState([])
  const [selectRowArray, setSelectRowArray] = useState([])
  const [tags1, setTags] = useState([]);

  const [symbolFilter2, setSymbolFilter2] = useState("")
  const [expiryDate2, setExpiryDate2] = useState("")
  const [filterChannel, setFilterChannel] = useState("")
  const [oldChannel, setOldChannel] = useState("")
  const [disabled, setDisabled] = useState(false);

  // console.log("oldChannel", oldChannel);


  const uniqueArr = [...new Set(getSymbolsFilter.map((item) => (item.name)))];
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
  const currentChannel = useRef()
  const symbolRef = useRef("BANKNIFTY");

  const handleClickDisabled = () => {
    setDisabled(true);
  }




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




  let AuthorizationToken;

  const runSocket = (first_channel, second_channel) => {

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
          if(response.data.data[0].trading == 1){
          invalidateSession(response.data.data[0].client_code, response.data.data[0].access_token, first_channel, second_channel,response.data.data[0].type,response.data.data[0].baseurl_aliceblue,response.data.data[0].socket_url);
          }

        } else {
          console.log('Token Not Available');
        }
      })
      .catch(function (error) {
        // console.log(error);
      });


  }






  function invalidateSession(userId, userSession, first_channel, second_channel,type,BASEURL,SOCKETURL) {
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
        var data = JSON.stringify(msg);

        if (msg.stat === "Ok") {
          createSession(userId, userSession, first_channel, second_channel,type,BASEURL,SOCKETURL);
        }
      },
    });
  }

  function createSession(userId, userSession, first_channel, second_channel,type,BASEURL,SOCKETURL) {
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
          connect(userId, userSession, first_channel, second_channel,type,BASEURL,SOCKETURL);
          BackendSocketApi(userId, userSession,type,BASEURL,SOCKETURL)
        } else {
          alert(msg);
        }
      },
    });
  }



  function BackendSocketApi(userId, userSession,type,BASEURL,SOCKETURL) {

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
  let socket;

  function connect(userId, userSession, firstchannel, second_channel,type,BASEURL,SOCKETURL) {

    socket = new WebSocket(SOCKETURL);
    socket.onopen = function () {
      //  alert("socket open");

      console.log("socket running");
      connectionRequest(userId, userSession,type,BASEURL,SOCKETURL);
      setSockets(socket)
      //  console.log("socket connect ",sockets);

    };

    socket.onmessage = function (msg) {
      var response = JSON.parse(msg.data);

      // console.log("response", response)

      if (response.s == "OK") {
        console.log("second inside ");

        let json = {
          k: firstchannel + "#" + second_channel,
          t: "t",
        };
        socket.send(JSON.stringify(json));

        // let json1 = {
        //   k: second_channel,
        //   t: "t",
        // };

        // socket.send(JSON.stringify(json1));

        const banknifty = firstchannel.split('#')[0].split('|')[1];

        const nifty = firstchannel.split('#')[1].split('|')[1];

        socket.onmessage = function (msg) {
          var response = JSON.parse(msg.data);

          // console.log("response", response);
        //  console.log('response socket ggg dd', response)



          if (banknifty == response.tk && response.lp != undefined) {
            setBankNiftyPriceShow(response.lp)
          }

          if (nifty == response.tk && response.lp != undefined) {
            setNiftyPriceShow(response.lp)
          }

          const old_val = $('.showdata'+response.tk).html();

          if (response.tk) {
            //console.log('response token', response.pc)
            if (response.lp != undefined) {
              $(".showdata" + response.tk).html(response.lp);

              const new_val = $('.showdata'+response.tk).html();


              if(new_val > old_val){

                $('.showdata'+response.tk).css({"color":"green"});

              }else if(new_val < old_val){

                $('.showdata'+response.tk).css({"color":"red"});
              }else if(new_val == old_val){

                $('.showdata'+response.tk).css({"color":"black"});
              }


              // if (response.pc != undefined) {

              //   if (response.pc > 0) {

              //     $('.showdata' + response.tk).css({ "color": "green" });

              //   } else if (response.pc < 0) {

              //     $('.showdata' + response.tk).css({ "color": "red" });
              //   } else if (response.pc == 0) {

              //     $('.showdata' + response.tk).css({ "color": "black" });
              //   }


              // }


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
        //   runSocket(firstchannel, second_channel)
        //  console.log("userid",userId);
        // console.log("userSession",userSession);
        //  connectionRequest(userId, userSession);
      } else {
        //   runSocket(firstchannel, second_channel)

        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        // alert('[close] Connection died');
      }
    };


    socket.onerror = function (error) {
      //  runSocket(firstchannel, second_channel)

      //  alert(`[error]`);
    };


  }

  // $(".showdataEP").html("shakir");


  function connectionRequest(userId, userSession,type,BASEURL,SOCKETURL) {
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


  // console.log("tags1 -- ", tags1 && tags1)

  const SymbolsFilter = (e, expiry) => {
    // alert(e.target.value)
    // setSymbolFilter2(e.target.value)
    symbolRef.current = e.target.value;
    if (e.target.value != "") {
      newApiForTokens(expiry = "")
    }

  }




  const getSocketData = () => {
    axios({
      method: "get",
      url: 'https://api.smartalgo.in:3001/smartalgo/channel/alldata',
    }).then(res => {
      // console.log("res channel", res.data);
      setExpirydateSelect(res.data.all_expiry)
      setApiChannelList(res.data.channel_list[0])
      setExpiryDate2(res.data.all_expiry[0].expiry)
      setApiStrikePrice(res.data.strike_price)
      setExpiryOnChange(res.data.all_expiry[0].expiry)
      newApiForTokens(res.data.all_expiry[0].expiry)

    });
  }


  const newApiForTokens = (expiry) => {
    setOldChannel(filterChannel)

    var data = JSON.stringify({
      "symbol": symbolRef.current,
      "expiry": expiry == "" ? expiryOnChange : expiry
    });

    var config = {
      method: 'post',
      url: 'https://api.smartalgo.in:3001/all_round_token/filter',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data,
    };
    //  console.log("dataaaaaaaaaa", data);

    axios(config).then(function (response) {

      //console.log("new Channel list", response.data.channellist);
      //setApiAllRoundToken(response.data.all_round_token)
      setApiAllRoundToken2(response.data.all_round_token)
      channeSocket(response.data.firstchannel, response.data.channellist, currentChannel.current);
      currentChannel.current = response.data.channellist;
      setFilterChannel(response.data.channellist)

    })
      .catch(function (error) {
        console.log(error);
      });
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
      // console.log("res1", res1);
      setStrategy_data(res1.data.strategy);
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
    GetBrokerKey();
    getTokenTradingApi();
    getPanelKey();
    strategyDataApi()
    getSocketData()
    GetNotification()
  }, [refreshscreen, socket1])



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
          setGetBrokerKey(response.data.data[0])

        } else {
          console.log('Token Not Available');
        }
      })
      .catch(function (error) {
        // console.log(error);
      });


  }





  function channeSocket(firstchannel, channel_list, oldlist) {


    // if (sockets == null) {
    //   //alert('okkk')
    //   runSocket(firstchannel, channel_list)
    // } else {



    //   //console.log("new channel listttt", channel_list);
    //   //console.log("old channel listttt", oldlist);
    //   //console.log("filter socket", sockets);

    //   // if (oldlist != undefined) {
    //   //   console.log('unsubscribe token', oldlist)
    //   //   //  alert("inside unscribe")
    //   //   // alert(oldlist)
    //   //   let json2 = {
    //   //     k: oldlist,
    //   //     t: "u",
    //   //   };

    //   //   sockets.send(JSON.stringify(json2));

    //   // }



    //   console.log('channel_list', channel_list)




    //   let json1 = {
    //     k: firstchannel + "#" + channel_list,
    //     t: "t",
    //   };

    //   console.log("current Channel ", json1)

    //   sockets.send(JSON.stringify(json1));
    //   sockets.onmessage = function (msg) {
    //     var response = JSON.parse(msg.data);

    //     // console.log("channel socket second",response)

    //     const banknifty = firstchannel.split('#')[0].split('|')[1];

    //     const nifty = firstchannel.split('#')[1].split('|')[1];


    //     if (banknifty == response.tk && response.lp != undefined) {
    //       setBankNiftyPriceShow(response.lp)
    //     }

    //     if (nifty == response.tk && response.lp != undefined) {
    //       setNiftyPriceShow(response.lp)
    //     }

    //     const old_val = $('.showdata'+response.tk).html();

    //     if (response.tk) {

    //       if (response.lp != undefined) {
    //         $(".showdata" + response.tk).html(response.lp);

    //         const new_val = $('.showdata'+response.tk).html();


    //           if(new_val > old_val){

    //             $('.showdata'+response.tk).css({"color":"green"});

    //           }else if(new_val < old_val){

    //             $('.showdata'+response.tk).css({"color":"red"});
    //           }else if(new_val == old_val){

    //             $('.showdata'+response.tk).css({"color":"black"});
    //           }



    //       } else {
    //         $(".showdata" + response.tk).html(response.c);

    //       }

    //       if (response.bp1 != undefined) {
    //         $(".bp1_price" + response.tk).html(response.bp1);
    //       }
    //       if (response.sp1 != undefined) {
    //         $(".sp1_price" + response.tk).html(response.sp1);
    //       }



    //     }

    //   };

    //   sockets.onclose = function (event) {
    //     if (event.wasClean) {
    //       // alert(`2 [close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    //       //   runSocket(firstchannel, channel_list)
    //     } else {
    //       // e.g. server process killed or network down
    //       // event.code is usually 1006 in this case
    //       //  alert('[close] Connection died');
    //       //    runSocket(firstchannel, channel_list)

    //     }
    //   };


    //   sockets.onerror = function (error) {
    //     //  alert(`[error]`);
    //     //   runSocket(firstchannel, channel_list)

    //   };

    // }

  }

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
        //  console.log("ddddd - ", response.data);
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


  //  console.log("setRequestSiginals",requestSiginals)


  const executiveTrade = (e) => {

    if (adminTradingType == "" || sockets == null) {
      alert("Please login with broker Account")
      return
    }




    var tradesymbol_array = [];

    requestSiginals && requestSiginals.forEach((element, index) => {
      apiAllRoundToken2 && apiAllRoundToken2.forEach((element1, index1) => {

        if (element.indexing == index1) {
          console.log("okk")
          if (element.option_type == "CALL") {

            // console.log("symbol -", symbolRef.current)
            // console.log("panelKey -", panelKey)
            // console.log("expiry -", expiryOnChange)
            // console.log("singleStrategy -", singleStrategy)
            // console.log("token call-", element1.call_token)
            // console.log("type-", element.type)
            // console.log("strike price-", element1.strike_price)

            var price;
            var price_get = $(".showdata" + element1.call_token).html();
            // alert(price_get);
            if (price_get == "") {
              price = "100";
            } else {
              price = $(".showdata" + element1.call_token).html();

            }

            // alert(price)


            var request = "id:11@@@@@input_symbol:" + symbolRef.current + "@@@@@type:" + element.type + "@@@@@price:" + price + "@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:" + panelKey + "@@@@@exchange:NFO@@@@@product_type:MIS@@@@@strike:" + element1.strike_price + "@@@@@segment:O@@@@@option_type:" + element.option_type + "@@@@@expiry:" + expiryOnChange + "@@@@@strategy:" + singleStrategy + "@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@token:" + element1.call_token + "@@@@@chain:option_chain@@@@@by_side:OPTIONCHAIN@@@@@demo:demo";

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


            var request = "id:11@@@@@input_symbol:" + symbolRef.current + "@@@@@type:" + element.type + "@@@@@price:" + price + "@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:" + panelKey + "@@@@@exchange:NFO@@@@@product_type:MIS@@@@@strike:" + element1.strike_price + "@@@@@segment:O@@@@@option_type:" + element.option_type + "@@@@@expiry:" + expiryOnChange + "@@@@@strategy:" + singleStrategy + "@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@token:" + element1.put_token + "@@@@@chain:option_chain@@@@@by_side:OPTIONCHAIN@@@@@demo:demo";


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
      apiAllRoundToken2 && apiAllRoundToken2.forEach((element1, index1) => {

        if (element.indexing == index1) {
          console.log("okk")
          if (element.option_type == "CALL") {

            // console.log("symbol -", symbolRef.current)
            // console.log("panelKey -", panelKey)
            // console.log("expiry -", expiryOnChange)
            // console.log("singleStrategy -", singleStrategy)
            // console.log("token call-", element1.call_token)
            // console.log("type-", element.type)
            // console.log("strike price-", element1.strike_price)


            var price;

            if (element.type == "LE") {
              price = $(".sp1_price" + element1.call_token).html();
            } else if (element.type == "SE") {
              price = $(".bp1_price" + element1.call_token).html();
            } else {
              price = "10";
            }


            var request = "id:11@@@@@input_symbol:" + symbolRef.current + "@@@@@type:" + element.type + "@@@@@price:" + price + "@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:" + panelKey + "@@@@@exchange:NFO@@@@@product_type:MIS@@@@@strike:" + element1.strike_price + "@@@@@segment:O@@@@@option_type:" + element.option_type + "@@@@@expiry:" + expiryOnChange + "@@@@@strategy:" + singleStrategy + "@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@token:" + element1.call_token + "@@@@@chain:option_chain@@@@@by_side:OPTIONCHAIN@@@@@demo:demo";

            //console.log("return request-",request);

            placeOrderExcuted(request);


          } else if (element.option_type == "PUT") {

            // console.log("symbol -", symbolRef.current)
            // console.log("panelKey -", panelKey)
            // console.log("expiry -", expiryOnChange)
            // console.log("singleStrategy -", singleStrategy)
            // console.log("token put-", element1.put_token)
            // console.log("type-", element.type)
            // console.log("strike price-", element1.strike_price)


            var price;

            if (element.type == "LE") {
              price = $(".sp1_price" + element1.put_token).html();
            } else if (element.type == "SE") {
              price = $(".bp1_price" + element1.put_token).html();
            } else {
              price = "10";
            }

            // alert(price)


            var request = "id:11@@@@@input_symbol:" + symbolRef.current + "@@@@@type:" + element.type + "@@@@@price:" + price + "@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:" + panelKey + "@@@@@exchange:NFO@@@@@product_type:MIS@@@@@strike:" + element1.strike_price + "@@@@@segment:O@@@@@option_type:" + element.option_type + "@@@@@expiry:" + expiryOnChange + "@@@@@strategy:" + singleStrategy + "@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@token:" + element1.put_token + "@@@@@chain:option_chain@@@@@by_side:OPTIONCHAIN@@@@@demo:demo";

            //  console.log("return request-",request);



            placeOrderExcuted(request);

          }
        }
      });
    });

    setShow(false);

  }


  function placeOrderExcuted(request) {

    // console.log("request", request)
    // return
    var config = {
      method: 'post',
      url: `${Config.broker_signal_url}`,
      headers: {
        'Content-Type': 'text/plain'
      },
      data: request
    };

// console.log("config" ,config);

    // return
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));

        if(response.data.status == false){
          setShowAlert(true);
        setTextAlert(response.data.msg);
        setAlertColor("error");
        getSocketData();
        setDisabled(false)
        setRefreshscreen(!refreshscreen);
        }else{
        setShowAlert(true);
        setTextAlert("Trade Executed Successfully");
        setAlertColor("success");
        getSocketData();
        setDisabled(false)
        setRefreshscreen(!refreshscreen);
        setTimeout(  navigate("/manual/manualopenpositions"), 3000);

        }

        //   console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });



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
                      <h4 className="card-title font text-light">Executive Trade</h4>
                    </div>
                    <div className="col-md-12 text-end">
                      <button type="button" onClick={() => handleShowAliceModal()} class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                        Set Key
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card-header">
                  <div className="row">
                    <div className="col-md-6">
                      <div>
                        <div className="row">
                          <div className="col-md-4 text-secondary">
                            <label>SYMBOLS</label>
                            <select
                              name="symbols_filter"
                              className="form-select spacing text-secondary"

                              onChange={(e, expiry) => SymbolsFilter(e, expiry)}
                            >
                              {/* <option value="All" >All</option> */}
                              <option value="BANKNIFTY" selected>BANKNIFTY</option>
                              <option value="NIFTY">NIFTY</option>

                              {/* {uniqueArr && uniqueArr.map((x) => {
                              return <option value={x}>{x}</option>
                            })} */}
                            </select>

                          </div>
                          <div className="col-md-4 ">
                            <label className="text-secondary" style={{ fontWeight: 'bold', color: 'black' }}>STRATEGY</label>
                            <select className="form-select" onChange={(e) => setSingleStrategy(e.target.value)} name="strategyname">
                              <option value="">All</option>
                              {strategy_data.map((sm, i) =>
                                <option value={sm.name}>{sm.name}</option>)}
                            </select>
                          </div>

                          <div className="col-md-4">
                            <label className="text-secondary" style={{ fontWeight: 'bold', color: 'black' }}>EXPIRY DATE</label>
                            <select className="form-select" name="expiry_date" onChange={(e) => { setExpiryOnChange(e.target.value); newApiForTokens(e.target.value) }} selected>
                              {/* <option value="">Select Expiry Date</option> */}
                              {expirydateSelect.map((sm, i) =>
                                <option value={sm.expiry}>{sm.expiry_str}</option>)}

                            </select>
                          </div>

                        </div>

                        <div className="col-md-6">
                          {Bankniftyprint && Bankniftyprint[0].symbol}
                          <p className="ms-5"> {Niftyprint && Niftyprint[0].symbol}</p>
                        </div>

                      </div>
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
                    <div className="col-md-12 mb-3">
                      <p className="alert alert-warning mb-0"><b>{(singleStrategy != "" && expiryOnChange != "") ? "" : "* Please Select Strategy And Expiry Date To Buy/Sell"}</b></p>
                    </div>
                  </div>





                  <div className="row align-items-center mb-2">
                    <div className="col-md-4">
                      <p className="mb-0 text-secondary"><b className="banknifty">BANKNIFTY :- {bankNiftyPriceShow}</b></p>
                    </div>
                    <div className="col-md-4">
                      <p className="mb-0 text-secondary"><b className="nifty">NIFTY :- {niftyPriceShow}</b></p>
                    </div>
                    <div className="col-md-4">
                      {/* <button className='btn btn-success' onClick={(e) => runSocket(e)}>Run Socket</button> */}
                      <button className='btn btn-info float-end m-0' disabled={requestSiginals == "" ? true : false} onClick={executiveTrade}>Executive Trade</button>
                    </div>
                  </div>






                  <div className="table-responsive tableheight" >
                    <table className="table tbl-tradehostory executive-trade">
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

                        {apiAllRoundToken2 && apiAllRoundToken2.map((item, index) => (

                          <tr>
                            <td >

                              {/* <b>Buy/Sell</b> */}
{/* for testing ================================================================== */}

                              {/* <div class="buttons">
                                <button class="button is-success"  style={{background : "#4BB543"}}>zusagen</button>
                              </div> */}
{/* for testing ================================================================== */}
                              {/* <button className="">buy</button>
                              <button>sell</button> */}

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

                            <td style={{ background: "#e0d8d8" }} ><b>{item.strike_price}</b></td>

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
                        ))
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
            defaultValue={getBrokerKey.api_secret}
            onChange={(e) => setSecretKeyAlice(e.target.value)}
          />
          <TextField
            id="outlined-required"
            label="APP ID"
            defaultValue={getBrokerKey.app_id}
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



export default ExecutiveTrad;