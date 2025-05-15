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

const place_order =   (item, signal, connection,last_signal_id,connection2,bro_res_last_id,filePath) => {


    if (signal.segment == 'C' || signal.segment == 'c') {
        console.log('symbol - ', signal.input_symbol);
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

    //console.log('instrument Query- ', instrument_query);
    connection2.query(instrument_query, (err, instrument_token_symbol) => {

        var segment = signal.segment

        if (segment == "FO" || segment == "fo") {
            segment = 'O';
        }
    
    
    connection.query('' + instrument_query + ';SELECT * FROM `client_service` LEFT JOIN `services` ON `services`.`id` = `client_service`.`service_id` LEFT JOIN `client` ON `client`.`id` = `client_service`.`client_id` LEFT JOIN `categorie` ON `categorie`.`id` = `services`.`categorie_id`  WHERE `client_service`.`client_id` = "' + item.id + '" AND `services`.`service` = "' + signal.input_symbol + '" AND `categorie`.`segment`="'+segment+'"', [1, 2], (err, result) => {
        //console.log('instrument result - ', result);
        //console.log(err);

        if(result[0].length > 0 || result[1].length > 0){
          
         //Broker Reaponse Print Token
          if(signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo'){
    
            var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Strike : "+signal.strike+" , option_type :"+signal.option_type+" , Token : "+instrument_token_symbol[0].instrument_token+"]";
            var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
          
            connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="MASTER-TRUST" WHERE `id`=' + bro_res_last_id, (err, result) => {
                //console.log("err update token", err);
            });
    
          }else if(signal.segment == 'C' || signal.segment == 'c'){
    
            var signal_sy = "[symbol : "+ signal.input_symbol +"  , Token : "+instrument_token_symbol[0].instrument_token+"]";
            var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
        
            connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="MASTER-TRUST" WHERE `id`=' + bro_res_last_id, (err, result) => {
                //console.log("err update token", err);
            });
    
    
          }else{
    
            var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Token : "+instrument_token_symbol[0].instrument_token+"]";
            var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

            connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="MASTER-TRUST" WHERE `id`=' + bro_res_last_id, (err, result) => {
               // console.log("err update token", err);
            });
    
    
          }
    
        }else{
         
            if(signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo'){
    
                var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Strike : "+signal.strike+" , option_type :"+signal.option_type+" ,  Token : NULL]";
                var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

                connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="MASTER-TRUST" WHERE `id`=' + bro_res_last_id, (err, result) => {
                    //console.log("err update token", err);
                });
        
              }else{
        
                var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +" ,  Token : NULL]";
                var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
    
                connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="MASTER-TRUST" WHERE `id`=' + bro_res_last_id, (err, result) => {
                   // console.log("err update token", err);
                });
        
        
              }
      
    
        }



        if (result[1].length > 0 || result[0].length > 0) {

            var data =  get_orderdata(item, signal, result, connection,last_signal_id,instrument_token_symbol,bro_res_last_id,filePath)
            console.log('shakir - ', data);

            if (data !== undefined) {
                var send_rr = Buffer.from(JSON.stringify(data)).toString('base64');
                var config = {
                    method: 'post',
                    url: 'https://masterswift-beta.mastertrust.co.in/api/v1/orders',
                    headers: {
                        'Authorization': 'Bearer ' + item.access_token,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(data)

                };
                var datetime = new Date();
                axios(config)
                    .then(function(response) {

                         console.log("res 1 -",response);

                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nMastertrust Place Oredr Entry  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                            if(err) {
                                return console.log(err);
                            }
                           });
                        
                        var datetime = new Date();
                        var config1 = {
                            method: 'get',
                            url: 'https://masterswift-beta.mastertrust.co.in/api/v1/order/' + response.data.data.client_order_id + '/history?client_id=' + item.app_id,
                            headers: { Authorization: 'Bearer ' + item.access_token },
                        };
                        axios(config1)
                        .then(function(response1) {


                            console.log("res 2 -",response1);
                            
                            var send_rr = Buffer.from(JSON.stringify(data)).toString('base64');
                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+response.data.data.client_order_id+'" ,`order_status`="'+response1.data.data[0].status+'" ,`reject_reason`="'+response1.data.data[0].reject_reason+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                console.log("broker_response place oreder", err);
                            });


                        })
                        .catch(function(error) {
                            // console.log(error);
                        });

  
                        connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"BUY","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data.data.client_order_id + ',"' + get_date() + '","",' + signal.id + ',"' + response.data.status + '","'+last_signal_id+'","'+signal.type+'")', (err, client_transaction) => {
                            //console.log(err);
                        });

                    })
                    .catch(function(error_p) {
                     console.log('place order type Error',error_p);

                     fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nMastertrust Place Oredr Entry Catch  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry Catch -'+JSON.stringify(error_p.response.data)+ "\n\n" , function(err) {
                        if(err) {
                            return console.log(err);
                        }
                       });

                       const message = (JSON.stringify(error_p.response.data)).replace(/["',]/g, '');

                       connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                           //console.log("err", err);
                       });
                    });
            }
        }
    });
});
}

