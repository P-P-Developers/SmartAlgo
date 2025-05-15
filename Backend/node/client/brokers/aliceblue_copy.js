var axios = require('axios');
var qs = require('qs');
var smartalgo = require('../connections/smartalgo');
const quickalgo=require('../connections/quickalgo');
const shinetechitsolutions=require('../connections/shinetechitsolutions');
const infiniteintelligence=require('../connections/infinite-intelligence');
const kashialgo=require('../connections/kashialgo');
const tradesofttechnology=require('../connections/tradesofttechnology');
const algoking =require('../connections/algoking');
const nextalgo =require('../connections/nextalgo');
const winningturtle =require('../connections/winningturtle');
const startalgo =require('../connections/startalgo');
const digitalalgotech =require('../connections/digitalalgotech');
const expertalgo =require('../connections/expertalgo');
const skyiqinfotech =require('../connections/skyiqinfotech');
const roboitsolution =require('../connections/roboitsolution');
const growtechitsolutions = require('../connections/growtechitsolutions');
const spideralgo = require('../connections/spideralgo');
const housetreders = require('../connections/housetreders');
const shriyatechnology = require('../connections/shriyatechnology');
const algobuzz = require('../connections/algobuzz');
const aiqprimeautotrade = require('../connections/aiqprimeautotrade');
const algostico = require('../connections/algostico');
const algomaster = require('../connections/algomaster');
const etechalgo = require('../connections/etechalgo');
const a1advanceinfotech = require('../connections/a1advanceinfotech');



var dateTime = require('node-datetime');
const log4js = require("log4js");
log4js.configure({
    appenders: { cheese: { type: "file", filename: "cheese.log" } },
    categories: { default: { appenders: ["cheese"], level: "info" } }
  });


function get_date() {
    var d = new Date,
        dformat = [d.getFullYear(),
            d.getMonth() + 1,
            d.getDate(),
        ].join('/') + ' ' + [d.getHours(),
            d.getMinutes(),
            d.getSeconds()
        ].join(':')
    return dformat;
}

// function access_token(app) {
//     app.get("/aliceblue/access_token", (req, res) => {
         
        

//         var state = Buffer.from(req.query.state, 'base64');
//         console.log("state", state)
//         state = JSON.parse(state);
        
//         var panel = state.panel;

       
//         var user_id = state.user_id;
//         var redirect_uri = state.url;
//        // res.send({"pa":panel,"user":user_id,"rediret":redirect_uri});
//         var connection = eval(panel);

//         connection.query('SELECT * from client where `id`="' + user_id + '"', (err, result) => {
            
            

//             if (result.length != 0) {
                
            
//                 var data = qs.stringify({
//                     'grant_type': 'authorization_code',
//                     'code': req.query.code,
//                     'client_id': result[0].app_id,
//                     'client_secret_post': result[0].api_secret,
//                     'redirect_uri':'https://api.smartalgo.in:3002/aliceblue/access_token',
//                     'authorization_response': 'authorization_response'
//                 });

//                // res.send(data);
//                 var config = {
//                     method: 'post',
//                     url: 'https://ant.aliceblueonline.com/oauth2/token',
//                     auth: {
//                         username: result[0].app_id,
//                         password: result[0].api_secret
//                     },
//                     data: data,
//                     rejectUnauthorized:false
//                 };
               
//                 axios(config)
//                     .then(function(response) {
//                      //   res.send(response);
//                         var access_token = response.data.access_token;
//                         connection.query('UPDATE `client` SET `access_token` = "' + access_token + '",`trading_type`="on" WHERE `client`.`id`="' + user_id + '"', (err, result) => {
//                             var dt = dateTime.create();
//                             var ccdate = dt.format('Y-m-d H:M:S');
//                             var trading = 'TradingON';
//                             connection.query('INSERT INTO `trading_status_client` (`client_id`,`trading`,`created_at`) VALUES ("' + user_id + '","' + trading + '","' + ccdate + '")', (err, result) => {
//                                 console.log("err", err);

