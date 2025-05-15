module.exports = function(app, connection1) {
    var dateTime = require('node-datetime');
  var verifyToken = require('./middleware/awtJwt');
  var axios = require('axios');

    app.post("/client/broker-response",verifyToken, (req, res) => {
        var client_id = req.body.client_id;
        var dt = dateTime.create();
        var ccdate = dt.format('Y-m-d');

        connection1.query('SELECT * FROM `broker_response` WHERE  `created_at` >= "' + ccdate + '" AND `client_id`= "'+ client_id +'" ORDER BY created_at DESC', (err, result) => {
     
            // var send_request = Buffer.from(result[0].send_request, 'base64').toString('ascii');
            // var order_status = result[0].order_status;
            // var reject_reason = result[0].reject_reason;
            // var created_at = result[0].created_at;

     
            var brokerRes = []
            result.forEach((item) => {
                console.log(item.send_request)
                brokerRes.push({
                    send_request: item.send_request === null ? " ":Buffer.from(item.send_request, 'base64').toString('ascii'),
                    order_status: item.order_status,
                    reject_reason: item.reject_reason,
                    created_at: item.created_at,
                    order_id: item.order_id,
                    symbol: item.symbol,
                    receive_signal: item.receive_signal === null ? " ": Buffer.from(item.receive_signal, 'base64').toString('ascii'),
                    trading_status: item.trading_status,
                    broker_enter: item.broker_enter,
                    token_symbol: item.token_symbol === null ? " ": Buffer.from(item.token_symbol, 'base64').toString('ascii'),
                    open_possition_qty: item.open_possition_qty,
                    status: item.status,
                })
            })


            console.log("err", err);
            res.send({ msg: brokerRes });
        });

    });

    app.post("/client/broker-response/getHistoryOrder",verifyToken, async (req, res) => {
        var client_id = req.body.client_id;
        var dt = dateTime.create();
        var ccdate = dt.format('Y-m-d');

        //console.log("req.body ",req.body)
       await connection1.query('SELECT * FROM `client` WHERE  `id` = "' + client_id + '" AND `trading_type`="on" AND `access_token` != "" LIMIT 1', async(err, ClientDetails) => {
            console.log("ClientDetails ",ClientDetails)
            if(ClientDetails.length > 0){
                 
                let config1 = {
                  method: 'get',
                  maxBodyLength: Infinity,
                  url: 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/user/v1/getProfile',
                  headers: {
                    'Authorization': 'Bearer ' + ClientDetails[0].access_token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-UserType': 'USER',
                    'X-SourceID': 'WEB',
                    'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
                    'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
                    'X-MACAddress': 'MAC_ADDRESS',
                    'X-PrivateKey': ClientDetails[0].api_key
                },
                };
                
               await axios.request(config1)
                .then((response1) => {
                    
                    if(response1.data.message == "SUCCESS"){
                        connection1.query('SELECT * FROM `broker_response` WHERE  `created_at` >= "' + ccdate + '" AND `client_id`= "'+ client_id +'" AND `status`="'+0+'" ORDER BY created_at DESC', (err, result) => {


                            

                            let config = {
                            method: 'get',
                            maxBodyLength: Infinity,
                            url: 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/getOrderBook',
                                    headers: {
                                        'Authorization': 'Bearer ' + ClientDetails[0].access_token,
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json',
                                        'X-UserType': 'USER',
                                        'X-SourceID': 'WEB',
                                        'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
                                        'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
                                        'X-MACAddress': 'MAC_ADDRESS',
                                        'X-PrivateKey': ClientDetails[0].api_key
                                    },
                            };

                            axios.request(config)
                            .then((response) => {
                            //console.log(JSON.stringify(response.data));
                             if(response.data.data.length > 0 && result.length > 0){
                              
                             result.forEach(async(element) => {  
                                if(element.order_id != null){
                                const result_order = response.data.data.find(item2 => item2.orderid == element.order_id);
                                                
                                if(result_order != undefined){
                                let reject_reason;
                                if (result_order.text) {
                                    reject_reason = result_order.text;
                                } else {
                                    reject_reason = '';
                                }

                                
                                await connection1.query('UPDATE `broker_response` SET `status`="1", `order_status`="' + result_order.status + '" ,`reject_reason`="' + reject_reason + '" WHERE `client_id`="'+ClientDetails[0].id+'" AND `id`=' + element.id, (err, result) => {
                                    //console.log("err Angel order history Entry", err);
                                });




                                }else{
                                await  connection1.query('UPDATE `broker_response` SET `status`="1", `order_status`="' + response.data.message + '" WHERE `client_id`="'+ClientDetails[0].id+'" AND `id`=' + element.id, (err, result) => {
                                    //console.log("err Angel order history Entry else", err);
                                });   
                               }
                              }else{

                                await connection1.query('UPDATE `broker_response` SET `status`="1" WHERE `client_id`="'+ClientDetails[0].id+'" AND `id`=' + element.id, (err, result) => {
                                    //console.log("err Angel order history Entry", err);
                                });
                              }
                                
                             });

                             return res.send({status:true, msg: "Status Updated" }); 
                          
                             }else{
                             return res.send({status:true, msg: "Status Already Updated" });   
                             }
                            })
                            .catch((error) => {
                            console.log(error);
                            });

                                 
                         });



                    }else{
                        return res.send({status:false, msg: "Please ON The Trading Again" });
                    }
                 
                })
                .catch((error) => {
                  console.log(error);
                });
                
           
            }else{

             return res.send({status:false, msg: "Your trading is off, Please trading on" });
            }
         
 
       
      });

    });




}