const { log } = require('console');

module.exports = function (app, connection1,io) {
    var verifyToken = require('./middleware/awtJwt');



    var axios = require('axios');
    var fs = require("fs");

    var dateTime = require('node-datetime');
    var dt = dateTime.create();
    var ccdate = dt.format('Y-m-d');

    //var $ = require("jquery");
    const WebSocket = require('ws');
    var CryptoJS = require("crypto-js");
    const path = require('path');

    const redis = require('redis');
    const client_redis = redis.createClient(3001, '180.149.241.18');
    // Connect to Redis
    client_redis.on('connect', function() {
      //  console.log('Connected to Redis');
    });

   client_redis.connect();

 app.post('/getinstrumenttoken',function(req,res){
        var symbol = req.body.symbol;
        var categorie_id = req.body.categorie_id;
       
         //res.send(symbol);

 if(categorie_id == "24"){
connection1.query('SELECT `instrument_token`  FROM `services` WHERE `service`= "'+symbol+'"', (err, result) => {
            res.send({status:true,token:result[0].instrument_token,exchange:"NSE"})
        });   

}else{

    var expiry = req.body.expiry;
    var segment = req.body.segment;
   

  connection1.query('SELECT `instrument_token`,`segment`  FROM `token_symbol` WHERE `symbol` = "'+symbol+'" AND `expiry` = "'+expiry+'" AND `segment` = "'+segment+'"', (err, result) => {
        

        if(result.length > 0){
       

        var exchange;
        if(segment == "F"){
            exchange = "NFO";
        }else if(segment == "MF"){
            exchange = "MCX";
            
        }else if(segment == "MO"){
            exchange = "MCX";
            
        }else if(segment == "CF"){
            exchange = "CDS"; 
        }
        else if(segment == "CO"){
            exchange = "CDS"; 
        }
        res.send({status:true,token:result[0].instrument_token,exchange:exchange})
         
        }else{

      
        res.send({status:false})

        }


        
    });   

}


});


app.post("/manualtradegetexpiry",function(req,res){
    var categorie_id = req.body.categorie_id;
  

 
  if(categorie_id == "24"){
    // console.log("categorie_id 24",categorie_id);
    res.send({status:false,data:[]});
    }else{

      //  console.log("categorie_id else",categorie_id);

    if(categorie_id == "25"){
       
        connection1.query('SELECT `expiry`,`expiry_date_format` ,`expiry_str` FROM `token_symbol` WHERE `segment` = "F" AND `symbol`= "BANKNIFTY" AND STR_TO_DATE(expiry, "%d%m%Y") >= CURDATE() GROUP BY `expiry` ORDER BY STR_TO_DATE(expiry, "%d%m%Y") ASC LIMIT 2', (err, result) => {
          res.send({status:true,data:result})
      });  
     
    }

   else{
    var segment = "";
    if(categorie_id == "34"){
    segment = "MF";
    }
    else if(categorie_id == "35"){
    segment = "MO";   
    }
    else if(categorie_id == "36"){
    segment = "CO";    
    }
    else if(categorie_id == "37"){   
     segment = "CF";        
    }
   
    

    connection1.query('SELECT `expiry`,`expiry_date_format` ,`expiry_str` FROM `token_symbol` WHERE `segment` = "'+segment+'" AND STR_TO_DATE(expiry, "%d%m%Y") >= CURDATE() GROUP BY `expiry` ORDER BY STR_TO_DATE(expiry, "%d%m%Y") ASC LIMIT 2', (err, result) => {
        res.send({status:true,data:result})
    });   

  }


 }


});


app.post("/manual/placeOrderExcuted_below",async function(req,res){

  var dt = dateTime.create();
    var ccdate = dt.format('Y-m-d H:M:S');

    connection1.query('SELECT `panel_key` FROM `client_key_prefix_letters` LIMIT 1',async (err, panel_key) => {    
        var panelKey = panel_key[0].panel_key;

        const market_holiday_redis = await client_redis.hGet(panelKey,"market_holiday_redis");
        const market_holiday_redis_data = JSON.parse(market_holiday_redis);
      //  console.log("market_holiday_redis",market_holiday_redis_data);


        const today = new Date();
        const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const weekday = weekdays[today.getDay()];                        
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
    
        const currentDateYmd = `${year}-${month}-${day}`;

        

        const currentTime = new Date(); // Get the current time

        const desiredTime = new Date(); // Create a target time
        const targetTime = new Date(); // Create a target time
        targetTime.setHours(15); // Set the target hour (e.g., 10 AM)
        targetTime.setMinutes(25); // Set the target minute (e.g., 30 minutes);

        desiredTime.setHours(15, 24, 0, 0); // Set the desired time to 3:30 AM
       

        const hours = currentTime.getHours().toString().padStart(2, '0');
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');
        const seconds = currentTime.getSeconds().toString().padStart(2, '0');
        const formattedTime = `${hours}:${minutes}:${seconds}`;
      //  console.log(formattedTime);


       const hours1 = desiredTime.getHours().toString().padStart(2, '0');
       const minutes1 = desiredTime.getMinutes().toString().padStart(2, '0');
       const seconds1 = desiredTime.getSeconds().toString().padStart(2, '0');
       const formattedTime1 = `${hours1}:${minutes1}:${seconds1}`;


      //  console.log("currentTime - - ",formattedTime);
      //  console.log("formattedTime1 - - ",formattedTime1);

    //  if(req.body.request){
      if(!market_holiday_redis_data.includes(currentDateYmd) && weekday != 'Sunday' && weekday != 'Saturday' && formattedTime <= formattedTime1){

 
    //  console.log("request -",req.body.request); 

   let signal = req.body.request.split("@@@@@").reduce(function (obj, str, index) {
    let strParts = str.split(":");
    if (strParts[0] && strParts[1]) { //<-- Make sure the key & value are not undefined
        obj[strParts[0].replace(/\s+/g, '')] = strParts[1].trim(); //<-- Get rid of extra spaces at beginning of value 
        //logger.info(strParts[1].trim()+"M");
    }
    return obj;
}, {});



// console.log('Receive SSSSS - ', signal);
//  console.log('Receive SSSSS - ', signal);
// console.log('Receive Signal key - ', signal.client_key);
// console.log('Receive signal.exit_time - ', signal.exit_time);
// console.log('Receive signal.notrade_time - ', signal.notrade_time);
if(signal.token != undefined && signal.price > 0){
 
let makecall_below = await client_redis.hGet(panelKey,"makecall_below");

if(makecall_below){
     
    const data = JSON.parse(makecall_below);
  //  console.log("previous data -",data);
    
    const lastElement = data[data.length - 1];

    // console.log("lastElement -",lastElement);
    // console.log("lastElement -",lastElement.id);
    
    let insert_element = {
        id :  lastElement.id+1, 
        TargetPrice :  signal.targeprice, 
        StopLossPrice :  signal.stoplossprice, 
        segment:signal.segment,
        input_symbol :  signal.input_symbol, 
        wisetype :  signal.wisetyp, 
        intraday_delivery :  signal.intraday_delivery, 
        exit_time :  signal.exit_time == undefined ? '':signal.exit_time ,
        notrade_time :  signal.notrade_time, 
        token :  signal.token, 
        type :  signal.type, 
        strike_price :  signal.strike, 
        option_type :  signal.option_type, 
        expiry :  signal.expiry, 
        strategy_tag :  signal.strategy,
        exchange :  signal.exchange ,
        below_price :  signal.price ,
        time : ccdate
    } 
    
     data.push(insert_element);
    await client_redis.hSet(panelKey,"makecall_below",JSON.stringify(data));  
   
    try{
      res.send({status : true});
      return
      }catch(e){
    // console.log("make below",e);
      }
    

}else{
    let insert_element = {
        id :  1, 
        TargetPrice :  signal.targeprice, 
        StopLossPrice :  signal.stoplossprice, 
        input_symbol :  signal.input_symbol,
        segment:signal.segment,
        wisetype :  signal.wisetyp, 
        intraday_delivery :  signal.intraday_delivery, 
        exit_time :  signal.exit_time == undefined ? '':signal.exit_time , 
        notrade_time :  signal.notrade_time, 
        token :  signal.token, 
        type :  signal.type, 
        strike_price :  signal.strike, 
        option_type :  signal.option_type, 
        expiry :  signal.expiry, 
        strategy_tag :  signal.strategy,
        exchange :  signal.exchange,
        below_price :  signal.price,
        time : ccdate  
    } 
    await client_redis.hSet(panelKey,"makecall_below",JSON.stringify([insert_element]));
    try{
    res.send({status : true});
    return
    }catch(e){
  //  console.log("make below",e);
    }
}
res.send({status : true});

}else{
    res.send({status : false , msg : "Please refresh pag live price not get"});  
}




}else{

  res.send({status:false,msg:"Market is closed, orders cannot be placed"})

}

   

 });
  

})


app.post("/manual/placeOrderExcuted_above", async function(req,res){

    var dt = dateTime.create();
    var ccdate = dt.format('Y-m-d H:M:S');

  connection1.query('SELECT `panel_key` FROM `client_key_prefix_letters` LIMIT 1',async (err, panel_key) => {    
        var panelKey = panel_key[0].panel_key;

        const market_holiday_redis = await client_redis.hGet(panelKey,"market_holiday_redis");
        const market_holiday_redis_data = JSON.parse(market_holiday_redis);
        // console.log("market_holiday_redis",market_holiday_redis_data);


        const today = new Date();
        const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const weekday = weekdays[today.getDay()];                        
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
    
        const currentDateYmd = `${year}-${month}-${day}`;

        

        const currentTime = new Date(); // Get the current time

        const desiredTime = new Date(); // Create a target time
        const targetTime = new Date(); // Create a target time
        targetTime.setHours(15); // Set the target hour (e.g., 10 AM)
        targetTime.setMinutes(25); // Set the target minute (e.g., 30 minutes);

        desiredTime.setHours(15, 24, 0, 0); // Set the desired time to 3:30 AM
       

        const hours = currentTime.getHours().toString().padStart(2, '0');
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');
        const seconds = currentTime.getSeconds().toString().padStart(2, '0');
        const formattedTime = `${hours}:${minutes}:${seconds}`;
      //  console.log(formattedTime);


       const hours1 = desiredTime.getHours().toString().padStart(2, '0');
       const minutes1 = desiredTime.getMinutes().toString().padStart(2, '0');
       const seconds1 = desiredTime.getSeconds().toString().padStart(2, '0');
       const formattedTime1 = `${hours1}:${minutes1}:${seconds1}`;


      //  console.log("currentTime - - ",formattedTime);
      //  console.log("formattedTime1 - - ",formattedTime1);

        if(!market_holiday_redis_data.includes(currentDateYmd) && weekday != 'Sunday' && weekday != 'Saturday' && formattedTime <= formattedTime1){

 
    // console.log("request -",req.body.request); 
 
    let signal = req.body.request.split("@@@@@").reduce(function (obj, str, index) {
     let strParts = str.split(":");
     if (strParts[0] && strParts[1]) { //<-- Make sure the key & value are not undefined
         obj[strParts[0].replace(/\s+/g, '')] = strParts[1].trim(); //<-- Get rid of extra spaces at beginning of 
     }
     return obj;
 }, {});
 
 
//  console.log('Receive Signal key - ', signal.client_key);
 
  // console.log("token",signal.token);
// console.log("price",signal.price);

if(signal.token != undefined && signal.price > 0){
  //  console.log("IFFFFFF",signal.token);
    let makecall_above = await client_redis.hGet(panelKey,"makecall_above");

    if(makecall_above){
         
        const data = JSON.parse(makecall_above);
        
        const lastElement = data[data.length - 1];
        
        let insert_element = {
            id :  lastElement.id+1, 
            TargetPrice :  signal.targeprice, 
            StopLossPrice :  signal.stoplossprice, 
            input_symbol :  signal.input_symbol,
            segment:signal.segment,
            wisetype :  signal.wisetyp, 
            intraday_delivery :  signal.intraday_delivery, 
            exit_time :  signal.exit_time == undefined ? '':signal.exit_time ,
            notrade_time :  signal.notrade_time, 
            token :  signal.token, 
            type :  signal.type, 
            strike_price :  signal.strike, 
            option_type :  signal.option_type, 
            expiry :  signal.expiry, 
            strategy_tag :  signal.strategy,
            exchange :  signal.exchange, 
            above_price :  signal.price , 
            time : ccdate  
  
        } 
        
         data.push(insert_element);
         await client_redis.hSet(panelKey,"makecall_above",JSON.stringify(data));
         res.send({status : true});
    
    }else{
        let insert_element = {
            id :  1, 
            TargetPrice :  signal.targeprice, 
            StopLossPrice :  signal.stoplossprice, 
            input_symbol :  signal.input_symbol,
            segment:signal.segment,
            wisetype :  signal.wisetyp, 
            intraday_delivery :  signal.intraday_delivery, 
            exit_time :  signal.exit_time == undefined ? '':signal.exit_time ,
            notrade_time :  signal.notrade_time, 
            token :  signal.token, 
            type :  signal.type, 
            strike_price :  signal.strike, 
            option_type :  signal.option_type, 
            expiry :  signal.expiry, 
            strategy_tag :  signal.strategy,
            exchange :  signal.exchange,
            above_price :  signal.price ,
            time : ccdate 
        } 
        await client_redis.hSet(panelKey,"makecall_above",JSON.stringify([insert_element]));
        res.send({status : true});
    }


    res.send({status : true});


}else{

    res.send({status : false , msg : "Please refresh pag live price not get"});  
}



}else{
  res.send({status:false,msg:"Market is closed, orders cannot be placed"})
}




  });
 

 });



 app.post("/manual/getdataAboveAndBelow"  ,function(req,res){
  

//  console.log("json key ",req.body.json_key);

 connection1.query('SELECT `panel_key` FROM `client_key_prefix_letters` LIMIT 1',async (err, panel_key) => {    
    var panelKey = panel_key[0].panel_key;
  


 if(req.body.json_key == "above"){
   
    let makecall_above = await client_redis.hGet(panelKey,"makecall_above");

    if(makecall_above){

      const data = JSON.parse(makecall_above);
      if(data.length > 0){
        res.send({status:true , data : data})
      }else{
        res.send({status:false , data : []});
      }   
        
    }else{
        res.send({status:false , data : []}); 
    }


}else if(req.body.json_key == "below"){


  
    let makecall_below = await client_redis.hGet(panelKey,"makecall_below");

    if(makecall_below){

      const data = JSON.parse(makecall_below);
      if(data.length > 0){
        res.send({status:true , data : data})
      }else{
        res.send({status:false , data : []});
      }   
        
    }else{
        res.send({status:false , data : []}); 
    }


}else{
    res.send({status:false , data : []});
}

 

});
 

 });



 app.post("/manual/updatedataAboveAndBelow",async function(req,res){
  
  await connection1.query('SELECT `panel_key`,`broker_url` FROM `client_key_prefix_letters` LIMIT 1',async (err, panel_key) => {         
  let panelKey = panel_key[0].panel_key;
  // console.log("req",req.body);
  
  
  if(req.body.json_key == "above"){
    if(req.body.update_data.length > 0){   
    let makecall_above = await client_redis.hGet(panelKey,"makecall_above");
    if(makecall_above){
        
      const data = await JSON.parse(makecall_above);
      const newArray = [...data];
        await req.body.update_data.forEach(async(req_val) => {
        // console.log("req_val",req_val.id);

       
          const objectToUpdate = await newArray.find(obj => obj.id === req_val.id);
           
        //  console.log("objectToUpdate",objectToUpdate);
        
         if(objectToUpdate){
          if(req_val.TargetPrice > 0){
            objectToUpdate.TargetPrice = req_val.TargetPrice;
          }
          if(req_val.StopLossPrice > 0){
           objectToUpdate.StopLossPrice = req_val.StopLossPrice;
          }
          if(req_val.Price > 0){
            objectToUpdate.above_price = req_val.Price;
           }


             }     
        });
       
        // console.log("final array",newArray);
        await client_redis.hSet(panelKey,"makecall_above",JSON.stringify(newArray));  

      }
    }
    
  }else if(req.body.json_key == "beleow"){
    if(req.body.update_data.length > 0){   
      let makecall_below = await client_redis.hGet(panelKey,"makecall_below");
      if(makecall_below){
          
        const data = await JSON.parse(makecall_below);
        const newArray = [...data];
          await req.body.update_data.forEach(async(req_val) => {
        //  console.log("req_val",req_val.id);
  
         
            const objectToUpdate = await newArray.find(obj => obj.id === req_val.id);
             
          // console.log("objectToUpdate",objectToUpdate);
          
           if(objectToUpdate){
            if(req_val.TargetPrice > 0){
             objectToUpdate.TargetPrice = req_val.TargetPrice;
            }
            if(req_val.StopLossPrice > 0){
            objectToUpdate.StopLossPrice = req_val.StopLossPrice;
            }
            if(req_val.Price > 0){
            objectToUpdate.below_price = req_val.Price;
            }
  
               }     
          });
         
        //  console.log("final array",newArray);
          await client_redis.hSet(panelKey,"makecall_below",JSON.stringify(newArray));  
  
        }
      }

  }


    res.send("okkkkk")

    });
  
 });


 app.post("/manual/deletedataAboveAndBelow",async function(req,res){
  
  await connection1.query('SELECT `panel_key`,`broker_url` FROM `client_key_prefix_letters` LIMIT 1',async (err, panel_key) => {         
  let panelKey = panel_key[0].panel_key;
  // console.log("req",req.body);
  
  
  if(req.body.json_key == "above"){
    if(req.body.delete_data.length > 0){   
      let makecall_above = await client_redis.hGet(panelKey,"makecall_above");
      if(makecall_above){
      const data = JSON.parse(makecall_above);
      const filteredArray = data.filter((item1) => {
        const found = req.body.delete_data.find((item2) => item2.id === item1.id);
        return !found;
      });
      
      // console.log("final array -",filteredArray);
      await client_redis.hSet(panelKey,"makecall_above",JSON.stringify(filteredArray));  

     }
      

    }
    
  }else if(req.body.json_key == "beleow"){
    if(req.body.delete_data.length > 0){
       
      let makecall_below = await client_redis.hGet(panelKey,"makecall_below");
      if(makecall_below){
      const data = JSON.parse(makecall_below);
      const filteredArray = data.filter((item1) => {
        const found = req.body.delete_data.find((item2) => item2.id === item1.id);
        return !found;
      });
      
    //  console.log("final array -",filteredArray);
      await client_redis.hSet(panelKey,"makecall_below",JSON.stringify(filteredArray));  

     }  

    }

  }


  res.send("okkkkk")

    });
  
 });
 
 

 app.post("/manual/UpdatemakecallatRequest",async function(req,res){
   
  await connection1.query('SELECT `panel_key`,`broker_url` FROM `client_key_prefix_letters` LIMIT 1',async (err, panel_key) => {         
    let panelKey = panel_key[0].panel_key;

   if(req.body.wise_type_condition == "ok"){

  //   console.log("UpdatemakecallatRequest ",req.body.id);
  // console.log("UpdatemakecallatRequest ",req.body);
  
  let id = req.body.id;
  let wisetype = req.body.wisetype;
  let target = req.body.target;
  let stoploss = req.body.stoploss;
  let price = req.body.price;
  let intraday_delivery = req.body.intraday_delivery;
  let exit_time = req.body.exit_time;
  let notrade_time = req.body.notrade_time;

  let  notrade_time1 = (req.body.notrade_time).replace('-',':')
  let exit_time1 = (req.body.exit_time).replace('-',':')
   
  let target_price = 0
  let stoploss_price = 0
  let target_status = 0
  let stoploss_status = 0

  if(wisetype == "1"){
    if(target != "not"){
      let persentage_target = (parseFloat(price)*parseFloat(target))/100;
      target_price = parseFloat(price)+parseFloat(persentage_target);
      target_status = 1;
    }
    if(stoploss != "not"){
      let persentage_stoploss = (parseFloat(price)*parseFloat(stoploss))/100;
      stoploss_price = parseFloat(price)-parseFloat(persentage_stoploss);
      stoploss_status = 1;
    }
  }
  else if(wisetype == "2"){

      if(target != "not"){
      target_price = parseFloat(price)+parseFloat(target);
      target_status = 1;
      }
      if(stoploss != "not"){
      stoploss_price = parseFloat(price)-parseFloat(stoploss);
      stoploss_status = 1;
      }  

  }
 
  
  // console.log("wisetype",wisetype);
  // console.log("target_price",target_price);
  // console.log("stoploss_price",stoploss_price);
  // console.log("target_status",target_status);
  // console.log("stoploss_status",stoploss_status);



  await connection1.query('UPDATE `exucated_all_trade` SET `target_price` = "' + parseFloat((target_price).toFixed(2))+ '" , `target_status`="' +target_status+ '" , `stoploss_price` = "' + parseFloat((stoploss_price).toFixed(2))+ '" , `srtoploss_status`="' +stoploss_status+ '" , `exit_time` = "' + exit_time1 + '", `no_trade_time` = "' + notrade_time1+ '" , `mis`="' +intraday_delivery+ '"  WHERE `id` = "' + id + '"', async (err,    priceArray_result) => {

    console.log("err 1 ",err);

    await connection1.query('SELECT * FROM `exucated_all_trade` WHERE `id`='+id,async (err,current_result) => {
      // console.log("current_result",current_result);      
      // console.log("current_result 1",current_result[0].by_side);  
       
      if(current_result[0].target_status == 1){
          let target_data = await client_redis.hGet(panelKey,"openposition_target_stoplose_"+current_result[0].id);
             if(target_data){
              const data = JSON.parse(target_data);   
              data.TargetPrice = parseFloat(current_result[0].target_price);
              client_redis.hSet(panelKey,"openposition_target_stoplose_"+current_result[0].id,JSON.stringify(data)) ;

              }
             else{
          
                let element = {
                id: current_result[0].id,
                StopLossPrice:current_result[0].stoploss_price,
                TargetPrice:current_result[0].target_price,
                token:current_result[0].token,
                type:current_result[0].type,
                input_symbol:current_result[0].input_symbol,
                strike_price:current_result[0].strike_price,
                option_type:current_result[0].option_type,
                expiry:current_result[0].expiry,
                strategy_tag:current_result[0].strategy_tag,
                entry_trade_id:current_result[0].id,
                tradesymbol:current_result[0].tradesymbol,
                intraday_delivery :  intraday_delivery, 
                exit_time :  exit_time,
                notrade_time :  notrade_time 
                }

              await client_redis.hSet(panelKey,"openposition_target_stoplose_"+current_result[0].id,JSON.stringify(element));   
              
             }

           }

           if(current_result[0].srtoploss_status == 1){
     
            let stoploss_data = await client_redis.hGet(panelKey,"openposition_target_stoplose_"+current_result[0].id);

            if(stoploss_data){
                const data = JSON.parse(stoploss_data);   
                data.StopLossPrice = parseFloat(current_result[0].stoploss_price);
                client_redis.hSet(panelKey,"openposition_target_stoplose_"+current_result[0].id,JSON.stringify(data)) ;

            }else{

              
              let element = {
                id: current_result[0].id,
                StopLossPrice:current_result[0].stoploss_price,
                TargetPrice:current_result[0].target_price,
                token:current_result[0].token,
                type:current_result[0].type,
                input_symbol:current_result[0].input_symbol,
                strike_price:current_result[0].strike_price,
                option_type:current_result[0].option_type,
                expiry:current_result[0].expiry,
                strategy_tag:current_result[0].strategy_tag,
                entry_trade_id:current_result[0].id,
                tradesymbol:current_result[0].tradesymbol,
                intraday_delivery :  intraday_delivery, 
                exit_time :  exit_time,
                notrade_time :  notrade_time
                }

                await client_redis.hSet(panelKey,"openposition_target_stoplose_"+current_result[0].id,JSON.stringify(element));
                 
            }

           }
        



      });

  });

   }else{

    //  console.log("shakirrrrrrr inter trade");
    let id = req.body.id;
    let intraday_delivery = req.body.intraday_delivery;
 
   
    let  notrade_time = (req.body.notrade_time).replace('-',':')
    let exit_time = (req.body.exit_time).replace('-',':')



    await connection1.query('UPDATE `exucated_all_trade` SET `exit_time` = "' + exit_time + '", `no_trade_time` = "' + notrade_time + '" , `mis`= "' +intraday_delivery+ '"  WHERE `id` = "' + id + '"', async (err,    priceArray_result) => {
   
      // console.log("err -- ",err);
    
    });

   } 



  res.send("okkk")
 
  });
});


app.get("/gettoken"  ,function(req,res){
   res.send("okkk"); 

});


// make call function below price trade
setInterval(async() => {
  await connection1.query('SELECT `panel_key`,`broker_url` FROM `client_key_prefix_letters` LIMIT 1',async (err, panel_key) => {         
    let panelKey = panel_key[0].panel_key;
    // console.log("manual");
  //  console.log("panelKey",panelKey);

   const market_holiday_redis = await client_redis.hGet(panelKey,"market_holiday_redis");
   const market_holiday_redis_data = JSON.parse(market_holiday_redis);
  //  console.log("market_holiday_redis",market_holiday_redis_data);


   const today = new Date();
   const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
   const weekday = weekdays[today.getDay()];                        
   const year = today.getFullYear();
   const month = String(today.getMonth() + 1).padStart(2, '0');
   const day = String(today.getDate()).padStart(2, '0');

   const currentDateYmd = `${year}-${month}-${day}`;

   

   const currentTime = new Date(); // Get the current time

   const desiredTime = new Date(); // Create a target time
   const targetTime = new Date(); // Create a target time
   targetTime.setHours(15); // Set the target hour (e.g., 10 AM)
   targetTime.setMinutes(25); // Set the target minute (e.g., 30 minutes);

   desiredTime.setHours(15, 24, 0, 0); // Set the desired time to 3:30 AM
  

   const hours = currentTime.getHours().toString().padStart(2, '0');
   const minutes = currentTime.getMinutes().toString().padStart(2, '0');
   const seconds = currentTime.getSeconds().toString().padStart(2, '0');
   const formattedTime = `${hours}:${minutes}:${seconds}`;
  // console.log(formattedTime);


  const hours1 = desiredTime.getHours().toString().padStart(2, '0');
  const minutes1 = desiredTime.getMinutes().toString().padStart(2, '0');
  const seconds1 = desiredTime.getSeconds().toString().padStart(2, '0');
  const formattedTime1 = `${hours1}:${minutes1}:${seconds1}`;


  // console.log("currentTime - - ",formattedTime);
  // console.log("formattedTime1 - - ",formattedTime1);

   if(!market_holiday_redis_data.includes(currentDateYmd) && weekday != 'Sunday' && weekday != 'Saturday' && formattedTime <= formattedTime1){

     let makecall_below_data =  await client_redis.hGet(panelKey,"makecall_below");    
     if(makecall_below_data){
     var below_data = JSON.parse(makecall_below_data);
      if(below_data.length > 0){
        below_data.forEach(async(element) => {
            
            let live_data_token = await client_redis.hGet(panelKey,"live_data_"+element.token);
           
            if(live_data_token){
            let live_data = JSON.parse(live_data_token);
          //  console.log("live data",live_data);

           const currentdate = new Date();
           const hour = currentdate.getHours();
           const minute = currentdate.getMinutes();
           const currentTime = `${hour}:${minute}:`;

           const [hours, minutes] = (element.notrade_time).split('-');
           const trade_notrade_time = `${hours}:${minutes}`;

            const [hours1, minutes1] = currentTime.split(":");
            const [hours2, minutes2] = trade_notrade_time.split(":");

            const date1 = new Date();
            date1.setHours(hours1);
            date1.setMinutes(minutes1);

            const date2 = new Date();
            date2.setHours(hours2);
            date2.setMinutes(minutes2);
         
          // console.log("currentTime -",currentTime , "trade_notrade_time - ",trade_notrade_time);
           
            if(element.token == live_data.tk && date1 < date2){
          // console.log("live data",live_data,"element.token",element.token);
              if(element.type == "LE"){
               
                if(parseFloat(live_data.sp1) >= parseFloat(element.below_price)){

                 tradeExucated(element, live_data.sp1,connection1,panel_key,2,client_redis);
                 targetstoploss_check_status(io,element);
                 const index = below_data.findIndex(obj => obj.id === element.id);
                
                 if (index !== -1) {
                    below_data.splice(index, 1);
                  }

                 if(below_data.length > 0){
                     await client_redis.hSet(panelKey,"makecall_below",JSON.stringify(below_data));

                 }else{
                    await client_redis.hDel(panelKey,"makecall_below");
                 }
            

                }

              }else if(element.type == "SE"){
                if(live_data.bp1 >= element.below_price){
                    tradeExucated(element, live_data.bp1,connection1,panel_key,2,client_redis);
                    targetstoploss_check_status(io,element);
                  const index = below_data.findIndex(obj => obj.id === element.id);
                
                 if (index !== -1) {
                    below_data.splice(index, 1);
                  }

                 if(below_data.length > 0){
                     await client_redis.hSet(panelKey,"makecall_below",JSON.stringify(below_data));

                 }else{
                    await client_redis.hDel(panelKey,"makecall_below");
                 }


                   }
              }
              
            }else{
             
              // targetstoploss_check_status(io,element);
              // const index = below_data.findIndex(obj => obj.id === element.id);
                
              // if (index !== -1) {
              //    below_data.splice(index, 1);
              //  }

              // if(below_data.length > 0){
              //     await client_redis.hSet(panelKey,"makecall_below",JSON.stringify(below_data));

              // }else{
              //    await client_redis.hDel(panelKey,"makecall_below");
              // }

            }

        }
            
       });
      }

     }

    }else{

    //  console.log("manul below");
    }


    }); 

}, 1000);




// make call function above price trade
setInterval(async() => {
   await connection1.query('SELECT `panel_key`,`broker_url` FROM `client_key_prefix_letters` LIMIT 1',async (err, panel_key) => {         
    let panelKey = panel_key[0].panel_key;

    const market_holiday_redis = await client_redis.hGet(panelKey,"market_holiday_redis");
    const market_holiday_redis_data = JSON.parse(market_holiday_redis);
    // console.log("market_holiday_redis",market_holiday_redis_data);


    const today = new Date();
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weekday = weekdays[today.getDay()];                        
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const currentDateYmd = `${year}-${month}-${day}`;

    

    const currentTime = new Date(); // Get the current time

    const desiredTime = new Date(); // Create a target time
    const targetTime = new Date(); // Create a target time
    targetTime.setHours(15); // Set the target hour (e.g., 10 AM)
    targetTime.setMinutes(25); // Set the target minute (e.g., 30 minutes);

    desiredTime.setHours(15, 24, 0, 0); // Set the desired time to 3:30 AM
   

    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const seconds = currentTime.getSeconds().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;
  //  console.log(formattedTime);


   const hours1 = desiredTime.getHours().toString().padStart(2, '0');
   const minutes1 = desiredTime.getMinutes().toString().padStart(2, '0');
   const seconds1 = desiredTime.getSeconds().toString().padStart(2, '0');
   const formattedTime1 = `${hours1}:${minutes1}:${seconds1}`;


  //  console.log("currentTime - - ",formattedTime);
  //  console.log("formattedTime1 - - ",formattedTime1);

    if(!market_holiday_redis_data.includes(currentDateYmd) && weekday != 'Sunday' && weekday != 'Saturday' && formattedTime <= formattedTime1){

  
     let makecall_above_data =  await client_redis.hGet(panelKey,"makecall_above");
    //  console.log("makecall_above_data",makecall_above_data);
     if(makecall_above_data){
     var above_data = JSON.parse(makecall_above_data);
      if(above_data.length > 0){
        above_data.forEach(async(element) => {
            
            let live_data_token = await client_redis.hGet(panelKey,"live_data_"+element.token);
            if(live_data_token){
            let live_data = JSON.parse(live_data_token);
          //  console.log("live data",live_data);

           const currentdate = new Date();
           const hour = currentdate.getHours();
           const minute = currentdate.getMinutes();
           const currentTime = `${hour}:${minute}:`;

           const [hours, minutes] = (element.notrade_time).split('-');
           const trade_notrade_time = `${hours}:${minutes}`;
         
          //  console.log("currentTime -",currentTime , "trade_notrade_time - ",trade_notrade_time);

           const [hours1, minutes1] = currentTime.split(":");
           const [hours2, minutes2] = trade_notrade_time.split(":");
       
            const date1 = new Date();
            date1.setHours(hours1);
            date1.setMinutes(minutes1);

            const date2 = new Date();
            date2.setHours(hours2);
            date2.setMinutes(minutes2);


           
          if(element.token == live_data.tk && date1 < date2){   
            // console.log("trade inside");
             console.log("live data",live_data,"element.token",element.token , "sp1 ",live_data.sp1 , " element.above_price -",element.above_price);
              if(element.type == "LE"){

                
               
                if(parseFloat(live_data.sp1) >= parseFloat(element.above_price)){

                 tradeExucated(element, live_data.sp1,connection1,panel_key,1,client_redis);
                 targetstoploss_check_status(io,element);
                 const index = above_data.findIndex(obj => obj.id === element.id);
                
                 if (index !== -1) {
                    above_data.splice(index, 1);
                  }

                 if(above_data.length > 0){
                     await client_redis.hSet(panelKey,"makecall_above",JSON.stringify(above_data));

                 }else{
                    await client_redis.hDel(panelKey,"makecall_above");
                 }
            

                }

               }else if(element.type == "SE"){
                if(live_data.bp1 >= element.above_price){
                    tradeExucated(element, live_data.bp1,connection1,panel_key,1,client_redis);
                    targetstoploss_check_status(io,element);
                  const index = above_data.findIndex(obj => obj.id === element.id);
                
                 if (index !== -1) {
                    above_data.splice(index, 1);
                  }

                 if(above_data.length > 0){
                     await client_redis.hSet(panelKey,"makecall_above",JSON.stringify(above_data));

                 }else{
                    await client_redis.hDel(panelKey,"makecall_above");
                 }
                   }
              }
              

          }else{

              // console.log("element  else ",element);
              // targetstoploss_check_status(io,element);
              //    const index = above_data.findIndex(obj => obj.id === element.id);
                
              //    if (index !== -1) {
              //       above_data.splice(index, 1);
              //     }

              //    if(above_data.length > 0){
              //        await client_redis.hSet(panelKey,"makecall_above",JSON.stringify(above_data));

              //    }else{
              //       await client_redis.hDel(panelKey,"makecall_above");
              //    }

          }

        }
            
       });
      }

     }

    }else{
      //  console.log("manul above");
     }
     


    }); 

}, 1000);



}


