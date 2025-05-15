const { send } = require('process');

module.exports = function (app, connection1) {

  app.post("/mastertrust_dealer/accesstoken", (req, res) => {



    var axios = require('axios');
    var dateTime = require('node-datetime');
    const sha256 = require('sha256');

    var state = Buffer.from(req.body.State, 'base64');
    state = JSON.parse(state);
    var panel = state.panel;
    var redirect_uri = state.url;



    var user_id = state.user_id;


    connection1.query('SELECT * from client where `id`="' + user_id + '"', (err, result) => {

      if (result.length != 0) {

        var password = result[0].app_id;
        var appkey = result[0].api_key;
        var account_id = result[0].api_secret;
        var vendor_code = result[0].api_type;
        var uid = result[0].client_code;


        // var appkey = result[0].api_key;
        // var uid = result[0].client_code;

        // var password = req.body.password;
        // var account_id = req.body.accountId;
        // var vendor_code = req.body.VandarCode;

        var pwd_sha256 = sha256(password);
        var appkey_sha256 = sha256(uid + "|" + appkey);

        // APP KEY sha256 uid|appkey

        //Example appkey genrate sha 256 uid|app key

        var data = { uid: uid, pwd: pwd_sha256, apkversion: '1.0.8', imei: '', vc: vendor_code, appkey: appkey_sha256, source: 'API' }
        var raw = "jData=" + JSON.stringify(data);


        var config = {
          method: 'post',
          url: 'https://mid.mastertrust.co.in/DealerWClient/QuickAuth',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data: raw
        };

        axios(config)
          .then(function (response) {
            console.log("stat -", JSON.stringify(response.data.stat));


            if (response.data.stat == "Ok") {

              console.log("response.data.susertoken -", response.data.susertoken);

              connection1.query('UPDATE `client` SET `access_token` = "' + response.data.susertoken + '",`trading_type`="on"  WHERE `client`.`id`="' + user_id + '"', (err, result) => {
                ///return res.redirect(redirect_uri);
                if (result.length != 0) {
                  var dt = dateTime.create();
                  var ccdate = dt.format('Y-m-d H:M:S');
                  var trading = 'TradingON';
                  connection1.query('INSERT INTO `trading_status_client` (`client_id`,`trading`,`created_at`) VALUES ("' + user_id + '","' + trading + '","' + ccdate + '")', (err, result) => {
                    console.log("err", err);

                    res.send({ status: true });
                  })
                }
              });




            } else {
              // res.send("else");
              //  console.log("error -- 1");

              res.send({ status: false, msg: response.data.emsg });


            }


          })
          .catch(function (error) {
            console.log("error -- 2", error.response.data.stat);

            if (error.response.data.stat == "Not_Ok") {
              res.send({ status: false, msg: error.response.data.emsg });
            } else {
              res.send({ status: false, msg: "Invalid request" });

            }
          });


      }

    });


  });





}