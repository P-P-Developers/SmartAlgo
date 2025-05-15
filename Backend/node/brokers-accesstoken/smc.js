const { send } = require('process');

module.exports = function (app, connection1) {
    const sha256 = require('sha256');
    var axios = require('axios');
    var dateTime = require('node-datetime');

    app.post("/smc/access_token", (req, res) => {

        try {

            var axios = require('axios');
            var dateTime = require('node-datetime');
            const sha256 = require('sha256');
            var state = Buffer.from(req.body.State, 'base64');
            state = JSON.parse(state);
            var user_id = state.user_id;

            console.log(user_id)

            connection1.query('SELECT * from client where `id`="' + user_id + '"', (err, result) => {

                if (err) {
                    console.log("error from smc file", err)
                }

                var secretKey = result[0].api_secret;
                var appKey = result[0].api_key;

                console.log("secretKey", secretKey);
                console.log("appKey", appKey);


                var data = JSON.stringify({
                    "secretKey": secretKey,
                    "appKey": appKey,
                    "source": "WebAPI"
                }
                )

                var config = {
                    method: "post",
                    url: 'https://tradex.smcindiaonline.com/interactive/user/session',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };

                axios(config)
                    .then(function (response) {
                        console.log(response.data)
                        if (response.data.type == "success") {
                            //  return console.log(response.data.result.token);
                            connection1.query('UPDATE `client` SET `access_token` = "' + response.data.result.token+ '",`trading_type`="on"  WHERE `client`.`id`="' + user_id + '"', (err, result) => {

                                if (result.length != 0) {
                                    var dt = dateTime.create();
                                    var ccdate = dt.format('Y-m-d H:M:S');
                                    var trading = 'TradingON';
                                    connection1.query('INSERT INTO `trading_status_client` (`client_id`,`trading`,`created_at`) VALUES ("' + user_id + '","' + trading + '","' + ccdate + '")', (err, result) => {
                                        console.log("err", err);
                                         console.log(result)
                                        return res.send({ status: true });
                                    })
                                }

                            });
                        }

                    }
                    ).catch(function (err) {
                        if (err.response.data.type == "error") {
                            console.log(err.response.data.description)
                            // res.send(err.response.data.description)
                            return res.send({ status: false, data:err.response.data.description })
                        }
                        else {
                            return res.send({ status: false, data:err.response.data })
                        }
                    }

                    )

            })
        }
        catch (err) {
            console.log("smc broker error",err)
        }

    });
}