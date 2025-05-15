module.exports = function (app, connection1) {
    var axios = require('axios');
    var dateTime = require('node-datetime');
    const jwt = require('jsonwebtoken');

    app.post("/kotak_neo/get_token", (req, res) => {
        // return
        console.log("email", req.body.email);
        // return
        connection1.query('SELECT * from client WHERE email="' + req.body.email + '" AND  `trading_type` != "on"', (err, result) => {
            // return
            if (result.length > 0) {
                const qs = require('qs');
                const apiUrl = 'https://napi.kotaksecurities.com/oauth2/token';
                const consumerKey = result[0].api_key;
                const consumerSecret = result[0].api_secret;
                const username = result[0].client_code;
                const password = result[0].api_type; //trade Api pass
                const authString = `${consumerKey}:${consumerSecret}`;
                const authHeaderValue = `Basic ${Buffer.from(authString).toString('base64')}`;
                const requestData = {
                    grant_type: 'password',
                    username: username,
                    password: password
                };

                const config = {
                    headers: {
                        'Authorization': authHeaderValue,
                        // 'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };

                // axios.post(apiUrl, qs.stringify(requestData), config)

                const url = 'https://napi.kotaksecurities.com/oauth2/token';
                const data = 'grant_type=client_credentials';
                const headers = {
                    'Authorization': authHeaderValue
                };

                axios.post(url, data, { headers })
                    .then((response) => {
                        // console.log("response.data", response.data);


                        var access_token = response.data.access_token
                        // console.log('access_token:', access_token);
                        if (response.data.access_token) {
                            var data5 = JSON.stringify({
                                "mobileNumber": result[0].mobile.includes("+91") ? result[0].mobile : "+91" + result[0].mobile,
                                // "mobileNumber": result[0].mobile,
                                "password": password
                            });


                            var config = {
                                method: 'post',
                                maxBodyLength: Infinity,
                                url: 'https://gw-napi.kotaksecurities.com/login/1.0/login/v2/validate',
                                headers: {
                                    'accept': '*/*',
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + access_token,
                                },
                                data: data5
                            };
                            // console.log("config",config);
                            // return

                            axios(config)
                                .then(function (response) {
                                    console.log("response.data v2/validate", response.data);
                                    // return
                                    var stepOneToken = response.data.data.token
                                    var stepOneSID = response.data.data.sid
                                    var stepHsServerId = response.data.data.hsServerId
                                    var decodeAccessToken = jwt.decode(response.data.data.token)
                                    // console.log("decodeAccessToken", decodeAccessToken.sub);
                                    // console.log("stepOneSID", stepOneSID);
                                    // console.log("stepOneToken", stepOneToken);
                                    // console.log("Beare access token", access_token);
                                    // console.log("decodeAccessToken.sub", decodeAccessToken.sub);
                                    if (response.data.data.token) {
                                        var data1 = JSON.stringify({
                                            "userId": decodeAccessToken.sub,
                                            "sendEmail": true,
                                            "isWhitelisted": true
                                        });
                                        var config1 = {
                                            method: 'post',
                                            maxBodyLength: Infinity,
                                            url: 'https://gw-napi.kotaksecurities.com/login/1.0/login/otp/generate',
                                            headers: {
                                                'accept': '*/*',
                                                'Content-Type': 'application/json',
                                                'Authorization': 'Bearer ' + access_token,
                                            },
                                            data: data1
                                        };
                                        // return
                                        axios(config1)
                                            .then(function (response) {
                                                // console.log("OTP APIIIII", response);
                                                // return
                                                if (response.status == 201) {
                                                    console.log("response.status", response.data);

                                                    // console.log("check --");
                                                    // console.log("access_token --", access_token);
                                                    // console.log("stepOneSID --", stepOneSID);
                                                    // console.log("req.body.email --", req.body.email);
                                                    // console.log("stepOneToken --", stepOneToken);
                                                    // console.log("kotakneo_userd --", decodeAccessToken.sub);
                                                    // console.log("check --");
                                                    // console.log("check --");


                                                    // connection1.query('UPDATE `client`SET `oneTimeToken` = ' + access_token + ',`kotakneo_sid` = ' + stepOneSID + ',`kotakneo_auth` = ' + stepOneToken + ',`kotakneo_userd` = ' + decodeAccessToken_sub + 'WHERE `email` = ' + req.body.email + '', (err, result1) => {

                                                    connection1.query('UPDATE `client` SET `oneTimeToken`="' + access_token + '" , `kotakneo_sid`="' + stepOneSID + '", `kotakneo_auth`="' + stepOneToken + '", `kotakneo_userd`="' + decodeAccessToken.sub + '", `hserverid`="' + stepHsServerId + '" WHERE email="' + req.body.email + '"', (err, result1) => {
                                                        console.log("errrrrrrrrrr kotak", err);
                                                        // return
                                                        res.send({ status: true });
                                                    });

                                                } else {
                                                    res.send({ status: false })
                                                }


                                            })
                                            .catch(function (error) {
                                                if (error) {
                                                    if (error.response) {

                                                        // console.log("otp/generate", error.response.data);
                                                        if (error.response.data.error) {
                                                            console.log(error.response.data.error[0]);
                                                            res.send({ status: false, msg: error.response.data.error[0].message })
                                                        }
                                                    }
                                                }
                                            });
                                    }

                                })
                                .catch(function (error) {

                                    if (error.response.data.error) {
                                        console.log("v2/validate", error.response.data.error[0]);
                                        res.send({ status: false, msg: error.response.data.error[0].message })
                                    }


                                });
                        }

                    })
                    .catch(error => {
                        if (error.response) {
                            console.log("oauth2/token", error.response.data.error[0]);
                            res.send({ status: false, msg: error.response.data.error[0].message })
                        }
                    });
            } else {
                res.send({ status: false })
            }
        })

    });




    app.post("/kotak_neo/get_session", (req, res) => {
        connection1.query('SELECT * from client WHERE email="' + req.body.email + '"', (err, result) => {

            // console.log("result", result[0]);
            console.log("otp", req.body.otp);
            // return

            var data2 = JSON.stringify({
                "userId": result[0].kotakneo_userd,
                "otp": req.body.otp
            });
            var config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://gw-napi.kotaksecurities.com/login/1.0/login/v2/validate',
                headers: {
                    'accept': '*/*',
                    'sid': result[0].kotakneo_sid,
                    'Auth': result[0].kotakneo_auth,
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + result[0].oneTimeToken
                },
                data: data2
            };
            // console.log("config", config);
            axios(config)
                .then(function (response) {
                    if (response.status == 201) {
                        // console.log("response step 3", response.data.data.token);
                        connection1.query('UPDATE `client` SET `access_token`="' + response.data.data.token + '" , `trading_type`="on" WHERE email="' + result[0].email + '"', (err, result1) => {

                            var dt = dateTime.create();
                            var ccdate = dt.format('Y-m-d H:M:S');
                            var trading = 'TradingON';
                            connection1.query('INSERT INTO `trading_status_client` (`client_id`,`trading`,`created_at`) VALUES ("' + result[0].id + '","' + trading + '","' + ccdate + '")', (err, result2) => {
                                console.log("err", err);
                            })

                            // res.send({ msg: "Success", data: response.data })
                            res.send({ status: true })
                        })

                    } else {
                        res.send({ status: false, msg: "Please Fill Correct OTP" })
                    }

                })
                .catch(function (error) {
                    console.log("v2/validate", error.response);
                    if (error.response.data.error) {
                        console.log(error.response.data.error[0]);
                        res.send({ status: false, msg: error.response.data.error[0].message })
                    }
                });


        })
    });

}