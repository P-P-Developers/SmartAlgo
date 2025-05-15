var axios = require('axios');
var qs = require('qs');
const fs = require('fs');
const sha256 = require('sha256');


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

const place_order = (item, signal, connection ,last_signal_id,connection2,bro_res_last_id,filePath) => {
    
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
       // console.log(instrument_query);
   
       if(result[0].length > 0 || result[1].length > 0){
 
        // Broker Response print Token
       if(signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo'){

        var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Strike : "+signal.strike+" , option_type :"+signal.option_type+" , Token : "+instrument_token_symbol[0].instrument_token+"]";

        var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
      
        connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="5 PAISA" WHERE `id`=' + bro_res_last_id, (err, result) => {
            console.log("err update token", err);
        })

      }else if(signal.segment == 'C' || signal.segment == 'c'){

       var signal_sy = "[symbol : "+ signal.input_symbol +"  , Token : "+instrument_token_symbol[0].instrument_token+"]";

       var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
      
        connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="5 PAISA" WHERE `id`=' + bro_res_last_id, (err, result) => {
            console.log("err update token", err);
        })


      }else{

        var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Token : "+instrument_token_symbol[0].instrument_token+"]";
        var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
        connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="5 PAISA" WHERE `id`=' + bro_res_last_id, (err, result) => {
            console.log("err update token", err);
        })

      }

    }else{
     
        if(signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo'){

            var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Strike : "+signal.strike+" , option_type :"+signal.option_type+" ,  Token : NULL]";
    
            var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');       
            connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="5 PAISA" WHERE `id`=' + bro_res_last_id, (err, result) => {
                console.log("err update token", err);
            })
    
          }else{
    
            var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +" ,  Token : NULL]";
            var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
          
            connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="5 PAISA" WHERE `id`=' + bro_res_last_id, (err, result) => {
                console.log("err update token", err);
            })
    
    
          }
  

    }
      




       // console.log(err);
        if (result[1].length > 0 || result[0].length > 0) {

            var data = get_orderdata(item, signal, result, connection ,last_signal_id,instrument_token_symbol,bro_res_last_id,filePath);
            //console.log('Five Paisa Entry New ',data)

            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n Time - '+new Date()+' BEFORE 5 Paisha Place Oredr Entry  =   client Username - ' + item.username + '  client id - '+ item.id + "\n\n" , function(err) {
                if(err) {
                    return console.log(err);
                }
               });


           var url;
           if(result[1][0].product_type == '3' || result[1][0].product_type == '4'){
               url = 'https://Openapi.5paisa.com/VendorsAPI/Service1.svc/SMOOrderRequest';
           }else{
               url = 'https://openapi.5paisa.com/VendorsAPI/Service1.svc/V1/PlaceOrderRequest';
           }

           console.log('Url -',url);

          //  return
            if (data !== undefined) {


                var send_rr = Buffer.from(qs.stringify(data)).toString('base64');
                    var config = {
                    method: 'post',
                    url:url,
                    headers: { 
                        'Authorization': 'Bearer '+ item.access_token , 
                        'Content-Type': 'application/json'
                      },
                    data: JSON.stringify(data)
                };

                var datetime = new Date();
                console.log("ordertime1", datetime);
                axios(config)
                    .then(function(response) {

                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nTime - '+new Date()+' AFTER 5 Paisha Place Oredr Entry  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                            if(err) {
                                return console.log(err);
                            }
                           });

                        var datetime = new Date();
                        var send_rr = Buffer.from(qs.stringify(data)).toString('base64');
                       
                  if(response.data.head.statusDescription == "Success"){
                   var data_order = {
                    
                        "head": {
                             "key": item.api_key
                        },
                        "body": {
                            "ClientCode": item.client_code
                        }
                    
                   }

                 var config1 = {
                  method: 'post',
                  url: 'https://Openapi.5paisa.com/VendorsAPI/Service1.svc/V2/OrderBook',
                  headers: { 
                    'Authorization': 'Bearer '+ item.access_token , 
                    'Content-Type': 'application/json'
                  },

                data: JSON.stringify(data_order)

                        };
                        axios(config1)
                        .then(function(response1) {
                            
                           response1.data.body.OrderBookDetail.forEach(function(item2, index) {
                      
                           if(item2.BrokerOrderId == response.data.body.BrokerOrderID){
                            
                            var send_rr = Buffer.from(qs.stringify(data)).toString('base64');

                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+response.data.body.BrokerOrderID+'" ,`order_status`="'+item2.OrderStatus+'" ,`reject_reason`="'+item2.Reason+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                //console.log("err", err);
                            });

                           connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"BUY","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data.body.BrokerOrderID + ',"' + get_date() + '","",' + signal.id + ',"' + item2.OrderStatus + '","'+last_signal_id+'","'+signal.type+'")', (err, client_transaction) => {
                                //console.log(err);
                            });    

                          }


                         }) 


                        })
                        .catch(function(error_broker) {
                             //console.log('error_broker -', error_broker);
                        });

                    }else{
                    

                        const message = (JSON.stringify(response.data)).replace(/["',]/g, '');

                        connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                            //console.log("err", err);
                        });


                    }

                    })
                    .catch(function(error_p) {
                       // console.log('place order errror ',error_p);

                       fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n5 Paisha Place Oredr Entry Catch  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry Catch -'+JSON.stringify(error_p.response.data)+ "\n\n" , function(err) {
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
   }catch (e) {
        console.log('Fivepaisa Query',e);
      }
    });
}catch (e) {
    console.log('Fivepaisa Token Symbol',e);
  }

});

}catch (e) {
    console.log('Fivepaisa Inside Placeorder',e);
  }
}


