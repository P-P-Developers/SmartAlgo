var axios = require('axios');
var qs = require('qs');
const fs = require('fs');
const sha256 = require('sha256');


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

    try{

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
   try{
    var segment = signal.segment

    if (segment == "FO" || segment == "fo") {
        segment = 'O';
    }


connection.query('' + instrument_query + ';SELECT * FROM `client_service` LEFT JOIN `services` ON `services`.`id` = `client_service`.`service_id` LEFT JOIN `client` ON `client`.`id` = `client_service`.`client_id` LEFT JOIN `categorie` ON `categorie`.`id` = `services`.`categorie_id`  WHERE `client_service`.`client_id` = "' + item.id + '" AND `services`.`service` = "' + signal.input_symbol + '" AND `categorie`.`segment`="'+segment+'"', [1, 2], (err, result) => {
       
         try{

        if(result[0].length > 0 || result[1].length > 0){

           // Broker Response Print Token
           if(signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo'){
    
            var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Strike : "+signal.strike+" , option_type :"+signal.option_type+" , Token : "+instrument_token_symbol[0].instrument_token+"]";
    
            var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

            connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="ANAND RATHI" WHERE `id`=' + bro_res_last_id, (err, result) => {
                console.log("err update token", err);
            });
    
          }else if(signal.segment == 'C' || signal.segment == 'c'){
    
            var signal_sy = "[symbol : "+ signal.input_symbol +"  , Token : "+instrument_token_symbol[0].instrument_token+"]";
    
            var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

            connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="ANAND RATHI" WHERE `id`=' + bro_res_last_id, (err, result) => {
                console.log("err update token", err);
            })   
    
    
          }else{
    
            var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Token : "+instrument_token_symbol[0].instrument_token+"]";
    
            var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
 
            connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="ANAND RATHI" WHERE `id`=' + bro_res_last_id, (err, result) => {
                console.log("err update token", err);
            })
    
    
          }
    
        }else{
         
            if(signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo'){
    
                var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Strike : "+signal.strike+" , option_type :"+signal.option_type+" ,  Token : NULL]";
        
                var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
            
                connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="ANAND RATHI" WHERE `id`=' + bro_res_last_id, (err, result) => {
                    console.log("err update token", err);
                })
        
              }else{
        
                var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +" ,  Token : NULL]";
        
                var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

                connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="ANAND RATHI" WHERE `id`=' + bro_res_last_id, (err, result) => {
                    console.log("err update token", err);
                })
        
        
              }
      
    
        }





        console.log(err);
        if (result[1].length > 0 || result[0].length > 0) {

            var data =  get_orderdata(item, signal, result, connection,last_signal_id,instrument_token_symbol,bro_res_last_id,filePath);
            //console.log('ANAND RATHI Entry -',data);
           
            var url;
            if(result[1][0].product_type == '3'){
                url = 'https://algozy.rathi.com:3000/interactive/orders/bracket';
            }else if(result[1][0].product_type == '4'){
                url = 'https://algozy.rathi.com:3000/interactive/orders/cover';
            }else{
                url = 'https://algozy.rathi.com:3000/interactive/orders';
            }
                 
            if (data !== undefined) {
                var send_rr = Buffer.from(JSON.stringify(data)).toString('base64');
                var config = {
                    method: 'post',
                    url: url,
                    headers: { 
                        'Authorization': item.access_token,
                        'Content-Type': 'application/json'
                     },
                     data: JSON.stringify(data)
                };

                var datetime = new Date();
                axios(config)
                    .then(function(response) { 

                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nAnand Rathi Place Oredr Entry  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                            if(err) {
                                return console.log(err);
                            }
                           });



             if(response.data.type == "success"){                     
              var datetime = new Date();       
             var  config1 = {
                  method: 'get',
                  url: 'https://algozy.rathi.com:3000/interactive/orders?appOrderID='+response.data.result.AppOrderID,
                  headers: { 
                    'Authorization': item.access_token,
                    'Content-Type': 'application/json'
                 },
                        };
                          axios(config1)
                        .then(function(response1) {

                           var last = response1.data.result.slice(-1)[0];
                           var send_rr = Buffer.from(JSON.stringify(data)).toString('base64');

                           connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+response.data.result.AppOrderID+'" ,`order_status`="'+last.OrderStatus+'" ,`reject_reason`="'+last.CancelRejectReason+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                            //console.log("err", err);
                        });
                            
                           connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"BUY","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + result[1][0].product_type + '","' + response.data.result.AppOrderID + '","' + get_date() + '","",' + signal.id + ',"' + last.OrderStatus + '","'+last_signal_id+'","'+signal.type+'")', (err11, client_transaction) => {
                                console.log('client_transaction error',err11);
                            });

                           


                        })
                        .catch(function(error1) {
                        // console.log('get anadrathi response error -',error1);
                        });

                    
                    }else{

                       // console.log('get anadrathi response error else---',response.data.result);

                       const message = (JSON.stringify(response.data)).replace(/["',]/g, '');

                       connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                           //console.log("err", err);
                       });
                    
                    }
                       
                       

                    })
                    .catch(function(error) {


                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nAnand Rathi Place Oredr Entry Catch =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry Catch -'+JSON.stringify(error.response.data)+ "\n\n" , function(err) {
                            if(err) {
                                return console.log(err);
                            }
                           });


                       const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');

                       connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                           //console.log("err", err);
                       });


                       console.log('send Request Anandrathi - error',error.response.data);
                                  
                       if(error.response.data.code == "e-app-001"){
                        
                       var sss = error.response.data.result.errors[0].messages[0].replace('"', '');
                       var ss = sss.replace('"', '');
                       

                       connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_status`="error" ,`reject_reason`="'+ss+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                       // console.log("err dddddd ", err);
                      });
                   
                    }else{
                        console.log('else');
                        connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_status`="error" ,`reject_reason`="'+error.response.data.description+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                           // console.log("err dddddd ", err);
                          });

                    }

                      
                    });
            }
        }
     }catch (e) {
        console.log('Anandrathi Query',e);
      }
  
    });
}catch (e) {
    console.log('Anandrathi Token Symbol',e);
  }
});

}catch (e) {
    console.log('Anandrathi Inside Placeorder',e);
  }
}

