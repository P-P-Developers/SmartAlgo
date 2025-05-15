var axios = require('axios');
var qs = require('qs');
const sha256 = require('sha256');

const fs = require('fs');



var dateTime = require('node-datetime');
// const log4js = require("log4js");
// const { url } = require('inspector');
// log4js.configure({
//     appenders: { cheese: { type: "file", filename: "cheese.log" } },
//     categories: { default: { appenders: ["cheese"], level: "info" } }
//   });

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


function access_token(app) {

}

const place_order = (item, signal, connection,last_signal_id,connection2,bro_res_last_id,filePath) => {

    if (signal.segment == 'C' || signal.segment == 'c') {
        var instrument_query = "SELECT *  FROM `services` WHERE `service` LIKE '" + signal.input_symbol + "'";
    } else if (signal.segment == 'F' || signal.segment == 'f') {
        var instrument_query = "SELECT *  FROM `token_symbol` WHERE `symbol` LIKE '" + signal.input_symbol + "' AND `expiry` LIKE '" + signal.expiry + "' AND `segment` LIKE 'F' ";
    } else if (signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo') {
       
        var option_type;
        if(signal.option_type=="Call" || signal.option_type=="CALL"){
            option_type = "CE";
        }else if(signal.option_type=="Put" || signal.option_type=="PUT"){
            option_type = "PE";
        }

        var instrument_query = "SELECT *  FROM `token_symbol` WHERE `symbol` LIKE '" + signal.input_symbol + "' AND `expiry` LIKE '" + signal.expiry + "' AND `segment` LIKE 'O' AND `strike` LIKE '" + signal.strike + "' AND `option_type`='" + option_type + "'";
    } else if (signal.segment == 'MO' || signal.segment == 'mo') {
        var option_type;
        if(signal.option_type=="Call" || signal.option_type=="CALL"){
            option_type = "CE";
        }else if(signal.option_type=="Put" || signal.option_type=="PUT"){
            option_type = "PE";
        }


        var instrument_query = "SELECT *  FROM `token_symbol` WHERE `symbol` LIKE '" + signal.input_symbol + "' AND `expiry` LIKE '" + signal.expiry + "' AND `segment` LIKE 'MO' AND `strike` LIKE '" + signal.strike + "' AND `option_type`='" + option_type + "'";
        
    } else if (signal.segment == 'MF' || signal.segment == 'mf') {
        var instrument_query = "SELECT *  FROM `token_symbol` WHERE `symbol` LIKE '" + signal.input_symbol + "' AND `expiry` LIKE '" + signal.expiry + "' AND `segment` LIKE 'MF'";
    }
    else if (signal.segment == 'CF' || signal.segment == 'Cf') {
        var instrument_query = "SELECT *  FROM `token_symbol` WHERE `symbol` LIKE '" + signal.input_symbol + "' AND `expiry` LIKE '" + signal.expiry + "' AND `segment` LIKE 'CF'";
    }
  
    connection2.query(instrument_query, (err, instrument_token_symbol) => {

        var segment = signal.segment

        if (segment == "FO" || segment == "fo") {
            segment = 'O';
        }
    
    
    connection.query('' + instrument_query + ';SELECT * FROM `client_service` LEFT JOIN `services` ON `services`.`id` = `client_service`.`service_id` LEFT JOIN `client` ON `client`.`id` = `client_service`.`client_id` LEFT JOIN `categorie` ON `categorie`.`id` = `services`.`categorie_id`  WHERE `client_service`.`client_id` = "' + item.id + '" AND `services`.`service` = "' + signal.input_symbol + '" AND `categorie`.`segment`="'+segment+'"', [1, 2], (err, result) => {
        //console.log(instrument_query);


        if(result[0].length > 0){

           // Broker Response print Token
           if(signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo'){
    
            var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Strike : "+signal.strike+" , option_type :"+signal.option_type+" , Token : "+instrument_token_symbol[0].instrument_token+"]";
    
            var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

            connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="B2C" WHERE `id`=' + bro_res_last_id, (err, result) => {
                console.log("err update token", err);
            });
    
          }else if(signal.segment == 'C' || signal.segment == 'c'){
    
            var signal_sy = "[symbol : "+ signal.input_symbol +"  , Token : "+instrument_token_symbol[0].instrument_token+"]";
    
            var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
            connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="B2C" WHERE `id`=' + bro_res_last_id, (err, result) => {
                //console.log("err update token", err);
            })   
    
    
          }else{
    
            var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Token : "+instrument_token_symbol[0].instrument_token+"]";
             var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
            connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="B2C" WHERE `id`=' + bro_res_last_id, (err, result) => {
               // console.log("err update token", err);
            })
    
    
          }
    
        }else{
         
            if(signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo'){
    
                var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Strike : "+signal.strike+" , option_type :"+signal.option_type+" ,  Token : NULL]";
        
                var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
                connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="B2C" WHERE `id`=' + bro_res_last_id, (err, result) => {
                    console.log("err update token", err);
                })
        
              }else{
        
                var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +" ,  Token : NULL]";
        
                var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
                 connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="B2C" WHERE `id`=' + bro_res_last_id, (err, result) => {
                    console.log("err update token", err);
                })
        
        
              }
      
    
        }





        console.log(err);
        if (result[1].length > 0 && result[0].length > 0) {

            var data =  get_orderdata(item, signal, result, connection,last_signal_id,instrument_token_symbol,bro_res_last_id,filePath);
            //console.log('B2c Entry -',data);
           
            var url;
            if(result[1][0].product_type == '3'){
                url = 'https://jri4df7kaa.execute-api.ap-south-1.amazonaws.com/prod/interactive/transactional/v1/orders/bracket';
            }else if(result[1][0].product_type == '4'){
                url = 'https://jri4df7kaa.execute-api.ap-south-1.amazonaws.com/prod/interactive/transactional/v1/orders/cover';
            }else{
                url = 'https://jri4df7kaa.execute-api.ap-south-1.amazonaws.com/prod/interactive/transactional/v1/orders/regular';
            }
         
           // console.log('Url -',url);
        
            console.log('B2C blue Entry ',JSON.stringify(data))
            if (data !== undefined) {
                var config = {
                    method: 'post',
                    url: url,
                    headers: { 
                        'Authorization': 'Bearer ' + item.access_token,
                        'Content-Type': 'application/json'
                     },
                     data: JSON.stringify(data)
                };
                var datetime = new Date();
                
                axios(config)
                    .then(function(response) {

                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nB2C Place Oredr Entry  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                            if(err) {
                                return console.log(err);
                            }
                           });

                      var datetime = new Date();
             
            
             var  config1 = {
                  method: 'get',
                  url: 'https://jri4df7kaa.execute-api.ap-south-1.amazonaws.com/prod/interactive/transactional/v1/orders/'+response.data.data.orderId,
                  headers: { 
                    'Authorization': 'Bearer ' + item.access_token,
                    'Content-Type': 'application/json'
                 },
                        };
                          axios(config1)
                        .then(function(response1) {
                            
                            var send_rr = Buffer.from(JSON.stringify(data)).toString('base64');

                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+response.data.data.orderId+'" ,`order_status`="'+response1.data.data[0].status+'" ,`reject_reason`="'+response1.data.data[0].error_reason+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                //console.log("err", err);
                            });


                        })
                        .catch(function(error1) {
                         console.log('get B2C response error -',error1);
                        });


                        connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"BUY","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + result[1][0].product_type + '","' + response.data.data.orderId + '","' + get_date() + '","",' + signal.id + ',"' + response.data.status + '","'+last_signal_id+'","'+signal.type+'")', (err11, client_transaction) => {
                            console.log('client_transaction error',err11);
                        });

                    })
                    .catch(function(error) {
                      // console.log('send Request B2C - error',error);
                      fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nB2C Place Oredr Entry Catch =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry Catch-'+JSON.stringify(error.response.data)+ "\n\n" , function(err) {
                        if(err) {
                            return console.log(err);
                        }
                       });
                    });
            }
        }
    });
});
}

