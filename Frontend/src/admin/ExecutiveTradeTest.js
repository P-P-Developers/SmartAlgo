// import React, { useEffect, useMemo, useState, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import ExecutiveFilters from "./ExecutiveFilters";
// import { Alert, Form, Row } from "react-bootstrap";
// import { NavLink } from "react-router-dom";
// import * as Config from "../common/Config";
// import AlertToast from "../common/AlertToast";
// import Backdrop from '@mui/material/Backdrop';
// import * as Constant from "../common/ConstantMessage";
// import CircularProgress from '@mui/material/CircularProgress';
// import DataTable from "react-data-table-component";
// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';
// import { TextField } from '@mui/material';
// import DataTableExtensions from "react-data-table-component-extensions";
// import $ from "jquery";
// import CryptoJS from "crypto-js";
// import { dateFormate } from "../common/CommonDateFormate";
// import { inputAdornmentClasses } from "@mui/material";
// import { fontWeight } from "@mui/system";



// function ExecutiveTrade(e) {

//   const [getSymbolsFilter, setGetSymbolsFilter] = useState([])
//   const [showStrikePrice, setShowStrikePrice] = useState([])
//   const [thisMonthSymbols, setThisMonthSymbols] = useState([])
//   const [Bankniftyprint, setBankniftyprint] = useState('')
//   const [Niftyprint, setniftyprint] = useState('')
//   const [channelShow, setChannelShow] = useState("")
//   const admin_token = localStorage.getItem("token");
//   const [makeChannelData, setMakeChannelData] = useState("")
//   //---------SOCKET----------------
//   const [bankNiftyPriceShow, setBankNiftyPriceShow] = useState("")
//   const [niftyPriceShow, setNiftyPriceShow] = useState("")
//   const [bankNiftyStrikePrice, setBankNiftyStrikePrice] = useState([])
//   const [niftyStrikePrice, setNiftyStrikePrice] = useState([])
//   const [socketPriceShow, setSocketPriceShow] = useState([])
//   const [strategy_data, setStrategy_data] = useState([]);
//   const [refreshscreen, setRefreshscreen] = useState(false);
//   //    API Data States
//   const [apiAllRoundToken, setApiAllRoundToken] = useState([])
//   const [apiAllRoundToken2, setApiAllRoundToken2] = useState([])
//   const [apiChannelList, setApiChannelList] = useState([])
//   const [apiStrikePrice, setApiStrikePrice] = useState([])
//   const [arrayobject, setArrayobject] = useState([]);
//   const [tokenAndPrice, setTokenAndPrice] = useState([])
//   const [sockets, setSockets] = useState(null);
//   const [sss, setSss] = useState("");
//   const [responseSocket, setResponseSocket] = useState([])
//   const [responseResult, setResponseResult] = useState([])
//   const [callToken, setCallToken] = useState([])
//   const [putToken, setPutToken] = useState([])
//   const [listDataExcSeg, setListDataExcSeg] = useState([]);
//   const [stratValue, setStratValue] = useState("")
//   const [valChecked, setValChecked] = useState("")
//   const [expirydateSelect, setExpirydateSelect] = useState([])
//   // console.log("expirydateSelect", expirydateSelect);
//   const [expiryOnChange, setExpiryOnChange] = useState("")
//   const [getLastDate, setGetLastDate] = useState("")
//   const [singleStrategy, setSingleStrategy] = useState("")
//   const [requestSiginals, setRequestSiginals] = useState([])
//   const [panelKey, setPanelKey] = useState("")
//   const [openPositionData, setOpenPositionData] = useState([])
//   const [selectRowArray, setSelectRowArray] = useState([])
//   const [tags1, setTags] = useState([]);

//   const [symbolFilter2, setSymbolFilter2] = useState("")
//   const [expiryDate2, setExpiryDate2] = useState("")
//   const [filterChannel, setFilterChannel] = useState("")
//   const [oldChannel, setOldChannel] = useState("")
//   // console.log("oldChannel", oldChannel);


//   const uniqueArr = [...new Set(getSymbolsFilter.map((item) => (item.name)))];
//   const thismonthdate = new Date().toString();
//   const gettingThisMonth = thismonthdate.split(" ")[1].toUpperCase()
//   const getDatetoken = new Date()
//   const gettingdatetoken = getDatetoken.toTimeString()
//   const splittime = gettingdatetoken.split(" ")[0]
//   const navigate = useNavigate()

//   const [bankNiftyToken, setBankNiftyToken] = useState("")
//   const [niftyToken, setNiftyToken] = useState("")

//   // AlertToast
//   const [showAlert, setShowAlert] = useState(false);
//   const [textAlert, setTextAlert] = useState("");
//   const [alertColor, setAlertColor] = useState("");

//   // model 
//   const [show, setShow] = useState(false);
//   const [trdaesymbolArrayList, setTrdaesymbolArrayList] = useState([]);
//   const handleClose = () => setShow(false);
//   // model 




//   // modal All square Off
//   const [showAllSquareOff, setShowAllSquareOff] = useState(false);
//   const AllSquareOffClose = () => setShowAllSquareOff(false);
//   const [allSquareOfModalShow, setAllSquareOfModalShow] = useState([]);
//   //


//   // modal Single square Off
//   const [showSingleSquareOff, setShowSingleSquareOff] = useState(false);
//   const SingleSquareOffClose = () => setShowSingleSquareOff(false);
//   const [singleSquareOfModalShow, setSingleSquareOfModalShow] = useState();
//   const [singleSquareOfModalShowGetRow, setSingleSquareOfModalShowGetRow] = useState(null);



//   //



//   const [getTokenTradingApiDetails, setGetTokenTradingApiDetails] = useState([]);
//   //console.log("getTokenTradingApiDetails",getTokenTradingApiDetails);
//   const [openpossitionString, setOpenpossitionString] = useState("");
//   const [adminTradingType, setAdminTradingType] = useState("");

//   console.log("trading ---- ", adminTradingType);
//   console.log("trading ---- ", typeof adminTradingType);


//   const [buySell, setBuySell] = useState("");
//   //  console.log("buySell",buySell);
//   const currentChannel = useRef()

//   const symbolRef = useRef("BANKNIFTY");
//   // const expiryRef = useRef("BANKNIFTY");
//   // console.log("symbol", symbolRef);

//   const onAlertClose = e => {
//     setShowAlert(false);
//   }


//   const marginCalculator = () => {
//    // alert("okkk")
//     var config = {
//       method: 'get',
//       url: 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json',
//     };
//     var abc = []
//     axios(config)
//       .then(function (response) {
//         var channelstr = ""
//         response.data.forEach(function (element) {
//           if ((element.instrumenttype == 'FUTIDX' && element.exch_seg == "NFO")) {
//             if (element.name == 'BANKNIFTY' || element.name == 'NIFTY') {

//             //  if (element.expiry.toString().includes(gettingThisMonth)) {

//                 setGetLastDate(element.expiry)
//                 channelstr += element.exch_seg + "|" + element.token + "#"
//                 if (element.name == "BANKNIFTY") {

//                  // console.log("token BANKNIFTY - ",element.token);
//                 //  console.log("token BANKNIFTY expiry - ",element.expiry);
//                   setBankNiftyToken(element.token)
//                 } else if (element.name == "NIFTY") {
//                 //  console.log("token NIFTY - ",element.token);
//                  // console.log("token NIFTY  expiry- ",element.expiry);