const tradeExucated = async (row, price,connection1,panel_key,above_below,client_redis) => {
    
    var axios = require('axios');
    var panelKey = panel_key[0].panel_key
    var broker_url = panel_key[0].broker_url
      // console.log(" panelKey  ", panelKey)

     var request = "id:11@@@@@input_symbol:" + row.input_symbol + "@@@@@type:" + row.type + "@@@@@price:" + price + "@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:" + panelKey + "@@@@@exchange:NFO@@@@@product_type:MIS@@@@@strike:" + row.strike_price + "@@@@@segment:"+row.segment+"@@@@@option_type:" + row.option_type + "@@@@@expiry:" + row.expiry + "@@@@@strategy:" +row.strategy_tag + "@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@token:" + row.token + "@@@@@chain:option_chain@@@@@by_side:MAKECALL@@@@@demo:demo";


  //  console.log("exit trade ", request);

let target_price = 0
let stoploss_price = 0

if(row.wisetype != "0"){
  if(row.wisetype == "1"){
    if(above_below == 1){
        if(row.TargetPrice != "not"){
        let persentage_target = (parseFloat(row.above_price)*parseFloat(row.TargetPrice))/100;
        target_price = parseFloat(row.above_price)+parseFloat(persentage_target);
        }
        if(row.StopLossPrice != "not"){
        let persentage_stoploss = (parseFloat(row.above_price)*parseFloat(row.StopLossPrice))/100;
        stoploss_price = parseFloat(row.above_price)-parseFloat(persentage_stoploss);
        }   
     }else{

           if(row.TargetPrice != "not"){
            let persentage_target = (parseFloat(row.below_price)*parseFloat(row.TargetPrice))/100;
            target_price = parseFloat(row.below_price)+parseFloat(persentage_target);
            }
            if(row.StopLossPrice != "not"){
            let persentage_stoploss = (parseFloat(row.below_price)*parseFloat(row.StopLossPrice))/100;
            stoploss_price = parseFloat(row.below_price)-parseFloat(persentage_stoploss);
            }   

    }

  }else if(row.wisetype == "2"){
    if(above_below == 1){
     
          if(row.TargetPrice != "not"){
            target_price = parseFloat(row.above_price)+parseFloat(row.TargetPrice);
            }
            if(row.StopLossPrice != "not"){
            stoploss_price = parseFloat(row.above_price)-parseFloat(row.StopLossPrice);
            }  

      
    }else{


        if(row.TargetPrice != "not"){
            target_price = parseFloat(row.below_price)+parseFloat(row.TargetPrice);
            }
            if(row.StopLossPrice != "not"){
            stoploss_price = parseFloat(row.below_price)-parseFloat(row.StopLossPrice);
            }  
        
    }
  }

}

     

    

    var config = {
      method: 'post',
      url: broker_url,
      headers: {
        'Content-Type': 'text/plain'
      },
      data: request
    };

   await axios(config)
      .then(async function (response) {
        // console.log("id sucess 1",response.data);
        // console.log("id sucess",JSON.stringify(response.data.id));
          
           if(target_price != 0  || stoploss_price != 0){
            let traget_status = 0
            let stoploss_status = 0
            if(target_price != 0){
              traget_status = 1;
            }
            if(stoploss_price != 0){
                stoploss_status = 1;
            }

            // console.log("target_price",target_price);
            // console.log("stoploss_price",stoploss_price);
            // console.log("stoploss_status",stoploss_status);
            // console.log("traget_status",traget_status);

          await connection1.query('UPDATE `exucated_all_trade` SET `target_price` = "' + parseFloat((target_price).toFixed(2))+ '" , `target_status`="' +traget_status+ '" , `stoploss_price` = "' + parseFloat((stoploss_price).toFixed(2))+ '" , `srtoploss_status`="' +stoploss_status+ '" , `exit_time` = "' + (row.exit_time).replace('-',':') + '", `no_trade_time` = "' + (row.notrade_time).replace('-',':') + '" , `mis`="' +row.intraday_delivery+ '" WHERE `id` = "' + response.data.id + '"', async (err,    priceArray_result) => {
             
           await connection1.query('SELECT * FROM `exucated_all_trade` WHERE `id`='+response.data.id,async (err,current_result) => {
            // console.log("current_result",current_result);      
            // console.log("current_result 1",current_result[0].by_side);  
             
            if(current_result[0].target_status == 1){
                let target_data = await client_redis.hGet(panelKey,"openposition_target_stoplose_"+current_result[0].id);
                   if(target_data){
                    const data = JSON.parse(target_data);   
                    data.TargetPrice = parseFloat(current_result[0].target_price);
                    client_redis.hSet(panelKey,"openposition_target_stoplose_"+current_result[0].id,JSON.stringify(data)) ;

                    }
                   else{
                
                      let element = {
                      id: current_result[0].id,
                      StopLossPrice:current_result[0].stoploss_price,
                      TargetPrice:current_result[0].target_price,
                      token:current_result[0].token,
                      type:current_result[0].type,
                      input_symbol:current_result[0].input_symbol,
                      strike_price:current_result[0].strike_price,
                      option_type:current_result[0].option_type,
                      expiry:current_result[0].expiry,
                      strategy_tag:current_result[0].strategy_tag,
                      entry_trade_id:current_result[0].id,
                      tradesymbol:current_result[0].tradesymbol,
                      intraday_delivery :  row.intraday_delivery, 
                      exit_time :  row.exit_time == undefined ? '':row.exit_time ,
                      notrade_time :  row.notrade_time, 
                      }

                    client_redis.hSet(panelKey,"openposition_target_stoplose_"+current_result[0].id,JSON.stringify(element));   
                    
                   }

                 }

                 if(current_result[0].srtoploss_status == 1){
           
                  let stoploss_data = await client_redis.hGet(panelKey,"openposition_target_stoplose_"+current_result[0].id);

                  if(stoploss_data){
                      const data = JSON.parse(stoploss_data);   
                      data.StopLossPrice = parseFloat(current_result[0].stoploss_price);
                      client_redis.hSet(panelKey,"openposition_target_stoplose_"+current_result[0].id,JSON.stringify(data)) ;
     
                  }else{

                    
                    let element = {
                      id: current_result[0].id,
                      StopLossPrice:current_result[0].stoploss_price,
                      TargetPrice:current_result[0].target_price,
                      token:current_result[0].token,
                      type:current_result[0].type,
                      input_symbol:current_result[0].input_symbol,
                      strike_price:current_result[0].strike_price,
                      option_type:current_result[0].option_type,
                      expiry:current_result[0].expiry,
                      strategy_tag:current_result[0].strategy_tag,
                      entry_trade_id:current_result[0].id,
                      tradesymbol:current_result[0].tradesymbol,
                      intraday_delivery :  row.intraday_delivery, 
                      exit_time :  row.exit_time == undefined ? '':row.exit_time ,
                      notrade_time :  row.notrade_time, 
                      }

                      client_redis.hSet(panelKey,"openposition_target_stoplose_"+current_result[0].id,JSON.stringify(element));
                       
                  }

                 }
              



            });

           });
            

           }

      })
      .catch(function (error) {
       // console.log(error);
      });



}

