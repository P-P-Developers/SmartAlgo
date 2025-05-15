import React, { useEffect, useState, createContext ,useRef } from 'react'
//import DataTable from "../../../Utils/DataTable";
import * as Config from "../../../../common/Config";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
//import { confirm } from "react-confirm-box";
import { GetBelowAboveData,DeleteBelowAboveData ,UpdateBelowAboveData } from '../../../ApiCalls/Api.service'

import AlertToast from "../../../../common/AlertToast";
import socketIOClient from "socket.io-client";
import $ from "jquery";
import CryptoJS from "crypto-js";
import axios from "axios";



const Range = () => {


    const admin_token = localStorage.getItem("token");

    
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
           // alert('client')
           // console.log("daaaaata client", res.data.msg.client_key);
            setClientDetails(res.data.msg);
            setClientClientKey(res.data.msg.client_key);
            client_key_panel.current = res.data.msg.client_key
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
  
  //   console.log("f_condition",f_condition);
  //   console.log("clientClientKey",clientClientKey);
  //////////////




    const [Data, setData] = useState([]);
    const [selectRowArray, setSelectRowArray] = useState([])
    const [refreshscreen, setRefreshscreen] = useState(false);
    

      // AlertToast
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");

  const [socket1, setSocket1] = useState(null);

  const onAlertClose = (e) => {
    // console.log("  setShowAlert(false);");
    setShowAlert(false);
  };


  const [sockets, setSockets] = useState(null);
  const userAliceblueIdRef = useRef("");
  const userAliceblueTokenRef = useRef("");

  
  const oldChannelRef = useRef("");
  const userAlicebluetype = useRef("");
  const userAliceblueBASEURL = useRef("");
  const userAliceblueSOCKETURL = useRef("");
 

  let socket;
 

    const GetStrategyDataFunction = async (e) => {

        let data = {
            "json_key": "range"
        }
        const response = await GetBelowAboveData(data, admin_token)
        if (response.data.status) {
           // console.log("response.data -- ",response.data.channel);

           if (manual_dash == null) {
            const datas = response.data.data.filter((item) => item.panelKey == client_key_panel.current);
            setData(datas)
            }else{
            setData(response.data.data)
            }
           
           
          //  runSocket(response.data.channel)      
            
        }

    }
   // console.log("1234567", Data);


   // Start socket code 
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
          if(response.data.data[0].trading == 1){
            userAliceblueIdRef.current = response.data.data[0].client_code;
            userAliceblueTokenRef.current = response.data.data[0].access_token;
            userAlicebluetype.current = response.data.data[0].type;
            userAliceblueBASEURL.current = response.data.data[0].baseurl_aliceblue;
            userAliceblueSOCKETURL.current = response.data.data[0].socket_url;
          
          invalidateSession(response.data.data[0].client_code, response.data.data[0].access_token,channel,response.data.data[0].type,response.data.data[0].baseurl_aliceblue,response.data.data[0].socket_url);
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

  function invalidateSession(userId, userSession,channel,type,BASEURL,SOCKETURL) {
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

        console.log("msg",msg);
        var data = JSON.stringify(msg);

        if (msg.stat === "Ok") {
          createSession(userId, userSession, channel,type,BASEURL,SOCKETURL);
        }
      },
    });
  }

  function createSession(userId, userSession, channel,type,BASEURL,SOCKETURL) {
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
          connect(userId, userSession, channel,type,BASEURL,SOCKETURL)
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
  

  function connect(userId, userSession,channel,type,BASEURL,SOCKETURL) {

    socket = new WebSocket(SOCKETURL);
    socket.onopen = function () {
      //  alert("socket open");

      console.log("socket running");
      connectionRequest(userId, userSession,type,BASEURL,SOCKETURL);
      setSockets(socket)
       console.log("socket connect range",channel);

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

         console.log("response range ", response);
       

          const old_val = $('.live_price'+response.tk).html();

          if (response.tk) {
            //console.log('response token', response.pc)
            if (response.lp != undefined) { 
              $(".live_price" + response.tk).html(response.lp);

              const new_val = $('.live_price'+response.tk).html();


              if(new_val > old_val){

                $('.live_price'+response.tk).css({"color":"green"});

              }else if(new_val < old_val){

                $('.live_price'+response.tk).css({"color":"red"});
              }else if(new_val == old_val){

                $('.live_price'+response.tk).css({"color":"black"});
              }


            }
            // else {
            //  $(".live_price" + response.tk).html(response.c);

            // }

            // if (response.bp1 != undefined) {
            //   $(".bp1_price" + response.tk).html(response.bp1);
            // }
            // if (response.sp1 != undefined) {
            //   $(".sp1_price" + response.tk).html(response.sp1);
            // }


          }

        };

      }
    };

    socket.onclose = function (event) {
      if (event.wasClean) {
  
        // alert(`1 [close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    
      } else {
        

        connect(userAliceblueIdRef.current, userAliceblueTokenRef.current,oldChannelRef.current,userAlicebluetype.current,userAliceblueBASEURL.current,userAliceblueSOCKETURL.current);
        // alert('[close] Connection died');
      }
    };


    socket.onerror = function (error) {
      
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

   /// End Socket Code

   const containerStyle = {
    width: '70px',
    height: '20px',
    backgroundColor: 'lightgray', // Example background color
  };
    const columns = [
        {
            name: <h6>S.No</h6>,
            selector: (row, index) => index + 1,
            width: '60px !important',
        },
        {
            name: <h6>Symbol</h6>,
            selector: (row, index) =>  row.segment == "O" ?row.input_symbol+row.expiry+"_OPTION" : row.segment == "F" ? row.input_symbol+row.expiry+"FUT" : row.segment == "MF" ? row.input_symbol+row.expiry+"_MF" : row.segment == "MO" ? row.input_symbol+row.expiry+"_MO" : row.segment == "CF" ? row.input_symbol+row.expiry+"_CF" : row.segment == "CO"? row.input_symbol+row.expiry+"_CO" : row.input_symbol,
            width: '200px !important',
        },
        {
            name: <h6>Exit Time</h6>,
            selector: (row, index) => (row.exit_time).replace('-',':'),
            width: '100px !important',
        },
        {
            name: <h6>No Trade Time</h6>,
            selector: (row, index) => (row.notrade_time).replace( '-',':'),
            width: '100px !important',
        },
     
        {
          name: <h6> Live Price</h6>,
        
          cell: (row) => (
             
                <span className={"live_price" + row.token}></span>
                  
          ),
         
        },

        {
            name: <h6> Range Price From</h6>,
            // selector: (row, index) => row.below_price,
            cell: (row) => (
               
                    <input
                       
                        style={containerStyle}
                        className="hidebg"
                        name="targen_input"
                        type="number"
                        onChange={(e) => {
                            inputChangeTargetStoplos(e,"rangePriceOne",row);
                        }}
                        defaultValue={row.rangePriceOne}
                    />
                    
            ),
           
        },
        {
            name: <h6> Range Price To</h6>,
            // selector: (row, index) => row.below_price,
            cell: (row) => (
               
                    <input
                       
                        style={containerStyle}
                        className="hidebg"
                        name="targen_input"
                        type="number"
                        onChange={(e) => {
                            inputChangeTargetStoplos(e,"rangePriceTwo",row);
                        }}
                        defaultValue={row.rangePriceTwo}
                    />
                    
            ),
           
        },
        {
            name: <h6>Strategy Tag</h6>,
            selector: (row, index) => row.strategy_tag,
            width: '80px !important',
        },
        // {
        //     name: <h6>Strike Price</h6>,
        //     selector: (row, index) => row.segment == "C" ? " - " :row.strike_price,
        //     width: '110px !important',
        // },
        {
            name: <h6>Transaction Type</h6>,
            selector: (row, index) => row.type == "LE" ? "BUY" : row.type == "SE" ? "SELL": "",
            width: '110px !important',
        },
        {
            name: <h6>Wise Type</h6>,
            selector: (row, index) => row.wisetype = "1"? "Percentage" : row.wisetype = "2" ? "Points" :" - " ,
            width: '140px !important',
        },
        {
            name: <h6>Target Price</h6>,
            // selector: (row, index) => row.TargetPrice,
            // width: '130px !important',
            cell: (row) => (
                <div>
                    <input
                        className="hidebg"
                        name="targen_input"
                        type="number"
                        onChange={(e) => {
                            inputChangeTargetStoplos(e,"target",row);
                        }}
                        defaultValue={row.TargetPrice}
                    />
                </div>
            )
        },
        {
            name: <h6>StopLoss Price</h6>,
            // selector: (row, index) => row.StopLossPrice,
            // width: '130px !important',
            cell: (row) => (
                <div>
                    <input
                        className="hidebg"
                        name="targen_input"
                        type="number"
                        onChange={(e) => {
                            inputChangeTargetStoplos(e,"stoploss",row);
                        }}
                        defaultValue={row.StopLossPrice}
                    />
                </div>
            )
        },
    ]


    const [updateTargetStoploss, setUpdateTargetStoploss] = useState([])
  

    const inputChangeTargetStoplos = (e,type,row) =>{
      
    // console.log("type",type);
   //  console.log("e",e.target.value);
    // console.log("row",row);
     let set_target = 0;
     let set_stoploss = 0;
     let set_price = 0;
     let rangePriceOne = 0;
     let rangePriceTwo = 0;
     if(type == "target"){
       set_target = parseFloat(e.target.value);
     }
     else if(type == "stoploss"){
         set_stoploss = parseFloat(e.target.value);
     }
     else if(type == "rangePriceOne"){
        rangePriceOne = parseFloat(e.target.value);
    }
    else if(type == "rangePriceTwo"){
        rangePriceTwo = parseFloat(e.target.value);
    }
     else{
       //  console.log("input price",e.target.value);
         set_price = parseFloat(e.target.value);
     }
 
 
     var pre_tag = {
         id: row.id,
         TargetPrice: set_target,
         StopLossPrice: set_stoploss,
         rangePriceOne: rangePriceOne,
         rangePriceTwo: rangePriceTwo,
       };
 
     
 
    
       const filteredItems = updateTargetStoploss.filter(item => item.id == row.id);
      
     //  console.log("filteredItems",filteredItems);
 
      if(filteredItems.length > 0){
 
 
     const updatedObject = { ...filteredItems[0]};
 
     // Step 2: Update the value of the object property
     if(type == "target"){
        updatedObject.TargetPrice =set_target;
       }
       else if(type == "stoploss"){
           updatedObject.StopLossPrice =set_stoploss;
       }
       else if(type == "rangePriceOne"){
        updatedObject.rangePriceOne =rangePriceOne;
    }
    else if(type == "rangePriceTwo"){
        updatedObject.rangePriceTwo =rangePriceTwo;
    }
       else{
           updatedObject.Price =set_price;
       }
     
     
    // console.log("filteredItems[0].id",filteredItems[0].id);
 
 
     setUpdateTargetStoploss(oldValues => {
         return oldValues.filter(item => item.id !== filteredItems[0].id)
       })
 
     setUpdateTargetStoploss((oldArray) => [updatedObject, ...oldArray]);
    
     
 
    // console.log("iff");
     }else{
        //  console.log("eleee");
          updateTargetStoploss.push(pre_tag)
       }
 
 
    }
 
 
 // console.log("updateTargetStoploss",updateTargetStoploss);
 
   
 const selectAboveROw = ({ selectedRows }) => {
         setSelectRowArray(selectedRows);
       };
 
   //console.log("setSelectRowArray",selectRowArray);
  
   const delete_data = async () => {
     if(selectRowArray.length <= 0){
       alert("please select any signal");
       return
     }  
 
    // alert("okkk")
 
    let text = "Are you sure you want delete signal ?";
    if (window.confirm(text) == true) {
     let data = {
         "json_key": "range",
         "delete_data": selectRowArray
        }
         const response = await DeleteBelowAboveData(data, admin_token);
         setShowAlert(true);
         setTextAlert("Signal delete successfully...");
         setAlertColor("success");
         setSelectRowArray([]);
         setRefreshscreen(!refreshscreen);
    } 
 
  }
 
  const update_data = async () => {
  
     if(updateTargetStoploss.length <= 0){
         alert("please select any signal");
         return;
     }
 
     let data = {
         "json_key": "range",
         "update_data": updateTargetStoploss
        }
 
   
     const response = await UpdateBelowAboveData(data, admin_token);
     setShowAlert(true);
     setTextAlert("Signal update successfully...");
     setAlertColor("success");
     setUpdateTargetStoploss([]);
     setRefreshscreen(!refreshscreen);
 
  }





    useEffect(() => {
        GetStrategyDataFunction()
    }, [refreshscreen])
    return (
        
        <div>
        <button className='btn btn-success float-end' onClick={() => delete_data()}>DELETE</button>
         <button className='btn btn-success float-end' onClick={() => update_data()}>UPDATE</button>
            
                           <DataTableExtensions
                                columns={columns}
                                data={Data && Data} 
                                export={false}
                                print={false}
                                
                              >
                                <DataTable
                                fixedHeader
                                fixedHeaderScrollHeight="700px"
                                noHeader
                                defaultSortField="id"
                                defaultSortAsc={false}
                                selectableRows
                                onSelectedRowsChange={selectAboveROw}
                                pagination
                                highlightOnHover
                                paginationRowsPerPageOptions={[10, 50, 100]}
                                paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: 'All' }}
                                />
                              </DataTableExtensions>
        
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

export default Range