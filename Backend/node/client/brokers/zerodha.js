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




const place_order = (item, signal, connection ,last_signal_id,connection2,bro_res_last_id,filePath) => {

   try{
    // console.log('zerodha Inside');

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

         // Broker Response Token

       if(signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'F' || signal.segment == 'f' || signal.segment == 'FO' || signal.segment == 'fo'){

        var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Strike : "+signal.strike+" , option_type :"+signal.option_type+" , TradeSymbol : "+instrument_token_symbol[0].tradesymbol_m_w +" , Token : "+instrument_token_symbol[0].instrument_token+"]";

        var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
        connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="ZERODHA" WHERE `id`=' + bro_res_last_id, (err, result) => {
           // console.log("err update token", err);
        });

      }else if(signal.segment == 'C' || signal.segment == 'c'){

        var symbolCash = instrument_token_symbol[0].service;
        var tradingsymbolCash = symbolCash.slice(0, -1)
        tradingsymbol111=tradingsymbolCash;

        var signal_sy = "[symbol : "+ signal.input_symbol +" , TradeSymbol : "+tradingsymbol111+" , Token : "+instrument_token_symbol[0].instrument_token+"]";

        var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64'); 
         connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="ZERODHA" WHERE `id`=' + bro_res_last_id, (err, result) => {
           // console.log("err update token", err);
        });


      }else{

        var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +" , TradeSymbol : "+instrument_token_symbol[0].tradesymbol_m_w +" , Token : "+instrument_token_symbol[0].instrument_token+"]";

        var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
        connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="ZERODHA" WHERE `id`=' + bro_res_last_id, (err, result) => {
            //console.log("err update token", err);
        });


      }

    }else{
     
        if(signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'F' || signal.segment == 'f' || signal.segment == 'FO' || signal.segment == 'fo'){

            var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Strike : "+signal.strike+" , option_type :"+signal.option_type+" , TradeSymbol : NULL , Token : NULL]";
    
            var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

            connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="ZERODHA" WHERE `id`=' + bro_res_last_id, (err, result) => {
                //console.log("err update token", err);
            });
    
          }else{
    
            var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +" , TradeSymbol : NULL , Token : NULL]";
    
            var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

            connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="ZERODHA" WHERE `id`=' + bro_res_last_id, (err, result) => {
               // console.log("err update token", err);
            });
    
       }

    }




        if (result[1].length > 0 || result[0].length > 0) {

            var data = get_orderdata(item, signal, result, connection ,last_signal_id,instrument_token_symbol,bro_res_last_id,filePath);
          
        
          var send_rr = '';
            if (data !== undefined) {

                fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n time - '+new Date()+' BEFORE Zerodha Place Oredr Entry  =   client Username - ' + item.username + '  client id - '+ item.id + "\n\n" , function(err) {
                    if(err) {
                        return console.log(err);
                    }
                   });

                send_rr = Buffer.from(data).toString('base64');

                var config = {
                    method: 'post',
                    url: 'https://api.kite.trade/orders/regular',             
                    headers: { 
                        'Authorization': 'token '+item.api_key+':'+item.access_token
                      },
                    data: data
                };

                var datetime = new Date();
              
                axios(config)
                    .then(function(response) {

                       
                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n Time - '+new Date()+' AFTER Zerodha Place Oredr Entry  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                            if(err) {
                                return console.log(err);
                            }
                           });


                        var datetime = new Date();

                


                        connection.query('INSERT INTO `broker_response`(`reject_reason`,`order_id`,`created_at`) VALUES ("' + response.data + '","' +item.id+ '","' + get_date() + '")', (err1, signal_status) => {
                             console.log('eroor query -',err1);
                          });


                          
                    
                var send_rr = Buffer.from(data).toString('base64');

                  if(response.data.status == "success"){

                 var order_id =  response.data.data.order_id;
                 

                 var config1 = {
                  method: 'get',
                  url: 'https://api.kite.trade/orders/'+response.data.data.order_id,
                  headers: { 
                    'Authorization': 'token '+item.api_key+':'+item.access_token
                  }
                      };
                        axios(config1)
                        .then(function(response1) {

                            let lastElement = response1.data.data[response1.data.data.length - 1];
                            
                        connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+response.data.data.order_id+'" ,`order_status`="'+lastElement.status+'" ,`reject_reason`="'+lastElement.status_message+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                            //console.log("err", err);
                        });



                            connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"BUY","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data.data.order_id + ',"' + get_date() + '","",' + signal.id + ',"' + lastElement.status + '","'+last_signal_id+'","'+signal.type+'")', (err, client_transaction) => {
                                //console.log(err);
                            });    


                        })
                        .catch(function(error_broker) {
                            // console.log('error_broker -', error_broker);
                        });

                    }else{
                    
                        const message = (JSON.stringify(response.data)).replace(/["',]/g, '');

                        connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                            //console.log("err", err);
                        });


                    }



                    })
                    .catch(function(error_placeorder) {

                       
                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nZerodha Place Oredr Entry Catch =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry Catch -'+JSON.stringify(error_placeorder.response.data)+ "\n\n" , function(err) {
                            if(err) {
                                return console.log(err);
                            }
                           });


                           const message = (JSON.stringify(error_placeorder.response.data)).replace(/["',]/g, '');

                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                //console.log("err", err);
                            });

                        

                      if(error_placeorder != null){ 

                        try{
                      if(error_placeorder.response.data.status == "error"){
                         try{
                        connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_status`="'+error_placeorder.response.data.status+'" ,`reject_reason`="'+error_placeorder.response.data.message+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                            //console.log("err", err);
                        });

                    }catch (e) {
                        console.log('Zerodha Token Symbol',e);
                      }

                       }

                    }catch (e) {
                        console.log('Zerodha order',e);
                      }
                    }

                    });
            }
        }
  
    }catch (e) {
        console.log('Zerodha Instrument Query',e);
      }
  
    });

}catch (e) {
    console.log('Zerodha Token Symbol',e);
  }

});
}catch (e) {
    console.log('Zerodha Place order',e);
  }
}

const get_orderdata = (item, signal, result, connection ,last_signal_id,instrument_token_symbol,bro_res_last_id,filePath) => {
    // console.log(result);
     
    try{

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

   
    var transaction_type;

    if (signal.type == 'LE' || signal.type == 'SX') {
        transaction_type = 'BUY';
    } else if (signal.type == 'SE' || signal.type == 'LX') {
        transaction_type = 'SELL';
    }


    var tradingsymbol;
    tradingsymbol=instrument_token_symbol[0].tradesymbol_m_w;
        

        if (signal.segment == 'C' || signal.segment == 'c') {
            var symbolCash = instrument_token_symbol[0].service;
            var tradingsymbolCash = symbolCash.slice(0, -1)
            tradingsymbol=tradingsymbolCash;
         }    


     if (signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'F' || signal.segment == 'f') {
        tradingsymbol=instrument_token_symbol[0].tradesymbol_m_w;
         } 

    
      var  order_type;
      var quantity = result[1][0].qty;
      var  product;
      var price = 0;
      var  validity="DAY";  
      var trigger_price = 0;  
      var  instrument_token = instrument_token_symbol[0].instrument_token;
         

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

        order_type = 'SL-M';
        price = signal.price;
        product = 'CNC'; 
        trigger_price = signal.tr_price;
        
   }
   else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '4' &&  result[1][0].product_type == '1') {

    order_type = 'SL-M';
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
        trigPrice = signal.tr_price;
        
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' &&  result[1][0].product_type == '2') {
        order_type = 'SL';
        price = signal.price;
        product = 'MIS';
        trigPrice = signal.tr_price;
         
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '4' &&  result[1][0].product_type == '2') {

        order_type = 'SL-M';
        price = signal.price;
        product = 'MIS';
        trigPrice = signal.tr_price;
        
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '4' &&  result[1][0].product_type == '2') {

        order_type = 'SL-M';
        price = signal.price;
        product = 'MIS';
        trigPrice = signal.tr_price;
         
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' && result[1][0].product_type == '4') {
        order_type = 'MARKET';
        product = 'MIS';
         
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' && result[1][0].product_type == '4') {
        order_type = 'MARKET';
        product = 'MIS';
        
    }

    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' && result[1][0].product_type == '4') {
        order_type = 'LIMIT';
        product = 'MIS';
        price = signal.price;
        trigPrice = signal.tr_price;
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' && result[1][0].product_type == '4') {
        order_type = 'LIMIT';
        product = 'MIS';
        price = signal.price;
        trigPrice = signal.tr_price;
        
    }
     else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' &&  result[1][0].product_type == '3') {

      //  console.log('order BO')
        order_type = 'LIMIT';
        price = signal.price;
        product = 'MIS';
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' &&  result[1][0].product_type == '3') {
        order_type = 'LIMIT';
        price = signal.price;
        product = 'MIS';
        
    } 
     else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' &&  result[1][0].product_type == '3') {

        order_type = 'SL';
        price = signal.price;
        product = 'MIS';
       
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' &&  result[1][0].product_type == '3') {

        order_type = 'SL';
        price = signal.price;
        product = 'MIS';
        
    }



    if(result[1][0].product_type == '1'){
        if (signal.segment == 'F' || signal.segment == 'f' || signal.segment == 'O' || signal.segment == 'o') {
            product = "NRML";
            }   
    }

    

    if (signal.type == 'SX' || signal.type == 'LX') {
 
                var config = {
                  method: 'get',
                  url: 'https://api.kite.trade/portfolio/positions',
                  headers: { 
                    'Authorization': 'token '+item.api_key+':'+item.access_token
                  }
                };

                axios(config)
                    .then(function(response) {
                     response.data.data.net.forEach(function(item1, index) {
            
               if(item1.tradingsymbol == tradingsymbol){
                
                 var possition_qty =item1.buy_quantity - item1.sell_quantity;
                                 
                 connection.query('UPDATE `broker_response` SET `open_possition_qty`="' + possition_qty + '" WHERE `id`=' + bro_res_last_id, (err, result_p) => {
                     //console.log("err", err);
                 })


           if((item1.buy_quantity - item1.sell_quantity) > 0 && signal.type=='LX'){

               data11  =  'tradingsymbol='+tradingsymbol+'&exchange='+exchange+'&transaction_type='+transaction_type+'&quantity='+quantity+'&order_type='+order_type+'&product='+product+'&price='+price+'&trigger_price='+trigger_price+'&validity='+validity;
               send_rr = Buffer.from(data11).toString('base64');

               fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n time - '+new Date()+' BEFORE Zerodha Place Oredr EXIT  =   client Username - ' + item.username + '  client id - '+ item.id + "\n\n" , function(err) {
                if(err) {
                    return console.log(err);
                }
               });

                var config = {
                    method: 'post',
                    url: 'https://api.kite.trade/orders/regular',             
                    headers: { 
                        'Authorization': 'token '+item.api_key+':'+item.access_token
                      },
                    data: data11
                };

                var datetime = new Date();
                axios(config)
                    .then(function(response) {

                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nTime - '+new Date()+' AFTER Zerodha Place Oredr Exit =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                            if(err) {
                                return console.log(err);
                            }
                           });

                        var datetime = new Date();
                     

                        connection.query('INSERT INTO `broker_response`(`reject_reason`,`order_id`,`created_at`) VALUES ("' + response.data + '","' +item.id+ '","' + get_date() + '")', (err1, signal_status) => {
                          console.log('eroor query -',err1);
                          });
                        

                  //var send_rr = Buffer.from(data11).toString('base64');
                 if(response.data.status == "success"){

                 var order_id =  response.data.data.order_id;
                 var config1 = {
                  method: 'get',
                  url: 'https://api.kite.trade/orders/'+response.data.data.order_id,
                  headers: { 
                    'Authorization': 'token '+item.api_key+':'+item.access_token
                  }
                      };
                        axios(config1)
                        .then(function(response1) {
                         let lastElement = response1.data.data[response1.data.data.length - 1];

                          connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+response.data.data.order_id+'" ,`order_status`="'+lastElement.status+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                            console.log("err zerodha orderhistory", err);
                           });


                            connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"SELL","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data.data.order_id + ',"' + get_date() + '","",' + signal.id + ',"' + lastElement.status + '","'+last_signal_id+'","'+signal.type+'")', (err, client_transaction) => {
                                //console.log(err);
                            });    


                        })
                        .catch(function(error_broker) {
                            // console.log('error_broker -', error_broker);
                        });

                    }else{

                        const message = (JSON.stringify(response.data)).replace(/["',]/g, '');

                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                //console.log("err", err);
                            });

                    }



                    })
                    .catch(function(error_placeorder) {

                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nZerodha Place Oredr Exit Catch =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit Catch -'+JSON.stringify(error_placeorder.response.data)+ "\n\n" , function(err) {
                            if(err) {
                                return console.log(err);
                            }
                           });


                           const message = (JSON.stringify(error_placeorder.response.data)).replace(/["',]/g, '');

                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                //console.log("err", err);
                            });
            
                     //  console.log('error_placeorder -',error_placeorder);

                         try{

                      if(error_placeorder != null){ 

                      if(error_placeorder.response.data.status == "error"){
                        try{

                        connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_status`="'+error_placeorder.response.data.status+'" ,`reject_reason`="'+error_placeorder.response.data.message+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                           //console.log("err", err);
                         });
                        }catch (e) {
                            console.log('Zerodha order',e);
                          }

                       }
                    }
                }catch (e) {
                    console.log('Zerodha order',e);
                  }

                    });


                                           
                    
                       data = '';
                       return data;   


                                }
                                else if((item1.buy_quantity - item1.sell_quantity) < 0 && signal.type=='SX'){
                                     
                                    data11  =  'tradingsymbol='+tradingsymbol+'&exchange='+exchange+'&transaction_type='+transaction_type+'&quantity='+quantity+'&order_type='+order_type+'&product='+product+'&price='+price+'&trigger_price='+trigger_price+'&validity='+validity;
                                   
                                    fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n time - '+new Date()+' BEFORE Zerodha Place Oredr EXIT  =   client Username - ' + item.username + '  client id - '+ item.id + "\n\n" , function(err) {
                                        if(err) {
                                            return console.log(err);
                                        }
                                       });

                                    send_rr = Buffer.from(data11).toString('base64');

                                    var config = {
                                        method: 'post',
                                        url: 'https://api.kite.trade/orders/regular',             
                                        headers: { 
                                            'Authorization': 'token '+item.api_key+':'+item.access_token
                                          },
                                        data: data11
                                    };
                    
                                    var datetime = new Date();
                                    axios(config)
                                        .then(function(response) {


                                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n Time - '+new Date()+' AFTER Zerodha Place Oredr Exit =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                                                if(err) {
                                                    return console.log(err);
                                                }
                                               });



                                    var datetime = new Date();
                                   // var send_rr = Buffer.from(data11).toString('base64');
                                  

                                    connection.query('INSERT INTO `broker_response`(`reject_reason`,`order_id`,`created_at`) VALUES ("' + response.data + '","' +item.id+ '","' + get_date() + '")', (err1, signal_status) => {
                                          console.log('eroor query -',err1);
                                      });

                                      
                    
                                      if(response.data.status == "success"){
                                      var order_id =  response.data.data.order_id;
                                  var config1 = {
                                      method: 'get',
                                      url: 'https://api.kite.trade/orders/'+response.data.data.order_id,
                                      headers: { 
                                        'Authorization': 'token '+item.api_key+':'+item.access_token
                                      }
                                          };
                                            axios(config1)
                                            .then(function(response1) {                
                    
                                                let lastElement = response1.data.data[response1.data.data.length - 1];
                                                 
                                                console.log('last ELement -',lastElement);

                                                connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+response.data.data.order_id+'" ,`order_status`="'+lastElement.status+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                    console.log("err zerodha orderhistory", err);
                                                });
                    
                    
                    
                                                connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"SELL","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data.data.order_id + ',"' + get_date() + '","",' + signal.id + ',"' + lastElement.status + '","'+last_signal_id+'","'+signal.type+'")', (err, client_transaction) => {
                                                    //console.log(err);
                                                });    
                    
                    
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
                                        .catch(function(error_placeorder) {

                                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nZerodha Place Oredr Exit Catch =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit Catch -'+JSON.stringify(error_placeorder.response.data)+ "\n\n" , function(err) {
                                                if(err) {
                                                    return console.log(err);
                                                }
                                               });


                                             const message = (JSON.stringify(error_placeorder.response.data)).replace(/["',]/g, '');

                                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                //console.log("err", err);
                                            });


                                           


                                          if(error_placeorder != null){ 
                                          if(error_placeorder.response.data.status == "error"){
                                                                            
                                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_status`="'+error_placeorder.response.data.status+'" ,`reject_reason`="'+error_placeorder.response.data.message+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                //console.log("err", err);
                                            });


                                           }
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
                    .catch(function(es) {
                       // console.log('inside - LX  possition - ',es);
                    });
           
        
    } else {
       
      return_data  =  'tradingsymbol='+tradingsymbol+'&exchange='+exchange+'&transaction_type='+transaction_type+'&quantity='+quantity+'&order_type='+order_type+'&product='+product+'&price='+price+'&trigger_price='+trigger_price+'&validity='+validity;
        


        return return_data;
    }

}catch (e) {
    console.log('Zerodha Get Order',e);
  }


}

module.exports = { place_order, access_token }