module.exports = function (app, connection1) {
    var verifyToken = require('./middleware/awtJwt');



    app.get("/smartalgo/client-names", verifyToken, (req, res) => {

        // console.log("okkkk");

        connection1.query("SELECT id,username FROM `client` WHERE `licence_type` = 2 ", (err, result) => {

            res.send({ clientName: result });
        });
    });



    app.post("/smartalgo/client-tradehistory", verifyToken, (req, res) => {
      
        
        connection1.query('SELECT `client_transactions`.* ,`signals`.*  FROM `client_transactions` JOIN `signals` ON `client_transactions`.`last_signal_id` = `signals`.id WHERE `client_id` ='+req.body.client_id,(err,result)=>{
            // console.log(result);

            res.send({signals:result})
        })

        // var d = new Date;
        // dformat = [d.getFullYear(),
        // d.getMonth() + 1,
        // d.getDate(),
        // ].join('-');
        // var symbol = req.body.symbol;
        // var strat = req.body.strategy;
        // var segment = req.body.segment;
        // var todate = req.body.todate;
        // var fromdate = req.body.fromdate;

        // var where = '';
        // if (symbol != '') {
        //     where += '`signals`.`symbol` = "' + symbol + '" AND';
        // }
        // if (segment != '') {    
        //     where += '`signals`.`segment` = "' + segment + '" AND';  
        // }
        // if (strat != '') {
        //     where += '`signals`.`strategy_tag` = "' + strat + '" AND';
        // }
        // if (todate != '') {
        //     where += '`signals`.`dt_date` <= "' + String(todate) + '" AND';
        // }
        // if (fromdate != '') {

        //     where += '`signals`.`dt_date` >= "' + String(fromdate) + '"';
        // } else {

        //     where += '`signals`.`dt_date` >= "' + String(dformat) + '"';
        // }


        // console.log('where -', where);


        // connection1.query("SELECT `signals`.*, `categorie`.`segment` as `cat_segment`, `categorie`.`name` as `cat_name` FROM `signals` LEFT JOIN `categorie` ON `categorie`.`segment` = `signals`.`segment` WHERE " + where + "  ORDER BY `dt_date`, `trade_symbol`,`strategy_tag`, `segment`, `option_type`, `signal_id` ASC", (err, result) => {
        //     // console.log(err);
        //     console.log("SELECT `signals`.*, `categorie`.`segment` as `cat_segment`, `categorie`.`name` as `cat_name` FROM `signals` LEFT JOIN `categorie` ON `categorie`.`segment` = `signals`.`segment` WHERE " + where + "  ORDER BY `dt_date`, `trade_symbol`,`strategy_tag`, `segment`, `option_type`, `signal_id` ASC");
        //     res.send({ tradehistory: result });
        // });
    });








}	