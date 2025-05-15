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
       
        if(result[0].length > 0 || result[1].length > 0){

           // Broker Response Print Token
           if(signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo'){
    
            var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Strike : "+signal.strike+" , option_type :"+signal.option_type+" , Token : "+instrument_token_symbol[0].instrument_token+"]";
    
            var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

            connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="Choice India" WHERE `id`=' + bro_res_last_id, (err, result) => {
                console.log("err update token", err);
            });
    
          }else if(signal.segment == 'C' || signal.segment == 'c'){
    
            var signal_sy = "[symbol : "+ signal.input_symbol +"  , Token : "+instrument_token_symbol[0].instrument_token+"]";
    
            var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

            connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="Choice India" WHERE `id`=' + bro_res_last_id, (err, result) => {
                console.log("err update token", err);
            })   
    
    
          }else{
    
            var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Token : "+instrument_token_symbol[0].instrument_token+"]";
    
            var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
 
            connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="Choice India" WHERE `id`=' + bro_res_last_id, (err, result) => {
                console.log("err update token", err);
            })
    
    
          }
    
        }else{
         
            if(signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo'){
    
                var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Strike : "+signal.strike+" , option_type :"+signal.option_type+" ,  Token : NULL]";
        
                var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
            
                connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="Choice India" WHERE `id`=' + bro_res_last_id, (err, result) => {
                    console.log("err update token", err);
                })
        
              }else{
        
                var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +" ,  Token : NULL]";
        
                var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

                connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="Choice India" WHERE `id`=' + bro_res_last_id, (err, result) => {
                    console.log("err update token", err);
                })
        
        
              }
      
    
        }





        console.log(err);
        if (result[1].length > 0 || result[0].length > 0) {

            var data =  get_orderdata(item, signal, result, connection,last_signal_id,instrument_token_symbol,bro_res_last_id,filePath);
            //console.log('Choice India Entry -',data);
                 
            if (data !== undefined) {
           
                console.log('Data in Choice -',data);
                
                var send_rr = Buffer.from(JSON.stringify(data)).toString('base64');
             
                var config = {
                    method: 'post',
                    url: 'https://uat.jiffy.in/api/OpenAPI/NewOrder',
                    headers: { 
                      'VendorId': item.client_code, 
                      'VendorKey': item.api_key, 
                      'Authorization':'Bearer '+item.access_token,
                      'Content-Type': 'application/json'
                    },
                     data: JSON.stringify(data)
                };

                var datetime = new Date();
                axios(config)
                    .then(function(response) { 
                  
                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nChoiceIndia Place Oredr Entry  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                            if(err) {
                                return console.log(err);
                            }
                           });

                   
                 // console.log('response Choice - ',response);
                      

            if(response.data.Status == "Success"){  
                  
              var orderId  = response.data.Response;
              console.log('orderId -',orderId);

              var send_rr = Buffer.from(JSON.stringify(data)).toString('base64');

              connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+orderId+'"  WHERE `id`=' + bro_res_last_id, (err, result) => {
               //console.log("err", err);
              });
               
              connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"BUY","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + result[1][0].product_type + '","' + orderId + '","' + get_date() + '","",' + signal.id + ',"'+last_signal_id+'","'+signal.type+'")', (err11, client_transaction) => {
                   console.log('client_transaction error',err11);
               });


            //   var config1 = {
            //     method: 'get',
            //     url: 'https://uat.jiffy.in/api/OpenAPI/OrderBook',
            //     headers: { 
            //         'VendorId': item.client_code, 
            //         'VendorKey': item.api_key, 
            //         'Authorization':'Bearer '+item.access_token,
            //         'Content-Type': 'application/json'
            //       }
            //   };

              
            //   axios(config1)
            //   .then(function (response1) {
             
            //     response1.data.Response.Orders.forEach(element => {
            //         console.log(element.ClientOrderNo);
            
            //         if(element.ClientOrderNo == orderId){
            //             console.log("ErrorString -",element.ErrorString);
            //             console.log("OrderStatus -",element.OrderStatus);



            //             var send_rr = Buffer.from(JSON.stringify(data)).toString('base64');

            //             connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+orderId+'" ,`order_status`="'+element.OrderStatus+'" ,`reject_reason`="'+element.ErrorString+'"  WHERE `id`=' + bro_res_last_id, (err, result) => {
            //              //console.log("err", err);
            //             });
                         
            //             connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"BUY","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + result[1][0].product_type + '","' + orderId + '","' + get_date() + '","",' + signal.id + ',"'+last_signal_id+'","'+signal.type+'")', (err11, client_transaction) => {
            //                  console.log('client_transaction error',err11);
            //              });
                



            //         }
            
                    
            //      });
            
            //   })
            //   .catch(function (error) {
            //     console.log(error);
            //   });


                 }else{
 
                       // console.log('Get Choice India response error else---',response.data.result);

                       const message = (JSON.stringify(response.data)).replace(/["',]/g, '');

                       connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                           //console.log("err", err);
                       });
                    
                    }
                       
                       

                    })
                    .catch(function(error) {
                      // console.log('send Request Choice India - error',error.response.data);
                      fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nChoiceIndia Place Oredr Entry Catch  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry Catch -'+JSON.stringify(error.response.data)+ "\n\n" , function(err) {
                        if(err) {
                            return console.log(err);
                        }
                       });

                       const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');

                       connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                           //console.log("err", err);
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
    var SegmentId= 0
    if (signal.segment == 'C' || signal.segment == 'c') {
        SegmentId = 1;
    } else if (signal.segment == 'F' || signal.segment == 'f' || signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo') {
        SegmentId = 2;
    } else if (signal.segment == 'MF' || signal.segment == 'mf' || signal.segment == 'MO' || signal.segment == 'mo') {
        SegmentId = 5;
    }
    else if (signal.segment == 'CF' || signal.segment == 'cf' || signal.segment == 'CO' || signal.segment == 'co') {
        SegmentId = 13;
    }

   
    var BS = 0;

    if (signal.type == 'LE' || signal.type == 'SX') {
        BS = 1;
    } else if (signal.type == 'SE' || signal.type == 'LX') {
        BS = 2;
    }


 

