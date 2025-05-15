const { send } = require('process');

module.exports = function (app, connection1) {
  const sha256 = require('sha256');
  var axios = require('axios');
  var dateTime = require('node-datetime');
  var crypto = require('crypto');



  app.post("/icicidirect/access_token", (req, res) => {
    console.log("/icicidirect/access_token", req.query.email);


    // req.query.apisession
    //  return
    // console.log("host", req.headers);

    var hosts = req.headers.host;

    var redirect = hosts.split(':')[0];
    var redirect_uri = '';
    if (redirect == "api.smartalgo.in") {
      redirect_uri = "https://test.smartalgo.in/"
    } else {
      redirect_uri = `https://${redirect}/`
    }

    var emailstr = req.query.email;
    var email = emailstr.split('?apisession=')[0];
    var apisession = emailstr.split('?apisession=')[1];
    // console.log("apisession", apisession);

    // res.send({"email": email, "apisession":apisession})

    connection1.query('SELECT * from client where `email`="' + email + '"', (err, result) => {
    console.log("result", result);


      if (result.length != 0) {

        var apiSecret = result[0].api_secret;
        var apiKey = result[0].api_key;

        const formatDateToCustomFormat = (date) => {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const day = String(date.getDate()).padStart(2, '0');
          const month = months[date.getMonth()];
          const year = date.getFullYear();
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const seconds = String(date.getSeconds()).padStart(2, '0');
          return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
        };
        const currentDate = new Date();
        const formattedDate = formatDateToCustomFormat(currentDate);
        // console.log("formattedDate", formattedDate);


        var data = JSON.stringify({
          "SessionToken": apisession,
          "AppKey": apiKey.trim()
        });

        var config = {
          method: 'get',
          url: 'https://api.icicidirect.com/breezeapi/api/v1/customerdetails',
          headers: {
            'Content-Type': 'application/json',
          },
          data: data
        };
        // console.log("configggggggggg", config);

        axios(config)
          .then(function (response) {
            // console.log("response", response.data);
            // res.send({ "apiSecret": apiSecret, "apiKey": apiKey, "apisession": apisession, "response": response.data })
            // return
            if (response.data.Status == 200) {
              // console.log("api/v1/customerdetails", response.data);
              var access_token = response.data.Success.session_token
              // console.log("session_tokensession_token", access_token);

              connection1.query('UPDATE `client` SET `access_token` = "' + access_token + '",`trading_type`="on" WHERE `client`.`email`="' + email + '"', (err, result1) => {
                var dt = dateTime.create();
                var ccdate = dt.format('Y-m-d H:M:S');
                var trading = 'TradingON';

                // console.log('INSERT INTO `trading_status_client` (`client_id`,`trading`,`created_at`) VALUES ("' + result[0].id + '","' + trading + '","' + ccdate + '")');

                connection1.query('INSERT INTO `trading_status_client` (`client_id`,`trading`,`created_at`) VALUES ("' + result[0].id + '","' + trading + '","' + ccdate + '")', (err, result2) => {
                  // console.log("err", err);
                  return
                });

              });

              // res.send({ status: true, data: response.data })
              return res.redirect(redirect_uri);

            } else {
              console.log("api/v1/customerdetails error");
              res.send({ status: false, msg: response.data })
            }
          })
          .catch(function (error) {
            console.log("Error =>", error);
            res.send({ status: false, msg: error })
          });

      }

    });

  });




}