//                   setNiftyToken(element.token)
//                 }
//              // }
//             }
//           }
//         });

//         var alltokenchannellist = channelstr.substring(0, channelstr.length - 1);
//         setMakeChannelData(alltokenchannellist)

//       })
//       .catch(function (error_broker) {
//         console.log('error_broker -', error_broker);
//       });
//   }



//   var BASEURL = "https://a3.aliceblueonline.com/rest/AliceBlueAPIService/";
//   let AuthorizationToken;
//   let type = "API";

//   const runSocket = (first_channel, second_channel, openpositionchannel) => {

//     // var userId = "788925";
//     // var userSession = "pngllcaJWE1ArEgNx1g4aR1LpBuqNA7regzpstuu1NZrG7nvpEqKVf2uJ3DgEnoNVuLAxrJOHAfnurqx1d7jLWneYpFk75h6NVRClEgPhO2S2Ev0aMrNrpDdTnUptx222SI7gYObu5gsq1oVMKrVX7nZa3klZQfYWjWFe6ETnei2JJHdxJHT4iiG0VV3sSGHaid37Vlbv2WBVBj30y3jjciJYilNUyhmtrH2aozPqaH4jj6mQrRs9u2D1MTJACxG";

//     console.log("running");

//     var config = {
//       method: "get",
//       url: `${Config.base_url}api/alicebluetoken`,
//       headers: {},
//     };


//     axios(config)
//       .then(function (response) {
//         console.log("shakir response ", response.data.status);
//         if (response.data.status == "true") {

//           // invalidateSession(
//           //   response.data.data[0].client_code,
//           //   response.data.data[0].access_token
//           // );
//           invalidateSession(response.data.data[0].client_code, response.data.data[0].access_token, first_channel, second_channel, openpositionchannel);

//         } else {
//           console.log('Token Not Available');
//         }
//       })
//       .catch(function (error) {
//         // console.log(error);
//       });









//     //  invalidateSession(userId, userSession, first_channel, second_channel, openpositionchannel);
//   }

//   function invalidateSession(userId, userSession, first_channel, second_channel, openpositionchannel) {
//     //alert(userId);

//     AuthorizationToken = "Bearer " + userId + " " + userSession;
//     //console.log('AuthorizationToken',AuthorizationToken);
//     let jsonObj = {
//       loginType: type,
//     };
//     $.ajax({
//       url: BASEURL + "api/ws/invalidateSocketSess",
//       headers: {
//         Authorization: AuthorizationToken,
//       },
//       type: "post",
//       data: JSON.stringify(jsonObj),
//       contentType: "application/json",
//       dataType: "json",
//       async: false,
//       success: function (msg) {
//         var data = JSON.stringify(msg);

//         if (msg.stat === "Ok") {
//           createSession(userId, userSession, first_channel, second_channel, openpositionchannel);
//         }
//       },
//     });
//   }

//   function createSession(userId, userSession, first_channel, second_channel, openpositionchannel) {
//     //alert('create session')
//     AuthorizationToken = "Bearer " + userId + " " + userSession;
//     //console.log('AuthorizationToken cratesession',AuthorizationToken);

//     let jsonObj = {
//       loginType: type,
//     };
//     $.ajax({
//       url: BASEURL + "api/ws/createSocketSess",
//       headers: {
//         Authorization: AuthorizationToken,
//       },
//       type: "post",
//       data: JSON.stringify(jsonObj),
//       contentType: "application/json",
//       dataType: "json",
//       async: false,
//       success: function (msg) {
//         var data = JSON.stringify(msg);
//         if (msg.stat === "Ok") {
//           connect(userId, userSession, first_channel, second_channel, openpositionchannel);
//         } else {
//           alert(msg);
//         }
//       },
//     });
//   }

//   var bankniftypushaccdec = []
//   var niftypushaccdec = []
//   var responseArray = [];
//   var socketPricearr = []


//   const url = "wss://ws1.aliceblueonline.com/NorenWS/";
//   let socket;

//   function connect(userId, userSession, first_channel, second_channel, openpositionchannel) {
  
//     socket = new WebSocket(url);
//     socket.onopen = function () {
//       //  alert("socket open");
//       console.log("openpossition string", openpositionchannel);
//       console.log("socket running");
//       connectionRequest(userId, userSession, first_channel, second_channel);
//       setSockets(socket)
//       //  console.log("socket connect ",sockets);

//     };

//     socket.onmessage = function (msg) {
//       var response = JSON.parse(msg.data);

//       // console.log("response", response)

//       if (response.s == "OK") {
//         console.log("second inside ");

//         let json = {
//           k: "NFO|48756#NFO|48757#" + second_channel + "#" + openpositionchannel,
//           t: "t",
//         };
//         socket.send(JSON.stringify(json));







//         // let json1 = {
//         //   k: second_channel,
//         //   t: "t",
//         // };

//         // socket.send(JSON.stringify(json1));



//         socket.onmessage = function (msg) {
//           var response = JSON.parse(msg.data);

//           // console.log("response", response);
//           // console.log('response socket ggg', response)



//           if ("48756" == response.tk && response.lp != undefined) {
//             setBankNiftyPriceShow(response.lp)
//           }

//           if ("48757" == response.tk && response.lp != undefined) {
//             setNiftyPriceShow(response.lp)
//           }


//           if (response.tk) {
//             //console.log('response token', response.pc)
//             if (response.lp != undefined) {
//               $(".showdata" + response.tk).html(response.lp);
//               $(".showdataEP" + response.tk).html(response.lp);


//             } else {
//               $(".showdata" + response.tk).html(response.c);
//               $(".showdataEP" + response.tk).html(response.lp);
//             }



//             if (response.pc != undefined) {
//               //console.log(" showdatapc -- ",response.pc)
//               $(".showdatapc" + response.tk).val(response.pc);
//               //$(".showdatatest" + response.tk).html(response.pc);

//             }



//           }

//         };

//       }
//     };
//   }

//   // $(".showdataEP").html("shakir");


//   function connectionRequest(userId, userSession) {
//     var encrcptToken = CryptoJS.SHA256(
//       CryptoJS.SHA256(userSession).toString()
//     ).toString();
//     // alert(encrcptToken);
//     var initCon = {
//       susertoken: encrcptToken,
//       t: "c",
//       actid: userId + "_" + type,
//       uid: userId + "_" + type,
//       source: type,
//     };
//     console.log('initCon', JSON.stringify(initCon));
//     socket.send(JSON.stringify(initCon));
//   }


//   // console.log("tags1 -- ", tags1 && tags1)

//   const SymbolsFilter = (e, expiry) => {
//     // alert(e.target.value)
//     // setSymbolFilter2(e.target.value)
//     symbolRef.current = e.target.value;
//     if (e.target.value != "") {
//       newApiForTokens(expiry = "")
//     }
//     // console.log("symbolFilter2", symbolFilter2);
//   }



//   var tokenArrExcSeg = [];
//   var AllToken = []


//   const getSocketData = () => {
//     axios({
//       method: "get",
//       url: `${Config.base_url}smartalgo/channel/alldata`,
//     }).then(res => {
//       // console.log("res channel", res.data);

//       // setApiAllRoundToken(res.data.all_round_token)

//       // setApiAllRoundToken2(res.data.all_round_token.filter((item) => {
//       //   if (item.symbol == "BANKNIFTY") {
//       //     return item
//       //   }
//       // }))

