var axios = require('axios');
var qs = require('qs');
const fs = require('fs');
var smartalgo = require('../connections/smartalgo');



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


    connection.query('' + instrument_query + ';SELECT * FROM `client_service` LEFT JOIN `services` ON `services`.`id` = `client_service`.`service_id` LEFT JOIN `client` ON `client`.`id` = `client_service`.`client_id` WHERE `client_service`.`client_id` = "' + item.id + '" AND `services`.`service` = "' + signal.input_symbol + '"', [1, 2], (err, result) => {
       // console.log(instrument_query);
         

     if(result[0].length > 0 || result[1].length > 0){

        //Broker Response Print Token
       if(signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo'){

        var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Strike : "+signal.strike+" , option_type :"+signal.option_type+" , TradeSymbol : "+instrument_token_symbol[0].tradesymbol_m_w +" , Token : "+instrument_token_symbol[0].instrument_token+"]";
        var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

        connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="ZEBULL" WHERE `id`=' + bro_res_last_id, (err, result) => {
            console.log("err update token", err);
        });

      }else if(signal.segment == 'C' || signal.segment == 'c'){

        var signal_sy = "[symbol : "+ signal.input_symbol +" , TradeSymbol : "+instrument_token_symbol[0].zebu_token+" , Token : "+instrument_token_symbol[0].instrument_token+"]";
        var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

        connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="ZEBULL" WHERE `id`=' + bro_res_last_id, (err, result) => {
           // console.log("err update token", err);
        });


      }else{

        var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +" , TradeSymbol : "+instrument_token_symbol[0].tradesymbol +" , Token : "+instrument_token_symbol[0].instrument_token+"]";

        var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
        connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="ZEBULL" WHERE `id`=' + bro_res_last_id, (err, result) => {
           // console.log("err update token", err);
        });


      }

    }else{
     
        if(signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo'){

            var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Strike : "+signal.strike+" , option_type :"+signal.option_type+" , TradeSymbol : NULL , Token : NULL]";
            var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');  

            connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="ZEBULL" WHERE `id`=' + bro_res_last_id, (err, result) => {
               // console.log("err update token", err);
            });
    
          }else{
    
            var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +" , TradeSymbol : NULL , Token : NULL]";
            var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

            connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="ZEBULL" WHERE `id`=' + bro_res_last_id, (err, result) => {
               // console.log("err update token", err);
            });
    
    
          }
  

    }

    
         
       

        console.log(err);
        if (result[1].length > 0 || result[0].length > 0) {

            var data = get_orderdata(item, signal, result, connection ,last_signal_id,instrument_token_symbol,bro_res_last_id,filePath);
            console.log('Zebull Entry New ',data)
            if (data !== undefined) {
                var send_rr = Buffer.from(qs.stringify(data)).toString('base64');
                var config = {
                    method: 'post',
                    url: 'https://api.zebull.in/rest/V2MobullService/api/placeOrder/executePlaceOrder',
                

                    headers: { 
                        'Authorization': 'Bearer '+ item.client_code +' '+ item.access_token , 
                        'Content-Type': 'application/json'
                      },
                    data: JSON.stringify([data])
                };


                var datetime = new Date();
                console.log("ordertime1", datetime);
                axios(config)
                    .then(function(response) {


                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nZebull Place Oredr Entry  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                            if(err) {
                                return console.log(err);
                            }
                           });

                        var datetime = new Date();
                        var send_rr1 = Buffer.from(qs.stringify(data)).toString('base64');

                  if(response.data[0].stat == "Ok"){

                   var data_order = {
                    "nestOrderNumber":response.data[0].NOrdNo,
                   }

                 var config1 = {
                  method: 'post',
                  url: 'https://api.zebull.in/rest/V2MobullService/api/placeOrder/orderHistory',
                  headers: { 
                    'Authorization': 'Bearer '+ item.client_code +' '+ item.access_token , 
                    'Content-Type': 'application/json'
                  },
                    data: JSON.stringify(data_order)
                        };
                        axios(config1)
                        .then(function(response1) {

                            var send_rr = Buffer.from(qs.stringify(data)).toString('base64');

                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+response.data[0].NOrdNo+'" ,`order_status`="'+response1.data[0].Status+'" ,`reject_reason`="'+response1.data[0].rejectionreason+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                //console.log("err", err);
                            });



                            connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"BUY","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data[0].NOrdNo + ',"' + get_date() + '","",' + signal.id + ',"' + response1.data[0].Status + '","'+last_signal_id+'","'+signal.type+'")', (err, client_transaction) => {
                                //console.log(err);
                            });    


                        })
                        .catch(function(error_broker) {
                             console.log('error_broker -', error_broker);
                        });


                    }else{
                        console.log("else");
                        connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr1+'",`order_id`="'+response.data[0].NOrdNo+'" ,`order_status`="'+response.data[0].stat+'" ,`reject_reason`="'+response.data[0].Emsg+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                            console.log("err", err);
                        });


                    }


                    })
                    .catch(function(error_p) {
                        //console.log('place order errror ',error_p);
                fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nZebull Place Oredr Entry Catch =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry Catch-'+JSON.stringify(error_p.response.data)+ "\n\n" , function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    });

                        connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_status`="Error" ,`reject_reason`="'+error_p.response.data+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                            //console.log("err", err);
                        });


                    });
            }
        }
    });
});
}

const get_orderdata = (item, signal, result, connection ,last_signal_id,instrument_token_symbol,bro_res_last_id,filePath) => {
    // console.log(result);
    var is_reject = false;
    var exch;
    if (signal.segment == 'C' || signal.segment == 'c') {
        exch = "NSE";
    } else if (signal.segment == 'F' || signal.segment == 'f' || signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo') {
        exch = "NFO";
    } else if (signal.segment == 'MF' || signal.segment == 'mf' || signal.segment == 'MO' || signal.segment == 'mo') {
        exch = "MCX";
    }
    else if (signal.segment == 'CF' || signal.segment == 'cf' || signal.segment == 'CO' || signal.segment == 'co') {
        exch = "CDS";
    }

   
    var transtype;

    if (signal.type == 'LE' || signal.type == 'SX') {
        transtype = 'BUY';
    } else if (signal.type == 'SE' || signal.type == 'LX') {
        transtype = 'SELL';
    }



    var  complexty
    var  discqty = "0";
    var  pCode;
    var  prctyp;
    var  price = "";
    var  qty = result[1][0].qty;
    var  ret = "DAY";
    var  stopLoss ="";
    var  symbol_id = instrument_token_symbol[0].instrument_token;
    var  target = "0";
    var trading_symbol;
    trading_symbol=instrument_token_symbol[0].tradesymbol;
   
    var  trailing_stop_loss = "0";
        var  trigPrice = "";

        if (signal.segment == 'C' || signal.segment == 'c') {
            trading_symbol=instrument_token_symbol[0].zebu_token;
         }    
         
          
        //  if (signal.segment == 'O' || signal.segment == 'o') {
        //     trading_symbol=instrument_token_symbol[0].tradesymbol_m_w;
        //      } 


    if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' &&  result[1][0].product_type == '1') {

          
        prctyp = 'MKT';
        pCode = 'CNC'; 
        complexty = "regular"; 
         
    }
   else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' &&  result[1][0].product_type == '1') {
        prctyp = 'MKT';
        pCode = 'CNC'; 
        complexty = "regular";       
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' &&  result[1][0].product_type == '1') {
        prctyp = 'L';
        price = signal.price;
        pCode = 'CNC';
        complexty = "regular"; 
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' &&  result[1][0].product_type == '1') {
        prctyp = 'L';
        price = signal.price;
        pCode = 'CNC';
        complexty = "regular";
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' &&  result[1][0].product_type == '1') {
        prctyp = 'SL';
        price = signal.price;
        pCode = 'CNC';
        trigPrice = signal.tr_price;
        complexty = "regular"; 
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' &&  result[1][0].product_type == '1') {
        prctyp = 'SL';
        price = signal.price;
        pCode = 'CNC';
        trigPrice = signal.tr_price;
        complexty = "regular"; 
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '4' &&  result[1][0].product_type == '1') {

        prctyp = 'SL-M';
        price = signal.price;
        pCode = 'CNC'; 
        trigPrice = signal.tr_price;
        complexty = "regular";
   }
   else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '4' &&  result[1][0].product_type == '1') {

    prctyp = 'SL-M';
    price = signal.price;
    pCode = 'CNC'; 
    trigPrice = signal.tr_price;
    complexty = "regular";
}
  
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' &&  result[1][0].product_type == '2') {
        prctyp = 'MKT';
        pCode = 'MIS';
        complexty = "regular"; 
        
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' &&  result[1][0].product_type == '2') {
        prctyp = 'MKT';
        pCode = 'MIS';
        complexty = "regular"; 
        
    } 
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' &&  result[1][0].product_type == '2') {

        prctyp = 'L';
        price = signal.price;
        pCode = 'MIS';
        complexty = "regular"; 
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' &&  result[1][0].product_type == '2') {

        prctyp = 'L';
        price = signal.price;
        pCode = 'MIS';
        complexty = "regular"; 
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' &&  result[1][0].product_type == '2') {
        prctyp = 'SL';
        price = signal.price;
        pCode = 'MIS';
        trigPrice = signal.tr_price;
        complexty = "regular";
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' &&  result[1][0].product_type == '2') {
        prctyp = 'SL';
        price = signal.price;
        pCode = 'MIS';
        trigPrice = signal.tr_price;
        complexty = "regular"; 
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '4' &&  result[1][0].product_type == '2') {

        prctyp = 'SL-M';
        price = signal.price;
        pCode = 'MIS';
        trigPrice = signal.tr_price;
        complexty = "regular";
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '4' &&  result[1][0].product_type == '2') {

        prctyp = 'SL-M';
        price = signal.price;
        pCode = 'MIS';
        trigPrice = signal.tr_price;
        complexty = "regular"; 
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' && result[1][0].product_type == '4') {
        prctyp = 'MKT';
        pCode = 'CO';
        complexty = "co"; 
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' && result[1][0].product_type == '4') {
        prctyp = 'MKT';
        pCode = 'CO';
        complexty = "co";
    }

    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' && result[1][0].product_type == '4') {
        prctyp = 'L';
        pCode = 'CO';
        price = signal.price;
        trigPrice = signal.tr_price;
        complexty = "co";
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' && result[1][0].product_type == '4') {
        prctyp = 'L';
        pCode = 'CO';
        price = signal.price;
        trigPrice = signal.tr_price;
        complexty = "co";
    }
     else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' &&  result[1][0].product_type == '3') {

        console.log('order BO')
        prctyp = 'L';
        price = signal.price;
        pCode = 'MIS';
        complexty = 'bo';
        stopLoss = signal.sl_value;
        target = signal.sq_value;
        trailing_stop_loss = signal.tsl;
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' &&  result[1][0].product_type == '3') {
        prctyp = 'L';
        price = signal.price;
        pCode = 'MIS';
        complexty = 'bo';
        stopLoss = signal.sl_value;
        target = signal.sq_value;
        trailing_stop_loss = signal.tsl;
    } 
     else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' &&  result[1][0].product_type == '3') {

        prctyp = 'SL';
        price = signal.price;
        pCode = 'MIS';
        complexty = 'bo';
        trigPrice = signal.tr_price;
        stopLoss = signal.sl_value;
        target = signal.sq_value;
        trailing_stop_loss = signal.tsl;
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' &&  result[1][0].product_type == '3') {

        prctyp = 'SL';
        price = signal.price;
        pCode = 'MIS';
        complexty = 'bo';
        trigPrice = signal.tr_price;
        stopLoss = signal.sl_value;
        target = signal.sq_value;
        trailing_stop_loss = signal.tsl;
        
    }


   
    if(result[1][0].product_type == '1'){
        if (signal.segment == 'F' || signal.segment == 'f' || signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo') {
            pCode = "NRML";
            }   
    }



    if (signal.type == 'SX' || signal.type == 'LX') {

        
        data_possition ={
           "ret" : "DAY" 
                    }
                var config = {
                    method: 'post',
                    url: 'https://api.zebull.in/rest/V2MobullService/api/positionAndHoldings/positionBook',
                    headers: { 
                        'Authorization': 'Bearer '+ item.client_code +' '+ item.access_token , 
                        'Content-Type': 'application/json'
                      },
                    data: JSON.stringify(data_possition)
                };

                axios(config)
                    .then(function(response) {
                        response.data.forEach(function(item1, index) {

                            if(item1.Token == symbol_id){
                                var possition_qty =item1.Bqty - item1.Sqty;
                                 connection.query('UPDATE `broker_response` SET `open_possition_qty`="' + possition_qty + '" WHERE `id`=' + bro_res_last_id, (err, result_p) => {
                                    //console.log("err", err);
                                })

                                if((item1.Bqty - item1.Sqty) > 0 && signal.type=='LX'){
                                  
                                    if(result[1][0].product_type == '3'){
                                        data11 =  {
                                            "complexty": complexty,
                                            "discqty": discqty,
                                            "exch": exch,
                                            "pCode": pCode,
                                            "prctyp": prctyp,
                                            "price": price,
                                            "qty": qty,
                                            "ret": ret ,
                                            "stopLoss": stopLoss,
                                            "symbol_id": symbol_id,
                                            "target": target,
                                            "trading_symbol": trading_symbol,
                                            "trailing_stop_loss": trailing_stop_loss,
                                            "transtype": transtype,
                                            "trigPrice": trigPrice
                                          };
                                    }else{
                                        data11  =  { 
                                            "complexty": complexty,
                                            "discqty": "0",
                                            "exch": exch,
                                            "pCode": pCode,
                                            "prctyp": prctyp,
                                            "price": price,
                                            "qty": qty,
                                            "ret": ret,
                                            "stopLoss":stopLoss,
                                            "symbol_id": symbol_id,
                                            "trading_symbol": trading_symbol,
                                            "trailing_stop_loss":trailing_stop_loss,
                                            "transtype": transtype,
                                            "trigPrice": trigPrice
                                        } ;
                                    }
                                    var send_rr = Buffer.from(qs.stringify(data11)).toString('base64');

                                    var config = {
                                        method: 'post',
                                        url: 'https://api.zebull.in/rest/V2MobullService/api/placeOrder/executePlaceOrder',
                                    
                    
                                        headers: { 
                                            'Authorization': 'Bearer '+ item.client_code +' '+ item.access_token , 
                                            'Content-Type': 'application/json'
                                          },
                                        data: JSON.stringify([data11])
                                    };
                    
                                    var datetime = new Date();
                                    axios(config)
                                        .then(function(response) {

                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nZebull Place Oredr Exit =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit-'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                                if(err) {
                                    return console.log(err);
                                }
                                });

                                   var datetime = new Date();
                                   var send_rr1 = Buffer.from(qs.stringify(data11)).toString('base64');
                    
                                      if(response.data[0].stat == "Ok"){
                    
                                       var data_order = {
                                        "nestOrderNumber":response.data[0].NOrdNo,
                                       }
                    
                                     var config1 = {
                                      method: 'post',
                                      url: 'https://api.zebull.in/rest/V2MobullService/api/placeOrder/orderHistory',
                                      headers: { 
                                        'Authorization': 'Bearer '+ item.client_code +' '+ item.access_token , 
                                        'Content-Type': 'application/json'
                                      },
                                        data: JSON.stringify(data_order)
                                            };
                                            axios(config1)
                                            .then(function(response1) {
                    
                                            var send_rr = Buffer.from(qs.stringify(data11)).toString('base64');
                                              
                                                connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+response.data[0].NOrdNo+'" ,`order_status`="'+response1.data[0].Status+'" ,`reject_reason`="'+response1.data[0].rejectionreason+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                    //console.log("err", err);
                                                });
                    
                    
                    
                                                connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"SELL","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data[0].NOrdNo + ',"' + get_date() + '","",' + signal.id + ',"' + response1.data[0].Status + '","'+last_signal_id+'","'+signal.type+'")', (err, client_transaction) => {
                                                    //console.log(err);
                                                });    
                    
                    
                                            })
                                            .catch(function(error_broker) {
                                                 console.log('error_broker -', error_broker);
                                            });
                                                            
                                       
                                        }else{
                                        

                                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr1+'",`order_id`="'+response.data[0].NOrdNo+'" ,`order_status`="'+response.data[0].stat+'" ,`reject_reason`="'+response.data[0].Emsg+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                //console.log("err", err);
                                            });
                    
                    
                                        }
                    
                    
                    
                                        })
                                        .catch(function(error_p) {
                                           // console.log('place order errror ',error_p);

                                fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nZebull Place Oredr Exit Catch=   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit Catch-'+JSON.stringify(error_p.response.data)+ "\n\n" , function(err) {
                                if(err) {
                                    return console.log(err);
                                }
                                });

                                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_status`="Error" ,`reject_reason`="'+error_p.response.data+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                //console.log("err", err);
                                            });
                                        });

                                        data = '';
                                        return data;   


                                }
                                else if((item1.Bqty - item1.Sqty) < 0 && signal.type=='SX'){
                                    
                                    if(result[1][0].product_type == '3'){
                                        data11 =  {
                                            "complexty": complexty,
                                            "discqty": discqty,
                                            "exch": exch,
                                            "pCode": pCode,
                                            "prctyp": prctyp,
                                            "price": price,
                                            "qty": qty,
                                            "ret": ret ,
                                            "stopLoss": stopLoss,
                                            "symbol_id": symbol_id,
                                            "target": target,
                                            "trading_symbol": trading_symbol,
                                            "trailing_stop_loss": trailing_stop_loss,
                                            "transtype": transtype,
                                            "trigPrice": trigPrice
                                          };
                                    }else{
                                        data11  =  { 
                                            "complexty": complexty,
                                            "discqty": "0",
                                            "exch": exch,
                                            "pCode": pCode,
                                            "prctyp": prctyp,
                                            "price": price,
                                            "qty": qty,
                                            "ret": ret,
                                            "stopLoss":stopLoss,
                                            "symbol_id": symbol_id,
                                            "trading_symbol": trading_symbol,
                                            "trailing_stop_loss":trailing_stop_loss,
                                            "transtype": transtype,
                                            "trigPrice": trigPrice
                                        } ;
                                    }
                                    var send_rr = Buffer.from(qs.stringify(data11)).toString('base64');

                                    var config = {
                                        method: 'post',
                                        url: 'https://api.zebull.in/rest/V2MobullService/api/placeOrder/executePlaceOrder',
                                    
                    
                                        headers: { 
                                            'Authorization': 'Bearer '+ item.client_code +' '+ item.access_token , 
                                            'Content-Type': 'application/json'
                                          },
                                        data: JSON.stringify([data11])
                                    };
                                    var datetime = new Date();
                                    
                                    axios(config)
                                        .then(function(response) {

                                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nZebull Place Oredr Exit =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit -'+JSON.stringify(response.data)+ "\n\n" , function(err) {
                                                if(err) {
                                                    return console.log(err);
                                                }
                                                });


                                            var datetime = new Date();
                                            var send_rr1 = Buffer.from(qs.stringify(data11)).toString;
                    
                                      if(response.data[0].stat == "Ok"){
                    
                                       var data_order = {
                                        "nestOrderNumber":response.data[0].NOrdNo,
                                       }
                    
                                     var config1 = {
                                      method: 'post',
                                      url: 'https://api.zebull.in/rest/V2MobullService/api/placeOrder/orderHistory',
                                      headers: { 
                                        'Authorization': 'Bearer '+ item.client_code +' '+ item.access_token , 
                                        'Content-Type': 'application/json'
                                      },
                                        data: JSON.stringify(data_order)
                                            };
                                            axios(config1)
                                            .then(function(response1) {
                    
                                                var send_rr = Buffer.from(qs.stringify(data11)).toString('base64');
                                              
                                                connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+response.data[0].NOrdNo+'" ,`order_status`="'+response1.data[0].Status+'" ,`reject_reason`="'+response1.data[0].rejectionreason+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                    //console.log("err", err);
                                                });
                    
                    
                    
                                                connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"SELL","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data[0].NOrdNo + ',"' + get_date() + '","",' + signal.id + ',"' + response1.data[0].Status + '","'+last_signal_id+'","'+signal.type+'")', (err, client_transaction) => {
                                                    //console.log(err);
                                                });    
                    
                    
                                            })
                                            .catch(function(error_broker) {
                                                 console.log('error_broker -', error_broker);
                                            });
                    
                    
                    
                                           
                    
                    
                                        }else{
                                        

                                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr1+'",`order_id`="'+response.data[0].NOrdNo+'" ,`order_status`="'+response.data[0].stat+'" ,`reject_reason`="'+response.data[0].Emsg+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                //console.log("err", err);
                                            });
                    
                    
                                        }
                    
                    
                    
                                        })
                                        .catch(function(error_p) {
                                           // console.log('place order errror ',error_p);

                                           fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nZebull Place Oredr Exit Catch=   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit Catch-'+JSON.stringify(error_p.response.data)+ "\n\n" , function(err) {
                                            if(err) {
                                                return console.log(err);
                                            }
                                            });

                                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_status`="Error" ,`reject_reason`="'+error_p.response.data+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
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
        if(result[1][0].product_type == '3'){
            return_data =  {
                "complexty": complexty,
                "discqty": discqty,
                "exch": exch,
                "pCode": pCode,
                "prctyp": prctyp,
                "price": price,
                "qty": qty,
                "ret": ret ,
                "stopLoss": stopLoss,
                "symbol_id": symbol_id,
                "target": target,
                "trading_symbol": trading_symbol,
                "trailing_stop_loss": trailing_stop_loss,
                "transtype": transtype,
                "trigPrice": trigPrice
              };
        }else{
            return_data  =  { 
                "complexty": complexty,
                "discqty": "0",
                "exch": exch,
                "pCode": pCode,
                "prctyp": prctyp,
                "price": price,
                "qty": qty,
                "ret": ret,
                "stopLoss":stopLoss,
                "symbol_id": symbol_id,
                "trading_symbol": trading_symbol,
                "trailing_stop_loss":trailing_stop_loss,
                "transtype": transtype,
                "trigPrice": trigPrice
            } ;

          
        }


        return return_data;
    }




}

module.exports = { place_order, access_token }