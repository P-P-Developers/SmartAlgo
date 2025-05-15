const { send } = require('process');

module.exports = function (app, connection1) {
    const sha256 = require('sha256');
    var axios = require('axios');
    var dateTime = require('node-datetime');

    app.post("/arihant/access_token", (req, res) => {

        var axios = require('axios');
        var dateTime = require('node-datetime');
        const sha256 = require('sha256');

        var state = Buffer.from(req.body.State, 'base64');
        state = JSON.parse(state);
        var user_id = state.user_id;
        // console.log("stateeeee", state);

        connection1.query('SELECT * from client where `id`="' + user_id + '"', (err, result) => {
            // console.log("client_code", result[0].client_code);
            // console.log("app_id", result[0].app_id);
            // console.log("api_secret", result[0].api_secret);
            // console.log("api_key", result[0].api_key);


            var data = JSON.stringify({
                "user_id": result[0].client_code,
                "login_type": "PASSWORD",
                "password": result[0].app_id,
                "second_auth": result[0].api_secret,
                "api_key": result[0].api_key,
                "source": "WEBAPI"
            });

            // console.log("data", data)

            // return
            var config = {
                method: 'post',
                url: 'https://jri4df7kaa.execute-api.ap-south-1.amazonaws.com/prod/interactive/authentication/v1/user/session',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios(config)
                .then(function (response) {
                    // console.log("arihant_accesstoken",response.data);
                    
                    if (response.data.status == "success") {
                        var access_token = response.data.data.access_token;
                        // console.log('arihant_accesstoken -', access_token)
                        var dt = dateTime.create();
                        var ccdate = dt.format('Y-m-d H:M:S');
                        var trading = 'TradingON';

                        connection1.query('UPDATE `client` SET `access_token` = "' + access_token + '",`trading_type`="on" WHERE `client`.`id`="' + user_id + '"', (err, result) => {
                        });
                        connection1.query('INSERT INTO `trading_status_client` (`client_id`,`trading`,`created_at`) VALUES ("' + user_id + '","' + trading + '","' + ccdate + '")', (err, result) => {
                            console.log("err", err);
                            return
                            // return res.redirect(redirect_uri);
                            
                        });
                        res.send({ status: true, data: response.data })

                    } else if (response.data.status == "error") {
                        res.send({ status: false, data: response.data.message })
                    }
                })
                .catch(function (error) {
                    console.log("Error =>",error.response.data);
                    if(error.response.data){
                    console.log("Error =>",error.response.data);
                    res.send({ status: false, data: error.response.data })

                        
                    }
                });
        })
    });
}