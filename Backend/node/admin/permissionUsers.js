module.exports = function (app, connection1) {
    var verifyToken = require('./middleware/awtJwt');
    var dateTime = require('node-datetime');
    var axios = require('axios');

    app.get('/admin/AllPermissionType', (req, res) => {
        var dt = dateTime.create();
        var ccdate = dt.format('Y-m-d');

        connection1.query('SELECT * FROM `permission_type`', (err, result) => {
            // console.log("err", err);
            if(result.length > 0){
                res.send({status:true , data: result });
            }else{
                res.send({status:false , data: [] });

            }
        })
    })

    app.get('/admin/AllSegment', (req, res) => {
        var dt = dateTime.create();
        var ccdate = dt.format('Y-m-d');

        connection1.query('SELECT * FROM `categorie`', (err, result) => {
            // console.log("err", err);
            if(result.length > 0){
                res.send({status:true , data: result });
            }else{
                res.send({status:false , data: [] });

            }
        })
    })

   
    app.post('/admin/UpdateUserPermission',async (req, res) => {
        var dt = dateTime.create();
        var ccdate = dt.format('Y-m-d');

    //    console.log("req -- ",req.body);

       var d = new Date();
       dformat = [d.getFullYear(),
       d.getMonth() + 1,
       d.getDate(),
       ].join('/') + ' ' + [d.getHours(),
       d.getMinutes(),
       d.getSeconds()
       ].join(':');

       let user_id = req.body.user_id;
       let permission = req.body.permission;
       let segmentArray = req.body.segment;
       
     
     
      await  connection1.query('Delete from `permission_users` Where `user_id`=' + user_id, async (err, result_delete) => {
     
        if (segmentArray.length > 0) {
           let segment = segmentArray.join(',');

           connection1.query('UPDATE `client` SET `segment_all`="' + segment + '" WHERE `id`=' + user_id, (err, result_segment) => {
          //  console.log("err segment", err);
          });

        }

        
        if(permission.length > 0){
            await permission.forEach(async(element) => {
                  
             console.log("query -",'SELECT * FROM `permission_users` WHERE `permission_type_id` = '+element+' AND `user_id` = ' + user_id + ' AND `unique_user_permission` = "' + element+"_"+user_id +'"');
                 await connection1.query('SELECT * FROM `permission_users` WHERE `permission_type_id` = '+element+' AND `user_id` = ' + user_id + ' AND `unique_user_permission` = "' + element+"_"+user_id +'"', async (err, result) => {
                
                    //  console.log("err",err);
                    //  console.log("result ",result.length);
                    
                     if(result.length == 0){
                       
                        connection1.query('INSERT INTO `permission_users` (`permission_type_id`,`user_id`,`unique_user_permission`,`created_at`,`updated_at`) VALUES ('+element+','+ user_id+',"' + element+"_"+user_id + '","' + dformat + '","' + dformat + '")', (err, result) => {
                            // console.log(err);
                            //  console.log(result);

                        });

 
                     }
 
 
                     
                 
                 });
             });
        }

        }); 
       
      res.send({status:true,msg : "permission update successfully"})
       
    })

    try {
        app.post('/getUserPermission',async (req, res) => {
            // console.log("req -- ",req.body);
            let user_id = req.body.user_id;
    
       
    
         connection1.query('SELECT `permission_type_id`,`user_id` FROM `permission_users` WHERE `user_id`='+user_id, (err, result) => {
                // console.log("err", err);
                if(result.length > 0){
                    
                    connection1.query('SELECT `segment_all` FROM `client` WHERE `id`='+user_id, (err, result_segment) => {
                         
                          const segments = result_segment[0].segment_all.split(',');
                          const outputArray = segments.map(segment => ({ "segment": segment }));
                          res.send({status:true , data: result , segment : outputArray});
                    })
    
    
                }else{
                    res.send({status:false , data: [] });
    
                }
            })
        
        })
    } catch (error) {
        res.send(error)
        // console.log(error);
        
    }

   
    





    app.get('/bse_cashadd', async(req, res) => {
     res.send("Okk")
     return

        var d = new Date();
        dformat = [d.getFullYear(),
        d.getMonth() + 1,
        d.getDate(),
        ].join('/') + ' ' + [d.getHours(),
        d.getMinutes(),
        d.getSeconds()
        ].join(':');
        var dt = dateTime.create();
        var ccdate = dt.format('Y-m-d');
        var config = {
            method: 'get',
            url: 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json',
        };
       await axios(config)
            .then(function(response) {
                let count = 0;
                response.data.forEach(async(element) => {
                if(element.exch_seg =="BSE" && element.expiry == "" && element.lotsize == "1"){
                 count++
                 console.log("count -- ",count);
                 const service = element.name + "#";
                 console.log("service -- ",service , 'token - ',element.token);

                await connection1.query('SELECT id  FROM `services` WHERE `categorie_id` = 40 AND `service` = "' + service + '" AND `instrument_token` = "' + element.token + '"', async (err, result) => {
                     console.log(" err ",err);
                    if (result.length > 0) {

                    console.log("ifffff condition");
                      
                    }else{
                        console.log("else condition");
                          connection1.query('INSERT INTO `services`  (`categorie_id`,`service`,`created_at`,`instrument_token`,`zebu_token`) VALUES ("40","' + service + '","' + dformat + '","' + element.token + '","' + element.symbol + '")', (err, result) => {
                            console.log(err);
                            //  console.log(result);

                        });

                    }

                });


                 
                }
              });

              

              

    
            })
            .catch(function (error_broker) {
                console.log('error_broker -', error_broker);
            });
      
    })




   

 


}