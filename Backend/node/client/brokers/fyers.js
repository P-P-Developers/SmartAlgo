var axios = require('axios');
// var request = require("request");
var FormData = require('form-data');
var qs = require('qs');
const sha256 = require('sha256');

const fs = require('fs');

var http = require("http");
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
   
    try{

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

    
    connection2.query(instrument_query, (err, instrument_token_symbol) => {
     try{
        var segment = signal.segment

        if (segment == "FO" || segment == "fo") {
            segment = 'O';
        }
    
    
    connection.query('' + instrument_query + ';SELECT * FROM `client_service` LEFT JOIN `services` ON `services`.`id` = `client_service`.`service_id` LEFT JOIN `client` ON `client`.`id` = `client_service`.`client_id` LEFT JOIN `categorie` ON `categorie`.`id` = `services`.`categorie_id`  WHERE `client_service`.`client_id` = "' + item.id + '" AND `services`.`service` = "' + signal.input_symbol + '" AND `categorie`.`segment`="'+segment+'"', [1, 2], (err, result) => {
 
       try{

       if(result[0].length > 0 || result[1].length > 0){

         //Broker Response Print Token  
         if(signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo'){
  
          var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Strike : "+signal.strike+" , option_type :"+signal.option_type+" , TradeSymbol : "+instrument_token_symbol[0].tradesymbol_m_w +" , Token : "+instrument_token_symbol[0].instrument_token+"]";
          var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

        connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="FYERS" WHERE `id`=' + bro_res_last_id, (err, result) => {
            console.log("err update token", err);
        });
  
        }else if(signal.segment == 'C' || signal.segment == 'c'){
  
          var signal_sy = "[symbol : "+ signal.input_symbol +" , TradeSymbol : "+instrument_token_symbol[0].zebu_token+" , Token : "+instrument_token_symbol[0].instrument_token+"]";
           var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');   

        connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="FYERS" WHERE `id`=' + bro_res_last_id, (err, result) => {
            console.log("err update token", err);
        });
  
  
        }else{
  
          var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +" , TradeSymbol : "+instrument_token_symbol[0].tradesymbol_m_w +" , Token : "+instrument_token_symbol[0].instrument_token+"]";
          var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
        connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="FYERS" WHERE `id`=' + bro_res_last_id, (err, result) => {
            console.log("err update token", err);
        });
  
  
        }
  
      }else{
       
          if(signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo'){
  
              var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Strike : "+signal.strike+" , option_type :"+signal.option_type+" , TradeSymbol : NULL , Token : NULL]";
             var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

            connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="FYERS" WHERE `id`=' + bro_res_last_id, (err, result) => {
                console.log("err update token", err);
            });
      
            }else{
      
              var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +" , TradeSymbol : NULL , Token : NULL]";
              var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

            connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="FYERS" WHERE `id`=' + bro_res_last_id, (err, result) => {
                console.log("err update token", err);
            });
      
      
            }
    
  
      }

        
        console.log(err);
        if (result[1].length > 0 || result[0].length > 0) {

            var data =  get_orderdata(item, signal, result, connection,last_signal_id,instrument_token_symbol,bro_res_last_id,filePath)
            //console.log('shakir Fyers - ', data);
            if (data !== undefined) {

                console.log(item.access_token);
                var send_rr = Buffer.from(JSON.stringify(data)).toString('base64');

                var config = {
                    method: 'post',
                    url: 'https://api.fyers.in/api/v2/orders',
                    headers: { 
                        'Authorization': item.app_id+':'+item.access_token, 
                      },
                    data: data

                };
                var datetime = new Date();

                axios(config)
                    .then(function(response) {

                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nFyers Place Oredr Entry  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                            if(err) {
                                return console.log(err);
                            }
                           });


                        var datetime = new Date();
                        var send_rr = Buffer.from(JSON.stringify(data)).toString('base64');

                         connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+response.data.id+'" ,`order_status`="'+response.data.s+'" ,`reject_reason`="'+response.data.message+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                            //console.log("err", err);
                        });

                        connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"BUY","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + error1.response.data.id + ',"' + get_date() + '","",' + signal.id + ',"' + error1.response.data.message + '","'+last_signal_id+'","'+signal.type+'")', (err, client_transaction) => {
                            //console.log('client tranjaction -',err);
                        }); 
                      
                      

                    })
                    .catch(function(error1) {
                     var send_rr = Buffer.from(JSON.stringify(data)).toString('base64');

                    fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nFyers Place Oredr Entry Catch  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry Catch -'+JSON.stringify(error1.response.data)+ "\n\n" , function(err) {
                        if(err) {
                            return console.log(err);
                        }
                        });

                        const message = (JSON.stringify(error1.response.data)).replace(/["',]/g, '');

                        connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                            //console.log("err", err);
                        });
                        



                        try{
                          console.log('place order error catch',error1);      
                         if(error1.response.data.s == "error"){

                            try{

                            var send_rr = Buffer.from(JSON.stringify(data)).toString('base64');

                        connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+error1.response.data.id+'" ,`order_status`="'+error1.response.data.s+'" ,`reject_reason`="'+error1.response.data.message+'" WHERE `id`=' + bro_res_last_id, (err, result) => {

                            //console.log("err", err);
                        });
 
 
                         connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"BUY","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + error1.response.data.id + ',"' + get_date() + '","",' + signal.id + ',"' + error1.response.data.message + '")', (err, client_transaction) => {
                             //console.log('client tranjaction -',err);
                         }); 

                        }catch (e) {
                            console.log('Fyers Orders Error',e);
                          }

                        }
                    }catch (e) {
                        console.log('Fyers Orders Error',e);
                      }

                    });
            }
        }
   
    }catch (e) {
        console.log('Fyers Instrument Query',e);
      }

    });
}catch (e) {
    console.log('Fyers Token Symbol',e);
  }

});

}catch (e) {
    console.log('Fyers Placeorder',e);
  }

}

