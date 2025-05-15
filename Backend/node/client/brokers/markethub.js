var axios = require('axios');
var qs = require('qs');
const fs = require('fs');

var dateTime = require('node-datetime');
// const log4js = require("log4js");
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
       // console.log(instrument_query);
        console.log(err);


       if(result[0].length > 0 || result[1].length > 0){

      // Broker response Print Token
       if(signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo'){
        var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Strike : "+signal.strike+" , option_type :"+signal.option_type+" , Token : "+instrument_token_symbol[0].instrument_token+"]";
        var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
      
         connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="MARKETHUB" WHERE `id`=' + bro_res_last_id, (err, result) => {
           // console.log("err update token", err);
        });

      }else if(signal.segment == 'C' || signal.segment == 'c'){

        var signal_sy = "[symbol : "+ signal.input_symbol +"  , Token : "+instrument_token_symbol[0].instrument_token+"]";
        var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
       
          connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="MARKETHUB" WHERE `id`=' + bro_res_last_id, (err, result) => {
            //console.log("err update token", err);
        });


      }else{

        var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Token : "+instrument_token_symbol[0].instrument_token+"]";
        var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
      
        connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="MARKETHUB" WHERE `id`=' + bro_res_last_id, (err, result) => {
            //console.log("err update token", err);
        });


      }

    }else{
     
        if(signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo'){

            var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Strike : "+signal.strike+" , option_type :"+signal.option_type+" ,  Token : NULL]";
            var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

            connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="MARKETHUB" WHERE `id`=' + bro_res_last_id, (err, result) => {
                console.log("err update token", err);
            });
    
          }else{
    
            var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +" ,  Token : NULL]";
            var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
          
            connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="MARKETHUB" WHERE `id`=' + bro_res_last_id, (err, result) => {
               // console.log("err update token", err);
            });
    
    
          }
  

    }



        if (result[1].length > 0 || result[0].length > 0) {

            var data = get_orderdata(item, signal, result, connection,last_signal_id,instrument_token_symbol,bro_res_last_id,filePath);
            if (data !== undefined) {         
                data= JSON.stringify(data)
                var send_rr = Buffer.from(data).toString('base64');

                var config = {
                    method: 'post',
                    url: 'https://trade.markethubonline.com/api/neworder',
                    headers: 
                   { 
                  "token": item.access_token,
                  "content-type": "application/json" 
                  },
                    data: data
              
                };

                var datetime = new Date();
                axios(config)
                    .then(function(response) {

                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nMarkethub Place Oredr Entry  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                            if(err) {
                                return console.log(err);
                            }
                           });


                        var datetime = new Date();
            
                var config1 = {
                 method: 'get',
                  url: 'https://trade.markethubonline.com/api/orderstatus?client_id='+item.client_code+'&user_order_number='+response.data.user_order_number,
                            headers: 
                            { 
                            "token": item.access_token,
                            "content-type": "application/json" 
                            },
                       
                        };
                        axios(config1)
                        .then(function(response1) {                           
                            var send_rr = Buffer.from(data).toString('base64');

                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+response.data.user_order_number+'" ,`order_status`="'+response1.data.data[0].status+'" ,`reject_reason`="'+response1.data.data[0].reason +'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                //console.log("err", err);
                            });


                        })
                        .catch(function(error) {
                            // console.log(error);
                        });

                        connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"BUY","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data.user_order_number + ',"' + get_date() + '","",' + signal.id + ',"' + response.data.message + '","'+last_signal_id+'","'+signal.type+'")', (err, client_transaction) => {
                            //console.log(err);
                        });

                    })
                    .catch(function(error) {
                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nMarkethub Place Oredr Entry Catch  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry Catch -'+JSON.stringify(error.response.data)+ "\n\n" , function(err) {
                            if(err) {
                                return console.log(err);
                            }
                           });
                        // console.log('place order error -',error);
                    });
            }
        }
    });
});
}