const  get_orderdata = (item, signal, result, connection,last_signal_id,instrument_token_symbol,bro_res_last_id,filePath) => {
    // console.log(result);
    var is_reject = false;
    var exchange;
    if (signal.segment == 'C' || signal.segment == 'c') {
        exchange = "NSE_EQ";
    } else if (signal.segment == 'F' || signal.segment == 'f' || signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo') {
        exchange = "NSE_FO";
    } else if (signal.segment == 'MF' || signal.segment == 'mf' || signal.segment == 'MO' || signal.segment == 'mo') {
        exchange = "MCX_FO";
    }
    else if (signal.segment == 'CF' || signal.segment == 'cf' || signal.segment == 'CO' || signal.segment == 'co') {
        exchange = "NSE_CUR";
    }

   
    var transaction_type;

    if (signal.type == 'LE' || signal.type == 'SX') {
        transaction_type = 'BUY';
    } else if (signal.type == 'SE' || signal.type == 'LX') {
        transaction_type = 'SELL';
    }



   var scrip_token = instrument_token_symbol[0].instrument_token;
   var symbol = null;
   var series = null;
   var expiry_date = null;
   var strike_price = null;
   var option_type = null;



   var product_type;
   var order_type;
   var quantity = result[1][0].qty;
   var price = 0;
   var trigger_price = 0;
   var disclosed_quantity = 0;
   var validity = "DAY";
   var is_amo = false;
   var order_identifier = "1081081";

   var stoploss_leg_price = 0;
   var stoploss_trail_price = 0;
   var profit_leg_price = 0;  
   var profit_leg_price = 0; 





    if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' &&  result[1][0].product_type == '1') {
        order_type = 'RL-MKT';
        product_type = 'DELIVERY';       
    }
   else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' &&  result[1][0].product_type == '1') {
        order_type = 'RL-MKT';
        product_type = 'DELIVERY';       
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' &&  result[1][0].product_type == '1') {
        order_type = 'RL';
        price = signal.price;
        product_type = 'DELIVERY';
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' &&  result[1][0].product_type == '1') {
        order_type = 'RL';
        price = signal.price;
        product_type = 'DELIVERY';
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' &&  result[1][0].product_type == '1') {
        order_type = 'SL';
        price = signal.price;
        product_type = 'DELIVERY';
        trigger_price = signal.tr_price;
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' &&  result[1][0].product_type == '1') {
        order_type = 'SL';
        price = signal.price;
        product_type = 'DELIVERY';
        trigger_price = signal.tr_price;
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '4' &&  result[1][0].product_type == '1') {

        order_type = 'SL-MKT';
        price = signal.price;
        product_type = 'DELIVERY'; 
        trigger_price = signal.tr_price;
   }
   else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '4' &&  result[1][0].product_type == '1') {

    order_type = 'SL-MKT';
    price = signal.price;
    product_type = 'DELIVERY'; 
    trigger_price = signal.tr_price;
}
  
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' &&  result[1][0].product_type == '2') {
        order_type = 'RL-MKT';
        product_type = 'INTRADAY';
        
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' &&  result[1][0].product_type == '2') {
        order_type = 'RL-MKT';
        product_type = 'INTRADAY';
        
    } 
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' &&  result[1][0].product_type == '2') {

        order_type = 'RL';
        price = signal.price;
        product_type = 'INTRADAY';
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' &&  result[1][0].product_type == '2') {

        order_type = 'RL';
        price = signal.price;
        product_type = 'INTRADAY';
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' &&  result[1][0].product_type == '2') {
        order_type = 'SL';
        price = signal.price;
        product_type = 'INTRADAY';
        trigger_price = signal.tr_price;
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' &&  result[1][0].product_type == '2') {
        order_type = 'SL';
        price = signal.price;
        product_type = 'INTRADAY';
        trigger_price = signal.tr_price;
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '4' &&  result[1][0].product_type == '2') {

        order_type = 'SL-MKT';
        price = signal.price;
        product_type = 'INTRADAY';
        trigger_price = signal.tr_price;
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '4' &&  result[1][0].product_type == '2') {

        order_type = 'SL-MKT';
        price = signal.price;
        product_type = 'INTRADAY';
        trigger_price = signal.tr_price;
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' && result[1][0].product_type == '4') {
        order_type = 'RL-MKT';
        product_type = 'COVER';
        stoploss_trail_price = signal.tsl;
        trigger_price = signal.tr_price;
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' && result[1][0].product_type == '4') {
        order_type = 'RL-MKT';
        product_type = 'COVER';
        stoploss_trail_price = signal.tsl;
        trigger_price = signal.tr_price;
    }

    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' && result[1][0].product_type == '4') {
        order_type = 'RL';
        product_type = 'COVER';
        price = signal.price;
        trigger_price = signal.tr_price;
        stoploss_trail_price = signal.tsl;
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' && result[1][0].product_type == '4') {
        order_type = 'RL';
        product_type = 'COVER';
        price = signal.price;
        stoploss_trail_price = signal.tsl;
    }
     else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' &&  result[1][0].product_type == '3') {

        console.log('order BO')
        order_type = 'LIMIT';
        price = signal.price;
        product_type = 'BRACKET';
        stoploss_leg_price = signal.sl_value;
        profit_leg_price = signal.sq_value;
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' &&  result[1][0].product_type == '3') {
        order_type = 'RL';
        price = signal.price;
        product_type = 'BRACKET';
        stoploss_leg_price = signal.sl_value;
        profit_leg_price = signal.sq_value;
    } 
     else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' &&  result[1][0].product_type == '3') {

        order_type = 'SL';
        price = signal.price;
        product_type = 'BRACKET';
        trigger_price = signal.tr_price;
        stoploss_leg_price = signal.sl_value;
        profit_leg_price = signal.sq_value;
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' &&  result[1][0].product_type == '3') {

        order_type = 'SL';
        price = signal.price;
        product_type = 'BRACKET';
        trigger_price = signal.tr_price;
        stoploss_leg_price = signal.sl_value;
        profit_leg_price = signal.sq_value;
        
    }

    if (signal.type == 'SX' || signal.type == 'LX') {

        
         
                var config = {
                    method: 'get',
                    url: 'https://jri4df7kaa.execute-api.ap-south-1.amazonaws.com/prod/interactive/transactional/v1/portfolio/positions/daily',
                    headers: { 
                        'Authorization': 'Bearer ' + item.access_token,
                        'Content-Type': 'application/json'
                     },
                };

                axios(config)
                    .then(function(response) {

                        response.data.data.forEach(function(item1, index) {
                            if(item1.scrip_token == scrip_token){

                                var possition_qty =item1.buy_quantity - item1.sell_quantity;
                                 
                                connection.query('UPDATE `broker_response` SET `open_possition_qty`="' + possition_qty + '" WHERE `id`=' + bro_res_last_id, (err, result_p) => {
                                    //console.log("err", err);
                                });

                                if((item1.buy_quantity - item1.sell_quantity) > 0 && signal.type=='LX'){
                                    var url;
                                    if(result[1][0].product_type == '4'){
                                        
                                        url = 'https://jri4df7kaa.execute-api.ap-south-1.amazonaws.com/prod/interactive/transactional/v1/orders/cover';

                                        data11  = {
                                            "scrip_info": {
                                                "exchange": exchange,
                                                "scrip_token": scrip_token,
                                                "symbol": symbol,
                                                "series": series,
                                                "expiry_date": expiry_date,
                                                "strike_price": strike_price,
                                                "option_type": option_type
                                                },
                                            "transaction_type": transaction_type,   
                                            "main_leg": {
                                            "order_type": order_type,
                                            "quantity": quantity,
                                            "price": price
                                            },
                                            "stoploss_leg": {
                                            "legs": [
                                            {
                                            "quantity": quantity,
                                            "price": price,
                                            "trigger_price": trigger_price
                                            }
                                            ]
                                            },
                                            "order_identifier": order_identifier
                                            };
                                    }
                                   else if(result[1][0].product_type == '3'){
                                      
                                    url = 'https://jri4df7kaa.execute-api.ap-south-1.amazonaws.com/prod/interactive/transactional/v1/orders/bracket';
                                     
                                    data11=  {
                                        "scrip_info": {
                                            "exchange": exchange,
                                            "scrip_token": scrip_token,
                                            "symbol": symbol,
                                            "series": series,
                                            "expiry_date": expiry_date,
                                            "strike_price": strike_price,
                                            "option_type": option_type
                                            },
                                        "transaction_type": transaction_type,
                                        "main_leg": {
                                        "order_type": order_type,
                                        "quantity": quantity,
                                        "price": price,
                                        "trigger_price": trigger_price
                                        },
                                        "stoploss_leg": {
                                        "legs": {
                                        "quantity": quantity,
                                        "price": price,
                                        "trigger_price": trigger_price
                                        },
                                        "trail": {
                                        "ltp_jump_price": stoploss_trail_price,
                                        "stoploss_jump_price": stoploss_trail_price
                                        }
                                        },
                                        "profit_leg": {
                                        "legs": [
                                        {
                                        "quantity": quantity,
                                        "price": price
                                        }
                                        ]
                                        },
                                        "order_identifier": order_identifier
                                        };                        
                                
                                   } 
                      else{
                      
                        url = 'https://jri4df7kaa.execute-api.ap-south-1.amazonaws.com/prod/interactive/transactional/v1/orders/regular';

                        data11 = {
                            "scrip_info": {
                            "exchange": exchange,
                            "scrip_token": scrip_token,
                            "symbol": symbol,
                            "series": series,
                            "expiry_date": expiry_date,
                            "strike_price": strike_price,
                            "option_type": option_type
                            },
                            "transaction_type": transaction_type,
                            "product_type": product_type,
                            "order_type": order_type,
                            "quantity" : quantity,
                            "price": price,
                            "trigger_price": trigger_price,
                            "disclosed_quantity": disclosed_quantity,
                            "validity": validity,
                            "is_amo": is_amo,
                            "order_identifier": order_identifier
                            };
                        }
                        


                            var config = {
                                method: 'post',
                                url: url,
                                headers: { 
                                    'Authorization': 'Bearer ' + item.access_token,
                                    'Content-Type': 'application/json'
                                 },
                                 data: JSON.stringify(data11)
                            };
            
                            var datetime = new Date();
                            
                            axios(config)
                                .then(function(response) {

                                    fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nB2C Place Oredr Exit =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit-'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                                        if(err) {
                                            return console.log(err);
                                        }
                                       });

                                 var datetime = new Date();
                         
                        
                     var  config1 = {
                              method: 'get',
                              url: 'https://jri4df7kaa.execute-api.ap-south-1.amazonaws.com/prod/interactive/transactional/v1/orders/'+response.data.data.orderId,
                              headers: { 
                                'Authorization': 'Bearer ' + item.access_token,
                                'Content-Type': 'application/json'
                             },
                                    };
                                      axios(config1)
                                    .then(function(response1) {
                                      var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');

                                        connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+response.data.data.orderId+'" ,`order_status`="'+response1.data.data[0].status+'" ,`reject_reason`="'+response1.data.data[0].error_reason+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                            //console.log("err", err);
                                        });
            
            
                                    })
                                    .catch(function(error1) {
                                     console.log('get B2C response error -',error1);
                                    });
            
            
                                    connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"SELL","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + result[1][0].product_type + '","' + response.data.data.orderId + '","' + get_date() + '","",' + signal.id + ',"' + response.data.status + '","'+last_signal_id+'","'+signal.type+'")', (err11, client_transaction) => {
                                        console.log('client_transaction error',err11);
                                    });
            
                                })
                                .catch(function(error) {
                                   //console.log('send Request B2C - error',error);
                                   fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nB2C Place Oredr Exit Catch =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit Catch-'+JSON.stringify(error.response.data)+ "\n\n" , function(err) {
                                    if(err) {
                                        return console.log(err);
                                    }
                                   });

                                });

                                        data = '';
                                        return data;   


                                }
                                else if((item1.buy_quantity - item1.sell_quantity) < 0 && signal.type=='SX'){
                                    
                                    if(result[1][0].product_type == '4'){

                                        url = 'https://jri4df7kaa.execute-api.ap-south-1.amazonaws.com/prod/interactive/transactional/v1/orders/cover';
     
                                        data11  = {
                                            "scrip_info": {
                                                "exchange": exchange,
                                                "scrip_token": scrip_token,
                                                "symbol": symbol,
                                                "series": series,
                                                "expiry_date": expiry_date,
                                                "strike_price": strike_price,
                                                "option_type": option_type
                                                },
                                            "transaction_type": transaction_type,   
                                            "main_leg": {
                                            "order_type": order_type,
                                            "quantity": quantity,
                                            "price": price
                                            },
                                            "stoploss_leg": {
                                            "legs": [
                                            {
                                            "quantity": quantity,
                                            "price": price,
                                            "trigger_price": trigger_price
                                            }
                                            ]
                                            },
                                            "order_identifier": order_identifier
                                            };
                                    }
                                   else if(result[1][0].product_type == '3'){
                                     
                                    url = 'https://jri4df7kaa.execute-api.ap-south-1.amazonaws.com/prod/interactive/transactional/v1/orders/bracket';

                                    data11=  {
                                        "scrip_info": {
                                            "exchange": exchange,
                                            "scrip_token": scrip_token,
                                            "symbol": symbol,
                                            "series": series,
                                            "expiry_date": expiry_date,
                                            "strike_price": strike_price,
                                            "option_type": option_type
                                            },
                                        "transaction_type": transaction_type,
                                        "main_leg": {
                                        "order_type": order_type,
                                        "quantity": quantity,
                                        "price": price,
                                        "trigger_price": trigger_price
                                        },
                                        "stoploss_leg": {
                                        "legs": {
                                        "quantity": quantity,
                                        "price": price,
                                        "trigger_price": trigger_price
                                        },
                                        "trail": {
                                        "ltp_jump_price": stoploss_trail_price,
                                        "stoploss_jump_price": stoploss_trail_price
                                        }
                                        },
                                        "profit_leg": {
                                        "legs": [
                                        {
                                        "quantity": quantity,
                                        "price": price
                                        }
                                        ]
                                        },
                                        "order_identifier": order_identifier
                                        };                        
                                
                                   } 
                                  else{  
                                   
                                    url = 'https://jri4df7kaa.execute-api.ap-south-1.amazonaws.com/prod/interactive/transactional/v1/orders/regular';
                                    
                                    data11 = {
                                        "scrip_info": {
                                        "exchange": exchange,
                                        "scrip_token": scrip_token,
                                        "symbol": symbol,
                                        "series": series,
                                        "expiry_date": expiry_date,
                                        "strike_price": strike_price,
                                        "option_type": option_type
                                        },
                                        "transaction_type": transaction_type,
                                        "product_type": product_type,
                                        "order_type": order_type,
                                        "quantity" : quantity,
                                        "price": price,
                                        "trigger_price": trigger_price,
                                        "disclosed_quantity": disclosed_quantity,
                                        "validity": validity,
                                        "is_amo": is_amo,
                                        "order_identifier": order_identifier
                                        };
                                    }

                                        var config = {
                                            method: 'post',
                                            url: url,
                                            headers: { 
                                                'Authorization': 'Bearer ' + item.access_token,
                                                'Content-Type': 'application/json'
                                             },
                                             data: JSON.stringify(data11)
                                        };
                        
                                        var datetime = new Date();
                                        axios(config)
                                            .then(function(response) {

                                                fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nB2C Place Oredr Exit =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit-'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                                                    if(err) {
                                                        return console.log(err);
                                                    }
                                                   });
                                              var datetime = new Date();
                                      var  config1 = {
                                          method: 'get',
                                          url: 'https://jri4df7kaa.execute-api.ap-south-1.amazonaws.com/prod/interactive/transactional/v1/orders/'+response.data.data.orderId,
                                          headers: { 
                                            'Authorization': 'Bearer ' + item.access_token,
                                            'Content-Type': 'application/json'
                                         },
                                                };
                                                  axios(config1)
                                                .then(function(response1) {
                         
                                                    var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');
                                                   
                                                    connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+response.data.data.orderId+'" ,`order_status`="'+response1.data.data[0].status+'" ,`reject_reason`="'+response1.data.data[0].error_reason+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                        //console.log("err", err);
                                                    });
                        
                        
                                                })
                                                .catch(function(error1) {
                                                 console.log('get B2C response error -',error1);
                                                });
                        
                        
                                                connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"SELL","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + result[1][0].product_type + '","' + response.data.data.orderId + '","' + get_date() + '","",' + signal.id + ',"' + response.data.status + '","'+last_signal_id+'","'+signal.type+'")', (err11, client_transaction) => {
                                                    console.log('client_transaction error',err11);
                                                });
                        
                                            })
                                            .catch(function(error) {
                                              // console.log('send Request B2C - error',error);
                                              fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nB2C Place Oredr Exit Catch =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit Catch-'+JSON.stringify(error.response.data)+ "\n\n" , function(err) {
                                                if(err) {
                                                    return console.log(err);
                                                }
                                               });
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


    if(result[1][0].product_type == '4'){
     
        return_data   = {
            "scrip_info": {
                "exchange": exchange,
                "scrip_token": scrip_token,
                "symbol": symbol,
                "series": series,
                "expiry_date": expiry_date,
                "strike_price": strike_price,
                "option_type": option_type
                },
            "transaction_type": transaction_type,   
            "main_leg": {
            "order_type": order_type,
            "quantity": quantity,
            "price": price
            },
            "stoploss_leg": {
            "legs": [
            {
            "quantity": quantity,
            "price": price,
            "trigger_price": trigger_price
            }
            ]
            },
            "order_identifier": order_identifier
            };
    }
   else if(result[1][0].product_type == '3'){
     
    return_data =  {
        "scrip_info": {
            "exchange": exchange,
            "scrip_token": scrip_token,
            "symbol": symbol,
            "series": series,
            "expiry_date": expiry_date,
            "strike_price": strike_price,
            "option_type": option_type
            },
        "transaction_type": transaction_type,
        "main_leg": {
        "order_type": order_type,
        "quantity": quantity,
        "price": price,
        "trigger_price": trigger_price
        },
        "stoploss_leg": {
        "legs": {
        "quantity": quantity,
        "price": price,
        "trigger_price": trigger_price
        },
        "trail": {
        "ltp_jump_price": stoploss_trail_price,
        "stoploss_jump_price": stoploss_trail_price
        }
        },
        "profit_leg": {
        "legs": [
        {
        "quantity": quantity,
        "price": price
        }
        ]
        },
        "order_identifier": order_identifier
        };
     


   } 

else{
       
          return_data = {
            "scrip_info": {
            "exchange": exchange,
            "scrip_token": scrip_token,
            "symbol": symbol,
            "series": series,
            "expiry_date": expiry_date,
            "strike_price": strike_price,
            "option_type": option_type
            },
            "transaction_type": transaction_type,
            "product_type": product_type,
            "order_type": order_type,
            "quantity" : quantity,
            "price": price,
            "trigger_price": trigger_price,
            "disclosed_quantity": disclosed_quantity,
            "validity": validity,
            "is_amo": is_amo,
            "order_identifier": order_identifier
            };

        }

        return return_data;
    }




}

module.exports = { place_order, access_token }