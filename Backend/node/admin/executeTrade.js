module.exports = function (app, connection1,io) {
    var verifyToken = require('./middleware/awtJwt');



    var axios = require('axios');
    var fs = require("fs");

    var dateTime = require('node-datetime');
    var dt = dateTime.create();
    var ccdate = dt.format('Y-m-d');

    //var $ = require("jquery");
    const WebSocket = require('ws');
    var CryptoJS = require("crypto-js");
    const path = require('path');
    const redis = require('redis');
    const client_redis = redis.createClient(3001, '180.149.241.18');
    // Connect to Redis
    client_redis.on('connect', function() {
        console.log('Connected to Redis');
    });

   client_redis.connect();








   //------------Targetstoploss_check_status----------//
   app.get('/TargetstoplosStutus',function(req,res){
    targetstoploss_check_status(io,"SBIN");

    connection1.query('SELECT `status` FROM `targetstoploss_check_status`', (err, result) => {
      res.send({status:result[0].status})
    }); 
   })

   app.get('/TargetstoplosStutusUpdate',function(req,res){
    connection1.query('UPDATE `targetstoploss_check_status` SET `status` = "' + 0 + '"  WHERE `id` = "1"', (err, result) => {
        res.send({status:true})
    }); 
   })

   ////////////////////////////
  



    //---------------------Start Cron Stop loss target -------------------------//



    app.get("/exitstoplosstarget", function (req, res) {

        connection1.query('SELECT `panel_key` FROM `client_key_prefix_letters` LIMIT 1', (err, panel_key) => {


            var panelKey = panel_key[0].panel_key

            connection1.query('SELECT * FROM `exucated_all_trade` WHERE `squareoff`= "0" AND `previous_trade_id` IS NULL', (err, exitstoplosstarget_result) => {

                exitstoplosstarget_result.forEach(element => {

                    if (element.type == "SE") {

                        fs.readFile("AllTokenJsonFile/" + element.token + ".json", "utf8", (err, jsonString) => {

                            const token_live_price = JSON.parse(jsonString);
                            // console.log("token_live_price - ", token_live_price.lp);
                            // console.log("stoploss_price - ", element.stoploss_price);
                            // console.log("target_price - ", element.target_price);
                            var live_price = token_live_price.lp
                            // if(token_live_price.lp != undefined){


                            if (parseFloat(live_price) > parseFloat(element.stoploss_price)) {

                                if (element.srtoploss_status == 1) {

                                    var type = "";
                                    if (element.type == "LE") {
                                        type = "LX";
                                    }
                                    else if (element.type == "SE") {
                                        type = "SX";
                                    }


                                    var request = "id:12@@@@@input_symbol:" + element.input_symbol + "@@@@@type:" + type + "@@@@@price:" + element.stoploss_price + "@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:" + panelKey + "@@@@@exchange:NFO@@@@@product_type:MIS@@@@@strike:" + element.strike_price + "@@@@@segment:O@@@@@option_type:" + element.option_type + "@@@@@expiry:" + element.expiry + "@@@@@strategy:" + element.strategy_tag + "@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@token:" + element.token + "@@@@@entry_trade_id:" + element.id + "@@@@@tradesymbol:" + element.tradesymbol + "@@@@@demo:demo";

                                    ExitStopLossAndTargetSendRequest(request);

                                }

                            }

                            else if (parseFloat(element.target_price) > parseFloat(live_price)) {

                                if (element.target_status == 1) {
                                    var type = "";
                                    if (element.type == "LE") {
                                        type = "LX";
                                    }
                                    else if (element.type == "SE") {
                                        type = "SX";
                                    }


                                    var request = "id:12@@@@@input_symbol:" + element.input_symbol + "@@@@@type:" + type + "@@@@@price:" + element.target_price + "@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:" + panelKey + "@@@@@exchange:NFO@@@@@product_type:MIS@@@@@strike:" + element.strike_price + "@@@@@segment:O@@@@@option_type:" + element.option_type + "@@@@@expiry:" + element.expiry + "@@@@@strategy:" + element.strategy_tag + "@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@token:" + element.token + "@@@@@entry_trade_id:" + element.id + "@@@@@tradesymbol:" + element.tradesymbol + "@@@@@demo:demo";

                                    ExitStopLossAndTargetSendRequest(request);
                                }

                            }





                            //}


                        });

                    } else if (element.type == "LE") {

                        fs.readFile("AllTokenJsonFile/" + element.token + ".json", "utf8", (err, jsonString) => {

                            const token_live_price = JSON.parse(jsonString);
                            // console.log("token_live_price - ", token_live_price.lp);
                            // console.log("stoploss_price - ", element.stoploss_price);
                            // console.log("target_price - ", element.target_price);
                            var live_price = token_live_price.lp
                            // if(token_live_price.lp != undefined){
                            var live_price = 1176;

                            if (parseFloat(element.stoploss_price) > parseFloat(live_price)) {


                                if (element.srtoploss_status == 1) {

                                    // console.log("srtoploss_status - ", live_price);


                                    var type = "";
                                    if (element.type == "LE") {
                                        type = "LX";
                                    }
                                    else if (element.type == "SE") {
                                        type = "SX";
                                    }


                                    var request = "id:12@@@@@input_symbol:" + element.input_symbol + "@@@@@type:" + type + "@@@@@price:" + element.stoploss_price + "@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:" + panelKey + "@@@@@exchange:NFO@@@@@product_type:MIS@@@@@strike:" + element.strike_price + "@@@@@segment:O@@@@@option_type:" + element.option_type + "@@@@@expiry:" + element.expiry + "@@@@@strategy:" + element.strategy_tag + "@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@token:" + element.token + "@@@@@entry_trade_id:" + element.id + "@@@@@tradesymbol:" + element.tradesymbol + "@@@@@demo:demo";

                                    ExitStopLossAndTargetSendRequest(request);
                                }

                            } else if (parseFloat(live_price) > parseFloat(element.target_price)) {

                                if (element.target_status == 1) {

                                    // console.log("target_status - ", live_price);

                                    var type = "";
                                    if (element.type == "LE") {
                                        type = "LX";
                                    }
                                    else if (element.type == "SE") {
                                        type = "SX";
                                    }


                                    var request = "id:12@@@@@input_symbol:" + element.input_symbol + "@@@@@type:" + type + "@@@@@price:" + element.target_price + "@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:" + panelKey + "@@@@@exchange:NFO@@@@@product_type:MIS@@@@@strike:" + element.strike_price + "@@@@@segment:O@@@@@option_type:" + element.option_type + "@@@@@expiry:" + element.expiry + "@@@@@strategy:" + element.strategy_tag + "@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@token:" + element.token + "@@@@@entry_trade_id:" + element.id + "@@@@@tradesymbol:" + element.tradesymbol + "@@@@@demo:demo";

                                    ExitStopLossAndTargetSendRequest(request);

                                }

                            }



                            //}


                        });

                    }

                });



                res.send({ data: exitstoplosstarget_result });

            })
        })


    });


    function ExitStopLossAndTargetSendRequest(request) {

        var config = {
            method: 'post',
            url: 'https://api.smartalgo.in:3002/broker-signals',
            headers: {
                'Content-Type': 'text/plain'
            },
            data: request
        };

        axios(config)
            .then(function (response) {

            })
            .catch(function (error) {
                // console.log(error);
            });


    }


    //---------------------End Cron Stop loss target -------------------------//

    app.get("/api/alicebluetoken", (req, res) => {


        connection1.query('SELECT * FROM `alicebluetoken` WHERE `update_at` >= "' + ccdate + '" AND `broker`="'+1+'" LIMIT 1', (err, alice_blue_token) => {

            if (alice_blue_token.length > 0) {
                res.send({ 'status': 'true', 'data': alice_blue_token })
            } else {
                res.send({ 'status': 'false', 'data': [] })
            }

        })
    });



    app.get("/api/alicebluetoken/getBrokerKey", (req, res) => {


        connection1.query('SELECT * FROM `alicebluetoken` LIMIT 1', (err, alice_blue_token) => {

            if (alice_blue_token.length > 0) {
                res.send({ 'status': 'true', 'data': alice_blue_token })
            } else {
                res.send({ 'status': 'false', 'data': [] })
            }

        })
    });



    app.get("/api/alicebluetoken/tradingOff", (req, res) => {

        connection1.query('UPDATE `alicebluetoken` SET `access_token` = "" , `trading` = "' + 0 + '"  WHERE `id` = "1"', (err, getToken) => {

            res.send({ status: true, msg: "Trading Off Successfully" })

        });

    });



    app.get("/api/getTokenTradingApi", (req, res) => {


        connection1.query('SELECT * FROM `alicebluetoken`  LIMIT 1', (err, alice_blue_token) => {

            if (alice_blue_token.length > 0) {
                res.send({ 'status': 'true', 'data': alice_blue_token })
            } else {
                res.send({ 'status': 'false', 'data': [] })
            }

        })
    });



    // Panding token
    app.post("/smartalgo/instrument_token", verifyToken, (req, res) => {

        const strike_prize = req.body.strike_prize
        const expied_symbol = req.body.expied_symbol

        // return

        const strike_prizeArr = []
        var channelstr = ""

        if (strike_prize.length == 80) {

            strike_prize.forEach((val) => {


                connection1.query('SELECT id,symbol,expiry_str,strike,option_type,segment,instrument_token  FROM `token_symbol` WHERE `symbol` = "' + val.symbol + '" AND `strike` = ' + val.strike_price + '  AND `expiry_str`="' + expied_symbol + '" ORDER BY `instrument_token` ASC'
                    , (err, result) => {
                        if (result) {


                            strike_prizeArr.push(result)

                            if (strike_prizeArr.length == 80) {

                                strike_prizeArr.flat().map((a) => {
                                    channelstr += "NFO|" + a.instrument_token + "#"
                                })

                                var alltokenchannellist = channelstr.substring(0, channelstr.length - 1);

                                // res.send({ channel: alltokenchannellist, data: strike_prizeArr })
                                res.send({ channel: alltokenchannellist })

                            }
                        }
                    });
            })
        }
    });


    /// only Smart Algo 
    app.get("/smartalgo/channel/alldata", (req, res) => {

        connection1.query('SELECT first_channel,second_channel FROM `channel_list`', (err, channel_list) => {

            connection1.query('SELECT  `banknifty_price`, `nifty_price` FROM `strike_price`', (err, strike_price1) => {

                connection1.query('SELECT * FROM `all_round_token` ORDER BY `strike_price` ASC', (err, all_round_token) => {

                    connection1.query('SELECT * FROM `last_expiry` ORDER BY `expiry_date` ASC LIMIT 4', (err, all_expiry) => {

                        res.send({ channel_list: channel_list, strike_price: strike_price1, all_round_token: all_round_token, all_expiry: all_expiry })
                    })
                })
            })
        })
    })


    /// only Smart Algo 
    app.post("/all_round_token/filter", function (req, res) {

        var symbol = req.body.symbol;
        var expiry = req.body.expiry;

        var where = '';

        if (symbol != '' && expiry != '') {
            where += '`symbol` = "' + symbol + '" AND `expiry` = "' + expiry + '"';
        }

   connection1.query('SELECT first_channel,second_channel FROM `channel_list`', (err, channel_list) => {
        connection1.query('SELECT * FROM `all_round_token` WHERE ' + where + ' ORDER BY `strike_price` ASC', (err, all_round_token) => {
            connection1.query('SELECT `token` FROM `exucated_possition` WHERE `executed_qty_possition` != `exit_qty_possition`', (err, open_position_token) => {

                var tokenstring = "";

                all_round_token.forEach((element) => {

                    tokenstring += 'NFO|' + element.call_token + '#NFO|' + element.put_token + '#'

                });

                var alltokenlist = tokenstring.substring(0, tokenstring.length - 1);

                returnstring = alltokenlist


                // ------------------------------

                var openpositiontokenstring = "";

                open_position_token.forEach((element1) => {

                    openpositiontokenstring += 'NFO|' + element1.token + '#'

                });

                var returnopenpositiontokenstring = openpositiontokenstring.substring(0, openpositiontokenstring.length - 1);

                returnopenpositiontokenstring = returnopenpositiontokenstring;

                //-----------------------------

                // console.log("query", 'SELECT * FROM `all_round_token` WHERE ' + where + '')
                res.send({ length: all_round_token.length, all_round_token: all_round_token, channellist: returnstring, openpositionchannel: returnopenpositiontokenstring , firstchannel : channel_list[0].first_channel})
            })
        })
    })


    })

  


    app.get("/smartalgo/panelkey", (req, res) => {

        connection1.query('SELECT `panel_key` FROM `client_key_prefix_letters`', (err, result) => {

            res.send({ PanelKey: result })
        })
    })




    app.get("/openposition", function (req, res) {



        connection1.query('SELECT * FROM `exucated_all_trade` WHERE `squareoff` = 0 AND (`type` = "LE" || `type` = "SE")', (err, openposition) => {

            if (openposition.length > 0) {

                res.send({ status: true, data: openposition })


            } else {
                res.send({ status: false, data: [] });
            }

        });




    });


    app.get("/closeposition", function (req, res) {


         

        connection1.query('SELECT * FROM `exucated_all_trade` WHERE (`squareoff` = 1 || `previous_trade_id` IS NOT NULL)', (err, closeposition) => {



            if (closeposition.length > 0) {

                var final_array = [];

                var entry_array = [];

                var exit_array = [];

                closeposition.forEach(element => {



                    if (element.previous_trade_id == null) {
                        // console.log('element.id not null -', element.id)
                        entry_array.push(element);
                    }

                    if (element.previous_trade_id != null) {
                        // console.log('element.id is null -', element.id)
                        exit_array.push(element);
                    }


                });


                var exist_entry_exit_id = [];

                entry_array.forEach(entry => {
                    exit_array.forEach(exit => {

                        if (!exist_entry_exit_id.includes(entry.id)) {
                            if (!exist_entry_exit_id.includes(exit.id)) {

                                if (entry.id == exit.previous_trade_id) {

                                    final_array.push(entry);
                                    final_array.push(exit);

                                }

                            }
                        }

                    });

                });





                // console.log("rr- ", final_array)
                if (final_array.length == closeposition.length) {
                    res.send({ status: true, data: final_array })
                } else {
                   // console.log("elseeeee")
                }



            } else {
                res.send({ status: false, data: [] });
            }

        });




    });


    app.post("/updateAdminBrokerKey", verifyToken, (req, res) => {

        var app_id = req.body.app_id
        var api_secret = req.body.api_secret


        connection1.query('UPDATE `alicebluetoken` SET `app_id` = "' + app_id + '" , `api_secret` = "' + api_secret + '"  WHERE `id` = "1"', (err, getToken) => {

            res.send({ status: true, msg: "Data Update Successfully" })

        });
    });

    app.post("/UpdateStopLossAndTargetPrice", async (req, res) => {
          
      
        connection1.query('SELECT `panel_key` FROM `client_key_prefix_letters` LIMIT 1',async (err, panel_key) => {    
         var panelKey = panel_key[0].panel_key;
          

    //  console.log("condition - ", req.body.condition)
    //  console.log("priceArray - ", req.body.priceArray)
   

        if (req.body.condition == "stoploss") {
            var priceArray = req.body.priceArray;
            priceArray.forEach(async(element) => {

                // console.log("id",element.id);
                // console.log("id",element.StopLossPrice);

                let stoploss_data = await client_redis.hGet(panelKey,"openposition_target_stoplose_"+element.id);

                if(stoploss_data){
                    
                    const data = JSON.parse(stoploss_data);   
                    data.StopLossPrice = parseFloat(element.StopLossPrice);
                    client_redis.hSet(panelKey,"openposition_target_stoplose_"+element.id,JSON.stringify(data)) ;
   
                }else{

                    client_redis.hSet(panelKey,"openposition_target_stoplose_"+element.id,JSON.stringify(element));
                     
                }


                connection1.query('UPDATE `exucated_all_trade` SET  `stoploss_price` = "' + parseFloat(element.StopLossPrice) + '" , `srtoploss_status`="' + 1 + '"  WHERE `id` = "' + element.id + '"', (err, priceArray_result) => {

                });
            });


        } 
        

        res.send({ status: true })

       });

    })



    app.post("/UpdateTargetPrice", async (req, res) => {
          
        

   await connection1.query('SELECT `panel_key` FROM `client_key_prefix_letters` LIMIT 1',async (err, panel_key) => {    
         var panelKey = panel_key[0].panel_key;
          

    //  console.log("condition - ", req.body.condition)
    //  console.log("priceArray - ", req.body.priceArray)

      if (req.body.condition == "target") {
            var priceArray = req.body.priceArray;


            priceArray.forEach(async(element) => {


                // console.log("id",element.id);
                // console.log("id target",element.TargetPrice);

      
                let target_data = await client_redis.hGet(panelKey,"openposition_target_stoplose_"+element.id);

                if(target_data){

                    const data = JSON.parse(target_data);   
                    data.TargetPrice = parseFloat(element.TargetPrice);
                    client_redis.hSet(panelKey,"openposition_target_stoplose_"+element.id,JSON.stringify(data)) ;
   
                }else{

                    client_redis.hSet(panelKey,"openposition_target_stoplose_"+element.id,JSON.stringify(element));
                     
                }

                connection1.query('UPDATE `exucated_all_trade` SET `target_price` = "' + parseFloat(element.TargetPrice) + '" , `target_status`="' + 1 + '" WHERE `id` = "' + element.id + '"', (err, priceArray_result) => {

                });
            });


        }


        res.send({ status: true })

       });

    })


    
    app.post("/Romove_redis_key", async (req, res) => {

    // console.log("id remove",req.body.id);
     await connection1.query('SELECT `panel_key`,`broker_url` FROM `client_key_prefix_letters` LIMIT 1',async (err, panel_key) => {    
            var panelKey = panel_key[0].panel_key;
            var broker_url = panel_key[0].broker_url     
            await connection1.query('SELECT `previous_trade_id` FROM `exucated_all_trade` WHERE `id`='+req.body.id,async (err,remove_id) => {
               // console.log("remove iddddd",remove_id[0].previous_trade_id);
                await client_redis.hDel(panelKey,"openposition_target_stoplose_"+remove_id[0].previous_trade_id);

                res.send({status:true})
                
            })
        })
    })


    app.get("/socket-api", (req, res) => {

        // console.log("socket api run");
        // console.log("userid",req.query.userid);
        // console.log("usersession",req.query.usersession);

 connection1.query('SELECT `panel_key` FROM `client_key_prefix_letters` LIMIT 1',async (err, panel_key) => {    
            var panelKey = panel_key[0].panel_key;

        connection1.query('SELECT `exchange`,`token` FROM `exucated_all_trade` WHERE `squareoff`= "0" AND `previous_trade_id` IS NULL',async (err, exitstoplosstarget_result) => {
            var exist_token = [];
            var tokenstring = "";
            exitstoplosstarget_result.forEach(element => {
                // console.log("token", element.token)
             if(element.token != undefined){
                exist_token.push(element.token);
                var exchange = "NFO";

                if(element.exchange != null){
                    exchange = element.exchange;
                }
                tokenstring += exchange +'|' + element.token + '#'
             }

            });

            var alltokenlist = tokenstring.substring(0, tokenstring.length - 1);
            //  res.send(alltokenlist)  
            
            // get token make call below data
           let get_below_data =  await client_redis.hGet(panelKey,"makecall_below");
           var tokenstring1 = "";
           if(get_below_data){
           let below_data = JSON.parse(get_below_data);
            if(below_data.length > 0){
                    below_data.forEach(element => {
                if(element.token != undefined){     
                    if(!exist_token.includes(element.token)){
                    // console.log("token", element.token)
                    exist_token.push(element.token);
                    var exchange = "NFO";
    
                    if(element.exchange != null){
                        exchange = element.exchange;
                    }
                    tokenstring1 += exchange +'|' + element.token + '#'
                   }
                }
                });            
              }
           }
         
           var alltokenlist1 = tokenstring1.substring(0, tokenstring1.length - 1);




            // get token make call above data
            let get_above_data =  await client_redis.hGet(panelKey,"makecall_above");
            var tokenstring2 = "";
            if(get_above_data){
            let above_data = JSON.parse(get_above_data);
             if(above_data.length > 0){
                     above_data.forEach(element => {
                 if(element.token != undefined){ 
                    if(!exist_token.includes(element.token)){
                     // console.log("token", element.token)
                     exist_token.push(element.token);
                     var exchange = "NFO";
     
                     if(element.exchange != null){
                         exchange = element.exchange;
                     }
                     tokenstring2 += exchange +'|' + element.token + '#'
                    }
                   }
                 });            
               }
            }
          
            var alltokenlist2 = tokenstring2.substring(0, tokenstring2.length - 1);

         //   console.log("token socket list",alltokenlist);
          //  console.log("token socket list 1",alltokenlist1);
          //  console.log("token socket list 2",alltokenlist2);
          ///  console.log("token socket list",alltokenlist+"#"+alltokenlist1+"#"+alltokenlist2);
            

             if(alltokenlist1 == "" && alltokenlist2 == "" && alltokenlist != ""){
                 connect(req.query.userid, req.query.usersession, alltokenlist,panelKey);
             }else if(alltokenlist1 != "" && alltokenlist != "" && alltokenlist2 == ""){
                 connect(req.query.userid, req.query.usersession, alltokenlist+"#"+alltokenlist1,panelKey);
             }else if(alltokenlist1 == "" && alltokenlist != "" && alltokenlist2 != ""){
                connect(req.query.userid, req.query.usersession, alltokenlist+"#"+alltokenlist2,panelKey);
             }
             else if(alltokenlist1 != "" && alltokenlist == "" && alltokenlist2 == ""){
                connect(req.query.userid, req.query.usersession, alltokenlist1,panelKey);
             }
             else if(alltokenlist1 == "" && alltokenlist == "" && alltokenlist2 != ""){
                connect(req.query.userid, req.query.usersession,alltokenlist2,panelKey);
             }
             else if(alltokenlist1 != "" && alltokenlist != "" && alltokenlist2 != ""){
                connect(req.query.userid, req.query.usersession,alltokenlist+"#"+alltokenlist1+"#"+alltokenlist2,panelKey);
             }
             else{
               // console.log("no token available");
             }

          
           //  connect(req.query.userid, req.query.usersession, alltokenlist+"#"+alltokenlist1+"#"+alltokenlist2,panelKey);
            res.send("okk")
        });



    });
});


    var BASEURL = "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/";
    let AuthorizationToken;
    let type = "API";


    function TokenAndClientCode(alltokenlist) {

        //console.log("ssss")

        var client_code = "438760";
        var access_token = "R7hh8jt3jQFQZ5cf13qiR55K7F1JRu1gVJ6AMu50YEsUH6Q1s5AQQElcYh9miF2qphj214D5ScpAzEEIvNzTkepDTPbZXoq5dSEqLjvLvQeMQ1bXC2mYlo3VxOOmjFnTGZ2iNZXOQzea3DR7TxBhuNXGJIJenS3T4Xpu94bOI4d8yieeCrfss26JZ6xyer7C5OGUOU7vtbqf9XH4WlStLZtMh80PWtmbNaSAyqZOYmYI8mcxQlZIG3Sn6hpYvKGW";
        invalidateSession(client_code, access_token, alltokenlist);
    }



    // ==========================================================================
    function invalidateSession(userId, userSession, alltokenlist) {
       // console.log("Run invalidateSession....");

        var data = JSON.stringify({
            "loginType": "API"
        });

        var config = {
            method: 'post',
            url: 'https://a3.aliceblueonline.com/rest/AliceBlueAPIService/api/ws/invalidateSocketSess',
            headers: {
                'Authorization': 'Bearer ' + userId + ' ' + userSession,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                // console.log(JSON.stringify(response.data));
                if (response.data.stat == "Ok") {
                    createSession(userId, userSession, alltokenlist);
                } else {
                   // console.log("NOt Okk InvalidateSession")
                }

            })
            .catch(function (error) {
                // console.log(error);
            });


    }


    // ======================================================
    function createSession(userId, userSession, alltokenlist) {
       // console.log("Run createSession....");

        var data = JSON.stringify({
            "loginType": "API"
        });

        var config = {
            method: 'post',
            url: 'https://a3.aliceblueonline.com/rest/AliceBlueAPIService/api/ws/createWsSession',
            headers: {
                'Authorization': 'Bearer ' + userId + ' ' + userSession,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(async function (response) {
                // console.log(JSON.stringify(response.data));
                if (response.data.stat == "Ok") {
                    connect(userId, userSession, alltokenlist);
                } else {
                    // console.log("NOt Okk InvalidateSession")
                }

            })
            .catch(function (error) {
                // console.log(error);
            });

    }

    const url = "wss://ws1.aliceblueonline.com/NorenWS/";
    let socket;

   function connect(userId, userSession, token = "",panelKey) {

        socket = new WebSocket(url);
        socket.onopen = function () {
            connectionRequest(userId, userSession);
            //  alert('okk socket open')
            // console.log("okk socket open")


        };
        socket.onmessage = async function (msg) {
            var response = JSON.parse(msg.data);
            // console.log("okk socket open  1 ",response)


            if (response.tk) {
                // console.log("File has been Createed");
                //if (response.lp != undefined) {
                    // fs.writeFile("./AllTokenJsonFile/" + response.tk + ".json", JSON.stringify(response, null, 4), (err) => {
                    //     if (err) { console.error(err); return; };
                    //     //console.log("File has been Createed File Token");
                    // });

                     
                    let live_data = await client_redis.hGet(panelKey,"live_data_"+response.tk);
                   // console.log("live data",live_data);
                    if(live_data){
                        const data = JSON.parse(live_data);   
                       
                        if(response.lp != undefined){
                            data.lp = parseFloat(response.lp);
                            client_redis.hSet(panelKey,"live_data_"+response.tk,JSON.stringify(data)) ;
                         }
                         if(response.bp1 != undefined){

                            data.bp1 = parseFloat(response.bp1);
                            client_redis.hSet(panelKey,"live_data_"+response.tk,JSON.stringify(data)) ;

                         }
                         if(response.sp1 != undefined){

                            data.sp1 = parseFloat(response.sp1);
                            client_redis.hSet(panelKey,"live_data_"+response.tk,JSON.stringify(data)) ;
                         }

                        
       
                    }else{
                        if(response.lp != undefined){
                         let bp1 = response.lp;
                         let sp1 = response.lp;
                         
                         if(response.bp1 != undefined){
                            bp1 = response.bp1
                         }

                         if(response.sp1 != undefined){
                            sp1 = response.sp1
                         }


                       let obj_live_response = {
                            t: response.tk,
                            e: response.e,
                            tk: response.tk,
                            ts: response.ts,
                            c: response.c,
                            lp: response.lp,
                            bp1: bp1,
                            sp1: sp1
                        }

                        client_redis.hSet(panelKey,"live_data_"+response.tk,JSON.stringify(obj_live_response));
                        }  
                    }
    
    



              //  }




            }
            if (response.s == "OK") {


                //    console.log("response socket okkkkkkkk")

                var channel = token;
                let json = {
                    k: channel,
                    t: 't'
                };
                socket.send(JSON.stringify(json))

            }

        };
    }

    function connectionRequest(userId, userSession) {
        var encrcptToken = CryptoJS.SHA256(
            CryptoJS.SHA256(userSession).toString()
        ).toString();
        // alert(encrcptToken);
        var initCon = {
            susertoken: encrcptToken,
            t: "c",
            actid: userId + "_" + type,
            uid: userId + "_" + type,
            source: type,
        };
        // console.log('initCon', JSON.stringify(initCon));
        try {
            socket.send(JSON.stringify(initCon));
        } catch (error) {
            //console.log("Shocket",error);
        }
       
    }




    


    setInterval(async() => {
    
        var fs = require("fs");
        const path = require('path');
       // console.log("okkk");
  await connection1.query('SELECT `panel_key` FROM `client_key_prefix_letters` LIMIT 1',async (err, panel_key) => {  
    let panelKey = panel_key[0].panel_key; 

    const market_holiday_redis = await client_redis.hGet(panelKey,"market_holiday_redis");
    const market_holiday_redis_data = JSON.parse(market_holiday_redis);
    //console.log("market_holiday_redis",market_holiday_redis_data);


    const today = new Date();
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weekday = weekdays[today.getDay()];                        
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const currentDateYmd = `${year}-${month}-${day}`;

    

    const currentTime = new Date(); // Get the current time

    const desiredTime = new Date(); // Create a target time
    const targetTime = new Date(); // Create a target time
    targetTime.setHours(15); // Set the target hour (e.g., 10 AM)
    targetTime.setMinutes(25); // Set the target minute (e.g., 30 minutes);

    desiredTime.setHours(15, 28, 0, 0); // Set the desired time to 3:30 AM
   

    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const seconds = currentTime.getSeconds().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;
   // console.log(formattedTime);


   const hours1 = desiredTime.getHours().toString().padStart(2, '0');
   const minutes1 = desiredTime.getMinutes().toString().padStart(2, '0');
   const seconds1 = desiredTime.getSeconds().toString().padStart(2, '0');
   const formattedTime1 = `${hours1}:${minutes1}:${seconds1}`;


  //  console.log("currentTime - - ",formattedTime);
  //  console.log("formattedTime1 - - ",formattedTime1);

    if(!market_holiday_redis_data.includes(currentDateYmd) && weekday != 'Sunday' && weekday != 'Saturday' && formattedTime <= formattedTime1){
        

       await connection1.query('SELECT * FROM `open_positions_target_stoploss`',async (err, position_id_loop) => {
        if(position_id_loop.length > 0){         
                
            position_id_loop.forEach(async(element) => {
            
            
   
           let get_target_stoploss_data = await client_redis.hGet(panelKey,"openposition_target_stoplose_"+element.id);
             
           if(get_target_stoploss_data){

              let target_stoplos_data = JSON.parse(get_target_stoploss_data)

            //  console.log("element",element);
            //  console.log("target_stoplos_data",target_stoplos_data);
            //  console.log("token",target_stoplos_data.token);

              let live_data_token = await client_redis.hGet(panelKey,"live_data_"+target_stoplos_data.token);
              let live_data = JSON.parse(live_data_token)
           
              //  console.log("live data",live_data);
             
              
             
              if(target_stoplos_data.token == live_data.tk){
                

                // console.log("token data ",target_stoplos_data.token,"live element",element.exit_time);
                //  console.log("outnside ",target_stoplos_data.StopLossPrice,"live_data.bp1",live_data.bp1);


                 
                const currentdate = new Date();
                const hour = currentdate.getHours();
                const minute = currentdate.getMinutes();
                const currentTime = `${hour}:${minute}:`;

                // if(element.exit_time != null && currentTime < ){

                // }else{

                // }
     
            //     const [hours, minutes] = (element.notrade_time).split('-');
            //     const trade_notrade_time = `${hours}:${minutes}`;
 
            //    if(currentTime > ){

            //    }else{

            //    }
 
                
               if(target_stoplos_data.type == "LE"){

                  //  console.log("inside type ",target_stoplos_data.type,"priice" ,target_stoplos_data.StopLossPrice,"live_data.bp1",live_data.bp1)
                    if(target_stoplos_data.TargetPrice != "NOTSET"){
                       if(parseFloat(target_stoplos_data.TargetPrice) > 0){
                        if(parseFloat(live_data.bp1) > parseFloat(target_stoplos_data.TargetPrice)){
                            tradeExucated(element, live_data.bp1,connection1);
                            targetstoploss_check_status(io,element);
                            await client_redis.hDel(panelKey,"openposition_target_stoplose_"+target_stoplos_data.id);
                        }
                      }
                    }
                   
                  if(target_stoplos_data.StopLossPrice !== "NOTSET"){
                    if(parseFloat(target_stoplos_data.StopLossPrice) > 0){
                    // console.log("inside ",target_stoplos_data.StopLossPrice,"live_data.bp1",live_data.bp1);
                    if(parseFloat(live_data.bp1) < parseFloat(target_stoplos_data.StopLossPrice)){
                    tradeExucated(element, live_data.bp1,connection1);
                    targetstoploss_check_status(io,element);
                    await client_redis.hDel(panelKey,"openposition_target_stoplose_"+target_stoplos_data.id);
                     }
                  }
                }

               }else if(target_stoplos_data.type == "SE"){

                if(target_stoplos_data.TargetPrice != "NOTSET"){
                 if(parseFloat(target_stoplos_data.TargetPrice) > 0){
                    if(parseFloat(live_data.sp1) < parseFloat(target_stoplos_data.TargetPrice)){
                      tradeExucated(element, live_data.sp1,connection1);
                      targetstoploss_check_status(io,element);
                      await client_redis.hDel(panelKey,"openposition_target_stoplose_"+target_stoplos_data.id);
                    }
                   }
                  }
                  if(target_stoplos_data.StopLossPrice != "NOTSET"){
                    if(parseFloat(target_stoplos_data.StopLossPrice) > 0){
                      if(parseFloat(live_data.sp1) > parseFloat(target_stoplos_data.StopLossPrice)){
                      tradeExucated(element, live_data.sp1,connection1);
                      targetstoploss_check_status(io,element);
                      await client_redis.hDel(panelKey,"openposition_target_stoplose_"+target_stoplos_data.id);
                    }
                   }
                  }

               }
 
 

              }
              
            
            }else{
                //console.log("null");
            }

          
 

            });


           
                     
           
             // let get_target_stoploss_data = await client_redis.keys("openposition_target_stoplose_*");
              // const child_key = 'openposition_target_stoplose';

                // client_redis.keys(`${child_key}_*`, (err, keys) => {
                //     console.log("done");
                // if (err) throw err;
                // console.log("client_redis ",keys);
                // });

      
        
           

          }

        }); 

       }else{
        //  console.log("else exucuted");
       }

        });   


    }, 1000);


 setInterval(async() => {
    
        var fs = require("fs");
        const path = require('path');
     //console.log("okkk");
  await connection1.query('SELECT `panel_key` FROM `client_key_prefix_letters` LIMIT 1',async (err, panel_key) => {  
    let panelKey = panel_key[0].panel_key; 

    const market_holiday_redis = await client_redis.hGet(panelKey,"market_holiday_redis");
    const market_holiday_redis_data = JSON.parse(market_holiday_redis);
    //console.log("market_holiday_redis",market_holiday_redis_data);


    const today = new Date();
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weekday = weekdays[today.getDay()];                        
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const currentDateYmd = `${year}-${month}-${day}`;

    

    const currentTime = new Date(); // Get the current time

    const desiredTime = new Date(); // Create a target time
    const targetTime = new Date(); // Create a target time
    targetTime.setHours(15); // Set the target hour (e.g., 10 AM)
    targetTime.setMinutes(25); // Set the target minute (e.g., 30 minutes);

    desiredTime.setHours(15, 28, 0, 0); // Set the desired time to 3:30 AM
   

    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const seconds = currentTime.getSeconds().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;
   // console.log(formattedTime);


   const hours1 = desiredTime.getHours().toString().padStart(2, '0');
   const minutes1 = desiredTime.getMinutes().toString().padStart(2, '0');
   const seconds1 = desiredTime.getSeconds().toString().padStart(2, '0');
   const formattedTime1 = `${hours1}:${minutes1}:${seconds1}`;


  //  console.log("currentTime - - ",formattedTime);
  //  console.log("formattedTime1 - - ",formattedTime1);

    if(!market_holiday_redis_data.includes(currentDateYmd) && weekday != 'Sunday' && weekday != 'Saturday' && formattedTime <= formattedTime1){
        

        await connection1.query('SELECT * FROM exucated_all_trade WHERE mis = 1 AND squareoff != 1',async (err, position_id_loop) => {
        if(position_id_loop.length > 0){         
                
            position_id_loop.forEach(async(element) => {
                console.log("squareoff",element.squareoff,"id",element.id);
                if(element.squareoff == 0){
                if(element.exit_time){

             const currentdate = new Date();
             const hour = currentdate.getHours();
             const minute = currentdate.getMinutes();
             const currentTime = `${hour}:${minute}`;

             const [hours, minutes] = (element.exit_time).split(':');
             const trade_exit_time = `${hours}:${minutes}`;

            const [hours1, minutes1] = currentTime.split(":");
            const [hours2, minutes2] = trade_exit_time.split(":");

            const date1 = new Date();
            date1.setHours(hours1);
            date1.setMinutes(minutes1);

            const date2 = new Date();
            date2.setHours(hours2);
            date2.setMinutes(minutes2);

                
            if(date1 >= date2){
               
    
              let live_data_token = await client_redis.hGet(panelKey,"live_data_"+element.token);
              if(live_data_token){
              let live_data = JSON.parse(live_data_token)
           
              //  console.log("live data",live_data);
             
              
             
              if(element.token == live_data.tk){
                       
                if(element.type == "LE"){
 
                  tradeExucated(element, live_data.bp1,connection1);
                  targetstoploss_check_status(io,element);
                  await client_redis.hDel(panelKey,"openposition_target_stoplose_"+element.id);
                            
 
                }else if(element.type == "SE"){
 
                  tradeExucated(element, live_data.sp1,connection1);
                  targetstoploss_check_status(io,element);
                  await client_redis.hDel(panelKey,"openposition_target_stoplose_"+element.id);
 
                }
  
  
 
               }
              
            
              }else{
                //console.log("null");
              }

             }
 

                }
             }
          });



          }

        }); 

       }else{
        //  console.log("else exucuted");
       }

        });   


    }, 1000);

  

}








const tradeExucated = async (row, price,connection1) => {
    
    var axios = require('axios');

  await  connection1.query('SELECT `panel_key`,`broker_url` FROM `client_key_prefix_letters` LIMIT 1', async (err, panel_key) => {
        var panelKey = panel_key[0].panel_key
        var broker_url = panel_key[0].broker_url
    //  console.log(" panelKey  ", panelKey)
    //     console.log(" broker_url  ", broker_url)

    var type = "";
    if (row.type == "LE") {
        type = "LX";
    }
    else if (row.type == "SE") {
        type = "SX";
    }




    var request = "id:12@@@@@input_symbol:" + row.input_symbol + "@@@@@type:" + type + "@@@@@price:" + price + "@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:" + panelKey + "@@@@@exchange:NFO@@@@@product_type:MIS@@@@@strike:" + row.strike_price + "@@@@@segment:"+row.transaction_type+"@@@@@option_type:" + row.option_type + "@@@@@expiry:" + row.expiry + "@@@@@strategy:" + row.strategy_tag + "@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@token:" + row.token + "@@@@@entry_trade_id:" + row.id + "@@@@@tradesymbol:" + row.tradesymbol + "@@@@@chain:option_chain@@@@@by_side:"+row.by_side+"@@@@@demo:demo";


//    console.log("exit trade ", request);

    

    var config = {
      method: 'post',
      url: broker_url,
      headers: {
        'Content-Type': 'text/plain'
      },
      data: request
    };

  await axios(config)
      .then(function (response) {
        //   console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        // console.log(error);
      });


})



}


const targetstoploss_check_status = (io,row) => {
      
    let msg = row.input_symbol + " Trade Exit Successfully.."
        if(row.transaction_type == "O" || row.transaction_type == "o"){
        msg = row.tradesymbol +" Trade Exit Successfully.."
        }
     else if(row.transaction_type == "F" || row.transaction_type == "f"){
        msg = row.input_symbol + " " + row.expiry + " FUT Trade Exit Successfully.."
      }
      else if(row.transaction_type == "MF" || row.transaction_type == "mf"){
        msg = row.input_symbol + " " + row.expiry + " MCX_FUT Trade Exit Successfully.."
      }
      else if(row.transaction_type == "MO" || row.transaction_type == "mo"){
        msg = row.input_symbol + " " + row.expiry + " MCX_OPTION Trade Exit Successfully.."
      }
      else if(row.transaction_type == "CF" || row.transaction_type == "cf"){
        msg = row.input_symbol + " " + row.expiry + " CURRENCY_FUT Trade Exit Successfully.."
      }
      else if(row.transaction_type == "CO" || row.transaction_type == "co"){
        msg = row.input_symbol + " " + row.expiry + " CURRENCY_OPTION Trade Exit Successfully.."
      }

    io.emit('executed_trade_broadcast', {status:true,msg:msg});
    //console.log('shakir 1');
   
}



