

module.exports = function(app,connection1){

    app.post("/smartalgo/client/app/access_token",(req,res) => {
        var clientId=req.body.client_id;
          connection1.query('SELECT * FROM `client` WHERE `id` = "'+clientId+'"', (err, result) => {
            if(result == ""){
              res.send({result:result, status:false});
            }
          // console.log("result", result[0])
          // if(result[0].access_token != null && result[0].access_token != "" && result[0].trading_type == 'on'){
            //console.log("if")
            res.send({result:result, status:true});
          // }else{
          //  // console.log("else", result.access_token)
          //  res.send({message:"Broker not login", status:false});
          // }
           
          });
      });
}