//                                 return res.redirect(redirect_uri);
//                             })
//                         });
//                     })
//                     .catch(function(error) {
//                         //   console.log(error);
//                     });
//             }

//         });

//     });

// }

const place_order = (item, signal, connection ,last_signal_id) => {

    if (signal.segment == 'C' || signal.segment == 'c') {
        var instrument_query = "SELECT *  FROM `services` WHERE `service` LIKE '" + signal.input_symbol + "'";
    } else if (signal.segment == 'F' || signal.segment == 'f') {
        var instrument_query = "SELECT *  FROM `token_symbol` WHERE `symbol` LIKE '" + signal.input_symbol + "' AND `expiry` LIKE '" + signal.expiry + "' AND `segment` LIKE 'F' ";
    } else if (signal.segment == 'O' || signal.segment == 'o') {

        var option_type;
        if(signal.option_type=="Call" || signal.option_type=="CALL"){
            option_type = "CE";
        }else if(signal.option_type=="Put" || signal.option_type=="PUT"){
            option_type = "PE";
        }


        var instrument_query = "SELECT *  FROM `token_symbol` WHERE `symbol` LIKE '" + signal.input_symbol + "' AND `expiry` LIKE '" + signal.expiry + "' AND `segment` LIKE 'O' AND `strike` LIKE '" + signal.strike + "' AND `option_type`='" + option_type + "'";
        
    } else if (signal.segment == 'MO' || signal.segment == 'mo') {
        var instrument_query = "SELECT *  FROM `token_symbol` WHERE `symbol` LIKE '" + signal.input_symbol + "' AND `expiry` LIKE '" + signal.expiry + "' AND `segment` LIKE 'MO' AND `strike` LIKE '" + signal.strike + "' AND `option_type`='" + signal.option_type + "'";
    } else if (signal.segment == 'MF' || signal.segment == 'mf') {
        var instrument_query = "SELECT *  FROM `token_symbol` WHERE `symbol` LIKE '" + signal.input_symbol + "' AND `expiry` LIKE '" + signal.expiry + "' AND `segment` LIKE 'MF'";
    }
    else if (signal.segment == 'CF' || signal.segment == 'Cf') {
        var instrument_query = "SELECT *  FROM `token_symbol` WHERE `symbol` LIKE '" + signal.input_symbol + "' AND `expiry` LIKE '" + signal.expiry + "' AND `segment` LIKE 'CF'";
    }

    connection.query('' + instrument_query + ';SELECT * FROM `client_service` LEFT JOIN `services` ON `services`.`id` = `client_service`.`service_id` LEFT JOIN `client` ON `client`.`id` = `client_service`.`client_id` WHERE `client_service`.`client_id` = "' + item.id + '" AND `services`.`service` = "' + signal.input_symbol + '"', [1, 2], (err, result) => {
        console.log(instrument_query);
        console.log(err);
        if (result[1].length > 0 && result[0].length > 0) {

            var data = get_orderdata(item, signal, result, connection ,last_signal_id);
            console.log('Alice blue Entry ',data)
            if (data !== undefined) {
                var config = {
                    method: 'post',
                    url: 'https://ant.aliceblueonline.com/api/v1/orders',
                    headers: { Authorization: 'Bearer ' + item.access_token },
                    data: qs.stringify(data)
                };

                const logger = log4js.getLogger("cheese");
                logger.info('Send Request -', data);
                console.log('send data -', data);

                var datetime = new Date();
                console.log("ordertime1", datetime);
                axios(config)
                    .then(function(response) {
                        var datetime = new Date();
                        console.log("ordertime2", datetime);
                        console.log("response -alice ", response);
                        console.log("response -alice orderid", response.data.data.client_order_id);



                        var config1 = {
                            method: 'get',
                  url: 'https://ant.aliceblueonline.com/api/v1/order/' + response.data.data.client_order_id + '/history?client_id=' + item.app_id,
                           headers: { Authorization: 'Bearer ' + item.access_token },
                        };
                        axios(config1)
                        .then(function(response1) {

                            console.log('inside  inside send data -', data);
                            const logger = log4js.getLogger("cheese");

                            logger.info('Broker Response -', response1);
                            console.log('Broker response -', response1);  

                        
                            
                            var send_rr = Buffer.from(qs.stringify(data)).toString('base64');
                           // console.log(send_rr);

                            connection.query('INSERT INTO `broker_response`(`client_id`, `signal_id`, `symbol`, `send_request`, `order_id`, `order_status`, `reject_reason`, `created_at`) VALUES ("' + item.id + '","' + signal.id + '","' + signal.input_symbol + '","'+ send_rr +'","' + response.data.data.client_order_id + '","' + response1.data.data[0].status + '","' + response1.data.data[0].reject_reason + '","' + get_date() + '")', (err1, signal_status) => {
                                console.log('eroor query -',err1);
                            });


                        })
                        .catch(function(error) {
                            // console.log(error);
                        });



                        connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"BUY","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data.data.client_order_id + ',"' + get_date() + '","",' + signal.id + ',"' + response.data.status + '","'+last_signal_id+'","'+signal.type+'")', (err, client_transaction) => {
                            //console.log(err);
                        });

                    })
                    .catch(function(error) {
                        // console.log(error);
                    });
            }
        }
    });
}

