
import { useState } from 'react';
import axios from "axios";
var CryptoJS = require("crypto-js");



const AliceBlueSocket_copy = () => {

  const [data, setData] = useState([])

  let type = 'API';
  var userId = '565272';
  var userSession = '41QeaLBaT9n0bu0ks5KntnDtVYb4MTOb7eGZoy7Y86dTQD9nelhFjaVRIAyGc9uPedg5Wb42oa4KtqKZTH3dhOm7kShgOOFTE0ghFkb4Eu15UuSR4ltSp7mBl3OZYB7hLFDaFbn4On9bRV3j3LTbARrkuyo7b8erpy9WN930nmzBDRNWzAPYo3hvFNMfg08reNqt3JFQ3uz7X7rdNCrZxsOWk8SRT0bvj2VDxDsKIV0Q8bkIIjmQ0ozYaXY1lOJA';

  // console.log('userSession', userSession);

  var AuthorizationToken = 'Bearer ' + userId + ' ' + userSession;
  var BASEURL = 'https://a3.aliceblueonline.com/rest/AliceBlueAPIService/'

  function createSession() {
    let jsonObj = {
        loginType: type
    }
    // $.ajax({

    //     url: BASEURL + 'api/ws/createSocketSess',
    //     headers: {
    //         Authorization: AuthorizationToken
    //     },
    //     type: 'post',
    //     data: JSON.stringify(jsonObj),
    //     contentType: 'application/json',
    //     dataType: 'json',
    //     async: false,
    //     success: function (msg) {
    //         var data = JSON.stringify(msg)
    //         if (msg.stat == 'Ok') {
    //             connect()
    //         } else {
    //             alert(msg)
    //         }
    //     }
    // });

    var data = JSON.stringify({
      "loginType": "API"
    });
    
    var config = {
      method: 'post',
      url: 'https://a3.aliceblueonline.com/rest/AliceBlueAPIService/api/ws/createWsSession',
      headers: { 
        'Authorization': 'Bearer 565272 41QeaLBaT9n0bu0ks5KntnDtVYb4MTOb7eGZoy7Y86dTQD9nelhFjaVRIAyGc9uPedg5Wb42oa4KtqKZTH3dhOm7kShgOOFTE0ghFkb4Eu15UuSR4ltSp7mBl3OZYB7hLFDaFbn4On9bRV3j3LTbARrkuyo7b8erpy9WN930nmzBDRNWzAPYo3hvFNMfg08reNqt3JFQ3uz7X7rdNCrZxsOWk8SRT0bvj2VDxDsKIV0Q8bkIIjmQ0ozYaXY1lOJA', 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios(config)
    .then(function (response) {
      console.log('ganpat -',JSON.stringify(response.data));
      connect()
    })
    .catch(function (error) {
      console.log(error);
    });




}




 



  let socket;
  function connect() {
    const url = "wss://ws1.aliceblueonline.com/NorenWS/";

    alert('okk');
    console.log('okkk run function');

    socket = new WebSocket(url)

    socket.onopen = function () {
      alert('socketopen')
      connectionRequest(socket)
    }
    socket.onmessage = function (msg) {
      var response = JSON.parse(msg.data);

//setData(response)

      console.log('response -', response);
      //  document.getElementById('websocket').value = JSON.stringify(response)

      if (response.s == 'OK') {
        var channel = 'BSE|1#NSE|26017#NSE|26040#NSE|26009#NSE|26000#MCX|232615#MCX|235517#MCX|233042#MCX|234633#MCX|240085#NSE|5435#NSE|20182#NSE|212#NSE|11439#NSE|2328#NSE|772#NSE|14838#NSE|14428#NSE|1327#NSE|7229#NSE|1363#NSE|14366#NSE|1660#NSE|11763#NSE|10576#NSE|14977#NSE|15032#NSE|2885#NSE|3045#NSE|5948#NSE|2107#NSE|3426#NSE|11536#NSE|11915#NSE|5097';
        let json = {
            k: channel,
            t: 't'
        };
        socket.send(JSON.stringify(json))
    }
    }


  }

  console.log("data", data);

  // data.forEach((item)=>{
  //   console.log('ssss -',item.t);
  // })


  function connectionRequest(socket) {
    var encrcptToken = CryptoJS.SHA256(CryptoJS.SHA256(userSession).toString()).toString();

    console.log('encrcptToken', encrcptToken);
    var initCon = {
      susertoken: encrcptToken,
      t: "c",
      actid: userId + "_" + type,
      uid: userId + "_" + type,
      source: type
    }
    console.log('connectionRequest -',initCon);
    socket.send(JSON.stringify(initCon))
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello Shakir</p>


{/* 
        <a
          className="fa-solid  fa-solid fa-trash pe-3 fs-5 edit_hover"
          data-toggle="tooltip"
          data-placement="top"
          onClick={() => functionsocket()}
        >RUN</a> */}
<button onClick={() => createSession()}>run </button>

  
   <p>Token {data.tk && data.tk}</p>
   <p>Price {data.pc && data.pc}</p>
      </header>
    </div>
  );
}

export default AliceBlueSocket_copy