var axios = require('axios');
var qs = require('qs');
const fs = require('fs');




var dateTime = require('node-datetime');
// const log4js = require("log4js");
// log4js.configure({
//   appenders: { cheese: { type: "file", filename: "cheese.log" } },
//   categories: { default: { appenders: ["cheese"], level: "info" } }
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
      var instrument_query = "SELECT *  FROM `services` WHERE `service` LIKE '" + signal.input_symbol + "'";
    } else if (signal.segment == 'F' || signal.segment == 'f') {
      var instrument_query = "SELECT *  FROM `  ` WHERE `symbol` LIKE '" + signal.input_symbol + "' AND `expiry` LIKE '" + signal.expiry + "' AND `segment` LIKE 'F' ";
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

        var segment = signal.segment

        if (segment == "FO" || segment == "fo") {
            segment = 'O';
        }


    connection.query('' + instrument_query + ';SELECT * FROM `client_service` LEFT JOIN `services` ON `services`.`id` = `client_service`.`service_id` LEFT JOIN `client` ON `client`.`id` = `client_service`.`client_id` LEFT JOIN `categorie` ON `categorie`.`id` = `services`.`categorie_id`  WHERE `client_service`.`client_id` = "' + item.id + '" AND `services`.`service` = "' + signal.input_symbol + '" AND `categorie`.`segment`="'+segment+'"', [1, 2], (err, result) => {
      

          try {

            if (result[0].length > 0 || result[1].length > 0) {


              console.log("instrument_token_symbol :-", instrument_token_symbol);

              var tradeSymbol = ""
              if (signal.segment == 'C' || signal.segment == 'c') {
                tradeSymbol = instrument_token_symbol[0].service;
              } else {
                tradeSymbol = instrument_token_symbol[0].tradesymbol;
              }




              //Broker Response print Token
              if (signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'F' || signal.segment == 'f' || signal.segment == 'FO' || signal.segment == 'fo') {

                var signal_sy = "[symbol : " + signal.input_symbol + " , Expiry : " + signal.expiry + "  , Strike : " + signal.strike + " , option_type :" + signal.option_type + " , TradeSymbol : " + tradeSymbol + " , Token : " + instrument_token_symbol[0].instrument_token + "]";

                var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

                connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="IIFL SECURITIES" WHERE `id`=' + bro_res_last_id, (err, result) => {
                  // console.log("err update token", err);
                })



              } else if (signal.segment == 'C' || signal.segment == 'c') {

                var signal_sy = "[symbol : " + signal.input_symbol + " , TradeSymbol : " + tradeSymbol + " , Token : " + instrument_token_symbol[0].instrument_token + "]";

                var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

                connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="IIFL SECURITIES" WHERE `id`=' + bro_res_last_id, (err, result) => {
                  //console.log("err", err);
                })


              } else {

                var signal_sy = "[symbol : " + signal.input_symbol + " , Expiry : " + signal.expiry + " , TradeSymbol : " + tradeSymbol + " , Token : " + instrument_token_symbol[0].instrument_token + "]";

                var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

                connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="IIFL SECURITIES" WHERE `id`=' + bro_res_last_id, (err, result) => {
                  //console.log("err", err);
                })


              }

            } else {

              if (signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'F' || signal.segment == 'f' || signal.segment == 'FO' || signal.segment == 'fo') {

                var signal_sy = "[symbol : " + signal.input_symbol + " , Expiry : " + signal.expiry + "  , Strike : " + signal.strike + " , option_type :" + signal.option_type + " , TradeSymbol : NULL , Token : NULL]";

                var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

                connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="IIFL SECURITIES" WHERE `id`=' + bro_res_last_id, (err, result) => {
                  //console.log("err", err);
                })

              } else {

                var signal_sy = "[symbol : " + signal.input_symbol + " , Expiry : " + signal.expiry + " , TradeSymbol : NULL , Token : NULL]";

                var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

                connection.query('UPDATE `broker_response` SET `token_symbol`="' + signal_req_sy + '",`broker_enter`="IIFL SECURITIES" WHERE `id`=' + bro_res_last_id, (err, result) => {
                  //console.log("err", err);
                })


              }


            }




            //console.log(err);
            if (result[1].length > 0 || result[0].length > 0) {

              var data = get_orderdata(item, signal, result, connection, last_signal_id, instrument_token_symbol, bro_res_last_id, filePath);

              console.log('IIFL SECURITIES Entry New ', data)



              if (data !== undefined) {
                var send_rr = Buffer.from(qs.stringify(data)).toString('base64');


                let config = {
                  method: 'post',
                  maxBodyLength: Infinity,
                  url: item.api_type + '/orders',
                  headers: {
                    'authorization': item.access_token,
                    'Content-Type': 'application/json'
                  },
                  data: JSON.stringify(data)
                };

                var datetime = new Date();

                axios(config)
                  .then(function (response) {

                    fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nIIFL SECURITIES Place Oredr Entry  =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Entry -' + JSON.stringify(response.data) + "***\n\n", function (err) {
                      if (err) {
                        return console.log(err);
                      }
                    });

                    console.log('iifl response -', response.data);
                    var datetime = new Date();
                    var send_rr1 = Buffer.from(qs.stringify(data)).toString('base64');


                    // return
                    if (response.data.type == "success") {

                      var AppOrderID = response.data.result.AppOrderID;


                      let config1 = {
                        method: 'get',
                        maxBodyLength: Infinity,
                        url: item.api_type + '/orders?appOrderID=' + AppOrderID,
                        headers: {
                          'authorization': item.access_token,
                        }
                      };


                      axios(config1)
                        .then(function (response1) {
                          var send_rr = Buffer.from(qs.stringify(data)).toString('base64');

                          console.log("response1", response1.data.result);

                          if (response1.data.type == "success") {


                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_id`="' + AppOrderID + '" ,`order_status`="' + response1.data.result[0].OrderStatus + '" ,`reject_reason`="' + response1.data.result[0].CancelRejectReason + '" WHERE `id`=' + bro_res_last_id, (err, result) => {

                            });


                            connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"BUY","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + AppOrderID + ',"' + get_date() + '","",' + signal.id + ',"' + response1.data.result[0].OrderStatus + '","' + last_signal_id + '","' + signal.type + '")', (err, client_transaction) => {

                            });




                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nIIFL SECURITIES Place Oredr Entry  =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Entry -' + JSON.stringify(response1.data) + "***\n\n", function (err) {
                              if (err) {
                                return console.log(err);
                              }
                            });


                          }


                        })
                        .catch(function (error_broker) {
                          console.log('error_broker -', error_broker.response.data);

                          fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nIIFL SECURITIES Place Oredr Entry Catch =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Entry  catch -' + JSON.stringify(error_broker) + "***\n\n", function (err) {
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
                  .catch(function (error_p) {
                    console.log('untho -', error_p.response.data);

                    try {

                      fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nIIFL SECURITIES Place Oredr Entry Catch =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Entry catch -' + JSON.stringify(error_p.response.data) + "***\n\n", function (err) {
                        if (err) {
                          return console.log(err);
                        }
                      });

                      const message = (JSON.stringify(error_p.response.data)).replace(/["',]/g, '');

                       connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                           //console.log("err", err);
                       });


                    } catch (e) {

                      console.log("Place Order Entery 5", e);
                    }

                  });
              }
            }

          } catch (e) {
            console.log('IIFL SECURITIES Query', e);
          }
        });
      } catch (e) {
        console.log('iiflBlue Token Symbol', e);
      }

    });

  } catch (e) {
    console.log('Alceblue Inside Placeorder', e);
  }
}

const get_orderdata = (item, signal, result, connection, last_signal_id, instrument_token_symbol, bro_res_last_id, filePath) => {


  try {

    var exchangeSegment;
    if (signal.segment == 'C' || signal.segment == 'c') {
      exchangeSegment = "NSECM";
    } else if (signal.segment == 'F' || signal.segment == 'f' || signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo') {
      exchangeSegment = "NSEFO";
    } else if (signal.segment == 'MF' || signal.segment == 'mf' || signal.segment == 'MO' || signal.segment == 'mo') {
      exchangeSegment = "MCXFO";
    }
    else if (signal.segment == 'CF' || signal.segment == 'cf' || signal.segment == 'CO' || sigLIMITnal.segment == 'co') {
      exchangeSegment = "NSECD";
    }


    var orderSide

    if (signal.type == 'LE' || signal.type == 'SX') {
      orderSide = 'BUY';
    } else if (signal.type == 'SE' || signal.type == 'LX') {
      orderSide = 'SELL';
    }




    var exchangeInstrumentID = instrument_token_symbol[0].instrument_token;
    var productType;
    var orderType;
    var timeInForce = 'DAY';
    var disclosedQuantity = 0;
    var orderQuantity = result[1][0].qty;
    var limitPrice = 0;
    var stopPrice = 0;
    var orderUniqueIdentifier = '123abc'






    if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' && result[1][0].product_type == '1') {

      orderType = 'MARKET';
      productType = 'CNC';

    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' && result[1][0].product_type == '1') {
      orderType = 'MARKET';
      productType = 'CNC';
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' && result[1][0].product_type == '1') {
      orderType = 'LIMIT';
      limitPrice = signal.price;
      productType = 'CNC';

    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' && result[1][0].product_type == '1') {
      orderType = 'LIMIT';
      limitPrice = signal.price;
      productType = 'CNC';

    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' && result[1][0].product_type == '1') {
      orderType = 'STOPLIMIT';
      limitPrice = signal.price;
      productType = 'CNC';
      trigPrice = signal.tr_price;

    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' && result[1][0].product_type == '1') {
      orderType = 'STOPLIMIT';
      limitPrice = signal.price;
      productType = 'CNC';
      trigPrice = signal.tr_price;

    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '4' && result[1][0].product_type == '1') {

      orderType = 'STOPMARKET';
      limitPrice = signal.price;
      productType = 'CNC';
      trigPrice = signal.tr_price;
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '4' && result[1][0].product_type == '1') {

      orderType = 'STOPMARKET';
      limitPrice = signal.price;
      productType = 'CNC';
      trigPrice = signal.tr_price;
    }

    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' && result[1][0].product_type == '2') {
      orderType = 'MARKET';
      productType = 'MIS';

    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' && result[1][0].product_type == '2') {
      orderType = 'MARKET';
      productType = 'MIS';

    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' && result[1][0].product_type == '2') {

      orderType = 'LIMIT';
      limitPrice = signal.price;
      productType = 'MIS';
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' && result[1][0].product_type == '2') {

      orderType = 'LIMIT';
      limitPrice = signal.price;
      productType = 'MIS';
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' && result[1][0].product_type == '2') {
      orderType = 'STOPLIMIT';
      limitPrice = signal.price;
      productType = 'MIS';
      trigPrice = signal.tr_price;

    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' && result[1][0].product_type == '2') {
      orderType = 'STOPLIMIT';
      limitPrice = signal.price;
      productType = 'MIS';
      trigPrice = signal.tr_price;

    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '4' && result[1][0].product_type == '2') {

      orderType = 'STOPMARKET';
      limitPrice = signal.price;
      productType = 'MIS';
      trigPrice = signal.tr_price;

    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '4' && result[1][0].product_type == '2') {

      orderType = 'STOPMARKET';
      limitPrice = signal.price;
      productType = 'MIS';
      trigPrice = signal.tr_price;

    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '1' && result[1][0].product_type == '4') {
      orderType = 'MARKET';
      productType = 'CO';
      complexty = "co";
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '1' && result[1][0].product_type == '4') {
      orderType = 'MARKET';
      productType = 'CO';
      complexty = "co";
    }

    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' && result[1][0].product_type == '4') {
      orderType = 'LIMIT';
      productType = 'CO';
      limitPrice = signal.price;
      trigPrice = signal.tr_price;
      complexty = "co";
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' && result[1][0].product_type == '4') {
      orderType = 'LIMIT';
      productType = 'CO';
      limitPrice = signal.price;
      trigPrice = signal.tr_price;
      complexty = "co";
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '2' && result[1][0].product_type == '3') {

      // console.log('order BO')
      orderType = 'LIMIT';
      limitPrice = signal.price;
      productType = 'MIS';
      complexty = 'bo';
      stopLoss = signal.sl_value;
      target = signal.sq_value;
      trailing_stop_loss = signal.tsl;
    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '2' && result[1][0].product_type == '3') {
      orderType = 'LIMIT';
      limitPrice = signal.price;
      productType = 'MIS';
      complexty = 'bo';
      stopLoss = signal.sl_value;
      target = signal.sq_value;
      trailing_stop_loss = signal.tsl;
    }
    else if ((signal.type == 'LE' || signal.type == 'SX') && result[1][0].order_type == '3' && result[1][0].product_type == '3') {

      orderType = 'STOPLIMIT';
      limitPrice = signal.price;
      productType = 'MIS';
      complexty = 'bo';
      trigPrice = signal.tr_price;
      stopLoss = signal.sl_value;
      target = signal.sq_value;
      trailing_stop_loss = signal.tsl;

    }
    else if ((signal.type == 'LX' || signal.type == 'SE') && result[1][0].order_type == '3' && result[1][0].product_type == '3') {

      orderType = 'STOPLIMIT';
      limitPrice = signal.price;
      productType = 'MIS';
      complexty = 'bo';
      trigPrice = signal.tr_price;
      stopLoss = signal.sl_value;
      target = signal.sq_value;
      trailing_stop_loss = signal.tsl;

    }


    if (result[1][0].product_type == '1') {
      if (signal.segment == 'F' || signal.segment == 'f' || signal.segment == 'O' || signal.segment == 'o' || signal.segment == 'FO' || signal.segment == 'fo') {
        productType = "NRML";
      }
    }


    if (signal.type == 'SX' || signal.type == 'LX') {
      console.log('inside Lxxx ');


      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: item.api_type + '/portfolio/positions?dayOrNet=NetWise',

        headers: {
          'authorization': item.access_token,
          'Content-Type': 'application/json'
        },
      };


      axios(config)
        .then(function (response) {


          console.log("response.data.result.position[0]", response.data.result.positionList.length);

          if (response.data.result.positionList.length == 0) {
          
            connection.query('UPDATE `broker_response` SET `open_possition_qty`="' + response.data.result.positionList.length + '" WHERE `id`=' + bro_res_last_id, (err11, result_p) => {

            });
          }



          response.data.result.positionList.forEach((item1) => {

            if (item1.ExchangeInstrumentId == exchangeInstrumentID && item1.ProductType == productType) {

              console.log("item1", item1);


              var possition_qty = item1.OpenBuyQuantity - item1.OpenSellQuantity;

              connection.query('UPDATE `broker_response` SET `open_possition_qty`="' + possition_qty + '" WHERE `id`=' + bro_res_last_id, (err11, result_p) => {

              });


              if ((item1.OpenBuyQuantity - item1.OpenSellQuantity) > 0 && signal.type == 'LX') {


                data11 = {
                  "exchangeSegment": exchangeSegment,
                  "exchangeInstrumentID": exchangeInstrumentID,
                  "productType": productType,
                  "orderType": orderType,
                  "orderSide": orderSide,
                  "timeInForce": timeInForce,
                  "disclosedQuantity": disclosedQuantity,
                  "orderQuantity": orderQuantity,
                  "limitPrice": limitPrice,
                  "stopPrice": stopPrice,
                  "orderUniqueIdentifier": orderUniqueIdentifier
                };

                var send_rr = Buffer.from(qs.stringify(data11)).toString;

                let config = {
                  method: 'post',
                  maxBodyLength: Infinity,
                  url: item.api_type + '/orders',
                  headers: {
                    'authorization': item.access_token,
                    'Content-Type': 'application/json'
                  },
                  data: JSON.stringify(data11)
                };

                var datetime = new Date();
                axios(config)
                  .then(function (response) {
                    var datetime = new Date();

                    var AppOrderID = response.data.result.AppOrderID;

                    fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nIIFL SECURITIES Place Oredr Exit  =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Exit -' + JSON.stringify(response.data) + "***\n\n", function (err) {
                      if (err) {
                        return console.log(err);
                      }
                    });

                    var send_rr1 = Buffer.from(qs.stringify(data11)).toString('base64');



                    // return
                    if (response.data.type == "success") {

                      var AppOrderID = response.data.result.AppOrderID;


                      let config1 = {
                        method: 'get',
                        maxBodyLength: Infinity,
                        url: item.api_type + '/orders?appOrderID=' + AppOrderID,
                        headers: {
                          'authorization': item.access_token,
                        }
                      };


                      axios(config1)
                        .then(function (response1) {
                          var send_rr = Buffer.from(qs.stringify(data)).toString('base64');

                          console.log("response response", response1.data);

                          if (response1.data.type == "success") {


                            console.log("Order Exit", val);

                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_id`="' + AppOrderID + '" ,`order_status`="' + response1.data.result[0].OrderStatus + '" ,`reject_reason`="' + response1.data.result[0].CancelRejectReason + '" WHERE `id`=' + bro_res_last_id, (err, result) => {

                            });


                            connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"BUY","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + AppOrderID + ',"' + get_date() + '","",' + signal.id + ',"' + response1.data.result[0].OrderStatus + '","' + last_signal_id + '","' + signal.type + '")', (err, client_transaction) => {
                              //console.log(err);
                            });

                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nIIFL SECURITIES Place Oredr Exit  =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Exit -' + JSON.stringify(response1.data) + "***\n\n", function (err) {
                              if (err) {
                                return console.log(err);
                              }
                            });


                          }


                        })
                        .catch(function (error_broker) {
                          console.log('error_broker -', error_broker.response);

                          fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nIIFL SECURITIES Place Oredr Entry Catch =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Entry  catch -' + JSON.stringify(error_broker) + "***\n\n", function (err) {
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
                  .catch(function (error_p) {

                    try {
                      fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nIIFL SECURITIES Place Oredr Exit Catch =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Exit Catch -' + JSON.stringify(error_p.response.data) + "***\n\n", function (err) {
                        if (err) {
                          return console.log(err);
                        }
                      });

                      const message = (JSON.stringify(error_p.response.data)).replace(/["',]/g, '');

                      connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                          //console.log("err", err);
                      });

                    } catch (e) {
                      console.log("Place Order Exit 4", e);
                    }

                    ;



                  });

                data = '';
                return data;


              }


              else if ((item1.OpenBuyQuantity - item1.OpenSellQuantity) < 0 && signal.type == 'SX') {


                data11 = {
                  "exchangeSegment": exchangeSegment,
                  "exchangeInstrumentID": exchangeInstrumentID,
                  "productType": productType,
                  "orderType": orderType,
                  "orderSide": orderSide,
                  "timeInForce": timeInForce,
                  "disclosedQuantity": disclosedQuantity,
                  "orderQuantity": orderQuantity,
                  "limitPrice": limitPrice,
                  "stopPrice": stopPrice,
                  "orderUniqueIdentifier": orderUniqueIdentifier
                };


                var send_rr = Buffer.from(qs.stringify(data11)).toString;

                data11 = {
                  "exchangeSegment": exchangeSegment,
                  "exchangeInstrumentID": exchangeInstrumentID,
                  "productType": productType,
                  "orderType": orderType,
                  "orderSide": orderSide,
                  "timeInForce": timeInForce,
                  "disclosedQuantity": disclosedQuantity,
                  "orderQuantity": orderQuantity,
                  "limitPrice": limitPrice,
                  "stopPrice": stopPrice,
                  "orderUniqueIdentifier": orderUniqueIdentifier
                };

                var send_rr = Buffer.from(qs.stringify(data11)).toString;

                let config = {
                  method: 'post',
                  maxBodyLength: Infinity,
                  url: item.api_type + '/orders',
                  headers: {
                    'authorization': item.access_token,
                    'Content-Type': 'application/json'
                  },
                  data: JSON.stringify(data11)
                };

                var datetime = new Date();
                axios(config)
                  .then(function (response) {
                    var datetime = new Date();
                    var AppOrderID = response.data.result.AppOrderID;
                    fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nIIFL SECURITIES Place Oredr Exit  =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Exit -' + JSON.stringify(response.data) + "***\n\n", function (err) {
                      if (err) {
                        return console.log(err);
                      }
                    });

                    var send_rr1 = Buffer.from(qs.stringify(data11)).toString('base64');

                    // return
                    if (response.data.type == "success") {

                      var AppOrderID = response.data.result.AppOrderID;



                      let config1 = {
                        method: 'get',
                        maxBodyLength: Infinity,
                        url: item.api_type + '/orders?appOrderID=' + AppOrderID,
                        headers: {
                          'authorization': item.access_token,
                        }
                      };


                      axios(config1)
                        .then(function (response1) {
                          var send_rr = Buffer.from(qs.stringify(data)).toString('base64');


                          if (response1.data.type == "success") {



                            console.log("val", val);

                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_id`="' + AppOrderID + '" ,`order_status`="' + response1.data.result[0].OrderStatus + '" ,`reject_reason`="' + response1.data.result[0].CancelRejectReason + '" WHERE `id`=' + bro_res_last_id, (err, result) => {

                            });


                            connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`,`last_signal_id`,`signal_type`) VALUES (' + item.id + ',' + result[1][0].order_type + ',"BUY","' + signal.input_symbol + '",' + result[1][0].qty + ',' + signal.price + ',"' + signal.exchange + '","' + signal.product_type + '",' + AppOrderID + ',"' + get_date() + '","",' + signal.id + ',"' + response1.data.result[0].OrderStatus + '","' + last_signal_id + '","' + signal.type + '")', (err, client_transaction) => {
                              //console.log(err);
                            });


                            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nIIFL SECURITIES Place Oredr Exit  =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Exit -' + JSON.stringify(response1.data) + "***\n\n", function (err) {
                              if (err) {
                                return console.log(err);
                              }
                            });




                          }


                        })
                        .catch(function (error_broker) {
                          console.log('error_broker -', error_broker.response.data);

                          fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nIIFL SECURITIES Place Oredr Entry Catch =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Entry  catch -' + JSON.stringify(error_broker) + "***\n\n", function (err) {
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
                  .catch(function (error_p) {

                    try {
                      fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nIIFL SECURITIES Place Oredr Exit Catch =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Exit Catch -' + JSON.stringify(error_p.response.data) + "***\n\n", function (err) {
                        if (err) {
                          return console.log(err);
                        }
                      });

                      const message = (JSON.stringify(error_p.response.data)).replace(/["',]/g, '');

                      connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                          //console.log("err", err);
                      });
                      
                    } catch (e) {
                      console.log("Place Order Exit 4", e);
                    }

                    //console.log('place order errror ',error_p);



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
          try {
            fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n IIFL SECURITIES Possition Check  Catch Error -' + JSON.stringify(error) + "***\n\n", function (err) {
              if (err) {
                return console.log(err);
              }
            });
          } catch (e) {
            console.log('IIFL SECURITIES Possition Check  Catch Error 1', e);
          }

        });


    } else {
      if (result[1][0].product_type == '3') {
        return_data = {
          "exchangeSegment": exchangeSegment,
          "exchangeInstrumentID": exchangeInstrumentID,
          "productType": productType,
          "orderType": orderType,
          "orderSide": orderSide,
          "timeInForce": timeInForce,
          "disclosedQuantity": disclosedQuantity,
          "orderQuantity": orderQuantity,
          "limitPrice": limitPrice,
          "stopPrice": stopPrice,
          "orderUniqueIdentifier": orderUniqueIdentifier
        };
      } else {
        return_data = {
          "exchangeSegment": exchangeSegment,
          "exchangeInstrumentID": Number(exchangeInstrumentID),
          "productType": productType,
          "orderType": orderType,
          "orderSide": orderSide,
          "timeInForce": timeInForce,
          "disclosedQuantity": disclosedQuantity,
          "orderQuantity": orderQuantity,
          "limitPrice": limitPrice,
          "stopPrice": stopPrice,
          "orderUniqueIdentifier": orderUniqueIdentifier
        };
      }
      // console.log("return_data", return_data);

      return return_data;
    }

  } catch (e) {
    console.log('IIFL SECURITIES Get Order', e);
  }


}

module.exports = { place_order, access_token }