const get_orderdata =   (item, signal, result, connection,last_signal_id,instrument_token_symbol,bro_res_last_id,filePath) => {
    console.log('inside trade');
    var is_reject = false;
    var exchange;
    if (signal.segment == 'C' || signal.segment == 'c') {
        exchange = "NSE";
    } else if (signal.segment == 'F' || signal.segment == 'f' || signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo') {
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
    var instrument_token = instrument_token_symbol[0].instrument_token;
    var quantity = result[1][0].qty;
    var disclosed_quantity = 0;
    var price = 0;
    //var order_side = transaction_type;
    var trailing_stop_loss =1;
    var stop_loss_value = 0;
    var square_off_value = 0;
    var is_trailing = false;
    var trigger_price = 0;
    var validity = 'DAY';
    var product;
    var client_id = item.app_id;
    var user_order_id = 10002;
    var market_protection_percentage = 0;
    var device = 'WEB';

    

    if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' && result[1][0].product_type == '1') {
        console.log('inside cnc')
        order_type = 'MARKET';
        product = 'CNC';
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' && result[1][0].product_type == '1') {
        console.log('inside cnc')
        order_type = 'MARKET';
        product = 'CNC';
    }     
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' && result[1][0].product_type == '1') {
        order_type = 'LIMIT';
        product = 'CNC';
        price = signal.price;
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' && result[1][0].product_type == '1') {
        order_type = 'LIMIT';
        product = 'CNC';
        price = signal.price;
    }
     else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' && result[1][0].product_type == '1') {
        order_type = 'SL';
        product = 'CNC';
        price = signal.price;
        trigger_price = signal.tr_price;
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' && result[1][0].product_type == '1') {
        order_type = 'SL';
        product = 'CNC';
        price = signal.price;
        trigger_price = signal.tr_price;
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '4' && result[1][0].product_type == '1') {
        console.log('product CNC');
        order_type = 'SLM';
        product = 'CNC';
        trigger_price = signal.tr_price;
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '4' && result[1][0].product_type == '1') {
        console.log('product CNC');
        order_type = 'SLM';
        product = 'CNC';
        trigger_price = signal.tr_price;
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' && result[1][0].product_type == '2') {
        console.log('product MIS');
        order_type = 'MARKET';
        product = 'MIS';
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' && result[1][0].product_type == '2') {
        console.log('product MIS');
        order_type = 'MARKET';
        product = 'MIS';
    }  
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' && result[1][0].product_type == '2') {
        order_type = 'LIMIT';
        product = 'MIS';
        price = signal.price;
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' && result[1][0].product_type == '2') {
        order_type = 'LIMIT';
        product = 'MIS';
        price = signal.price;
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' && result[1][0].product_type == '2') {
        order_type = 'SL';
        product = 'MIS';
        price = signal.price;
        trigger_price = signal.tr_price;
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' && result[1][0].product_type == '2') {
        order_type = 'SL';
        product = 'MIS';
        price = signal.price;
        trigger_price = signal.tr_price;
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '4' && result[1][0].product_type == '2') {
        order_type = 'SLM';
        product = 'MIS';
        trigger_price = signal.tr_price;
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '4' && result[1][0].product_type == '2') {
        order_type = 'SLM';
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
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' && result[1][0].product_type == '4') {
        order_type = 'LIMIT';
        product = 'CO';
        price = signal.price;
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' && result[1][0].product_type == '3') {
        order_type = 'LIMIT';
        price = signal.price;
        product = 'BO';
        stop_loss_value = signal.sl_value;
        square_off_value = signal.sq_value;
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' && result[1][0].product_type == '3') {
        order_type = 'LIMIT';
        price = signal.price;
        product = 'BO';
        stop_loss_value = signal.sl_value;
        square_off_value = signal.sq_value;
    } 
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' && result[1][0].product_type == '3') {
        order_type = 'SL';
        price = signal.price;
        product = 'BO';
        trigger_price = signal.tr_price;
        stop_loss_value = signal.sl_value;
        square_off_value = signal.sq_value;
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' && result[1][0].product_type == '3') {
        order_type = 'SL';
        price = signal.price;
        product = 'BO';
        trigger_price = signal.tr_price;
        stop_loss_value = signal.sl_value;
        square_off_value = signal.sq_value;
    }



    if(result[1][0].product_type == '1'){
        if (signal.segment == 'F' || signal.segment == 'f' || signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo' || signal.segment == 'CF' || signal.segment == 'cf'|| signal.segment == 'CO' || signal.segment == 'co') {
            product = "NRML";
            }   
    }



    if (signal.type == 'SX' || signal.type == 'LX') {
            
                var config = {
                    method: 'get',
                    url:'https://masterswift-beta.mastertrust.co.in/api/v1/positions?type=live&client_id='+client_id,
                    headers: {
                        'Authorization': 'Bearer ' + item.access_token,
                        'Content-Type': 'application/json'
                    },
                };
                console.log('LX 11')
               axios(config)
                    .then(function(response) {
                       
                            response.data.data.forEach(function(item1, index) {
                            if(item1.token == instrument_token){

                                var possition_qty =item1.buy_quantity - item1.sell_quantity;
                                 
                                connection.query('UPDATE `broker_response` SET `open_possition_qty`="' + possition_qty + '" WHERE `id`=' + bro_res_last_id, (err, result_p) => {
                                    //console.log("err", err);
                                })
                             
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
        
                                    
                                    var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');  
                                    var config = {
                                        method: 'post',
                                        url: 'https://masterswift-beta.mastertrust.co.in/api/v1/orders',
                                        headers: {
                                            'Authorization': 'Bearer ' + item.access_token,
                                            'Content-Type': 'application/json'
                                        },
                                        data: JSON.stringify(data11)
                    
                                    };
                    
                                    var datetime = new Date();
                                    axios(config)
                                        .then(function(response) {
                                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nMastertrust Place Oredr Exit  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                                                if(err) {
                                                    return console.log(err);
                                                }
                                               });

                                            var datetime = new Date();
                                           
                                            var config1 = {
                                                method: 'get',
                                                url: 'https://masterswift-beta.mastertrust.co.in/api/v1/order/' + response.data.data.client_order_id + '/history?client_id=' + item.app_id,
                                                headers: { Authorization: 'Bearer ' + item.access_token },
                                            };
                                            axios(config1)
                                            .then(function(response1) {
                                                
                                                var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');

                                                connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+response.data.data.client_order_id+'" ,`order_status`="'+response1.data.data[0].status+'" ,`reject_reason`="'+response1.data.data[0].reject_reason+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                    //console.log("err", err);
                                                });
                    
                    
                                            })
                                            .catch(function(error) {
                                                // console.log(error);
                                            });
                    
                      
                                            connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"'+order_side+'","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data.data.client_order_id + ',"' + get_date() + '","",' + signal.id + ',"' + response.data.status + '","'+last_signal_id+'","'+signal.type+'")', (err, client_transaction) => {
                                                //console.log(err);
                                            });
                    
                                        })
                                        .catch(function(error) {
                                    // console.log('place order type Error',error_p);

                                    fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nMastertrust Place Oredr Exit Catch  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit Catch -'+JSON.stringify(error.response.data)+ "\n\n" , function(err) {
                                        if(err) {
                                            return console.log(err);
                                        }
                                       });

                                       const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');

                                       connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                           //console.log("err", err);
                                       });
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
                               
                                var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64'); 
                                var config = {
                                    method: 'post',
                                    url: 'https://masterswift-beta.mastertrust.co.in/api/v1/orders',
                                    headers: {
                                        'Authorization': 'Bearer ' + item.access_token,
                                        'Content-Type': 'application/json'
                                    },
                                    data: JSON.stringify(data11)
                
                                };
                
                                var datetime = new Date();
                                axios(config)
                                    .then(function(response) {

                                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nMastertrust Place Oredr Exit  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                                            if(err) {
                                                return console.log(err);
                                            }
                                           });


                                        var datetime = new Date();
                                    
                                        var config1 = {
                                            method: 'get',
                                            url: 'https://masterswift-beta.mastertrust.co.in/api/v1/order/' + response.data.data.client_order_id + '/history?client_id=' + item.app_id,
                                            headers: { Authorization: 'Bearer ' + item.access_token },
                                        };
                                        axios(config1)
                                        .then(function(response1) {
                
                                            var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');

                                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+response.data.data.client_order_id+'" ,`order_status`="'+response1.data.data[0].status+'" ,`reject_reason`="'+response1.data.data[0].reject_reason+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                //console.log("err", err);
                                            });
                
                
                                        })
                                        .catch(function(error) {
                                            // console.log(error);
                                        });
                
                  
                                        connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"'+order_side+'","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data.data.client_order_id + ',"' + get_date() + '","",' + signal.id + ',"' + response.data.status + '","'+last_signal_id+'","'+signal.type+'")', (err, client_transaction) => {
                                            //console.log(err);
                                        });
                
                                    })
                                    .catch(function(error_p) {

                                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nMastertrust Place Oredr Exit Catch  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit Catch -'+JSON.stringify(error_p.response.data)+ "\n\n" , function(err) {
                                            if(err) {
                                                return console.log(err);
                                            }
                                           });
                                           const message = (JSON.stringify(error_p.response.data)).replace(/["',]/g, '');

                                           connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                               //console.log("err", err);
                                           });
                               });
    
                                    data = '';
                                    return data;

                                }


                            }   else{
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