import React, { useEffect, useState, useContext, useCallback, useRef } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { getScriptData, getStrategyData, getServiceData, getPanelKey, BrokerSignalsApi, gettokenbysocket, getexpirymanualtrade, AbovePriceRequest, BelowPriceRequest, AtEntryPriceRequest,UpdatemakecallatRequest } from '../../ApiCalls/Api.service'
import { CreateSocketSession, CreateSocketConnection, GetAliceTokenAndID } from '../../ApiCalls/AliceBlueSocket.service'
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import axios from "axios";
import AlertToast from "../../../common/AlertToast";
import $ from "jquery";
import * as Config from "../../../common/Config";
import Wraper from "./PriceBelowAbove/Wraper"


const MakeCalls = () => {
  // const contextdata = useContext(ContextCreate)

  const navigate = useNavigate()
  const [ForDisabledSubmit, SetForDisabledSubmit] = useState(false)

  const [scriptdata, SetScriptdata] = useState('')
  const [scriptExchangeValue, SetScriptExchangeValue] = useState('')
  const [onChangeScriptname, SetonChangeScriptname] = useState('')
  const [scriptname, SetScriptname] = useState('')
  console.log("scriptname", scriptname)
  const [scriptSeg, SetScriptSeg] = useState('')
  const [stretegydata, SetStretegydata] = useState('')
  const [strategy, setStrategy] = useState('')
  const [servicedata, SetServicedata] = useState('')
  const [selectCatagoryid, SetSelectCatagoryId] = useState('')
  const [panelKey, setPanelKey] = useState("")
  const [shares, setShares] = useState("")
  const [lot, setLot] = useState('')
  const [CallType, setCallType] = useState('Call')
  const [tradeType, setTradeType] = useState('')
  const [EntryPrice, SetEntryPrice] = useState('')

  const [EntryPriceBA, SetEntryPriceBA] = useState('')
  // console.log("EntryPriceBA" ,EntryPriceBA);
  const [persentage, setPersentage] = useState('')
  const [prefix, setPrefix] = useState('')
  const [target1perWise, setTarget1perWise] = useState('')
  const [target2perWise, setTarget2perWise] = useState('')
  const [target1persentage, setTarget1persentage] = useState('')
  const [target1, setTarget1] = useState('not')
  const [target2, setTarget2] = useState('')
  const [srefix, setSrefix] = useState('')
  const [stoploss, setStopLoss] = useState('not')
  const [StopLossPer, setStopLossPer] = useState('');
  const [stockBuyPrice, setStockBuyPrice] = useState("");
  const [stockSellPrice, setStockSellPrice] = useState("");

  // Handle Errors
  const [scriptErr, setScriptDataErr] = useState("")
  const [strategyErr, setStrategyErr] = useState('')
  const [scriptnameErr, SetScriptnameErr] = useState('')
  const [sharesErr, setSharesErr] = useState('')
  const [lotErr, setLotErr] = useState('')
  const [CallTypeErr, setCallTypeErr] = useState('')
  const [tradeTypeErr, setTradeTypeErr] = useState('')
  const [EntryPriceErr, SetEntryPriceErr] = useState('')
  const [EntryPriceBAErr, SetEntryPriceBAErr] = useState('')
  const [persentageErr, setPersentageErr] = useState('')
  const [prefixErr, setPrefixErr] = useState('')
  const [target1perWiseErr, setTarget1perWiseErr] = useState('')
  const [target2perWiseErr, setTarget2perWiseErr] = useState('')
  const [target1persentageErr, setTarget1persentageErr] = useState('')
  const [target1Err, setTarget1Err] = useState('')
  const [target2Err, setTarget2Err] = useState('')
  const [stoplossErr, setStopLossErr] = useState('')
  const [StopLossPerErr, setStopLossPerErr] = useState('')
  const [srefixErr, setSrefixErr] = useState('')
  const [expirydateSelect, setExpirydateSelect] = useState([]);
  const [expiryOnChange, setExpiryOnChange] = useState('01012023');
  const [liveprice, setLiveprice] = useState("");
  const [changeDropdown, setChangeDropdown] = useState(0)
  const [WiseTypeDropdown, setWiseTypeDropdown] = useState("0")
  const [WiseTypeDropdownErr, setWiseTypeDropdownErr] = useState("")

  const [useridAlice, setUseridAlice] = useState("")
  const [usersessionAlice, setUsersessionAlice] = useState("")

  console.log("changeDropdown", changeDropdown);
  console.log("changeDropdown", changeDropdown);


  //  for socket session
  const [socketSessionId, setSocketSessionId] = useState('')
  const [sockets, setSockets] = useState(null);

  const previousToken = useRef()
  const liveToken = useRef("");

  // AlertToast
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");

  const [refreshscreen, setRefreshscreen] = useState(false);



  console.log("sockets", sockets);
  console.log("expiryOnChange check", expiryOnChange);


  //  local Storage
  const admin_token = localStorage.getItem("token");
  const adminId = localStorage.getItem("adminId");


  const onAlertClose = (e) => {
    // console.log("  setShowAlert(false);");
    setShowAlert(false);
  };


  const getPanelKeys = async () => {
    const response = await getPanelKey(admin_token)
    if (response.status) {
      setPanelKey(response.data.PanelKey[0].panel_key);

    }
  }
  const GetScriptDataFunction = async () => {
    const response = await getScriptData(admin_token)

    // console.log("script",response);

    if (response.status) {
      SetScriptdata(response.data.category)
    }



  }

  const GetStrategyDataFunction = async (e) => {
    const response = await getStrategyData(admin_token)
    if (response.status) {
      SetStretegydata(response.data.strategy)
    }
  }

  const GetServiceDataFunction = async (e) => {
    const data = { adminId: adminId, id: selectCatagoryid }

    const response = await getServiceData(data, admin_token)

    console.log("service data", response);

    if (response.status) {
      SetServicedata(response.data.services);
    }
  }




  const gettoken = async () => {
    if (selectCatagoryid != "") {
      console.log("service data ddd", selectCatagoryid);
      //  alert(selectCatagoryid);
      if (selectCatagoryid == "24") {

        console.log("previousToken.current cash", previousToken.current);

        const data = { symbol: scriptname, categorie_id: selectCatagoryid }
        const response = await gettokenbysocket(data);

        console.log("cash token", response);


        if (response.data.status == true) {
          // response.data.token
          // response.data.exchange

          if (sockets != null) {

            console.log("previousToken.current", previousToken.current);

            let json1 = {
              k: previousToken.current,
              t: "u",
            };
            sockets.send(JSON.stringify(json1));


            previousToken.current = response.data.exchange + "|" + response.data.token;
            console.log("response.data.exchange", response.data.exchange);
            console.log("response.data.token", response.data.token);
            liveToken.current = response.data.token;
            let json = {
              k: response.data.exchange + "|" + response.data.token,
              t: "t",
            };
            sockets.send(JSON.stringify(json));





            // sockets.onmessage = function (msg) {
            //   var response = JSON.parse(msg.data);
            //   console.log('response cash', response)

            // if (response.tk) {
            //   if (response.lp != undefined) {
            //     console.log('response token', response.lp)
            //     console.log('liveToken.current', liveToken.current)

            //    if(response.tk == liveToken.current){

            //      setLiveprice(response.lp)
            //    }else{

            //     setLiveprice("")
            //    }



            //   //    console.log("response -soket ",response);
            //      // setLiveprice(response.lp);
            //       $(".liveprice" + response.tk).html(response.lp);
            //       // $(".showdataEP" + response.tk).html(response.lp);

            //     }

            //     if(response.pc != undefined){
            //       if(response.pc > 0){
            //       $('.liveprice'+ response.tk).css({"color":"green"});

            //       }
            //       else if(response.pc < 0){
            //       $('.liveprice'+ response.tk).css({"color":"red"});

            //       }
            //       else if(response.pc == 0){
            //       $('.liveprice'+ response.tk).css({"color":"black"});

            //       }
            //     }



            //   }

            // };







          } else {

            console.log("sockets closeeee");

          }




        }




      } else {


        console.log("service other id", selectCatagoryid);
        console.log("service data expiryOnChange", expiryOnChange);

        const data = { symbol: scriptname, categorie_id: selectCatagoryid, expiry: expiryOnChange, segment: scriptSeg }
        const response = await gettokenbysocket(data);


        console.log("cash other token", response);
        console.log("sockets", sockets);

        if (response.data.status == true) {
          if (sockets != null) {

            console.log("previousToken.current NFO", previousToken.current);


            let json1 = {
              k: previousToken.current,
              t: "u",
            };
            sockets.send(JSON.stringify(json1));


            previousToken.current = response.data.exchange + "|" + response.data.token;
            let json = {
              k: response.data.exchange + "|" + response.data.token,
              t: "t",
            };
            sockets.send(JSON.stringify(json));

            liveToken.current = response.data.token;


            // sockets.onmessage = function (msg) {
            //   var response = JSON.parse(msg.data);
            //   console.log('response cash', response)

            //   if (response.tk) {
            //   if (response.lp != undefined) {
            //       console.log('response token', response.lp)

            //   //    console.log("response -soket ",response);
            //      // setLiveprice(response.lp);
            //       $(".liveprice" + response.tk).html(response.lp);
            //       // $(".showdataEP" + response.tk).html(response.lp);

            //     }

            //     if(response.pc != undefined){
            //       if(response.pc > 0){
            //       $('.liveprice'+ response.tk).css({"color":"green"});

            //       }
            //       else if(response.pc < 0){
            //       $('.liveprice'+ response.tk).css({"color":"red"});

            //       }
            //       else if(response.pc == 0){
            //       $('.liveprice'+ response.tk).css({"color":"black"});

            //       }
            //     }



            //   }

            // };


          } else {

            console.log("sockets closeeee");

          }

        }

      }


    }
  }



  useEffect(() => {
    gettoken()
  }, [scriptname]);


  useEffect(() => {
    getExpirybackend(selectCatagoryid)
  }, [selectCatagoryid]);






  const getExpirybackend = async (selectCatagoryid) => {

    const data = { categorie_id: selectCatagoryid }
    const response = await getexpirymanualtrade(data);

    // console.log("response -- expiry",response.data.data[0].expiry);
    // console.log("response -- expiry 2",response.data.status);

    if (response.data.status == true) {
      setExpiryOnChange(response.data && response.data.data[0].expiry)
    }

    setExpirydateSelect(response.data.data);

  }


  const setExchangeValue = (val) => {
    if (val == "CASH") {
      return "NSE"
    }
    else if (val == "FUTURE" || "OPTION") {
      return "NFO"
    }
    else if (val == "CURRENCY FUTURE" || "CURRENCY OPTION") {
      return "CDS"
    }
    else if (val == "MCXFUTURE" || "MCXOPTION") {
      return "MCX"
    }


  }



  // const getSocketData = () => {
  //   axios({
  //     method: "get",
  //     url: 'https://api.smartalgo.in:3001/smartalgo/channel/alldata',
  //   }).then(res => {
  //       console.log("res.data.all_expiry",res.data.all_expiry);
  //     setExpirydateSelect(res.data.all_expiry)

  //   });
  // }













  const GenerateMakeCall = async (e) => {
    e.preventDefault();
    if (selectCatagoryid == "") {
      alert("Please Select a Script  Type")
      return
    }


    if (strategy == "") {
      alert("Please Select a Strategy")
      return
    }

    if (scriptname == "") {
      alert("Please Select a Script Name")
      return
    }
    // if (shares == "") {
    //   alert("Please Select Aleast 1 Shares/Lot")
    //   return
    // }
    // if (lot == '') {
    //   alert("Please Select a Lot Size")
    //   return
    // }
    // if (CallType == '') {
    //   alert("Please Select a Call Type")
    //   return
    // }
    if (tradeType == '') {
      alert("Please Select a Trade Type")
      return
    }
    if (EntryPrice == '') {
      alert("Please Select a Entry Price")
      return
    }
    if (EntryPriceBA == '') {
      alert("Please Select a  Wise Type")
      return
    }
    // if (WiseTypeDropdown == '') {
    //   alert("Please Select wisetype")
    //   return
    // }

    // if (persentage == '') {
    //   alert("Please Select  a Persentage")
    //   return
    // }

    // if (target1 == '') {
    //   alert("Please Set Target1 Value")
    //   return
    // }

    // if (target1persentage == '') {
    //   alert("Please Set Target1 Per. Value")
    //   return
    // }
    // if (target1perWise == '') {
    //   alert("Please Set Target1 Persentage Wise Value")
    //   return
    // }
    // if (target2 == '') {
    //   alert("Please Set Target2 Value")
    //   return
    // }
    // if (target2perWise == '') {
    //   alert("Please Set Target2 Persentage Wise Value")
    //   return
    // }



    var price = 0;

    if (EntryPriceBA == "at") {
      price = liveprice;
    } else if (EntryPriceBA == "below") {
      price = EntryPrice;
    } else if (EntryPriceBA == "above") {
      price = EntryPrice;
    }


    var exchange = "NSE";

    if (selectCatagoryid == "25") {
      exchange = "NFO";
    } else if (selectCatagoryid == "34" || selectCatagoryid == "35") {
      exchange = "MCX";
    } else if (selectCatagoryid == "36" || selectCatagoryid == "37") {
      exchange = "CDS";
    }







    var request = `id:11@@@@@input_symbol:${scriptname}@@@@@type:${tradeType}@@@@@price:${price}@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:${panelKey}@@@@@exchange:${exchange}@@@@@product_type:MIS@@@@@strike:2500@@@@@segment:${scriptSeg}@@@@@option_type:${CallType}@@@@@expiry:${expiryOnChange}@@@@@strategy:${strategy}@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@chain:option_chain@@@@@targeprice:${target1}@@@@@stoplossprice:${stoploss}@@@@@token:${liveToken.current}@@@@@by_side:MAKECALL@@@@@demo:demo`;

    console.log("okk request", request);
    console.log("okk EntryPriceBA", EntryPriceBA);



    if (EntryPriceBA == "at") {
      console.log("test");


      const responceAt = await AtEntryPriceRequest(request)

      //console.log("response 1",responceAt.status);
     // console.log("response",responceAt.data.id);
   if (responceAt) {
    if(WiseTypeDropdown != "0" && WiseTypeDropdown != ""){
      const update_at_data = {
         id : responceAt.data.id,
         wisetype : WiseTypeDropdown,
         target :target1,
         stoploss: stoploss,
         price : price
        }  
        await UpdatemakecallatRequest(update_at_data)
  
      }

    
        setShowAlert(true);
        setTextAlert("Trade Executed Successfully");
        setAlertColor("success");
        setRefreshscreen(!refreshscreen);
        SetForDisabledSubmit(true)
        BackendSocketApi(useridAlice, usersessionAlice)
        navigate('/manual/manualopenpositions')
        //   console.log(JSON.stringify(response.data));
        setStrategy("")

      }

      //  placeOrderExcuted(request);
    } else if (EntryPriceBA == "below") {
      let request = `id:11@@@@@input_symbol:${scriptname}@@@@@type:${tradeType}@@@@@price:${price}@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:${panelKey}@@@@@exchange:${exchange}@@@@@product_type:MIS@@@@@strike:2500@@@@@segment:${scriptSeg}@@@@@option_type:${CallType}@@@@@expiry:${expiryOnChange}@@@@@strategy:${strategy}@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@chain:option_chain@@@@@targeprice:${target1}@@@@@stoplossprice:${stoploss}@@@@@token:${liveToken.current}@@@@@wisetyp:${WiseTypeDropdown}@@@@@by_side:MAKECALL@@@@@demo:demo`;

      // console.log("request below",request);

      const responceBelow = await BelowPriceRequest({ request: request })

      if (responceBelow) {
        setShowAlert(true);
        setTextAlert("Trade Executed Successfully");
        setAlertColor("success");
        window.location.reload()
        SetForDisabledSubmit(true)
        setRefreshscreen(!refreshscreen);
       
      }

      // placeOrderExcuted_below(request);

    } else if (EntryPriceBA == "above") {
      // console.log("inside above");

      let request = `id:11@@@@@input_symbol:${scriptname}@@@@@type:${tradeType}@@@@@price:${price}@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:${panelKey}@@@@@exchange:${exchange}@@@@@product_type:MIS@@@@@strike:2500@@@@@segment:${scriptSeg}@@@@@option_type:${CallType}@@@@@expiry:${expiryOnChange}@@@@@strategy:${strategy}@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@chain:option_chain@@@@@targeprice:${target1}@@@@@stoplossprice:${stoploss}@@@@@token:${liveToken.current}@@@@@wisetyp:${WiseTypeDropdown}@@@@@by_side:MAKECALL@@@@@demo:demo`;

      // console.log("request Above", request);

      const responceAbove = await AbovePriceRequest({ request: request })
      if (responceAbove) {
        setShowAlert(true);
        setTextAlert("Trade Executed Successfully");
        setAlertColor("success");
        window.location.reload()
        SetForDisabledSubmit(true)
        setRefreshscreen(!refreshscreen);


      }

      // placeOrderExcuted_above(request);
    }



  }










  // function placeOrderExcuted(request) {

  //   console.log("request", request)
  //   console.log("Config.broker_signal_url", Config.broker_signal_url)



  //   // return
  //   var config = {
  //     method: 'post',
  //     url: `${Config.broker_signal_url}`,
  //     headers: {
  //       'Content-Type': 'text/plain'
  //     },
  //     data: request
  //   };

  //   axios(config)
  //     .then(function (response) {
  //       console.log(JSON.stringify(response.data));
  //       setShowAlert(true);
  //       setTextAlert("Trade Executed Successfully");
  //       setAlertColor("success");
  //       setRefreshscreen(!refreshscreen);
  //       //   console.log(JSON.stringify(response.data));
  //       BackendSocketApi(useridAlice, usersessionAlice)
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });



  // }

  // function placeOrderExcuted_below(request) {

  //   console.log("below - ", request);
  //   const data = {
  //     request: request
  //   }
  //   var config = {
  //     method: 'post',
  //     url: `${Config.base_url}manual/placeOrderExcuted_below`,
  //     headers: {

  //     },
  //     data: data

  //   };

  //   axios(config)
  //     .then(function (response) {
  //       console.log("response.data - ", response.data);
  //       setShowAlert(true);
  //       setTextAlert("Trade Executed Successfully");
  //       setAlertColor("success");
  //       setRefreshscreen(!refreshscreen);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });




  // }

  // function placeOrderExcuted_above(request) {

  //   console.log("below - ", request);
  //   const data = {
  //     request: request
  //   }
  //   var config = {
  //     method: 'post',
  //     url: `${Config.base_url}manual/placeOrderExcuted_above`,
  //     headers: {

  //     },
  //     data: data

  //   };

  //   axios(config)
  //     .then(function (response) {
  //       console.log("response.data - ", response.data);
  //       setShowAlert(true);
  //       setTextAlert("Trade Executed Successfully");
  //       setAlertColor("success");
  //       setRefreshscreen(!refreshscreen);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });




  // }






  const SubmitMakeCall = async (e) => {


    // e.preventDefault();

    // if (selectCatagoryid == "") {
    //   alert("Please Select a Script  Type")
    //   return
    // }
    // if (strategy == "") {
    //   alert("Please Select a Strategy")
    //   return
    // }
    // if (strategy == "") {
    //   alert("Please Select a Strategy")
    //   return
    // }
    // if (scriptname == "") {
    //   alert("Please Select a Script Name")
    //   return
    // }
    // if (shares == "") {
    //   alert("Please Select Aleast 1 Shares/Lot")
    //   return
    // }
    // if (lot == '') {
    //   alert("Please Select a Lot Size")
    //   return
    // }
    // if (CallType == '') {
    //   alert("Please Select a Call Type")
    //   return
    // }
    // if (tradeType == '') {
    //   alert("Please Select a Trade Type")
    //   return
    // }
    // if (EntryPrice == '') {
    //   alert("Please Select a Entry Price")
    //   return
    // }
    // if (EntryPriceBA == '') {
    //   alert("Please Select a Entry Price Below/Above")
    //   return
    // }
    // if (persentage == '') {
    //   alert("Please Select  a Persentage")
    //   return
    // }
    // if (target1 == '') {
    //   alert("Please Set Target1 Value")
    //   return
    // }

    // if (target1persentage == '') {
    //   alert("Please Set Target1 Per. Value")
    //   return
    // }
    // if (target1perWise == '') {
    //   alert("Please Set Target1 Persentage Wise Value")
    //   return
    // }
    // if (target2 == '') {
    //   alert("Please Set Target2 Value")
    //   return
    // }
    // if (target2perWise == '') {
    //   alert("Please Set Target2 Persentage Wise Value")
    //   return
    // }
    // if (stoploss == '') {
    //   alert("Please Set Stop/Loss Value")
    //   return
    // }
    // if (stoploss == '') {
    //   alert("Please Set Stop/Loss Persentage Value")
    //   return
    // }
    // if (prefix == '') {
    //   alert("Please Select  a Prefix")
    //   return
    // }
    // if (srefix == '') {
    //   alert("Please Select  a Suffix")
    //   return
    // }


  }


  useEffect(() => {
    GetScriptDataFunction()
    GetStrategyDataFunction()
    getPanelKeys()
    //getSocketData();
  }, [refreshscreen])

  useEffect(() => {
    GetServiceDataFunction()

    let datra = scriptdata && scriptdata.filter((x) => {
      if ((selectCatagoryid) == parseInt(x.id)) {
        return x
      }
    })


    let stExhange = scriptdata && scriptdata.filter((x) => {
      if (onChangeScriptname.includes(x.name)) {
        return x
      }
    })


    SetScriptSeg(datra && datra[0].segment)
    SetScriptExchangeValue(datra && datra[0].name)

    // console.log("datra", datra && datra[0].segment);
  }, [selectCatagoryid])


  const forGetAliceToken = async () => {
    const tokenRes = await GetAliceTokenAndID()

    if (tokenRes.status = "true") {

      SocketSession(tokenRes.data[0].client_code, tokenRes.data[0].access_token);

      //BackendSocketApi(tokenRes.data[0].client_code,tokenRes.data[0].access_token);
      setUseridAlice(tokenRes.data[0].client_code);
      setUsersessionAlice(tokenRes.data[0].access_token);



    } else {
      console.log("AlcieTokenError", tokenRes)

    }

  }


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


  const SocketSession = async (userId, accesstoken) => {
    const socketres = await CreateSocketSession(userId, accesstoken)
    if (socketres.data.message == "SUCCESS") {
      setSocketSessionId(socketres.data.result.wsSess)
      connect(socketres.data.result.wsSess, userId, accesstoken)
    }
  }
  const url = "wss://ws1.aliceblueonline.com/NorenWS/";
  let socket;

  function connect(ss, userId, userSession) {

    socket = new WebSocket(url);
    socket.onopen = function () {

      connectionRequest(userId, userSession);
      console.log("userId", typeof userId)
      console.log("userId", userSession)
      setSockets(socket)
      //  console.log("socket connect ",sockets);

    };
    socket.onmessage = function (msg) {


      var response = JSON.parse(msg.data);
      console.log("hello world", response)




      if (response.tk) {
        if (response.lp != undefined) {
          console.log('response token', response.lp)

          console.log("response -soket ", response);
          // setLiveprice(response.lp);
          if (response.tk == liveToken.current) {

            setLiveprice(response.lp);

            //  SetEntryPrice

            if (response.sp1 != undefined) {
              setStockSellPrice(response.sp1)
            } if (response.bp1 != undefined) {
              setStockBuyPrice(response.bp1);
            }

          } else {

            setLiveprice("")
          }


          $(".liveprice" + response.tk).html(response.lp);
          // $(".showdataEP" + response.tk).html(response.lp);

        }

        if (response.pc != undefined) {
          if (response.pc > 0) {
            $('.liveprice' + response.tk).css({ "color": "green" });

          }
          else if (response.pc < 0) {
            $('.liveprice' + response.tk).css({ "color": "red" });

          }
          else if (response.pc == 0) {
            $('.liveprice' + response.tk).css({ "color": "black" });

          }
        }



      }


    }

    socket.onclose = function (event) {
      if (event.wasClean) {
        // console.log("socket close 1");
        // console.log("close socet 1",userId);
        connect("", userId, userSession);
        //  forGetAliceToken();
        //  alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        //  TokenAndClientCode(returntokenstring)
      } else {
        // console.log("close socet 2",userId);
        connect("", userId, userSession);
        //   forGetAliceToken();
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        //  alert(returntokenstring);
        //  alert('[close] Connection died');
        //TokenAndClientCode(returntokenstring)
      }
    };

    socket.onerror = function (error) {
      //  console.log("close socet 3",userId);
      connect("", userId, userSession);
      //  console.log("socket error 1");
      //  forGetAliceToken();
      // TokenAndClientCode(returntokenstring)
      // alert(returntokenstring);
      // alert(`[error]`);
    };


  }

  const connectionRequest = async (userId, accesstoken) => {

    var encrcptToken = CryptoJS.SHA256(
      CryptoJS.SHA256(accesstoken).toString()
    ).toString();


    var req = {
      susertoken: encrcptToken,
      t: "c",
      actid: userId + "_" + 'API',
      uid: userId + "_" + 'API',
      source: 'API',
    };

    // const socketres = await   CreateSocketConnection(req)
    // console.log("socketres" ,socketres)

    socket.send(JSON.stringify(req));
    console.log("req", req)

  }





  useEffect(() => {
    // SocketSession()
    forGetAliceToken()
  }, [])


  useEffect(() => {

  }, [sockets]);



  const selecttype = (value) => {
    console.log("shakir", value);
    $('.show_entry_price').val('')

    // LE = buy
    // SE = sell

    if (value == "LE") {
      // SetEntryPrice(stockSellPrice);
      //  alert(stockSellPrice);
      $('.show_entry_price').val(stockSellPrice)

    } else if (value == "SE") {
      SetEntryPrice(stockBuyPrice);
      //  alert(stockBuyPrice);
      $('.show_entry_price').val(stockBuyPrice)
    } else {
      SetEntryPrice('');
    }
  }

  const dropdownSelect = (num) => {
    if (num == "1") {
      return setChangeDropdown(1)
    } else if (num == "0") {
      return setChangeDropdown(0)
    }
  }

  // const selectedValue = useRef(0)

  const handleKeyPress = (event) => {
    const key = event.key;
    const isNumber = /^\d$/.test(key);
    const isDecimal = key === ".";
    if (!isNumber && !isDecimal) {
      event.preventDefault();
    }
  };


  return (
    <div>

      <div className='row bg-gray'>
        <div className='col-md-4'>
          <div className="form-group">
            <label for="exampleFormControlSelect1">Script Type * -</label>
            <select className="form-select" aria-label="Default select example" onChange={(e) => {
              SetSelectCatagoryId(e.target.value);
              SetonChangeScriptname(e.target.innerText)
              setScriptDataErr('')
              SetScriptname("")
              SetForDisabledSubmit(false)
            }} >
              <option
                name="none" disabled selected>Select Script Type</option>
              {scriptdata && scriptdata?.map((x, index) => {
                if (x.segment !== "O" && x.segment !== "FO") {
                  return <option key={index} name={x.name} value={x.id}>{x.name}</option>
                }
              })}
            </select>
            {scriptErr ? <p style={{ color: "#ff8888" }}> *{scriptErr}</p> : ''}
          </div>
        </div>
        <div className='col-md-4'>
          <div className="form-group">
            <label for="exampleFormControlSelect1">Select Strategy -</label>
            <select className="form-select" aria-label="Default select example" onChange={(e) => { setStrategy(e.target.value); setStrategyErr(''); SetForDisabledSubmit(false) }} value={strategy}>
              <option disabled selected>Select Strategy</option>
              {
                stretegydata && stretegydata.map((x) => {
                  return <option value={x.name}>{x.name}</option>
                })
              }
            </select>
            {strategyErr ? <p style={{ color: "#ff8888" }}> *{strategyErr}</p> : ''}

          </div>
        </div>

        <div className="col-md-4">
          <label className="text-secondary" style={{ fontWeight: 'bold', color: 'black' }}>EXPIRY DATE</label>
          <select className="form-select" name="expiry_date" onChange={(e) => { setExpiryOnChange(e.target.value) }} selected>
            {/* <option value="">Select Expiry Date</option> */}
            {expirydateSelect && expirydateSelect?.map((sm, i) =>
              <option value={sm.expiry}>{sm.expiry_str}</option>)}

          </select>
        </div>


        <div className='col-md-4'>
          <div className="form-group">
            <label for="exampleFormControlSelect1">Script Name -</label>
            <select className="form-select" aria-label="Default select example" onChange={(e) => { SetScriptname(e.target.value); SetScriptnameErr(''); selecttype(''); dropdownSelect("1") }}>
              <option disabled selected>Select Script Name -</option>
              {
                servicedata && servicedata.map((x) => {
                  return <option value={x.service}>{x.service}</option>
                })
              }
            </select>
            {scriptnameErr ? <p style={{ color: "#ff8888" }}> *{scriptnameErr}</p> : ''}
          </div>
        </div>


        {/* <div className='col-md-3'>
          <div className="form-group">
            <label for="exampleFormControlInput1">Script Name -</label>
            <input type="text" className="form-control" />
          </div>
        </div> */}
        {/* <div className='col-md-4'>
          <div className="form-group">
            <label for="exampleFormControlInput1">No Of Shares / Lot -</label>
            <input type="text" className="form-control" onChange={(e) => { setShares(e.target.value.replace(/^[0-9]\d{0,2}(\.\d{1,2})?%?$/g, "")); setSharesErr("") }} value={shares} />
          </div>
          {sharesErr ? <p style={{ color: "#ff8888" }}> *{sharesErr}</p> : ''}

        </div> */}
      </div>
      <div className='row mt-5 bg-gray'>
        {/* <div className='col-md-4'>
          <label for="exampleFormControlSelect1">Lot Type-</label>
          <div className="row">
            <div className="col-sm-3">
              <div className="radio">
                <label><input type="radio" name="lot" checked />Lot</label>
              </div>
            </div>
            <div className="col-sm-3" id="sharesize" style={{ display: 'none' }}>
              <div className="radio">
                <label><input type="radio" name="lot" />Share</label>
              </div>
            </div>
            <div className="col-sm-6">
              <label className="form-label">1 Lot </label> = <input type="text" style={{ width: '50px' }} name="one_lot_equal" id="one_lot_equal_i" onChange={(e) => { setLot(e.target.value.replace(/[^0-9]/g, "")); setLotErr('') }} value={lot} />
            </div>
          </div>
          {lotErr ? <p style={{ color: "#ff8888" }}> *{lotErr}</p> : ''}
        </div> */}
        {/* <div className='col-md-4'>
          <div className="form-group">
            <label for="exampleFormControlSelect1">Call Type -</label>
            <select className="form-select" aria-label="Default select example" onChange={(e) => { setCallType(e.target.value); setCallTypeErr('') }}>
              <option disabled selected>Select CallType</option>
              <option value="Call" >Call</option>
              <option value="Put">Put</option>
            </select>
            {CallTypeErr ? <p style={{ color: "#ff8888" }}> *{CallTypeErr}</p> : ''}
          </div>
        </div> */}
        <div className='col-md-4'>
          <div className="form-group">
            <label for="exampleFormControlSelect1" >Type -</label>
            <select className="form-select" aria-label="Default select example" onChange={(e) => { setTradeType(e.target.value); setTradeTypeErr(''); selecttype(e.target.value); dropdownSelect("0") }}>
              <option selected={changeDropdown == 1} value="">Select Trade Type</option>
              <option value="LE">Buy</option>
              <option value="SE">Sell</option>
            </select>
            {tradeTypeErr ? <p style={{ color: "#ff8888" }}> *{tradeTypeErr}</p> : ''}

          </div>
        </div>
        <div className='col-md-4'>
          <div className="form-group">
            <label for="exampleFormControlInput1">Entry Price  :  </label><span className={'liveprice' + liveToken.current}>{liveprice}</span>
            <input type="text" name="exampleFormControlInput1" className="form-control show_entry_price" onKeyPress={handleKeyPress} onChange={(e) => {
              SetEntryPrice(e.target.value);
              SetEntryPriceErr('')
            }} checked />
            <div className="row mt-2">
              <div className="col-sm-4 col-lg-4">
                <div className="radio" >
                  <label for="at_check"><input id="at_check" value="at" type="radio" name="at_check" onChange={(e) => { SetEntryPriceBA(e.target.value); SetEntryPriceBAErr('') }} />At</label>
                </div>
              </div>
              <div className="col-sm-4 col-lg-4">
                <div className="radio">
                  <label for="at_above"><input id="at_above" value="above" type="radio" name="at_check" onChange={(e) => { SetEntryPriceBA(e.target.value); SetEntryPriceBAErr('') }} />Above</label>
                </div>
              </div>
              <div className="col-sm-4 col-lg-4">
                <div className="radio">
                  <label for="at_below"><input id="at_below" value="below" type="radio" name="at_check" onChange={(e) => { SetEntryPriceBA(e.target.value); SetEntryPriceBAErr('') }} />Below</label>
                </div>

              </div>
            </div>
          </div>
          {EntryPriceErr ? <p style={{ color: "#ff8888" }}> *{EntryPriceErr}</p> : ''}
          {EntryPriceBAErr ? <p style={{ color: "#ff8888" }}> *{EntryPriceBAErr}</p> : ''}

        </div>
      </div>
      <div className='row mt-5 bg-gray'>
        {/* <div className='col-md-4'>
          <div className="form-group">
            <label for="exampleFormControlSelect1">Number Percentage</label>
            <input type="text" className="form-control" onChange={(e) => { setPersentage(e.target.value.replace(/^[0-9]\d{0,2}(\.\d{1,2})?%?$/m, "")); setPersentageErr('') }} value={persentage} />
          </div>
          {persentageErr ? <p style={{ color: "#ff8888" }}> *{persentageErr}</p> : ''}
        </div> */}










        <div className='col-md-4 '>
          <div className="form-group ">
            <div className="row">
              <label for="exampleFormControlSelect1" >Wise Type -</label>
              <select className="form-select" aria-label="Default select example" onChange={(e) => { setWiseTypeDropdown(e.target.value); setWiseTypeDropdownErr('') }}>
                <option selected={changeDropdown == 1} value="">Select Trade Type</option>
                <option value="1">Percentage(%)</option>
                <option value="2">Points</option>
              </select>
              {tradeTypeErr ? <p style={{ color: "#ff8888" }}> *{tradeTypeErr}</p> : ''}
            </div>
          </div>
        </div>
        <div className='col-md-4'>
          <div className="form-group ">
            <div className="row">
              <label className="form-label">Target -</label>
              {/* <div className="col-sm-5 col-lg-6"> */}
              <input type="text" className="form-control" onChange={(e) => { setTarget1(e.target.value); setTarget1Err("") }} />
              {target1Err ? <p style={{ color: "#ff8888", fontSize: '10px' }}> *{target1Err}</p> : ''}
            </div>
          </div>
        </div>
        <div className='col-md-4'>
          <div className="form-group">
            <div className="row">
              <label className="form-label">Stop Loss -</label>
              <div className="col-sm-5 col-lg-9">
                <input type="text" className="form-control" onChange={(e) => { setStopLoss(e.target.value); setStopLossErr('') }} />

              </div>
              {/* <div className="col-sm-3 col-lg-3 ps-0">
                <input type="text" className="form-control " placeholder="% Wise" onChange={(e) => { setStopLossPer(e.target.value); setStopLossPerErr('') }} />
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <button type="submit" className="btn btn-fill w-auto" onClick={(e) => GenerateMakeCall(e)} disabled={ForDisabledSubmit}
        >Generate</button>
      </div>

      <hr />

      <div className='row mt-5 bg-gray'>
        <Wraper id="BelowAbove" />
        {/* <div className='col-md-6'>
          <div className="form-group">
            <label for="exampleFormControlSelect1">Prefix -</label>
            <select className="form-select" aria-label="Default select example" onChange={(e) => { setPrefix(e.target.checked); setPrefixErr('') }}  >
              <option selected disabled>Select Prefix</option>
              <option value="equity">Equity</option>
              <option value="commodity">Commodity</option>
              <option value="mcx">MCX</option>
            </select>
            {prefixErr ? <p style={{ color: "#ff8888" }}> *{prefixErr}</p> : ''}

          </div>
        </div>
        <div className='col-md-6'>
          <div className="form-group">
            <label for="exampleFormControlSelect1">Shift + Enter to Send (Character - 9 )</label>
            <input type="text" className="form-control" placeholder='Suffix' onChange={(e) => { setSrefix(e.target.value); setSrefixErr('') }} />
          </div>
        </div>
        <div className='col-md-12'>
          <textarea className='form-control'></textarea>
        </div> */}

      </div>
      <div className='row'>
        <button type="submit" className="btn btn-fill w-auto" onClick={(e) => SubmitMakeCall(e)} >Save</button>
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


  )
}

export default MakeCalls