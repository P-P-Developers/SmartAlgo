const { send } = require('process');

module.exports = function (app, connection1) {
    const sha256 = require('sha256');
    var axios = require('axios');
    var dateTime = require('node-datetime');

    app.post("/swastika/access_token", (req, res) => {

        try {
            var totp = req.body.totp;

            //  return console.log(totp,"-----totp");
            var axios = require('axios');
            var dateTime = require('node-datetime');
            const sha256 = require('sha256');

            console.log(totp, "totp");

            var state = Buffer.from(req.body.State, 'base64');
            state = JSON.parse(state);
            var user_id = state.user_id;

            // console.log("stateeeee", state);
            //  var totp = req.body.totp
            console.log(user_id)

            connection1.query('SELECT * from client where `id`="' + user_id + '"', (err, result) => {
                console.log("api_key", result[0].api_key);
                console.log("api_secret", result[0].api_secret);

     
                var clientCode = result[0].client_code;
                var MPIN = result[0].app_id;
                
                console.log(clientCode, "client_code");
                console.log(MPIN, "MPIN");
                

                var data = JSON.stringify({
                    "Totp": totp,
                    "ClientCode": clientCode,
                    "MPIN": MPIN,
                    "GenerationSourceTP": "FTLTP",
                    "IPAddress": "192.168.0.1"
                })

                var config = {
                    method: "post",
                    // url: 'https://stagingtradingorestapi.swastika.co.in/auth/TOTP/VerifyTotp',
                    url: 'https://tradingorestapi.swastika.co.in/auth/TOTP/VerifyTotp',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };

                axios(config)
                    .then(function (response) {

                        if (response.data.IsError == false) {
                          
                            connection1.query('UPDATE `client` SET `access_token` = "' + response.data.Result.Data.AccessToken + '",`trading_type`="on"  WHERE `client`.`id`="' + user_id + '"', (err, result) => {

                                if (result.length != 0) {
                                    var dt = dateTime.create();
                                    var ccdate = dt.format('Y-m-d H:M:S');
                                    var trading = 'TradingON';
                                    connection1.query('INSERT INTO `trading_status_client` (`client_id`,`trading`,`created_at`) VALUES ("' + user_id + '","' + trading + '","' + ccdate + '")', (err, result) => {
                                        console.log("err", err);
                                        //  console.log(result)
                                        return res.send({ status: true });
                                    })
                                }

                                  try  {
                                    var data = JSON.stringify({
                                        "Uid": clientCode,
                                        "MPIN": MPIN
                                       })


                                       var config = {
                                        method: "post",
                                        url: 'https://stagingtradingorestapi.swastika.co.in/auth/Login/VerifySTPMPIN',
                                        headers: {
                                            'Content-Type': 'application/json',
                                             "Authorization":`Bearer ${response.data.Result.Data.AccessToken}`
                                        },
                                        data: data
                                    };

                                    axios(config).then(function(response) {
                                        console.log(response.data)
                                         
                                    }).catch(err => console.log(err))

                                  }
                                  catch(err) {
                                    console.log(err)
                                  }

                        

                            });
                        } else if (response.data.IsError == true) {

                            return res.send({ status: false, data: response.data.ResponseException.ExceptionMessage })
                        }

                    }).catch((err) => {
                        console.log("Swastika Error--", err.response.data.ResponseException.ExceptionMessage)
                        if (err.response.data.ResponseException.ExceptionMessage) {
                            return res.send({ status: false, data: err.response.data.ResponseException.ExceptionMessage })
                        } else {
                            return res.send({
                                status: false, data: err.response.data
                            })
                        }
                    })


            })
        }
        catch (err) {
            console.log(err)
        }

    });
}