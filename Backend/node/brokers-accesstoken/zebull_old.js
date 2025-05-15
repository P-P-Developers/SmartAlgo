const { send } = require('process');

module.exports = function(app,connection1){
  
    app.get("/api/v1/broker/zebu", (req, res) => {
     
        var axios = require('axios');
        var dateTime = require('node-datetime');
        const sha256 = require('sha256');
       
        console.log("host",req.headers);
       
        var hosts = req.headers.host;
    
        var redirect = hosts.split(':')[0];
       var redirect_uri = '';
        if(redirect == "api.smartalgo.in"){
            redirect_uri = "https://test.smartalgo.in/"    
        }else{
            redirect_uri = `https://${redirect}/`  
        }
    
         var emailstr = req.query.email;
         var email = emailstr.split('?authCode=')[0]; 

       
    
         connection1.query('SELECT * from client where `email`="' + email + '"', (err, result) => {

      if (result.length != 0) {

        var dt = dateTime.create();
        var ccdate = dt.format('Y-m-d H:M:S');

        var user_id = result[0].id;     
        var app_id = result[0].app_id;
        var api_key = result[0].api_key;
      
        var app_id_data = {
            "userId":app_id
        }
   
        
     
              var config = {
                 method: 'post',
                 url: 'https://api.zebull.in/rest/V2MobullService/api/customer/getAPIEncpkey',
                 headers: {
                     'Content-Type': 'application/json'
                 },
                 data: JSON.stringify(app_id_data)
             };
       
             axios(config)
                 .then(function(response) {
                    
                console.log('stat - ',response.data.stat);
                
              
                   
                if(response.data.stat ==  'Ok'){

                var encKey = response.data.encKey;
                console.log('stat - ',response.data.stat);

                var userData = sha256(app_id + api_key + encKey);

                 var data_userData =  {
                    "userId":app_id,
                    "userData":userData 
                }

                var config = {
                    method: 'post',
                    url: 'https://www.zebull.in/rest/MobullService/api/customer/getUserSID',
                    headers: { 
                      'Content-Type': 'application/json'
                    },
                    data : JSON.stringify(data_userData)
                  };
                  
                  axios(config)
                  .then(function (response1) {
                    console.log(response1);
                  
                    if(response1.data.stat == 'Ok'){
                     
                    connection1.query('UPDATE `client` SET `access_token` = "' + response1.data.sessionID + '",`trading_type`="on",`client_code`="'+app_id+'" WHERE `client`.`id`="' + user_id + '"', (err, result1) => {
                        ///return res.redirect(redirect_uri);
                        if (result1.length != 0) {
                            var trading = 'TradingON';
                            connection1.query('INSERT INTO `trading_status_client` (`client_id`,`trading`,`created_at`) VALUES ("' + user_id + '","' + trading + '","' + ccdate + '")', (err, result) => {
                                console.log("err", err);
     
                                return res.redirect(redirect_uri);
                            })
                        }
                    }); 


                    }else{
                             

                        connection1.query('INSERT INTO `broker_response`(`client_id`,`reject_reason`,`order_status`,`created_at`) VALUES ("' + user_id + '","' +response1.data.emsg+ '","Error","' + ccdate + '")', (err1, signal_status) => {
                            console.log('eroor query -',err1);
                            return res.redirect(redirect_uri);
                            });


                    }



                  })
                  .catch(function (error) {
                    console.log(error);
                  });             

                   
                }else{


                 connection1.query('INSERT INTO `broker_response`(`client_id`,`reject_reason`,`order_status`,`created_at`) VALUES ("' + user_id + '","' +response.data.emsg+ '","Error","' + ccdate + '")', (err1, signal_status) => {
                    console.log('eroor query -',err1);
                    return res.redirect(redirect_uri);
                    });
              
          

                }



                 })
                 .catch(function(error) {
                    console.log('access token error ',error);
                 }); 


                }


                });
      
       
    
       });
    
    }