//       // res.data.all_round_token.map((val) => {
//       //   AllToken.push(val.call_token)
//       //   AllToken.push(val.put_token)
//       // })
//       //  runSocket(res.data.channel_list[0].first_channel, res.data.channel_list[0].second_channel, "")
//       // alert(res.data.all_expiry[0].expiry)
//       setExpirydateSelect(res.data.all_expiry)
//       setApiChannelList(res.data.channel_list[0])
//       setExpiryDate2(res.data.all_expiry[0].expiry)
//       setApiStrikePrice(res.data.strike_price)
//       // alert(expiryDate2)
//       setExpiryOnChange(res.data.all_expiry[0].expiry)
//       newApiForTokens(res.data.all_expiry[0].expiry)

//     });
//   }


//   const newApiForTokens = (expiry) => {


//     setOldChannel(filterChannel)


//     // console.log("expiry inside", expiry);
//     // console.log("expiryOnChange", expiryOnChange)

//     var data = JSON.stringify({
//       "symbol": symbolRef.current,
//       "expiry": expiry == "" ? expiryOnChange : expiry
//     });

//     var config = {
//       method: 'post',
//       url: `${Config.base_url}all_round_token/filter`,
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       data: data,
//     };
//     //  console.log("dataaaaaaaaaa", data);

//     axios(config).then(function (response) {
//       console.log("responseeeeeeee", response.data.openpositionchannel);
//       //console.log("responseeeeeeee", response.data);
//       //setApiAllRoundToken(response.data.all_round_token)
//       setApiAllRoundToken2(response.data.all_round_token)
//       channeSocket(response.data.channellist, currentChannel.current, response.data.openpositionchannel);
//       currentChannel.current = response.data.channellist;
//       setFilterChannel(response.data.channellist)




//       // console.log("oldchannel list", oldChannel);
//       // console.log("newwwwwwwwwwchannel list", response.data.channellist);
//     })
//       .catch(function (error) {
//         console.log(error);
//       });
//   }



//   //  console.log("cc",callToken)

//   // console.log("AllToken",AllToken);
//   const strategyDataApi = () => {
//     axios({
//       method: "get",
//       url: `${Config.base_url}smartalgo/strategygroup`,
//       data: {},
//       headers: {
//         'x-access-token': admin_token
//       }
//     }).then(res1 => {
//       // console.log("res1", res1);
//       setStrategy_data(res1.data.strategy);
//     });
//   }

//   const openPositionApi = () => {

//     var config = {
//       method: 'get',
//       url: `${Config.base_url}openposition`
//     };

//     axios(config).then(function (response) {
//       console.log("openpostionapihit", response.data.data);
//       setOpenPositionData(response.data.data)


//       var channelStr = ""
//       response.data.data.forEach(element => {
//         channelStr += "NFO|" + element.token + "#"
//       });
//       var alltokenchannellist = channelStr.substring(0, channelStr.length - 1);
//       setOpenpossitionString(alltokenchannellist)

//       // console.log("alltokenchannellist",alltokenchannellist)


//     })
//       .catch(function (error) {
//         console.log(error);
//       });
//   }

//   const getTokenTradingApi = () => {

//     var config = {
//       method: 'get',
//       url: `${Config.base_url}api/getTokenTradingApi`
//     };
//     axios(config).then(function (response) {

//       // console.log("openpostionapihit", response.data.data);
//       setGetTokenTradingApiDetails(response.data.data)
//       setAdminTradingType(response.data.data[0].trading)

//     })
//       .catch(function (error) {
//         console.log(error);
//       });




//   }


//   useEffect(() => {
//     GetBrokerKey();
//     getTokenTradingApi();
//     openPositionApi();
//     getPanelKey();
//     strategyDataApi()
//     // newApiForTopkens()
//     marginCalculator()
//     getSocketData()


//     const now = new Date();
// const expiry = now.getMonth() == 11 ? new Date(now.getFullYear()+1, 0 , 1) : new Date(now.getFullYear(), now.getMonth() + 1, 1);
// console.log("next month" , expiry)

//     // newApiForTopkens()
//     // strategyDataApi()
//     // strikePriceSendApi()
//     // strikeprice()
//   }, [refreshscreen])



//   function GetBrokerKey(){

//     var config = {
//       method: "get",
//       url: `${Config.base_url}api/alicebluetoken/getBrokerKey`,
//       headers: {},
//     };


//     axios(config)
//       .then(function (response) {
//         console.log("shakir response ", response.data.status);
//         if (response.data.status == "true") {
          

//           setGetBrokerKey(response.data.data[0])

//         } else {
//           console.log('Token Not Available');
//         }
//       })
//       .catch(function (error) {
//         // console.log(error);
//       });




//   }








//   function channeSocket(channel_list, oldlist, openpositionchannel) {

//     //alert(channel_list)

//     if (sockets == null) {
//       // alert('okkk')
//       runSocket("", channel_list, openpositionchannel)
//     }
//     //



//     //console.log("new channel listttt", channel_list);
//     //console.log("old channel listttt", oldlist);
//     //console.log("filter socket", sockets);

//     if (oldlist != undefined) {
//       console.log('unsubscribe token', oldlist)
//       //  alert("inside unscribe")
//       // alert(oldlist)
//       let json2 = {
//         k: oldlist,
//         t: "u",
//       };

//       sockets.send(JSON.stringify(json2));

//     }


//     console.log('open position channel', openpositionchannel)




//     let json1 = {
//       k: "NFO|48756#NFO|48757#" + channel_list + "#" + openpositionchannel,
//       t: "t",
//     };

//     sockets.send(JSON.stringify(json1));
//     sockets.onmessage = function (msg) {
//       var response = JSON.parse(msg.data);



//       if ("48756" == response.tk && response.lp != undefined) {
//         setBankNiftyPriceShow(response.lp)
//       }

//       if ("48757" == response.tk && response.lp != undefined) {
//         setNiftyPriceShow(response.lp)
//       }

//       if (response.tk) {
//         //  console.log('response token filter', response)
//         if (response.lp != undefined) {
//           $(".showdata" + response.tk).html(response.lp);
//           $(".showdataEP" + response.tk).html(response.lp);

//         } else {
//           $(".showdata" + response.tk).html(response.c);
//           $(".showdataEP" + response.tk).html(response.lp);
//         }

//         if (response.pc != undefined) {
//           $(".showdatapc" + response.tk).html(response.pc);
//         }

//       }

//     };

//   }

//   useEffect(() => {

//   }, [sockets]);

//   const getPanelKey = () => {

//     var config = {
//       method: 'get',
//       url: `${Config.base_url}smartalgo/panelkey`,
//       headers: {
//         'x-access-token': admin_token
//       }

//     };
//     axios(config)
//       .then(function (response) {
//         //  console.log("ddddd - ", response.data);
//         // console.log("ddddd iii - ", response.data.PanelKey[0].panel_key);
//         setPanelKey(response.data.PanelKey[0].panel_key);

//       })
//       .catch(function (error) {
//         console.log(error);
//       });

//   }


//   var mytext = [];

//   const makerequest = (option_type, type, symbol, expiry, token, ischecked, index) => {


//     var pre_tag = {
//       option_type: option_type,
//       type: type,
//       token: token,
//       indexcallput: option_type + index,
//       indexing: index

//     };

