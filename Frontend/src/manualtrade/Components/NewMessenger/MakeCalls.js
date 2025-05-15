import React, { useEffect, useState, useContext, useCallback, useRef } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { getScriptData, getStrategyData, getServiceData, getPanelKey, BrokerSignalsApi, gettokenbysocket, getexpirymanualtrade,getAllStrikePriceApi, AbovePriceRequest, BelowPriceRequest,RangePriceRequest, AtEntryPriceRequest,UpdatemakecallatRequest } from '../../ApiCalls/Api.service'
import {  GetAliceTokenAndID } from '../../ApiCalls/AliceBlueSocket.service'
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import axios from "axios";
import AlertToast from "../../../common/AlertToast";
import $ from "jquery";
import * as Config from "../../../common/Config";
import Wraper from "./PriceBelowAbove/Wraper"
import socketIOClient from "socket.io-client";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const MakeCalls = () => {
  // const contextdata = useContext(ContextCreate)

  const manual_dash = localStorage.getItem("manual_dash");
  const client_token = localStorage.getItem('client_token');
  const client_id = localStorage.getItem("client_id");
  const [clientDetailsStatus, setClientDetailsStatus] = useState(0);

  const [clientClientKey, setClientClientKey] = useState("");

  const [clientDeatils, setClientDetails] = useState("");

  const [userPermissionType, setUserPermissionType] = useState([]);

  const [clientSegment, setClientSegment] = useState([]);

  
  console.log("clientSegment - ",clientSegment);


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
          console.log("daaaaata client", res.data.msg.client_key);
          setClientDetails(res.data.msg);
          setClientClientKey(res.data.msg.client_key);
          setClientSegment((res.data.msg.segment_all).split(',').map(Number));
          clientStartegyDataApi()
        }
      
      });
    
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

 console.log("f_condition",f_condition);

  //////////////



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
  
  const [EntryPriceRange_one, SetEntryPriceRange_one] = useState('')
  const [EntryPriceRange_oneErr, SetEntryPriceRange_oneErr] = useState('')
  const [EntryPriceRange_two, SetEntryPriceRange_two] = useState('')
  const [EntryPriceRange_twoErr, SetEntryPriceRange_twoErr] = useState('')
  
  // console.log("EntryPriceRange_one" ,EntryPriceRange_one);
  // console.log("EntryPriceRange_two" ,EntryPriceRange_two);




  const [EntryPriceBA, SetEntryPriceBA] = useState('at')
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
  const [expiryOnChange, setExpiryOnChange] = useState('');
 

  const [liveprice, setLiveprice] = useState("");
  const [changeDropdown, setChangeDropdown] = useState(0)
  const [showhideAtBelow, setShowhideAtBelow] = useState(0)
  const [showhideTargetStoploss, setShowhideTargetStoploss] = useState(0)
  const [targetStoplossDropdown, setTargetStoplossDropdown] = useState('')
  console.log("targetStoplossDropdown - ",targetStoplossDropdown);

  
  
  const [WiseTypeDropdown, setWiseTypeDropdown] = useState("0")
  const [IntradayDelivery, setIntradayDelivery] = useState("0")
  const [IntradayDeliveryErr, setIntradayDeliveryErr] = useState("0")
  const [WiseTypeDropdownErr, setWiseTypeDropdownErr] = useState("")
  const [markettime, setMarkettime] = useState("1")
  const [showmarkettime, setShowMarkettime] = useState(1)

 

  const [optionType, setOptionType] = useState('')
  const [optionTypeErr, setOptionTypeErr] = useState('')

  const [strikePriceAll, setStrikePriceAll] = useState([]);
  const [strikePrice, setStrikePrice] = useState('')
  const [strikePriceErr, setStrikePriceErr] = useState('')
  const [showstrikePrice, setShowstrikePrice] = useState(0)
  

  

  const [useridAlice, setUseridAlice] = useState("")
  const [usersessionAlice, setUsersessionAlice] = useState("");
  const [socket1, setSocket1] = useState(null);

  //console.log("changeDropdown", changeDropdown);
  //console.log("changeDropdown", changeDropdown);


  //  for socket session
  const [sockets, setSockets] = useState(null);

  const previousToken = useRef("")
  const liveToken = useRef("");

  // AlertToast
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");

  const [refreshscreen, setRefreshscreen] = useState(false);

  const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  const [selectedTimeExit, setselectedTimeExit] = useState('');
  
  const [selectedTimeNoTrade, setselectedTimeNoTrade] = useState('');

  const userAliceblueIdRef = useRef("");
  const userAliceblueTokenRef = useRef("");

  const userAlicebluetype = useRef("");
  const userAliceblueBASEURL = useRef("");
  const userAliceblueSOCKETURL = useRef("");
  const middlestrikepriceRef = useRef("");
  


  //console.log("time selectedTime" ,selectedTimeExit);

  const handleTimeChangeExit = (event) => {
    setselectedTimeExit(event.target.value);
  };

  const handleTimeChangeNoTrade = (event) => {
    setselectedTimeNoTrade(event.target.value);
  };
 
 
  



  //console.log("sockets", sockets);
  //console.log("expiryOnChange check", expiryOnChange);


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
    const data = {id: selectCatagoryid }

    const response = await getServiceData(data, admin_token)

    //console.log("service data", response);

    if (response.status) {
      SetServicedata(response.data.services);
    }
  }






// old code manage //

  // useEffect(() => {
  //   gettoken()
  // }, [scriptname]);


  // useEffect(() => {
  //   getExpirybackend(selectCatagoryid)
  // }, [selectCatagoryid]);
