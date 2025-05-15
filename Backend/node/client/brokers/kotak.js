var axios = require('axios');
// var request = require("request");
var FormData = require('form-data');
var qs = require('qs');
const fs = require('fs');
const sha256 = require('sha256');
const path = require('path');
const { exec } = require('child_process');







var http = require("http");
var dateTime = require('node-datetime');
// const log4js = require("log4js");
// log4js.configure({
//     appenders: { cheese: { type: "file", filename: "cheese.log" } },
//     categories: { default: { appenders: ["cheese"], level: "info" } }
// });

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


const place_order = (item, signal, connection, last_signal_id, connection2, bro_res_last_id, filePath) => {


    try {

        if (signal.segment == 'C' || signal.segment == 'c') {
            console.log('symbol - ', signal.input_symbol);
            var instrument_query = "SELECT *  FROM `services` WHERE `service` LIKE '" + signal.input_symbol + "'";
        } else if (signal.segment == 'F' || signal.segment == 'f') {
            var instrument_query = "SELECT *  FROM `token_symbol` WHERE `symbol` LIKE '" + signal.input_symbol + "' AND `expiry` LIKE '" + signal.expiry + "' AND `segment` LIKE 'F' ";
        } else if (signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo') {
            var option_type;
            if (signal.option_type == "Call" || signal.option_type == "CALL") {
                option_type = "CE";
            } else if (signal.option_type == "Put" || signal.option_type == "PUT") {
                option_type = "PE";
            }
            var instrument_query = "SELECT *  FROM `token_symbol` WHERE `symbol` LIKE '" + signal.input_symbol + "' AND `expiry` LIKE '" + signal.expiry + "' AND `segment` LIKE 'O' AND `strike` LIKE '" + signal.strike + "' AND `option_type`='" + option_type + "'";

        } else if (signal.segment == 'MO' || signal.segment == 'mo') {

            var option_type;
            if (signal.option_type == "Call" || signal.option_type == "CALL") {
                option_type = "CE";
            } else if (signal.option_type == "Put" || signal.option_type == "PUT") {
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

            try {

                //console.log(' err - ', err);
                console.log("instrument_token_symbol",instrument_token_symbol);
                var segment = signal.segment

                if (segment == "FO" || segment == "fo") {
                    segment = 'O';
                }
        
        
            connection.query('' + instrument_query + ';SELECT * FROM `client_service` LEFT JOIN `services` ON `services`.`id` = `client_service`.`service_id` LEFT JOIN `client` ON `client`.`id` = `client_service`.`client_id` LEFT JOIN `categorie` ON `categorie`.`id` = `services`.`categorie_id`  WHERE `client_service`.`client_id` = "' + item.id + '" AND `services`.`service` = "' + signal.input_symbol + '" AND `categorie`.`segment`="'+segment+'"', [1, 2], (err, result) => {
                
             //   console.log('result[0].length > 0 -',result[0].length);
               // console.log('result[1].length > 0 -',result[1].length);

                    try {

                        
                        if (result[0].length > 0 || result[1].length > 0) {

                         //   console.log('instrument_token_symbol -',instrument_token_symbol);
                         


                            // var tradesymbol = '';

                            // if (instrument_token_symbol[0].tradesymbol == undefined) {
                            //     tradesymbol = "tradesymbol";
                            // } else {
                            //     tradesymbol = instrument_token_symbol[0].tradesymbol;
                            // }

                            // Broker Reponse Print Token   
                            if (signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo') {


                                var signal_sy = "[symbol : " + signal.input_symbol + " , Expiry : " + signal.expiry + "  , Strike : " + signal.strike + " , option_type :" + signal.option_type + " , TradeSymbol : " + instrument_token_symbol[0].instrument_token + " , Token : " + instrument_token_symbol[0].instrument_token + "]";
                                var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
                                connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="Kotak" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                    //console.log("err update token", err);
                                })


                            } else if (signal.segment == 'C' || signal.segment == 'c') {

                                var signal_sy = "[symbol : " + signal.input_symbol + " , TradeSymbol : " + instrument_token_symbol[0].instrument_token + " , Token : " + instrument_token_symbol[0].instrument_token + "]";
                                var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
                                connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="Kotak" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                    //console.log("err update token", err);
                                })



                            } else {

                                var signal_sy = "[symbol : " + signal.input_symbol + " , Expiry : " + signal.expiry + " , TradeSymbol : " + instrument_token_symbol[0].instrument_token + " , Token : " + instrument_token_symbol[0].instrument_token + "]";
                                var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
                                connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="Kotak" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                    //console.log("err update token", err);
                                })



                            }

                        } else {

                            if (signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo') {

                                var signal_sy = "[symbol : " + signal.input_symbol + " , Expiry : " + signal.expiry + "  , Strike : " + signal.strike + " , option_type :" + signal.option_type + " , TradeSymbol : NULL , Token : NULL]";
                                var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
                                connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="Kotak" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                    //console.log("err", err);
                                })

                            } else {

                                var signal_sy = "[symbol : " + signal.input_symbol + " , Expiry : " + signal.expiry + " , TradeSymbol : NULL , Token : NULL]";
                                var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
                                connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="Kotak" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                    //console.log("err", err);
                                })


                            }


                        }

                        // console.log(err);
                        if (result[1].length > 0 || result[0].length > 0) {


                            const filePath = path.join(__dirname , '.././kotak_token.txt');
                            const command = 'grep "|'+instrument_token_symbol[0].instrument_token+'|" '+filePath+'';
                            console.log("commad",command)
                            
                            exec(command, (error, stdout, stderr) => {
                              if (error) {
                                console.error(`exec error: ${error}`);
                                return;
                              }
                            
                             
                              const parts = stdout.split('|');


                            var data = get_orderdata(item, signal, result, connection, last_signal_id, instrument_token_symbol, bro_res_last_id, filePath,parts)

                            console.log("data",data);
                            if (data !== undefined) {


                                console.log("data.product_type", data.product_type);


                                var order_url;

                                //Product Type CNC 
                                if (data.product_type == 1) {
                                    order_url = 'https://tradeapi.kotaksecurities.com/apim/orders/1.0/order/normal'
                                } else if (data.product_type == 2) {
                                    order_url = 'https://tradeapi.kotaksecurities.com/apim/orders/1.0/order/mis'
                                }

                        

                                var data = JSON.stringify({
                                    "instrumentToken": Number(data.instrumentToken),
                                    "transactionType": data.transactionType,
                                    "quantity": Number(data.quantity),
                                    "price": Number(data.price),
                                    "validity": data.validity,
                                    "variety": data.variety,
                                    "disclosedQuantity": data.disclosedQuantity,
                                    "triggerPrice": data.triggerPrice,
                                    "tag": data.tag
                                });
                                       
                              var send_rr = Buffer.from(JSON.stringify(data)).toString('base64');

                              

                               let config = {
                                    method: 'post',
                                    maxBodyLength: Infinity,
                                    url: order_url,
                                    headers: { 
                                      'consumerKey': item.api_key, 
                                      'sessionToken': item.access_token, 
                                      'Authorization': 'Bearer '+item.demat_userid, 
                                      'Content-Type': 'application/json'
                                    },
                                    data : data
                                  };


                                console.log("config", config);


                                var datetime = new Date();
                                axios(config)
                                    .then(function (response) {
                                        var datetime = new Date();
                                        
                                       
                                        console.log("Entry Order =>", response.data);
                                        // console.log("Entry fault =>", response.data.fault);


                                        if (response.data.Success) {

                                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nKotak Place Oredr Entry  =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Entry -' + JSON.stringify(response.data.Success) + "***\n\n", function (err) {
                                                if (err) {
                                                    return console.log(err);
                                                }
                                            });



                                            var config1 = {
                                                method: 'get',
                                                maxBodyLength: Infinity,
                                                url: 'https://tradeapi.kotaksecurities.com/apim/reports/1.0/orders',
                                                headers: {
                                                    'Authorization': 'Bearer ' + item.demat_userid,
                                                    'consumerKey': item.api_key,
                                                    'sessionToken': item.access_token,
                                                }
                                            };

                                            axios(config1)
                                                .then(function (response1) {
                                                   

                                                    if (response.data.Success) {

                                                        response1.data.success.forEach((val) => {

                                                            if (val.orderId == response.data.Success.NSE.orderId) {

                                                                console.log("Order Deteails ", val);


                                                                connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_id`="' + response.data.Success.NSE.orderId + '" ,`order_status`="' + val.statusInfo + '" ,`reject_reason`="' + val.statusMessage + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                                    //console.log("err", err);
                                                                });

                                                            }

                                                        })
                                                    }



                                                    connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"BUY","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data.Success.NSE.orderId + ',"' + get_date() + '","",' + signal.id + ',"' + response.data.Success.NSE.message + '","' + last_signal_id + '","' + signal.type + '")', (err, client_transaction) => {
                                                        //console.log(err);
                                                    });





                                                })
                                                .catch(function (error) {
                                                    // console.log(error);

                                                    fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nKotak Place Oredr Entry Catch =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Entry Catch -' + JSON.stringify(error.response) + "***\n\n", function (err) {
                                                        if (err) {
                                                            return console.log(err);
                                                        }
                                                    });
                                                });

                                        }
                                        else{

                                            const message = (JSON.stringify(response.data)).replace(/["',]/g, '');

                                        connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                            //console.log("err", err);
                                        });

                                        }


                                    })
                                    .catch(function (error) {
                                       // console.log("Error", error.response.data);
                                        // var send_rr = Buffer.from(JSON.stringify(data)).toString('base64');

                                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nKotak Place Oredr Entry Catch =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Entry Catch -' + JSON.stringify(error.response.data) + "***\n\n", function (err) {
                                            if (err) {
                                                return console.log(err);
                                            }
                                        });

                                        const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');

                                        connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                            //console.log("err", err);
                                        });

                                    });






                            }

                            
                        });

                        }


                    } catch (e) {
                        console.log('Kotak Instrument query', e);
                    }

                });

            } catch (e) {
                console.log('Kotak Token Symbol S', e);
            }

        });
    } catch (e) {
        console.log('Kotak Inside Placeorder', e);
    }

}

const get_orderdata = (item, signal, result, connection, last_signal_id, instrument_token_symbol, bro_res_last_id, filePath,parts) => {
    // console.log('inside trade');
    var is_reject = false;
    var data11;


    try {
        
    


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


        var transactiontype = '';

        if (signal.type == 'LE' || signal.type == 'SX') {
            transactiontype = "BUY";
        } else if (signal.type == 'SE' || signal.type == 'LX') {
            transactiontype = "SELL";
        }



        var instrument_token;
        var quantity = result[1][0].qty;
        var price = 0;
        var validity = "GFD"
        var variety = "REGULAR";
        var disclosedQuantity = 0;
        var triggerPrice = 0;
        var tag = "string"




        if (signal.segment == 'C' || signal.segment == 'c') {
            instrument_token = instrument_token_symbol[0].kotak_token;
        } else {
        
            instrument_token= parts[0];                   
        }

        console.log("instrument_token",instrument_token);

        if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' && result[1][0].product_type == '1') {
            console.log('inside cnc')
            ordertype = 'MARKET';
            producttype = 'DELIVERY';
        }
        else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' && result[1][0].product_type == '1') {
            console.log('inside cnc')
            ordertype = 'MARKET';
            producttype = 'DELIVERY';
        }
        else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' && result[1][0].product_type == '1') {
            ordertype = 'LIMIT';
            producttype = 'DELIVERY';
            price = signal.price;
        }
        else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' && result[1][0].product_type == '1') {
            ordertype = 'LIMIT';
            producttype = 'DELIVERY';
            price = signal.price;
        }
        else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' && result[1][0].product_type == '1') {
            ordertype = 'STOPLOSS_LIMIT';
            producttype = 'DELIVERY';
            price = signal.price;
            triggerprice = signal.tr_price;
        }
        else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' && result[1][0].product_type == '1') {
            ordertype = 'STOPLOSS_LIMIT';
            producttype = 'DELIVERY';
            price = signal.price;
            triggerprice = signal.tr_price;
        }
        else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '4' && result[1][0].product_type == '1') {
            console.log('product CNC');
            ordertype = 'STOPLOSS_MARKET';
            producttype = 'DELIVERY';
            triggerprice = signal.tr_price;
        }
        else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '4' && result[1][0].product_type == '1') {
            console.log('product CNC');
            ordertype = 'STOPLOSS_MARKET';
            producttype = 'DELIVERY';
            triggerprice = signal.tr_price;
        }
        else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' && result[1][0].product_type == '2') {
            console.log('product MIS');
            ordertype = 'MARKET';
            producttype = 'INTRADAY';

        }
        else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' && result[1][0].product_type == '2') {
            console.log('inside lx');
            console.log('product MIS LX OR SE');
            ordertype = 'MARKET';
            producttype = 'INTRADAY';

        }
        else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' && result[1][0].product_type == '2') {
            ordertype = 'LIMIT';
            producttype = 'INTRADAY';
            price = signal.price;
        }
        else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' && result[1][0].product_type == '2') {
            ordertype = 'LIMIT';
            producttype = 'INTRADAY';
            price = signal.price;
        }
        else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' && result[1][0].product_type == '2') {
            ordertype = 'STOPLOSS_LIMIT';
            producttype = 'INTRADAY';
            price = signal.price;
            triggerprice = signal.tr_price;
        }
        else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' && result[1][0].product_type == '2') {
            ordertype = 'STOPLOSS_LIMIT';
            producttype = 'INTRADAY';
            price = signal.price;
            triggerprice = signal.tr_price;
        }
        else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '4' && result[1][0].product_type == '2') {
            ordertype = 'STOPLOSS_MARKET';
            producttype = 'INTRADAY';
            triggerprice = signal.tr_price;
        }
        else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '4' && result[1][0].product_type == '2') {
            ordertype = 'STOPLOSS_MARKET';
            producttype = 'INTRADAY';
            triggerprice = signal.tr_price;
        }
        else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' && result[1][0].product_type == '4') {
            ordertype = 'MARKET';
            producttype = 'INTRADAY';
        }
        else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' && result[1][0].product_type == '4') {
            ordertype = 'MARKET';
            producttype = 'INTRADAY';
        }
        else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' && result[1][0].product_type == '4') {
            ordertype = 'LIMIT';
            producttype = 'INTRADAY';
            price = signal.price;
        }
        else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' && result[1][0].product_type == '4') {
            ordertype = 'LIMIT';
            producttype = 'INTRADAY';
            price = signal.price;
        }
        else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' && result[1][0].product_type == '3') {
            ordertype = 'LIMIT';
            price = signal.price;
            producttype = 'BO';
            stoploss = signal.sl_value;
            squareoff = signal.sq_value;
            trailingStopLoss = signal.tsl;
        }
        else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' && result[1][0].product_type == '3') {
            ordertype = 'LIMIT';
            price = signal.price;
            producttype = 'BO';
            stoploss = signal.sl_value;
            squareoff = signal.sq_value;
            trailingStopLoss = signal.tsl;
        }
        else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' && result[1][0].product_type == '3') {
            ordertype = 'STOPLOSS_LIMIT';
            price = signal.price;
            producttype = 'BO';
            triggerprice = signal.tr_price;
            stoploss = signal.sl_value;
            squareoff = signal.sq_value;
            trailingStopLoss = signal.tsl;
        }
        else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' && result[1][0].product_type == '3') {
            ordertype = 'STOPLOSS_LIMIT';
            price = signal.price;
            producttype = 'BO';
            triggerprice = signal.tr_price;
            stoploss = signal.sl_value;
            squareoff = signal.sq_value;
            trailingStopLoss = signal.tsl;
        }


        if (result[1][0].product_type == '1') {
            if (signal.segment == 'F' || signal.segment == 'f' || signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo' || signal.segment == 'MO' || signal.segment == 'mo') {
                producttype = "CARRYFORWARD";
            }
        }
        console.log("price", price);
        console.log("signal.price", signal.price);



        if (signal.type == 'SX' || signal.type == 'LX') {



            var config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'https://tradeapi.kotaksecurities.com/apim/positions/1.0/positions/open',
                headers: {
                    'Authorization': 'Bearer ' + item.demat_userid,
                    'consumerKey': item.api_key,
                    'sessionToken': item.access_token,
                }
            };

            axios(config)
                .then(function (response) {
                    console.log("symboltoken", instrument_token);
                    console.log("Position", response.data.Success.length);

                    if(response.data.Success.length == 0){
                        connection.query('UPDATE `broker_response` SET `open_possition_qty`="0" WHERE `id`=' + bro_res_last_id, (err, result_p) => {
                            console.log("err", err);
                        })
                    }

                
                    response.data.Success.forEach(function (item1, index) {


                        if (item1.instrumentToken == instrument_token) {    

                            console.log("item1", item1);

                            var possition_qty = item1.netTrdQtyLot;

                            console.log("possition_qty", possition_qty);

                            connection.query('UPDATE `broker_response` SET `open_possition_qty`="' + possition_qty + '" WHERE `id`=' + bro_res_last_id, (err, result_p) => {
                                console.log("err", err);
                            })

                            if (possition_qty > 0 && signal.type == 'LX') {

                                data11 = {
                                    "instrumentToken": instrument_token,
                                    "transactionType": transactiontype,
                                    "quantity": quantity,
                                    "price": price,
                                    "validity": validity,
                                    "variety": variety,
                                    "disclosedQuantity": disclosedQuantity,
                                    "triggerPrice": triggerPrice,
                                    "tag": tag,
                                    "product_type": result[1][0].product_type
                                };



                                console.log("Data1", data11);

                                //Product Type CNC 
                                if (data11.product_type == 1) {
                                    order_url = 'https://tradeapi.kotaksecurities.com/apim/orders/1.0/order/normal'
                                } else if (data11.product_type == 2) {
                                    order_url = 'https://tradeapi.kotaksecurities.com/apim/orders/1.0/order/mis'
                                }



                                var config = {
                                    method: 'post',
                                    maxBodyLength: Infinity,
                                    url: order_url,
                                    headers: {
                                        'Authorization': 'Bearer ' + item.demat_userid,
                                        'consumerKey': item.api_key,
                                        'sessionToken': item.access_token,
                                        'Content-Type': 'application/json'
                                    },
                                    data: {

                                        "instrumentToken": Number(data11.instrumentToken),
                                        "transactionType": data11.transactionType,
                                        "quantity": Number(data11.quantity),
                                        "price": Number(data11.price),
                                        "validity": data11.validity,
                                        "variety": data11.variety,
                                        "disclosedQuantity": data11.disclosedQuantity,
                                        "triggerPrice": data11.triggerPrice,
                                        "tag": data11.tag

                                    }
                                };
                                
                                var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');

                                var datetime = new Date();

                                axios(config)
                                    .then(function (response) {

                                        console.log("Exit Order LX =>", response.data);

                                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nKotak Place Oredr Exit =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Exit -' + JSON.stringify(response.data) + "***\n\n", function (err) {
                                            if (err) {
                                                return console.log(err);
                                            }
                                        });

                                        var datetime = new Date();
                                        var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');



                                        if (response.data.Success) {

                                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nKotak Place Oredr Entry  =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Entry -' + JSON.stringify(response.data.Success) + "***\n\n", function (err) {
                                                if (err) {
                                                    return console.log(err);
                                                }
                                            });


                                            var config1 = {
                                                method: 'get',
                                                maxBodyLength: Infinity,
                                                url: 'https://tradeapi.kotaksecurities.com/apim/reports/1.0/orders',
                                                headers: {
                                                    'Authorization': 'Bearer ' + item.demat_userid,
                                                    'consumerKey': item.api_key,
                                                    'sessionToken': item.access_token,
                                                }
                                            };

                                            axios(config1)
                                                .then(function (response1) {
                                                    var send_rr = Buffer.from(JSON.stringify(data)).toString('base64');

                                                    if (response.data.Success) {

                                                        response1.data.success.forEach((val) => {

                                                            if (val.orderId == response.data.Success.NSE.orderId) {

                                                                console.log("Order Deteails ", val);


                                                                connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_id`="' + response.data.Success.NSE.orderId + '" ,`order_status`="' + val.status + '" ,`reject_reason`="' + val.statusInfo + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                                    //console.log("err", err);
                                                                });

                                                            }

                                                        })
                                                    }



                                                    connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"BUY","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data.Success.NSE.orderId + ',"' + get_date() + '","",' + signal.id + ',"' + response.data.Success.NSE.message + '","' + last_signal_id + '","' + signal.type + '")', (err, client_transaction) => {
                                                        //console.log(err);
                                                    });





                                                })
                                                .catch(function (error) {
                                                    console.log(error.response.data);

                                                    fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nKotak Place Oredr Entry Catch =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Entry Catch -' + JSON.stringify(error.response) + "***\n\n", function (err) {
                                                        if (err) {
                                                            return console.log(err);
                                                        }
                                                    });
                                                });

                                        }
                                        else{

                                            const message = (JSON.stringify(response.data)).replace(/["',]/g, '');

                                        connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                            //console.log("err", err);
                                        });

                                        }




                                    })
                                    .catch(function (error) {
                                        // console.log(error);
                                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nKotak Place Oredr Exit Catch =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Exit Catch -' + JSON.stringify(error.response.data) + "***\n\n", function (err) {
                                            if (err) {
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

                            else if (possition_qty < 0 && signal.type == 'SX') {


                                data11 = {
                                    "instrumentToken": instrument_token,
                                    "transactionType": transactiontype,
                                    "quantity": quantity,
                                    "price": price,
                                    "validity": validity,
                                    "variety": variety,
                                    "disclosedQuantity": disclosedQuantity,
                                    "triggerPrice": triggerPrice,
                                    "tag": tag,
                                    "product_type": result[1][0].product_type

                                };


                                console.log("Data1", data11);

                                //Product Type CNC 
                                if (data11.product_type == 1) {
                                    order_url = 'https://tradeapi.kotaksecurities.com/apim/orders/1.0/order/normal'
                                } else if (data11.product_type == 2) {
                                    order_url = 'https://tradeapi.kotaksecurities.com/apim/orders/1.0/order/mis'
                                }
                                var config1 = {
                                    method: 'post',
                                    maxBodyLength: Infinity,
                                    url: order_url,
                                    headers: {
                                        'Authorization': 'Bearer ' + item.demat_userid,
                                        'consumerKey': item.api_key,
                                        'sessionToken': item.access_token,
                                        'Content-Type': 'application/json'
                                    },
                                    data: {

                                        "instrumentToken": Number(data11.instrumentToken),
                                        "transactionType": data11.transactionType,
                                        "quantity": Number(data11.quantity),
                                        "price": Number(data11.price),
                                        "validity": data11.validity,
                                        "variety": data11.variety,
                                        "disclosedQuantity": data11.disclosedQuantity,
                                        "triggerPrice": data11.triggerPrice,
                                        "tag": data11.tag

                                    }
                                };

                                var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');

                                var datetime = new Date();

                                axios(config1)
                                    .then(function (response) {

                                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nKotak Place Oredr Exit  =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Exit  -' + JSON.stringify(response.data) + "***\n\n", function (err) {
                                            if (err) {
                                                return console.log(err);
                                            }
                                        });
                                        var datetime = new Date();

                                        var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');


                                        if (response.data.Success) {

                                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nKotak Place Oredr Entry  =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Entry -' + JSON.stringify(response.data.Success) + "***\n\n", function (err) {
                                                if (err) {
                                                    return console.log(err);
                                                }
                                            });


                                            var config1 = {
                                                method: 'get',
                                                maxBodyLength: Infinity,
                                                url: 'https://tradeapi.kotaksecurities.com/apim/reports/1.0/orders',
                                                headers: {
                                                    'Authorization': 'Bearer ' + item.demat_userid,
                                                    'consumerKey': item.api_key,
                                                    'sessionToken': item.access_token,
                                                }
                                            };

                                            axios(config1)
                                                .then(function (response1) {
                                                    var send_rr = Buffer.from(JSON.stringify(data)).toString('base64');

                                                    if (response.data.Success) {

                                                        response1.data.success.forEach((val) => {

                                                            if (val.orderId == response.data.Success.NSE.orderId) {

                                                                console.log("Order Deteails ", val);


                                                                connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_id`="' + response.data.Success.NSE.orderId + '" ,`order_status`="' + val.status + '" ,`reject_reason`="' + val.statusInfo + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                                    //console.log("err", err);
                                                                });

                                                            }

                                                        })
                                                    }



                                                    connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"BUY","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data.Success.NSE.orderId + ',"' + get_date() + '","",' + signal.id + ',"' + response.data.Success.NSE.message + '","' + last_signal_id + '","' + signal.type + '")', (err, client_transaction) => {
                                                        //console.log(err);
                                                    });





                                                })
                                                .catch(function (error) {
                                                    // console.log(error);

                                                    fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nKotak Place Oredr Entry Catch =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Entry Catch -' + JSON.stringify(error.response) + "***\n\n", function (err) {
                                                        if (err) {
                                                            return console.log(err);
                                                        }
                                                    });
                                                });

                                        }
                                        else{

                                            const message = (JSON.stringify(response.data)).replace(/["',]/g, '');

                                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                //console.log("err", err);
                                            });

                                        }


                                    })
                                    .catch(function (error) {
                                        // console.log(error);
                                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nKotak Place Oredr Exit Catch =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Exit Catch -' + JSON.stringify(error.response.data) + "***\n\n", function (err) {
                                            if (err) {
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


                        } else {
                            data = '';
                            return data;
                        }
                    })

                })
                .catch(function (error) {

                });


        } else {

            return_data = {

                "instrumentToken": instrument_token,
                "transactionType": transactiontype,
                "quantity": quantity,
                "price": price,
                "validity": validity,
                "variety": variety,
                "disclosedQuantity": disclosedQuantity,
                "triggerPrice": triggerPrice,
                "tag": tag,
                "product_type": result[1][0].product_type

            };

            console.log("request",return_data);

            return return_data;

        }


      
   
   
    

    
    
    } catch (e) {
        console.log('Kotak Get Orders', e);
    }


}

module.exports = { place_order, access_token }