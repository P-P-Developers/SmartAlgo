module.exports = function (app, connection1) {
  var verifyToken = require('./middleware/awtJwt');
  var dateTime = require('node-datetime');


  app.post("/client/tradehistory", verifyToken, (req, res) => {
    try {
      var d = new Date;
      dformat = [d.getFullYear(),
      d.getMonth() + 1,
      d.getDate(),
      ].join('-');
      var symbol = req.body.symbol;
      var strat = req.body.strategy;
      var segment = req.body.segment;
      var todate = req.body.todate;
      var fromdate = req.body.fromdate;
      var client_id = req.body.client_id;

      var where = '';
      var where1 = '';
      if (symbol != '') {
        where += '`signals`.`symbol` = "' + symbol + '" AND';
      }
      if (segment != '') {
        where += '`signals`.`segment` = "' + segment + '" AND `signals`.`segment` = `categorie`.`segment` AND';

      } else {
        where += '`signals`.`segment` = `categorie`.`segment` AND';
      }
      if (strat != '') {
        where += '`signals`.`strategy_tag` = "' + strat + '" AND';
      }
      if (todate != '') {
        where += '`signals`.`dt_date` <= "' + String(todate) + '" AND';
      }
      if (fromdate != '') {

        where += '`signals`.`dt_date` >= "' + String(fromdate) + '"';
      } else {

        where += '`signals`.`dt_date` >= "' + String(dformat) + '"';
      }

      connection1.query("SELECT * FROM `client` where `id`='" + client_id + "'"
        , (err, result_client) => {

          try {
            var client_key = result_client[0].client_key;
            var web_url = result_client[0].web_url;

            if (web_url == 1) {
              where1 = '`signals`.`client_personal_key` IS NULL';
            } else {
              if (client_key != '') {
                where1 += '`signals`.`client_personal_key` = "' + client_key + '"';
              }
              else {
                where1 += '`signals`.`client_personal_key` IS NULL';
              }
            }
            var Client_CreateAt = result_client[0].created_at
            var dt = dateTime.create(Client_CreateAt);
            var ccdate = dt.format('Y-m-d H:M:S');

            connection1.query("SELECT `signals`.*, `signals`.`price` as `average_client_price` ,`client_service`.`qty` as `quantity`  FROM `client_service` LEFT JOIN `services` ON `client_service`.`service_id` = `services`.`id` LEFT JOIN `client` ON `client`.`id` = `client_service`.`client_id` LEFT JOIN `signals` ON `signals`.`symbol` = `services`.`service` LEFT JOIN `categorie` ON `categorie`.`CID` = `services`.`categorie_id` WHERE `client_service`.`client_id` = '" + client_id + "' AND  " + where1 + " AND " + where + "  AND `client_service`.`strategy` = `signals`.`strategy_tag` GROUP BY `signals`.`id`  ORDER BY `signals`.`dt_date`, `signals`.`strategy_tag`, `signals`.`trade_symbol`, `signals`.`segment`, `signals`.`option_type`, `signals`.`dt`, `signals`.`signal_id` ASC", (err, result1) => {

              res.send({ tradehistory: result1 });
            });
          } catch (error) {

          }

        });
    } catch (error) {
      // console.log("Error :-", error);
    }
  });


  app.post("/client/strategy", (req, res) => {
    var client_id = req.body.client_id;
    connection1.query('SELECT * FROM `company_name`', (err, company_name) => {

      connection1.query('SELECT * FROM `strategy_client` WHERE `client_id` = ' + client_id + ' AND `strategy` NOT IN ("' + company_name[0].name + '")', (err, result1) => {

        res.send({ strategy: result1 });

      });

    })
  });


  app.post("/demo/signals", verifyToken, (req, res) => {

    var d = new Date;
    dformat = [d.getFullYear(),
    d.getMonth() + 1,
    d.getDate(),
    ].join('-');
    var symbol = req.body.symbol;
    var strat = req.body.strategy;
    var segment = req.body.segment;
    var todate = req.body.todate;
    var fromdate = req.body.fromdate;
    var client_id = req.body.client_id;

    var where = '';
    var where1 = '';
    if (symbol != '') {
      where += '`signals`.`symbol` = "' + symbol + '" AND';
    }
    if (segment != '') {
      where += '`signals`.`segment` = "' + segment + '" AND';
    }
    if (strat != '') {
      where += '`signals`.`strategy_tag` = "' + strat + '" AND';
    }
    if (todate != '') {
      where += '`signals`.`dt_date` <= "' + String(todate) + '" AND';
    }
    if (fromdate != '') {

      where += '`signals`.`dt_date` >= "' + String(fromdate) + '"';
    } else {

      where += '`signals`.`dt_date` >= "' + String(dformat) + '"';
    }


    connection1.query("SELECT * FROM `client` where `id`='" + client_id + "'"
      , (err, result_client) => {



        var client_key = result_client[0].client_key;
        var web_url = result_client[0].web_url;


        if (web_url == 1) {
          where1 = '`signals`.`client_personal_key` IS NULL';
        } else {
          if (client_key != '') {
            where1 += '`signals`.`client_personal_key` = "' + client_key + '"';
          }
          else {
            where1 += '`signals`.`client_personal_key` IS NULL';
          }
        }
        var Client_CreateAt = result_client[0].created_at
        var dt = dateTime.create(Client_CreateAt);
        var ccdate = dt.format('Y-m-d H:M:S');



        connection1.query("SELECT `signals`.*, `signals`.`price` as `average_client_price` ,`client_service`.`qty` as `quantity`  FROM `client_service` LEFT JOIN `services` ON `client_service`.`service_id` = `services`.`id` LEFT JOIN `client` ON `client`.`id` = `client_service`.`client_id` LEFT JOIN `signals` ON `signals`.`symbol` = `services`.`service` LEFT JOIN `demo_signals_table` ON `signals`.`id` = `demo_signals_table`.`signals_id` LEFT JOIN `categorie` ON `categorie`.`id` = `services`.`categorie_id` WHERE `client_service`.`client_id` = '" + client_id + "' AND `demo_signals_table`.`client_id` = '" + client_id + "' AND  " + where1 + " AND " + where + "  AND `signals`.`segment` = `categorie`.`segment` AND `signals`.`created_at` >=  '" + ccdate + "' AND `client_service`.`strategy` = `signals`.`strategy_tag`  ORDER BY `signals`.`dt_date`, `signals`.`strategy_tag`, `signals`.`trade_symbol`, `signals`.`segment`, `signals`.`option_type`, `signals`.`dt`, `signals`.`signal_id` ASC", (err, result1) => {
          res.send({ tradehistory: result1 });
          return

        });

      });
  });


  app.post("/demo/delete_signals_id", verifyToken, (req, res) => {
    var signal_id = req.body.signal_id;
    var client_id = req.body.client_id;

    connection1.query('Delete from `demo_signals_table` WHERE `signals_id`=' + signal_id + ' AND `client_id`=' + client_id, (err, result) => {
      if (result.length !== 0) {
        res.send({ 'status': true, 'msg': 'signals delete Successfully......' });
      }
    });

  });


  app.post("/client/tradehistoryd-price", verifyToken, (req, res) => {

    var allData = req.body.updateobj

    allData.forEach((item, index) => {
      connection1.query('SELECT id,price,trade_symbol,segment,strategy_tag FROM signals WHERE id =' + item.updatedId, (err, result) => {

        connection1.query('UPDATE `signals` SET `price`=' + item.updatedPrice + ' WHERE id=' + item.updatedId, (err1, result1) => {


        })
      })
    })
  })


}