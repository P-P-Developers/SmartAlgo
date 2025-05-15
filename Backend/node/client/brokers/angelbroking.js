var axios = require('axios');
// var request = require("request");
var FormData = require('form-data');
var qs = require('qs');
const fs = require('fs');
const sha256 = require('sha256');







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

                var segment = signal.segment

                if (segment == "FO" || segment == "fo") {
                    segment = 'O';
                }
        
        
            connection.query('' + instrument_query + ';SELECT * FROM `client_service` LEFT JOIN `services` ON `services`.`id` = `client_service`.`service_id` LEFT JOIN `client` ON `client`.`id` = `client_service`.`client_id` LEFT JOIN `categorie` ON `categorie`.`id` = `services`.`categorie_id`  WHERE `client_service`.`client_id` = "' + item.id + '" AND `services`.`service` = "' + signal.input_symbol + '" AND `categorie`.`segment`="'+segment+'"', [1, 2], (err, result) => {

                    try {


                        if (result[0].length > 0 || result[1].length > 0) {

                            // console.log('instrument_token_symbol[0] -',instrument_token_symbol);

                            var tradesymbol = '';

                            if (instrument_token_symbol[0].tradesymbol == undefined) {
                                tradesymbol = "tradesymbol";
                            } else {
                                tradesymbol = instrument_token_symbol[0].tradesymbol;
                            }

                            // Broker Reponse Print Token   
                            if (signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo') {


                                var signal_sy = "[symbol : " + signal.input_symbol + " , Expiry : " + signal.expiry + "  , Strike : " + signal.strike + " , option_type :" + signal.option_type + " , TradeSymbol : " + tradesymbol + " , Token : " + instrument_token_symbol[0].instrument_token + "]";
                                var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
                                connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="ANGEL" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                    //console.log("err update token", err);
                                })


                            } else if (signal.segment == 'C' || signal.segment == 'c') {

                                var signal_sy = "[symbol : " + signal.input_symbol + " , TradeSymbol : " + instrument_token_symbol[0].zebu_token + " , Token : " + instrument_token_symbol[0].instrument_token + "]";
                                var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
                                connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="ANGEL" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                    //console.log("err update token", err);
                                })



                            } else {

                                var signal_sy = "[symbol : " + signal.input_symbol + " , Expiry : " + signal.expiry + " , TradeSymbol : " + tradesymbol + " , Token : " + instrument_token_symbol[0].instrument_token + "]";
                                var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
                                connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="ANGEL" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                    //console.log("err update token", err);
                                })



                            }

                        } else {

                            if (signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo') {

                                var signal_sy = "[symbol : " + signal.input_symbol + " , Expiry : " + signal.expiry + "  , Strike : " + signal.strike + " , option_type :" + signal.option_type + " , TradeSymbol : NULL , Token : NULL]";
                                var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
                                connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="ANGEL" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                    //console.log("err", err);
                                })

                            } else {

                                var signal_sy = "[symbol : " + signal.input_symbol + " , Expiry : " + signal.expiry + " , TradeSymbol : NULL , Token : NULL]";
                                var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');
                                connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="ANGEL" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                    //console.log("err", err);
                                })


                            }


                        }

                        // console.log(err);
                        if (result[1].length > 0 || result[0].length > 0) {

                            var data = get_orderdata(item, signal, result, connection, last_signal_id, instrument_token_symbol, bro_res_last_id, filePath)

                            if (data !== undefined) {

                                console.log('data angel---', data)
                                var send_rr = Buffer.from(JSON.stringify(data)).toString('base64');

                                var config = {
                                    method: 'post',
                                    url: 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/placeOrder',
                                    headers: {
                                        'Authorization': 'Bearer ' + item.access_token,
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json',
                                        'X-UserType': 'USER',
                                        'X-SourceID': 'WEB',
                                        'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
                                        'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
                                        'X-MACAddress': 'MAC_ADDRESS',
                                        'X-PrivateKey': item.api_key
                                    },
                                    data: JSON.stringify(data)

                                };

                                var datetime = new Date();
                                axios(config)
                                    .then(async function(response) {

                                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n time - '+new Date()+'Angel Place Oredr Entry  =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Entry -' + JSON.stringify(response.data) + "***\n", function (err) {
                                            if (err) {
                                                return console.log(err);
                                            }
                                        });
                                        
                                        var datetime = new Date();
                                        var send_rr = Buffer.from(JSON.stringify(data)).toString('base64');
                                        if (response.data.message == 'SUCCESS') {
                                            var config1 = {
                                                method: 'get',
                                                url: 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/getOrderBook',
                                                headers: {
                                                    'Authorization': 'Bearer ' + item.access_token,
                                                    'Content-Type': 'application/json',
                                                    'Accept': 'application/json',
                                                    'X-UserType': 'USER',
                                                    'X-SourceID': 'WEB',
                                                    'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
                                                    'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
                                                    'X-MACAddress': 'MAC_ADDRESS',
                                                    'X-PrivateKey': item.api_key
                                                },
                                            };
                                           await axios(config1)
                                                .then(async function (response1) {
                                                    var send_rr = Buffer.from(JSON.stringify(data)).toString('base64');
                                                   await response1.data.data.forEach(async function (item2, index) {
                                                        if (item2.orderid == response.data.data.orderid) {


                                                            var reject_reason;
                                                            if (item2.text) {
                                                                reject_reason = item2.text;
                                                            } else {
                                                                reject_reason = '';
                                                            }

                                                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n time - '+new Date()+ ' Angel Place Oredr Entry  =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Entry -' + JSON.stringify(response1.data) + "***\n\n", function (err) {
                                                                if (err) {
                                                                    return console.log(err);
                                                                }
                                                            });

                                                     await  connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_id`="' + response.data.data.orderid + '" ,`order_status`="' + item2.status + '" ,`reject_reason`="' + reject_reason + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                                //console.log("err", err);
                                                            });

                                                        }

                                                    })


                                                    connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"BUY","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data.data.orderid + ',"' + get_date() + '","",' + signal.id + ',"' + response.data.message + '","' + last_signal_id + '","' + signal.type + '")', (err, client_transaction) => {
                                                        //console.log(err);
                                                    });

                                                })
                                                .catch(function (error) {
                                                    // console.log(error);

                                                    fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n time - '+new Date()+ ' Angel Place Oredr Entry Catch =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Entry Catch -' + JSON.stringify(error.response.data) + "***\n\n", function (err) {
                                                        if (err) {
                                                            return console.log(err);
                                                        }
                                                    });
                                                });

                                        } else {
                                          
                                            const message = (JSON.stringify(response.data)).replace(/["',]/g, '');

                                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                //console.log("err", err);
                                            });

                                        }


                                    })
                                    .catch(function (error1) {
                                        // console.log(error);

                                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n time - '+new Date()+ ' Angel Place Oredr Entry Catch =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Entry Catch -' + JSON.stringify(error1.response.data) + "***\n\n", function (err) {
                                            if (err) {
                                                return console.log(err);
                                            }
                                        });


                                           const message = (JSON.stringify(error1.response.data)).replace(/["',]/g, '');

                                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                //console.log("err", err);
                                            });

                                    });
                            }
                        }
                    } catch (e) {
                        console.log('Angel Instrument query', e);
                    }

                });

            } catch (e) {
                console.log('Angel Token Symbol S', e);
            }

        });
    } catch (e) {
        console.log('Angel Inside Placeorder', e);
    }

}

const get_orderdata = (item, signal, result, connection, last_signal_id, instrument_token_symbol, bro_res_last_id, filePath) => {
    // console.log('inside trade');
    var is_reject = false;
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
            transactiontype = 'BUY';
        } else if (signal.type == 'SE' || signal.type == 'LX') {
            transactiontype = 'SELL';
        }




        var variety = 'NORMAL';
        var tradingsymbol;
        var symboltoken = instrument_token_symbol[0].instrument_token;
        var ordertype
        var producttype;
        var duration = 'DAY';
        var price = 0;
        var squareoff = 0;
        var stoploss = 0;
        var quantity = result[1][0].qty;


        var triggerprice = 0;
        var trailingStopLoss = '';
        var disclosedquantity = '';
        var ordertag = '';


        if (signal.segment == 'C' || signal.segment == 'c') {
            tradingsymbol = instrument_token_symbol[0].zebu_token;
        } else {
            tradingsymbol = instrument_token_symbol[0].tradesymbol;
        }




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


        if (signal.type == 'SX' || signal.type == 'LX') {


            var config = {
                method: 'get',
                url: 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/getPosition',
                headers: {
                    'Authorization': 'Bearer ' + item.access_token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-UserType': 'USER',
                    'X-SourceID': 'WEB',
                    'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
                    'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
                    'X-MACAddress': 'MAC_ADDRESS',
                    'X-PrivateKey': item.api_key
                },
            };
            axios(config)
                .then(async function (response) {

                   await response.data.data.forEach(async function (item1, index) {
                        if (item1.symboltoken == symboltoken) {

                            if (signal.segment == 'C' || signal.segment == 'c') {

                                var possition_qty = item1.buyqty - item1.sellqty;

                               await connection.query('UPDATE `broker_response` SET `open_possition_qty`="' + possition_qty + '" WHERE `id`=' + bro_res_last_id, (err, result_p) => {
                                    //console.log("err", err);
                                })

                                if ((item1.buyqty - item1.sellqty) > 0 && signal.type == 'LX') {

                                    if (result[1][0].product_type == '3') {
                                        data11 = {
                                            "variety": variety,
                                            "tradingsymbol": tradingsymbol,
                                            "symboltoken": symboltoken,
                                            "transactiontype": transactiontype,
                                            "exchange": exchange,
                                            "ordertype": ordertype,
                                            "producttype": producttype,
                                            "duration": duration,
                                            "triggerprice": triggerprice,
                                            "price": price,
                                            "squareoff": squareoff,
                                            "stoploss": stoploss,
                                            "quantity": quantity,
                                            "trailingStopLoss": trailingStopLoss,


                                        };
                                    }

                                    else {
                                        data11 = {
                                            "variety": variety,
                                            "tradingsymbol": tradingsymbol,
                                            "symboltoken": symboltoken,
                                            "transactiontype": transactiontype,
                                            "exchange": exchange,
                                            "ordertype": ordertype,
                                            "producttype": producttype,
                                            "duration": duration,
                                            "price": price,
                                            "squareoff": squareoff,
                                            "stoploss": stoploss,
                                            "quantity": quantity
                                        };
                                    }

                                    var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');
                                    var config = {
                                        method: 'post',
                                        url: 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/placeOrder',
                                        headers: {
                                            'Authorization': 'Bearer ' + item.access_token,
                                            'Content-Type': 'application/json',
                                            'Accept': 'application/json',
                                            'X-UserType': 'USER',
                                            'X-SourceID': 'WEB',
                                            'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
                                            'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
                                            'X-MACAddress': 'MAC_ADDRESS',
                                            'X-PrivateKey': item.api_key
                                        },
                                        data: JSON.stringify(data11)

                                    };
                                    var datetime = new Date();

                                  await axios(config)
                                        .then(async function (response) {

                                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n time - '+new Date()+ ' Angel Place Oredr Exit =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Exit -' + JSON.stringify(response.data) + "***\n\n", function (err) {
                                                if (err) {
                                                    return console.log(err);
                                                }
                                            });


                                            var datetime = new Date();
                                            var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');

                                            if (response.data.message == 'SUCCESS') {

                                                var config1 = {
                                                    method: 'get',
                                                    url: 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/getOrderBook',
                                                    headers: {
                                                        'Authorization': 'Bearer ' + item.access_token,
                                                        'Content-Type': 'application/json',
                                                        'Accept': 'application/json',
                                                        'X-UserType': 'USER',
                                                        'X-SourceID': 'WEB',
                                                        'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
                                                        'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
                                                        'X-MACAddress': 'MAC_ADDRESS',
                                                        'X-PrivateKey': item.api_key
                                                    },
                                                };
                                               await axios(config1)
                                                    .then(async function (response1) {

                                                        var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');

                                                      await  response1.data.data.forEach(async function (item2, index) {
                                                            if (item2.orderid == response.data.data.orderid) {

                                                                var reject_reason;
                                                                if (item2.text) {
                                                                    reject_reason = item2.text;
                                                                } else {
                                                                    reject_reason = '';
                                                                }


                                                              await  connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_id`="' + response.data.data.orderid + '" ,`order_status`="' + item2.status + '" ,`reject_reason`="' + reject_reason + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                                    //console.log("err", err);
                                                                });

                                                            }

                                                        })


                                                        connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"' + transactiontype + '","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data.data.orderid + ',"' + get_date() + '","",' + signal.id + ',"' + response.data.message + '","' + last_signal_id + '","' + signal.type + '")', (err, client_transaction) => {
                                                            //console.log(err);
                                                        });



                                                    })
                                                    .catch(function (error) {

                                                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n time - '+new Date()+ ' Angel Place Oredr Exit Catch =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Exit Catch -' + JSON.stringify(error.response.data) + "***\n\n", function (err) {
                                                            if (err) {
                                                                return console.log(err);
                                                            }
                                                        });
                                                        // console.log(error);
                                                    });


                                            } else {


                                              const message = (JSON.stringify(response.data)).replace(/["',]/g, '');

                                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                //console.log("err", err);
                                            });

                                                
                                            }



                                        })
                                        .catch(async function (error) {
                                            // console.log(error);
                                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nAngel Place Oredr Exit Catch =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Exit Catch -' + JSON.stringify(error.response.data) + "***\n\n", function (err) {
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
                                else if ((item1.buyqty - item1.sellqty) < 0 && signal.type == 'SX') {
                                    // console.log('inside SX Trade') 

                                    if (result[1][0].product_type == '3') {
                                        data11 = {
                                            "variety": variety,
                                            "tradingsymbol": tradingsymbol,
                                            "symboltoken": symboltoken,
                                            "transactiontype": transactiontype,
                                            "exchange": exchange,
                                            "ordertype": ordertype,
                                            "producttype": producttype,
                                            "duration": duration,
                                            "triggerprice": triggerprice,
                                            "price": price,
                                            "squareoff": squareoff,
                                            "stoploss": stoploss,
                                            "quantity": quantity,
                                            "trailingStopLoss": trailingStopLoss,


                                        };
                                    }
                                    else {
                                        data11 = {
                                            "variety": variety,
                                            "tradingsymbol": tradingsymbol,
                                            "symboltoken": symboltoken,
                                            "transactiontype": transactiontype,
                                            "exchange": exchange,
                                            "ordertype": ordertype,
                                            "producttype": producttype,
                                            "duration": duration,
                                            "price": price,
                                            "squareoff": squareoff,
                                            "stoploss": stoploss,
                                            "quantity": quantity
                                        };
                                    }

                                    //  console.log('Return data  ',data11)
                                    var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');

                                    var config = {
                                        method: 'post',
                                        url: 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/placeOrder',
                                        headers: {
                                            'Authorization': 'Bearer ' + item.access_token,
                                            'Content-Type': 'application/json',
                                            'Accept': 'application/json',
                                            'X-UserType': 'USER',
                                            'X-SourceID': 'WEB',
                                            'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
                                            'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
                                            'X-MACAddress': 'MAC_ADDRESS',
                                            'X-PrivateKey': item.api_key
                                        },
                                        data: JSON.stringify(data11)

                                    };

                                    var datetime = new Date();

                                  await axios(config)
                                        .then(async function (response) {

                                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n time - '+new Date()+ ' Angel Place Oredr Exit  =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Exit  -' + JSON.stringify(response.data) + "***\n\n", function (err) {
                                                if (err) {
                                                    return console.log(err);
                                                }
                                            });

                                            var datetime = new Date();

                                            // get order status

                                            var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');

                                            if (response.data.message == 'SUCCESS') {
                                                // get order status
                                                var config1 = {
                                                    method: 'get',
                                                    url: 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/getOrderBook',
                                                    headers: {
                                                        'Authorization': 'Bearer ' + item.access_token,
                                                        'Content-Type': 'application/json',
                                                        'Accept': 'application/json',
                                                        'X-UserType': 'USER',
                                                        'X-SourceID': 'WEB',
                                                        'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
                                                        'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
                                                        'X-MACAddress': 'MAC_ADDRESS',
                                                        'X-PrivateKey': item.api_key
                                                    },
                                                };
                                               await axios(config1)
                                                    .then(async function (response1) {

                                                        var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');

                                                      await response1.data.data.forEach(async function (item2, index) {
                                                            console.log('ddd', item2.orderid)
                                                            if (item2.orderid == response.data.data.orderid) {

                                                                var reject_reason;
                                                                if (item2.text) {
                                                                    reject_reason = item2.text;
                                                                } else {
                                                                    reject_reason = '';
                                                                }

                                                              await  connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_id`="' + response.data.data.orderid + '" ,`order_status`="' + item2.status + '" ,`reject_reason`="' + reject_reason + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                                    //console.log("err", err);
                                                                });

                                                            }

                                                        })




                                                        connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"' + transactiontype + '","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data.data.orderid + ',"' + get_date() + '","",' + signal.id + ',"' + response.data.message + '","' + last_signal_id + '","' + signal.type + '")', (err, client_transaction) => {
                                                            //console.log(err);
                                                        });



                                                    })
                                                    .catch(function (error) {
                                                        // console.log(error);

                                                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nAngel Place Oredr Exit Catch =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Exit Catch -' + JSON.stringify(error.response.data) + "***\n\n", function (err) {
                                                            if (err) {
                                                                return console.log(err);
                                                            }
                                                        });

                                                    });


                                            } else {
                                             const message = (JSON.stringify(response.data)).replace(/["',]/g, '');

                                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                //console.log("err", err);
                                            });
                                            }


                                        })
                                        .catch(function (error) {
                                            // console.log(error);
                                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n time - '+new Date()+ ' Angel Place Oredr Exit Catch =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Exit Catch -' + JSON.stringify(error.response.data) + "***\n\n", function (err) {
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

                                var possition_qty = item1.netqty;

                                connection.query('UPDATE `broker_response` SET `open_possition_qty`="' + possition_qty + '" WHERE `id`=' + bro_res_last_id, (err, result_p) => {
                                    //console.log("err", err);
                                })

                                if (item1.netqty > 0 && signal.type == 'LX') {

                                    if (result[1][0].product_type == '3') {
                                        data11 = {
                                            "variety": variety,
                                            "tradingsymbol": tradingsymbol,
                                            "symboltoken": symboltoken,
                                            "transactiontype": transactiontype,
                                            "exchange": exchange,
                                            "ordertype": ordertype,
                                            "producttype": producttype,
                                            "duration": duration,
                                            "triggerprice": triggerprice,
                                            "price": price,
                                            "squareoff": squareoff,
                                            "stoploss": stoploss,
                                            "quantity": quantity,
                                            "trailingStopLoss": trailingStopLoss,


                                        };
                                    }

                                    else {
                                        data11 = {
                                            "variety": variety,
                                            "tradingsymbol": tradingsymbol,
                                            "symboltoken": symboltoken,
                                            "transactiontype": transactiontype,
                                            "exchange": exchange,
                                            "ordertype": ordertype,
                                            "producttype": producttype,
                                            "duration": duration,
                                            "price": price,
                                            "squareoff": squareoff,
                                            "stoploss": stoploss,
                                            "quantity": quantity
                                        };
                                    }

                                    var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');
                                    var config = {
                                        method: 'post',
                                        url: 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/placeOrder',
                                        headers: {
                                            'Authorization': 'Bearer ' + item.access_token,
                                            'Content-Type': 'application/json',
                                            'Accept': 'application/json',
                                            'X-UserType': 'USER',
                                            'X-SourceID': 'WEB',
                                            'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
                                            'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
                                            'X-MACAddress': 'MAC_ADDRESS',
                                            'X-PrivateKey': item.api_key
                                        },
                                        data: JSON.stringify(data11)

                                    };
                                    var datetime = new Date();

                                   await axios(config)
                                        .then(async function (response) {

                                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n time - '+new Date()+ ' Angel Place Oredr Exit =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Exit -' + JSON.stringify(response.data) + "***\n\n", function (err) {
                                                if (err) {
                                                    return console.log(err);
                                                }
                                            });


                                            var datetime = new Date();
                                            var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');

                                            if (response.data.message == 'SUCCESS') {

                                                var config1 = {
                                                    method: 'get',
                                                    url: 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/getOrderBook',
                                                    headers: {
                                                        'Authorization': 'Bearer ' + item.access_token,
                                                        'Content-Type': 'application/json',
                                                        'Accept': 'application/json',
                                                        'X-UserType': 'USER',
                                                        'X-SourceID': 'WEB',
                                                        'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
                                                        'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
                                                        'X-MACAddress': 'MAC_ADDRESS',
                                                        'X-PrivateKey': item.api_key
                                                    },
                                                };
                                               await axios(config1)
                                                    .then(async function (response1) {

                                                        var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');

                                                       await response1.data.data.forEach(async function (item2, index) {
                                                            if (item2.orderid == response.data.data.orderid) {

                                                                var reject_reason;
                                                                if (item2.text) {
                                                                    reject_reason = item2.text;
                                                                } else {
                                                                    reject_reason = '';
                                                                }


                                                               await connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_id`="' + response.data.data.orderid + '" ,`order_status`="' + item2.status + '" ,`reject_reason`="' + reject_reason + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                                    //console.log("err", err);
                                                                });

                                                            }

                                                        })


                                                        connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"' + transactiontype + '","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data.data.orderid + ',"' + get_date() + '","",' + signal.id + ',"' + response.data.message + '","' + last_signal_id + '","' + signal.type + '")', (err, client_transaction) => {
                                                            //console.log(err);
                                                        });



                                                    })
                                                    .catch(function (error) {
                                                        // console.log(error);

                                                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n time - '+new Date()+ ' Angel Place Oredr Exit Catch =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Exit Catch -' + JSON.stringify(error.response.data) + "***\n\n", function (err) {
                                                            if (err) {
                                                                return console.log(err);
                                                            }
                                                        });


                                                    });


                                            } else {
                                                const message = (JSON.stringify(response.data)).replace(/["',]/g, '');

                                                connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                    //console.log("err", err);
                                                });
                                            }



                                        })
                                        .catch(async function (error) {
                                            // console.log(error);
                                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n time - '+new Date()+ ' Angel Place Oredr Exit Catch =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Exit Catch -' + JSON.stringify(error.response.data) + "***\n\n", function (err) {
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
                                else if (item1.netqty < 0 && signal.type == 'SX') {
                                    // console.log('inside SX Trade') 

                                    if (result[1][0].product_type == '3') {
                                        data11 = {
                                            "variety": variety,
                                            "tradingsymbol": tradingsymbol,
                                            "symboltoken": symboltoken,
                                            "transactiontype": transactiontype,
                                            "exchange": exchange,
                                            "ordertype": ordertype,
                                            "producttype": producttype,
                                            "duration": duration,
                                            "triggerprice": triggerprice,
                                            "price": price,
                                            "squareoff": squareoff,
                                            "stoploss": stoploss,
                                            "quantity": quantity,
                                            "trailingStopLoss": trailingStopLoss,


                                        };
                                    }
                                    else {
                                        data11 = {
                                            "variety": variety,
                                            "tradingsymbol": tradingsymbol,
                                            "symboltoken": symboltoken,
                                            "transactiontype": transactiontype,
                                            "exchange": exchange,
                                            "ordertype": ordertype,
                                            "producttype": producttype,
                                            "duration": duration,
                                            "price": price,
                                            "squareoff": squareoff,
                                            "stoploss": stoploss,
                                            "quantity": quantity
                                        };
                                    }

                                    //  console.log('Return data  ',data11)
                                    var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');

                                    var config = {
                                        method: 'post',
                                        url: 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/placeOrder',
                                        headers: {
                                            'Authorization': 'Bearer ' + item.access_token,
                                            'Content-Type': 'application/json',
                                            'Accept': 'application/json',
                                            'X-UserType': 'USER',
                                            'X-SourceID': 'WEB',
                                            'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
                                            'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
                                            'X-MACAddress': 'MAC_ADDRESS',
                                            'X-PrivateKey': item.api_key
                                        },
                                        data: JSON.stringify(data11)

                                    };

                                    var datetime = new Date();

                                   await axios(config)
                                        .then(async function (response) {

                                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n time - '+new Date()+ ' Angel Place Oredr Exit  =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Exit  -' + JSON.stringify(response.data) + "***\n\n", function (err) {
                                                if (err) {
                                                    return console.log(err);
                                                }
                                            });

                                            var datetime = new Date();

                                            // get order status

                                            var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');

                                            if (response.data.message == 'SUCCESS') {
                                                // get order status
                                                var config1 = {
                                                    method: 'get',
                                                    url: 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/getOrderBook',
                                                    headers: {
                                                        'Authorization': 'Bearer ' + item.access_token,
                                                        'Content-Type': 'application/json',
                                                        'Accept': 'application/json',
                                                        'X-UserType': 'USER',
                                                        'X-SourceID': 'WEB',
                                                        'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
                                                        'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
                                                        'X-MACAddress': 'MAC_ADDRESS',
                                                        'X-PrivateKey': item.api_key
                                                    },
                                                };
                                               await axios(config1)
                                                    .then(async function (response1) {

                                                        var send_rr = Buffer.from(JSON.stringify(data11)).toString('base64');

                                                        await response1.data.data.forEach(async function (item2, index) {
                                                            console.log('ddd', item2.orderid)
                                                            if (item2.orderid == response.data.data.orderid) {

                                                                var reject_reason;
                                                                if (item2.text) {
                                                                    reject_reason = item2.text;
                                                                } else {
                                                                    reject_reason = '';
                                                                }


                                                                fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n time - '+new Date()+ ' Angel Place Oredr Exit  =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Exit  -' + JSON.stringify(response1.data) + "***\n\n", function (err) {
                                                                    if (err) {
                                                                        return console.log(err);
                                                                    }
                                                                });

                                                              await connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_id`="' + response.data.data.orderid + '" ,`order_status`="' + item2.status + '" ,`reject_reason`="' + reject_reason + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                                    //console.log("err", err);
                                                                });

                                                            }

                                                        })




                                                        connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"' + transactiontype + '","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + response.data.data.orderid + ',"' + get_date() + '","",' + signal.id + ',"' + response.data.message + '","' + last_signal_id + '","' + signal.type + '")', (err, client_transaction) => {
                                                            //console.log(err);
                                                        });



                                                    })
                                                    .catch(function (error) {
                                                        // console.log(error);

                                                        fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n time - '+new Date()+ ' Angel Place Oredr Exit Catch =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Exit Catch -' + JSON.stringify(error.response.data) + "***\n\n", function (err) {
                                                            if (err) {
                                                                return console.log(err);
                                                            }
                                                        });


                                                    });


                                            } else {
                                                const message = (JSON.stringify(response.data)).replace(/["',]/g, '');

                                                connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                    //console.log("err", err);
                                                });
                                            }


                                        })
                                        .catch(async function (error) {
                                            // console.log(error);
                                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n time - '+new Date()+ ' Angel Place Oredr Exit Catch =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Exit Catch -' + JSON.stringify(error.response.data) + "***\n\n", function (err) {
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

            if (result[1][0].product_type == '3') {
                return_data = {
                    "variety": variety,
                    "tradingsymbol": tradingsymbol,
                    "symboltoken": symboltoken,
                    "transactiontype": transactiontype,
                    "exchange": exchange,
                    "ordertype": ordertype,
                    "producttype": producttype,
                    "duration": duration,
                    "triggerprice": triggerprice,
                    "price": price,
                    "squareoff": squareoff,
                    "stoploss": stoploss,
                    "quantity": quantity,
                    "trailingStopLoss": trailingStopLoss,


                };
            }
            else {
                return_data = {
                    "variety": variety,
                    "tradingsymbol": tradingsymbol,
                    "symboltoken": symboltoken,
                    "transactiontype": transactiontype,
                    "exchange": exchange,
                    "ordertype": ordertype,
                    "producttype": producttype,
                    "duration": duration,
                    "price": price,
                    "squareoff": squareoff,
                    "stoploss": stoploss,
                    "quantity": quantity
                };
            }

            return return_data;
        }

    } catch (e) {
        console.log('Angel Get Orders', e);
    }


}

module.exports = { place_order, access_token }