module.exports = function (app, connection1) {
  var verifyToken = require('./middleware/awtJwt');
  var dateTime = require('node-datetime');

  app.post("/client/services", verifyToken, (req, res) => {
    var client_id = req.body.client_id;
    connection1.query('SELECT `client_service`.*, `service_and_group_id`.`group_qty` AS `quantity` ,`categorie`.`segment` as `segment`, `services`.`service` as `ser_name`, `categorie`.`name` as `cat_name`,`services`.`instrument_token` as `instrument_token` FROM `client_service` JOIN `services` ON `services`.`id` = `client_service`.`service_id` JOIN `categorie` ON `categorie`.`id` = `services`.`categorie_id` JOIN `service_and_group_id` ON `service_and_group_id`.service_id = `client_service`.service_id WHERE `client_service`.`client_id` =' + client_id + ' AND service_and_group_id.service_group_id =client_service.service_group_id ', (err, result1) => {


      connection1.query('SELECT `strategy_client`.* ,`strategy`.`quantity` AS `quantity`,client.qty_type AS qty_type FROM `strategy_client` LEFT JOIN `client` ON `client`.`id` = `strategy_client`.`client_id` LEFT JOIN `strategy` ON `strategy`.`name` = `strategy_client`.`strategy` WHERE `strategy_client`.`client_id`=' + client_id + '', (err, result2) => {


        connection1.query('SELECT id,broker FROM client WHERE id=' + client_id, (err, result3) => {
          connection1.query('SELECT id,qty_type,fund_used FROM client WHERE id=' + client_id, (err, result4) => {

            connection1.query('SELECT service_and_group_id.*,client_group_service.client_id,client_group_service.group_id FROM `client_group_service` JOIN `service_and_group_id`  ON client_group_service.group_id =service_and_group_id.service_group_id   WHERE `client_group_service`.`client_id` = '+client_id, (err, groupId ) => {
            res.send({ services: result1, strategy: result2, broker: result3, QTY_TYPE: result4 ,groupId:groupId});
          })
          })
        });
      });


    });
  });


  app.post("/client/updateservices", verifyToken, (req, res) => {
    var client_id = req.body.client_id;
    var client_signal = req.body.client_signal;
    var dataa = '';
    var ip_address = req.body.ipAddress;


    var PreviousDAta = GetClientData(client_id)


    const getOrderTypeName = (ordertype) => {
      if (ordertype == 1) {
        return "MARKET"
      } else if (ordertype == 2) {
        return "LIMIT"
      } else if (ordertype == 3) {
        return "STOPLOSS LIMIT"
      } else if (ordertype == 4) {
        return "STOPLOSS MARKET"
      } else {
        return ""
      }
    }

    const getProductTypeName = (producttype) => {
      if (producttype == 1) {
        return "CNC"
      } else if (producttype == 2) {
        return "MIS"
      } else if (producttype == 3) {
        return "BO"
      } else if (producttype == 4) {
        return "CO"
      } else {
        return ""
      }
    }

    const getTradingStatus = (status) => {

      if (status == "1") {

        return "ON"
      }
      if (status == "0") {

        return "OFF"
      }
      if (status == "") {

        return ""
      }
    }

    connection1.query('SELECT id,qty_type FROM `client` WHERE id=' + client_id, (err, ClientQty) => {
      var Qty_type = ClientQty[0].qty_type


      if (Qty_type == 1) {

        try {
          var Error = []
          var loop = []
          PreviousDAta.then((result_previous_data) => {
            var newData = []


            var dt = dateTime.create();
            var ccdate = dt.format('Y-m-d H:M:S');

            client_signal.forEach((val, i) => {
              var NumQty = parseInt(val.qty)

              connection1.query('UPDATE `client_service` SET `qty` = "' + val.qty + '", `trading` = "' + val.trading + '", `strategy` = "' + val.strategy + '", `order_type` = "' + val.order_type + '",`product_type`="' + val.product_type + '" WHERE `id` = "' + val.id + '" AND `service_id` = "' + val.service_id + '" AND `client_id` = "' + client_id + '"', (err, result) => {
              });
        
              result_previous_data.forEach((val1, i) => {
                if (val.id == val1.id) {
                 
                  if (val1.strategy !== val.strategy || val1.qty !== val.qty || val1.order_type !== val.order_type || val1.product_type !== val.product_type || val1.trading !== val.trading) {

                    newData.push({ "service_id": val.service_id, "service_name": val.ser_name, "client_id": val.client_id, "qty": val.qty !== val1.qty ? val.qty : "", "strategy": val.strategy !== val1.strategy ? val.strategy : "", "order_type": val.order_type !== val1.order_type ? val.order_type : "", "product_type": val.product_type !== val1.product_type ? val.product_type : "", "trading": val.trading !== val1.trading ? val.trading : "" })
                  }
                }
              })



            })

            newData.forEach(function (item, index) {
              connection1.query('INSERT INTO `trading_status_client` (`service_id`,`service_name`,`client_id`,`qty`,`strategy`,`order_type`,`product_type`,`trading`,`created_at`,`user_status`,`ip_address`) VALUES ("' + item.service_id + '","' + item.service_name + '","' + item.client_id + '","' + item.qty + '","' + item.strategy + '","' + getOrderTypeName(item.order_type) + '","' + getProductTypeName(item.product_type) + '","' + getTradingStatus(item.trading) + '","' + ccdate + '","3","' + ip_address + '")', (err, result1) => {


              })
            })

          })

          res.send({ status: true })
        } catch (error) {

        }
      } else {
        connection1.query('SELECT `client_service`.*, `services`.`service` as `ser_name`, `client`.`status` as `client_status`, `client`.`full_name` as `client_name`, `client`.`created_at` as `s_date`, `client`.`id` as `client_id`, `categorie`.`segment` as `cat_segment`, `categorie`.`name` as `cat_name` FROM `client_service` LEFT JOIN `services` ON `services`.`id` = `client_service`.`service_id` LEFT JOIN `client` ON `client`.`id` = `client_service`.`client_id` LEFT JOIN `categorie` ON `categorie`.`id` = `services`.`categorie_id` WHERE `client_service`.`client_id` =' + client_id, (err, result_previous_data) => {

          var newData = []

          result_previous_data.forEach((item, i) => {
            if (result_previous_data[i].strategy !== client_signal[i].strategy || result_previous_data[i].qty !== client_signal[i].qty || result_previous_data[i].order_type !== client_signal[i].order_type || result_previous_data[i].product_type !== client_signal[i].product_type || result_previous_data[i].trading !== client_signal[i].trading) {
              newData.push({ "service_id": client_signal[i].service_id, "service_name": client_signal[i].ser_name, "client_id": client_signal[i].client_id, "qty": client_signal[i].qty !== result_previous_data[i].qty ? client_signal[i].qty : "", "strategy": client_signal[i].strategy !== result_previous_data[i].strategy ? client_signal[i].strategy : "", "order_type": client_signal[i].order_type !== result_previous_data[i].order_type ? client_signal[i].order_type : "", "product_type": client_signal[i].product_type !== result_previous_data[i].product_type ? client_signal[i].product_type : "", "trading": client_signal[i].trading !== result_previous_data[i].trading ? client_signal[i].trading : "" })
            }
          })
          var dt = dateTime.create();
          var ccdate = dt.format('Y-m-d H:M:S');
          newData.forEach(function (item, index) {
            connection1.query('INSERT INTO `trading_status_client` (`service_id`,`service_name`,`client_id`,`qty`,`strategy`,`order_type`,`product_type`,`trading`,`created_at`,`user_status`,`ip_address`) VALUES ("' + item.service_id + '","' + item.service_name + '","' + item.client_id + '","' + item.qty + '","' + item.strategy + '","' + getOrderTypeName(item.order_type) + '","' + getProductTypeName(item.product_type) + '","' + getTradingStatus(item.trading) + '","' + ccdate + '","3","' + ip_address + '")', (err, result) => {

            })
          })


        });




        client_signal.forEach(function (item, index) {

          connection1.query('UPDATE `client_service` SET `qty` = "' + item.qty + '", `trading` = "' + item.trading + '", `strategy` = "' + item.strategy + '", `order_type` = "' + item.order_type + '",`product_type`="' + item.product_type + '" WHERE `id` = "' + item.id + '" AND `service_id` = "' + item.service_id + '" AND `client_id` = "' + client_id + '"', (err, result) => {


          });
        });
        res.send({ status: true })


      }




    })

  });


  async function GetClientData(client_id) {
    try {
      const result_previous_data = await new Promise((resolve, reject) => {
        connection1.query('SELECT `client_service`.*, `services`.`service` as `ser_name`, `client`.`status` as `client_status`, `client`.`full_name` as `client_name`, `client`.`created_at` as `s_date`, `client`.`id` as `client_id`, `categorie`.`segment` as `cat_segment`, `categorie`.`name` as `cat_name` FROM `client_service` LEFT JOIN `services` ON `services`.`id` = `client_service`.`service_id` LEFT JOIN `client` ON `client`.`id` = `client_service`.`client_id` LEFT JOIN `categorie` ON `categorie`.`id` = `services`.`categorie_id` WHERE `client_service`.`client_id` =' + client_id, (err, result) => {
          if (err) {
            reject(err); // Reject the promise if an error occurs
            return;
          }
          resolve(result); // Resolve the promise with the result
        });
      });

      return result_previous_data
      // Access the result_previous_data and perform further processing
      // ...
    } catch (error) {
      // Handle the error
      console.error(error);
    }
  }


  app.post("/client/strategy/getdescription", verifyToken, (req, res) => {
    var client_id = req.body.id_client;

    connection1.query('SELECT `strategy_client`.strategy ,`strategy`.* FROM `strategy_client` JOIN `strategy` ON `strategy_client`.strategy = `strategy`.`name` WHERE `client_id` =' + client_id, (err, result1) => {

      if (result1.length > 0) {
        res.send({ description: result1, status: true });
      } else {
        res.send({ description: [], status: false });
      }

    });
  });


  app.post("/client/fund-used", verifyToken, (req, res) => {
    try {
      var client_id = req.body.client_id;
      var fundData = req.body.fundData;

      var dt = dateTime.create();
      var ccdate = dt.format('Y-m-d H:M:S');

      connection1.query('SELECT  `fund_used`, `overall_fund`, `overall_fund_percent` FROM `client` WHERE id="' + client_id + '"', (err, existDb) => {

        var changeStatus = []
        if (existDb.length > 0) {


          var Str_status = ""
          if (fundData.fundKey == 0) {
            Str_status = "No Select"
          } else if (fundData.fundKey == 1) {
            Str_status = "Overall Fund"
          } else if (fundData.fundKey == 2) {
            Str_status = "Script Wise"
          }

          if (fundData.fundKey != existDb[0].fund_used) {
            changeStatus.push("fund used Changed to -" + Str_status)
          }


          // NO SELECT
          if (fundData.fundKey == "0") {
            connection1.query('UPDATE `client` SET `fund_used`="' + fundData.fundKey + '" WHERE id=' + client_id, (err, updateVal) => {

            })
          }

          // OVERALL FUND
          if (fundData.fundKey == "1") {

            if (fundData.data.fund != existDb[0].overall_fund) {
              changeStatus.push("overall fund Changed " + fundData.data.fund)
            }

            if (fundData.data.percentage != existDb[0].overall_fund_percent) {
              changeStatus.push("percentage Changed " + fundData.data.percentage)
            }

            connection1.query('UPDATE `client` SET `fund_used`="' + fundData.fundKey + '",`overall_fund`="' + fundData.data.fund + '",`overall_fund_percent`="' + fundData.data.percentage + '" WHERE id=' + client_id, (err, updateVal) => {
              // console.log("err", err);
            })
            var totalfund = parseInt(fundData.data.fund)
            var parcentage = parseInt(fundData.data.percentage)

            var percentage = (totalfund * parcentage) / 100


            var changeQty

            connection1.query('SELECT client_service.id,client_service.service_id,client_service.client_id,client_service.strategy,client_service.qty,client_service.script_percentage ,services.service,services.price FROM `client_service` JOIN `services` ON services.id =client_service.service_id WHERE services.categorie_id = "24" AND client_service.`client_id` =' + client_id, (err, client_serviceData) => {

              if (client_serviceData.length > 0) {

                client_serviceData.forEach((dataupdate) => {


                  changeQty = parseFloat(percentage) / parseFloat(dataupdate.price)
                  connection1.query('UPDATE `client_service` SET `qty`="' + Math.round(changeQty) + '"  WHERE id=' + dataupdate.id, (err, servicesUodate) => {

                  })

                })
              }
            })


          }

          // OVERALL FUND
          if (fundData.fundKey == "2") {
            var qtyUpdate2

            connection1.query('UPDATE `client` SET `fund_used`="' + fundData.fundKey + '" WHERE id=' + client_id, (err, updateVal) => {

            })
            if (fundData.data.length > 0) {
              fundData.data.forEach((val) => {

                connection1.query('SELECT client_service.id,client_service.service_id,client_service.client_id,client_service.strategy,client_service.qty,client_service.script_percentage ,services.service,services.price FROM `client_service` JOIN `services` ON services.id =client_service.service_id WHERE client_service.`client_id` =' + client_id + ' AND services.service="' + val.symbol + '"', (err, client_serviceData2) => {
                  if (client_serviceData2.length > 0) {
                    client_serviceData2.forEach((data) => {

                      if (val.fund != data.script_percentage) {
                        var stringVal = `${val.symbol} Value changed to  ${val.fund}`

                        connection1.query('INSERT INTO `trading_status_client`(`client_id`,`strategy`,`created_at`,`user_status`) VALUES ("' + client_id + '","' + stringVal + '","' + ccdate + '","3")', (err, result2) => { })
                      }

                      qtyUpdate2 = parseFloat(val.fund) / parseFloat(data.price)



                      connection1.query('UPDATE `client_service` SET `qty`="' + Math.round(qtyUpdate2) + '" ,`script_percentage`="' + val.fund + '"  WHERE id=' + data.id, (err, servicesUodate) => {

                      })




                    })
                  }

                })



              })



            }
          }

          //TRADING STATUS CREATE
          if (changeStatus.length > 0) {
            changeStatus.forEach((data) => {

              connection1.query('INSERT INTO `trading_status_client`(`client_id`,`strategy`,`created_at`,`user_status`) VALUES ("' + client_id + '","' + data + '","' + ccdate + '","3")', (err, result2) => { })
            })
          }


          res.send({ status: true, data: "Successfully add!" })

        } else {
          res.send({ status: false, data: "User not found!" })

        }
      })

    } catch (error) {
      // console.log("Error", error);
    }

  });


  app.post("/client/get/fund-used", verifyToken, (req, res) => {
    try {
      var client_id = req.body.client_id;

      connection1.query('SELECT  `fund_used`, `overall_fund`,`qty_type`, `overall_fund_percent` FROM `client` WHERE id="' + client_id + '"', (err, result) => {

        if (result.length > 0) {
          connection1.query('SELECT client_service.*,services.service,services.price,services.id  FROM `client_service` JOIN `services` ON `client_service`.`service_id`=`services`.`id`  WHERE `client_service`.`client_id` = "' + client_id + '" AND services.categorie_id=24', (err1, result1) => {

            res.send({ status: true, data: result, data1: result1 })
          })



        } else {
          res.send({ status: false, data: "User not found!" })

        }
      })

    } catch (error) {
      // console.log("Error", error);
    }

  });

}