const get_orderdata =   (item, signal, result, connection,last_signal_id,instrument_token_symbol,bro_res_last_id,filePath) => {
    console.log('inside trade');
    var is_reject = false;
     
    try{

    var exchange;
    if (signal.segment == 'C' || signal.segment == 'c') {
        exchange = "NSE";
    } else if (signal.segment == 'F' || signal.segment == 'f' || signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo') {
        exchange = "NSE";
    } else if (signal.segment == 'MF' || signal.segment == 'mf' || signal.segment == 'MO' || signal.segment == 'mo') {
        exchange = "MCX";
    }
    else if (signal.segment == 'CF' || signal.segment == 'cf' || signal.segment == 'CO' || signal.segment == 'co') {
        exchange = "CDS";
    }


    var side = '';

    if (signal.type == 'LE' || signal.type == 'SX') {
        side = 1;
    } else if (signal.type == 'SE' || signal.type == 'LX') {
        side = -1;
    }
   

    var symbol;
    symbol = exchange+':'+instrument_token_symbol[0].tradesymbol_m_w;
   
   
    var   qty = result[1][0].qty;
    var   type;
    var   side
    var   productType
    var   limitPrice = 0;
    var   stopPrice = 0;
    var   validity = "DAY";
    var   disclosedQty = 0;
    var   offlineOrder = "False";
    var   stopLoss  = 0;
    var   takeProfit = 0

    if (signal.segment == 'C' || signal.segment == 'c') {
        symbol=exchange+':'+instrument_token_symbol[0].zebu_token;
     }    
        



    if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' && result[1][0].product_type == '1') {
        type = 2;
        productType = 'CNC';
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' && result[1][0].product_type == '1') {
        type = 2;
        productType = 'CNC';
    }     
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' && result[1][0].product_type == '1') {
        type = 1;
        productType = 'CNC';
        limitPrice  = signal.price;
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' && result[1][0].product_type == '1') {
        type = 1;
        productType = 'CNC';
        limitPrice  = signal.price;
    }
     else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' && result[1][0].product_type == '1') {
       type = 4;
       productType = 'CNC';
       limitPrice = signal.price;
      triggerprice = signal.tr_price;
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' && result[1][0].product_type == '1') {
        type = 4;
        productType = 'CNC';
        limitPrice = signal.price;
        triggerprice = signal.tr_price;
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '4' && result[1][0].product_type == '1') {
        
        type = 3;
        productType = 'CNC';
        stopPrice = signal.tr_price;
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '4' && result[1][0].product_type == '1') {
        console.log('product CNC');
        type = 3;
        productType = 'CNC';
        stopPrice = signal.tr_price;
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' && result[1][0].product_type == '2') {
        type = 2;
       productType = 'INTRADAY';
       
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' && result[1][0].product_type == '2') {
        type = 2;
       productType = 'INTRADAY';
       
    }  
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' && result[1][0].product_type == '2') {
        type = 1;
       productType = 'INTRADAY';
       limitPrice  = signal.price;
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' && result[1][0].product_type == '2') {
        type = 1;
       productType = 'INTRADAY';
       limitPrice = signal.price;
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' && result[1][0].product_type == '2') {
       type = 4;
       productType = 'INTRADAY';
       limitPrice = signal.price;
        triggerprice = signal.tr_price;
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' && result[1][0].product_type == '2') {
       type = 4;
       productType = 'INTRADAY';
       limitPrice = signal.price;
        triggerprice = signal.tr_price;
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '4' && result[1][0].product_type == '2') {
        type = 3;
       productType = 'INTRADAY';
       stopPrice = signal.tr_price;
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '4' && result[1][0].product_type == '2') {
        type = 3;
       productType = 'INTRADAY';
       stopPrice = signal.tr_price;
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' && result[1][0].product_type == '4') {
        type = 2;
        productType = 'CO';
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' && result[1][0].product_type == '4') {
        type = 2;
        productType = 'CO';
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' && result[1][0].product_type == '4') {
        type = 1;
        productType = 'CO';
        limitPrice = signal.price;
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' && result[1][0].product_type == '4') {
        type = 1;
        productType = 'CO';
        limitPrice = signal.price;
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' && result[1][0].product_type == '3') {
        type = 1;
        limitPrice = signal.price;
        productType = 'BO';
        stopPrice  = signal.tr_price;
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' && result[1][0].product_type == '3') {
        type = 1;
        limitPrice  = signal.price;
        productType = 'BO';
        stopPrice  = signal.tr_price;
       
    } 
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' && result[1][0].product_type == '3') {
        type = 4;
        limitPrice = signal.price;
        productType = 'BO';
        stopPrice  = signal.tr_price;
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' && result[1][0].product_type == '3') {
        type = 4;
        limitPrice = signal.price;
        productType = 'BO';
        stopPrice = signal.tr_price;

    }


    if(result[1][0].product_type == '1'){
        if (signal.segment == 'F' || signal.segment == 'f' || signal.segment == 'O' || signal.segment == 'o') {
            productType = "MARGIN";
            }   
      }



    if (signal.type == 'SX' || signal.type == 'LX') {

          var config = {
              method: 'get',
              url: 'https://api.fyers.in/api/v2/positions',
              headers: { 
                    'Authorization': item.app_id+':'+item.access_token, 
                    },
                };
                
               axios(config)
                    .then(function(response) {
                    
                      response.data.netPositions.forEach(function(item1, index) {
                            if(item1.symbol == symbol){
                             var possition_qty =item1.buyQty - item1.sellQty;
                                 
                                connection.query('UPDATE `broker_response` SET `open_possition_qty`="' + possition_qty + '" WHERE `id`=' + bro_res_last_id, (err, result_p) => {
                                    //console.log("err", err);
                                });
                             
                                if((item1.buyQty - item1.sellQty) > 0 && signal.type=='LX'){
                    
                                   data11 = {
                                    "symbol":symbol,
                                    "qty":qty,
                                    "type":type,
                                    "side":side,
                                    "productType":productType,
                                    "limitPrice":limitPrice,
                                    "stopPrice":stopPrice,
                                    "validity":validity,
                                    "disclosedQty":disclosedQty,
                                    "offlineOrder":offlineOrder,
                                    "stopLoss":stopLoss,
                                    "takeProfit":takeProfit
                                    }
        
                                    console.log('Return data  ',data11)
        
                                    var config = {
                                        method: 'post',
                                        url: 'https://api.fyers.in/api/v2/orders',
                                        headers: { 
                                            'Authorization': item.app_id+':'+item.access_token, 
                                          },
                                        data: data11
                    
                                    };
                                    var datetime = new Date();
                                    axios(config)
                                        .then(function(response) {

                                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nFyers Place Oredr Exit  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                                                if(err) {
                                                    return console.log(err);
                                                }
                                                });


                                            var datetime = new Date();
                                            var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');

                                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+response.data.id+'" ,`order_status`="'+response.data.s+'" ,`reject_reason`="'+response.data.message+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                //console.log("err", err);
                                            });
                    
                    
                                            connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"SELL","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + error1.response.data.id + ',"' + get_date() + '","",' + signal.id + ',"' + error1.response.data.message + '","'+last_signal_id+'","'+signal.type+'")', (err, client_transaction) => {
                                                //console.log('client tranjaction -',err);
                                            }); 
                                          
                    
                                        })
                                        .catch(function(error) {

                                            var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');

                                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nFyers Place Oredr Exit Catch  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit Catch -'+JSON.stringify(error.response.data)+ "\n\n" , function(err) {
                                                if(err) {
                                                    return console.log(err);
                                                }
                                                });

                                                const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');

                                                connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                    //console.log("err", err);
                                                });




                                           try{
                         
                                    if(error1.response.data.s == "error"){

                                        try{

                                    var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');

                        connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+error1.response.data.id+'" ,`order_status`="'+error1.response.data.s+'" ,`reject_reason`="'+error1.response.data.message+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                            //console.log("err", err);
                        });
 
 
                         connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"SELL","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + error1.response.data.id + ',"' + get_date() + '","",' + signal.id + ',"' + error1.response.data.message + '")', (err, client_transaction) => {
                             //console.log('client tranjaction -',err);
                         }); 

                        }catch (e) {
                            console.log('Fyers order',e);
                          }
                          
                        }
                                     
                    }catch (e) {
                        console.log('Fyers order',e);
                      }
                    
                                        });
        
                                        data = '';
                                        return data;


                                }
                               else if((item1.buyQty - item1.sellQty) < 0 && signal.type=='SX'){
                                                        
                                data11 = {
                                    "symbol":symbol,
                                    "qty":qty,
                                    "type":type,
                                    "side":side,
                                    "productType":productType,
                                    "limitPrice":limitPrice,
                                    "stopPrice":stopPrice,
                                    "validity":validity,
                                    "disclosedQty":disclosedQty,
                                    "offlineOrder":offlineOrder,
                                    "stopLoss":stopLoss,
                                    "takeProfit":takeProfit
                                    }
        
                                    var config = {
                                        method: 'post',
                                        url: 'https://api.fyers.in/api/v2/orders',
                                        headers: { 
                                            'Authorization': item.app_id+':'+item.access_token, 
                                          },
                                        data: data11
                                      };
                    
                                    var datetime = new Date();
                                    axios(config)
                                        .then(function(response) {

                                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nFyers Place Oredr Exit   =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit  -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                                                if(err) {
                                                    return console.log(err);
                                                }
                                                });

                                            var datetime = new Date();
                                            var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');


                                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+response.data.id+'" ,`order_status`="'+response.data.s+'" ,`reject_reason`="'+response.data.message+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                //console.log("err", err);
                                            });
                    
                    
                                            connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"SELL","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + error1.response.data.id + ',"' + get_date() + '","",' + signal.id + ',"' + error1.response.data.message + '","'+last_signal_id+'","'+signal.type+'")', (err, client_transaction) => {
                                                //console.log('client tranjaction -',err);
                                            }); 
                                          
                    
                                        })
                                        .catch(function(error) {

                                            var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');

                                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nFyers Place Oredr Exit Catch   =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit Catch  -'+JSON.stringify(error.response.data)+ "\n\n" , function(err) {
                                                if(err) {
                                                    return console.log(err);
                                                }
                                                });

                                                const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');

                                                connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                    //console.log("err", err);
                                                });
                                    
                                       try{
                                      if(error1.response.data.s == "error"){

                                      try{


                                      var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');
                        

                        connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+error1.response.data.id+'" ,`order_status`="'+error1.response.data.s+'" ,`reject_reason`="'+error1.response.data.message+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                            //console.log("err", err);
                        });
 
 
                         connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"SELL","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + error1.response.data.id + ',"' + get_date() + '","",' + signal.id + ',"' + error1.response.data.message + '")', (err, client_transaction) => {
                             //console.log('client tranjaction -',err);
                         }); 

                        }catch (e) {
                            console.log('Fyers order',e);
                          }
                      
                      
                        }
                                      
                    }catch (e) {
                        console.log('Fyers order',e);
                      }
                    
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
          
        return_data = {
            "symbol":symbol,
            "qty":qty,
            "type":type,
            "side":side,
            "productType":productType,
            "limitPrice":limitPrice,
            "stopPrice":stopPrice,
            "validity":validity,
            "disclosedQty":disclosedQty,
            "offlineOrder":offlineOrder,
            "stopLoss":stopLoss,
            "takeProfit":takeProfit
            }

        return return_data;
    }

}catch (e) {
    console.log('Fyers Get Order',e);
  }


}

module.exports = { place_order, access_token }