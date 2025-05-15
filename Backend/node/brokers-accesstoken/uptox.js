module.exports = function (app, connection1) {

    app.get('/uptox/:userId', (req, res) => {
        var axios = require('axios');
        var qs = require('qs');
        var dateTime = require('node-datetime');

        const userId = req.params.userId;
        const AccCode = req.query.code;

        
        connection1.query('SELECT * from client where `username`="' + userId + '"', (err, result) => {

            if (result.length != 0) {



                // var data = qs.stringify();

                // var config = {
                //     method: 'post',
                //     url: 'https://api.upstox.com/index/oauth/token',
                //     auth: {
                //         username: result[0].api_key,
                //         password: result[0].api_secret
                //     },
                //     headers: {
                //         'Content-Type': 'application/json',
                //         'x-api-key': result[0].api_key
                //     },
                //     data: {
                //         'code': AccCode,
                //         'grant_type': 'authorization_code',
                //         'redirect_uri': `https://api.smartalgo.in:3001/uptox/uptox123`,

                //     }
                // };


                // var data = {
                //     'grant_type': 'authorization_code',
                //     'code': req.query.code,
                //     'redirect_uri': `https://api.smartalgo.in:3001/uptox/uptox123`,


                // };
                // var config = {
                //     method: 'post',
                //     url: 'https://api.upstox.com/index/oauth/token',
                //     auth: {
                //         username: result[0].api_key,
                //         password: result[0].api_secret
                //     },
                //     headers: {
                //         'Content-Type': 'application/json',
                //         'x-api-key': result[0].api_key
                //     },
                //     data: JSON.stringify(data)
                // };
             


                const API_KEY = 'b2f3ff02-e710-4c55-a62d-f186e369e08d';
                const API_SECRET = '0xk7yy1lox';
                const REDIRECT_URI = 'https://api.smartalgo.in:3001/uptox/uptox123';





                const url = 'https://api.upstox.com/index/oauth/token';
                const data = {
                    code:req.query.code,
                    grant_type: 'authorization_code',
                    redirect_uri: REDIRECT_URI,
                  };

                const config = {
                    method: 'post',
                    url: url,
                  headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                  },
                  data : data
                };
               
                const authHeader = `Basic ${Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64')}`;
                config.headers.Authorization = authHeader;
              




               console.log("shakir logn");


                // const authorization = Buffer.from(`${result[0].api_key}:${result[0].api_secret}`).toString('base64');
                // const headers = {
                //   'Authorization': `Basic ${authorization}`,
                //   'Content-Type': 'application/x-www-form-urlencoded'
                // };
                // const data = {
                //   grant_type: 'authorization_code',
                //   code: req.query.code,
                //   redirect_uri: 'https://api.smartalgo.in:3001/uptox/uptox123'
                // };

                // var config = {
                //     method: 'post',
                //     url: 'https://api.upstox.com/index/oauth/token',
                //     headers:{
                //         'Authorization': `Basic ${authorization}`,
                //         'Content-Type': 'application/x-www-form-urlencoded',
                //         'x-api-key':result[0].api_key
                //     },

                //     data: data
                // };






                console.log(config);

                axios(config)
                    .then(function (response) {


                        console.log("response upstox", response);

                        var access_token = response.data.access_token;
                        connection1.query('UPDATE `client` SET `access_token` = "' + access_token + '",`trading_type`="on" WHERE `client`.`id`="' + user_id + '"', (err, result) => {

                            var dt = dateTime.create();
                            var ccdate = dt.format('Y-m-d H:M:S');
                            var trading = 'TradingON';
                            connection1.query('INSERT INTO `trading_status_client` (`client_id`,`trading`,`created_at`) VALUES ("' + user_id + '","' + trading + '","' + ccdate + '")', (err, result) => {
                                console.log("err", err);
                                return res.redirect(redirect_uri);


                            })


                        });
                    })
                    .catch(function (error) {
                        console.log("ss",error.response.data);
                    });
            }

        });

    })
}