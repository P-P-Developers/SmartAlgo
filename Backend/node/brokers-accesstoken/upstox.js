const { send } = require('process');

module.exports = function (app, connection1) {
  const sha256 = require('sha256');
  var axios = require('axios');
  var dateTime = require('node-datetime');
  var crypto = require('crypto');
  const qs = require('querystring');



  app.get("/upstox/access_token", (req, res) => {
    // console.log("req.query", req.query);

    var hosts = req.headers.host;

    var redirect = hosts.split(':')[0];
    var redirect_uri = '';
    if (redirect == "api.smartalgo.in") {
      redirect_uri = "https://test.smartalgo.in/"
    } else {
      redirect_uri = `https://${redirect}/`
    }

    var tokenCode = req.query.code;
    var user_email = req.query.state;

    connection1.query('SELECT * from client where `email`="' + user_email + '"', (err, result) => {

      if (result.length != 0) {

        var apiKey = result[0].api_key;
        var apiSecret = result[0].api_secret;

        // Define the request data
        const requestData = {
          code: tokenCode,
          client_id: apiKey,
          client_secret: apiSecret,
          redirect_uri: `https://${hosts}/backend/upstox/access_token`,
          grant_type: 'authorization_code'
        };

        // Define the URL and headers
        const url = 'https://api-v2.upstox.com/login/authorization/token';
        const headers = {
          'accept': 'application/json',
          'Api-Version': '2.0',
          'Content-Type': 'application/x-www-form-urlencoded'
        };

        // Make the POST request
        axios.post(url, qs.stringify(requestData), { headers })
          .then(response => {
            const accessToken = response.data.access_token;
            // console.log('Access Token:', accessToken);

            if (accessToken !== undefined) {

              connection1.query('UPDATE `client` SET `access_token`="' + accessToken + '" , `trading_type`="on" WHERE email="' + result[0].email + '"', (err, result1) => {

                var dt = dateTime.create();
                var ccdate = dt.format('Y-m-d H:M:S');
                var trading = 'TradingON';

                connection1.query('INSERT INTO `trading_status_client` (`client_id`,`trading`,`created_at`) VALUES ("' + result[0].id + '","' + trading + '","' + ccdate + '")', (err, result2) => {
                  console.log("err", err);
                })

                res.send({ msg: "Success", data: response.data })
              })

              return res.redirect(redirect_uri);

            } else {
              // console.log("response", response);
              res.send({ msg: "error", data: response })
            }

          })
          .catch(error => {
            console.error('Error:', error);
            res.send({ msg: "error", data: error })
          });

      }

    });

  });

}

