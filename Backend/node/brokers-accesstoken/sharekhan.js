module.exports = function (app, connection1) {
//s
  app.get("/sharekhan/access_token", (req, res) => {

    var axios = require('axios');
    var dateTime = require('node-datetime');
    const sha256 = require('sha256');
    const crypto = require("crypto");

    // console.log("host",req.headers);

    var hosts = req.headers.host;

    var redirect = hosts.split(':')[0];
    var redirect_uri = '';
    if (redirect == "api.smartalgo.in") {
      redirect_uri = "https://test.smartalgo.in/"
    } else {
      redirect_uri = `https://${redirect}/`
    }


    //res.send(redirect_uri);


    // console.log('redirect_uri -',redirect_uri);

    console.log('req query -', req.query);

    // res.send("okk")

    var emailstr = req.query.request_token;

    var email = emailstr.split('?request_token=')[0];

    //var request_token = emailstr.split('?request_token=')[1]; 
    var request_token = req.query.request_token;
    var state = req.query.state;


    console.log('request_token - ', request_token)
    console.log('state - ', state)
    //  console.log('request_token - ',request_token)

    //  res.send({"request_token":request_token,"email":email});

    connection1.query('SELECT * from client where `username`="' + state + '"', (err, result) => {
      // console.log('api_secret - ', result[0].api_secret);
      // console.log("client_code", result[0].client_code);
      // console.log("access_token", result[0].api_key);


      if (result.length != 0) {

        var apiKey = result[0].api_key
        const algorithm = 'aes-256-gcm';
        const iv = Buffer.from('AAAAAAAAAAAAAAAAAAAAAA==', 'base64');
        const Secretkey = Buffer.from(result[0].api_secret, 'utf-8');
        var decBytes = Buffer.from(request_token, 'base64');
        var dec = decBytes.slice(0, decBytes.length - 16);
        var decipher = crypto.createDecipheriv(algorithm, Secretkey, iv);
        var txt = decipher.update(dec.toString('base64'), 'base64', 'utf8');
        let splitText = txt.split('|');
        let message = splitText[1] + '|' + splitText[0];
        var cipher = crypto.createCipheriv(algorithm, Secretkey, iv);
        var ciph = cipher.update(message, 'utf8', 'base64') + cipher.final('base64');
        var combinedBytes = [Buffer.from(ciph, 'base64'), cipher.getAuthTag()];
        var final_request_token = Buffer.concat(combinedBytes).toString('base64');

        // console.log("Encrypted message: " + final_request_token);

        const apiUrl = 'https://api.sharekhan.com/skapi/services/access/token';
        const requestData = {
          apiKey: apiKey,
          requestToken: final_request_token,
          state: '12345',
        };
        axios.post(apiUrl, requestData, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            if (response.status === 200) {
              const responseData = response.data.data;

              // Access Token and user data
              const access_token = responseData.token;
              const fullName = responseData.fullName;
              const customerId = responseData.customerId;
              const exchanges = responseData.exchanges;
              const loginId = responseData.loginId;

              // res.send({response : responseData})

              // console.log('Access Token:', accessToken);
              // console.log('Full Name:', fullName);
              // console.log('Customer ID:', customerId);
              // console.log('Exchanges:', exchanges);
              // console.log('Login ID:', loginId);

              connection1.query('UPDATE `client` SET `access_token` = "' + access_token + '",`trading_type`="on" WHERE `client`.`username`="' + state + '"', (err, result1) => {
                var dt = dateTime.create();
                var ccdate = dt.format('Y-m-d H:M:S');
                var trading = 'TradingON';

                // console.log('INSERT INTO `trading_status_client` (`client_id`,`trading`,`created_at`) VALUES ("' + result[0].id + '","' + trading + '","' + ccdate + '")');

                connection1.query('INSERT INTO `trading_status_client` (`client_id`,`trading`,`created_at`) VALUES ("' + result[0].id + '","' + trading + '","' + ccdate + '")', (err, result) => {
                  // console.log("err", err);
                  return
                });

              });

              return res.redirect(redirect_uri);
              // else if (response.data.status == "error") {
              //     res.send({ status: false })
              // }
            } else {
              console.log('Error:', response.status, response.data);
            }
          })
          .catch((error) => {
            console.error('API Request Error:', error);
          });



      }





    })

  });

}