//     setRequestSiginals(oldValues => {
//       return oldValues.filter(item => item.indexcallput !== option_type + index)
//     })

//     setRequestSiginals((oldArray) => [pre_tag, ...oldArray]);

//   }





//   const executiveTrade = (e) => {

//     var tradesymbol_array = [];

//     requestSiginals && requestSiginals.forEach((element, index) => {
//       apiAllRoundToken2 && apiAllRoundToken2.forEach((element1, index1) => {

//         if (element.indexing == index1) {
//           console.log("okk")
//           if (element.option_type == "CALL") {

//             console.log("symbol -", symbolRef.current)
//             console.log("panelKey -", panelKey)
//             console.log("expiry -", expiryOnChange)
//             console.log("singleStrategy -", singleStrategy)
//             console.log("token call-", element1.call_token)
//             console.log("type-", element.type)
//             console.log("strike price-", element1.strike_price)

//             var price;
//             var price_get = $(".showdata" + element1.call_token).html();
//             // alert(price_get);
//             if (price_get == "") {
//               price = "100";
//             } else {
//               price = $(".showdata" + element1.call_token).html();

//             }

//             // alert(price)


//             var request = "id:11@@@@@input_symbol:" + symbolRef.current + "@@@@@type:" + element.type + "@@@@@price:" + price + "@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:" + panelKey + "@@@@@exchange:NFO@@@@@product_type:MIS@@@@@strike:" + element1.strike_price + "@@@@@segment:O@@@@@option_type:" + element.option_type + "@@@@@expiry:" + expiryOnChange + "@@@@@strategy:" + singleStrategy + "@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@token:" + element1.call_token + "@@@@@demo:demo";



//             var option_type = element.option_type.toUpperCase();



//             var is_CE_val_option = 'PE';
//             if (option_type == 'CALL') {
//               is_CE_val_option = 'CE';
//             }

//             var day_expiry = expiryOnChange.slice(0, 2);
//             var moth_str = expiryOnChange.slice(2, 4);
//             var year_expiry = expiryOnChange.slice(-2);

//             console.log("ffffffff  -  ", day_expiry);
//             console.log("mmmmmmmm -  ", moth_str);
//             console.log("day_year -  ", year_expiry);


//             var month_string = ''



//             if (moth_str == "01") {
//               month_string = "JAN";
//             } else if (moth_str == "02") {
//               month_string = "FEB";
//             }
//             else if (moth_str == "03") {
//               month_string = "MAR";
//             }
//             else if (moth_str == "04") {
//               month_string = "APR";
//             }
//             else if (moth_str == "05") {
//               month_string = "MAY";
//             }
//             else if (moth_str == "06") {
//               month_string = "JUN";
//             }
//             else if (moth_str == "07") {
//               month_string = "JUL";
//             }
//             else if (moth_str == "08") {
//               month_string = "AUG";
//             }
//             else if (moth_str == "09") {
//               month_string = "SEP";
//             }
//             else if (moth_str == "10") {
//               month_string = "OCT";
//             }
//             else if (moth_str == "11") {
//               month_string = "NOV";
//             }
//             else if (moth_str == "12") {
//               month_string = "DEC";
//             }


//             var Transactions = "BUY";
//             if (element.type == "SE") {
//               Transactions = "SELL"
//             }


//             var tradesymbol = symbolRef.current + day_expiry + month_string + year_expiry + element1.strike_price + is_CE_val_option + "   -   " + Transactions;


//             tradesymbol_array.push(tradesymbol)


//           } else if (element.option_type == "PUT") {

//             console.log("symbol -", symbolRef.current)
//             console.log("panelKey -", panelKey)
//             console.log("expiry -", expiryOnChange)
//             console.log("singleStrategy -", singleStrategy)
//             console.log("token put-", element1.put_token)
//             console.log("type-", element.type)
//             console.log("strike price-", element1.strike_price)

//             var price;
//             var price_get = $(".showdata" + element1.put_token).html();
//             // alert(price_get);
//             if (price_get == "") {
//               price = "100";
//             } else {
//               price = $(".showdata" + element1.put_token).html();
//             }

//             // alert(price)


//             var request = "id:11@@@@@input_symbol:" + symbolRef.current + "@@@@@type:" + element.type + "@@@@@price:" + price + "@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:" + panelKey + "@@@@@exchange:NFO@@@@@product_type:MIS@@@@@strike:" + element1.strike_price + "@@@@@segment:O@@@@@option_type:" + element.option_type + "@@@@@expiry:" + expiryOnChange + "@@@@@strategy:" + singleStrategy + "@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@token:" + element1.put_token + "@@@@@demo:demo";


//             var option_type = element.option_type.toUpperCase();



//             var is_CE_val_option = 'PE';
//             if (option_type == 'CALL') {
//               is_CE_val_option = 'CE';
//             }

//             var day_expiry = expiryOnChange.slice(0, 2);
//             var moth_str = expiryOnChange.slice(2, 4);
//             var year_expiry = expiryOnChange.slice(-2);

//             console.log("ffffffff  -  ", day_expiry);
//             console.log("mmmmmmmm -  ", moth_str);
//             console.log("day_year -  ", year_expiry);


//             var month_string = ''



//             if (moth_str == "01") {
//               month_string = "JAN";
//             } else if (moth_str == "02") {
//               month_string = "FEB";
//             }
//             else if (moth_str == "03") {
//               month_string = "MAR";
//             }
//             else if (moth_str == "04") {
//               month_string = "APR";
//             }
//             else if (moth_str == "05") {
//               month_string = "MAY";
//             }
//             else if (moth_str == "06") {
//               month_string = "JUN";
//             }
//             else if (moth_str == "07") {
//               month_string = "JUL";
//             }
//             else if (moth_str == "08") {
//               month_string = "AUG";
//             }
//             else if (moth_str == "09") {
//               month_string = "SEP";
//             }
//             else if (moth_str == "10") {
//               month_string = "OCT";
//             }
//             else if (moth_str == "11") {
//               month_string = "NOV";
//             }
//             else if (moth_str == "12") {
//               month_string = "DEC";
//             }


//             var Transactions = "BUY";
//             if (element.type == "SE") {
//               Transactions = "SELL"
//             }


//             var tradesymbol = symbolRef.current + day_expiry + month_string + year_expiry + element1.strike_price + is_CE_val_option + "   -   " + Transactions;


//             tradesymbol_array.push(tradesymbol)


//           }
//         }
//       });
//     });


//     setTrdaesymbolArrayList(tradesymbol_array)
//     setShow(true);


//   }


//   const sendRequestPlaceOrder = () => {

//     requestSiginals && requestSiginals.forEach((element, index) => {
//       apiAllRoundToken2 && apiAllRoundToken2.forEach((element1, index1) => {

//         if (element.indexing == index1) {
//           console.log("okk")
//           if (element.option_type == "CALL") {

//             console.log("symbol -", symbolRef.current)
//             console.log("panelKey -", panelKey)
//             console.log("expiry -", expiryOnChange)
//             console.log("singleStrategy -", singleStrategy)
//             console.log("token call-", element1.call_token)
//             console.log("type-", element.type)
//             console.log("strike price-", element1.strike_price)

//             var price;
//             var price_get = $(".showdata" + element1.call_token).html();
//             // alert(price_get);
//             if (price_get == "") {
//               price = "100";
//             } else {
//               price = $(".showdata" + element1.call_token).html();