const get_orderdata = (item, signal, result, connection ,last_signal_id) => {
    // console.log(result);
    var is_reject = false;
    var exchange;
    if (signal.segment == 'C' || signal.segment == 'c') {
        exchange = "NSE";
    } else if (signal.segment == 'F' || signal.segment == 'f' || signal.segment == 'O' || signal.segment == 'o') {
        exchange = "NFO";
    } else if (signal.segment == 'MF' || signal.segment == 'mf' || signal.segment == 'MO' || signal.segment == 'mo') {
        exchange = "MCX";
    }
    else if (signal.segment == 'CF' || signal.segment == 'cf' || signal.segment == 'CO' || signal.segment == 'co') {
        exchange = "CDS";
    }

   
    var order_side;

    if (signal.type == 'LE' || signal.type == 'SX') {
        order_side = 'BUY';
    } else if (signal.type == 'SE' || signal.type == 'LX') {
        order_side = 'SELL';
    }



    var order_type;
    var instrument_token = result[0][0].instrument_token;
    var quantity = result[1][0].qty;
    var disclosed_quantity = 0;
    var price = 0;
   // var order_side;
    var trailing_stop_loss =1;
    var trigger_price = 0;
    var validity = 'DAY';
    var product;
    var stop_loss_value = 0;
    var square_off_value = 0;
    var is_trailing = false;
    var user_order_id = 10002;
    var client_id = item.app_id;
    var market_protection_percentage = 0;
    var device = 'WEB';
    var source = 'web';


    if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' &&  result[1][0].product_type == '1') {
        order_type = 'MARKET';
        product = 'CNC';       
    }
   else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' &&  result[1][0].product_type == '1') {
        order_type = 'MARKET';
        product = 'CNC';       
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' &&  result[1][0].product_type == '1') {
        order_type = 'LIMIT';
        price = signal.price;
        product = 'CNC';
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' &&  result[1][0].product_type == '1') {
        order_type = 'LIMIT';
        price = signal.price;
        product = 'CNC';
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' &&  result[1][0].product_type == '1') {
        order_type = 'SL';
        price = signal.price;
        product = 'CNC';
        trigger_price = signal.tr_price;
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' &&  result[1][0].product_type == '1') {
        order_type = 'SL';
        price = signal.price;
        product = 'CNC';
        trigger_price = signal.tr_price;
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '4' &&  result[1][0].product_type == '1') {

        order_type = 'SLM';
        price = signal.price;
        product = 'CNC'; 
        trigger_price = signal.tr_price;
   }
   else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '4' &&  result[1][0].product_type == '1') {

    order_type = 'SLM';
    price = signal.price;
    product = 'CNC'; 
    trigger_price = signal.tr_price;
}
  
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' &&  result[1][0].product_type == '2') {
        order_type = 'MARKET';
        product = 'MIS';
        
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' &&  result[1][0].product_type == '2') {
        order_type = 'MARKET';
        product = 'MIS';
        
    } 
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' &&  result[1][0].product_type == '2') {

        order_type = 'LIMIT';
        price = signal.price;
        product = 'MIS';
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' &&  result[1][0].product_type == '2') {

        order_type = 'LIMIT';
        price = signal.price;
        product = 'MIS';
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' &&  result[1][0].product_type == '2') {
        order_type = 'SL';
        price = signal.price;
        product = 'MIS';
        trigger_price = signal.tr_price;
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' &&  result[1][0].product_type == '2') {
        order_type = 'SL';
        price = signal.price;
        product = 'MIS';
        trigger_price = signal.tr_price;
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '4' &&  result[1][0].product_type == '2') {

        order_type = 'SLM';
        price = signal.price;
        product = 'MIS';
        trigger_price = signal.tr_price;
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '4' &&  result[1][0].product_type == '2') {

        order_type = 'SLM';
        price = signal.price;
        product = 'MIS';
        trigger_price = signal.tr_price;
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' && result[1][0].product_type == '4') {
        order_type = 'MARKET';
        product = 'CO';
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' && result[1][0].product_type == '4') {
        order_type = 'MARKET';
        product = 'CO';
    }

    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' && result[1][0].product_type == '4') {
        order_type = 'LIMIT';
        product = 'CO';
        price = signal.price;
        trigger_price = signal.tr_price;
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' && result[1][0].product_type == '4') {
        order_type = 'LIMIT';
        product = 'CO';
        price = signal.price;
    }
     else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' &&  result[1][0].product_type == '3') {

        console.log('order BO')
        order_type = 'LIMIT';
        price = signal.price;
        product = 'BO';
        stop_loss_value = signal.sl_value;
        square_off_value = signal.sq_value;
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' &&  result[1][0].product_type == '3') {
        order_type = 'LIMIT';
        price = signal.price;
        product = 'BO';
        stop_loss_value = signal.sl_value;
        square_off_value = signal.sq_value;
    } 
     else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' &&  result[1][0].product_type == '3') {

        order_type = 'SL';
        price = signal.price;
        product = 'BO';
        trigger_price = signal.tr_price;
        stop_loss_value = signal.sl_value;
        square_off_value = signal.sq_value;
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' &&  result[1][0].product_type == '3') {

        order_type = 'SL';
        price = signal.price;
        product = 'BO';
        trigger_price = signal.tr_price;
        stop_loss_value = signal.sl_value;
        square_off_value = signal.sq_value;
        
    }

    if (signal.type == 'SX' || signal.type == 'LX') {

        
         
                var config = {
                    method: 'get',
                    url: 'https://ant.aliceblueonline.com/api/v1/positions?type=live&client_id='+client_id,
                    headers: { Authorization: 'Bearer ' + item.access_token },
                };

                axios(config)
                    .then(function(response) {

                        response.data.data.forEach(function(item1, index) {
                            if(item1.token == instrument_token){
                                if((item1.buy_quantity - item1.sell_quantity) > 0 && signal.type=='LX'){
                                  
                           if(result[1][0].product_type == '3'){
                                    data11 = {
                                        'exchange': exchange,
                                        'instrument_token': instrument_token,
                                        'quantity': quantity,
                                        'disclosed_quantity': disclosed_quantity,
                                        'validity': validity,
                                        'square_off_value':square_off_value,
                                        'stop_loss_value':stop_loss_value,
                                        'order_type': order_type,
                                        'price': price,
                                        'trigger_price': trigger_price,
                                        'source':source,
                                        'trailing_stop_loss':trailing_stop_loss,
                                        'order_side': order_side,
                                        'product': product,
                                        'is_trailing': is_trailing,
                                        'user_order_id': user_order_id,
                                        'client_id':client_id
                            
                                    };
                                }else{
                                    data11 = {
                                        'exchange': exchange,
                                        'order_type': order_type,
                                        'instrument_token': instrument_token,
                                        'quantity': quantity,
                                        'disclosed_quantity': disclosed_quantity,
                                        'price': price,
                                        'order_side': order_side,
                                        'trigger_price': trigger_price,
                                        'validity': validity,
                                        'product': product,
                                        'client_id': client_id,
                                        'user_order_id': user_order_id,
                                        'market_protection_percentage': market_protection_percentage,
                                        'device': device,
                                    }; 
                                }


                                    var config = {
                                        method: 'post',
                                        url: 'https://ant.aliceblueonline.com/api/v1/orders',
                                        headers: { Authorization: 'Bearer ' + item.access_token },
                                        data: qs.stringify(data11)
                                    };
                    
                                    const logger = log4js.getLogger("cheese");
                                    logger.info('Send Request -', data11);
                                    console.log('send data -', data11);
                    
                                    var datetime = new Date();
                                    console.log("ordertime1", datetime);
                                    axios(config)
                                        .then(function(response) {

                                            var datetime = new Date();
                                            console.log("ordertime2", datetime);
                                            console.log("response -alice ", response);
                                            console.log("response -alice orderid", response.data.data.client_order_id);
                    
                    
                    
                                            var config1 = {
                                                method: 'get',
                                      url: 'https://ant.aliceblueonline.com/api/v1/order/' + response.data.data.client_order_id + '/history?client_id=' + item.app_id,
                                               headers: { Authorization: 'Bearer ' + item.access_token },
                                            };
                                            axios(config1)
                                            .then(function(response1) {
                    
                                                console.log('AlICE Blue inside  inside send data -', data);
                                                const logger = log4js.getLogger("cheese");
                    
                                                logger.info('Broker Response -', response1);
                                                console.log('Broker response -', response1);  
                    
                                            
                                                
                                                var send_rr = Buffer.from(qs.stringify(data11)).toString('base64');
                                               // console.log(send_rr);
                    
                                                connection.query('INSERT INTO `broker_response`(`client_id`, `signal_id`, `symbol`, `send_request`, `order_id`, `order_status`, `reject_reason`, `created_at`) VALUES ("' + item.id + '","' + signal.id + '","' + signal.input_symbol + '","'+ send_rr +'","' + response.data.data.client_order_id + '","' + response1.data.data[0].status + '","' + response1.data.data[0].reject_reason + '","' + get_date() + '")', (err1, signal_status) => {
                                                    console.log('eroor query -',err1);
                                                });
                    
                    
                                            })
                                            .catch(function(error) {
                                                // console.log(error);
                                            });
                    
                    
                    
                                            connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"'+order_type+'","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data.data.client_order_id + ',"' + get_date() + '","",' + signal.id + ',"' + response.data.status + '","'+last_signal_id+'","'+signal.type+'")', (err, client_transaction) => {
                                                //console.log(err);
                                            });
                    
                                        })
                                        .catch(function(error) {
                                            // console.log(error);
                                        }); 

                                        data = '';
                                        return data;   


                                }
                                else if((item1.buy_quantity - item1.sell_quantity) < 0 && signal.type=='SX'){
                                    
                                    if(result[1][0].product_type == '3'){
                                        data11 = {
                                            'exchange': exchange,
                                            'instrument_token': instrument_token,
                                            'quantity': quantity,
                                            'disclosed_quantity': disclosed_quantity,
                                            'validity': validity,
                                            'square_off_value':square_off_value,
                                            'stop_loss_value':stop_loss_value,
                                            'order_type': order_type,
                                            'price': price,
                                            'trigger_price': trigger_price,
                                            'source':source,
                                            'trailing_stop_loss':trailing_stop_loss,
                                            'order_side': order_side,
                                            'product': product,
                                            'is_trailing': is_trailing,
                                            'user_order_id': user_order_id,
                                            'client_id':client_id
                                
                                        };
                                    }
                                    
                                    else{
                                        data11 = {
                                            'exchange': exchange,
                                            'order_type': order_type,
                                            'instrument_token': instrument_token,
                                            'quantity': quantity,
                                            'disclosed_quantity': disclosed_quantity,
                                            'price': price,
                                            'order_side': order_side,
                                            'trigger_price': trigger_price,
                                            'validity': validity,
                                            'product': product,
                                            'client_id': client_id,
                                            'user_order_id': user_order_id,
                                            'market_protection_percentage': market_protection_percentage,
                                            'device': device,
                                        }; 
                                    }


                                    var config = {
                                        method: 'post',
                                        url: 'https://ant.aliceblueonline.com/api/v1/orders',
                                        headers: { Authorization: 'Bearer ' + item.access_token },
                                        data: qs.stringify(data11)
                                    };
                    
                                    const logger = log4js.getLogger("cheese");
                                    logger.info('Send Request -', data11);
                                    console.log('send data -', data11);
                    
                                    var datetime = new Date();
                                    console.log("ordertime1", datetime);
                                    axios(config)
                                        .then(function(response) {
                                            var datetime = new Date();
                                            console.log("ordertime2", datetime);
                                            console.log("response -alice ", response);
                                            console.log("response -alice orderid", response.data.data.client_order_id);
                    
                    
                    
                                            var config1 = {
                                                method: 'get',
                                      url: 'https://ant.aliceblueonline.com/api/v1/order/' + response.data.data.client_order_id + '/history?client_id=' + item.app_id,
                                               headers: { Authorization: 'Bearer ' + item.access_token },
                                            };
                                            axios(config1)
                                            .then(function(response1) {
                    
                                                console.log('Alice blue inside  inside send data -', data11);
                                                const logger = log4js.getLogger("cheese");
                    
                                                logger.info('Broker Response -', response1);
                                                console.log('Broker response -', response1);  
                    
                                            
                                                
                                                var send_rr = Buffer.from(qs.stringify(data11)).toString('base64');
                                               // console.log(send_rr);
                    
                                                connection.query('INSERT INTO `broker_response`(`client_id`, `signal_id`, `symbol`, `send_request`, `order_id`, `order_status`, `reject_reason`, `created_at`) VALUES ("' + item.id + '","' + signal.id + '","' + signal.input_symbol + '","'+ send_rr +'","' + response.data.data.client_order_id + '","' + response1.data.data[0].status + '","' + response1.data.data[0].reject_reason + '","' + get_date() + '")', (err1, signal_status) => {
                                                    console.log('eroor query -',err1);
                                                });
                    
                    
                                            })
                                            .catch(function(error) {
                                                // console.log(error);
                                            });
                    
                    
                    
                                            connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"'+order_type+'","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data.data.client_order_id + ',"' + get_date() + '","",' + signal.id + ',"' + response.data.status + '","'+last_signal_id+'","'+signal.type+'")', (err, client_transaction) => {
                                                //console.log(err);
                                            });
                    
                                        })
                                        .catch(function(error) {
                                            // console.log(error);
                                        });

                                        data = '';
                                        return data;


                                }
                            
                            }else{
                                data = '';
                                return data;
                            }
                        })    

                    })
                    .catch(function(error) {

                    });
           
        
    } else {
        if(result[1][0].product_type == '3'){
            return_data = {
                'exchange': exchange,
                'instrument_token': instrument_token,
                'quantity': quantity,
                'disclosed_quantity': disclosed_quantity,
                'validity': validity,
                'square_off_value':square_off_value,
                'stop_loss_value':stop_loss_value,
                'order_type': order_type,
                'price': price,
                'trigger_price': trigger_price,
                'source':source,
                'trailing_stop_loss':trailing_stop_loss,
                'order_side': order_side,
                'product': product,
                'is_trailing': is_trailing,
                'user_order_id': user_order_id,
                'client_id':client_id
    
            };
        }else{
            return_data = {
                'exchange': exchange,
                'order_type': order_type,
                'instrument_token': instrument_token,
                'quantity': quantity,
                'disclosed_quantity': disclosed_quantity,
                'price': price,
                'order_side': order_side,
                'trigger_price': trigger_price,
                'validity': validity,
                'product': product,
                'client_id': client_id,
                'user_order_id': user_order_id,
                'market_protection_percentage': market_protection_percentage,
                'device': device,
            }; 
        }



        return return_data;
    }




}

module.exports = { place_order, access_token }