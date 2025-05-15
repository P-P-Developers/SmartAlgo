module.exports = function (app, connection1) {
  var verifyToken = require('./middleware/awtJwt');


  // app.get("/admin/strategy", verifyToken, (req, res) => {
  //  connection1.query('SELECT * from company_name', (err, result1) => {
  //     connection1.query('SELECT * FROM `strategy` WHERE `name` NOT IN ("' + result1[0].name + '") ORDER by id DESC', (err, result) => {
  //       res.send({ strategy: result })

  //     });
  //   });
  // });


  app.get("/admin/strategy", verifyToken, (req, res) => {

    connection1.query('SELECT * FROM `strategy` ORDER by id DESC', (err, result) => {
      res.send({ strategy: result })

    });
  });

  app.post("/admin/strategy/delete", verifyToken, (req, res) => {
    var id = req.body.id;
    var name = req.body.name;

    connection1.query('SELECT * FROM `strategy_client` WHERE `strategy` = "' + name + '"', (err, strtegy_result) => {

      if (strtegy_result.length > 0) {
        res.send({ status: 'strtegy_error', msg: 'This Strategy is Already Assign Please Remove this Strategy from All Clients' })
      } else {

        connection1.query('SELECT `name` FROM `company_name` WHERE `id` = 1', (err, re) => {
          var company_name = re[0].name;

          connection1.query('Delete from `strategy_client` Where `strategy`="' + name + '"', (err, resultss) => {
            connection1.query('Delete from strategy Where `id`=' + id, (err, result) => {

              connection1.query('UPDATE `client_service` SET `strategy` = "' + company_name + '" WHERE `strategy` = "' + name + '"', (err, resultss) => {
                res.send({ status: 'true', msg: 'Strategy Deleted Successfully...' })
              });

            });

          });
        });

      }


    });

  });


  app.post("/admin/strategy/add", verifyToken, (req, res) => {
    try {


      var d = new Date();
      dformat = [d.getFullYear(),
      d.getMonth() + 1,
      d.getDate(),
      ].join('/') + ' ' +
        [d.getHours(),
        d.getMinutes(),
        d.getSeconds()].join(':');
      var strategyName = req.body.strategy
      var quantity = req.body.quantity
      var enterDescription = req.body.enterDescription
      var strat_lot_amount = req.body.strategy_lot_amount
      // var strat_lot_amount = req.body.strategy_lot_amount
      var segment_selection = req.body.segment_selection
      var catagory = req.body.catagory


      // console.log("Data",req.body);

      connection1.query('SELECT * FROM `strategy` WHERE `name` LIKE "' + strategyName + '"', (err, CheckStg) => {

        if (CheckStg.length == 0) {

          // console.log("stra", strategyName)
          // console.log("enterDescription", enterDescription)

          connection1.query('INSERT INTO strategy (`name`,`created_at`,`updated_at`,`description`,`Indicator_img`,`stratergy_tester`  , `strategy_lot_amount` , `segment_selection` , `catagory`) VALUES ("' + strategyName + '","' + dformat + '","' + dformat + '", "' + enterDescription + '","' + req.body.ImageIndicator + '","' + req.body.StrategyTester + '" ,"' + strat_lot_amount + '" ,"' + segment_selection + '","' + catagory + '")', (err, result) => {
            // console.log("err", err)
            res.send({ services: 'true' });
          });
        } else {
          res.send({ status: false, services: 'strategy already exist' });
        }
      })
    } catch (error) {
      // console.log("error", error);
    }

  });


  app.post("/admin/strategy/clients", verifyToken, (req, res) => {
    var strat_id = req.body.strat_id;

    var d = new Date();
    dformat = [d.getFullYear(),
    d.getMonth() + 1,
    d.getDate()
    ].join('-')

    connection1.query('SELECT * FROM `strategy` WHERE id = "' + strat_id + '"'
      , (err, result) => {

        var Strat_Name = result[0].name
        connection1.query("SELECT `strategy_client`.`strategy`,`client`.`username`,`strategy_client`.`client_id` FROM `strategy_client`,`client` where  `client`.`id`=`strategy_client`.`client_id` AND `strategy_client`.`strategy`='" + Strat_Name + "' AND `client`.`end_date`>='" + dformat + "' ;SELECT * FROM `client` where `end_date`>='" + dformat + "' AND `username` IS NOT NULL", [1, 2], (err, result) => {
          res.send({ sclient: result[0], client: result[1] });
        });

      });
  });


  app.post("/admin/strategy/strategy-to-clients", verifyToken, (req, res) => {
    var strat_id = req.body.strat_id;
    var clientsIds = req.body.selectedClients
    var d = new Date();
    dformat = [d.getFullYear(),
    d.getMonth() + 1,
    d.getDate()
    ].join('-')

    connection1.query('SELECT * FROM `strategy` WHERE id = "' + strat_id + '"'
      , (err, result) => {

        var Strat_Name = result[0].name



        connection1.query('SELECT `strategy_client`.*, `client`.`full_name` as `client_name` FROM `strategy_client` JOIN `client` ON `client`.`id` = `strategy_client`.`client_id` JOIN `strategy` ON `strategy`.`name` = `strategy_client`.`strategy` WHERE `strategy_client`.`strategy` = "' + Strat_Name + '"', (err, re) => {



          var db_exist_client_ids = [];
          re.forEach(function (item, index) {
            db_exist_client_ids.push(item.client_id);
          });

          // console.log('exist client ids',db_exist_client_ids);
          //  console.log(' new client ids',req.body.selectedClients);

          var add_client_strategy = [];
          req.body.selectedClients.forEach(function (item, index) {
            if (!db_exist_client_ids.includes(item)) {
              add_client_strategy.push(item);
            }
          });
          // console.log(' add_client_strategy - ',add_client_strategy);


          var delete_client_strategy = [];
          db_exist_client_ids.forEach(function (item, index) {
            if (!req.body.selectedClients.includes(item)) {
              delete_client_strategy.push(item);
            }

          });
          //console.log('delete_client_strategy - ',delete_client_strategy);


          delete_client_strategy.forEach(function (item, index) {
            connection1.query('Delete from `strategy_client` Where `strategy`="' + Strat_Name + '" AND `client_id`=' + item, (err, result) => {
              // console.log("result",result);
            })
          });



          var dataa = [];
          add_client_strategy.forEach(function (item, index) {
            dataa += '("' + item + '","' + Strat_Name + '","' + strat_id + '","' + dformat + '"),';
          });
          dataa = dataa.slice(0, -1);
          connection1.query('INSERT INTO `strategy_client`  (`client_id`,`strategy`,`strategy_id`,`created_at`) VALUES' + dataa + '', (err, result) => {
            // console.log(err);
            // console.log(result);
            res.send("Clients Added to Strategy")


          })


        });
      });
  });


  app.post("/admin/strategy/strategyname", verifyToken, (req, res) => {
    var strat_id = req.body.strat_id;
    connection1.query('SELECT * FROM `strategy` WHERE id = "' + strat_id + '"'
      , (err, result) => {
        // console.log("result", result);
        res.send({ Strat_Name: result[0].name, quantity: result[0].quantity, description: result[0].description, stratergy_tester: result[0].stratergy_tester, Indicator_img: result[0].Indicator_img, strategy_lot_amount: result[0].strategy_lot_amount, catagory: result[0].catagory, segment_selection: result[0].segment_selection })
      })
  });


  app.post("/admin/strategy/update", verifyToken, (req, res) => {



    try {
      var strat_id = req.body.strat_id;
      var StrategyName = req.body.StrategyName;
      var enterDescription = req.body.enterDescription
      var strategy_lot_amount = req.body.strategy_lot_amount
      var segment_selection = req.body.segment_selection
      var catagory = req.body.catagory




      connection1.query('UPDATE `strategy` SET `description`="' + enterDescription + '",`Indicator_img`="' + req.body.ImageIndicator + '",`stratergy_tester`="' + req.body.StrategyTester + '"  ,`strategy_lot_amount`="' + req.body.strategy_lot_amount + '" ,`strategy_lot_amount`="' + req.body.strategy_lot_amount + '",`catagory`="' + req.body.catagory + '"  ,`segment_selection`="' + req.body.segment_selection + '" WHERE id ="' + strat_id + '"'
        , (err1, result1) => {
        });

      connection1.query('SELECT * FROM `strategy` WHERE `name` LIKE "' + StrategyName + '" AND id !=' + strat_id, (err, CheckStg) => {

        if (CheckStg.length == 0) {


          connection1.query('UPDATE `strategy` SET `description`="' + enterDescription + '" WHERE id ="' + strat_id + '"'
            , (err1, result1) => {

            });

          connection1.query('SELECT * FROM `strategy` WHERE id = "' + strat_id + '"'
            , (err, exist) => {

              var exist_startegy = exist[0].name;
              connection1.query('UPDATE `strategy` SET `name`="' + StrategyName + '" WHERE id =' + strat_id
                , (err, result) => {

                  connection1.query('UPDATE `strategy_client` SET `strategy`="' + StrategyName + '" WHERE strategy_id =' + strat_id
                    , (err, result) => {

                      connection1.query('UPDATE `strategy_client` SET `strategy`="' + StrategyName + '" WHERE strategy ="' + exist_startegy + '"'
                        , (err, result) => {


                          connection1.query('UPDATE `client_service` SET `strategy`="' + StrategyName + '" WHERE strategy ="' + exist_startegy + '"'
                            , (err1, result1) => {

                              res.send("Strategy Updated");
                            });
                        });
                    });
                });
            });
        } else {
          res.send({ status: false, services: 'strategy already exist' });
        }
      })
    } catch (error) {
      // console.log("Error :-", error);
    }


  });



  app.post("/admin/strategy/clientlist", verifyToken, (req, res) => {
    var strategy_name = req.body.strategy_name;

    connection1.query('SELECT `client_service`.`client_id`,`client_service`.`id`,`client_service`.`strategy`  ,`client`.`id`,`client`.username,`client`.`email`,`client`.licence_type FROM `client_service` JOIN `client` ON `client_service`.`client_id` = `client`.id  WHERE `client_service`.`strategy`="' + strategy_name + '" GROUP BY `client_service`.`client_id`', (err, client_list) => {


      // console.log("clients", client_list);

      res.send({ data: client_list })

    });

  });



  app.get('/update-services', (req, res) => {

    try {
      const { NseIndia } = require('stock-nse-india');

      const nseIndia = new NseIndia()

      connection1.query('SELECT * FROM `services` WHERE `categorie_id` = 24', (err, result) => {

        if (result.length > 0) {

          var symbolArr = []
          result.forEach((token) => {
            var symbol = ""
            const lastChar2 = token.service[token.service.length - 1];

            if (lastChar2 == "#") {
              const modifiedValue = token.service.replace(/#/g, "");
              symbol = modifiedValue
            }
            nseIndia.getEquityDetails(symbol).then((details) => {

              // console.log("details", details.priceInfo)

            })
          })
        }
      })

    } catch (error) {
      // console.log("Errr", error);
    }

  })




}
