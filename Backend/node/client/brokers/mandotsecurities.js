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
    // console.log(instrument_query);
    // console.log('result ss1 '  , result[0]) ;  
    //  console.log('result ss 2'  , result[1]) ;  
     try{

     if(result[0].length > 0 || result[1].length > 0){


       //Broker Response print Token
       if(signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'F' || signal.segment == 'f' || signal.segment == 'FO' || signal.segment == 'fo'){

        var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Strike : "+signal.strike+" , option_type :"+signal.option_type+" , TradeSymbol : "+instrument_token_symbol[0].tradesymbol_m_w +" , Token : "+instrument_token_symbol[0].instrument_token+"]";

        var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

        connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="Mandot" WHERE `id`=' + bro_res_last_id, (err, result) => {
           // console.log("err update token", err);
        })



      }else if(signal.segment == 'C' || signal.segment == 'c'){

        var signal_sy = "[symbol : "+ signal.input_symbol +" , TradeSymbol : "+instrument_token_symbol[0].zebu_token+" , Token : "+instrument_token_symbol[0].instrument_token+"]";

        var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
    
        connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="Mandot" WHERE `id`=' + bro_res_last_id, (err, result) => {
            //console.log("err", err);
        })


      }else{

        var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +" , TradeSymbol : "+instrument_token_symbol[0].tradesymbol +" , Token : "+instrument_token_symbol[0].instrument_token+"]";

        var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
      
        connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="Mandot" WHERE `id`=' + bro_res_last_id, (err, result) => {
            //console.log("err", err);
        })


      }

    }else{
     
        if(signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'F' || signal.segment == 'f' || signal.segment == 'FO' || signal.segment == 'fo'){

            var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Strike : "+signal.strike+" , option_type :"+signal.option_type+" , TradeSymbol : NULL , Token : NULL]";
    
            var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

            connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="Mandot" WHERE `id`=' + bro_res_last_id, (err, result) => {
                //console.log("err", err);
            })
    
          }else{
    
            var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +" , TradeSymbol : NULL , Token : NULL]";
    
            var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

            connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="Mandot" WHERE `id`=' + bro_res_last_id, (err, result) => {
                //console.log("err", err);
            })
    
    
          }
  

    }

    
         




        //console.log(err);
        if (result[1].length > 0 || result[0].length > 0) {

            var data = get_orderdata(item, signal, result, connection ,last_signal_id,instrument_token_symbol,bro_res_last_id,filePath);
            console.log('Mandot Entry New ',data)
          //  return
            if (data !== undefined) {
                var send_rr = Buffer.from(JSON.stringify(data)).toString('base64');
               
                var config = {
                    method: 'post',
                    url: 'http://sandboxtrade.mandotsecurities.com:3333/NewOrderRequest',
                    headers: { 
                        'Authorization': item.access_token
                      },
                    data : data
                  };
                  
                  axios(config)
                  .then(function (response) {
                  //  console.log(JSON.stringify(response.data.response.data.gorderid));
                  fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\Mandot Place Oredr Entry  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                    if(err) {
                        return console.log(err);
                    }
                   });
                  
                    if(response.data.response.data.ErrorCode == 0){
                    var orderid = response.data.response.data.gorderid;        
                
                    var config1 = {
                        method: 'get',
                        url: 'http://sandboxtrade.mandotsecurities.com:3333/getOrderBookDetailWithLegV2?exchangeType=ALL&ClientCode='+item.client_code+'&Order_Status=ALL&Ordertype=ALL&gscid='+item.api_key,
                        headers: { 
                          'Authorization': item.access_token
                        }
                      };
                      
                      axios(config1)
                      .then(function (response1) {
                       
                        if(response1.data.ErrorCode == 0){
                        response1.data.data.forEach(element => {
                            console.log('console uniqueID -',element.ordID); 
                            if(element.ordID == orderid){
                
                            console.log('console book type -',element.BookType);
                            console.log('console LogTime -',element.LogTime);
                            console.log('console ordID -',element.ordID);
                            console.log('console status -',element.status);


                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+orderid+'" ,`order_status`="'+element.status+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                console.log("err", err);
                            });



                            connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"BUY","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + orderid + ',"' + get_date() + '","",' + signal.id + ',"' + element.status + '","'+last_signal_id+'","'+signal.type+'")', (err, client_transaction) => {
                                //console.log(err);
                            });    



                
                            }
                         
                        });
                       }
                
                      })
                      .catch(function (error) {
                        console.log(error);
                
                      });
                  
                
                    }else{
                
                
                    }
                
                
                
                
                
                
                  })
                  .catch(function (error) {
                    console.log('sss -',error.response);
                    fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\Mandot Place Oredr Entry Catch =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry catch -'+JSON.stringify(error.response)+ "\n\n" , function(err) {
                        if(err) {
                            return console.log(err);
                        }
                       });
                
                    if(error.response == undefined){
                        console.log('Mandot Server Connection Error');
                        connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`reject_reason`="Mandot Connection Close" WHERE `id`=' + bro_res_last_id, (err, result) => {
                            console.log("errcc", err);
                        });
                    }
                
                  });
                   
            }
        }
  
    }catch (e) {
        console.log('Mandot Query',e);
      }
    });
}catch (e) {
    console.log('Mandot Token Symbol',e);
  }

});

}catch (e) {
    console.log('Mandot Inside Placeorder',e);
  }
}