const get_orderdata = (item, signal, result, connection,last_signal_id,instrument_token_symbol,bro_res_last_id,filePath) => {
    // console.log(result);
    var is_reject = false;
    var exchange;
    if (signal.segment == 'C' || signal.segment == 'c') {
        exchange = "NseCm";
    } else if (signal.segment == 'F' || signal.segment == 'f' || signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo') {
        exchange = "NseFO";
    } else if (signal.segment == 'MF' || signal.segment == 'mf' || signal.segment == 'MO' || signal.segment == 'mo') {
        exchange = "MCX";
    }
    else if (signal.segment == 'CF' || signal.segment == 'cf' || signal.segment == 'CO' || signal.segment == 'co') {
        exchange = "NseCD";
    }
   
    var side;

    if (signal.type == 'LE' || signal.type == 'SX') {
        side = 'Buy';
    } else if (signal.type == 'SE' || signal.type == 'LX') {
        side = 'Sell';
    }
    

    var token = instrument_token_symbol[0].instrument_token;
    var book_type;
    var quantity = result[1][0].qty.toString();
    var price ="0";
    var disclosed_quantity = "0";
    var trigger_price = "0";
    var market_protection_percent = "2";
    var validity = "Day";
    var product;
    var client_id = item.client_code;
    var sender_order_id =  "1500";



    if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' &&  result[1][0].product_type == '1') {
        book_type = 'RL';
        product = 'CNC';      
    }
   else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' &&  result[1][0].product_type == '1') {
        book_type = 'RL';
        product = 'CNC';       
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' &&  result[1][0].product_type == '1') {
        book_type = 'RL';
        price = signal.price;
        product = 'CNC';
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' &&  result[1][0].product_type == '1') {
        book_type = 'RL';
        price = signal.price;
        product = 'CNC';
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' &&  result[1][0].product_type == '1') {
        book_type = 'SL';
        price = signal.price;
        product = 'CNC';
        trigger_price = signal.tr_price;
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' &&  result[1][0].product_type == '1') {
        book_type = 'SL';
        price = signal.price;
        product = 'CNC';
        trigger_price = signal.tr_price;
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '4' &&  result[1][0].product_type == '1') {

        book_type = 'SL';
        price = signal.price;
        product = 'CNC'; 
        trigger_price = signal.tr_price;
   }
   else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '4' &&  result[1][0].product_type == '1') {

    book_type = 'SL';
    price = signal.price;
    product = 'CNC'; 
    trigger_price = signal.tr_price;
}
  
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' &&  result[1][0].product_type == '2') {
        book_type = 'RL';
        product = 'Intraday';
        
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' &&  result[1][0].product_type == '2') {
        book_type = 'RL';
        product = 'Intraday';
        
    } 
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' &&  result[1][0].product_type == '2') {

        book_type = 'RL';
        price = signal.price;
        product = 'Intraday';
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' &&  result[1][0].product_type == '2') {

        book_type = 'RL';
        price = signal.price;
        product = 'Intraday';
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' &&  result[1][0].product_type == '2') {
        book_type = 'SL';
        price = signal.price;
        product = 'Intraday';
        trigger_price = signal.tr_price;
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' &&  result[1][0].product_type == '2') {
        book_type = 'SL';
        price = signal.price;
        product = 'Intraday';
        trigger_price = signal.tr_price;
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '4' &&  result[1][0].product_type == '2') {

        book_type = 'SL';
        price = signal.price;
        product = 'Intraday';
        trigger_price = signal.tr_price;
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '4' &&  result[1][0].product_type == '2') {

        book_type = 'SL';
        price = signal.price;
        product = 'Intraday';
        trigger_price = signal.tr_price;
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' && result[1][0].product_type == '4') {
        book_type = 'RL';
        product = 'CO';
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' && result[1][0].product_type == '4') {
        book_type = 'RL';
        product = 'CO';
    }

    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' && result[1][0].product_type == '4') {
        book_type = 'RL';
        product = 'CO';
        price = signal.price;
        trigger_price = signal.tr_price;
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' && result[1][0].product_type == '4') {
         book_type = 'RL';
        product = 'CO';
        price = signal.price;
    }
     else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' &&  result[1][0].product_type == '3') {

        console.log('order BO')
        book_type = 'RL';
        price = signal.price;
        product = 'BO';
        stop_loss_value = signal.sl_value;
        square_off_value = signal.sq_value;
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' &&  result[1][0].product_type == '3') {
        book_type = 'RL';
        price = signal.price;
        product = 'BO';
        stop_loss_value = signal.sl_value;
        square_off_value = signal.sq_value;
    } 
     else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' &&  result[1][0].product_type == '3') {

        book_type = 'SL';
        price = signal.price;
        product = 'BO';
        trigger_price = signal.tr_price;
        stop_loss_value = signal.sl_value;
        square_off_value = signal.sq_value;
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' &&  result[1][0].product_type == '3') {

        book_type = 'SL';
        price = signal.price;
        product = 'BO';
        trigger_price = signal.tr_price;
        stop_loss_value = signal.sl_value;
        square_off_value = signal.sq_value;
        
    }


    if(result[1][0].product_type == '1'){
        if (signal.segment == 'F' || signal.segment == 'f' || signal.segment == 'O' || signal.segment == 'o') {
            product = "Normal";
            }   
    }
    

    if (signal.type == 'SX' || signal.type == 'LX') {

                var config = {
                    method: 'get',
                    url: 'https://trade.markethubonline.com/api/openingpositions?client_id='+client_id,
                    headers: 
                    { 
                    "token": item.access_token,
                    "content-type": "application/json" 
                    },
                };

                axios(config)
                    .then(function(response) {

                        response.data.data.forEach(function(item1, index) {

                            if(item1.token == instrument_token){
                                   
                                var possition_qty =item1.buy_qty - item1.sell_qty;
                                 
                                connection.query('UPDATE `broker_response` SET `open_possition_qty`="' + possition_qty + '" WHERE `id`=' + bro_res_last_id, (err, result_p) => {
                                    //console.log("err", err);
                                })

                                 
                                if((item1.buy_qty - item1.sell_qty) > 0 && signal.type=='LX'){
                                  
                                    data11 = {
                                        "exchange" : exchange, 
                                        "token" : token, 
                                        "book_type" : book_type,
                                        "side" : side, 
                                        "quantity" : quantity, 
                                        "price" : price,
                                        "disclosed_quantity" : disclosed_quantity, 
                                        "trigger_price" : trigger_price, 
                                        "market_protection_percent" : market_protection_percent, 
                                        "validity" : validity, 
                                        "product" : product, 
                                        "client_id" : client_id,
                                        "sender_order_id" : sender_order_id
                                        };
                              


                                var config = {
                                    method: 'post',
                                    url: 'https://trade.markethubonline.com/api/neworder',
                                    headers: 
                                   { 
                                  "token": item.access_token,
                                  "content-type": "application/json" 
                                  },
                                    data: data11
                              
                                };
                
                                var datetime = new Date();
                                axios(config)
                                    .then(function(response) {

                                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nMarkethub Place Oredr Exit  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                                            if(err) {
                                                return console.log(err);
                                            }
                                           });
                                        var datetime = new Date();
                
                             var config1 = {
                                 method: 'get',
                                 url: 'https://trade.markethubonline.com/api/orderstatus?client_id='+item.client_code+'&user_order_number='+response.data.user_order_number,
                                            headers: 
                                            { 
                                            "token": item.access_token,
                                            "content-type": "application/json" 
                                            },
                                       
                                        };
                                        axios(config1)
                                        .then(function(response1) {
                                         var send_rr = Buffer.from(data11).toString('base64');
                                          
                                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+response.data.user_order_number+'" ,`order_status`="'+response1.data.data[0].status+'" ,`reject_reason`="'+response1.data.data[0].reason +'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                //console.log("err", err);
                                            });
                
                
                                        })
                                        .catch(function(error) {
                                            // console.log(error);
                                        });
                           
                                        connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"SELL","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data.user_order_number + ',"' + get_date() + '","",' + signal.id + ',"' + response.data.message + '","'+last_signal_id+'","'+signal.type+'")', (err, client_transaction) => {
                                            //console.log(err);
                                        });
                
                                    })
                                    .catch(function(error) {
                                         //console.log('place order error -',error);
                                         fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nMarkethub Place Oredr Entry Catch  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry Catch -'+JSON.stringify(error.response.data)+ "\n\n" , function(err) {
                                            if(err) {
                                                return console.log(err);
                                            }
                                           });
                                    });

                                        data = '';
                                        return data;   


                                }
                                else if((item1.buy_qty - item1.sell_qty) < 0 && signal.type=='SX'){
                                                                   
                                        data11 = {
                                            "exchange" : exchange, 
                                            "token" : token, 
                                            "book_type" : book_type,
                                            "side" : side, 
                                            "quantity" : quantity, 
                                            "price" : price,
                                            "disclosed_quantity" : disclosed_quantity, 
                                            "trigger_price" : trigger_price, 
                                            "market_protection_percent" : market_protection_percent, 
                                            "validity" : validity, 
                                            "product" : product, 
                                            "client_id" : client_id,
                                            "sender_order_id" : sender_order_id
                                            };
                                  


                                    var config = {
                                        method: 'post',
                                        url: 'https://trade.markethubonline.com/api/neworder',
                                        headers: 
                                       { 
                                      "token": item.access_token,
                                      "content-type": "application/json" 
                                      },
                                        data: data11
                                  
                                    };
            
                                    var datetime = new Date();
                                    axios(config)
                                        .then(function(response) {

                                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nMarkethub Place Oredr Exit  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                                                if(err) {
                                                    return console.log(err);
                                                }
                                               });
                                            var datetime = new Date();
                                              
                                  var config1 = {
                                      method: 'get',
                                      url: 'https://trade.markethubonline.com/api/orderstatus?client_id='+item.client_code+'&user_order_number='+response.data.user_order_number,
                                                headers: 
                                                { 
                                                "token": item.access_token,
                                                "content-type": "application/json" 
                                                },
                                           
                                            };
                                            axios(config1)
                                            .then(function(response1) {
                                                var send_rr = Buffer.from(data11).toString('base64');

                                                connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+response.data.user_order_number+'" ,`order_status`="'+response1.data.data[0].status+'" ,`reject_reason`="'+response1.data.data[0].reason +'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                    //console.log("err", err);
                                                });
                    
                    
                                            })
                                            .catch(function(error) {
                                                // console.log(error);
                                            });
                                
                                            connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"SELL","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data.user_order_number + ',"' + get_date() + '","",' + signal.id + ',"' + response.data.message + '","'+last_signal_id+'","'+signal.type+'")', (err, client_transaction) => {
                                                //console.log(err);
                                            });
                    
                                        })
                                        .catch(function(error) {
                                           //  console.log('place order error -',error);
                                             fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nMarkethub Place Oredr Exit Catch  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit Catch -'+JSON.stringify(error.response.data)+ "\n\n" , function(err) {
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
       
        return_data = {
            "exchange" : exchange, 
            "token" : token, 
            "book_type" : book_type,
            "side" : side, 
            "quantity" : quantity, 
            "price" : price,
            "disclosed_quantity" : disclosed_quantity, 
            "trigger_price" : trigger_price, 
            "market_protection_percent" : market_protection_percent, 
            "validity" : validity, 
            "product" : product, 
            "client_id" : client_id,
            "sender_order_id" : sender_order_id
            };



        return return_data;
    }




}

module.exports = { place_order, access_token }