var Token = instrument_token_symbol[0].instrument_token;
var OrderType="";
var Qty= result[1][0].qty;
var DisclosedQty= 0;
var Price = 0;
var TriggerPrice= 0;
var Validity= 1;
var ProductType= "";
var IsEdisReq= true;


    if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' &&  result[1][0].product_type == '1') {
        OrderType = 'RL_MKT';
        ProductType = 'D';       
    }
   else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' &&  result[1][0].product_type == '1') {
        OrderType = 'RL_MKT';
        ProductType = 'D';       
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' &&  result[1][0].product_type == '1') {
        OrderType = 'RL_LIMIT';
        limitPrice = signal.price;
        ProductType = 'D';
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' &&  result[1][0].product_type == '1') {
        OrderType = 'RL_LIMIT';
        Price = signal.price;
        ProductType = 'D';
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' &&  result[1][0].product_type == '1') {
        OrderType = 'SL_LIMIT';
        Price = signal.price;
        ProductType = 'D';
        TriggerPrice = signal.tr_price;
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' &&  result[1][0].product_type == '1') {
        OrderType = 'SL_LIMIT';
        Price = signal.price;
        ProductType = 'D';
        TriggerPrice = signal.tr_price;
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '4' &&  result[1][0].product_type == '1') {

        OrderType = 'SL_MKT';
        ProductType = 'D'; 
        TriggerPrice = signal.tr_price;
   }
   else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '4' &&  result[1][0].product_type == '1') {

    OrderType = 'SL_MKT';
    ProductType = 'D'; 
    TriggerPrice = signal.tr_price;
}
  
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' &&  result[1][0].product_type == '2') {
        OrderType = 'RL_MKT';
        ProductType = 'M';
        
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' &&  result[1][0].product_type == '2') {
        OrderType = 'RL_MKT';
        ProductType = 'M';
        
    } 
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' &&  result[1][0].product_type == '2') {

        OrderType = 'RL_LIMIT';
        Price = signal.price;
        ProductType = 'M';
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' &&  result[1][0].product_type == '2') {

        OrderType = 'RL_LIMIT';
        Price = signal.price;
        ProductType = 'M';
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' &&  result[1][0].product_type == '2') {
        OrderType = 'SL_LIMIT';
        Price = signal.price;
        ProductType = 'M';
        TriggerPrice = signal.tr_price;
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' &&  result[1][0].product_type == '2') {
        OrderType = 'SL_LIMIT';
        Price = signal.price;
        ProductType = 'M';
        TriggerPrice = signal.tr_price;
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '4' &&  result[1][0].product_type == '2') {

        OrderType = 'SL_MKT';
        ProductType = 'M';
        TriggerPrice = signal.tr_price;
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '4' &&  result[1][0].product_type == '2') {

        OrderType = 'SL_MKT';
        ProductType = 'M';
        TriggerPrice = signal.tr_price;
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' && result[1][0].product_type == '4') {
        OrderType = 'RL_MKT';
        ProductType = 'M';
        TriggerPrice = signal.tr_price;
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' && result[1][0].product_type == '4') {
        OrderType = 'RL_MKT';
        ProductType = 'M';
        TriggerPrice = signal.tr_price;
    }

    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' && result[1][0].product_type == '4') {
        OrderType = 'RL_LIMIT';
        ProductType = 'M';
        Price = signal.price;
        TriggerPrice = signal.tr_price;
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' && result[1][0].product_type == '4') {
        OrderType = 'RL_LIMIT';
        ProductType = 'M';
        Price = signal.price;
        TriggerPrice = signal.tr_price;
    }
     else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' &&  result[1][0].product_type == '3') {

       
        OrderType = 'RL_LIMIT';
        Price = signal.price;
        ProductType = 'M';

    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' &&  result[1][0].product_type == '3') {
        OrderType = 'RL_LIMIT';
        Price = signal.price;
        ProductType = 'M';
       
    } 
     else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' &&  result[1][0].product_type == '3') {

        OrderType = 'SL_LIMIT';
        Price = signal.price;
        ProductType = 'M';
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' &&  result[1][0].product_type == '3') {

        OrderType = 'SL_LIMIT';
        Price = signal.price;
        ProductType = 'M';
        
    }

    if (signal.type == 'SX' || signal.type == 'LX') {
         
             console.log("Inside LX AND SX");
                var config = {
                    method: 'get',
                    url: 'https://uat.jiffy.in/api/OpenAPI/NetPosition',
                    headers: { 
                        'VendorId': item.client_code, 
                        'VendorKey': item.api_key, 
                        'Authorization':'Bearer '+item.access_token,
                        'Content-Type': 'application/json'
                      },
                };

                axios(config)
                    .then(function(response) {

             console.log("Inside LX AND SX response -",response);


                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nChoiceIndia Place Oredr Entry  =   client Username - ' + item.username + '  client id - '+ item.id + ' Exit Order Quntity -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                            if(err) {
                                return console.log(err);
                            }
                           });
                                      
                        response.data.Response.NetPositions.forEach(function(item1, index) {
                            if(item1.Token == Token){
                              var possition_qty =item1.BuyQty - item1.SellQty;
                                 
                                connection.query('UPDATE `broker_response` SET `open_possition_qty`="' + possition_qty + '" WHERE `id`=' + bro_res_last_id, (err, result_p) => {
                                    //console.log("err", err);
                                });

                                if((item1.BuyQty - item1.SellQty) > 0 && signal.type=='LX'){
                                
                                   data11 = {
                                        "SegmentId":SegmentId,
                                        "Token":Token,
                                        "OrderType":OrderType,
                                        "BS":BS,
                                        "Qty":Qty,
                                        "DisclosedQty":DisclosedQty,
                                        "Price":Price,
                                        "TriggerPrice":TriggerPrice,
                                        "Validity":Validity,
                                        "ProductType":ProductType,
                                        "IsEdisReq":IsEdisReq
                                        };
                            

                        
                                var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');
                                
                                var config = {
                                    method: 'post',
                                    url: 'https://uat.jiffy.in/api/OpenAPI/NewOrder',
                                    headers: { 
                                      'VendorId': item.client_code, 
                                      'VendorKey': item.api_key, 
                                      'Authorization':'Bearer '+item.access_token,
                                      'Content-Type': 'application/json'
                                    },
                                     data: JSON.stringify(data11)
                                };
                
                                var datetime = new Date();
                                axios(config)
                                    .then(function(response) { 
                                      
                                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nChoiceIndia Place Oredr Exit  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                                            if(err) {
                                                return console.log(err);
                                            }
                                           });
                                   
                                 // console.log('response Choice - ',response);
                                      
                
                             if(response.data.Status == "Success"){  
                  
                            var orderId  = response.data.Response;
                            console.log('orderId -',orderId);




                        var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');

                        connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+orderId+'"  WHERE `id`=' + bro_res_last_id, (err, result) => {
                         //console.log("err", err);
                        });
                         
                        connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"SELL","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + result[1][0].product_type + '","' + orderId + '","' + get_date() + '","",' + signal.id + ',"'+last_signal_id+'","'+signal.type+'")', (err11, client_transaction) => {
                             console.log('client_transaction error',err11);
                         });






            //   var config1 = {
            //     method: 'get',
            //     url: 'https://uat.jiffy.in/api/OpenAPI/OrderBook',
            //     headers: { 
            //         'VendorId': item.client_code, 
            //         'VendorKey': item.api_key, 
            //         'Authorization':'Bearer '+item.access_token,
            //         'Content-Type': 'application/json'
            //       }
            //   };
              
              
            //   axios(config1)
            //   .then(function (response1) {
             
            //     response1.data.Response.Orders.forEach(element => {
            //         console.log(element.ClientOrderNo);
            
            //         if(element.ClientOrderNo == orderId){
            //             console.log("ErrorString -",element.ErrorString);
            //             console.log("OrderStatus -",element.OrderStatus);



            //             var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');

            //             connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+orderId+'" ,`order_status`="'+element.OrderStatus+'" ,`reject_reason`="'+element.ErrorString+'"  WHERE `id`=' + bro_res_last_id, (err, result) => {
            //              //console.log("err", err);
            //             });
                         
            //             connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"SELL","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + result[1][0].product_type + '","' + orderId + '","' + get_date() + '","",' + signal.id + ',"'+last_signal_id+'","'+signal.type+'")', (err11, client_transaction) => {
            //                  console.log('client_transaction error',err11);
            //              });
                



            //         }
            
                    
            //      });
            
            //   })
            //   .catch(function (error) {
            //     console.log(error);
            //   });


                              }else{
                
                                       // console.log('Get Choice India response error else---',response.data.result);
                        const message = (JSON.stringify(response.data)).replace(/["',]/g, '');

                       connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                           //console.log("err", err);
                       });
                                    
                                    }
                                       
                                       
                
                                    })
                                    .catch(function(error) {
                                       //console.log('send Request Choice India - error',error.response.data);
                                       fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nChoiceIndia Place Oredr Exit Catch  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit Catch -'+JSON.stringify(error.response.data)+ "\n\n" , function(err) {
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

                                
                                else if((item1.BuyQty - item1.SellQty) < 0 && signal.type=='SX'){
                                    
                                    data11 = {
                                        "SegmentId":SegmentId,
                                        "Token":Token,
                                        "OrderType":OrderType,
                                        "BS":BS,
                                        "Qty":Qty,
                                        "DisclosedQty":DisclosedQty,
                                        "Price":Price,
                                        "TriggerPrice":TriggerPrice,
                                        "Validity":Validity,
                                        "ProductType":ProductType,
                                        "IsEdisReq":IsEdisReq
                                        };

                                        var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');

                                        var config = {
                                            method: 'post',
                                            url: 'https://uat.jiffy.in/api/OpenAPI/NewOrder',
                                            headers: { 
                                              'VendorId': item.client_code, 
                                              'VendorKey': item.api_key, 
                                              'Authorization':'Bearer '+item.access_token,
                                              'Content-Type': 'application/json'
                                            },
                                             data: JSON.stringify(data11)
                                        };
                        
                                        var datetime = new Date();
                                        axios(config)
                                            .then(function(response) { 

                                                fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nChoiceIndia Place Oredr Exit   =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit  -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                                                    if(err) {
                                                        return console.log(err);
                                                    }
                                                   });
                                           
                                        //  console.log('response Choice - ',response);
                                              
                        
                                        if(response.data.Status == "Success"){  
                  
                                            var orderId  = response.data.Response;
                                            console.log('orderId -',orderId);


                                            var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');
                              
                                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+orderId+'"  WHERE `id`=' + bro_res_last_id, (err, result) => {
                                             //console.log("err", err);
                                            });
                                             
                                            connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"SELL","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + result[1][0].product_type + '","' + orderId + '","' + get_date() + '","",' + signal.id + ',"'+last_signal_id+'","'+signal.type+'")', (err11, client_transaction) => {
                                                 console.log('client_transaction error',err11);
                                             });
                              
                              
                                            // var config1 = {
                                            //   method: 'get',
                                            //   url: 'https://uat.jiffy.in/api/OpenAPI/OrderBook',
                                            //   headers: { 
                                            //       'VendorId': item.client_code, 
                                            //       'VendorKey': item.api_key, 
                                            //       'Authorization':'Bearer '+item.access_token,
                                            //       'Content-Type': 'application/json'
                                            //     }
                                            // };
                                            
                                            
                                            // axios(config1)
                                            // .then(function (response1) {
                                           
                                            //   response1.data.Response.Orders.forEach(element => {
                                            //       console.log(element.ClientOrderNo);
                                          
                                            //       if(element.ClientOrderNo == orderId){
                                            //           console.log("ErrorString -",element.ErrorString);
                                            //           console.log("OrderStatus -",element.OrderStatus);
                              
                              
                              
                                            //           var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');
                              
                                            //           connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+orderId+'" ,`order_status`="'+element.OrderStatus+'" ,`reject_reason`="'+element.ErrorString+'"  WHERE `id`=' + bro_res_last_id, (err, result) => {
                                            //            //console.log("err", err);
                                            //           });
                                                       
                                            //           connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"SELL","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + result[1][0].product_type + '","' + orderId + '","' + get_date() + '","",' + signal.id + ',"'+last_signal_id+'","'+signal.type+'")', (err11, client_transaction) => {
                                            //                console.log('client_transaction error',err11);
                                            //            });
                                              
                              
                              
                              
                                            //       }
                                          
                                                  
                                            //    });
                                          
                                            // })
                                            // .catch(function (error) {
                                            //   console.log(error);
                                            // });
                              
                              
                                               }else{
                        
                                               // console.log('Get Choice India response error else---',response.data.result);
                                               const message = (JSON.stringify(response.data)).replace(/["',]/g, '');

                       connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                           //console.log("err", err);
                       });
                                            
                                            }
                                               
                                               
                        
                                            })
                                            .catch(function(error) {
                                             //  console.log('send Request Choice India - error',error.response.data);
                                             fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nChoiceIndia Place Oredr Exit Catch  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit Catch -'+JSON.stringify(error.response.data)+ "\n\n" , function(err) {
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
                            
                            }else{
                                data = '';
                                return data;
                            }
                        })    

                    })
                    .catch(function(error) {
                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nChoiceIndia Place Oredr Entry  =   client Username - ' + item.username + '  client id - '+ item.id + ' Exit Order Quntity -'+JSON.stringify(error.response)+ "\n\n" , function(err) {
                            if(err) {
                                return console.log(err);
                            }
                           });
                       

                    });
           
        
    } else {
 
          return_data = {
            "SegmentId":SegmentId,
            "Token":Token,
            "OrderType":OrderType,
            "BS":BS,
            "Qty":Qty,
            "DisclosedQty":DisclosedQty,
            "Price":Price,
            "TriggerPrice":TriggerPrice,
            "Validity":Validity,
            "ProductType":ProductType,
            "IsEdisReq":IsEdisReq
            };

        

        return return_data;
    }




}

module.exports = { place_order, access_token }