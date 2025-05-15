
import React, { useEffect, useState } from "react";
import axios from "axios";

import * as Config from "../common/Config";
const AliceBlueSocket = () => {

  const [instrumentToken, setInstrumentToken] = useState('');
  const [socketPrice, setSocketPrice] = useState(0);
  const [name, setName] = useState("");

  console.log('token g', name)

  var CryptoJS = require("crypto-js");
  var socket;
  let type = 'API';
  var userId = '703836';
  var userSession = 'GL9tVI4VUHzzTBJCqlOcoO5ndnTV5oTG1Ua8hsbBJEJWGLBmBu4bZhBJtR70mMyJksgh8BEo5Hc2fCcB6IjGvR4GJJlokdG3llskPljBzQE9fAJCKzps8zPGn9dMPPfHc3Tc0HcYzzY9ARCWKr2u5YBaiJ7a5SJCupSZN8M9hVapprN0HPgedCxBo3EBgtTTOtbR7UJ92Ml3jDcVAUr5aIAxsEiUcK0dkNCbjePcFjaoFFuI4psgqbW6l2tQr28K';

  console.log('userSession', userSession);

  function connectionRequest() {
    var encrcptToken = CryptoJS.SHA256(CryptoJS.SHA256(userSession).toString()).toString();
    var initCon = {
      susertoken: encrcptToken,
      t: "c",
      actid: userId + "_" + type,
      uid: userId + "_" + type,
      source: type
    }
    console.log(initCon);
    socket.send(JSON.stringify(initCon))
  }






  const allTokenUpdate = (socket) => {

    //alert('lll');

    console.log('instrumentToken', instrumentToken);
    console.log('socketPrice', socketPrice);

    if (socketPrice > 0) {

      axios({
        method: "post",
        url: 'https://api.smartalgo.in:3001/updateTokenPriceAllToken',
        data: {
          'price': 18100
        }
      }).then(function (res1) {

        if (res1.data.status == true) {

          // alert('okkkk');

          //  console.log('all token get -',res1.data.allToken);
          res1.data.allToken.forEach(token => {
            console.log('token dddd-', token);
            setName(token);

            var channel = "NFO|" + token
            let json = {
              k: channel,
              t: 't'
            };
            socket.send(JSON.stringify(json))
          });

        }
      });

    }


  }







  const functionsocket = () => {


    // axios({
    //   method: "get",
    //   url: 'https://api.smartalgo.in:3001/updateTokenPriceBysocket'

    // }).then(function (res) {
    //   console.log('ss -',res)  

    //   if(res.data.status == true){




    const url = "wss://ws1.aliceblueonline.com/NorenWS/"

    alert('okk');
    //  console.log('okkk run function');
    // console.log('aa token',instrumentToken);

    socket = new WebSocket(url)

    socket.onopen = function () {
      alert('socketopen')
      connectionRequest()
    }
    socket.onmessage = function (msg) {
      allTokenUpdate(socket);


      var response = JSON.parse(msg.data);
      console.log('response -', response);
      //console.log('response -',response.c);

      if (response.c != undefined) {

        

        // console.log('real price -',response.c);  
        var price = response.bp1 / 100;
        price = parseInt(price) * 100;
        //  console.log('final price ',price);
      //  alert(price);
        setSocketPrice(price);
       

       
        var update_price = response.c;
        var where_token = response.tk;

        // var TokenPrice = [{ "token": response.tk, "price": response.bp1 }];
        // localStorage.setItem('SymboToken', JSON.stringify(TokenPrice));

        // update price 
        axios({
          method: "post",
          url: 'https://api.smartalgo.in:3001/update_price',
          data: {
            'update_price': update_price,
            'where_token': where_token
          }
        }).then(function (res2) {

        });




        // axios({
        //   method: "post",
        //   url: 'https://api.smartalgo.in:3001/updateTokenPriceAllToken',
        //   data: {
        //     'price': price
        //   }
        // }).then(function (res1) {

        //    if(res1.data.status == true){

        //    // alert('okkkk');

        //     //  console.log('all token get -',res1.data.allToken);
        //     res1.data.allToken.forEach(token => {
        //     console.log('token dddd-',token);
        //     setName(token);

        //     var channel = "NFO|" + token
        //       let json = {
        //         k: channel,
        //         t: 't'
        //     };           
        //     socket.send(JSON.stringify(json))                 
        //     });

        //    }        
        // });    


      }


      //  document.getElementById('websocket').value = JSON.stringify(response)

      if (response.s == 'OK') {


        axios({
          method: "get",
          url: 'https://api.smartalgo.in:3001/updateTokenPriceBysocket'

        }).then(function (res) {
          // console.log('ss -',res)  

          if (res.data.status == true) {

            //console.log('inside -token',res.data.token);

            setInstrumentToken(res.data.token);

            alert(res.data.token);

            var channel = 'NFO|' + res.data.token;

            //  console.log('res price token- ',res.data.token);
            // channel = exc + "|" + token       

            let json = {
              k: channel,
              t: 't'
            };
            socket.send(JSON.stringify(json))



          }

        });


      }
    }



  }


  return (
    <div>

      <a
        className="fa-solid  fa-solid  pe-3 fs-5 edit_hover"
        data-toggle="tooltip"
        data-placement="top"
        onClick={() => functionsocket()}
      >RUN</a>
    </div>

  )
}

export default AliceBlueSocket