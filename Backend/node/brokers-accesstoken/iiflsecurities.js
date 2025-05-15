module.exports = function (app, connection1) {


  app.post("/iiflsecurities/access_token", (req, res) => {

    var axios = require('axios');
    var dateTime = require('node-datetime');
    const sha256 = require('sha256');
    var CryptoJS = require("crypto-js");
    const crypto = require("crypto");
    var md5 = require('md5');




    console.log('req.body.State -', req.body.State);

    var state = Buffer.from(req.body.State, 'base64');
    state = JSON.parse(state);
    console.log('state -', state);
    var panel = state.panel;
    var redirect_uri = state.url;

    // console.log('state panel cc', panel);
    // console.log('redirect uri -', redirect_uri);

    var user_id = state.user_id;
    console.log('user_id -', user_id);

    var dt = dateTime.create();
    var ccdate = dt.format('Y-m-d H:M:S');


    connection1.query('SELECT * from client where `id`="' + user_id + '"', (err, result) => {


      if (result.length != 0) {

        var user_id = result[0].id;

        const appkey = result[0].api_key;
        const secretkey = result[0].api_secret;


        var config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://ttblaze.iifl.com:4000/HostLookUp',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            "accesspassword": "2021HostLookUpAccess",
            "version": "interactive_1.0.1"
          }
        };

        axios(config)
          .then(function (response) {
            // console.log(response.data);
            var accesspassword = response.data.result.uniqueKey
            var connectionString = response.data.result.connectionString


            var config = {
              method: 'post',
              maxBodyLength: Infinity,
              url: connectionString+'/user/session',
              headers: {
                'Content-Type': 'application/json'
              },
              data: {
                "secretKey": secretkey,
                "appKey": appkey,
                "uniqueKey":accesspassword,
                "source": "WebAPI"
              }
            };

            axios(config)
              .then(function (response) {
                if(response.data.type == 'success'){
                  


                  connection1.query('UPDATE `client` SET `access_token` = "' + response.data.result.token + '",`trading_type`="on" , `api_type`="'+ connectionString+'" WHERE `client`.`id`="' + user_id + '"', (err, result1) => {
                    ///res.send({ success: 'true' });
                    if (result1.length != 0) {
                        var dt = dateTime.create();
                        var ccdate = dt.format('Y-m-d H:M:S');
                        var trading = 'TradingON';
                        connection1.query('INSERT INTO `trading_status_client` (`client_id`,`trading`,`created_at`) VALUES ("' + user_id + '","' + trading + '","' + ccdate + '")', (err, result) => {
                            console.log("err", err);
                            res.send({ status: true,msg:"Login Successfully" });
                        })
                    }
                }); 

                }else{
                  const message = (JSON.stringify(response.data)).replace(/["',]/g, '');
                  res.send({ status: false,msg:message });   
                }
              })
              .catch(function (error) {
                console.log(error.response.data);
                const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');
                res.send({ status: false,msg:message });
              });

          })
          .catch(function (error) {
            console.log(error.response.data);
            const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');
            res.send({ status: false,msg:message});
          });
      }
    });



  });








}