module.exports = function(app,connection1){
    var verifyToken = require('./middleware/awtJwt');
    var dateTime = require('node-datetime');
  
      app.post("/demo/signals",verifyToken,(req,res) => {
      // console.log("req",req.body);
       
        var d = new Date;
    dformat = [d.getFullYear(),
               d.getMonth()+1,
               d.getDate(),
               ].join('-');  
  var symbol=req.body.symbol;
  var strat=req.body.strategy;
  var segment=req.body.segment;
  var todate=req.body.todate;
  var fromdate=req.body.fromdate;
  var client_id=req.body.client_id;
  
  var where='';
  var where1='';
  if(symbol!='')
  {
  where+='`signals`.`symbol` = "'+symbol+'" AND';
  }
  if(segment!='')
  {
  where+='`signals`.`segment` = "'+segment+'" AND';
  }
  if(strat!='')
  {
  where+='`signals`.`strategy_tag` = "'+strat+'" AND';	
  }
  if(todate!='')
  {
  where+='`signals`.`dt_date` <= "'+String(todate)+'" AND';	
  }
  if(fromdate!='')
  {
  
  where+='`signals`.`dt_date` >= "'+String(fromdate)+'"';	
  }else
  {
  
  where+='`signals`.`dt_date` >= "'+String(dformat)+'"';
  }	
       
       
  connection1.query("SELECT * FROM `client` where `id`='"+client_id+"'"
  , (err, result_client) => {


    
    var client_key = result_client[0].client_key;
    var web_url = result_client[0].web_url;

    // console.log('client_key0 ',client_key);
    
    if (web_url==1) {
      where1 ='`signals`.`client_personal_key` IS NULL'; 
    }else{
      if (client_key!='') {
        where1+='`signals`.`client_personal_key` = "'+client_key+'"'; 
      }
      else{
  where1+='`signals`.`client_personal_key` IS NULL';  
}
} 
var Client_CreateAt = result_client[0].created_at
var dt = dateTime.create(Client_CreateAt);
var ccdate = dt.format('Y-m-d H:M:S');

    
//console.log('where -',where);
//console.log('where1 -',where1);

        // connection1.query('SELECT * FROM `demo_signals_table` LEFT JOIN `signals` ON `demo_signals_table`.`signals_id` = `signals`.`id` WHERE `demo_signals_table`.`client_id` = "'+client_id+'" ORDER BY signals.created_at DESC', (err, result) => {
          // connection1.query("SELECT `signals`.*, `signals`.`price` as `average_client_price` ,`client_service`.`qty` as `quantity`  FROM `client_service` LEFT JOIN `services` ON `client_service`.`service_id` = `services`.`id` LEFT JOIN `client` ON `client`.`id` = `client_service`.`client_id` LEFT JOIN `signals` ON `signals`.`symbol` = `services`.`service` LEFT JOIN `demo_signals_table` ON `signals`.`id` = `demo_signals_table`.`signals_id` LEFT JOIN `categorie` ON `categorie`.`id` = `services`.`categorie_id` WHERE `client_service`.`client_id` = '"+client_id+"' AND `demo_signals_table`.`client_id` = '"+client_id+"' AND  "+where1+" AND "+where+"  AND `signals`.`segment` = `categorie`.`segment` AND `signals`.`created_at` >=  '"+ccdate+"' AND `client_service`.`strategy` = `signals`.`strategy_tag`  ORDER BY `signals`.`dt_date`, `signals`.`strategy_tag`, `signals`.`trade_symbol`, `signals`.`segment`, `signals`.`option_type`, `signals`.`dt`, `signals`.`signal_id` ASC", (err, result1) => {
          //   // console.log('result -',result1)
          //  res.send({ tradehistory: result1 }); 
          //  return 
         
          //  });

          connection1.query("SELECT `demo_signals_table`.*, `demo_signals_table`.`price` as `average_client_price` ,`client_service`.`qty` as `quantity`  FROM `client_service` LEFT JOIN `services` ON `client_service`.`service_id` = `services`.`id` LEFT JOIN `client` ON `client`.`id` = `client_service`.`client_id` LEFT JOIN `demo_signals_table` ON `demo_signals_table`.`symbol` = `services`.`service` LEFT JOIN `signals` ON `signals`.`id` = `demo_signals_table`.`signals_id` LEFT JOIN `categorie` ON `categorie`.`id` = `services`.`categorie_id` WHERE `client_service`.`client_id` = '"+client_id+"' AND `demo_signals_table`.`client_id` = '"+client_id+"' AND  "+where1+" AND "+where+"  AND `demo_signals_table`.`segment` = `categorie`.`segment` AND `demo_signals_table`.`created_at` >=  '"+ccdate+"' AND `client_service`.`strategy` = `demo_signals_table`.`strategy_tag`  ORDER BY `demo_signals_table`.`dt_date`, `demo_signals_table`.`strategy_tag`, `demo_signals_table`.`trade_symbol`, `demo_signals_table`.`segment`, `demo_signals_table`.`option_type`, `demo_signals_table`.`dt` ASC", (err, result1) => {

           
            res.send({ tradehistory: result1 }); 
            return 
          
            });

        });
        });


        app.post("/demo/delete_signals_id",verifyToken,(req,res) => {  
          var signal_id=req.body.signal_id;
          var client_id=req.body.client_id; 

          connection1.query('Delete from `demo_signals_table` WHERE `signals_id`='+signal_id+' AND `client_id`='+client_id, (err, result) => {
            if (result.length !== 0) { 
            res.send({ 'status': true , 'msg' : 'signals delete Successfully......' });
            }
          });
          
        });




        app.post("/demo/update_signals_id",verifyToken,(req,res) => {  
          req.send("okkk");
          
        });


        



      
  
      }