//             }

//             // alert(price)


//             var request = "id:11@@@@@input_symbol:" + symbolRef.current + "@@@@@type:" + element.type + "@@@@@price:" + price + "@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:" + panelKey + "@@@@@exchange:NFO@@@@@product_type:MIS@@@@@strike:" + element1.strike_price + "@@@@@segment:O@@@@@option_type:" + element.option_type + "@@@@@expiry:" + expiryOnChange + "@@@@@strategy:" + singleStrategy + "@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@token:" + element1.call_token + "@@@@@demo:demo";


//             placeOrderExcuted(request);


//           } else if (element.option_type == "PUT") {

//             console.log("symbol -", symbolRef.current)
//             console.log("panelKey -", panelKey)
//             console.log("expiry -", expiryOnChange)
//             console.log("singleStrategy -", singleStrategy)
//             console.log("token put-", element1.put_token)
//             console.log("type-", element.type)
//             console.log("strike price-", element1.strike_price)

//             var price;
//             var price_get = $(".showdata" + element1.put_token).html();
//             // alert(price_get);
//             if (price_get == "") {
//               price = "100";
//             } else {
//               price = $(".showdata" + element1.put_token).html();
//             }

//             // alert(price)


//             var request = "id:11@@@@@input_symbol:" + symbolRef.current + "@@@@@type:" + element.type + "@@@@@price:" + price + "@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:" + panelKey + "@@@@@exchange:NFO@@@@@product_type:MIS@@@@@strike:" + element1.strike_price + "@@@@@segment:O@@@@@option_type:" + element.option_type + "@@@@@expiry:" + expiryOnChange + "@@@@@strategy:" + singleStrategy + "@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@token:" + element1.put_token + "@@@@@demo:demo";

//             placeOrderExcuted(request);

//           }
//         }
//       });
//     });

//     setShow(false);

//   }


//   function placeOrderExcuted(request) {

//     console.log("request", request)



//     // return
//     var config = {
//       method: 'post',
//       url: 'https://api.smartalgo.in:3002/broker-signals',
//       headers: {
//         'Content-Type': 'text/plain'
//       },
//       data: request
//     };

//     axios(config)
//       .then(function (response) {
//         console.log(JSON.stringify(response.data));
//         setShowAlert(true);
//         setTextAlert("Trade Executed Successfully");
//         setAlertColor("success");
//         setRefreshscreen(!refreshscreen);
//         //   console.log(JSON.stringify(response.data));
//       })
//       .catch(function (error) {
//         console.log(error);
//       });



//   }


//   const lese = (value) => {
//     if (value == "LE") {
//       return "BUY"
//     }
//     if (value == "SE") {
//       return "SELL"
//     }
//   }


//   const customStyles = {

//     headCells: {
//       style: {
//         fontWeight: '700',
//         // margin:' 19px 0px',
//         backgroundColor: '#000',
//         color: '#fff',

//         justifyContent: 'center !important',
//         overflow: 'visible !important',
//       },
//     },
//     rows: {
//       style: {
//         justifyContent: 'center !important',
//       },
//     },
//     cells: {
//       style: {
//         overflow: 'visible !important',
//         justifyContent: 'center !important',
//       },
//     },
//   };

//   const columns = [
//     {
//       name: <h6>S.No</h6>,
//       selector: (row, index) => index + 1,
//       width: '60px !important',
//     },
//     {
//       name: <h6>Symbol</h6>,
//       selector: (row) => row.tradesymbol,
//       width: '220px !important',
//     },
//     {
//       name: <h6>TXN</h6>,
//       selector: (row) => lese(row.type),
//       width: '90px !important',
//     },
//     {
//       name: <h6>Executed Price</h6>,
//       selector: (row) => row.executed_price,
//       width: '110px !important',
//     },
//     {
//       name: <h6>LP Price</h6>,
//       selector: (row) => (
//         <span className={"showdataEP" + row.token}></span>
//       ),
//       width: '110px !important',
//     },
//     {
//       name: <h6>P/L</h6>,
//       selector: (row) => (
//         <span style={{ color: colorProfitLossOpenPosition(profiLoss(row.token, row.executed_price, row.type)) }}>{profiLoss(row.token, row.executed_price, row.type)}</span>
//       ),
//       width: '110px !important',
//     },
//     {
//       name: <h6>Time</h6>,
//       selector: (row) => dateFormate(row.created_at),
//       width: '180px !important',
//     },
//     {
//       name: <h6>Qty</h6>,
//       selector: (row) => row.entry_qty,
//       width: '60px !important',
//     },
//     {
//       name: <h6>Actions</h6>,
//       width: '130px !important',
//       selector: (row) => (
//         <>
//           <button
//             className="btn btn-success btn-new-block"
//             onClick={() => squareoff_single_show_modal(row)}
//           >
//             Square Off
//           </button>
//         </>
//       ),
//     },
//   ];


//   function profiLoss(token, excute_price, type) {
//     var exit_price = $('.showdataEP' + token).html();

//     if (type == "LE") {
//       return (parseFloat(exit_price) - parseFloat(excute_price)).toFixed(2)
//     } else if (type == "SE") {
//       return (parseFloat(excute_price) - parseFloat(exit_price)).toFixed(2)
//     }

//   }

//   function colorProfitLossOpenPosition(val) {

//     if (val > 0) {
//       return "green";
//     } else if (val < 0) {
//       return "red";
//     } else if (val == 0) {
//       return "black";

//     }


//   }


//   const squareoff_single_show_modal = (row) => {
//     //  alert("okk")
//     var Transactions = "";
//     var type = "";
//     if (row.type == "LE") {
//       type = "LX";
//       Transactions = "BUY";
//     }
//     else if (row.type == "SE") {
//       type = "SX";
//       Transactions = "SELL";
//     }

//     var tradesymbol = row.tradesymbol + "   -   " + Transactions;
//     setSingleSquareOfModalShow(tradesymbol)
//     setSingleSquareOfModalShowGetRow(row)
//     setShowSingleSquareOff(true)


//   }


//   const SingleSquareOff = (row) => {
//     squareoff_single(row);
//     setShowSingleSquareOff(false)

//   }

//   const squareoff_single = (row) => {
//     // console.log("row ", row)
//     var type = "";
//     if (row.type == "LE") {
//       type = "LX";
//     }
//     else if (row.type == "SE") {
//       type = "SX";
//     }


//     var price;
//     var price_get = $(".showdata" + row.token).html();
//     // alert(price_get);
//     if (price_get == "" || price_get == undefined) {
//       price = "100";
//     } else {
//       price = $(".showdata" + row.token).html();
//     }


//     var request = "id:12@@@@@input_symbol:" + row.tradesymbol + "@@@@@type:" + type + "@@@@@price:" + price + "@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:" + panelKey + "@@@@@exchange:NFO@@@@@product_type:MIS@@@@@strike:" + row.strike_price + "@@@@@segment:O@@@@@option_type:" + row.option_type + "@@@@@expiry:" + row.expiry + "@@@@@strategy:" + row.strategy_tag + "@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@token:" + row.token + "@@@@@entry_trade_id:" + row.id + "@@@@@tradesymbol:" + row.tradesymbol + "@@@@@demo:demo";

//     var data = request
//     console.log("exit trade ", data);

//     //return

