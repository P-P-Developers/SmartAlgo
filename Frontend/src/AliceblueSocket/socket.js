import { useState } from 'react';
import $ from 'jquery';
var CryptoJS = require("crypto-js");
var axios = require('axios');

const AliceBlueSocket_copy = () => {


var BASEURL = 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/'
var userId = "616680"
var userSession = "ksx8LoBHfrP9DIeHvzz1qlxxlIBaKr2GkIRIpqcl1qDK4gRJ9QcgcK8mi2O6xB5RGWsI0FajubGYyyxdfnm6d1NGJNArzAr3u8zMiKxMr2sfKOOvfhGhduN6fZFTPul3QjDl4MHjohs9clTOuTTCoQoHIsCD2TdBof0qKiqcggyqQFuNB86iIvtSkCK1MA6OBsGxmta39DBfFYVC0ggsjHkI5gssIQjGJBsULrmJp0oNJUh23DQ5uaQky2OAiIrR"
let AuthorizationToken;
let type = 'API'

function checkMethod() {
    var userId = "616680";
var userSession = "ksx8LoBHfrP9DIeHvzz1qlxxlIBaKr2GkIRIpqcl1qDK4gRJ9QcgcK8mi2O6xB5RGWsI0FajubGYyyxdfnm6d1NGJNArzAr3u8zMiKxMr2sfKOOvfhGhduN6fZFTPul3QjDl4MHjohs9clTOuTTCoQoHIsCD2TdBof0qKiqcggyqQFuNB86iIvtSkCK1MA6OBsGxmta39DBfFYVC0ggsjHkI5gssIQjGJBsULrmJp0oNJUh23DQ5uaQky2OAiIrR";
    if (userSession && userId) {
        console.log(userId, userSession, 'userId userId')
        AuthorizationToken = 'Bearer ' + userId + ' ' + userSession
        invalidateSession()
    }
}



function invalidateSession() {
    let jsonObj = {
        loginType: type
    }
    $.ajax({

        url: BASEURL + 'api/ws/invalidateSocketSess',
        headers: {
            Authorization: AuthorizationToken
        },
        type: 'post',
        data: JSON.stringify(jsonObj),
        contentType: 'application/json',
        dataType: 'json',
        async: false,
        success: function (msg) {
            var data = JSON.stringify(msg)
            if (msg.stat == 'Ok') {
                createSession()
            }
        }
    });

}

function createSession() {
    let jsonObj = {
        loginType: type
    }
    $.ajax({

        url: BASEURL + 'api/ws/createSocketSess',
        headers: {
            Authorization: AuthorizationToken
        },
        type: 'post',
        data: JSON.stringify(jsonObj),
        contentType: 'application/json',
        dataType: 'json',
        async: false,
        success: function (msg) {
            var data = JSON.stringify(msg)
            if (msg.stat == 'Ok') {
                connect()
            } else {
                alert(msg)
            }
        }
    });
}

const url = "wss://ws1.aliceblueonline.com/NorenWS/"
let socket;
function connect() {
    socket = new WebSocket(url)

    socket.onopen = function () {
        connectionRequest()
    }
    socket.onmessage = function (msg) {
        var response = JSON.parse(msg.data)
        console.log('response',response);
       

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

function connectionRequest(requestId) {
            var encrcptToken =  CryptoJS.SHA256(CryptoJS.SHA256(userSession).toString()).toString();
            var initCon = {
                susertoken: encrcptToken,
                t: "c",
                actid: userId + "_" + type,
                uid: userId + "_" + type,
                source: type
            }
	console.log('connectionRequest',initCon);
    socket.send(JSON.stringify(initCon))
}



return (
    <div className="App">
      <header className="App-header">
        <p>Hello Shakir</p>

     <button onClick={() => checkMethod()}> Run </button>
    
      
  
      </header>
    </div>
  );


}
export default AliceBlueSocket_copy