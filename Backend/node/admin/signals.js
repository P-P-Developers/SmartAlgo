module.exports = function (app, connection1) {
  var verifyToken = require('./middleware/awtJwt');



  app.post("/smartalgo/tradehistory", verifyToken, (req, res) => {

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

    var where = '';
    if (symbol != '') {
      where += '`signals`.`symbol` = "' + symbol + '" AND';
    }
    if (segment != '') {

      // if(segment == "O" || segment == "o") { 
      //   where+='`signals`.`segment` LIKE "%'+segment+'%" AND'; 
      // }else{
      where += '`signals`.`segment` = "' + segment + '" AND';
      // }
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




    connection1.query("SELECT `signals`.*, `categorie`.`segment` as `cat_segment`, `categorie`.`name` as `cat_name` FROM `signals` LEFT JOIN `categorie` ON `categorie`.`segment` = `signals`.`segment` WHERE " + where + "  ORDER BY `dt_date`, `trade_symbol`,`strategy_tag`, `segment`, `option_type`, `signal_id` ASC", (err, result) => {
      return res.send({ tradehistory: result });
    });
  });


  app.post("/smartalgo/signals", verifyToken, (req, res) => {

    var d = new Date;
    dformat = [d.getFullYear(),
    d.getMonth() + 1,
    d.getDate(),
    ].join('-');
    var symbol = req.body.symbol;
    var strat = req.body.strategy;
    //var segment=req.body.segment;
    var todate = req.body.todate;
    var fromdate = req.body.fromdate;

    var segment = req.body.segment;



    var where = '';
    if (symbol != '') {
      where += '`signals`.`symbol` = "' + symbol + '" AND';
    }
    if (segment != '') {
      // if(segment == "O" || segment == "o") { 
      //   where+='`signals`.`segment` LIKE "%'+segment+'%" AND'; 
      // }else{
      where += '`signals`.`segment` = "' + segment + '" AND';
      // }
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




    connection1.query("SELECT `signals`.*, `categorie`.`segment` as `cat_segment`, `categorie`.`name` as `cat_name` FROM `signals` LEFT JOIN `categorie` ON `categorie`.`segment` = `signals`.`segment` WHERE " + where + "  ORDER BY `signals`.`id` DESC", (err, result) => {
      
      return res.send({ signals: result });
    });
  });


  app.get("/smartalgo/symbolsgroup", verifyToken, (req, res) => {
    connection1.query("SELECT `symbol`  FROM `signals` where `symbol`!='' GROUP BY `symbol` ORDER BY `symbol` ASC"
      , (err, result) => {

        res.send({ symbols: result });
      });
  });

  app.get("/smartalgo/strategygroup", verifyToken, (req, res) => {
    connection1.query("SELECT * FROM `strategy` ORDER BY `id` DESC"
      , (err, result) => {

        res.send({ strategy: result });
      });
  });


  app.get("/smartalgo/strategygroup", verifyToken, (req, res) => {
    connection1.query("SELECT * FROM `signals` WHERE `dt_date` = '2023-05-24' AND (`type` = 'LE' OR `type` = 'SE')"
      , (err, result) => {

        res.send({ strategy: result });
      });
  });





}	