//     var config = {
//       method: 'post',
//       url: 'https://api.smartalgo.in:3002/broker-signals',
//       headers: {
//         'Content-Type': 'text/plain'
//       },
//       data: data
//     };

//     axios(config)
//       .then(function (response) {
//         //  console.log(JSON.stringify(response.data));
//         //   console.log(JSON.stringify(response.data));
//         // navigate("/admin/executivetrade")
//         setShowAlert(true);
//         setTextAlert("Trade Exited Successfully");
//         setAlertColor("success");
//         setRefreshscreen(!refreshscreen);

//       })
//       .catch(function (error) {
//         console.log(error);
//       });



//   }

//   const selectSquareOffSignal = ({ selectedRows }) => {
//     // console.log('Selected Rows: ', selectedRows);
//     setSelectRowArray(selectedRows);
//   };



//   const selectAllSquareOff_show_modal = () => {



//     if (selectRowArray.length > 0) {

//       var tradesymbol_array = [];

//       selectRowArray.forEach(row => {

//         var Transactions = "";
//         var type = "";
//         if (row.type == "LE") {
//           type = "LX";
//           Transactions = "BUY";
//         }
//         else if (row.type == "SE") {
//           type = "SX";
//           Transactions = "SELL";
//         }


//         var tradesymbol = row.tradesymbol + "   -   " + Transactions;
//         tradesymbol_array.push(tradesymbol)


//       });


//       setAllSquareOfModalShow(tradesymbol_array)
//       setShowAllSquareOff(true)



//     } else {

//       setShowAlert(true);
//       setTextAlert("Please Select Stocks");
//       setAlertColor("warning");

//     }


//   }



//   const selectAllSquareOff = () => {
//     //console.log("selectRowArray",selectRowArray) 
//     //console.log("selectRowArray length",selectRowArray.length)    
//     //alert("okk");

//     if (selectRowArray.length > 0) {

//       selectRowArray.forEach(row => {
//         // console.log("ele -",row.id)
//         var type = "";
//         if (row.type == "LE") {
//           type = "LX";
//         }
//         else if (row.type == "SE") {
//           type = "SX";
//         }


//         var price;
//         var price_get = $(".showdata" + row.token).html();
//         // alert(price_get);
//         if (price_get == "" || price_get == undefined) {
//           price = "100";
//         } else {
//           price = $(".showdata" + row.token).html();
//         }



//         var request = "id:12@@@@@input_symbol:" + row.tradesymbol + "@@@@@type:" + type + "@@@@@price:" + price + "@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:" + panelKey + "@@@@@exchange:NFO@@@@@product_type:MIS@@@@@strike:" + row.strike_price + "@@@@@segment:O@@@@@option_type:" + row.option_type + "@@@@@expiry:" + row.expiry + "@@@@@strategy:" + row.strategy_tag + "@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@token:" + row.token + "@@@@@entry_trade_id:" + row.id + "@@@@@tradesymbol:" + row.tradesymbol + "@@@@@demo:demo";

//         console.log("exit trade", request)




//         // return

//         var data = request
//         console.log("exit trade ", data);
//         var config = {
//           method: 'post',
//           url: 'https://api.smartalgo.in:3002/broker-signals',
//           headers: {
//             'Content-Type': 'text/plain'
//           },
//           data: data
//         };

//         axios(config)
//           .then(function (response) {
//             //  console.log(JSON.stringify(response.data));
//             //   console.log(JSON.stringify(response.data));
//             setShowAlert(true);
//             setTextAlert("Trade Exited Successfully");
//             setAlertColor("success");
//             setRefreshscreen(!refreshscreen);
//             // navigate("/admin/executivetrade")
//           })
//           .catch(function (error) {
//             console.log(error);
//           });


//       });
//       setShowAllSquareOff(false)



//     } else {

//       setShowAlert(true);
//       setTextAlert("Please Select Stocks");
//       setAlertColor("warning");

//     }


//   }






//   function colorset(token) {

//     var val = $(".showdatapc" + token).html();

//     //console.log("val - ",val)

//     if (val > 0) {
//       return "green"
//     } else if (val < 0) {
//       return "red";
//     } else if (val == 0) {
//       return "black";
//     }
//   }


//   // TokenAndClientCode();

//   // function TokenAndClientCode() {
//   //   // alert("okk");

//   //   var config = {
//   //     method: "get",
//   //     url: `${Config.base_url}api/alicebluetoken`,
//   //     headers: {},
//   //   };


//   //   axios(config)
//   //     .then(function (response) {
//   //      console.log("shakir response ", response.data.status);
//   //       if (response.data.status == "true") {
//   //         //  console.log('Token Available', response.data.data[0].client_code + '  ' + response.data.data[0].access_token);
//   //         //setSocketuserid(response.data.data[0].client_code);
//   //        // setSocketuserSession(response.data.data[0].access_token);

//   //         // invalidateSession(
//   //         //   response.data.data[0].client_code,
//   //         //   response.data.data[0].access_token
//   //         // );

//   //       } else {
//   //         //  console.log('Token Not Available');
//   //       }
//   //     })
//   //     .catch(function (error) {
//   //       // console.log(error);
//   //     });
//   // }




//   // $(".showdata").html("Hello <b>world</b>!");

//   const Brokertoggle = (e, admiintokendetails) => {
   
//    // console.log("admiintokendetails ", admiintokendetails[0].client_code)
//     if(e.target.checked == true){

//      if (admiintokendetails[0].broker == 1) {

//       window.location.href = "https://a3.aliceblueonline.com/?appcode=" + admiintokendetails[0].app_id;
      
//     }


//     }else{

//       tradingOffAdminToken();

//     }

//   };




//   function tradingOffAdminToken(){
   
//     var config = {
//       method: 'get',
//       url: `${Config.base_url}api/alicebluetoken/tradingOff`
//     };

//     axios(config).then(function (response) {
//       // console.log("openpostionapihit", response.data);
//       setRefreshscreen(!refreshscreen);

//     })
//       .catch(function (error) {
//         console.log(error);
//       });


//   }



//   const [showAliceModal, setShowAliceModal] = useState(false);

//   const [secretKeyAlice, setSecretKeyAlice] = useState("")
//   const [appIdAlice, setAppIdAlice] = useState("")
//   const [getBrokerKey, setGetBrokerKey] = useState([])

//   console.log("secretKeyAlice", secretKeyAlice);
//   console.log("appIdAlice", appIdAlice);

//   const handleCloseAliceModal = () => {
//     setSecretKeyAlice("")
//     //setAppIdAlice("")
//     // setRefreshscreen(!refreshscreen);
//     setShowAliceModal(false)
//   };

//   const handleShowAliceModal = () => {
//     //  setSecretKeyAlice("")
//     // setAppIdAlice("")
//     setShowAliceModal(true)
//   };


//   const UpdateBrokerKey = () => {
//     //alert(appIdAlice)
//   //  alert(secretKeyAlice)

// var data = JSON.stringify({
//   "app_id": appIdAlice,
//   "api_secret": secretKeyAlice
// });

// var config = {
//   method: 'post',
//   url: `${Config.base_url}updateAdminBrokerKey`,
//   headers: { 
//     'x-access-token': admin_token,
//     'Content-Type': 'application/json'
//   },
//   data : data
// };

// axios(config)
// .then(function (response) {
//   console.log(JSON.stringify(response.data));
// })
// .catch(function (error) {
//   console.log(error);
// });

