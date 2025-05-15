const { send } = require('process');

module.exports = function (app, connection1) {
    const sha256 = require('sha256');
    var axios = require('axios');
    var dateTime = require('node-datetime');

    app.post("/dhan/access_token", (req, res) => {

        var axios = require('axios');
        var dateTime = require('node-datetime');
        const sha256 = require('sha256');

        var state = Buffer.from(req.body.State, 'base64');
        state = JSON.parse(state);
        var user_id = state.user_id;
        // console.log("stateeeee", state);

        connection1.query('SELECT * from client where `id`="' + user_id + '"', (err, result) => {
            // console.log("client_code", result[0].client_code);
            // console.log("access_token", result[0].api_key);

            if (user_id) {
                // console.log('laxmi -', access_token)
                var dt = dateTime.create();
                var ccdate = dt.format('Y-m-d H:M:S');
                var trading = 'TradingON';

                connection1.query('UPDATE `client` SET `access_token` = "' + result[0].api_key + '",`client_code` = "' + result[0].client_code + '",`trading_type`="on" WHERE `client`.`id`="' + user_id + '"', (err, result) => {
                });
                connection1.query('INSERT INTO `trading_status_client` (`client_id`,`trading`,`created_at`) VALUES ("' + user_id + '","' + trading + '","' + ccdate + '")', (err, result) => {
                    // console.log("err", err);
                    return
                });
                res.send({ status: true })

            } else if (response.data.status == "error") {
                res.send({ status: false })
            }

            return


            var data = JSON.stringify({
                "secretKey": result[0].api_secret,
                "appKey": result[0].api_key,
                "source": "WEBAPI"
            });

            // console.log("data", data)

            // return
            var config = {
                method: 'post',
                url: 'https://trades.lakshmishree.com/interactive/user/session',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios(config)
                .then(function (response) {
                    // console.log("laxmi", response.data);

                    if (response.data.type == "success") {
                        var access_token = response.data.result.token;
                        var clientCode = response.data.result.userID
                        // console.log('laxmi -', access_token)
                        var dt = dateTime.create();
                        var ccdate = dt.format('Y-m-d H:M:S');
                        var trading = 'TradingON';

                        connection1.query('UPDATE `client` SET `access_token` = "' + access_token + '",`client_code` = "' + clientCode + '",`trading_type`="on" WHERE `client`.`id`="' + user_id + '"', (err, result) => {
                        });
                        connection1.query('INSERT INTO `trading_status_client` (`client_id`,`trading`,`created_at`) VALUES ("' + user_id + '","' + trading + '","' + ccdate + '")', (err, result) => {
                            console.log("err", err);
                            return
                        });
                        res.send({ status: true, data: response.data })

                    } else if (response.data.status == "error") {
                        res.send({ status: false, data: response.data.message })
                    }
                })
                .catch(function (error) {
                    // console.log("Error =>",error);

                    console.log("Error =>", error.response.data);
                    if (error.response.data.description) {
                        res.send({ status: false, data: error.response.data.description })
                    } else if (error.response.data.result) {
                        res.send({ status: false, data: error.response.data.result.errors })
                    } else {
                        res.send({ status: false, data: error })

                    }
                });
        })
    });
}