const { send } = require('process');

module.exports = function (app, connection1, connection_smartalgo) {
    const sha256 = require('sha256');
    var axios = require('axios');
    var dateTime = require('node-datetime');

    app.get("/aliceblue/access_token", (req, res) => {

        console.log("access token alice Blue -- ", req)

        var axios = require('axios');
        var dateTime = require('node-datetime');
        const sha256 = require('sha256');

        console.log("host", req.headers);

        var hosts = req.headers.host;

        var redirect = hosts.split(':')[0];
        var redirect_uri = '';
        if (redirect == "api.smartalgo.in") {
            redirect_uri = "https://test.smartalgo.in/"
        } else {
            redirect_uri = `https://${redirect}/`
        }

        var emailstr = req.query.email;

        var email = emailstr.split('?authCode=')[0];

        var authCode = emailstr.split('?authCode=')[1];

        connection1.query('SELECT * from client where `email`="' + email + '"', (err, result) => {


            if (result.length != 0) {

                var user_id = result[0].id;
                var apiSecret = result[0].api_secret;
                var userId = req.query.userId;
                var Encrypted_data = sha256(userId + authCode + apiSecret);
                var data = { "checkSum": Encrypted_data }


                var config = {
                    method: 'post',
                    url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/sso/getUserDetails',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };

                axios(config)
                    .then(function (response) {

                        console.log('respons - ', response.data);
                        if (response.data.userSession) {
                            connection1.query('UPDATE `client` SET `access_token` = "' + response.data.userSession + '",`trading_type`="on",`client_code`="' + userId + '" WHERE `client`.`id`="' + user_id + '"', (err, result1) => {

                                if (result1.length != 0) {
                                    var dt = dateTime.create();
                                    var ccdate = dt.format('Y-m-d H:M:S');
                                    var trading = 'TradingON';
                                    connection1.query('INSERT INTO `trading_status_client` (`client_id`,`trading`,`created_at`) VALUES ("' + user_id + '","' + trading + '","' + ccdate + '")', (err, result) => {
                                        console.log("err", err);

                                        return res.redirect(redirect_uri);
                                    })
                                }
                            });
                        }

                    })
                    .catch(function (error) {
                        console.log('access token error ', error);
                    });


            }


        });



    });






    app.get("/AliceBlue", (req, res) => {

        console.log("host", req.headers);

        var hosts = req.headers.host;

        // var redirect_uri = hosts+'/#/admin/executivetrade';





        var redirect = hosts.split(':')[0];
        var redirect_uri = '';
        if (redirect == "api.smartalgo.in") {
            redirect_uri = "https://test.smartalgo.in/#/manual/optionchain"
        } else {
            redirect_uri = `https://${redirect}/#/manual/optionchain`
        }


        connection1.query('SELECT * FROM `client_key_prefix_letters` LIMIT 1', async (err, panel_key) => {

            var domain_url = panel_key[0].domain_url_https;

            var new_redirect_uri = `${domain_url}#/manual/optionchain`
            connection1.query('SELECT * FROM `alicebluetoken` LIMIT 1', (err, alice_blue_token) => {


                var id = alice_blue_token[0].id;
                var apiSecret = alice_blue_token[0].api_secret;
                var userId = req.query.userId;
                var authCode = req.query.authCode;


                var Encrypted_data = sha256(userId + authCode + apiSecret);

                var data = { "checkSum": Encrypted_data }


                var config = {
                    method: 'post',
                    url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/sso/getUserDetails',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };

                axios(config)
                    .then(function (response) {

                        var dt = dateTime.create();
                        var ccdate = dt.format('Y-m-d H:M:S');

                        //   console.log('respons fffff- ',response.data.stat);

                        if (response.data.stat == "Ok") {
                            var trading_status = 1;

                            connection1.query('UPDATE `alicebluetoken` SET `access_token` = "' + response.data.userSession + '",`trading`="' + trading_status + '",`client_code`="' + userId + '" ,`update_at`="' + ccdate + '" WHERE `id`="' + id + '"', (err, result1) => {

                                //res.send({status:true})
                                return res.redirect(new_redirect_uri);

                            });

                        } else {
                            return res.redirect(new_redirect_uri);
                            // res.send({status:false})
                        }

                    })
                    .catch(function (error) {
                        console.log('access token error ', error);
                    });





            });

        });



    });






}