//  setShowAliceModal(false)

//   }



//   return (
//     <>
//       <div className="content">
//         <div className="row">
//           <div className="col-md-12">
//             <div className="card">
//               <div className="card-header">
//                 <div className="row align-items-center">
//                     <div className="col-md-6">
//                       <h4 className="card-title font">Executive Trade</h4>
//                     </div>
//                     <div className="col-md-6 text-end">
//                       <button type="button" onClick={() => handleShowAliceModal()} class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
//                   Set Key
//                 </button>
//                     </div>
//                 </div>
//               </div>

//               <div className="card-header">
//                 <div className="row">
//                   <div className="col-md-6">
//                     <div>
//                       <div className="row">
//                         <div className="col-md-4">
//                           <b>SYMBOLS</b>
//                           <select
//                             name="symbols_filter"
//                             className="form-control spacing"
//                             style={{ width: "100px" }}
//                             onChange={(e, expiry) => SymbolsFilter(e, expiry)}
//                           >
//                             {/* <option value="All" >All</option> */}
//                             <option value="BANKNIFTY" selected>BANKNIFTY</option>
//                             <option value="NIFTY">NIFTY</option>

//                             {/* {uniqueArr && uniqueArr.map((x) => {
//                               return <option value={x}>{x}</option>
//                             })} */}
//                           </select>

//                         </div>
//                         <div className="col-md-4">
//                           <label style={{ fontWeight: 'bold', color: 'black' }}>STRATEGY</label>
//                           <select className="form-control" onChange={(e) => setSingleStrategy(e.target.value)} name="strategyname">
//                             <option value="">All</option>
//                             {strategy_data.map((sm, i) =>
//                               <option value={sm.name}>{sm.name}</option>)}
//                           </select>
//                         </div>

//                         <div className="col-md-4">
//                           <label style={{ fontWeight: 'bold', color: 'black' }}>EXPIRY DATE</label>
//                           <select className="form-control" name="expiry_date" onChange={(e) => { setExpiryOnChange(e.target.value); newApiForTokens(e.target.value) }} selected>
//                             {/* <option value="">Select Expiry Date</option> */}
//                             {expirydateSelect.map((sm, i) =>
//                               <option value={sm.expiry}>{sm.expiry_str}</option>)}

//                           </select>
//                         </div>

//                         <p className="text-info"><b>{(singleStrategy != "" && expiryOnChange != "") ? "" : "* Please Select Strategy And Expiry Date To Buy/Sell"}</b></p>
//                       </div>


//                       <div className="col-md-6">
//                         {Bankniftyprint && Bankniftyprint[0].symbol}
//                         <p className="ms-5"> {Niftyprint && Niftyprint[0].symbol}</p>
//                       </div>
//                   </div>
//                 </div>

//                 <div className="col-md-6">
//                   <div className="navbar-wrapper text-end">
//                     <h5>Login with Get Live Price</h5>
//                     <Form.Check
//                       className="broker_switch mb-2"
//                       size="lg"
//                       type="switch"
//                       name="trading"
//                       checked={adminTradingType == 1 ? true : false}
//                       onChange={(e) => {
//                         Brokertoggle(e, getTokenTradingApiDetails);
//                       }}
//                     />
//                   </div>
//                 </div>
                
//               </div>



              

//               <div className="row align-items-center mb-3">
//                 <div className="col-md-4">
//                   <p className="mb-0"><b>BANKNIFTY :- {bankNiftyPriceShow}</b></p>
//                 </div>
//                 <div className="col-md-4">
//                   <p className="mb-0"><b>NIFTY :- {niftyPriceShow}</b></p>
//                 </div>
//                 <div className="col-md-4">
//                   {/* <button className='btn btn-success' onClick={(e) => runSocket(e)}>Run Socket</button> */}
//                   <button className='btn btn-info float-end m-0' disabled={requestSiginals == "" ? true : false} onClick={executiveTrade}>Executive Trade</button>
//                 </div>
//               </div>
              

                

        

//                 <div className="table-responsive tableheight" >
//                   <table className="table tbl-tradehostory">
//                     <thead className="tablecolor">
//                       <tr className="fontbold">
//                         <th className="fontbold">Buy/Sell</th>
//                         {/* <th className="fontbold">Sell</th> */}
//                         <th>Call LP</th>
//                         <th style={{ display: "none" }} >Call LP PC</th>
//                         <th>Strike Price</th>
//                         <th>Put LP</th>
//                         <th style={{ display: "none" }} >Put LP PC</th>
//                         <th>Buy/Sell</th>
//                         {/* <th>Sell</th> */}
//                       </tr>
//                     </thead>
//                     <tbody>

//                       {apiAllRoundToken2 && apiAllRoundToken2.map((item, index) => (




//                         <tr>

//                           <td>


//                             {/* <b>Buy/Sell</b> */}


//                             <select
//                               name="symbols_filter"
//                               className="form-control spacing"
//                               style={{ width: "100px" }}
//                               onChange={(e) => { makerequest("CALL", e.target.value, item.symbol, item.expiry, item.call_token, e.target.checked, index); setBuySell(e.target.value) }}
//                               disabled={(singleStrategy != "" && expiryOnChange != "") ? false : true}
//                             >
//                               {/* <option value="All" >All</option> */}
//                               <option value="">Buy/Sell</option>
//                               <option value="LE">Buy</option>
//                               <option value="SE">Sell</option>
//                             </select>
//                           </td>

//                           <div style={{ display: "none" }} className={"showdatapc" + item.call_token} ></div>

//                           <td style={{ color: colorset(item.call_token), fontWeight: "bold" }} className={"showdata" + item.call_token}></td>

//                           {/* <td><b>{item.call_token}</b></td> */}

//                           <td ><b>{item.strike_price}</b></td>

//                           {/* <td><b>{item.put_token}</b></td> */}

//                           <div style={{ display: "none" }} className={"showdatapc" + item.put_token} ></div>

//                           <td style={{ color: colorset(item.put_token), fontWeight: "bold" }} className={"showdata" + item.put_token}></td>

//                           <td>
//                             {/* <b>Buy/Sell</b> */}
//                             <select
//                               name="symbols_filter"
//                               className="form-control spacing"
//                               style={{ width: "100px" }}
//                               onChange={(e) => makerequest("PUT", e.target.value, item.symbol, item.expiry, item.put_token, e.target.checked, index)}
//                               disabled={(singleStrategy != "" && expiryOnChange != "") ? false : true}
//                             >
//                               {/* <option value="All" >All</option> */}
//                               <option value="">Buy/Sell</option>
//                               <option value="LE" >Buy</option>
//                               <option value="SE">Sell</option>

//                             </select>
//                           </td>

//                         </tr>
//                       ))
//                       }


//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         {showAlert &&
//           <AlertToast
//             hideAlert={onAlertClose}
//             showAlert={showAlert}
//             message={textAlert}
//             alertColor={alertColor}
//           />
//         }
//       </div>

//       <div className="content">
//         <div className="row">
//           <div className="col-md-12">
//             <div className="card">
//               <div className="card-header">
//                 <h4 className="card-title font">Open Position</h4>
//               </div>
//               <div className="card-body">
//                 <div className="row">
//                 </div>
//                 <div className="row">
//                   <div>
//                     {/* <button className='btn btn-success' onClick={(e) => runSocket(e)}>Run Socket</button> */}
//                     <button className='btn btn-info float-end' onClick={() => navigate("/admin/closeposition")}>CLOSE POSITION</button>
//                     <button className='btn btn-success float-end' onClick={() => selectAllSquareOff_show_modal()}>SQUARE OFF</button>
//                   </div>