const  get_orderdata = (item, signal, result, connection,last_signal_id,instrument_token_symbol,bro_res_last_id,filePath) => {

   try{

    // console.log(result);
    var is_reject = false;
    var exchangeSegment;
    if (signal.segment == 'C' || signal.segment == 'c') {
        exchangeSegment = "NSECM";
    } else if (signal.segment == 'F' || signal.segment == 'f' || signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo') {
        exchangeSegment = "NSEFO";
    } else if (signal.segment == 'MF' || signal.segment == 'mf' || signal.segment == 'MO' || signal.segment == 'mo') {
        exchangeSegment = "MCXFO";
    }
    else if (signal.segment == 'CF' || signal.segment == 'cf' || signal.segment == 'CO' || signal.segment == 'co') {
        exchangeSegment = "NSECD";
    }

   
    var orderSide;

    if (signal.type == 'LE' || signal.type == 'SX') {
        orderSide = 'BUY';
    } else if (signal.type == 'SE' || signal.type == 'LX') {
        orderSide = 'SELL';
    }


    var exchangeInstrumentID = instrument_token_symbol[0].instrument_token;
    var productType;
    var orderType;
    
    var timeInForce ="DAY";
    var disclosedQuantity = 0;
    var orderQuantity =result[1][0].qty;
    var limitPrice =0;
    var stopPrice =0;
    var orderUniqueIdentifier ="123abc";
    var clientID = item.client_code;
    var stopLossPrice=0;
    var squarOff=0;
    var trailingStoploss=0;


    if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' &&  result[1][0].product_type == '1') {
        orderType = 'MARKET';
        productType = 'CNC';       
    }
   else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' &&  result[1][0].product_type == '1') {
        orderType = 'MARKET';
        productType = 'CNC';       
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' &&  result[1][0].product_type == '1') {
        orderType = 'LIMIT';
        limitlimitPrice = signal.price;
        productType = 'CNC';
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' &&  result[1][0].product_type == '1') {
        orderType = 'LIMIT';
        limitPrice = signal.price;
        productType = 'CNC';
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' &&  result[1][0].product_type == '1') {
        orderType = 'StopLimit';
        limitPrice = signal.price;
        productType = 'CNC';
        stopPrice = signal.tr_price;
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' &&  result[1][0].product_type == '1') {
        orderType = 'StopLimit';
        limitPrice = signal.price;
        productType = 'CNC';
        stopPrice = signal.tr_price;
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '4' &&  result[1][0].product_type == '1') {

        orderType = 'StopMarket';
        productType = 'CNC'; 
        stopPrice = signal.tr_price;
   }
   else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '4' &&  result[1][0].product_type == '1') {

    orderType = 'StopMarket';
    productType = 'CNC'; 
    stopPrice = signal.tr_price;
}
  
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' &&  result[1][0].product_type == '2') {
        orderType = 'MARKET';
        productType = 'MIS';
        
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' &&  result[1][0].product_type == '2') {
        orderType = 'MARKET';
        productType = 'MIS';
        
    } 
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' &&  result[1][0].product_type == '2') {

        orderType = 'LIMIT';
        limitPrice = signal.price;
        productType = 'MIS';
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' &&  result[1][0].product_type == '2') {

        orderType = 'LIMIT';
        limitPrice = signal.price;
        productType = 'MIS';
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' &&  result[1][0].product_type == '2') {
        orderType = 'StopLimit';
        limitPrice = signal.price;
        productType = 'MIS';
        stopPrice = signal.tr_price;
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' &&  result[1][0].product_type == '2') {
        orderType = 'StopLimit';
        limitPrice = signal.price;
        productType = 'MIS';
        stopPrice = signal.tr_price;
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '4' &&  result[1][0].product_type == '2') {

        orderType = 'StopMarket';
        productType = 'MIS';
        stopPrice = signal.tr_price;
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '4' &&  result[1][0].product_type == '2') {

        orderType = 'StopMarket';
        productType = 'MIS';
        stopPrice = signal.tr_price;
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' && result[1][0].product_type == '4') {
        orderType = 'MARKET';
        productType = 'CO';
        stopPrice = signal.tr_price;
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' && result[1][0].product_type == '4') {
        orderType = 'MARKET';
        productType = 'CO';
        stopPrice = signal.tr_price;
    }

    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' && result[1][0].product_type == '4') {
        orderType = 'LIMIT';
        productType = 'CO';
        limitPrice = signal.price;
        stopPrice = signal.tr_price;
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' && result[1][0].product_type == '4') {
        orderType = 'LIMIT';
        productType = 'CO';
        limitPrice = signal.price;
        stopPrice = signal.tr_price;
    }
     else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' &&  result[1][0].product_type == '3') {

       
        orderType = 'LIMIT';
        limitPrice = signal.price;
        productType = 'BO';
        stopLossPrice = signal.sl_value;
        squarOff = signal.sq_value;
        trailingStoploss = signal.tsl;
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' &&  result[1][0].product_type == '3') {
        orderType = 'LIMIT';
        limitPrice = signal.price;
        productType = 'BO';
        stopLossPrice = signal.sl_value;
        squarOff = signal.sq_value;
        trailingStoploss = signal.tsl;
    } 
     else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' &&  result[1][0].product_type == '3') {

        orderType = 'StopLimit';
        limitPrice = signal.price;
        productType = 'BO';
        stopLossPrice = signal.sl_value;
        squarOff = signal.sq_value;
        trailingStoploss = signal.tsl;
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' &&  result[1][0].product_type == '3') {

        orderType = 'StopLimit';
        limitPrice = signal.price;
        productType = 'BO';
        stopLossPrice = signal.sl_value;
        squarOff = signal.sq_value;
        trailingStoploss = signal.tsl;
        
    }

    if (signal.type == 'SX' || signal.type == 'LX') {
  
                var config = {
                    method: 'get',
                    url: 'https://algozy.rathi.com:3000/interactive/portfolio/positions?dayOrNet=DayWise',
                    headers: { 
                        'Authorization': item.access_token,
                        'Content-Type': 'application/json'
                     },
                };

                axios(config)
                    .then(function(response) {
                                      
                        response.data.result.positionList.forEach(function(item1, index) {
                            if(item1.ExchangeInstrumentId == exchangeInstrumentID){
                              var possition_qty =item1.OpenBuyQuantity - item1.OpenSellQuantity;
                                 
                                connection.query('UPDATE `broker_response` SET `open_possition_qty`="' + possition_qty + '" WHERE `id`=' + bro_res_last_id, (err, result_p) => {
                                    //console.log("err", err);
                                });

                                if((item1.OpenBuyQuantity - item1.OpenSellQuantity) > 0 && signal.type=='LX'){
                                    var url;
                                    if(result[1][0].product_type == '4'){
                                        url = "https://algozy.rathi.com:3000/interactive/orders/cover";
                                        data11   = {
                                            
                                            "exchangeSegment": exchangeSegment,
                                            "exchangeInstrumentID": exchangeInstrumentID,
                                            "orderSide": orderSide,
                                            "orderQuantity": orderQuantity,
                                            "disclosedQuantity": disclosedQuantity,
                                            "limitPrice": limitPrice,
                                            "stopPrice": stopPrice,
                                            "orderType": orderType,
                                            "orderUniqueIdentifier": orderUniqueIdentifier,
                                            "clientID": clientID
                                
                                
                                            };
                                    }
                                   else if(result[1][0].product_type == '3'){
                                    url = "https://algozy.rathi.com:3000/interactive/orders/bracket";
                                    data11 =  {
                                        
                                        "clientID": clientID,
                                        "exchangeSegment": exchangeSegment,
                                        "exchangeInstrumentID": exchangeInstrumentID,
                                        "orderType": orderType,
                                        "orderSide": orderSide,
                                        "disclosedQuantity": disclosedQuantity,
                                        "orderQuantity": orderQuantity,
                                        "limitPrice": limitPrice,
                                        "stopLossPrice": stopLossPrice,
                                        "squarOff": squarOff,
                                        "trailingStoploss": trailingStoploss,
                                        "orderUniqueIdentifier": orderUniqueIdentifier
                                
                                
                                        };
                                
                                   } 
                                
                                else{
                                       
                                    url = "https://algozy.rathi.com:3000/interactive/orders";

                                    data11 = {
                                            "exchangeSegment":exchangeSegment,
                                            "exchangeInstrumentID":exchangeInstrumentID,
                                            "productType":productType,
                                            "orderType":orderType,
                                            "orderSide":orderSide,
                                            "timeInForce":timeInForce,
                                            "disclosedQuantity":disclosedQuantity,
                                            "orderQuantity":orderQuantity,
                                            "limitPrice":limitPrice,
                                            "stopPrice":stopPrice,
                                            "orderUniqueIdentifier":orderUniqueIdentifier
                                            };
                                
                                
                                        }
                        
                           var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');

                            var config = {
                                method: 'post',
                                url: url,
                                headers: { 
                                    'Authorization': item.access_token,
                                    'Content-Type': 'application/json'
                                 },
                                 data: JSON.stringify(data11)
                            };
            
            
                            var datetime = new Date();
                            axios(config)
                            .then(function(response) { 


                                fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nAnand Rathi Place Oredr Exit  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit  -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                                    if(err) {
                                        return console.log(err);
                                    }
                                   });
                           
                          if(response.data.type == "success"){
                                   
                    var datetime = new Date();       
                    var  config1 = {
                          method: 'get',
                          url: 'https://algozy.rathi.com:3000/interactive/orders?appOrderID='+response.data.result.AppOrderID,
                          headers: { 
                            'Authorization': item.access_token,
                            'Content-Type': 'application/json'
                         },
                                };
                                  axios(config1)
                                .then(function(response1) {
        
                                   var last = response1.data.result.slice(-1)[0];
                                   var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');


                                   connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+response.data.result.AppOrderID+'" ,`order_status`="'+last.OrderStatus+'" ,`reject_reason`="'+last.CancelRejectReason+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                    //console.log("err", err);
                                });



                                   connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"SELL","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + result[1][0].product_type + '","' + response.data.result.AppOrderID + '","' + get_date() + '","",' + signal.id + ',"' + last.OrderStatus + '","'+last_signal_id+'","'+signal.type+'")', (err11, client_transaction) => {
                                        //console.log('client_transaction error',err11);
                                    });
        
                                    
       
                                })
                                .catch(function(error1) {
                               //  console.log('get anadrathi response error -',error1);
                                });
        
                            
                            }else{
        
                               // console.log('get anadrathi response error else---',response.data.result) 
                               
                          const message = (JSON.stringify(response.data)).replace(/["',]/g, '');

                       connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                           //console.log("err", err);
                       });
                            
                               }
                                     
                            })
                                .catch(function(error) {

                                    fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nAnand Rathi Place Oredr Exit Catch =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit Catch -'+JSON.stringify(error.response.data)+ "\n\n" , function(err) {
                                        if(err) {
                                            return console.log(err);
                                        }
                                       });

                         const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');

                       connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                           //console.log("err", err);
                       });
                                   
                                   if(error.response.data.code == "e-app-001"){
                                   var sss = error.response.data.result.errors[0].messages[0].replace('"', '');
                                   var ss = sss.replace('"', '');
                                  connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_status`="error" ,`reject_reason`="'+ss+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                   // console.log("err dddddd ", err);
                                  });
                               
                                }else{
                                   
                                    connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_status`="error" ,`reject_reason`="'+error.response.data.description+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                     //   console.log("err dddddd ", err);
                                      });
            
                                     }
                                });

                                        data = '';
                                        return data;   


                                }

                                
                                else if((item1.OpenBuyQuantity - item1.OpenSellQuantity) < 0 && signal.type=='SX'){
                                    
                                    if(result[1][0].product_type == '4'){
                                        url = "https://algozy.rathi.com:3000/interactive/orders/cover";
                                        data11   = {
                                            
                                            "exchangeSegment": exchangeSegment,
                                            "exchangeInstrumentID": exchangeInstrumentID,
                                            "orderSide": orderSide,
                                            "orderQuantity": orderQuantity,
                                            "disclosedQuantity": disclosedQuantity,
                                            "limitPrice": limitPrice,
                                            "stopPrice": stopPrice,
                                            "orderType": orderType,
                                            "orderUniqueIdentifier": orderUniqueIdentifier,
                                            "clientID": clientID
                                
                                
                                            };
                                    }
                                   else if(result[1][0].product_type == '3'){
                                    url = "https://algozy.rathi.com:3000/interactive/orders/bracket";
                                    data11 =  {
                                        
                                        "clientID": clientID,
                                        "exchangeSegment": exchangeSegment,
                                        "exchangeInstrumentID": exchangeInstrumentID,
                                        "orderType": orderType,
                                        "orderSide": orderSide,
                                        "disclosedQuantity": disclosedQuantity,
                                        "orderQuantity": orderQuantity,
                                        "limitPrice": limitPrice,
                                        "stopLossPrice": stopLossPrice,
                                        "squarOff": squarOff,
                                        "trailingStoploss": trailingStoploss,
                                        "orderUniqueIdentifier": orderUniqueIdentifier
                                
                                
                                        };
                                
                                   } 
                                
                                else{
                                       
                                    url = "https://algozy.rathi.com:3000/interactive/orders";

                                    data11 = {
                                            "exchangeSegment":exchangeSegment,
                                            "exchangeInstrumentID":exchangeInstrumentID,
                                            "productType":productType,
                                            "orderType":orderType,
                                            "orderSide":orderSide,
                                            "timeInForce":timeInForce,
                                            "disclosedQuantity":disclosedQuantity,
                                            "orderQuantity":orderQuantity,
                                            "limitPrice":limitPrice,
                                            "stopPrice":stopPrice,
                                            "orderUniqueIdentifier":orderUniqueIdentifier
                                            };
                                
                            
                                        }

                                        var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');

                                        var config = {
                                            method: 'post',
                                            url: url,
                                            headers: { 
                                                'Authorization': item.access_token,
                                                'Content-Type': 'application/json'
                                             },
                                             data: JSON.stringify(data11)
                                        };
                        
                                        var datetime = new Date();
                                        axios(config)
                                        .then(function(response) { 
                                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nAnand Rathi Place Oredr Entry =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                                                if(err) {
                                                    return console.log(err);
                                                }
                                               });
                              
                                          if(response.data.type == "success"){
                                                    
                                 var datetime = new Date();       
                                 var  config1 = {
                                      method: 'get',
                                      url: 'https://algozy.rathi.com:3000/interactive/orders?appOrderID='+response.data.result.AppOrderID,
                                      headers: { 
                                        'Authorization': item.access_token,
                                        'Content-Type': 'application/json'
                                     },
                                            };
                                              axios(config1)
                                            .then(function(response1) {
                    
                                               var last = response1.data.result.slice(-1)[0];
                                              var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');

                                              connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+response.data.result.AppOrderID+'" ,`order_status`="'+last.OrderStatus+'" ,`reject_reason`="'+last.CancelRejectReason+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                //console.log("err", err);
                                            });
                                                
                                              connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"SELL","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + result[1][0].product_type + '","' + response.data.result.AppOrderID + '","' + get_date() + '","",' + signal.id + ',"' + last.OrderStatus + '","'+last_signal_id+'","'+signal.type+'")', (err11, client_transaction) => {
                                                    //console.log('client_transaction error',err11);
                                                });
                    
                                                
                    
                    
                                            })
                                            .catch(function(error1) {
                                            // console.log('get anadrathi response error -',error1);
                                            });
                    
                                        
                                        }else{
                       
                                           // console.log('get anadrathi response error else---',response.data.result.errors.messages);
                               const message = (JSON.stringify(response.data)).replace(/["',]/g, '');

                       connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                           //console.log("err", err);
                       });
                                        }
                                           
                                                            
                                        })
                                            .catch(function(error) {

                                                fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nAnand Rathi Place Oredr Exit Catch =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit Catch -'+JSON.stringify(error.response.data)+ "\n\n" , function(err) {
                                                    if(err) {
                                                        return console.log(err);
                                                    }
                                                   });

                        const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');

                       connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                           //console.log("err", err);
                       });
                                                
                                                if(error.response.data.code == "e-app-001"){
                                                var sss = error.response.data.result.errors[0].messages[0].replace('"', '');
                                                var ss = sss.replace('"', '');
                                               
                                                connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_status`="error" ,`reject_reason`="'+ss+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                 console.log("err dddddd ", err);
                                               });
                                            
                                             }else{
                                                 
                                                 connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_status`="error" ,`reject_reason`="'+error.response.data.description+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                     console.log("err dddddd ", err);
                                                   });
                         
                                                  }
                                              
                                            
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
            
            "exchangeSegment": exchangeSegment,
            "exchangeInstrumentID": exchangeInstrumentID,
            "orderSide": orderSide,
            "orderQuantity": orderQuantity,
            "disclosedQuantity": disclosedQuantity,
            "limitPrice": limitPrice,
            "stopPrice": stopPrice,
            "orderType": orderType,
            "orderUniqueIdentifier": orderUniqueIdentifier,
            "clientID": clientID


            };
    }
   else if(result[1][0].product_type == '3'){
     
    return_data =  {
        
        "clientID": clientID,
        "exchangeSegment": exchangeSegment,
        "exchangeInstrumentID": exchangeInstrumentID,
        "orderType": orderType,
        "orderSide": orderSide,
        "disclosedQuantity": disclosedQuantity,
        "orderQuantity": orderQuantity,
        "limitPrice": limitPrice,
        "stopLossPrice": stopLossPrice,
        "squarOff": squarOff,
        "trailingStoploss": trailingStoploss,
        "orderUniqueIdentifier": orderUniqueIdentifier


        };

   } 

else{
       
          return_data = {
            "exchangeSegment":exchangeSegment,
            "exchangeInstrumentID":exchangeInstrumentID,
            "productType":productType,
            "orderType":orderType,
            "orderSide":orderSide,
            "timeInForce":timeInForce,
            "disclosedQuantity":disclosedQuantity,
            "orderQuantity":orderQuantity,
            "limitPrice":limitPrice,
            "stopPrice":stopPrice,
            "orderUniqueIdentifier":orderUniqueIdentifier
            };

        }

        return return_data;
    }





}catch (e) {
    console.log('Anandrathi Get Order',e);
  }
}

module.exports = { place_order, access_token }