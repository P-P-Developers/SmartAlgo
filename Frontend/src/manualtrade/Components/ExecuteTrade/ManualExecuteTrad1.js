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
  const [makeChannelData, setMakeChannelData] = useState("")
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
  const [getLastDate, setGetLastDate] = useState("")
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

  const [bankNiftyToken, setBankNiftyToken] = useState("")
  const [niftyToken, setNiftyToken] = useState("")

  // AlertToast
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");

  // model 
  const [show, setShow] = useState(false);
  const [trdaesymbolArrayList, setTrdaesymbolArrayList] = useState([]);
  const handleClose = () => setShow(false);
  // model 




  // modal All square Off
  const [showAllSquareOff, setShowAllSquareOff] = useState(false);
  const AllSquareOffClose = () => setShowAllSquareOff(false);
  const [allSquareOfModalShow, setAllSquareOfModalShow] = useState([]);
  //


  // modal Single square Off
  const [showSingleSquareOff, setShowSingleSquareOff] = useState(false);
  const SingleSquareOffClose = () => setShowSingleSquareOff(false);
  const [singleSquareOfModalShow, setSingleSquareOfModalShow] = useState();
  const [singleSquareOfModalShowGetRow, setSingleSquareOfModalShowGetRow] = useState(null);


  const [getTokenTradingApiDetails, setGetTokenTradingApiDetails] = useState([]);
  //console.log("getTokenTradingApiDetails",getTokenTradingApiDetails);
  const [openpossitionString, setOpenpossitionString] = useState("");
  const [adminTradingType, setAdminTradingType] = useState("");

  const [stopLossPriceUpdate, setStopLossPriceUpdate] = useState([])
  const [targetPriceUpdate, setTargetPriceUpdate] = useState([])

  const [socket1, setSocket1] = useState(null);

  // console.log("trading ---- ", adminTradingType);
  //  console.log("trading ---- ", typeof adminTradingType);


  const [buySell, setBuySell] = useState("");
  //  console.log("buySell",buySell);
  const currentChannel = useRef()

  const symbolRef = useRef("BANKNIFTY");
  // const expiryRef = useRef("BANKNIFTY");
  // console.log("symbol", symbolRef);

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

  //   useEffect(() => {
  //      GetNotification()

  // }, [socket1])


  const onAlertClose = e => {
    setShowAlert(false);
  }


  const marginCalculator = () => {
    // alert("okkk")
    var config = {
      method: 'get',
      url: 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json',
    };
    var abc = []
    axios(config)
      .then(function (response) {
        var channelstr = ""
        response.data.forEach(function (element) {
          if ((element.instrumenttype == 'FUTIDX' && element.exch_seg == "NFO")) {
            if (element.name == 'BANKNIFTY' || element.name == 'NIFTY') {

              //  if (element.expiry.toString().includes(gettingThisMonth)) {

              setGetLastDate(element.expiry)
              channelstr += element.exch_seg + "|" + element.token + "#"
              if (element.name == "BANKNIFTY") {

                console.log("token BANKNIFTY - ", element.token);
                console.log("token BANKNIFTY expiry - ", element.expiry);

                const date = new Date();
                const date_expiry = new Date(element.expiry);
                const currentMonth = date.getMonth();
                const currentMonth_expiry = date_expiry.getMonth();
                if (currentMonth == currentMonth_expiry) {
                  setBankNiftyToken(element.token)
                }

              } else if (element.name == "NIFTY") {
                console.log("token NIFTY - ", element.token);
                console.log("token NIFTY  expiry- ", element.expiry);

                const date = new Date();
                const date_expiry = new Date(element.expiry);
                const currentMonth = date.getMonth();
                const currentMonth_expiry = date_expiry.getMonth();
                if (currentMonth == currentMonth_expiry) {
                  setNiftyToken(element.token);
                }

              }
              // }
            }
          }
        });

        var alltokenchannellist = channelstr.substring(0, channelstr.length - 1);
        setMakeChannelData(alltokenchannellist)

      })
      .catch(function (error_broker) {
        console.log('error_broker -', error_broker);
      });
  }



  var BASEURL = "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/";
  let AuthorizationToken;
  let type = "API";

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
        // console.log("shakir response ", response.data.status);
        if (response.data.status == "true") {

          // invalidateSession(
          //   response.data.data[0].client_code,
          //   response.data.data[0].access_token
          // );
          invalidateSession(response.data.data[0].client_code, response.data.data[0].access_token, first_channel, second_channel);


        } else {
          console.log('Token Not Available');
        }
      })
      .catch(function (error) {
        // console.log(error);
      });


    //  invalidateSession(userId, userSession, first_channel, second_channel, openpositionchannel);
  }









  function invalidateSession(userId, userSession, first_channel, second_channel) {
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
          createSession(userId, userSession, first_channel, second_channel);
        }
      },
    });
  }

  function createSession(userId, userSession, first_channel, second_channel) {
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
          connect(userId, userSession, first_channel, second_channel);
          BackendSocketApi(userId, userSession)
        } else {
          alert(msg);
        }
      },
    });
  }

  var bankniftypushaccdec = []
  var niftypushaccdec = []
  var responseArray = [];
  var socketPricearr = []


  function BackendSocketApi(userId, userSession) {

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






  const url = "wss://ws1.aliceblueonline.com/NorenWS/";
  let socket;

  function connect(userId, userSession, firstchannel, second_channel) {

    socket = new WebSocket(url);
    socket.onopen = function () {
      //  alert("socket open");

      console.log("socket running");
      connectionRequest(userId, userSession);
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
          console.log('response socket ggg dd', response)



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


  function connectionRequest(userId, userSession) {
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
    // console.log("symbolFilter2", symbolFilter2);
  }



  var tokenArrExcSeg = [];
  var AllToken = []


  const getSocketData = () => {
    axios({
      method: "get",
      url: 'https://api.smartalgo.in:3001/smartalgo/channel/alldata',
    }).then(res => {
      // console.log("res channel", res.data);

      // setApiAllRoundToken(res.data.all_round_token)

      // setApiAllRoundToken2(res.data.all_round_token.filter((item) => {
      //   if (item.symbol == "BANKNIFTY") {
      //     return item
      //   }
      // }))

      // res.data.all_round_token.map((val) => {
      //   AllToken.push(val.call_token)
      //   AllToken.push(val.put_token)
      // })
      //  runSocket(res.data.channel_list[0].first_channel, res.data.channel_list[0].second_channel, "")
      // alert(res.data.all_expiry[0].expiry)
      setExpirydateSelect(res.data.all_expiry)

      setApiChannelList(res.data.channel_list[0])
      setExpiryDate2(res.data.all_expiry[0].expiry)
      setApiStrikePrice(res.data.strike_price)
      // alert(expiryDate2)
      setExpiryOnChange(res.data.all_expiry[0].expiry)
      newApiForTokens(res.data.all_expiry[0].expiry)

    });
  }


  const newApiForTokens = (expiry) => {


    setOldChannel(filterChannel)


    // console.log("expiry inside", expiry);
    // console.log("expiryOnChange", expiryOnChange)

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
      //  console.log("new Channel list 1", response.data.openpositionchannel);
      console.log("new Channel list", response.data.channellist);
      console.log("new Channel first channel", response.data.firstchannel);


      //setApiAllRoundToken(response.data.all_round_token)
      setApiAllRoundToken2(response.data.all_round_token)
      channeSocket(response.data.firstchannel, response.data.channellist, currentChannel.current);
      currentChannel.current = response.data.channellist;
      setFilterChannel(response.data.channellist)




      // console.log("oldchannel list", oldChannel);
      // console.log("newwwwwwwwwwchannel list", response.data.channellist);
    })
      .catch(function (error) {
        console.log(error);
      });
  }



  //  console.log("cc",callToken)

  // console.log("AllToken",AllToken);
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

  const openPositionApi = () => {

    var config = {
      method: 'get',
      url: `${Config.base_url}openposition`
    };

    axios(config).then(function (response) {
      console.log("openpostionapihit", response.data.data);
      setOpenPositionData(response.data.data)


      var channelStr = ""
      response.data.data.forEach(element => {
        channelStr += "NFO|" + element.token + "#"
      });
      var alltokenchannellist = channelStr.substring(0, channelStr.length - 1);
      setOpenpossitionString(alltokenchannellist)

      // console.log("alltokenchannellist",alltokenchannellist)


    })
      .catch(function (error) {
        console.log(error);
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
    openPositionApi();
    getPanelKey();
    strategyDataApi()
    // newApiForTopkens()
    marginCalculator()
    getSocketData()
    GetNotification()


    // newApiForTopkens()
    // strategyDataApi()
    // strikePriceSendApi()
    // strikeprice()
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
    ///  console.log("channel_list", channel_list)
    //console.log("oldlist", oldlist)
    //console.log("sockets check channen socket", sockets)




    //alert(channel_list)

    if (sockets == null) {
      //alert('okkk')
      runSocket(firstchannel, channel_list)
    } else {



      //console.log("new channel listttt", channel_list);
      //console.log("old channel listttt", oldlist);
      //console.log("filter socket", sockets);

      // if (oldlist != undefined) {
      //   console.log('unsubscribe token', oldlist)
      //   //  alert("inside unscribe")
      //   // alert(oldlist)
      //   let json2 = {
      //     k: oldlist,
      //     t: "u",
      //   };

      //   sockets.send(JSON.stringify(json2));

      // }



      console.log('channel_list', channel_list)




      let json1 = {
        k: firstchannel + "#" + channel_list,
        t: "t",
      };

      console.log("current Channel ", json1)

      sockets.send(JSON.stringify(json1));
      sockets.onmessage = function (msg) {
        var response = JSON.parse(msg.data);

        // console.log("channel socket second",response)

        const banknifty = firstchannel.split('#')[0].split('|')[1];

        const nifty = firstchannel.split('#')[1].split('|')[1];


        if (banknifty == response.tk && response.lp != undefined) {
          setBankNiftyPriceShow(response.lp)
        }

        if (nifty == response.tk && response.lp != undefined) {
          setNiftyPriceShow(response.lp)
        }

        const old_val = $('.showdata'+response.tk).html();

        if (response.tk) {
          // console.log('response token filter', response)
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


            //   // $(".showdatapc" + response.tk).html(response.pc);
            // }

          } else {
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
          // alert(`2 [close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
          //   runSocket(firstchannel, channel_list)
        } else {
          // e.g. server process killed or network down
          // event.code is usually 1006 in this case
          //  alert('[close] Connection died');
          //    runSocket(firstchannel, channel_list)

        }
      };


      sockets.onerror = function (error) {
        //  alert(`[error]`);
        //   runSocket(firstchannel, channel_list)

      };

    }

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
        // console.log("ddddd iii - ", response.data.PanelKey[0].panel_key);
        setPanelKey(response.data.PanelKey[0].panel_key);

      })
      .catch(function (error) {
        console.log(error);
      });

  }


  var mytext = [];

  const makerequest = (option_type, type, symbol, expiry, token, ischecked, index) => {


    var pre_tag = {
      option_type: option_type,
      type: type,
      token: token,
      indexcallput: option_type + index,
      indexing: index
    };

  console.log("test" , pre_tag)




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

            console.log("symbol -", symbolRef.current)
            console.log("panelKey -", panelKey)
            console.log("expiry -", expiryOnChange)
            console.log("singleStrategy -", singleStrategy)
            console.log("token call-", element1.call_token)
            console.log("type-", element.type)
            console.log("strike price-", element1.strike_price)

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


          } else if (element.option_type == "PUT") {

            console.log("symbol -", symbolRef.current)
            console.log("panelKey -", panelKey)
            console.log("expiry -", expiryOnChange)
            console.log("singleStrategy -", singleStrategy)
            console.log("token put-", element1.put_token)
            console.log("type-", element.type)
            console.log("strike price-", element1.strike_price)

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

            console.log("symbol -", symbolRef.current)
            console.log("panelKey -", panelKey)
            console.log("expiry -", expiryOnChange)
            console.log("singleStrategy -", singleStrategy)
            console.log("token call-", element1.call_token)
            console.log("type-", element.type)
            console.log("strike price-", element1.strike_price)

            // var price;
            // var price_get = $(".showdata" + element1.call_token).html();
            // if (price_get == "") {
            //   price = "100";
            // } else {
            //   price = $(".showdata" + element1.call_token).html();
            // }

            // alert(price)

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

            console.log("symbol -", symbolRef.current)
            console.log("panelKey -", panelKey)
            console.log("expiry -", expiryOnChange)
            console.log("singleStrategy -", singleStrategy)
            console.log("token put-", element1.put_token)
            console.log("type-", element.type)
            console.log("strike price-", element1.strike_price)

            // var price;
            // var price_get = $(".showdata" + element1.put_token).html();
            // // alert(price_get);
            // if (price_get == "") {
            //   price = "100";
            // } else {
            //   price = $(".showdata" + element1.put_token).html();
            // }



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

    console.log("request", request)



    // return
    var config = {
      method: 'post',
      url: `${Config.broker_signal_url}`,
      headers: {
        'Content-Type': 'text/plain'
      },
      data: request
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setShowAlert(true);
        setTextAlert("Trade Executed Successfully");
        setAlertColor("success");
        getSocketData();
        setDisabled(false)
        setRefreshscreen(!refreshscreen);
        //   console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });



  }


  // const lese = (value) => {
  //   if (value == "LE") {
  //     return "BUY"
  //   }
  //   if (value == "SE") {
  //     return "SELL"
  //   }
  // }


  const customStyles = {


    headRow: {
      style: {
        borderTopStyle: 'solid',
        borderTopWidth: '1px',
        borderTopColor: "#e9ecf0",
      },
    },
    headCells: {
      style: {
        fontWeight: '400',
        fontSize: "12px",
        // margin:' 19px 0px',
        background: '#d9ecff',

        color: '#607D8B',
        '&:not(:last-of-type)': {
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: '#e9ecf0',
        },
      },
    },
    cells: {
      style: {
        '&:not(:last-of-type)': {
          fontWeight: '400',
          fontSize: "12px",

          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: '#e9ecf0',
        },
      },
    },
  };

  // const columns = [
  //   {
  //     name: <h6>S.No</h6>,
  //     selector: (row, index) => index + 1,
  //     width: '60px !important',
  //   },
  //   {
  //     name: <h6>Symbol</h6>,
  //     selector: (row) => row.tradesymbol,
  //     width: '220px !important',
  //   },
  //   {
  //     name: <h6>TXN</h6>,
  //     selector: (row) => lese(row.type),
  //     width: '90px !important',
  //   },
  //   {
  //     name: <h6>Executed Price</h6>,
  //     selector: (row) => row.executed_price,
  //     width: '110px !important',
  //   },
  //   {
  //     name: <h6>LP Price</h6>,
  //     selector: (row) => (
  //       <span className={"showdataEP" + row.token}></span>
  //     ),
  //     width: '110px !important',
  //   },
  //   {
  //     name: <h6>SLP</h6>,
  //     // width:"50px",
  //     selector: (row) => (<> <input className="hidebg" type="number" defaultValue={row.stoploss_price} onChange={(e) => inputStopLossPrices(e, row)} width={"20px"} /></>),
  //     width: '80px !important',
  //   },
  //   {
  //     name: <h6>TP</h6>,
  //     // width:"50px",
  //     selector: (row) => (<> <input className="hidebg" type="number" defaultValue={row.target_price} onChange={(e) => inputTargetPrices(e, row)} width={"20px"} /></>),
  //     width: '80px !important',
  //   },
  //   {
  //     name: <h6>P/L</h6>,
  //     selector: (row) => (
  //       <span style={{ color: colorProfitLossOpenPosition(profiLoss(row.token, row.executed_price, row.type, row.stoploss_price, row.target_price)) }}>{profiLoss(row.token, row.executed_price, row.type, row.stoploss_price, row.target_price)}</span>
  //     ),
  //     width: '110px !important',
  //   },
  //   {
  //     name: <h6>Time</h6>,
  //     selector: (row) => dateFormate(row.created_at),
  //     width: '180px !important',
  //   },
  //   {
  //     name: <h6>Qty</h6>,
  //     selector: (row) => row.entry_qty,
  //     width: '60px !important',
  //   },
  //   {
  //     name: <h6>Actions</h6>,
  //     width: '130px !important',
  //     selector: (row) => (
  //       <>
  //         <button
  //           className="btn btn-success btn-new-block"
  //           onClick={() => squareoff_single_show_modal(row)}
  //         >
  //           Square Off
  //         </button>
  //       </>
  //     ),
  //   },
  // ];


  // const inputStopLossPrices = (e, row) => {

  //   console.log("row - ", row);

  //   var pre_tag = {
  //     id: row.id,
  //     StopLossPrice: e.target.value,
  //     TargetPrice: "NOTSET",
  //     token: row.token,
  //     type: row.type,
  //     input_symbol: row.input_symbol,
  //     strike_price: row.strike_price,
  //     option_type: row.option_type,
  //     expiry: row.expiry,
  //     strategy_tag: row.strategy_tag,
  //     entry_trade_id: row.id,
  //     tradesymbol: row.tradesymbol

  //   };

  //   setStopLossPriceUpdate(oldValues => {
  //     return oldValues.filter(item => item.id !== row.id)
  //   })

  //   setStopLossPriceUpdate((oldArray) => [pre_tag, ...oldArray]);
  // }



  // const inputTargetPrices = (e, row) => {

  //   var pre_tag = {
  //     id: row.id,
  //     TargetPrice: e.target.value,
  //     StopLossPrice: "NOTSET",
  //     token: row.token,
  //     type: row.type,
  //     input_symbol: row.input_symbol,
  //     strike_price: row.strike_price,
  //     option_type: row.option_type,
  //     expiry: row.expiry,
  //     strategy_tag: row.strategy_tag,
  //     entry_trade_id: row.id,
  //     tradesymbol: row.tradesymbol
  //   };

  //   setTargetPriceUpdate(oldValues => {
  //     return oldValues.filter(item => item.id !== row.id)
  //   })

  //   setTargetPriceUpdate((oldArray) => [pre_tag, ...oldArray]);
  // }


  //console.log("target price",targetPriceUpdate)
  //console.log("stop loss price",stopLossPriceUpdate)

  // const UpadteStopLossAndTarget = () => {
  //   //alert("okk")

  //   if (stopLossPriceUpdate.length > 0) {
  //     // alert("stopLossPriceUpdate")
  //     UpadteStopLossAndTargetApi('stoploss', stopLossPriceUpdate)
  //   }


  //   if (targetPriceUpdate.length > 0) {
  //     // alert("targetPriceUpdate")
  //     UpadteStopLossAndTargetApi('target', targetPriceUpdate)

  //   }


  // }


  // function UpadteStopLossAndTargetApi(condition, priceArray) {


  //   var data = JSON.stringify({
  //     "condition": condition,
  //     "priceArray": priceArray
  //   });

  //   var config = {
  //     method: 'post',
  //     url: `${Config.base_url}UpdateStopLossAndTargetPrice`,
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     data: data
  //   };

  //   axios(config)
  //     .then(function (response) {
  //       console.log("dd", response.data.status);
  //       if (response.data.status == true) {

  //         setShowAlert(true);
  //         setTextAlert("Price Updated Successfully");
  //         setAlertColor("success");
  //         setStopLossPriceUpdate([]);
  //         setTargetPriceUpdate([]);
  //         setRefreshscreen(!refreshscreen);

  //       }
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });


  // }













  // function profiLoss(token, excute_price, type, StopLossPrice, TargetPrice) {




  //   var exit_price = $('.showdataEP' + token).html();




  //   //console.log("exit_price", exit_price);


  //   if (exit_price != "") {







  //     // if(TargetPrice > 0){
  //     //   //console.log("showdata TargetPrice ffffff",TargetPrice);
  //     //   console.log("type",type);

  //     //   if (type == "LE") {        
  //     //     if (parseFloat(exit_price) > parseFloat(TargetPrice)) {
  //     //      // alert("okk")
  //     //       setRefreshscreen(!refreshscreen);
  //     //     }

  //     //   }  
  //     //   else if(type == "SE"){
  //     //     if (parseFloat(exit_price) < parseFloat(TargetPrice)) {
  //     //    //   alert("okk")
  //     //       setRefreshscreen(!refreshscreen);
  //     //     }
  //     //   }

  //     // }





  //     // if(StopLossPrice > 0){
  //     //  // console.log("showdata StopLossPrice ffffff",StopLossPrice);
  //     //   console.log("type",type);

  //     //   if (type == "LE") {        
  //     //     if (parseFloat(exit_price) < parseFloat(StopLossPrice)) {
  //     //     //  alert("okk")
  //     //       setRefreshscreen(!refreshscreen);
  //     //     }

  //     //   }  
  //     //   else if(type == "SE"){
  //     //     if (parseFloat(exit_price) > parseFloat(StopLossPrice)) {
  //     //    //   alert("okk")
  //     //       setRefreshscreen(!refreshscreen);

  //     //     }
  //     //   }


  //     // }



  //   }



  //   if (type == "LE") {
  //     return (parseFloat(exit_price) - parseFloat(excute_price)).toFixed(2)
  //   } else if (type == "SE") {
  //     return (parseFloat(excute_price) - parseFloat(exit_price)).toFixed(2)
  //   }

  // }

  // function colorProfitLossOpenPosition(val) {

  //   if (val > 0) {
  //     return "green";
  //   } else if (val < 0) {
  //     return "red";
  //   } else if (val == 0) {
  //     return "black";

  //   }


  // }


  const squareoff_single_show_modal = (row) => {


    if (adminTradingType == "" || sockets == null) {
      alert("Please login with broker Account")
      return
    }



    //  alert("okk")
    var Transactions = "";
    var type = "";
    if (row.type == "LE") {
      type = "LX";
      Transactions = "BUY";
    }
    else if (row.type == "SE") {
      type = "SX";
      Transactions = "SELL";
    }

    var tradesymbol = row.tradesymbol + "   -   " + Transactions;
    setSingleSquareOfModalShow(tradesymbol)
    setSingleSquareOfModalShowGetRow(row)
    setShowSingleSquareOff(true)


  }


  const SingleSquareOff = (row) => {
    squareoff_single(row);
    setShowSingleSquareOff(false)

  }

  const squareoff_single = (row) => {
    // console.log("row ", row)
    var type = "";
    if (row.type == "LE") {
      type = "LX";
    }
    else if (row.type == "SE") {
      type = "SX";
    }


    var price;
    var price_get = $(".showdata" + row.token).html();
    // alert(price_get);
    if (price_get == "" || price_get == undefined) {
      price = row.executed_price;
    } else {
      price = $(".showdataEP" + row.token).html();
    }



    var request = "id:12@@@@@input_symbol:" + row.input_symbol + "@@@@@type:" + type + "@@@@@price:" + price + "@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:" + panelKey + "@@@@@exchange:NFO@@@@@product_type:MIS@@@@@strike:" + row.strike_price + "@@@@@segment:O@@@@@option_type:" + row.option_type + "@@@@@expiry:" + row.expiry + "@@@@@strategy:" + row.strategy_tag + "@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@token:" + row.token + "@@@@@entry_trade_id:" + row.id + "@@@@@tradesymbol:" + row.tradesymbol + "@@@@@chain:option_chain@@@@@by_side:OPTIONCHAIN@@@@@demo:demo";

    var data = request
    console.log("exit trade ", data);

    //return

    var config = {
      method: 'post',
      url: `${Config.broker_signal_url}`,
      headers: {
        'Content-Type': 'text/plain'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        //  console.log(JSON.stringify(response.data));
        //   console.log(JSON.stringify(response.data));
        // navigate("/admin/executivetrade")
        setShowAlert(true);
        setTextAlert("Trade Exited Successfully");
        setAlertColor("success");
        setDisabled(false)
        setOpenPositionData("")
        window.location.reload();
        setRefreshscreen(!refreshscreen);

      })
      .catch(function (error) {
        console.log(error);
      });



  }

  // const selectSquareOffSignal = ({ selectedRows }) => {
  //   setSelectRowArray(selectedRows);
  // };



  // const selectAllSquareOff_show_modal = () => {

  //   if (adminTradingType == "" || sockets == null) {
  //     alert("Please login with broker Account")
  //     return
  //   }

  //   if (selectRowArray.length > 0) {
  //     var tradesymbol_array = [];
  //     selectRowArray.forEach(row => {

  //       var Transactions = "";
  //       var type = "";
  //       if (row.type == "LE") {
  //         type = "LX";
  //         Transactions = "BUY";
  //       }
  //       else if (row.type == "SE") {
  //         type = "SX";
  //         Transactions = "SELL";
  //       }

  //       var tradesymbol = row.tradesymbol + "   -   " + Transactions;
  //       tradesymbol_array.push(tradesymbol)
  //     });
  //     setAllSquareOfModalShow(tradesymbol_array)
  //     setShowAllSquareOff(true)
  //   } else {
  //     setShowAlert(true);
  //     setTextAlert("Please Select Stocks");
  //     setAlertColor("warning");
  //   }
  // }


  const selectAllSquareOff = () => {
    console.log("selectRowArray", selectRowArray)
    console.log("selectRowArray length", selectRowArray.length)



    if (selectRowArray.length > 0) {

      selectRowArray.forEach(row => {
        // console.log("ele -",row.id)
        var type = "";
        if (row.type == "LE") {
          type = "LX";
        }
        else if (row.type == "SE") {
          type = "SX";
        }


        var price;
        var price_get = $(".showdata" + row.token).html();
        // alert(price_get);
        if (price_get == "" || price_get == undefined) {
          price = row.executed_price;
        } else {
          price = $(".showdataEP" + row.token).html();
        }

        var request = "id:12@@@@@input_symbol:" + row.input_symbol + "@@@@@type:" + type + "@@@@@price:" + price + "@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:" + panelKey + "@@@@@exchange:NFO@@@@@product_type:MIS@@@@@strike:" + row.strike_price + "@@@@@segment:O@@@@@option_type:" + row.option_type + "@@@@@expiry:" + row.expiry + "@@@@@strategy:" + row.strategy_tag + "@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@token:" + row.token + "@@@@@entry_trade_id:" + row.id + "@@@@@tradesymbol:" + row.tradesymbol + "@@@@@chain:option_chain@@@@@by_side:OPTIONCHAIN@@@@@demo:demo";

        console.log("exit trade", request)


        // return

        var data = request
        // console.log("exit trade ", data);
        var config = {
          method: 'post',
          url: `${Config.broker_signal_url}`,
          headers: {
            'Content-Type': 'text/plain'
          },
          data: data
        };

        axios(config)
          .then(function (response) {

            //  console.log(JSON.stringify(response.data));
            //   console.log(JSON.stringify(response.data));
            setShowAlert(true);
            setTextAlert("Trade Exited Successfully");
            setAlertColor("success");
            setDisabled(false)
            setOpenPositionData("")
            window.location.reload();
            setRefreshscreen(!refreshscreen);
            // navigate("/admin/executivetrade")
          })
          .catch(function (error) {
            console.log(error);
          });


      });
      setShowAllSquareOff(false)



    } else {

      setShowAlert(true);
      setTextAlert("Please Select Stocks");
      setAlertColor("warning");

    }


  }






  function colorset(token) {

    var val = $(".showdatapc" + token).html();

    //console.log("val - ",val)

    if (val > 0) {
      return "green"
    } else if (val < 0) {
      return "red";
    } else if (val == 0) {
      return "black";
    }
  }


  // TokenAndClientCode();

  // function TokenAndClientCode() {
  //   // alert("okk");

  //   var config = {
  //     method: "get",
  //     url: `${Config.base_url}api/alicebluetoken`,
  //     headers: {},
  //   };


  //   axios(config)
  //     .then(function (response) {
  //      console.log("shakir response ", response.data.status);
  //       if (response.data.status == "true") {
  //         //  console.log('Token Available', response.data.data[0].client_code + '  ' + response.data.data[0].access_token);
  //         //setSocketuserid(response.data.data[0].client_code);
  //        // setSocketuserSession(response.data.data[0].access_token);

  //         // invalidateSession(
  //         //   response.data.data[0].client_code,
  //         //   response.data.data[0].access_token
  //         // );

  //       } else {
  //         //  console.log('Token Not Available');
  //       }
  //     })
  //     .catch(function (error) {
  //       // console.log(error);
  //     });
  // }




  // $(".showdata").html("Hello <b>world</b>!");

  const Brokertoggle = (e, admiintokendetails) => {

    // console.log("admiintokendetails ", admiintokendetails[0].client_code)
    if (e.target.checked == true) {

      if (admiintokendetails[0].broker == 1) {

        window.location.href = "https://a3.aliceblueonline.com/?appcode=" + admiintokendetails[0].app_id;

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

  //console.log("secretKeyAlice", secretKeyAlice);
  //console.log("appIdAlice", appIdAlice);

  const handleCloseAliceModal = () => {
    setSecretKeyAlice("")
    //setAppIdAlice("")
    // setRefreshscreen(!refreshscreen);
    setShowAliceModal(false)
  };

  const handleShowAliceModal = () => {
    //  setSecretKeyAlice("")
    // setAppIdAlice("")
    setShowAliceModal(true)
  };


  const UpdateBrokerKey = () => {
    //alert(appIdAlice)
    //  alert(secretKeyAlice)

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



  // -----------------------------------------

  // const updateExcutiveStatus = () => {

  //   var config = {
  //     method: 'get',
  //     url: `${Config.base_url}TargetstoplosStutus`,
  //     headers: {
  //       'x-access-token': admin_token,
  //       'Content-Type': 'application/json'
  //     },
  //   };

  //   axios(config)
  //     .then(function (response) {
  //       // console.log("hello ", response);
  //       setRefreshscreen(!refreshscreen);

  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // }

  // setInterval(() => {

  //   var config = {
  //     method: 'get',
  //     url: `${Config.base_url}TargetstoplosStutus`,
  //     headers: {
  //       'x-access-token': admin_token,
  //       'Content-Type': 'application/json'
  //     },
  //   };

  //   axios(config)
  //     .then(function (response) {
  //       // console.log("hello ", response);
  //       setRefreshscreen(!refreshscreen);

  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });


  // }, 3000);

  // useEffect(() => {

  //   const seconds = setInterval(updateExcutiveStatus(), 3000);
  //   return clearInterval(seconds)


  // }, [])

  // -----------------------------------------

  // var urls = Config.base_url;
  // console.log("gggg",urls)
  // const socket11 = socketIOClient('https://api.smartalgo.in:3001/');
  // socket11.on("executed_trade_broadcast", (data) => {
  // //  alert(data.symbol)
  //   console.log("data", data.symbol);
  //   // console.log("res_pendingwithdraw_accept_message", data);
  // });

console.log("requestSiginals" ,requestSiginals)
  return (
    <>

      <div className='manual'>
        <div className='content'>
          <div className='card-dark'>
            <div className="col-md-12">
              <div className="">
                {/* <div className="card-header">
                  <div className="row align-items-center">
                    <div className="col-md-12">
                      <h4 className="card-title font text-light">Executive Trade</h4>
                    </div> */}
                   
                  {/* </div>
                </div> */}

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
                    <div className="col-md-12 text-end">
                      <button type="button" onClick={() => handleShowAliceModal()} class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                        Set Key
                      </button>
                    </div>
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
{/* for testing ---------------------------------------------------------------------- */}
                              {/* <b>Buy/Sell</b> */}
                              {/* <div className="d-flex">
                              <div class="buttons mx-auto" >
                                <button class="button1_buy is-success">Buy</button>
                              </div>
                              <div class="buttons_sell mx-auto">
                                <button class="button1_sell is-success">Sell</button>
                              </div>
                                </div> */}
{/* for testing ---------------------------------------------------------------------- */}
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
                              {/* <option value="">Buy/Sell</option>
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


      {/*  Open Position  */}

      {/* <div className='manual'>
      <div className='content pt-0'>
        <div className='card-dark'>

      <div className="row">
          <div className="col-md-12">
              <div className="card-header">
                <h4 className="card-title font text-light">Open Position</h4>
              </div>
              <div className="card-body">
                <div className="row">
                </div>
                <div className="row">
                  <div>
                  
                    <button className='btn btn-info float-end' onClick={() => navigate("/manual/manualclosepositions")}>CLOSE POSITION</button>
                    <button className='btn btn-success float-end' onClick={() => selectAllSquareOff_show_modal()}>SQUARE OFF</button>
                  </div>
                  <div>

                    <button className='btn btn-success float-end' onClick={() => UpadteStopLossAndTarget()}> UPDATE STOPLOSS AND TARGET PRICE</button>

                  </div>

                  <div>

                  </div>
                </div>
                <div className="row d-flex justify-content-end">
                  <div className="card-body">
                    <div className="table-responsive">

                      <DataTableExtensions
                        columns={columns}
                        data={openPositionData}
                        export={false}
                        print={false}
                      >
                        <DataTable
                          fixedHeader
                          fixedHeaderScrollHeight="700px"
                          noHeader
                          defaultSortField="id"
                          defaultSortAsc={false}
                          // pagination
                          selectableRows
                          onSelectedRowsChange={selectSquareOffSignal}
                          customStyles={customStyles}
                          highlightOnHover
                        // paginationRowsPerPageOptions={[10, 50, 100]}
                        // paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: 'All' }}
                        />
                      </DataTableExtensions>
                    </div>
                  </div>
                </div>
          </div>
            </div>
          </div>
            </div>
          </div>

          


          <Modal show={showAllSquareOff} onHide={AllSquareOffClose}>
            <Modal.Header closeButton>
              <Modal.Title>Stock Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {

                allSquareOfModalShow?.map((item) => {
                  return <>
                    <p>{item}</p></>
                })

              }

            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={AllSquareOffClose}>
                Close
              </Button>
              <button className="btn btn-primary" variant="primary" disabled={disabled} onClick={() => { selectAllSquareOff(); handleClickDisabled() }}>Done</button>
            </Modal.Footer>
          </Modal>


          <Modal show={showSingleSquareOff} onHide={SingleSquareOffClose}>
            <Modal.Header closeButton>
              <Modal.Title>Stock Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {


                <p>{singleSquareOfModalShow}</p>

              }

            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={SingleSquareOffClose}>
                Close
              </Button>
              <button className="btn btn-primary" variant="primary" disabled={disabled} onClick={() => { SingleSquareOff(singleSquareOfModalShowGetRow); handleClickDisabled() }}>Done</button>
            </Modal.Footer>
          </Modal>



        </div> */}


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
          <p>https://a3.aliceblueonline.com/?appcode=G9EOSWCEIF9ARCB</p>
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