//                   <div>
//                     {/* <button className='btn btn-success' onClick={(e) => runSocket(e)}>Run Socket</button> */}
//                     {/*<button className='btn btn-success float-end' onClick={() => selectAllSquareOff_show_modal()}>SQUARE OFF</button>*/}
//                   </div>
//                 </div>

//                 {/* <div>
//                   <p><b>BANKNIFTY :- {bankNiftyPriceShow}</b></p>
//                   <p><b>NIFTY :- {niftyPriceShow}</b></p>
//                 </div> */}

//                 <div className="row d-flex justify-content-end">
//                   <div className="card-body">
//                     <div className="table-responsive">

//                       <DataTableExtensions
//                         columns={columns}
//                         data={openPositionData}
//                         export={false}
//                         print={false}
//                       >
//                         <DataTable
//                           fixedHeader
//                           fixedHeaderScrollHeight="700px"
//                           noHeader
//                           defaultSortField="id"
//                           defaultSortAsc={false}
//                           // pagination
//                           selectableRows
//                           onSelectedRowsChange={selectSquareOffSignal}
//                           customStyles={customStyles}
//                           highlightOnHover
//                         // paginationRowsPerPageOptions={[10, 50, 100]}
//                         // paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: 'All' }}
//                         />
//                       </DataTableExtensions>
//                     </div>
//                   </div>
//                 </div>

//                 {/* <div className="table-responsive tableheight" >
//                   <table className="table tbl-tradehostory">
//                     <thead className="tablecolor">
//                       <tr className="fontbold">
//                         <th className="fontbold"></th>
//                         <th className="fontbold">S No.</th>
//                         <th className="fontbold">Trade Symbol</th>
//                         <th>Transactions</th>
//                         <th>Executed Price</th>
//                         <th>Time</th>
//                         <th>Quantity</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>

//                       {openPositionData && openPositionData.map((item, index) => (

//                         <tr>

//                           <td><b>
//                             <input
//                               type="checkbox"
//                             />
//                           </b></td>

//                           <td><b>{index + 1}</b></td>

//                           <td><b>{item.tradesymbol}</b></td>

//                           <td><b>{item.type}</b></td>

//                           <td><b>{item.executed_price}</b></td>

//                           <td><b>{dateFormate(item.created_at)}</b></td>

//                           <td><b>1</b></td>

//                           <td><button className="btn btn-success btn-sm">Square Off</button></td>

//                         </tr>
//                       ))
//                       }


//                     </tbody>
//                   </table>
//                 </div> */}
//               </div>
//             </div>
//           </div>



//           <Modal show={show} onHide={handleClose}>
//             <Modal.Header closeButton>
//               <Modal.Title>Stock Details</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               {

//                 trdaesymbolArrayList?.map((item) => {
//                   return <>
//                     <p>{item}</p></>
//                 })

//               }

//             </Modal.Body>
//             <Modal.Footer>
//               <Button variant="secondary" onClick={handleClose}>
//                 Close
//               </Button>
//               <button className="btn btn-primary" variant="primary" onClick={() => sendRequestPlaceOrder()}>Done</button>
//             </Modal.Footer>
//           </Modal>










//           <Modal show={showAllSquareOff} onHide={AllSquareOffClose}>
//             <Modal.Header closeButton>
//               <Modal.Title>Stock Details</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               {

//                 allSquareOfModalShow?.map((item) => {
//                   return <>
//                     <p>{item}</p></>
//                 })

//               }

//             </Modal.Body>
//             <Modal.Footer>
//               <Button variant="secondary" onClick={AllSquareOffClose}>
//                 Close
//               </Button>
//               <button className="btn btn-primary" variant="primary" onClick={() => selectAllSquareOff()}>Done</button>
//             </Modal.Footer>
//           </Modal>







//           <Modal show={showSingleSquareOff} onHide={SingleSquareOffClose}>
//             <Modal.Header closeButton>
//               <Modal.Title>Stock Details</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               {


//                 <p>{singleSquareOfModalShow}</p>

//               }

//             </Modal.Body>
//             <Modal.Footer>
//               <Button variant="secondary" onClick={SingleSquareOffClose}>
//                 Close
//               </Button>
//               <button className="btn btn-primary" variant="primary" onClick={() => SingleSquareOff(singleSquareOfModalShowGetRow)}>Done</button>
//             </Modal.Footer>
//           </Modal>



//         </div>
//         {showAlert &&
//           <AlertToast
//             hideAlert={onAlertClose}
//             showAlert={showAlert}
//             message={textAlert}
//             alertColor={alertColor}
//           />
//         }
//       </div>

//       <Modal show={showAliceModal} onHide={handleCloseAliceModal}>
//         <Modal.Header closeButton>
//           <Modal.Title>Set Alice Blue Keys</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <TextField
//             id="outlined-required"
//             label="SECRET KEY"
//             defaultValue={getBrokerKey.app_id}
//             onChange={(e) => setSecretKeyAlice(e.target.value)}
//           />
//           <TextField
//             id="outlined-required"
//             label="APP ID"
//             defaultValue={getBrokerKey.api_secret}
//             onChange={(e) => setAppIdAlice(e.target.value)}
//           />
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseAliceModal}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={()=>UpdateBrokerKey()}>
//             Update
//           </Button>
//         </Modal.Footer>
//       </Modal>

//     </>
//   );
// }

// export default ExecutiveTrade;





//   // var num1 = "18323.25"
//   // const strikeprice = (num) => {
//   //   var number = Math.round(num).toString().slice(0, -2) + "0" + "0"
//   //   for (let i = 1; i <= 20; i++) {
//   //     const resultfor = parseInt(number, 10) + 100 * i;
//   //     const resultpre = number - 100 * i;
//   //     pushaccdec.push(resultfor, resultpre)

//   //     // console.log("sortarr", sortarr);
//   //   }
//   // }


//     // if (bankNiftyToken == response.tk) {
//   //   var number = Math.round(response.lp).toString().slice(0, -2) + "0" + "0"
//   //   for (let i = 1; i <= 20; i++) {
//   //     const resultfor = parseInt(number, 10) + 100 * i;
//   //     const resultpre = number - 100 * i;
//   //     bankniftypushaccdec.push({ "symbol": "BANKNIFTY", "strike_price": resultfor }, { "symbol": "BANKNIFTY", "strike_price": resultpre })
//   //     setBankNiftyStrikePrice(bankniftypushaccdec)
//   //   }
//   //   setBankNiftyPriceShow(response.lp)
//   // }

//   // if (niftyToken == response.tk) {
//   //   var number = Math.round(response.lp).toString().slice(0, -2) + "0" + "0"
//   //   for (let i = 1; i <= 20; i++) {
//   //     const resultfor = parseInt(number, 10) + 100 * i;
//   //     const resultpre = number - 100 * i;
//   //     niftypushaccdec.push({ "symbol": "NIFTY", "strike_price": resultfor }, { "symbol": "NIFTY", "strike_price": resultpre })
//   //     setNiftyStrikePrice(niftypushaccdec)
//   //   }
//   //   setNiftyPriceShow(response.lp)
//   // }