///////////

// useEffect(() => {
//   gettoken()
// }, [scriptname]);


useEffect(() => {
 getExpirybackend(selectCatagoryid,scriptname)
}, [scriptname]);





  const getExpirybackend = async (selectCatagoryid,symbol) => {

    const data = { categorie_id: selectCatagoryid , symbol : symbol }
    const response = await getexpirymanualtrade(data);
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


  const GetNotification = async () => {

    var urls = Config.base_url;

    const socket11 = socketIOClient(`${urls}`);
    socket11.on("make_call_trade", (data) => {
      setSocket1(socket11)
      //console.log("data socket", data);
      setShowAlert(true);
      setTextAlert(data.msg);
      setAlertColor("success");
      setRefreshscreen(!refreshscreen);
      if(manual_dash == null){
        navigate('/client/manualopenpositions')

      }else{
        navigate('/manual/manualopenpositions')

      }
      
      

    });

  }










  const GenerateMakeCall = async (e) => {

   // alert(markettime)
   // alert(selectedTimeExit)
   // alert(selectedTimeNoTrade)
   //alert(expiryOnChange)

    e.preventDefault();
    if (selectCatagoryid == "") {
      alert("Please Select a Script  Type")
      return
    }

    if (scriptname == "") {
      alert("Please Select a Script Name")
      return
    }
 

   if(selectCatagoryid != '24'){ 
    if (expiryOnChange == "") {
      alert("Please Select a Expiry")
      return
    }
  }

  


  if(selectCatagoryid == '26' || selectCatagoryid == '35' || selectCatagoryid == '36'){ 
    if (strikePrice == "") {
      alert("Please Select a strike price")
      return
    }
    if (optionType == "") {
      alert("Please Select a Option Type")
      return
    }
  }
    


    if (strategy == "") {
      alert("Please Select a Strategy")
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
   
  if(EntryPriceBA == 'range'){
   if(EntryPriceRange_one == ''){
    alert("Please Select a price from")
      return
   }
   if(EntryPriceRange_two == ''){
    alert("Please Select a price to")
      return
   }

      
  }else{
    if (EntryPrice == '') {
      alert("Please Select a Entry Price")
      return
    }
  }
  
    


    if (EntryPriceBA == '') {
      alert("Please Select a  Above/Below/Range")
      return
    }

    if(IntradayDelivery == '0'){
      alert("Please Select a  Intraday OR Delivery")
      return
    }

    if(IntradayDelivery == '1'){
      
        if(EntryPriceBA == "at"){
          if(selectedTimeExit == ''){
            alert("Please Select a Intraday Time Exit")
            return
            }
        }else{
          if(selectedTimeExit == ''){
            alert("Please Select a Intraday Time Exit")
            return
            }
  
            if(selectedTimeNoTrade == ''){
              alert("Please Select a Intraday No Trade Time")
              return
            }
        }

    }

    if(IntradayDelivery == '2'){
      if(selectedTimeNoTrade == ''){
        alert("Please Select a Delivery No Trade Time")
        return
       }
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

    if (selectCatagoryid == "25" || selectCatagoryid == "26") {
      exchange = "NFO";
    } else if (selectCatagoryid == "34" || selectCatagoryid == "35") {
      exchange = "MCX";
    } else if (selectCatagoryid == "36" || selectCatagoryid == "37") {
      exchange = "CDS";
    }



            let panel_key_trade = "";
            if(manual_dash == null){
              panel_key_trade = clientClientKey
            }else{
              panel_key_trade = panelKey
            }



    var request = `id:11@@@@@input_symbol:${scriptname}@@@@@type:${tradeType}@@@@@price:${price}@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:${panel_key_trade}@@@@@exchange:${exchange}@@@@@product_type:MIS@@@@@strike:${strikePrice==''?'100':strikePrice}@@@@@segment:${scriptSeg}@@@@@option_type:${CallType}@@@@@expiry:${expiryOnChange}@@@@@strategy:${strategy}@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@chain:option_chain@@@@@targeprice:${target1}@@@@@stoplossprice:${stoploss}@@@@@token:${liveToken.current}@@@@@by_side:MAKECALL@@@@@demo:demo`;

    console.log("okk request", request);
   // console.log("okk EntryPriceBA", EntryPriceBA);



    if (EntryPriceBA == "at") {
      console.log("test");


      const responceAt = await AtEntryPriceRequest(request)

     // console.log("response 1",responceAt.status);
      //console.log("response",responceAt.data.id);
   if (responceAt) {
    if(responceAt.data.status == false){
      setShowAlert(true);
      setTextAlert(responceAt.data.msg);
      setAlertColor("error");
      SetForDisabledSubmit(true)
      setRefreshscreen(!refreshscreen);
    }else{
   
      if(WiseTypeDropdown != "0" && WiseTypeDropdown != ""){
         const update_at_data = {
         id : responceAt.data.id,
         wisetype : WiseTypeDropdown,
         target :target1,
         stoploss: stoploss,
         price : price,
         intraday_delivery : IntradayDelivery,
         exit_time : selectedTimeExit.replace(':', '-'),
         notrade_time : selectedTimeNoTrade.replace(':', '-'),
         wise_type_condition : "ok",
        }  
        await UpdatemakecallatRequest(update_at_data);
        }
        else{

          const update_at_data = {
            id : responceAt.data.id,
            price : price,
            intraday_delivery : IntradayDelivery,
            exit_time : selectedTimeExit.replace(':', '-'),
            notrade_time : selectedTimeNoTrade.replace(':', '-'),
            wise_type_condition : "Notok",
           }  
           await UpdatemakecallatRequest(update_at_data);

        }

    
        setShowAlert(true);
        setTextAlert("Trade Executed Successfully");
        setAlertColor("success");
        SetForDisabledSubmit(true)
        setRefreshscreen(!refreshscreen);
        BackendSocketApi(userAliceblueIdRef.current, userAliceblueTokenRef.current)
        if(manual_dash == null){
          navigate('/client/manualopenpositions')

        }else{
          navigate('/manual/manualopenpositions')

        }
        //   console.log(JSON.stringify(response.data));
        setStrategy("")

       }


      }

    
    } else if (EntryPriceBA == "below") {

      let request = `id:11@@@@@input_symbol:${scriptname}@@@@@type:${tradeType}@@@@@price:${price}@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:${panel_key_trade}@@@@@exchange:${exchange}@@@@@product_type:MIS@@@@@strike:${strikePrice==''?'100':strikePrice}@@@@@segment:${scriptSeg}@@@@@option_type:${CallType}@@@@@expiry:${expiryOnChange}@@@@@strategy:${strategy}@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@chain:option_chain@@@@@targeprice:${target1}@@@@@stoplossprice:${stoploss}@@@@@token:${liveToken.current}@@@@@wisetyp:${WiseTypeDropdown}@@@@@intraday_delivery:${IntradayDelivery}@@@@@exit_time:${selectedTimeExit.replace(':', '-')}@@@@@notrade_time:${selectedTimeNoTrade.replace(':', '-')}@@@@@rangePriceOne:${EntryPriceRange_one}@@@@@rangePriceTwo:${EntryPriceRange_two}@@@@@TargetStoplossStatus:${targetStoplossDropdown}@@@@@AboveBelowRange:${EntryPriceBA}@@@@@marketTimeAmo:${markettime}@@@@@by_side:MAKECALL@@@@@demo:demo`;
        
     
      
      
      const responceBelow = await BelowPriceRequest({ request: request })

      if (responceBelow) {

        if(responceBelow.data.status == false){
        setShowAlert(true);
        setTextAlert(responceBelow.data.msg);
        setAlertColor("error");
      //  SetForDisabledSubmit(true);
        setRefreshscreen(!refreshscreen);

        }else{

        setShowAlert(true);
        setTextAlert("Trade Executed Successfully");
        setAlertColor("success");
        SetForDisabledSubmit(true)
        BackendSocketApi(userAliceblueIdRef.current, userAliceblueTokenRef.current)
        window.location.reload()
        setRefreshscreen(!refreshscreen);
        }
       
      }

    

    } else if (EntryPriceBA == "above") {
      // console.log("inside above");

      let request = `id:11@@@@@input_symbol:${scriptname}@@@@@type:${tradeType}@@@@@price:${price}@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:${panel_key_trade}@@@@@exchange:${exchange}@@@@@product_type:MIS@@@@@strike:${strikePrice==''?'100':strikePrice}@@@@@segment:${scriptSeg}@@@@@option_type:${CallType}@@@@@expiry:${expiryOnChange}@@@@@strategy:${strategy}@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@chain:option_chain@@@@@targeprice:${target1}@@@@@stoplossprice:${stoploss}@@@@@token:${liveToken.current}@@@@@wisetyp:${WiseTypeDropdown}@@@@@intraday_delivery:${IntradayDelivery}@@@@@exit_time:${selectedTimeExit.replace(':', '-')}@@@@@notrade_time:${selectedTimeNoTrade.replace(':', '-')}@@@@@rangePriceOne:${EntryPriceRange_one}@@@@@rangePriceTwo:${EntryPriceRange_two}@@@@@TargetStoplossStatus:${targetStoplossDropdown}@@@@@AboveBelowRange:${EntryPriceBA}@@@@@marketTimeAmo:${markettime}@@@@@by_side:MAKECALL@@@@@demo:demo`;

      // console.log("request Above", request);

      const responceAbove = await AbovePriceRequest({ request: request })
      if (responceAbove) {

        if(responceAbove.data.status == false){
          setShowAlert(true);
          setTextAlert(responceAbove.data.msg);
          setAlertColor("error");
        //  SetForDisabledSubmit(true);
          setRefreshscreen(!refreshscreen);
  
          }else{

        SetForDisabledSubmit(true)
        setShowAlert(true);
        setTextAlert("Trade Executed Successfully");
        setAlertColor("success");
        BackendSocketApi(userAliceblueIdRef.current, userAliceblueTokenRef.current)
        window.location.reload()
        setRefreshscreen(!refreshscreen);

          }


      }

      
    }
    else if (EntryPriceBA == "range") {
      // console.log("inside above");

      let request = `id:11@@@@@input_symbol:${scriptname}@@@@@type:${tradeType}@@@@@price:${price}@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:${panel_key_trade}@@@@@exchange:${exchange}@@@@@product_type:MIS@@@@@strike:${strikePrice==''?'100':strikePrice}@@@@@segment:${scriptSeg}@@@@@option_type:${CallType}@@@@@expiry:${expiryOnChange}@@@@@strategy:${strategy}@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@chain:option_chain@@@@@targeprice:${target1}@@@@@stoplossprice:${stoploss}@@@@@token:${liveToken.current}@@@@@wisetyp:${WiseTypeDropdown}@@@@@intraday_delivery:${IntradayDelivery}@@@@@exit_time:${selectedTimeExit.replace(':', '-')}@@@@@notrade_time:${selectedTimeNoTrade.replace(':', '-')}@@@@@rangePriceOne:${EntryPriceRange_one}@@@@@rangePriceTwo:${EntryPriceRange_two}@@@@@TargetStoplossStatus:${targetStoplossDropdown}@@@@@AboveBelowRange:${EntryPriceBA}@@@@@marketTimeAmo:${markettime}@@@@@by_side:MAKECALL@@@@@demo:demo`;

      // console.log("request Above", request);

      const responceAbove = await RangePriceRequest({ request: request })
      if (responceAbove) {

        if(responceAbove.data.status == false){
          setShowAlert(true);
          setTextAlert(responceAbove.data.msg);
          setAlertColor("error");
          //SetForDisabledSubmit(true);
          setRefreshscreen(!refreshscreen);
  
          }else{

        SetForDisabledSubmit(true)
        setShowAlert(true);
        setTextAlert("Trade Executed Successfully");
        setAlertColor("success");
        BackendSocketApi(userAliceblueIdRef.current, userAliceblueTokenRef.current)
        window.location.reload()
        setRefreshscreen(!refreshscreen);

          }


      }

      
    }



  }







  useEffect(() => {
    GetScriptDataFunction()
    GetStrategyDataFunction()
    getPanelKeys();
    GetNotification();
    
    //getSocketData();
  }, [refreshscreen,socket1])

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

      if(tokenRes.data[0].trading == 1){
        invalidateSession(tokenRes.data[0].client_code, tokenRes.data[0].access_token,tokenRes.data[0].type,tokenRes.data[0].baseurl_aliceblue,tokenRes.data[0].socket_url);
      }

   
      userAliceblueIdRef.current = tokenRes.data[0].client_code;
      userAliceblueTokenRef.current = tokenRes.data[0].access_token;
      userAlicebluetype.current = tokenRes.data[0].type;
      userAliceblueBASEURL.current = tokenRes.data[0].baseurl_aliceblue;
      userAliceblueSOCKETURL.current = tokenRes.data[0].socket_url;
      

      //BackendSocketApi(tokenRes.data[0].client_code,tokenRes.data[0].access_token);
      setUseridAlice(tokenRes.data[0].client_code);
      setUsersessionAlice(tokenRes.data[0].access_token);



    } else {
      console.log("AlcieTokenError", tokenRes)

    }

  }



 

  let AuthorizationToken;

  function invalidateSession(userId, userSession,type,BASEURL,SOCKETURL) {
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
          createSession(userId, userSession,type,BASEURL,SOCKETURL);
        }
      },
    });
  }

  function createSession(userId, userSession,type,BASEURL,SOCKETURL) {
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
          connect(userId, userSession,type,BASEURL,SOCKETURL);
          BackendSocketApi(userId, userSession,type,BASEURL,SOCKETURL)
        } else {
          alert(msg);
        }
      },
    });
  }


  function BackendSocketApi(userId, userSession,type="",BASEURL="",SOCKETURL="") {

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

  function connect(userId, userSession,type,BASEURL,SOCKETURL) {

    socket = new WebSocket(SOCKETURL);
    socket.onopen = function () {

      connectionRequest(userId, userSession,type,BASEURL,SOCKETURL);
     // console.log("userId", typeof userId)
    //  console.log("userId", userSession)
      setSockets(socket)
      //  console.log("socket connect ",sockets);

    };
    socket.onmessage = function (msg) {


      var response = JSON.parse(msg.data);
      console.log("hello world", response)




       if (response.tk) {
        if (response.lp != undefined) {
        //  console.log('response token', response.lp)

       //   console.log("response -soket ", response);
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
       // connect("", userId, userSession);
        //  forGetAliceToken();
        //  alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        //  TokenAndClientCode(returntokenstring)
      } else {
        // console.log("close socet 2",userId);
      //  connect("", userId, userSession);
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
      //connect("", userId, userSession);
      //  console.log("socket error 1");
      //  forGetAliceToken();
      // TokenAndClientCode(returntokenstring)
      // alert(returntokenstring);
      // alert(`[error]`);
    };


  }

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




  useEffect(() => {
    forGetAliceToken()
  }, [])


  useEffect(() => {

  }, [sockets]);



  const selecttype = (value) => {
   
    $('.show_entry_price').val('')

    // LE = buy
    // SE = sell
     
    if (value == "LE") {
       SetEntryPrice(stockSellPrice);
      //  alert(stockSellPrice);
    //  $('.show_entry_price').val(stockSellPrice)

    } else if (value == "SE") {
      SetEntryPrice(stockBuyPrice);
      //  alert(stockBuyPrice);
    //  $('.show_entry_price').val(stockBuyPrice)
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

  const getAllStrikePrice = async (selectCatagoryid,symbol,expiry,segment) => {
     
    const data = { categorie_id: selectCatagoryid , symbol : symbol ,expiry : expiry ,segment : segment}
    const response = await getAllStrikePriceApi(data);
    console.log("response strike price -",response);
   setStrikePriceAll(response.data.data);
  }


  const selectCatagoryId = (e) => {
    //console.log("category id ",e.target.value);
    setShowstrikePrice(0);
    SetServicedata('');

    previousToken.current = "";
    liveToken.current = "";
    setLiveprice("");
    setExpirydateSelect([])
    setStrikePriceAll([]);
    SetSelectCatagoryId(e.target.value);
  }


  
  const selectscriptname = (e) => {
    setShowstrikePrice(0);
    console.log("selectscriptname  ",e.target.value , 'selectCatagoryid ',selectCatagoryid );
     previousToken.current = "";
     liveToken.current = "";
     setLiveprice("");
     setExpirydateSelect([])
     setStrikePriceAll([]);
    SetScriptname(e.target.value);
    if(selectCatagoryid == '24'){
    gettoken(selectCatagoryid,e.target.value);
   }

  }



 const selectExpiryFun = (e) => {
  setStrikePriceAll([]);
  setOptionType('');
  setShowstrikePrice(0);
   
  setExpiryOnChange(e.target.value)
    if(selectCatagoryid == '25'){
    let segment = 'F' 
    gettoken(selectCatagoryid,scriptname,e.target.value,segment);
    }
    else if(selectCatagoryid == '34'){
      let segment = 'MF' 
      gettoken(selectCatagoryid,scriptname,e.target.value,segment);
      }
    else if(selectCatagoryid == '37'){
      let segment = 'cF' 
      gettoken(selectCatagoryid,scriptname,e.target.value,segment);
      }
    else if(selectCatagoryid == '26'){
      let segment ='O';
      setShowstrikePrice(1);
      getAllStrikePrice(selectCatagoryid,scriptname,e.target.value,segment)
    }
    else if(selectCatagoryid == '35'){
      let segment ='MO';
      setShowstrikePrice(1);
      getAllStrikePrice(selectCatagoryid,scriptname,e.target.value,segment)
    }
    else if(selectCatagoryid == '36'){
      let segment ='CO';
      setShowstrikePrice(1);
      getAllStrikePrice(selectCatagoryid,scriptname,e.target.value,segment)
    }

  }

  
  const selectStrikePrice = (e) => {
    if(e.target.value != ""){
      setStrikePrice(e.target.value)
      if(optionType != ''){
        if(selectCatagoryid == '26'){
        let segment = 'O' 
        gettoken(selectCatagoryid,scriptname,expiryOnChange,segment,e.target.value,optionType);
        }
       else if(selectCatagoryid == '35'){
          let segment = 'MO' 
          gettoken(selectCatagoryid,scriptname,expiryOnChange,segment,e.target.value,optionType);
          }
        else if(selectCatagoryid == '36'){
            let segment = 'CO' 
            gettoken(selectCatagoryid,scriptname,expiryOnChange,segment,e.target.value,optionType);
         }
      }

    }else{
      setStrikePrice('')
      setOptionType('')
    }
   
  }
  


  
  const selectOptionType = (e) => {
     
      if(strikePrice == ''){
       alert('please alert select strike price');
       return
      }
      setOptionType(e.target.value);
      if(selectCatagoryid == '26'){
        let segment = 'O' 
        gettoken(selectCatagoryid,scriptname,expiryOnChange,segment,strikePrice,e.target.value);
        }
       else if(selectCatagoryid == '35'){
          let segment = 'MO' 
          gettoken(selectCatagoryid,scriptname,expiryOnChange,segment,strikePrice,e.target.value);
          }
        else if(selectCatagoryid == '36'){
            let segment = 'CO' 
            gettoken(selectCatagoryid,scriptname,expiryOnChange,segment,strikePrice,e.target.value);
         }
  }


  // console.log("setStrikePrice ",strikePrice);
  // console.log("setOptionType ",optionType);
  // console.log("setExpiryOnChange ",expiryOnChange);



  const gettoken = async (selectCatagoryid="",symbol="",expiry = "",segment="",strike_price="",option_type="") => {

    


    if (selectCatagoryid != "") {
      // console.log("service data ddd", selectCatagoryid);
      // console.log("service data ddd", symbol);
      //  alert(selectCatagoryid);
      if (selectCatagoryid == "24") {

        //console.log("previousToken.current cash", previousToken.current);

        const data = { symbol: symbol, categorie_id: selectCatagoryid }
        const response = await gettokenbysocket(data);

        console.log("cash token", response);
        if (response.data.status == true) {
          // response.data.token
          // response.data.exchang
          if (sockets != null) {
            console.log("previousToken.current", previousToken.current);
            let json1 = {
              k: previousToken.current,
              t: "u",
            };
            sockets.send(JSON.stringify(json1));
            previousToken.current = response.data.exchange + "|" + response.data.token;
           // console.log("response.data.exchange", response.data.exchange);
           // console.log("response.data.token", response.data.token);
            liveToken.current = response.data.token;
            let json = {
              k: response.data.exchange + "|" + response.data.token,
              t: "t",
            };
            sockets.send(JSON.stringify(json));

          } else {

            console.log("sockets closeeee");

          }




        }

      } 
      else if(selectCatagoryid == "25" || selectCatagoryid == "34" || selectCatagoryid == "37"){
        // console.log("service other id", selectCatagoryid);
        // console.log("expiry", expiry);
        // console.log("symbol", symbol);

        const data = { symbol: symbol, categorie_id: selectCatagoryid, expiry: expiry, segment: segment }
        const response = await gettokenbysocket(data);


        console.log("cash token future", response);
       // console.log("sockets", sockets);

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

          } else {

            console.log("sockets closeeee");

          }

        }

      }
      else if(selectCatagoryid == "26" || selectCatagoryid == "35" || selectCatagoryid == "36"){
        // console.log("service other id", selectCatagoryid);
        // console.log("expiry", expiry);
        // console.log("symbol", symbol);
        // console.log("strike_price", strike_price);
        // console.log("option_type", option_type);

        const data = { symbol: symbol, categorie_id: selectCatagoryid, expiry: expiry, segment: segment ,strike_price:strike_price, option_type : option_type}
        const response = await gettokenbysocket(data);


        console.log("cash token option", response);
       // console.log("sockets", sockets);

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

          } else {

            console.log("sockets closeeee");

          }

        }

      }


    }
  }

  // useEffect(() => {
//   gettoken()
// }, [scriptname]);
 
// useEffect(() => {
//   getExpirybackend(selectCatagoryid,scriptname)
// }, [scriptname]);


const selectAtAboveBelow = (e) => {
   
  if(e.target.value =='range'){
  setShowhideAtBelow(1)
  SetEntryPriceBA(e.target.value);
  }else{
   setShowhideAtBelow(0)
  SetEntryPriceBA(e.target.value);
  }

}


const selectWiseTypeDropdown = (e) => {
 if(e.target.value == ''){
  setShowhideTargetStoploss(0)
  setWiseTypeDropdown(e.target.value)
 }else{
  setShowhideTargetStoploss(1)
  setWiseTypeDropdown(e.target.value)
 }

}


const selectTargetStoplossDropdown =(e) => {
  setTargetStoplossDropdown(e.target.value)
}


const selectMarkettime = (e) => {
  if(e.target.value == "2"){
    if(EntryPriceBA == 'at'){
      SetEntryPriceBA('')
    }
    setShowMarkettime(0)
  }else{
    setShowMarkettime(1)
    SetEntryPriceBA('at')
  }
  setMarkettime(e.target.value)
}


const currentTime1 = new Date(); // Get the current time
const desiredTime = new Date(); // Create a target time

const hours = currentTime1.getHours().toString().padStart(2, '0');
const minutes = currentTime1.getMinutes().toString().padStart(2, '0');
const seconds = currentTime1.getSeconds().toString().padStart(2, '0');
const formattedTime = `${hours}:${minutes}:${seconds}`;
// console.log(formattedTime);

desiredTime.setHours(15, 30, 0, 0);

const hours1 = desiredTime.getHours().toString().padStart(2, '0');
const minutes1 = desiredTime.getMinutes().toString().padStart(2, '0');
const seconds1 = desiredTime.getSeconds().toString().padStart(2, '0');
const formattedTime1 = `${hours1}:${minutes1}:${seconds1}`;



  return (
    <div>

      <div className='row bg-gray'>
        <div className='col-md-4'>
          <div className="form-group">
            <label for="exampleFormControlSelect1">Script Type * -</label>
            <select className="form-select" aria-label="Default select example" onChange={(e) => {
              // SetSelectCatagoryId(e.target.value);
              selectCatagoryId(e);
              SetonChangeScriptname(e.target.innerText)
              setScriptDataErr('')
              SetScriptname("")
              SetForDisabledSubmit(false)
            }} >
              <option
                name="none" disabled selected>Select Script Type</option>
              {scriptdata && scriptdata?.map((x, index) => {

                  if(manual_dash == null){
                  
                    if(Segment_condition.length > 0){
                     

                     if(c_condition.length > 0 && x.segment === "C") {
                      return <option key={index} name={x.name} value={x.id}>{x.name}</option>
                      } 

                     if(f_condition.length > 0 && x.segment === "F") {
                      return <option key={index} name={x.name} value={x.id}>{x.name}</option>
                      } 

                      if(o_condition.length > 0 && x.segment === "O") {
                        return <option key={index} name={x.name} value={x.id}>{x.name}</option>
                        } 

                        if(mf_condition.length > 0 && x.segment === "MF") {
                          return <option key={index} name={x.name} value={x.id}>{x.name}</option>
                          } 

                          if(mo_condition.length > 0 && x.segment === "MO") {
                            return <option key={index} name={x.name} value={x.id}>{x.name}</option>
                            } 

                            if(co_condition.length > 0 && x.segment === "CO") {
                              return <option key={index} name={x.name} value={x.id}>{x.name}</option>
                              } 

                              if(cf_condition.length > 0 && x.segment === "CF") {
                                return <option key={index} name={x.name} value={x.id}>{x.name}</option>
                                } 

                                if(fo_condition.length > 0 && x.segment !== "FO") {
                                  return <option key={index} name={x.name} value={x.id}>{x.name}</option>
                                  } 

                                  if(cb_condition.length > 0 && x.segment !== "CB") {
                                    return <option key={index} name={x.name} value={x.id}>{x.name}</option>
                                    } 
                  
                    }

                  }else{
                    if (x.segment !== "FO") {
                      return <option key={index} name={x.name} value={x.id}>{x.name}</option>
                    } 
                  }

                  


              })}
            </select>
            {scriptErr ? <p style={{ color: "#ff8888" }}> *{scriptErr}</p> : ''}
          </div>
        </div>


        <div className='col-md-4'>
          <div className="form-group">
            <label for="exampleFormControlSelect1">Script Name -</label>
            <select className="form-select" aria-label="Default select example" onChange={(e) => { selectscriptname(e); SetScriptnameErr(''); selecttype(''); dropdownSelect("1") }}>
              <option value='' selected>Select Script Name -</option>
              {
                servicedata && servicedata.map((x) => {
                  return <option value={x.service}>{x.service}</option>
                })
              }
            </select>
            {scriptnameErr ? <p style={{ color: "#ff8888" }}> *{scriptnameErr}</p> : ''}
          </div>
        </div>

      

        <div className="col-md-4">
          <label className="text-secondary" style={{ fontWeight: 'bold', color: 'black' }}>Expiry Date</label>
          <select className="form-select" name="expiry_date" onChange={(e) => { selectExpiryFun(e) }} selected>
            <option value="">Select Expiry Date</option>
            {expirydateSelect && expirydateSelect?.map((sm, i) =>
              <option value={sm.expiry}>{sm.expiry_str}</option>)}

          </select>
        </div>


        {showstrikePrice == 1 ? <><div className='col-md-4'>
          <div className="form-group">
            <label for="exampleFormControlSelect1">Strike Price -</label>
            <select className="form-select" aria-label="Default select example" onChange={(e) => { selectStrikePrice(e); setStrikePriceErr('') }}>
              <option selected value="">--Select strike price--</option>
              {
                strikePriceAll && strikePriceAll.map((x) => {
                  return <option value={x.strike}>{x.strike}</option>
                })
              }
            </select>
            {strikePriceErr ? <p style={{ color: "#ff8888" }}> *{strikePriceErr}</p> : ''}

          </div>
        </div></> : ""}
        

       {strikePrice && showstrikePrice == 1 ? <> <div className='col-md-4'>
          <div className="form-group">
            <label for="exampleFormControlSelect1" >Option-Type Call/Put</label>
            <select disabled={strikePrice == "" || strikePrice == null} className="form-select" aria-label="Default select example" onChange={(e) => { selectOptionType(e) ;setOptionTypeErr(''); }}>
              <option selected value="" >--Select--</option>
              <option value="CE">CALL</option>
              <option value="PE">PUT</option>
            </select>
            {optionTypeErr ? <p style={{ color: "#ff8888" }}> *{optionTypeErr}</p> : ''}

          </div>
        </div></> : ""}
       

       {manual_dash == null ?  
       <>

       <div className='col-md-4'>
          <div className="form-group">
            <label for="exampleFormControlSelect1">Select Strategy -</label>
            <select className="form-select" aria-label="Default select example" onChange={(e) => { setStrategy(e.target.value); setStrategyErr(''); SetForDisabledSubmit(false) }} value={strategy}>
              <option selected>Select Strategy</option>
              {
                stretegydata && stretegydata.map((x) => {
                  return <option value={x.strategy}>{x.strategy}</option>
                })
              }
            </select>
            {strategyErr ? <p style={{ color: "#ff8888" }}> *{strategyErr}</p> : ''}

          </div>
        </div>
       </>:<>
       <div className='col-md-4'>
          <div className="form-group">
            <label for="exampleFormControlSelect1">Select Strategy -</label>
            <select className="form-select" aria-label="Default select example" onChange={(e) => { setStrategy(e.target.value); setStrategyErr(''); SetForDisabledSubmit(false) }} value={strategy}>
              <option selected>Select Strategy</option>
              {
                stretegydata && stretegydata.map((x) => {
                  return <option value={x.name}>{x.name}</option>
                })
              }
            </select>
            {strategyErr ? <p style={{ color: "#ff8888" }}> *{strategyErr}</p> : ''}

          </div>
        </div>
       </> }


        


      


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
            <label for="exampleFormControlSelect1" >Market Time -</label>
            <select className="form-select" aria-label="Default select example" onChange={(e) => { selectMarkettime(e) }}>
              <option value="1" selected={markettime == "1"}>DAY</option>

              {/* {formattedTime > formattedTime1 ? 
              <>
              <option value="2" selected={markettime == "2"}>AMO</option>
              </>
            : ""} */}

            <option value="2" selected={markettime == "2"}>AMO</option>

            </select>
            {tradeTypeErr ? <p style={{ color: "#ff8888" }}> *{tradeTypeErr}</p> : ''}

          </div>
        </div>


        <div className='col-md-4'>
          <div className="form-group">
            <label for="exampleFormControlInput1">Entry Price : </label><span className={'liveprice' + liveToken.current}>{liveprice}</span>

            {showhideAtBelow==0? <>
              <input type="text" name="exampleFormControlInput1" className="form-control show_entry_price" onKeyPress={handleKeyPress} onChange={(e) => {
              SetEntryPrice(e.target.value);
              SetEntryPriceErr('')
            }} value={EntryPrice} />
            </>:
             <>

             <div className="row mt-2">
             <div class="col-sm-6 col-lg-6">
              <input type="number" name="exampleFormControlInput1" className="form-control"  onChange={(e) => {
              SetEntryPriceRange_one(e.target.value);
              SetEntryPriceRange_oneErr('')
            }} value={EntryPriceRange_one} /> 
            </div>
            
            <div class="col-sm-6 col-lg-6">
             <input type="number" name="exampleFormControlInput1" className="form-control"  onChange={(e) => {
              SetEntryPriceRange_two(e.target.value);
              SetEntryPriceRange_twoErr('')
               }} value={EntryPriceRange_two} />
               </div>
              </div>
              
           
           
              
             
             </>
             }
           



            <div className="row mt-2">
                {showmarkettime == 1 ?   
                <>

               <div className="col-sm-4 col-lg-3">
                <div className="radio" >
                  <label for="at_check"><input id="at_check" 
                  value="at" 
                  type="radio" 
                  name="at_check" 
                  checked={EntryPriceBA=='at'?true:false}
                  onChange={(e) => { selectAtAboveBelow(e); SetEntryPriceBAErr('') } } />At</label>
                </div>
              </div>
                </>
                : ""}

              <div className="col-sm-4 col-lg-3">
                <div className="radio">
                  <label for="at_above"><input id="at_above" value="above" type="radio" name="at_check" onChange={(e) => { selectAtAboveBelow(e); SetEntryPriceBAErr('') }} />Above</label>
                </div>
              </div>
              <div className="col-sm-4 col-lg-3">
                <div className="radio">
                  <label for="at_below"><input id="at_below" value="below" type="radio" name="at_check" onChange={(e) => { selectAtAboveBelow(e); SetEntryPriceBAErr('') }} />Below</label>
                </div>

              </div>
              <div className="col-sm-4 col-lg-3">
                <div className="radio">
                  <label for="at_range"><input id="at_range" value="range" type="radio" name="at_check" onChange={(e) => { selectAtAboveBelow(e); SetEntryPriceBAErr('') }} />Range</label>
                </div>

              </div>
            </div>
          </div>
          {EntryPriceErr ? <p style={{ color: "#ff8888" }}> *{EntryPriceErr}</p> : ''}
          {EntryPriceBAErr ? <p style={{ color: "#ff8888" }}> *{EntryPriceBAErr}</p> : ''}

        </div>

         
        <div className='col-md-4 '>
          <div className="form-group ">
            <div className="row">
              <label for="exampleFormControlSelect1" >Intraday / Delivery -</label>
              <select className="form-select" aria-label="Default select example" onChange={(e) => { setIntradayDelivery(e.target.value); setIntradayDeliveryErr('') }}>
                <option selected={changeDropdown == 1} value="0">--Select--</option>
                <option value="1">Intraday</option>
                <option value="2">Delivery</option>
              </select>
              {tradeTypeErr ? <p style={{ color: "#ff8888" }}> *{tradeTypeErr}</p> : ''}


            
             {IntradayDelivery == "1" ? 
              
              EntryPriceBA == "at" ?   <>
              <div className="col-sm-5 col-lg-6">
                <label for="exampleFormControlSelect1" > Exit Time  :  &nbsp; </label>
                 {/* <input type="text" className="form-control" onChange={(e) => { setStopLoss(e.target.value); setStopLossErr('') }} /> */}
                 <input type="time" id="appt" className="form-control" name="appt" 
                 min="09:15" 
                 max="15:15"
                 value={selectedTimeExit}
                 onChange={handleTimeChangeExit}/>
             
               </div> 

              </>  :
               <>
                <div className="col-sm-5 col-lg-6">
                <label for="exampleFormControlSelect1" > Exit Time  :  &nbsp; </label>
                 {/* <input type="text" className="form-control" onChange={(e) => { setStopLoss(e.target.value); setStopLossErr('') }} /> */}
                 <input type="time" id="appt" className="form-control" name="appt" 
                 min="09:15" 
                 max="15:15"
                 value={selectedTimeExit}
                 onChange={handleTimeChangeExit}/>
             
               </div>
 
 
              <div className="col-sm-5 col-lg-6">
                <label for="exampleFormControlSelect1" > No Trade Time : &nbsp; </label>
                 {/* <input type="text" className="form-control" onChange={(e) => { setStopLoss(e.target.value); setStopLossErr('') }} /> */}
                 
                 <input type="time" id="appt" className="form-control" name="appt"
                 min="09:15" 
                 max="15:15"
                 value={selectedTimeNoTrade}
                 onChange={handleTimeChangeNoTrade}/>
                 
              </div>
              </>
             
           : IntradayDelivery == "2" ? <>
             <div className="col-sm-5 col-lg-6">
               <label for="exampleFormControlSelect1" > No Trade Time: &nbsp; </label>
                {/* <input type="text" className="form-control" onChange={(e) => { setStopLoss(e.target.value); setStopLossErr('') }} /> */}
                
                <input type="time" id="appt" className="form-control" name="appt"
                min="09:15" 
                max="15:15"
                value={selectedTimeNoTrade}
                onChange={handleTimeChangeNoTrade}/>
                
             </div></> :  ""}

            </div>

           
          </div>
        </div>





      </div>
      <div className='row mt-6 bg-gray'>

        <div className='col-md-3'>
          <div className="form-group ">
            <div className="row">
              <label for="exampleFormControlSelect1" >Wise Type -</label>
              <select className="form-select" aria-label="Default select example" onChange={(e) => { selectWiseTypeDropdown(e); setWiseTypeDropdownErr('') }}>
                <option selected value="">Select Wise Type</option>
                <option value="1">Percentage(%)</option>
                <option value="2">Points</option>
              </select>
              {tradeTypeErr ? <p style={{ color: "#ff8888" }}> *{tradeTypeErr}</p> : ''}
            </div>
          </div>
        </div>

        {showhideTargetStoploss==1? 
        
        <>
        <div className='col-md-3'>
          <div className="form-group ">
            <div className="row">
              <label className="form-label">Target -</label>
              <div className="col-sm-5 col-lg-10">
              <input type="text" className="form-control" onChange={(e) => { setTarget1(e.target.value); setTarget1Err("") }} />
              {target1Err ? <p style={{ color: "#ff8888", fontSize: '10px' }}> *{target1Err}</p> : ''}
            </div>
            
          </div>
        </div>
        </div>

        
        <div className='col-md-3'>
          <div className="form-group">
            <div className="row">
              <label className="form-label">Stop Loss -</label>
              <div className="col-sm-5 col-lg-10">
                <input type="text" className="form-control" onChange={(e) => { setStopLoss(e.target.value); setStopLossErr('') }} />

              </div>


            </div>
          </div>
        </div>



        <div className='col-md-3'>
          <div className="form-group ">
            <div className="row">
              <label for="exampleFormControlSelect1" >Taget/StopLoss Status -</label>
              <select className="form-select" aria-label="Default select example" onChange={(e) => { selectTargetStoplossDropdown(e);}}>
                <option selected value=""> --select-- </option>
                {target1 == 'not' || target1 == '' ? ""
                 :  
                 <>
                 <option value="1">Target</option>
                 </>
                }

                {stoploss == 'not' || stoploss == ''? ""
                 :
                 <>
                <option value="2">stoploss</option>
                 </>
                }
              </select>
            </div>
          </div>
        </div>




        </>
        : ""}

        


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