const targetstoploss_check_status = (io,row) => {

  let msg = row.input_symbol + " Trade Entry Successfully.."
  if(row.segment == "O" || row.segment == "o"){
  msg = row.tradesymbol +" Trade Entry Successfully.."
  }
else if(row.segment == "F" || row.segment == "f"){
  msg = row.input_symbol + " " + row.expiry + " FUT Trade Entry Successfully.."
}
else if(row.segment == "MF" || row.segment == "mf"){
  msg = row.input_symbol + " " + row.expiry + " MCX_FUT Trade Entry Successfully.."
}
else if(row.segment == "MO" || row.segment == "mo"){
  msg = row.input_symbol + " " + row.expiry + " MCX_OPTION Trade Entry Successfully.."
}
else if(row.segment == "CF" || row.segment == "cf"){
  msg = row.input_symbol + " " + row.expiry + " CURRENCY_FUT Trade Entry Successfully.."
}
else if(row.segment == "CO" || row.segment == "co"){
  msg = row.input_symbol + " " + row.expiry + " CURRENCY_OPTION Trade Entry Successfully.."
}

    io.emit('make_call_trade', {status:true, msg:msg});
   
}






//------------------Token SET LIVE PRICE ALice Blue ---------------------  // 







//---------------------END token ET LIVE PRICE Alice Blue---------------------//






