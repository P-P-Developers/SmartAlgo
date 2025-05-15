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
   
      
  const manual_dash = localStorage.getItem("manual_dash");
  const client_token = localStorage.getItem('client_token');
  const client_id = localStorage.getItem("client_id");
  const [clientDetailsStatus, setClientDetailsStatus] = useState(0);

  const [clientClientKey, setClientClientKey] = useState("");
  
  const client_key_panel = useRef("");

  const [clientDeatils, setClientDetails] = useState("");

const [stretegydata, SetStretegydata] = useState('')


  const [userPermissionType, setUserPermissionType] = useState([]);

  const [clientSegment, setClientSegment] = useState([]);

  const CheckOneTimeOpenPositionRef = useRef(1);

  
  console.log("clientSegment - ",clientSegment);


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
        channelStr +=  element.exchange +"|" + element.token + "#"
      });
      var alltokenchannellist = channelStr.substring(0, channelStr.length - 1);
     // console.log("alltokenchannellist",alltokenchannellist)
      runSocket(alltokenchannellist,response.data.data);
      setOpenpossitionString(alltokenchannellist)
    
    })
      .catch(function (error) {
        console.log(error);
      });
  }


  

    const openPositionApiClient = (panelKey) => {

    var config = {
      method: 'post',
      url: `${Config.base_url}openpositionClient`,
      data: {
        panelKey: panelKey,
      },
    };

    axios(config).then(function (response) {
    console.log("openpostionapihit client", response.data.data);
      setOpenPositionData(response.data.data)
      var channelStr = ""
      response.data.data.forEach(element => {
        channelStr +=  element.exchange +"|" + element.token + "#"
      });
      var alltokenchannellist = channelStr.substring(0, channelStr.length - 1);
     // console.log("alltokenchannellist",alltokenchannellist)
      runSocket(alltokenchannellist,response.data.data);
      setOpenpossitionString(alltokenchannellist)
    
    })
      .catch(function (error) {
        console.log(error);
      });
  }

  if(manual_dash == null){
      // console.log("insideeeeeeeeeeeeeee   client");
      if(clientDetailsStatus == 0){
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
           // alert('client')
           // console.log("daaaaata client", res.data.msg.client_key);
            setClientDetails(res.data.msg);
            setClientClientKey(res.data.msg.client_key);
            client_key_panel.current = res.data.msg.client_key
            openPositionApiClient(res.data.msg.client_key)
            setClientSegment((res.data.msg.segment_all).split(',').map(Number));
            clientStartegyDataApi()
          }
        
        });


      
      }
      
    }else{
      if(CheckOneTimeOpenPositionRef.current == 1){
      CheckOneTimeOpenPositionRef.current = 0
      openPositionApi();
      }
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
         SetStretegydata(res.data.strategy);
         UserPermissionApi()
        
      });
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
    
    const makeCall_condition = userPermissionType.filter((number) => number.permission_type_id ==1);
    
    const Segment_condition = userPermissionType.filter((number) => number.permission_type_id ==2);
    
    const optionChain_condition = userPermissionType.filter((number) => number.permission_type_id ==3);
    
    const stocks_option_condition = userPermissionType.filter((number) => number.permission_type_id ==4);
    
    const stock_index = userPermissionType.filter((number) => number.permission_type_id ==5);
  
    /// All Segment Condition
  
    const c_condition = clientSegment.filter((number) => number ==24);
    
    const f_condition = clientSegment.filter((number) => number ==25);
    
    const o_condition = clientSegment.filter((number) => number ==26);
    
    const mf_condition = clientSegment.filter((number) => number ==34);
    
    const mo_condition = clientSegment.filter((number) => number ==35);
    
    const co_condition = clientSegment.filter((number) => number ==36);
    
    const cf_condition = clientSegment.filter((number) => number ==37);
    
    const fo_condition = clientSegment.filter((number) => number ==39);
   
    const cb_condition = clientSegment.filter((number) => number ==40);
  
  //   console.log("f_condition",f_condition);
  //   console.log("clientClientKey",clientClientKey);
  //////////////
  





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
  const [exitTimeeUpdate, setExitTimeeUpdate] = useState([])

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
      //console.log("data socket", data);
      setShowAlert(true);
      setTextAlert(data.msg);
      setAlertColor("success");
      setRefreshscreen(!refreshscreen);
      window.location.reload();
      

    });

  }


  const onAlertClose = e => {
    setShowAlert(false);
  }


  let AuthorizationToken;
  const runSocket = (openpositionchannel,possition_loop) => {
 
    var config = {
      method: "get",
      url: `${Config.base_url}api/alicebluetoken`,
      headers: {},
    };


    axios(config)
      .then(function (response) {
        // console.log("shakir response ", response.data.status);
        if (response.data.status == "true") {
          if(response.data.data[0].trading == 1){
         invalidateSession(response.data.data[0].client_code, response.data.data[0].access_token, openpositionchannel,possition_loop,response.data.data[0].type,response.data.data[0].baseurl_aliceblue,response.data.data[0].socket_url);
          }
        } else {
          console.log('Token Not Available');
        }
      })
      .catch(function (error) {
        // console.log(error);
      });


    
  }









  function invalidateSession(userId, userSession, openpositionchannel,possition_loop,type,BASEURL,SOCKETURL) {
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
          createSession(userId, userSession, openpositionchannel,possition_loop,type,BASEURL,SOCKETURL);
        }
      },
    });
  }

  function createSession(userId, userSession, openpositionchannel,possition_loop,type,BASEURL,SOCKETURL) {
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
          connect(userId, userSession, openpositionchannel,possition_loop,type,BASEURL,SOCKETURL);
          BackendSocketApi(userId, userSession,type,BASEURL,SOCKETURL)
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


  function BackendSocketApi(userId, userSession,type,BASEURL,SOCKETURL) {

    var config = {
      method: 'get',
      url: `${Config.base_url}socket-api?userid=${userId}&usersession=${userSession}`,
      headers: {}
    };

    axios(config)
      .then(function (response) {
       // console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });



  }


  let socket;

  function connect(userId, userSession, openpositionchannel,possition_loop,type,BASEURL,SOCKETURL) {

    socket = new WebSocket(SOCKETURL);
    socket.onopen = function () {
      //  alert("socket open");
     // console.log("openpossition string", openpositionchannel);
     
      connectionRequest(userId, userSession,type,BASEURL,SOCKETURL);
      setSockets(socket)
      //  console.log("socket connect ",sockets);

    };

    socket.onmessage = function (msg) {
      var response = JSON.parse(msg.data);

      // console.log("response", response)

      if (response.s == "OK") {
      //  console.log("second inside ");

        let json = {
          k: openpositionchannel,
          t: "t",
        };
        socket.send(JSON.stringify(json));



        socket.onmessage = function (msg) {
          var response = JSON.parse(msg.data);

        //  console.log('response', response)
     

          if (response.tk) {
            //console.log('response token', response.pc);
            var filtered = possition_loop.filter(item => item.token == response.tk);


            if (response.bp1 != undefined) {
              $(".bp1_price" + response.tk).html(response.bp1);   
            }
            if (response.sp1 != undefined) {
              $(".sp1_price" + response.tk).html(response.sp1);
            }

           
         
         //  console.log("filtered",filtered);
        //   console.log("filtered lengh",filtered.length);

         // $(".showdata_pl" + filtered[0].id).html(response.lp);

        
           const old_val = $('.showdataEP'+response.tk).html();


            if (response.lp != undefined) {
              $(".showdata" + response.tk).html(response.lp);
              $(".showdataEP" + response.tk).html(response.lp);

              const new_val = $('.showdataEP'+response.tk).html(); 



              



              

             // console.log("old_val",old_val);
            //  console.log("new_val",new_val);

                if(new_val > old_val){
               
                  $('.showdataEP'+response.tk).css({"color":"green"});
                  
                }else if(new_val < old_val){
             
                  $('.showdataEP'+response.tk).css({"color":"red"});
                }else if(new_val == old_val){
                  
                  $('.showdataEP'+response.tk).css({"color":"black"});
                }
             


            } 

         if(filtered.length == 1){

        //  console.log("single token",filtered[0].token);

            if(response.bp1 != undefined){
             // console.log("bp 1",response.bp1);

              if(filtered[0].type == "LE"){
                
                var pl_val = (response.bp1 -parseFloat(filtered[0].executed_price)).toFixed(2);
               // console.log('pl_val LE', pl_val);
                $(".showdata_pl" + filtered[0].id).html(pl_val);
              
                if(pl_val > 0){          
                  $(".showdata_pl" + filtered[0].id).css({"color":"green"});
                  
                }else if(pl_val < 0){
             
                  $(".showdata_pl" + filtered[0].id).css({"color":"red"});
                }else if(pl_val == 0){
                  
                  $(".showdata_pl" + filtered[0].id).css({"color":"black"});
                }
                 
              }

            }
            if(response.sp1 != undefined){
              //console.log("sp 1",response.sp1);
              if(filtered[0].type == "SE"){
                 
                var pl_val = (parseFloat(filtered[0].executed_price - response.sp1)).toFixed(2);
                $(".showdata_pl" + filtered[0].id).html(pl_val);

                if(pl_val > 0){          
                  $(".showdata_pl" + filtered[0].id).css({"color":"green"});
                  
                }else if(pl_val < 0){
             
                  $(".showdata_pl" + filtered[0].id).css({"color":"red"});
                }else if(pl_val == 0){
                  
                  $(".showdata_pl" + filtered[0].id).css({"color":"black"});
                }
                
              }
              
            }

          } else{

           // console.log("double token",filtered[0].token);
             
           
            filtered.forEach(element => {
               //console.log("token --",element.token);
              
               

               if(response.bp1 != undefined){
                // console.log("bp 1",response.bp1);
   
                 if(element.type == "LE"){
                   
                   var pl_val = (response.bp1 -parseFloat(element.executed_price)).toFixed(2);
                 //  console.log('pl_val LE', pl_val);
                   $(".showdata_pl" + element.id).html(pl_val);
                 
                   if(pl_val > 0){          
                     $(".showdata_pl" + element.id).css({"color":"green"});
                     
                   }else if(pl_val < 0){
                
                     $(".showdata_pl" + element.id).css({"color":"red"});
                   }else if(pl_val == 0){
                     
                     $(".showdata_pl" + element.id).css({"color":"black"});
                   }
                    
                 }
   
               }
               if(response.sp1 != undefined){
                 //console.log("sp 1",response.sp1);
                 if(element.type == "SE"){
                    
                   var pl_val = (parseFloat(element.executed_price - response.sp1)).toFixed(2);
                   $(".showdata_pl" + element.id).html(pl_val);
   
                   if(pl_val > 0){          
                     $(".showdata_pl" + element.id).css({"color":"green"});
                     
                   }else if(pl_val < 0){
                
                     $(".showdata_pl" + element.id).css({"color":"red"});
                   }else if(pl_val == 0){
                     
                     $(".showdata_pl" + element.id).css({"color":"black"});
                   }
                   
                 }
                 
               }





             });  








            



          }  





            



          }

        };

      }
    };

    socket.onclose = function (event) {
      if (event.wasClean) {
        // alert(`1 [close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
       // runSocket(openpositionchannel,possition_loop)
        //  console.log("userid",userId);
        // console.log("userSession",userSession);
        //  connectionRequest(userId, userSession);
      } else {
       // runSocket(openpositionchannel,possition_loop)

        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        // alert('[close] Connection died');
      }
    };


    socket.onerror = function (error) {
    //  runSocket(openpositionchannel,possition_loop)

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
   // console.log('initCon', JSON.stringify(initCon));
    socket.send(JSON.stringify(initCon));
  }


 
 

  


  

  console.log("possition clientttt - ",openPositionData);

  const getTokenTradingApi = () => {

    var config = {
      method: 'get',
      url: `${Config.base_url}api/getTokenTradingApi`
    };
    axios(config).then(function (response) {

      //console.log("openpostionapihit", response.data.data);
      setGetTokenTradingApiDetails(response.data.data)
      setAdminTradingType(response.data.data[0].trading)

    })
      .catch(function (error) {
        console.log(error);
      });




  }


  useEffect(() => {

   // openPositionApi();
    getPanelKey();
    GetNotification()

  }, [refreshscreen, socket1])


  

  useEffect(() => {
    getTokenTradingApi();

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






  


  const lese = (value) => {
    if (value == "LE") {
      return "BUY"
    }
    if (value == "SE") {
      return "SELL"
    }
  }


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
            fontSize:"12px",
            // margin:' 19px 0px',
      background: '#d9ecff',
    
      color:'#607D8B',
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
            fontSize:"12px",
           
      				borderRightStyle: 'solid',
     				borderRightWidth: '1px',
    				borderRightColor: '#e9ecf0',
      			},
      		},
      	},
  };




  const columns = [
    {
      name: <h6>S.No</h6>,
      selector: (row, index) => index + 1,
      width: '60px !important',
    },
    {
      name: <h6>Symbol</h6>,
      selector: (row) => row.transaction_type == "O" ? row.tradesymbol : row.transaction_type == "F" ? row.input_symbol+row.expiry+"FUT" : row.transaction_type == "MF" ? row.input_symbol+row.expiry+"_MF" : row.transaction_type == "MO" ? row.input_symbol+row.expiry+"_MO" : row.transaction_type == "CF" ? row.input_symbol+row.expiry+"_CF" : row.transaction_type == "CO"? row.input_symbol+row.expiry+"_CO" : row.input_symbol,
      width: '220px !important',
    },
    // {
    //   name: <h6>Exit Time</h6>,
    //   selector: (row) => row.exit_time,
    //   width: '90px !important',
    // },
   
    {
      name: <h6>Exit Time</h6>,
      // width:"50px",
      selector: (row) => (<> {row.exit_time} <input type="time" id="appt" className="form-control" name="appt"  min="09:15" max="15:15" value={row.exit_time} onChange={(e) => inputExitTime(e, row)} width={"20px"} /></>),
      width: '80px !important',
    },


    // <input type="time" id="appt" className="form-control" name="appt" 
    //              min="09:15" 
    //              max="15:15"
    //              value={selectedTimeExit}
    //              onChange={handleTimeChangeExit}/>


    {
      name: <h6>Mis</h6>,
      selector: (row) => row.mis == 1 ? "Intraday" : row.mis == 2 ? "Delivery" : "",
      width: '90px !important',
    },
    {
      name: <h6>strategy</h6>,
      selector: (row) => row.strategy_tag,
      width: '90px !important',
    },
    {
      name: <h6>TXN</h6>,
      selector: (row) => lese(row.type),
      width: '90px !important',
    },
    {
      name: <h6>Executed Price</h6>,
      selector: (row) => (<span className={"showdata_executed_price" + row.executed_price} > {row.executed_price}</span>),
      width: '110px !important',
    },
    {
      name: <h6>LP Price</h6>,
      selector: (row) => (
        <span className={"showdataEP" + row.token}></span> 
      ),
      width: '110px !important',
    },

    {
      name: <h6>SLP</h6>,
      // width:"50px",
      selector: (row) => (<> <input className="hidebg" type="number" defaultValue={row.stoploss_price} onChange={(e) => inputStopLossPrices(e, row)} width={"20px"} /></>),
      width: '80px !important',
    },
    {
      name: <h6>TP</h6>,
      // width:"50px",
      selector: (row) => (<> <input className="hidebg" type="number" defaultValue={row.target_price} onChange={(e) => inputTargetPrices(e, row)} width={"20px"} /></>),
      width: '80px !important',
    },

    {
      name: <h6>Bid/p</h6>,
      // width:"50px",
     // cell: (row) => (<>  <span style={{ display: "none" }} className={"bp1_price" + row.token} ></span> </>),
     selector: (row) => (
      <span className={"bp1_price" + row.token} ></span> 
     ),
      width: '80px !important',
      hidden: true
    },

    {
      name: <h6>sell/p</h6>,
      // width:"50px",
     selector: (row) => (
      <span className={"sp1_price" + row.token} ></span> 
     ),
      width: '80px !important',
      hidden: true
    },
    {  
     
      name: <h6>P/L</h6>,
      // selector: (row) => (
      //   <span className={""} style={{ color: colorProfitLossOpenPosition(profiLoss(row.token, row.executed_price, row.type, row.stoploss_price, row.target_price)) }}>{profiLoss(row.token, row.executed_price, row.type, row.stoploss_price, row.target_price)}</span>
      // ),

      selector: (row) => (
        <span className={"showdata_pl"+row.id}></span>
      ),
      width: '110px !important',
    },
    {
      name: <h6>Time</h6>,
      selector: (row) => dateFormate(row.created_at),
      width: '180px !important',
      
    },
    {
      name: <h6>Qty</h6>,
      selector: (row) => row.entry_qty,
      width: '60px !important',
    },
    {
      name: <h6>Actions</h6>,
      width: '130px !important',
      selector: (row) => (
        <>
          <button
            className="btn btn-success btn-new-block"
            onClick={() => squareoff_single_show_modal(row)}
          >
            Square Off
          </button>
        </>
      ),
    },
  ];


  const inputStopLossPrices = (e, row) => {

   // console.log("row - ", row);

    var pre_tag = {
      id: row.id,
      panelKey: row.panelKey,
      StopLossPrice: e.target.value,
      TargetPrice: row.target_price,
      token: row.token,
      type: row.type,
      input_symbol: row.input_symbol,
      strike_price: row.strike_price,
      option_type: row.option_type,
      expiry: row.expiry,
      strategy_tag: row.strategy_tag,
      entry_trade_id: row.id,
      tradesymbol: row.tradesymbol,
      intraday_delivery: (row.mis).toString(),
      exit_time: row.exit_time == null ? "": (row.exit_time).replace(':', '-'),
      notrade_time: row.no_trade_time == null ? "": (row.no_trade_time).replace(':', '-')
     

    };

    setStopLossPriceUpdate(oldValues => {
      return oldValues.filter(item => item.id !== row.id)
    })

    setStopLossPriceUpdate((oldArray) => [pre_tag, ...oldArray]);
  }



  const inputTargetPrices = (e, row) => {

    var pre_tag = {
      id: row.id,
      panelKey: row.panelKey,
      TargetPrice: e.target.value,
      StopLossPrice: row.stoploss_price,
      token: row.token,
      type: row.type,
      input_symbol: row.input_symbol,
      strike_price: row.strike_price,
      option_type: row.option_type,
      expiry: row.expiry,
      strategy_tag: row.strategy_tag,
      entry_trade_id: row.id,
      tradesymbol: row.tradesymbol,
      intraday_delivery: (row.mis).toString(),
      exit_time: row.exit_time == null ? "": (row.exit_time).replace(':', '-'),
      notrade_time: row.no_trade_time == null ? "": (row.no_trade_time).replace(':', '-')
      
    };

    setTargetPriceUpdate(oldValues => {
      return oldValues.filter(item => item.id !== row.id)
    })

    setTargetPriceUpdate((oldArray) => [pre_tag, ...oldArray]);
  }


  const inputExitTime = (e, row) => {
    
  //  alert(e.target.value)

    var pre_tag = {
      id: row.id,
      panelKey: row.panelKey,
      TargetPrice: row.target_price,
      StopLossPrice: row.stoploss_price,
      token: row.token,
      type: row.type,
      input_symbol: row.input_symbol,
      strike_price: row.strike_price,
      option_type: row.option_type,
      expiry: row.expiry,
      strategy_tag: row.strategy_tag,
      entry_trade_id: row.id,
      tradesymbol: row.tradesymbol,
      intraday_delivery: row.mis == 0 ? "1" : (row.mis).toString(),
      exit_time: ((e.target.value).replace(':', '-')).toString(),
      notrade_time: row.no_trade_time == null ? "": (row.no_trade_time).replace(':', '-')
      
    };

    setExitTimeeUpdate(oldValues => {
      return oldValues.filter(item => item.id !== row.id)
    })

    setExitTimeeUpdate((oldArray) => [pre_tag, ...oldArray]);
  }

  //console.log("target price",targetPriceUpdate)
  //console.log("stop loss price",stopLossPriceUpdate)

  const UpadteStopLossAndTarget = () => {
    //alert("okk")

    if (stopLossPriceUpdate.length > 0) {
      // alert("stopLossPriceUpdate")
   //   console.log("stop loss price",stopLossPriceUpdate)
 
      UpadteStopLossAndTargetApi('stoploss', stopLossPriceUpdate)
    }


    if (targetPriceUpdate.length > 0) {
      // alert("targetPriceUpdate")
    //  console.log("target price",targetPriceUpdate)
      UpadtedTargetApi('target', targetPriceUpdate)

    }

    if(exitTimeeUpdate.length > 0){
      UpadtedExitTimeApi(exitTimeeUpdate)
    }


  }


  function UpadteStopLossAndTargetApi(condition, priceArray) {


    var data = JSON.stringify({
      "condition": condition,
      "priceArray": priceArray
    });

    var config = {
      method: 'post',
      url: `${Config.base_url}UpdateStopLossAndTargetPrice`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
       // console.log("UpadteStopLossAndTargetApi", response);
        if (response.data.status == true) {
          setShowAlert(true);
          setTextAlert("Price Updated Successfully");
          setAlertColor("success");
          setStopLossPriceUpdate([]);
          setTargetPriceUpdate([]);
          setExitTimeeUpdate([]);
          setRefreshscreen(!refreshscreen);

        }
      })
      .catch(function (error) {
        console.log(error);
      });


  }

  function UpadtedTargetApi(condition, priceArray) {


    var data = JSON.stringify({
      "condition": condition,
      "priceArray": priceArray
    });

    var config = {
      method: 'post',
      url: `${Config.base_url}UpdateTargetPrice`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
      //  console.log("dd", response.data.status);
        if (response.data.status == true) {

          setShowAlert(true);
          setTextAlert("Price Updated Successfully");
          setAlertColor("success");
          setStopLossPriceUpdate([]);
          setTargetPriceUpdate([]);
          setExitTimeeUpdate([]);
          setRefreshscreen(!refreshscreen);

        }
      })
      .catch(function (error) {
        console.log(error);
      });


  }

  function UpadtedExitTimeApi(ExitTimeeArray) {

   // console.log("ExitTimeeArray",ExitTimeeArray);
  
    var data = JSON.stringify({
      "ExitTimeeArray": ExitTimeeArray
    });

    var config = {
      method: 'post',
      url: `${Config.base_url}UpdateExitTimeeArray`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
      //  console.log("dd", response.data.status);
        if (response.data.status == true) {

          setShowAlert(true);
          setTextAlert("Exit Time Updated Successfully");
          setAlertColor("success");
          setStopLossPriceUpdate([]);
          setTargetPriceUpdate([]);
          setExitTimeeUpdate([]);
          setRefreshscreen(!refreshscreen);

        }
      })
      .catch(function (error) {
        console.log(error);
      });


  }











  function profiLoss(token, excute_price, type, StopLossPrice, TargetPrice) {




    var exit_price = $('.showdataEP' + token).html();

  


   // console.log("exit_price", exit_price);


    if (exit_price != "") {







      // if(TargetPrice > 0){
      //   //console.log("showdata TargetPrice ffffff",TargetPrice);
      //   console.log("type",type);

      //   if (type == "LE") {        
      //     if (parseFloat(exit_price) > parseFloat(TargetPrice)) {
      //      // alert("okk")
      //       setRefreshscreen(!refreshscreen);
      //     }

      //   }  
      //   else if(type == "SE"){
      //     if (parseFloat(exit_price) < parseFloat(TargetPrice)) {
      //    //   alert("okk")
      //       setRefreshscreen(!refreshscreen);
      //     }
      //   }

      // }





      // if(StopLossPrice > 0){
      //  // console.log("showdata StopLossPrice ffffff",StopLossPrice);
      //   console.log("type",type);

      //   if (type == "LE") {        
      //     if (parseFloat(exit_price) < parseFloat(StopLossPrice)) {
      //     //  alert("okk")
      //       setRefreshscreen(!refreshscreen);
      //     }

      //   }  
      //   else if(type == "SE"){
      //     if (parseFloat(exit_price) > parseFloat(StopLossPrice)) {
      //    //   alert("okk")
      //       setRefreshscreen(!refreshscreen);

      //     }
      //   }


      // }



    }



    if (type == "LE") {
      return (parseFloat(exit_price) - parseFloat(excute_price)).toFixed(2)
    } else if (type == "SE") {
      return (parseFloat(excute_price) - parseFloat(exit_price)).toFixed(2)
    }

  }

  function colorProfitLossOpenPosition(val) {

    if (val > 0) {
      return "green";
    } else if (val < 0) {
      return "red";
    } else if (val == 0) {
      return "black";

    }


  }


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


    // var price;
    // var price_get = $(".showdataEP" + row.token).html();
    //    alert(price_get);
    // if (price_get == "" || price_get == undefined) {
    //   price = row.executed_price;
    // } else {
    //   price = $(".showdataEP" + row.token).html();
    // }



            
            var price;
            if (row.type == "LE") {
             let price_get = $(".sp1_price" + row.token).html();
             if(price_get == "" || price_get == undefined){
              price = row.executed_price;
             }else{
              price = $(".sp1_price" + row.token).html(); 
             }
        
            } else if (row.type == "SE") {
             
              let price_get = $(".bp1_price" + row.token).html();
              if(price_get == "" || price_get == undefined){
               price = row.executed_price;
              }else{
               price = $(".bp1_price" + row.token).html(); 
              }

            } 
             


    var request = "id:12@@@@@input_symbol:" + row.input_symbol + "@@@@@type:" + type + "@@@@@price:" + price + "@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:" + panelKey + "@@@@@exchange:NFO@@@@@product_type:MIS@@@@@strike:" + row.strike_price + "@@@@@segment:"+row.transaction_type+"@@@@@option_type:" + row.option_type + "@@@@@expiry:" + row.expiry + "@@@@@strategy:" + row.strategy_tag + "@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@token:" + row.token + "@@@@@entry_trade_id:" + row.id + "@@@@@tradesymbol:" + row.tradesymbol + "@@@@@chain:option_chain@@@@@by_side:"+row.by_side+"@@@@@demo:demo";

    var data = request
    //console.log("exit trade ", data);

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
        //   console.log("square of",JSON.stringify(response.data));
        //  console.log(JSON.stringify(response.data.id));

        if(response.data.status == false){
          setShowAlert(true);
          setTextAlert(response.data.msg);
          setAlertColor("error");
          setDisabled(false)
          setRefreshscreen(!refreshscreen);
        }else{
        Romove_redis_key(response.data.id);
        setShowAlert(true);
        setTextAlert("Trade Exited Successfully");
        setAlertColor("success");
        setDisabled(false)
        setOpenPositionData("")
        window.location.reload();
      //  setRefreshscreen(!refreshscreen);
        }

      })
      .catch(function (error) {
        console.log(error);
      });

  }

  const selectSquareOffSignal = ({ selectedRows }) => {
    setSelectRowArray(selectedRows);
  };



  const selectAllSquareOff_show_modal = () => {

    if (adminTradingType == "" || sockets == null) {
      alert("Please login with broker Account")
      return
    }

    if (selectRowArray.length > 0) {
      var tradesymbol_array = [];
      selectRowArray.forEach(row => {

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
        tradesymbol_array.push(tradesymbol)
      });
      setAllSquareOfModalShow(tradesymbol_array)
      setShowAllSquareOff(true)
    } else {
      setShowAlert(true);
      setTextAlert("Please Select Stocks");
      setAlertColor("warning");
    }
  }

  
  let squareoffchecklenthg = [];

  const selectAllSquareOff = () => {
    //console.log("selectRowArray",selectRowArray) 
    //console.log("selectRowArray length",selectRowArray.length)    
   
 

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
        if (row.type == "LE") {
         let price_get = $(".sp1_price" + row.token).html();
         if(price_get == "" || price_get == undefined){
          price = row.executed_price;
         }else{
          price = $(".sp1_price" + row.token).html(); 
         }
    
        } else if (row.type == "SE") {
         
          let price_get = $(".bp1_price" + row.token).html();
          if(price_get == "" || price_get == undefined){
           price = row.executed_price;
          }else{
           price = $(".bp1_price" + row.token).html(); 
          }

        } 

        var request = "id:12@@@@@input_symbol:" + row.input_symbol + "@@@@@type:" + type + "@@@@@price:" + price + "@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:" + panelKey + "@@@@@exchange:NFO@@@@@product_type:MIS@@@@@strike:" + row.strike_price + "@@@@@segment:"+row.transaction_type+"@@@@@option_type:" + row.option_type + "@@@@@expiry:" + row.expiry + "@@@@@strategy:" + row.strategy_tag + "@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@token:" + row.token + "@@@@@entry_trade_id:" + row.id + "@@@@@tradesymbol:" + row.tradesymbol + "@@@@@chain:option_chain@@@@@by_side:"+row.by_side+"@@@@@demo:demo";

        //console.log("exit trade", request)


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
          .then(function(response) {

            if(response.data.status == false){
              setShowAlert(true);
              setTextAlert(response.data.msg);
              setAlertColor("error");
              setRefreshscreen(!refreshscreen);
            }else{
           // console.log("square of",JSON.stringify(response.data));
           // console.log(JSON.stringify(response.data.id));
           squareoffchecklenthg.push(1)
          // console.log("selectRowArray",selectRowArray.length);
          // console.log("squareoffchecklenthg",squareoffchecklenthg.length);
            Romove_redis_key(response.data.id);
            if(squareoffchecklenthg.length == squareoffchecklenthg.length){
            setShowAlert(true);
            setTextAlert("Trade Exited Successfully");
            setAlertColor("success");
            setDisabled(false)
            setOpenPositionData("")
            window.location.reload();
            setRefreshscreen(!refreshscreen);
            }
          }
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

  


  function Romove_redis_key(id) {


    var data = JSON.stringify({
      "id": id,
    });

    var config = {
      method: 'post',
      url: `${Config.base_url}Romove_redis_key`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
      //  console.log("dd", response.data);
      })
      .catch(function (error) {
        console.log(error);
      });


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


  

  return (
    <>



{/*  Open Position  */}

    <div className='manual'>
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
                    {/* <button className='btn btn-success' onClick={(e) => runSocket(e)}>Run Socket</button> */}
                    {/* <button className='btn btn-info float-end' onClick={() => navigate("/manual/manualclosepositions")}>CLOSE POSITION</button> */}
                    {openPositionData.length != 0 ?<> <button className='btn btn-success float-end' onClick={() => selectAllSquareOff_show_modal()}>SQUARE OFF</button></> : ""}
                  </div>
                  <div>

                  {openPositionData.length != 0 ?<> <button className='btn btn-success float-end' onClick={() => UpadteStopLossAndTarget()}> UPDATE STOPLOSS AND TARGET PRICE</button></> : ""}
 
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



        </div>

      {/* <Modal show={showAliceModal} onHide={handleCloseAliceModal}>
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
      </Modal> */}
      
      {showAlert &&
            <AlertToast
              hideAlert={onAlertClose}
              showAlert={showAlert}
              message={textAlert}
              alertColor={alertColor}
            />
          }


    </>
  );
}



export default ExecutiveTrad;