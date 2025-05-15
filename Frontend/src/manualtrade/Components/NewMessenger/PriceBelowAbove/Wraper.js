
import Above from "./Above"
import Below from "./Below"
import Range from "./Range"
import $ from "jquery";
  import CryptoJS from "crypto-js";
  import * as Config from "../../../../common/Config";
  import React, { useEffect, useState, createContext ,useRef } from 'react'
  import axios from "axios";
import { GetBelowAboveData,DeleteBelowAboveData ,UpdateBelowAboveData } from '../../../ApiCalls/Api.service'


const Wraper = () => {

  const admin_token = localStorage.getItem("token");
  const [sockets, setSockets] = useState(null);
  const userAliceblueIdRef = useRef("");
  const userAliceblueTokenRef = useRef("");

  
  const oldChannelRef = useRef("");
  const userAlicebluetype = useRef("");
  const userAliceblueBASEURL = useRef("");
  const userAliceblueSOCKETURL = useRef("");





 // Start socket code 
 let AuthorizationToken;
 let socket;


 useEffect(() => {
  GetStrategyDataFunction()
}, [])

const GetStrategyDataFunction = async (e) => {

  let data = {
      "json_key": "range"
  }


  const response = await GetBelowAboveData(data, admin_token)
  if (response.data.status) {
      console.log("response.data -- ",response.data.channel);
    if(response.data.channel != ""){
      runSocket(response.data.channel)      
    }
      
  }

}

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





  return (
    <div>
      {/* <div className='manual'> */}
    {/* <div className='content'> */}
      {/* <div className='card-dark'> */}
        <ul className="nav nav-pills mb-5" id="pills-tab" role="tablist">
         
          <li className="nav-item" role="presentation">
            <button className="nav-link active" id="pills-profile-tab" data-toggle="pill" data-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="true">Below</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="pills-contact-tab" data-toggle="pill" data-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Above</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="pills-contact-tab" data-toggle="pill" data-target="#pills-range" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Range</button>
          </li>
        </ul>
          <div className="tab-content" id="pills-tabContent">
            
            <div className="tab-pane fade show active" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                <Below />
                </div>
            <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab"><Above /></div>

            <div className="tab-pane fade" id="pills-range" role="tabpanel" aria-labelledby="pills-contact-tab"><Range /></div>
          </div>

          
          
      </div>
    // </div>
  // </div>
  // </div>
  )
}

export default Wraper