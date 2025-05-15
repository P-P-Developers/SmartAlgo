var axios = require('axios');
var qs = require('qs');
var smartalgo=require('../connections/smartalgo');
function get_date()
{
var d = new Date,
    dformat = [d.getFullYear(),
               d.getMonth()+1,
               d.getDate(),
               ].join('/')+' '+
              [d.getHours(),
               d.getMinutes(),
               d.getSeconds()].join(':')
               return dformat;
              }
function access_token(app)
{
    app.get("/mastertrust/access_token",(req,res) => {
     var state=Buffer.from(req.query.state, 'base64');
     console.log('code',req.query.code);
     console.log("state",state)
     state=JSON.parse(state);
     var panel =state.panel;
     var user_id=state.user_id;
     var redirect_uri=state.url;
    var connection = eval(panel);
 
    connection.query('SELECT * from client where `id`="'+user_id+'"', (err, result) => {
    
      if(result.length!=0)
      {
   
        var data = qs.stringify({
          'grant_type': 'authorization_code',
          'code': req.query.code,
          'client_id':result[0].app_id,
          'client_secret_post':result[0].api_secret,
           'redirect_uri': 'https://180.149.241.17:3002/mastertrust/access_token',
          'authorization_response': 'authorization_response'
          
        });
        var config = {
          method: 'post',
          url: 'https://masterswift-beta.mastertrust.co.in/oauth2/token',
          auth: {
            username:result[0].app_id,
            password: result[0].api_secret
          },
          data : data
        };
        
        axios(config)
        .then(function (response) {

        var access_token=response.data.access_token; 
        connection.query('UPDATE `client` SET `access_token` = "'+access_token+'",`trading_type`="on" WHERE `client`.`id`="'+user_id+'"', (err, result) => {
          return res.redirect(redirect_uri);
        });
        })
        .catch(function (error) {
     console.log(error);
        });
      }
        
       });

    });
      
  }

  const  place_order=(item,signal,connection) => {

if(signal.segment=='C' || signal.segment=='c')
{
var instrument_query="SELECT *  FROM `services` WHERE `service` LIKE '"+signal.input_symbol+"'";
}else if(signal.segment=='F' || signal.segment=='f')
{
  var instrument_query="SELECT *  FROM `token_symbol` WHERE `symbol` LIKE '"+signal.input_symbol+"' AND `expiry` LIKE '"+signal.expiry+"' AND `segment` LIKE 'F' ";
}else if(signal.segment=='O' || signal.segment=='o')
{
  var instrument_query="SELECT *  FROM `token_symbol` WHERE `symbol` LIKE '"+signal.input_symbol+"' AND `expiry` LIKE '"+signal.expiry+"' AND `segment` LIKE 'O' AND `strike` LIKE '"+signal.strike+"' AND `option_type`='"+signal.option_type+"'";
}else if(signal.segment=='MO' || signal.segment=='mo')
{
  var instrument_query="SELECT *  FROM `token_symbol` WHERE `symbol` LIKE '"+signal.input_symbol+"' AND `expiry` LIKE '"+signal.expiry+"' AND `segment` LIKE 'MO' AND `strike` LIKE '"+signal.strike+"' AND `option_type`='"+signal.option_type+"'";
}else if(signal.segment=='MF' || signal.segment=='mf')
{
  var instrument_query="SELECT *  FROM `token_symbol` WHERE `symbol` LIKE '"+signal.input_symbol+"' AND `expiry` LIKE '"+signal.expiry+"' AND `segment` LIKE 'MF'";
}

     connection.query(''+instrument_query+';SELECT * FROM `client_service` LEFT JOIN `services` ON `services`.`id` = `client_service`.`service_id` LEFT JOIN `client` ON `client`.`id` = `client_service`.`client_id` WHERE `client_service`.`client_id` = "'+item.id+'" AND `services`.`service` = "'+signal.input_symbol+'"',[1,2], (err, result) => {
      console.log(instrument_query);
      console.log(err);
      if(result[1].length>0 && result[0].length>0)
   {
    
      var data = get_orderdata(item,signal,result,connection);
    if(data!==undefined)
    {
    var config = {
      method: 'post',
      url: 'https://masterswift-beta.mastertrust.co.in/api/v1/orders',
      headers: {Authorization: 'Bearer '+item.access_token},
      data : qs.stringify(data)
    };
    var datetime = new Date();
    console.log("ordertime1",datetime);
    axios(config)
    .then(function (response) {
      var datetime = new Date();
      console.log("ordertime2",datetime);
   
      connection.query('INSERT INTO `client_transactions`(`client_id`, `order_type`, `transaction`, `symbol`, `qty`, `price`, `exchange`, `prod_type`, `order_id`, `date`, `status`, `signal_id`, `responce`) VALUES ('+item.id+','+result[1][0].order_type+',"BUY","'+signal.input_symbol+'",'+result[1][0].qty+','+signal.price+',"'+signal.exchange+'","'+signal.product_type+'",'+response.data.data.client_order_id+',"'+get_date()+'","",'+signal.id+',"'+response.data.status+'")',(err,client_transaction) => {
    //console.log(err);
      }); 

    })
    .catch(function (error) {
  // console.log(error);
    });
  }
}
  });
}

