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
        var instrument_query = "SELECT instrument_token ,segment  FROM `token_symbol` WHERE `symbol` LIKE '" + signal.input_symbol + "' AND `expiry` LIKE '" + signal.expiry + "' AND `segment` LIKE 'F' ";
    } else if (signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo') {

        var option_type;
        if(signal.option_type=="Call" || signal.option_type=="CALL"){
            option_type = "CE";
        }else if(signal.option_type=="Put" || signal.option_type=="PUT"){
            option_type = "PE";
        }


        var instrument_query = "SELECT instrument_token ,segment  FROM `token_symbol` WHERE `symbol` LIKE '" + signal.input_symbol + "' AND `expiry` LIKE '" + signal.expiry + "' AND `segment` LIKE 'O' AND `strike` LIKE '" + signal.strike + "' AND `option_type`='" + option_type + "'";
        
    } else if (signal.segment == 'MO' || signal.segment == 'mo') {
        var option_type;
        if(signal.option_type=="Call" || signal.option_type=="CALL"){
            option_type = "CE";
        }else if(signal.option_type=="Put" || signal.option_type=="PUT"){
            option_type = "PE";
        }


        var instrument_query = "SELECT instrument_token ,segment  FROM `token_symbol` WHERE `symbol` LIKE '" + signal.input_symbol + "' AND `expiry` LIKE '" + signal.expiry + "' AND `segment` LIKE 'MO' AND `strike` LIKE '" + signal.strike + "' AND `option_type`='" + option_type + "'";
    } else if (signal.segment == 'MF' || signal.segment == 'mf') {
        var instrument_query = "SELECT instrument_token ,segment  FROM `token_symbol` WHERE `symbol` LIKE '" + signal.input_symbol + "' AND `expiry` LIKE '" + signal.expiry + "' AND `segment` LIKE 'MF'";
    }
    else if (signal.segment == 'CF' || signal.segment == 'Cf') {
        var instrument_query = "SELECT instrument_token ,segment  FROM `token_symbol` WHERE `symbol` LIKE '" + signal.input_symbol + "' AND `expiry` LIKE '" + signal.expiry + "' AND `segment` LIKE 'CF'";
    }

   
    connection2.query(instrument_query, (err, instrument_token_symbol) => {

        var segment = signal.segment

        if (segment == "FO" || segment == "fo") {
            segment = 'O';
        }

    connection.query('SELECT * FROM `client_service` LEFT JOIN `services` ON `services`.`id` = `client_service`.`service_id` LEFT JOIN `client` ON `client`.`id` = `client_service`.`client_id` LEFT JOIN `categorie` ON `categorie`.`id` = `services`.`categorie_id`  WHERE `client_service`.`client_id` = "' + item.id + '" AND `services`.`service` = "' + signal.input_symbol + '" AND `categorie`.`segment`="'+segment+'"', (err, result) => {
       // console.log(instrument_query);
         

    //  if(result[0].length > 0 || result[1].length > 0){

    //     //Broker Response Print Token
    //    if(signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo'){

    //     var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Strike : "+signal.strike+" , option_type :"+signal.option_type+" , TradeSymbol : "+instrument_token_symbol[0].tradesymbol_m_w +" , Token : "+instrument_token_symbol[0].instrument_token+"]";
    //     var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

    //     connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="ZEBULL" WHERE `id`=' + bro_res_last_id, (err, result) => {
    //         console.log("err update token", err);
    //     });

    //   }else if(signal.segment == 'C' || signal.segment == 'c'){

    //     var signal_sy = "[symbol : "+ signal.input_symbol +" , TradeSymbol : "+instrument_token_symbol[0].zebu_token+" , Token : "+instrument_token_symbol[0].instrument_token+"]";
    //     var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

    //     connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="ZEBULL" WHERE `id`=' + bro_res_last_id, (err, result) => {
    //        // console.log("err update token", err);
    //     });


    //   }else{

    //     var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +" , TradeSymbol : "+instrument_token_symbol[0].tradesymbol +" , Token : "+instrument_token_symbol[0].instrument_token+"]";

    //     var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
    //     connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="ZEBULL" WHERE `id`=' + bro_res_last_id, (err, result) => {
    //        // console.log("err update token", err);
    //     });


    //   }

    // }else{
     
    //     if(signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo'){

    //         var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +"  , Strike : "+signal.strike+" , option_type :"+signal.option_type+" , TradeSymbol : NULL , Token : NULL]";
    //         var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');  

    //         connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="ZEBULL" WHERE `id`=' + bro_res_last_id, (err, result) => {
    //            // console.log("err update token", err);
    //         });
    
    //       }else{
    
    //         var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +" , TradeSymbol : NULL , Token : NULL]";
    //         var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

    //         connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="ZEBULL" WHERE `id`=' + bro_res_last_id, (err, result) => {
    //            // console.log("err update token", err);
    //         });
    
    
    //       }
  

    // }
  
  //  console.log("resul instrument_token_symbol -- ",instrument_token_symbol);
    if(instrument_token_symbol.length > 0){
    
        var exch;  
        
        if(signal.segment=="C" || signal.segment=="c"){
            exch = "NSE"
        }else{

        if(instrument_token_symbol[0].segment == "CE" || instrument_token_symbol[0].segment == "CO"){
            exch = "CDS"
        }
        else if(instrument_token_symbol[0].segment == "F" || instrument_token_symbol[0].segment == "O"){
        exch = "NFO"
        }
        else if(instrument_token_symbol[0].segment == "MF" || instrument_token_symbol[0].segment == "MO"){
        exch = "MCX"
        }
     
      }

    //console.log("resul zebull -- ",result);
   console.log("dd -- ",err);
   
    var data = {"uid":item.client_code,"exch":exch,"token":instrument_token_symbol[0].instrument_token}
    var raw = "jData="+JSON.stringify(data)+"&jKey="+item.access_token;

  var config = {
    method: 'post',
    url: 'https://go.mynt.in/NorenWClientTP/GetQuotes',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data : raw
  };
  
  axios(config)
  .then(function (response) {
      console.log("ddd order symbol zebull-",response.data.tsym);

      
      if(signal.segment == 'C' || signal.segment == 'c'){
      var signal_sy = "[symbol : "+ signal.input_symbol +" , TradeSymbol : "+response.data.tsym+" , Token : "+instrument_token_symbol[0].instrument_token+"]";
          var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
  
          connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="ZEBULL" WHERE `id`=' + bro_res_last_id, (err, result) => {
             // console.log("err update token", err);
          });

        }else{

       var signal_sy = "[symbol : "+ signal.input_symbol +" , Expiry : "+ signal.expiry +" , TradeSymbol : "+response.data.tsym +" , Token : "+instrument_token_symbol[0].instrument_token+"]";

        var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
        connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="ZEBULL" WHERE `id`=' + bro_res_last_id, (err, result) => {
           // console.log("err update token", err);
        });

      }
 


      var data = get_orderdata(item, signal, result, connection ,last_signal_id,instrument_token_symbol,bro_res_last_id,filePath,response.data.tsym);
      console.log('Zebull Entry New ',data)
    
      if (data !== undefined) {
          var send_rr = Buffer.from(qs.stringify(data)).toString('base64');
          var raw = "jData="+JSON.stringify(data)+"&jKey="+item.access_token;

          fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n time - '+new Date()+' BEFORE Zebull Place Oredr Entry  =   client Username - ' + item.username + '  client id - '+ item.id + "\n\n" , function(err) {
            if(err) {
                return console.log(err);
            }
           });

    var config = {
      method: 'post',
      url: 'https://go.mynt.in/NorenWClientTP/PlaceOrder',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        //'Content-Type': 'application/json'
      },
      data : raw
    };
    
    axios(config)
    .then(function (response) {
        console.log("ddd order-",response.data);

        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n Time - '+new Date()+' AFTER  Zebull Place Oredr Entry  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry -'+JSON.stringify(response.data)+ "***\n\n" , function(err) {
            if(err) {
                return console.log(err);
            }
           });


        
        if(response.data.stat == "Ok"){
            console.log(response.data.norenordno);

             

      data = {uid:item.client_code,norenordno:response.data.norenordno}
    
      var raw = "jData="+JSON.stringify(data)+"&jKey="+item.access_token;

    var config = {
      method: 'post',
      url: 'https://go.mynt.in/NorenWClientTP/SingleOrdHist',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data : raw
    };
    
    axios(config)
    .then(function (response1) {
        //console.log("ddd order history dddd-",JSON.stringify(response1.data));
      //  console.log("ddd order history-",JSON.stringify(response1.data[0].status));
       
      var orderstatus = response1.data[0].status


      if(response1.data[0].stat == "Ok"){
      connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+response.data.norenordno+'" ,`order_status`="'+response1.data[0].status+'" ,`reject_reason`="'+response1.data[0].rejreason+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
        //console.log("err", err);
    });



    connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[0].order_type + ',"BUY","' + signal.input_symbol + '",' + result[0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data.norenordno + ',"' + get_date() + '","",' + signal.id + ',"' + response1.data[0].status + '","'+last_signal_id+'","'+signal.type+'")', (err, client_transaction) => {
        //console.log(err);
    });  
    
    fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nZebull Place Oredr Entry  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry -'+JSON.stringify(response1.data)+ "***\n\n" , function(err) {
        if(err) {
            return console.log(err);
        }
       });

   }else{

    fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nZebull Place Oredr Entry Else orderhistory single=   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry Catch-'+JSON.stringify(response1.data)+ "***\n\n" , function(err) {
        if(err) {
            return console.log(err);
        }
        });

   }


    })
    .catch(function (error) {
      console.log("error -- ",error);
      fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nZebull Place Oredr Entry  orderhistory single catch =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry Catch-'+JSON.stringify(error.response.data)+ "***\n\n" , function(err) {
        if(err) {
            return console.log(err);
        }
        });
   

    });


        }else{
            console.log("elsee");

            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nZebull Place Oredr Entry Else =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry -'+JSON.stringify(response.data)+ "***\n\n" , function(err) {
                if(err) {
                    return console.log(err);
                }
               });

               const message = (JSON.stringify(response.data)).replace(/["',]/g, '');

               connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                   //console.log("err", err);
               });



        }
        
    })
    .catch(function (error) {
      console.log("error -- ",error.response.data);
      fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nZebull Place Oredr Entry Catch =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Entry Catch-'+JSON.stringify(error.response.data)+ "***\n\n" , function(err) {
        if(err) {
            return console.log(err);
        }
        });

        const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');

        connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
            //console.log("err", err);
        });


      if(error.response.data.stat == "Not_Ok"){
       console.log("emass",error.response.data.emsg);

       connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_status`="Error" ,`reject_reason`="'+error.response.data.emsg+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
        //console.log("err", err);
    });


      }
    });
        
        
        
   
        
      }


  })
  .catch(function (error) {
    console.log("error -- ",error);
  });


 
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

     
        
    });


});

}catch (e) {
    console.log('zebull Inside Placeorder',e);
  }

}

const get_orderdata = (item, signal, result, connection ,last_signal_id,instrument_token_symbol,bro_res_last_id,filePath,zebull_tradesymbol) => {
    // console.log(result);
    try{

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

   
    var trantype;

    if (signal.type == 'LE' || signal.type == 'SX') {
        trantype = 'B';
    } else if (signal.type == 'SE' || signal.type == 'LX') {
        trantype = 'S';
    }
   




    // var  complexty
    // var  discqty = "0";
    // var  pCode;
    // var  prctyp;
    // var  price = "";
    // var  qty = result[0].qty;
    // var  ret = "DAY";
    // var  stopLoss ="";
    // var  symbol_id = instrument_token_symbol[0].instrument_token;
    // var  target = "0";
    // var trading_symbol;
    // trading_symbol=instrument_token_symbol[0].tradesymbol;
   
    // var  trailing_stop_loss = "0";
    //     var  trigPrice = "";


    console.log("result client -",result);
    console.log("result qty -",result[0].qty);


        var  uid =item.client_code;
        var  actid = item.client_code;
        var  tsym =zebull_tradesymbol;
        var  qty = result[0].qty.toString();
        var  mkt_protection="MKT";
        var  prc ="0";
        var  trgprc="0";
        var  dscqty="0"
        var prctyp="";
        var ret="DAY";
        var ordersource = "WEB"

    if ((signal.type == 'LE' || signal.type == 'SX') && result[0].order_type == '1' &&  result[0].product_type == '1') {
        prctyp = 'MKT';
        prd = 'C';   
     }



   else if ((signal.type == 'LX' || signal.type == 'SE') && result[0].order_type == '1' &&  result[0].product_type == '1') {
        prctyp = 'MKT';
        prd = 'C'; 
               
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[0].order_type == '2' &&  result[0].product_type == '1') {
        prctyp = 'LMT';
        prc = signal.price;
        prd = 'C';
         
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[0].order_type == '2' &&  result[0].product_type == '1') {
        prctyp = 'LMT';
        prc = signal.price;
        prd = 'C';
        
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[0].order_type == '3' &&  result[0].product_type == '1') {
        prctyp = 'SL-LMT';
        prc = signal.price;
        prd = 'C';
        trgprc = signal.tr_price;
         
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[0].order_type == '3' &&  result[0].product_type == '1') {
        prctyp = 'SL-LMT';
        prc = signal.price;
        prd = 'C';
        trgprc = signal.tr_price;
         
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[0].order_type == '4' &&  result[0].product_type == '1') {

        prctyp = 'SL-MKT';
        prc = signal.price;
        prd = 'C'; 
        trgprc = signal.tr_price;
        
   }
   else if ((signal.type == 'LX' || signal.type == 'SE') && result[0].order_type == '4' &&  result[0].product_type == '1') {

    prctyp = 'SL-MKT';
    prc = signal.price;
    prd = 'C'; 
    trgprc = signal.tr_price;
    
}
  
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[0].order_type == '1' &&  result[0].product_type == '2') {
        prctyp = 'MKT';
        prd = 'I';
         
        
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[0].order_type == '1' &&  result[0].product_type == '2') {
        prctyp = 'MKT';
        prd = 'I';
         
        
    } 
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[0].order_type == '2' &&  result[0].product_type == '2') {

        prctyp = 'LMT';
        prc = signal.price;
        prd = 'I';
         
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[0].order_type == '2' &&  result[0].product_type == '2') {

        prctyp = 'LMT';
        prc = signal.price;
        prd = 'I';
         
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[0].order_type == '3' &&  result[0].product_type == '2') {
        prctyp = 'SL-LMT';
        prc = signal.price;
        prd = 'I';
        trgprc = signal.tr_price;
        
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[0].order_type == '3' &&  result[0].product_type == '2') {
        prctyp = 'SL-LMT';
        prc = signal.price;
        prd = 'I';
        trgprc = signal.tr_price;
         
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[0].order_type == '4' &&  result[0].product_type == '2') {

        prctyp = 'SL-MKT';
        prc = signal.price;
        prd = 'I';
        trgprc = signal.tr_price;
        
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[0].order_type == '4' &&  result[0].product_type == '2') {

        prctyp = 'SL-MKT';
        prc = signal.price;
        prd = 'I';
        trgprc = signal.tr_price;
         
        
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[0].order_type == '1' && result[0].product_type == '4') {
        prctyp = 'MKT';
        prd = 'H';
         
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[0].order_type == '1' && result[0].product_type == '4') {
        prctyp = 'MKT';
        prd = 'H';
        
    }

    else if ((signal.type == 'LE' || signal.type == 'SX') && result[0].order_type == '2' && result[0].product_type == '4') {
        prctyp = 'LMT';
        prc = signal.price;
        trgprc = signal.tr_price;
        prd = 'H';
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[0].order_type == '2' && result[0].product_type == '4') {
        prctyp = 'LMT';
        prc = signal.price;
        trgprc = signal.tr_price;
        prd = 'H';
        
    }
     else if ((signal.type == 'LE' || signal.type == 'SX') && result[0].order_type == '2' &&  result[0].product_type == '3') {

        console.log('order BO')
        prctyp = 'LMT';
        prc = signal.price;
        prd = 'B';
        // stopLoss = signal.sl_value;
        // target = signal.sq_value;
        // trailing_stop_loss = signal.tsl;
    } 
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[0].order_type == '2' &&  result[0].product_type == '3') {
        prctyp = 'LMT';
        prc = signal.price;
        prd = 'B';
        // stopLoss = signal.sl_value;
        // target = signal.sq_value;
        // trailing_stop_loss = signal.tsl;
    } 
     else if ((signal.type == 'LE' || signal.type == 'SX') && result[0].order_type == '3' &&  result[0].product_type == '3') {

        prctyp = 'SL-LMT';
        prc = signal.price;
        prd = 'B';
        trgprc = signal.tr_price;
        // stopLoss = signal.sl_value;
        // target = signal.sq_value;
        // trailing_stop_loss = signal.tsl;
        
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[0].order_type == '3' &&  result[0].product_type == '3') {

        prctyp = 'SL-LMT';
        prc = signal.price;
        prd = 'B';
        trgprc = signal.tr_price;
        // stopLoss = signal.sl_value;
        // target = signal.sq_value;
        // trailing_stop_loss = signal.tsl;
        
    }


   
    if(result[0].product_type == '1'){
        if (signal.segment == 'F' || signal.segment == 'f' || signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo') {
            prd = 'M';
            }   
    }



    if (signal.type == 'SX' || signal.type == 'LX') {

        
                 data = {uid:item.client_code,actid:item.client_code,ret:"NET"}
                
                var raw = "jData="+JSON.stringify(data)+"&jKey="+item.access_token;

                var config = {
                method: 'post',
                url: 'https://go.mynt.in/NorenWClientTP/PositionBook',
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data : raw
                };

                axios(config)
                    .then(function(response_position) {
                    
                     console.log("res response_position- ",response_position.data);


                    
                     response_position.data.forEach(function(item1, index) {
                       
                            if(item1.tsym == zebull_tradesymbol){
                                var possition_qty =parseInt(item1.daybuyqty)-parseInt(item1.daysellqty);
                                 connection.query('UPDATE `broker_response` SET `open_possition_qty`="' + possition_qty + '" WHERE `id`=' + bro_res_last_id, (err, result_p) => {
                                    //console.log("err", err);
                                })

                                if((item1.daybuyqty - item1.daysellqty) > 0 && signal.type=='LX'){
                                  
                                    var data = {
                                        uid:uid,
                                        actid:uid,
                                        exch:exch,
                                        tsym:tsym,
                                        qty:qty,
                                        mkt_protection:mkt_protection,
                                        prc:prc,
                                        trgprc:trgprc,
                                        dscqty:dscqty,
                                        prd:prd,
                                        trantype:trantype,
                                        prctyp:prctyp,
                                        ret:ret,
                                        ordersource:ordersource
                                     }

                              var send_rr = Buffer.from(qs.stringify(data)).toString('base64');
                              var raw = "jData="+JSON.stringify(data)+"&jKey="+item.access_token;
                             
                              fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n Time - '+new Date()+' BEFORE Zebull Place Oredr EXIT  =   client Username - ' + item.username + '  client id - '+ item.id + "\n\n" , function(err) {
                                if(err) {
                                    return console.log(err);
                                }
                               });


                              var config = {
                                method: 'post',
                                url: 'https://go.mynt.in/NorenWClientTP/PlaceOrder',
                                headers: { 
                                  'Content-Type': 'application/x-www-form-urlencoded',
                                  //'Content-Type': 'application/json'
                                },
                                data : raw
                              };
                              
                              axios(config)
                              .then(function (response) {
                                  console.log("ddd order-",response.data);
                          
                                  fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n Time - '+new Date()+' AFTER Zebull Place Oredr Exit  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit -'+JSON.stringify(response.data)+ "***\n\n" , function(err) {
                                      if(err) {
                                          return console.log(err);
                                      }
                                     });
                          
                          
                                  
                                  if(response.data.stat == "Ok"){
                                      console.log(response.data.norenordno);
                          
                                       
                          
                                data = {uid:item.client_code,norenordno:response.data.norenordno}
                              
                                var raw = "jData="+JSON.stringify(data)+"&jKey="+item.access_token;
                          
                              var config = {
                                method: 'post',
                                url: 'https://go.mynt.in/NorenWClientTP/SingleOrdHist',
                                headers: { 
                                  'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                data : raw
                              };
                              
                              axios(config)
                              .then(function (response1) {
                                  console.log("ddd order history dddd-",JSON.stringify(response1.data));
                                  console.log("ddd order history-",JSON.stringify(response1.data[0].status));
                                 
                                var orderstatus = response1.data[0].status

                                fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nZebull Place Oredr Exit  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit -'+JSON.stringify(response1.data)+ "***\n\n" , function(err) {
                                    if(err) {
                                        return console.log(err);
                                    }
                                   });
                          
                                if(response1.data[0].stat == "Ok"){
                                connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+response.data.norenordno+'" ,`order_status`="'+response1.data[0].status+'" ,`reject_reason`="'+response1.data[0].rejreason+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                  //console.log("err", err);
                              });
                          
                          
                          
                              connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[0].order_type + ',"BUY","' + signal.input_symbol + '",' + result[0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data.norenordno + ',"' + get_date() + '","",' + signal.id + ',"' + response1.data[0].status + '","'+last_signal_id+'","'+signal.type+'")', (err, client_transaction) => {
                                  //console.log(err);
                              });   
                          
                             }else{
                          
                              fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nZebull Place Oredr Exit Else orderhistory single=   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit Catch-'+JSON.stringify(response1.data)+ "***\n\n" , function(err) {
                                  if(err) {
                                      return console.log(err);
                                  }
                                  });

                                  const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');

                                connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                    //console.log("err", err);
                                });
                          
                             }
                          
                          
                              })
                              .catch(function (error) {
                                console.log("error -- ",error);
                                fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nZebull Place Oredr Exit  orderhistory single catch =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit Catch-'+JSON.stringify(error.response.data)+ "***\n\n" , function(err) {
                                  if(err) {
                                      return console.log(err);
                                  }
                                  });



                                  const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');

                                    connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                        //console.log("err", err);
                                    });



                             
                          
                              });
                          
                          
                                  }else{
                                      console.log("elsee");
                          
                                      fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nZebull Place Oredr Exit Else =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit -'+JSON.stringify(response.data)+ "***\n\n" , function(err) {
                                          if(err) {
                                              return console.log(err);
                                          }
                                         });


                                         const message = (JSON.stringify(response.data)).replace(/["',]/g, '');

                                        connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                            //console.log("err", err);
                                        });
                          
                                  }
                                  
                              })
                              .catch(function (error) {
                                console.log("error -- ",error.response.data);
                          
                                fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nZebull Place Oredr Exit Catch =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit Catch-'+JSON.stringify(error.response.data)+ "***\n\n" , function(err) {
                                  if(err) {
                                      return console.log(err);
                                  }
                                  });

                                  const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');

                                  connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                      //console.log("err", err);
                                  });
                          
                          
                                if(error.response.data.stat == "Not_Ok"){
                                 console.log("emass",error.response.data.emsg);
                          
                                 connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_status`="Error" ,`reject_reason`="'+error.response.data.emsg+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                  //console.log("err", err);
                              });
                          
                          
                                }
                              });
                                        

                                        data = '';
                                        return data;   


                                }
                               else if((item1.daybuyqty - item1.daysellqty) > 0 && signal.type=='SX'){
                                  
                                  var data = {
                                     uid:uid,
                                     actid:uid,
                                     exch:exch,
                                     tsym:tsym,
                                     qty:qty,
                                     mkt_protection:mkt_protection,
                                     prc:prc,
                                     trgprc:trgprc,
                                     dscqty:dscqty,
                                     prd:prd,
                                     trantype:trantype,
                                     prctyp:prctyp,
                                     ret:ret,
                                     ordersource:ordersource
                                  }  




                              var send_rr = Buffer.from(qs.stringify(data)).toString('base64');
                              var raw = "jData="+JSON.stringify(data)+"&jKey="+item.access_token;

                              fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n Time - '+new Date()+' BEFORE Zebull Place Oredr EXIT  =   client Username - ' + item.username + '  client id - '+ item.id + "\n\n" , function(err) {
                                if(err) {
                                    return console.log(err);
                                }
                               });
                          
                              var config = {
                                method: 'post',
                                url: 'https://go.mynt.in/NorenWClientTP/PlaceOrder',
                                headers: { 
                                  'Content-Type': 'application/x-www-form-urlencoded',
                                  //'Content-Type': 'application/json'
                                },
                                data : raw
                              };
                              
                              axios(config)
                              .then(function (response) {
                                  console.log("ddd order-",response.data);
                          
                                  fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nTime - '+new Date()+' AFTER Zebull Place Oredr Exit  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit -'+JSON.stringify(response.data)+ "***\n\n" , function(err) {
                                      if(err) {
                                          return console.log(err);
                                      }
                                     });
                          
                          
                                  
                                  if(response.data.stat == "Ok"){
                                      console.log(response.data.norenordno);
                          
                                       
                          
                                data = {uid:item.client_code,norenordno:response.data.norenordno}
                              
                                var raw = "jData="+JSON.stringify(data)+"&jKey="+item.access_token;
                          
                              var config = {
                                method: 'post',
                                url: 'https://go.mynt.in/NorenWClientTP/SingleOrdHist',
                                headers: { 
                                  'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                data : raw
                              };
                              
                              axios(config)
                              .then(function (response1) {
                                  console.log("ddd order history dddd-",JSON.stringify(response1.data));
                                  console.log("ddd order history-",JSON.stringify(response1.data[0].status));
                                 
                                var orderstatus = response1.data[0].status
                          
                                fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nZebull Place Oredr Exit  =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit -'+JSON.stringify(response1.data)+ "***\n\n" , function(err) {
                                    if(err) {
                                        return console.log(err);
                                    }
                                   });
                          
                                if(response1.data[0].stat == "Ok"){
                                connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_id`="'+response.data.norenordno+'" ,`order_status`="'+response1.data[0].status+'" ,`reject_reason`="'+response1.data[0].rejreason+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                  //console.log("err", err);
                              });
                          
                          
                          
                              connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[0].order_type + ',"BUY","' + signal.input_symbol + '",' + result[0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data.norenordno + ',"' + get_date() + '","",' + signal.id + ',"' + response1.data[0].status + '","'+last_signal_id+'","'+signal.type+'")', (err, client_transaction) => {
                                  //console.log(err);
                              });   
                          
                             }else{
                          
                              fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nZebull Place Oredr Exit Else orderhistory single=   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit Catch-'+JSON.stringify(response1.data)+ "***\n\n" , function(err) {
                                  if(err) {
                                      return console.log(err);
                                  }
                                  });
                          
                             }
                          
                          
                              })
                              .catch(function (error) {
                                console.log("error -- ",error);
                                fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nZebull Place Oredr Exit  orderhistory single catch =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit Catch-'+JSON.stringify(error.response.data)+ "***\n\n" , function(err) {
                                  if(err) {
                                      return console.log(err);
                                  }
                                  });
                             
                          
                              });
                          
                          
                                  }else{
                                      console.log("elsee");
                          
                                      fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nZebull Place Oredr Exit Else =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit -'+JSON.stringify(response.data)+ "***\n\n" , function(err) {
                                          if(err) {
                                              return console.log(err);
                                          }
                                         });


                                         const message = (JSON.stringify(response.data)).replace(/["',]/g, '');

                                         connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                             //console.log("err", err);
                                         });
                          
                                  }
                                  
                              })
                              .catch(function (error) {
                                console.log("error -- ",error.response.data);
                          
                                fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nZebull Place Oredr Exit Catch =   client Username - ' + item.username + '  client id - '+ item.id + ' Place Oredr Exit Catch-'+JSON.stringify(error.response.data)+ "***\n\n" , function(err) {
                                  if(err) {
                                      return console.log(err);
                                  }
                                  });

                                  const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');

                                  connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                      //console.log("err", err);
                                  });
                          
                          
                                if(error.response.data.stat == "Not_Ok"){
                                 console.log("emass",error.response.data.emsg);
                          
                                 connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="'+signal.input_symbol+'" ,`send_request`="'+send_rr+'",`order_status`="Error" ,`reject_reason`="'+error.response.data.emsg+'" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                  //console.log("err", err);
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
        
        console.log("ppppppppp");
        return_data = 
           {
            uid:uid,
            actid:uid,
            exch:exch,
            tsym:tsym,
            qty:qty,
            mkt_protection:mkt_protection,
            prc:prc,
            trgprc:trgprc,
            dscqty:dscqty,
            prd:prd,
            trantype:trantype,
            prctyp:prctyp,
            ret:ret,
            ordersource:ordersource
        }


        return return_data;
    }



}catch (e) {
    console.log('zebull Blue Get Order',e);
  }


}

module.exports = { place_order, access_token }