const get_orderdata = (item, signal, result, connection ,last_signal_id,instrument_token_symbol,bro_res_last_id,filePath) => {

    try{
    // console.log(result);
    var is_reject = false;
    var Exchange;
    var Exch;
    var ExchangeType;
    var ExchType
   if (signal.segment == 'C' || signal.segment == 'c') {
         Exchange = "N";
         Exch = "N";

         ExchangeType = "C"
         ExchType = "C"

    } else if (signal.segment == 'F' || signal.segment == 'f' || signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo') {
        Exchange = "N";
        Exch = "N";

        ExchangeType = "D"
        ExchType = "D"

    } else if (signal.segment == 'MF' || signal.segment == 'mf' || signal.segment == 'MO' || signal.segment == 'mo') {
        Exchange = "M";
        Exch = "M";

        ExchangeType = "D"
        ExchType = "D"

    }
    else if (signal.segment == 'CF' || signal.segment == 'cf' || signal.segment == 'CO' || signal.segment == 'co') {
        Exchange = "N";
        Exch = "N";

        ExchangeType = "U"
        ExchType = "U"

    }

   
    var OrderType;
    var BuySell;

    if (signal.type == 'LE' || signal.type == 'SX') {
        
         OrderType = "Buy";
         BuySell = "B"; 

    } else if (signal.type == 'SE' || signal.type == 'LX') {
        
         OrderType = "Sell";
         BuySell = "S"; 
    }


        var ClientCode = item.client_code;
        var key = item.api_key;
       
        var Qty =result[1][0].qty;
        var Price = "0";
        
        var ScripCode =instrument_token_symbol[0].instrument_token;
        var IsIntraday = false;
        var DisQty = 0;
        var StopLossPrice= 0;
        var IsStopLossOrder =false;
        var AppSource;
        var OrderRequesterCode = item.client_code;
        var RequestType = "P";
        
        var AtMarket = "false";
        var ExchOrderId = "0";
        var LimitPriceForSL = "0";
        var LimitPriceInitialOrder = "0";
        var TriggerPriceInitialOrder = "0";
        var LimitPriceProfitOrder = "0";
        var TriggerPriceForSL = "0";
        var TrailingSL = "0";
        var StopLoss = "0" 
        var OrderFor = "C";
        var UniqueOrderIDSL= "0";
        var UniqueOrderIDLimit = "0";
        var LocalOrderIDSL = "0";
        var LocalOrderIDLimit = "0";
        var PublicIP = "";
        var AppSource = "";
        var TradedQty = "0";


    if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' &&  result[1][0].product_type == '1') {
            
    }
   else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' &&  result[1][0].product_type == '1') {
             
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' &&  result[1][0].product_type == '1') {    
      
      Price = signal.price;     

    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' &&  result[1][0].product_type == '1') {
       
      Price = signal.price;  
    }

    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' &&  result[1][0].product_type == '1') {
       
        Price = signal.price;    
       
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' &&  result[1][0].product_type == '1') {
      
        Price = signal.price;
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '4' &&  result[1][0].product_type == '1') {

        Price = signal.price;
      
   }
   else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '4' &&  result[1][0].product_type == '1') {

    Price = signal.price;

  }
  
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' &&  result[1][0].product_type == '2') {
        IsIntraday = true;
        
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' &&  result[1][0].product_type == '2') {
        IsIntraday = true;
        
    } 
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' &&  result[1][0].product_type == '2') {

        IsIntraday = true;
        Price = signal.price;
     
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' &&  result[1][0].product_type == '2') {
        IsIntraday = true;
        Price = signal.price;
       
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' &&  result[1][0].product_type == '2') {
        IsIntraday = true;
        Price = signal.price;
           
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' &&  result[1][0].product_type == '2') {
        IsIntraday = true;
        Price = signal.price;
           
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '4' &&  result[1][0].product_type == '2') {
        IsIntraday = true;
        Price = signal.price;     
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '4' &&  result[1][0].product_type == '2') {
        IsIntraday = true;
        Price = signal.price;
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' && result[1][0].product_type == '4') {
       
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' && result[1][0].product_type == '4') {
      
    }

    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' && result[1][0].product_type == '4') {
      
      
        LimitPriceInitialOrder = signal.price;
        TriggerPriceInitialOrder = signal.tr_price;
        TrailingSL = signal.tsl;
        LimitPriceForSL = signal.sl_value;
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' && result[1][0].product_type == '4') {
        LimitPriceInitialOrder = signal.price;
        TriggerPriceInitialOrder = signal.tr_price;
        TrailingSL = signal.tsl;
        LimitPriceForSL = signal.sl_value;
    }
     else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' &&  result[1][0].product_type == '3') {
        IsIntraday = true;
        LimitPriceInitialOrder = signal.price;
        TriggerPriceInitialOrder = signal.tr_price;
        TrailingSL = signal.tsl;
        LimitPriceForSL = signal.sl_value;
        LimitPriceProfitOrder = signal.sq_value;
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' &&  result[1][0].product_type == '3') {
        IsIntraday = true;
        LimitPriceInitialOrder = signal.price;
        TriggerPriceInitialOrder = signal.tr_price;
        TrailingSL = signal.tsl;
        LimitPriceForSL = signal.sl_value;
        LimitPriceProfitOrder = signal.sq_value;
    } 
     else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' &&  result[1][0].product_type == '3') {
        IsIntraday = true;
        LimitPriceInitialOrder = signal.price;
        TriggerPriceInitialOrder = signal.tr_price;
        TrailingSL = signal.tsl;
        LimitPriceForSL = signal.sl_value;
        LimitPriceProfitOrder = signal.sq_value;
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' &&  result[1][0].product_type == '3') {
        IsIntraday = true;
        LimitPriceInitialOrder = signal.price;
        TriggerPriceInitialOrder = signal.tr_price;
        TrailingSL = signal.tsl;
        LimitPriceForSL = signal.sl_value;
        LimitPriceProfitOrder = signal.sq_value;
        
    }

    if (signal.type == 'SX' || signal.type == 'LX') {

        console.log('FIVE Paisa inside LX OR SX');
        data_possition = {
                    
            "head": {
                 "key": item.api_key
            },
            "body": {
                "ClientCode": item.client_code
            }
        
       }

                var config = {
                    method: 'post',
                    url: 'https://Openapi.5paisa.com/VendorsAPI/Service1.svc/V4/NetPosition',
                    headers: { 
                        'Authorization': 'Bearer '+ item.access_token , 
                        'Content-Type': 'application/json'
                      },
                    data: JSON.stringify(data_possition)
                };

                axios(config)
                    .then(function(response) {

                        response.data.body.NetPositionDetail.forEach(function(item1, index) {  

                            if(item1.ScripCode == ScripCode){

                                var possition_qty = item1.BuyQty - item1.SellQty;
                                 
                                connection.query('UPDATE `broker_response` SET `open_possition_qty`="' + possition_qty + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                    //console.log("err", err);
                                })

                                if((item1.BuyQty - item1.SellQty) > 0 && signal.type=='LX'){
                                    var url;
                                    if(result[1][0].product_type == '3' || result[1][0].product_type == '4'){

                                        url = 'https://Openapi.5paisa.com/VendorsAPI/Service1.svc/SMOOrderRequest';
                                     
                                        data11 =  {
                                            "head": {        
                                                "key": key
                                            },
                                            "body": {   
                                                "ClientCode": ClientCode,
                                                "OrderRequesterCode": OrderRequesterCode,
                                                "RequestType": RequestType,
                                                "BuySell": BuySell,
                                                "Qty": Qty,
                                                "Exch": Exch,
                                                "ExchType": ExchType,
                                                "DisQty": DisQty,
                                                "LimitPriceForSL":LimitPriceForSL,
                                                "LimitPriceInitialOrder": LimitPriceInitialOrder,
                                                "TriggerPriceInitialOrder":TriggerPriceInitialOrder,
                                                "LimitPriceProfitOrder": LimitPriceProfitOrder,
                                                "TriggerPriceForSL": TriggerPriceForSL,
                                                "TrailingSL": TrailingSL,
                                                "StopLoss": StopLoss,
                                                "ScripCode": ScripCode,
                                                "IsIntraday" : IsIntraday,
                                                "PublicIP": "",
                                               
                                            }
                                          };
                                    }else{
                                       
                                        url = 'https://openapi.5paisa.com/VendorsAPI/Service1.svc/V1/PlaceOrderRequest';
                                         
                                        data11  =  { 
                                            "head": {
        
                                                "key": key
                                            },
                                            "body": {   
                                            "ClientCode" : ClientCode,
                                            "Exchange" : Exchange,
                                            "ExchangeType" : ExchangeType, 
                                            "Qty" : Qty,
                                            "Price" : Price,
                                            "OrderType" : OrderType,
                                            "ScripCode" : ScripCode, 
                                            "IsIntraday" : IsIntraday,
                                            "DisQty" : DisQty,
                                            "StopLossPrice" : StopLossPrice,
                                            "IsStopLossOrder" : IsStopLossOrder
                                            }
                                        } ;
                                    }
                                   
                                    fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n Time - '+new Date()+' BEFORE 5 Paisha Place Oredr EXIT  =   client Username - ' + item.username + '  client id - '+ item.id + "\n\n" , function(err) {
                                        if(err) {
                                            return console.log(err);
                                        }
                                       });
                                    
                                    var config = {
                                        method: 'post',
                                        url: url,
                                                        
                                        headers: { 
                                            'Authorization': 'Bearer '+ item.access_token , 
                                            'Content-Type': 'application/json'
                                          },
                                        data: JSON.stringify(data11)
                                    };


                                    var send_rr = Buffer.from(qs.stringify(data11)).toString('base64');
                    
                                    var datetime = new Date();
                                    axios(config)
                                        .then(function(response) {
                                     
                                fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nTime - '+new Date()+' AFTER 5 Paisha Place Oredr Exit  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                                    if(err) {
                                        return console.log(err);
                                    }
                                    });

                                      var datetime = new Date();                    
                                      var send_rr = Buffer.from(qs.stringify(data11)).toString('base64');
                                    if(response.data.head.statusDescription == "Success"){
                    
                                       var data_order = {
                                        
                                            "head": {
                                                 "key": item.api_key
                                            },
                                            "body": {
                                                "ClientCode": item.client_code
                                            }
                                        
                                       }
                    
                                     var config1 = {
                                      method: 'post',
                                      url: 'https://Openapi.5paisa.com/VendorsAPI/Service1.svc/V2/OrderBook',
                                      headers: { 
                                        'Authorization': 'Bearer '+ item.access_token , 
                                        'Content-Type': 'application/json'
                                      },
                    
                                    data: JSON.stringify(data_order)
                    
                                            };
                                            axios(config1)
                                            .then(function(response1) {
                                              
                                               response1.data.body.OrderBookDetail.forEach(function(item2, index) {
                                          
                                               if(item2.BrokerOrderId == response.data.body.BrokerOrderID){
                                            

                                                connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+response.data.body.BrokerOrderID+'" ,`order_status`="'+item2.OrderStatus+'" ,`reject_reason`="'+item2.Reason+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                    //console.log("err", err);
                                                });
                    
                    
                    
                                                connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"BUY","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data.body.BrokerOrderID + ',"' + get_date() + '","",' + signal.id + ',"' + item2.OrderStatus + '","'+last_signal_id+'","'+signal.type+'")', (err, client_transaction) => {
                                                    //console.log(err);
                                                });    
                    
                                              }
                    
                    
                                             }) 
                    
                    
                                            })
                                            .catch(function(error_broker) {
                                                 console.log('error_broker -', error_broker);
                                            });
                    
                                        }else{
                                        
                                            const message = (JSON.stringify(response.data)).replace(/["',]/g, '');

                                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                //console.log("err", err);
                                            });
                    
                                        }
                    
                                        })
                                        .catch(function(error_p) {
                                            console.log('place order errror ',error_p);

                                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n5 Paisha Place Oredr Exit Catch  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit Catch -'+JSON.stringify(error_p.response.data)+ "\n\n" , function(err) {
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
                                else if((item1.BuyQty - item1.SellQty) < 0 && signal.type=='SX'){
                                     var url;
                                    if(result[1][0].product_type == '3' || result[1][0].product_type == '4'){
                                    
                                        url = 'https://Openapi.5paisa.com/VendorsAPI/Service1.svc/SMOOrderRequest';

                                        data11 =  {
                                            "head": {        
                                                "key": key
                                            },
                                            "body": {   
                                                "ClientCode": ClientCode,
                                                "OrderRequesterCode": OrderRequesterCode,
                                                "RequestType": RequestType,
                                                "BuySell": BuySell,
                                                "Qty": Qty,
                                                "Exch": Exch,
                                                "ExchType": ExchType,
                                                "DisQty": DisQty,
                                                "LimitPriceForSL":LimitPriceForSL,
                                                "LimitPriceInitialOrder": LimitPriceInitialOrder,
                                                "TriggerPriceInitialOrder":TriggerPriceInitialOrder,
                                                "LimitPriceProfitOrder": LimitPriceProfitOrder,
                                                "TriggerPriceForSL": TriggerPriceForSL,
                                                "TrailingSL": TrailingSL,
                                                "StopLoss": StopLoss,
                                                "IsIntraday" : IsIntraday,
                                                "ScripCode": ScripCode,
                                                "PublicIP": "",
                                               
                                            }
                                          };
                                    }else{
                                       
                                        url = 'https://openapi.5paisa.com/VendorsAPI/Service1.svc/V1/PlaceOrderRequest';

                                        data11  =  { 
                                            "head": {
        
                                                "key": key
                                            },
                                            "body": {   
                                            "ClientCode" : ClientCode,
                                            "Exchange" : Exchange,
                                            "ExchangeType" : ExchangeType, 
                                            "Qty" : Qty,
                                            "Price" : Price,
                                            "OrderType" : OrderType,
                                            "ScripCode" : ScripCode, 
                                            "IsIntraday" : IsIntraday,
                                            "DisQty" : DisQty,
                                            "StopLossPrice" : StopLossPrice,
                                            "IsStopLossOrder" : IsStopLossOrder
                                            }
                                        } ;
                                    }

                                    fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n Time - '+new Date()+' BEFORE 5 Paisha Place Oredr EXIT  =   client Username - ' + item.username + '  client id - '+ item.id + "\n\n" , function(err) {
                                        if(err) {
                                            return console.log(err);
                                        }
                                       });

                                    var config = {
                                        method: 'post',
                                        url: url,
                                    
                    
                                        headers: { 
                                            'Authorization': 'Bearer '+ item.access_token , 
                                            'Content-Type': 'application/json'
                                          },
                                        data: JSON.stringify(data11)
                                    };

                                    var send_rr = Buffer.from(qs.stringify(data11)).toString('base64');
                    
                                    var datetime = new Date();
                                    console.log("ordertime1", datetime);
                                    axios(config)
                                        .then(function(response) {

                                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nTime - '+new Date()+' AFTER 5 Paisha Place Oredr Exit   =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit  -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                                                if(err) {
                                                    return console.log(err);
                                                }
                                                });


                                            var datetime = new Date();              
                                            var send_rr = Buffer.from(qs.stringify(data11)).toString('base64');
                    
                                      if(response.data.head.statusDescription == "Success"){
                    
                                        console.log("response -Five paisa broker id ", response.data.body.Message);
                    
                                       var data_order = {
                                        
                                            "head": {
                                                 "key": item.api_key
                                            },
                                            "body": {
                                                "ClientCode": item.client_code
                                            }
                                        
                                       }
                    
                                     var config1 = {
                                      method: 'post',
                                      url: 'https://Openapi.5paisa.com/VendorsAPI/Service1.svc/V2/OrderBook',
                                      headers: { 
                                        'Authorization': 'Bearer '+ item.access_token , 
                                        'Content-Type': 'application/json'
                                      },
                    
                                    data: JSON.stringify(data_order)
                    
                                            };
                                            axios(config1)
                                            .then(function(response1) {
                                            
                                              response1.data.body.OrderBookDetail.forEach(function(item2, index) {
                                          
                                               if(item2.BrokerOrderId == response.data.body.BrokerOrderID){

                                                connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+response.data.body.BrokerOrderID+'" ,`order_status`="'+item2.OrderStatus+'" ,`reject_reason`="'+item2.Reason+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                    //console.log("err", err);
                                                });
                    
                    
                    
                                                connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"BUY","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data.body.BrokerOrderID + ',"' + get_date() + '","",' + signal.id + ',"' + item2.OrderStatus + '","'+last_signal_id+'","'+signal.type+'")', (err, client_transaction) => {
                                                    //console.log(err);
                                                });    
                    
                                              }
                    
                    
                                             }) 
                    
                    
                                            })
                                            .catch(function(error_broker) {
                                                 console.log('error_broker -', error_broker);
                                            });
                    
                                        }else{
                                        

                                            const message = (JSON.stringify(response.data)).replace(/["',]/g, '');

                                                connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                    //console.log("err", err);
                                                });
                    
                                        }
                    
                                        })
                                        .catch(function(error_p) {
                                            //console.log('place order errror ',error_p);
                                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n5 Paisha Place Oredr Exit Catch   =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit Catch  -'+JSON.stringify(error_p.response.data)+ "\n\n" , function(err) {
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
                            
                            }else{
                                data = '';
                                return data;
                            }
                        })    

                    })
                    .catch(function(error) {

                    });
           
        
    } else {
        if(result[1][0].product_type == '3' || result[1][0].product_type == '4'){
            return_data =  {
                "head": {        
                    "key": key
                },
                "body": {   
                    "ClientCode": ClientCode,
                    "OrderRequesterCode": OrderRequesterCode,
                    "RequestType": RequestType,
                    "BuySell": BuySell,
                    "Qty": Qty,
                    "Exch": Exch,
                    "ExchType": ExchType,
                    "DisQty": DisQty,
                    "LimitPriceForSL":LimitPriceForSL,
                    "LimitPriceInitialOrder": LimitPriceInitialOrder,
                    "TriggerPriceInitialOrder":TriggerPriceInitialOrder,
                    "LimitPriceProfitOrder": LimitPriceProfitOrder,
                    "TriggerPriceForSL": TriggerPriceForSL,
                    "TrailingSL": TrailingSL,
                    "StopLoss": StopLoss,
                    "ScripCode": ScripCode,
                    "IsIntraday" : IsIntraday,
                    "PublicIP": "",
                   
                }
              };
        }else{
            return_data  =  { 

                "head": {
        
                    "key": key
                },
                "body": {   
                "ClientCode" : ClientCode,
                "Exchange" : Exchange,
                "ExchangeType" : ExchangeType, 
                "Qty" : Qty,
                "Price" : Price,
                "OrderType" : OrderType,
                "ScripCode" : ScripCode,
                "IsIntraday" : IsIntraday, 
                "DisQty" : DisQty,
                "StopLossPrice" : StopLossPrice,
                "IsStopLossOrder" : IsStopLossOrder
                }
            } ;
        }


        return return_data;
    }




}catch (e) {
    console.log('Fivepaisa Inside Get Order',e);
  }
}

module.exports = { place_order, access_token }