const get_orderdata =  (item,signal,result,connection)=>{
 // console.log(result);
  var is_reject=false; 
  var exchange;
  if(signal.segment=='C' || signal.segment=='c')
{
  exchange="NSE";
}else if(signal.segment=='F' || signal.segment=='f' || signal.segment=='O' || signal.segment=='o' )
{
  exchange="NFO";
}else if(signal.segment=='MF' || signal.segment=='mf' || signal.segment=='MO' || signal.segment=='mo' )
{
  exchange="MCX";
}
  var order_type;
  var instrument_token=result[0][0].instrument_token;
  var quantity;
  var disclosed_quantity;
  var price;
  var order_side;
  var trigger_price='';
  var validity;
  var product;
  var user_order_id;
  var stop_loss = '';
  var square_off = '';
  var trailing_sl = '';

 
  if((signal.type=='LE' || signal.type=='SX') && result[1][0].order_type=='1' && signal.product_type=='CNC')
  {
    order_type='MARKET';
    instrument_token= result[0][0].instrument_token;
    quantity=1;
    disclosed_quantity=0;
    price=signal.price;
    order_side='BUY';
    validity='DAY';
    product=signal.product_type;
    user_order_id=0
   }
  else if((signal.type=='LE' || signal.type=='SX') && result[1][0].order_type=='1' && signal.product_type=='MIS')
  {
    order_type='MARKET';
    instrument_token= result[0][0].instrument_token;
    quantity=1;
    disclosed_quantity=0;
    price=signal.price;
    order_side='BUY';
    validity='DAY';
    product=signal.product_type;
    user_order_id=0
  }
  else if((signal.type=='LE' || signal.type=='SX') && result[1][0].order_type=='1' && signal.product_type=='CO')
  {
    order_type='MARKET';
    instrument_token= result[0][0].instrument_token;
    quantity=1;
    disclosed_quantity=0;
    price=signal.price;
    order_side='BUY';
    trigger_price=signal.trigger_price;
    validity='DAY';
    product=signal.product_type;
    user_order_id=0
  }
  else if((signal.type=='LE' || signal.type=='SX') && result[1][0].order_type=='2' && signal.product_type=='BO')
  { 
    order_type='LIMIT';
    instrument_token= result[0][0].instrument_token;
    quantity=1;
    disclosed_quantity=0;
    price=signal.price;
    order_side='BUY';
    validity='DAY';
    product=signal.product_type;
    user_order_id=0;
    stop_loss=signal.stop_loss;
    square_off=signal.square_off;
  }
  else if((signal.type=='LE' || signal.type=='SX') && result[1][0].order_type=='2' && signal.product_type=='MIS')
  {
    
    order_type='LIMIT';
    instrument_token= result[0][0].instrument_token;
    quantity=1;
    disclosed_quantity=0;
    price=signal.price;
    order_side='BUY';
    validity='DAY';
    product=signal.product_type;
    user_order_id=0;

  }
  else if((signal.type=='LE' || signal.type=='SX') && result[1][0].order_type=='2' && signal.product_type=='CO')
  {
    
    order_type='LIMIT';
    instrument_token= result[0][0].instrument_token;
    quantity=1;
    disclosed_quantity=0;
    price=signal.price;
    order_side='BUY';
    validity='DAY';
    product=signal.product_type;
    trigger_price=signal.trigger_price;
    user_order_id=0;
  }
  else if((signal.type=='LE' || signal.type=='SX') && result[1][0].order_type=='4' && signal.product_type=='CNC')
  {
     
    order_type='SLM';
    instrument_token= result[0][0].instrument_token;
    quantity=1;
    disclosed_quantity=0;
    price=signal.price;
    order_side='BUY';
    validity='DAY';
    product=signal.product_type;
    trigger_price=signal.trigger_price;
    user_order_id=0;
    
  }
  else if((signal.type=='LE' || signal.type=='SX') && result[1][0].order_type=='4' && signal.product_type=='MIS')
  {
    
    order_type='SLM';
    instrument_token= result[0][0].instrument_token;
    quantity=1;
    disclosed_quantity=0;
    price=signal.price;
    order_side='BUY';
    validity='DAY';
    product=signal.product_type;
    trigger_price=signal.trigger_price;
    user_order_id=0;
  }
  else if((signal.type=='LE' || signal.type=='SX') && result[1][0].order_type=='3' && signal.product_type=='CNC')
  {
    order_type='SL';
    instrument_token= result[0][0].instrument_token;
    quantity=1;
    disclosed_quantity=0;
    price=signal.price;
    order_side='BUY';
    validity='DAY';
    product=signal.product_type;
    trigger_price=signal.trigger_price;
    user_order_id=0;
  }
  else if((signal.type=='LE' || signal.type=='SX') && result[1][0].order_type=='3' && signal.product_type=='MIS')
  {
    order_type='SL';
    instrument_token= result[0][0].instrument_token;
    quantity=1;
    disclosed_quantity=0;
    price=signal.price;
    order_side='BUY';
    validity='DAY';
    product=signal.product_type;
    trigger_price=signal.trigger_price;
    user_order_id=0;
  }
  else if((signal.type=='LE' || signal.type=='SX') && result[1][0].order_type=='3' && signal.product_type=='BO')
  {
  
    order_type='SL';
    instrument_token= result[0][0].instrument_token;
    quantity=1;
    disclosed_quantity=0;
    price=signal.price;
    order_side='BUY';
    validity='DAY';
    product=signal.product_type;
    trigger_price=signal.trigger_price;
     stop_loss=signal.stop_loss;
    square_off=signal.square_off;
    user_order_id=0;
  }

  if(signal.type=='SX')
  {
   
 var promise=connection.query("SELECT * FROM `client_transactions` where `client_id`='"+result[1][0].id+"' && `symbol`='"+signal.input_symbol+"' && `transaction`='BUY' order by `id` desc LIMIT 1", (err, order_data) => {
    if(order_data.length>0)
{
    var config = {
      method: 'get',
      url: 'https://masterswift-beta.mastertrust.co.in/api/v1/order/'+order_data[0].order_id+'/history?client_id='+result[1][0].app_id,
      headers: {Authorization: 'Bearer '+item.access_token},
    };
    
    axios(config)
    .then(function (response) {
      
      if(response.data.data[0].status=='rejected')
      {
        return_data='';
        return return_data;
      }else
      {
        return_data={
          'exchange': exchange,
          'order_type': order_type,
          'instrument_token': instrument_token,
          'quantity': quantity,
          'disclosed_quantity': disclosed_quantity,
          'price': price,
          'order_side': order_side,
          'trigger_price': trigger_price,
          'validity':validity,
          'product':product,      
          'stop_loss':stop_loss,
          'square_off':square_off,
          'trailing_sl':trailing_sl,
          'user_order_id':user_order_id
        };
        return return_data;
      }
      
    })
    .catch(function (error) {
      
    });
  }else
  {
  
 return_data='';
 return return_data;
  }
  });
  }else
  {
    return_data={
      'exchange': exchange,
      'order_type': order_type,
      'instrument_token': instrument_token,
      'quantity': quantity,
      'disclosed_quantity': disclosed_quantity,
      'price': price,
      'order_side': order_side,
      'trigger_price': trigger_price,
      'validity':validity,
      'product':product,      
      'stop_loss':stop_loss,
      'square_off':square_off,
      'trailing_sl':trailing_sl,
      'user_order_id':user_order_id
    };
    return return_data;
  } 
  



}

 module.exports = {place_order,access_token}