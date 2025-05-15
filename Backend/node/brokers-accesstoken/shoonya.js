const { send } = require('process');

module.exports = function (app, connection1) {
    const sha256 = require('sha256');
    var axios = require('axios');
    var dateTime = require('node-datetime');

    app.post("/shoonya/access_token", (req, res) => {
        try {
            const otplib = require('otplib');

            var axios = require('axios');
            var dateTime = require('node-datetime');
            const sha256 = require('sha256');

            var state = Buffer.from(req.body.State, 'base64');
            state = JSON.parse(state);
            var user_id = state.user_id;

            connection1.query('SELECT * from client where `id`="' + user_id + '"', (err, result) => {

                // Generate TOTP
                const totp = otplib.authenticator.generate(result[0].demat_userid);

                var params = {
                    'userid': result[0].client_code,
                    'password': result[0].api_type,
                    'twoFA': totp,
                    'vendor_code': result[0].api_key,
                    'api_secret': result[0].api_secret,
                    'imei': result[0].app_id
                }


                let pwd = sha256(params.password).toString();
                let u_app_key = `${params.userid}|${params.api_secret}`
                let app_key = sha256(u_app_key).toString();

                let authparams = {
                    "source": "API",
                    "apkversion": "js:1.0.0",
                    "uid": params.userid,
                    "pwd": pwd,
                    "factor2": params.twoFA,
                    "vc": params.vendor_code,
                    "appkey": app_key,
                    "imei": params.imei
                };

                console.log("authparams", authparams)

                let payload = 'jData=' + JSON.stringify(authparams);


                axios.post('https://api.shoonya.com/NorenWClientTP/QuickAuth', payload, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(response => {
                        console.log(response.data);

                        if (response.data.stat == "Ok") {

                            connection1.query('UPDATE `client` SET `access_token` = "' + response.data.susertoken + '",`trading_type`="on"  WHERE `client`.`id`="' + user_id + '"', (err, result) => {

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


                            });
                        }else{
                            return res.send({ status: false, data: response.data.emsg });
                        }


                    })
                    .catch((error) => {
                        if (error.response.data) {
                            console.log("error1", error.response.data);
                            return res.send({ status: false, data: error.response.data });
                        }else{
                            console.log("error2", error);
                            return res.send({ status: false, data: error });
                        }
                  

                    });




            })
        }
        catch (err) {
            console.log(err)
        }

    });
}