const get_orderdata = (item, signal, result, connection ,last_signal_id,instrument_token_symbol,bro_res_last_id,filePath) => {

   try{
 
    var is_reject = false;
    var exchange;
    if (signal.segment == 'C' || signal.segment == 'c') {
        exchange = 2;
    } else if (signal.segment == 'F' || signal.segment == 'f' || signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo') {
        exchange = 2;
    } else if (signal.segment == 'MF' || signal.segment == 'mf' || signal.segment == 'MO' || signal.segment == 'mo') {
        exchange = 3;
    }
    else if (signal.segment == 'CF' || signal.segment == 'cf' || signal.segment == 'CO' || signal.segment == 'co') {
        exchange = 5;
    }

   
    var side;

    if (signal.type == 'LE' || signal.type == 'SX') {
        side = 1;
    } else if (signal.type == 'SE' || signal.type == 'LX') {
        side = 2;
    }



    var trigger_price= 0;
    var gtoken= instrument_token_symbol[0].instrument_token;
    //var side= 1;
    var gcid= item.client_code;
    var validity= 0;
    var price= 0;
    var disclosed_qty= 0;
   // var lot= 1;
    var order_type= 1;
    var product= 0;
    var qty= result[1][0].qty;
   // var corderid= 3;
   // var amo= 0;
    var gtdExpiry= 0;
    //var is_post_closed= 0;
    //var is_preopen_order= 0;
    var isSqOffOrder= false;
    var offline= 0;

    var response_format = "json";
    var request_type = "subscribe";
    var streaming_type = "NewOrderRequest";

        // if (signal.segment == 'C' || signal.segment == 'c') {
        //     trading_symbol=instrument_token_symbol[0].zebu_token;
        //  }    
         
          
        //  if (signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'F' || signal.segment == 'f') {
        //     trading_symbol=instrument_token_symbol[0].tradesymbol_m_w;
        //    } 

        

  if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' &&  result[1][0].product_type == '1') {
       
        order_type = 2;
        product = 0;  
         
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' &&  result[1][0].product_type == '1') {
        order_type = 2;
        product = 0;      
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' &&  result[1][0].product_type == '1') {
        order_type = 1;
        price = signal.price;
        product = 0;
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' &&  result[1][0].product_type == '1') {
        order_type = 1;
        price = signal.price;
        product = 0;
    
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' &&  result[1][0].product_type == '1') {
      
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' &&  result[1][0].product_type == '1') {
     
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '4' &&  result[1][0].product_type == '1') {

      
   }
   else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '4' &&  result[1][0].product_type == '1') {

 
   }
  
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' &&  result[1][0].product_type == '2') {
        order_type = 2;
        product = 1;
        
        
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' &&  result[1][0].product_type == '2') {
        order_type = 2;
        product = 1;
        
        
    } 
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' &&  result[1][0].product_type == '2') {

        order_type = 1;
        price = signal.price;
        product = 1;

    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' &&  result[1][0].product_type == '2') {

        order_type = 1;
        price = signal.price;
        product = 1;
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' &&  result[1][0].product_type == '2') {
      
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' &&  result[1][0].product_type == '2') {
     
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '4' &&  result[1][0].product_type == '2') {

        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '4' &&  result[1][0].product_type == '2') {

        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' && result[1][0].product_type == '4') {
    
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' && result[1][0].product_type == '4') {

    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' && result[1][0].product_type == '4') {
   
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' && result[1][0].product_type == '4') {
    
    }
     else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' &&  result[1][0].product_type == '3') {

    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' &&  result[1][0].product_type == '3') {
    
    } 
     else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' &&  result[1][0].product_type == '3') {
   
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' &&  result[1][0].product_type == '3') {
   
    }


    if(result[1][0].product_type == '1'){
        if (signal.segment == 'F' || signal.segment == 'f' || signal.segment == 'O' || signal.segment == 'o') {
            pCode = "NRML";
            }   
      }
     


    if (signal.type == 'SX' || signal.type == 'LX') {
       // console.log('inside Lxxx ');
       //console.log('inside Lxxx -',bro_res_last_id);   
       var data_possition = JSON.stringify({
        "request": {
          "FormFactor": "M",
          "data": {
            "gscid": item.api_key
                },
          "svcGroup": "portfolio",
          "svcVersion": "1.0.0",
          "streaming_type": "NPDetailRequest",
          "request_type": "subscribe"
            }
        });
                var config = {
                    method: 'post',
                    url: 'http://sandboxtrade.mandotsecurities.com:3333/NPDetailRequest',
                    headers: { 
                        'Authorization': item.access_token,
                        'Content-Type': 'application/json' 
                      },
                    data: data_possition
                };

                axios(config)
                    .then(function(response) {
                        console.log('possition response',response);     
                        console.log('possition response',response.data.response.data.stockDetails);     
                        console.log('possition response 1',response.data.response.data.stockDetails);     
                        
                      
                        response.data.response.data.stockDetails.forEach(function(item1, index) {

                            console.log('item1' ,item1.token)
                            var token_new1 = item1.token.substring(4);
                            var token_new2  = parseInt(token_new1);
                            var token_new3 = token_new2.toString()
                            
                            
                            
                           
                            

                             if(token_new3 == gtoken){
                              console.log('gtoken ',gtoken);
                              
                              var possition_qty =item1.buyQty - item1.sellQty;
                              
                              console.log('possition_qty ',possition_qty);
                          
                               //  console.log('possition_qty ',possition_qty);      
                          connection.query('UPDATE `broker_response` SET `open_possition_qty`="' + possition_qty + '" WHERE `id`=' + bro_res_last_id, (err11, result_p) => {
                                   // console.log("possition broker_response ", err11);
                          }); 

                         
                            if((item1.buyQty - item1.sellQty) > 0 && signal.type=='LX'){
                                   //  console.log('insside eee',symbol_id);
                                   // console.log('result  eee',result[1][0].product_type);
                                    
                                   data11  = {
                                    "request": {
                                      "data": {
                                        "trigger_price":trigger_price,
                                        "gtoken":gtoken,
                                        "side":side,
                                        "gcid":gcid,
                                        "validity":validity,
                                        "price":price,
                                        "exchange":exchange,
                                        "disclosed_qty":disclosed_qty,
                                       // "lot":lot,
                                        "order_type":order_type,
                                        "product":product,
                                        "qty":qty,
                                       // "corderid":corderid,
                                       // "amo":amo,
                                        "gtdExpiry":gtdExpiry,
                                       // "is_post_closed":is_post_closed,
                                       // "is_preopen_order":is_preopen_order,
                                        "isSqOffOrder":isSqOffOrder,
                                        "offline":offline
                                      },
                                      "response_format":response_format,
                                      "request_type":request_type,
                                      "streaming_type":streaming_type
                                    }
                                  }


                                    var send_rr = Buffer.from(qs.stringify(data11)).toString;
                                    //console.log('data 11 ',data11);
                                    var config = {
                                        method: 'post',
                                        url: 'http://sandboxtrade.mandotsecurities.com:3333/NewOrderRequest',
                                        headers: { 
                                            'Authorization': item.access_token
                                          },
                                        data : data11
                                      };
                                      
                                      axios(config)
                                      .then(function (response) {
                                      //  console.log(JSON.stringify(response.data.response.data.gorderid));
                                      fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\Mandot Place Oredr Entry  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                                        if(err) {
                                            return console.log(err);
                                        }
                                       });
                                      
                                        if(response.data.response.data.ErrorCode == 0){
                                        var orderid = response.data.response.data.gorderid;        
                                    
                                        var config1 = {
                                            method: 'get',
                                            url: 'http://sandboxtrade.mandotsecurities.com:3333/getOrderBookDetailWithLegV2?exchangeType=ALL&ClientCode='+item.client_code+'&Order_Status=ALL&Ordertype=ALL&gscid='+item.api_key,
                                            headers: { 
                                              'Authorization': item.access_token
                                            }
                                          };
                                          
                                          axios(config1)
                                          .then(function (response1) {
                                           
                                            if(response1.data.ErrorCode == 0){
                                            response1.data.data.forEach(element => {
                                                console.log('console uniqueID -',element.ordID); 
                                                if(element.ordID == orderid){
                                    
                                                console.log('console book type -',element.BookType);
                                                console.log('console LogTime -',element.LogTime);
                                                console.log('console ordID -',element.ordID);
                                                console.log('console status -',element.status);
                    
                    
                                                connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+orderid+'" ,`order_status`="'+element.status+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                    console.log("err", err);
                                                });
                    
                    
                    
                                                connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"SELL","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + orderid + ',"' + get_date() + '","",' + signal.id + ',"' + element.status + '","'+last_signal_id+'","'+signal.type+'")', (err, client_transaction) => {
                                                    //console.log(err);
                                                });    
                    
                    
                    
                                    
                                                }
                                             
                                            });
                                           }
                                    
                                          })
                                          .catch(function (error) {
                                            console.log(error);
                                    
                                          });
                                      
                                    
                                        }else{
                                    
                                    
                                        }
                                    
                                    
              
                                    
                                      })
                                      .catch(function (error) {
                                        console.log('sss -',error.response);
                                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\Mandot Place Oredr Exit Catch =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry catch -'+JSON.stringify(error.response)+ "\n\n" , function(err) {
                                            if(err) {
                                                return console.log(err);
                                            }
                                           });
                                    
                                        if(error.response == undefined){
                                            console.log('Mandot Server Connection Error');
                                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`reject_reason`="Mandot Connection Close" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                console.log("errcc", err);
                                            });
                                        }
                                    
                                      });
                                        data = '';
                                        return data;   


                                }
                             
                                else if((item1.buyQty - item1.sellQty) < 0 && signal.type=='SX'){
                                    
                                    data11  = {
                                        "request": {
                                          "data": {
                                            "trigger_price":trigger_price,
                                            "gtoken":gtoken,
                                            "side":side,
                                            "gcid":gcid,
                                            "validity":validity,
                                            "price":price,
                                            "exchange":exchange,
                                            "disclosed_qty":disclosed_qty,
                                           // "lot":lot,
                                            "order_type":order_type,
                                            "product":product,
                                            "qty":qty,
                                           // "corderid":corderid,
                                           // "amo":amo,
                                            "gtdExpiry":gtdExpiry,
                                           // "is_post_closed":is_post_closed,
                                           // "is_preopen_order":is_preopen_order,
                                            "isSqOffOrder":isSqOffOrder,
                                            "offline":offline
                                          },
                                          "response_format":response_format,
                                          "request_type":request_type,
                                          "streaming_type":streaming_type
                                        }
                                      }

                                    var send_rr = Buffer.from(qs.stringify(data11)).toString;


                                    var config = {
                                        method: 'post',
                                        url: 'http://sandboxtrade.mandotsecurities.com:3333/NewOrderRequest',
                                        headers: { 
                                            'Authorization': item.access_token
                                          },
                                        data : data11
                                      };
                                      
                                      axios(config)
                                      .then(function (response) {
                                      //  console.log(JSON.stringify(response.data.response.data.gorderid));
                                      fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\Mandot Place Oredr Entry  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                                        if(err) {
                                            return console.log(err);
                                        }
                                       });
                                      
                                        if(response.data.response.data.ErrorCode == 0){
                                        var orderid = response.data.response.data.gorderid;        
                                    
                                        var config1 = {
                                            method: 'get',
                                            url: 'http://sandboxtrade.mandotsecurities.com:3333/getOrderBookDetailWithLegV2?exchangeType=ALL&ClientCode='+item.client_code+'&Order_Status=ALL&Ordertype=ALL&gscid='+item.api_key,
                                            headers: { 
                                              'Authorization': item.access_token
                                            }
                                          };
                                          
                                          axios(config1)
                                          .then(function (response1) {
                                           
                                            if(response1.data.ErrorCode == 0){
                                            response1.data.data.forEach(element => {
                                                console.log('console uniqueID -',element.ordID); 
                                                if(element.ordID == orderid){
                                    
                                                console.log('console book type -',element.BookType);
                                                console.log('console LogTime -',element.LogTime);
                                                console.log('console ordID -',element.ordID);
                                                console.log('console status -',element.status);
                    
                    
                                                connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+orderid+'" ,`order_status`="'+element.status+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                    console.log("err", err);
                                                });
                    
                    
                    
                                                connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"SELL","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + orderid + ',"' + get_date() + '","",' + signal.id + ',"' + element.status + '","'+last_signal_id+'","'+signal.type+'")', (err, client_transaction) => {
                                                    //console.log(err);
                                                });    
                    
                    
                    
                                    
                                                }
                                             
                                            });
                                           }
                                    
                                          })
                                          .catch(function (error) {
                                            console.log(error);
                                    
                                          });
                                      
                                    
                                        }else{
                                    
                                    
                                        }
                                    
                                    
              
                                    
                                      })
                                      .catch(function (error) {
                                        console.log('sss -',error.response);
                                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\Mandot Place Oredr Exit Catch =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry catch -'+JSON.stringify(error.response)+ "\n\n" , function(err) {
                                            if(err) {
                                                return console.log(err);
                                            }
                                           });
                                    
                                        if(error.response == undefined){
                                            console.log('Mandot Server Connection Error');
                                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`reject_reason`="Mandot Connection Close" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                console.log("errcc", err);
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
     
            return_data  = {
                "request": {
                  "data": {
                    "trigger_price":trigger_price,
                    "gtoken":gtoken,
                    "side":side,
                    "gcid":gcid,
                    "validity":validity,
                    "price":price,
                    "exchange":exchange,
                    "disclosed_qty":disclosed_qty,
                   // "lot":lot,
                    "order_type":order_type,
                    "product":product,
                    "qty":qty,
                   // "corderid":corderid,
                   // "amo":amo,
                    "gtdExpiry":gtdExpiry,
                   // "is_post_closed":is_post_closed,
                   // "is_preopen_order":is_preopen_order,
                    "isSqOffOrder":isSqOffOrder,
                    "offline":offline
                  },
                  "response_format":response_format,
                  "request_type":request_type,
                  "streaming_type":streaming_type
                }
              }
    


        return return_data;
    }

}catch (e) {
    console.log('Mandot Get Order',e);
  }


}

module.exports = { place_order, access_token }