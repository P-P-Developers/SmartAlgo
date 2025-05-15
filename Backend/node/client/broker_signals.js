const express = require("express");
var bodyparser = require('body-parser');
const app = express();
const http = require("http");
var qs = require('qs');
const fs = require('fs');
const path = require('path');
const https = require('https');
const async = require('async');
var dateTime = require('node-datetime');


var rawBodySaver = function (req, res, buf, encoding) {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
}

const aliceblue = require('./brokers/aliceblue');
aliceblue.access_token(app);
const zerodha = require('./brokers/zerodha');
zerodha.access_token(app);
const zebull = require('./brokers/zebull');
zebull.access_token(app);
const fyers = require('./brokers/fyers');
fyers.access_token(app);
const fivepaisa = require('./brokers/fivepaisa');
fivepaisa.access_token(app);
const mastertrust = require('./brokers/mastertrust');
mastertrust.access_token(app);
const markethub = require('./brokers/markethub');
markethub.access_token(app);
const angelbroking = require('./brokers/angelbroking');
angelbroking.access_token(app);
const b2c = require('./brokers/b2c');
b2c.access_token(app);
const anandrathi = require('./brokers/anandrathi');
anandrathi.access_token(app);
const choiceindia = require('./brokers/choiceindia');
choiceindia.access_token(app);
const mandot = require('./brokers/mandot');
mandot.access_token(app);
const motilaloswal = require('./brokers/motilal_oswal');
motilaloswal.access_token(app);
const kotak = require('./brokers/kotak');
kotak.access_token(app);
const iiflsecurities = require('./brokers/iiflsecurities');
iiflsecurities.access_token(app);

const smartalgo = require('./connections/smartalgo');
const connection2 = eval(smartalgo);

function get_date() {
    var d = new Date,
        dformat = [d.getFullYear(),
        d.getMonth() + 1,
        d.getDate(),
        ].join('/') + ' ' + [d.getHours(),
        d.getMinutes(),
        d.getSeconds()
        ].join(':')
    return dformat;
}

module.exports = function(app,connection1){

    app.post("/smartalgo/client/app/place_order",(req,res) => {
      var userdata = JSON.parse(req.body.userdata);
      var broker = userdata[0].broker;
      
      var item =  userdata[0];
      //console.log("UserData checkkk", item);
      //console.log("broker signal file item", item);
      connection1.query('Select * From `client` where `id`='+item.id, (errrr, result) => {
    //    console.log("items query error check",errrr);
    //    console.log("items query data check",result[0].signal_execution);
      var signal_execution = result[0].signal_execution;
      var last_signal_id = req.body.last_signal_id;
      const data = req.body.signal;
      const signal = JSON.parse(data);
     
      var signal_req = Buffer.from(JSON.stringify(signal)).toString('base64');
      const fs = require('fs');
      const panelkey1 = require("./panel-key1.json");
      var str = "";
    //if (signal.client_key != undefined) {
      str = signal.client_key
      const first3_key = str.substring(0, 3);
      var paneldata = panelkey1.panel.filter(x => x.key === first3_key);
      var panelname = paneldata[0].name;
      var filePath = path.join(__dirname + '/AllPanelTextFile', panelname + '.txt');
      var directoryfilePath = path.join(__dirname + '/AllPanelTextFile');
      if (fs.existsSync(filePath)) {
        fs.appendFile(filePath, "-------------------------------------------------------------------------------------------------------------------------------- n\n Time - "+new Date()+" symbol - " + JSON.stringify(req.body) + "***\\n\n", function (err) {
            if (err) {
                // return console.log(err);
            }
            //console.log("Data created");
        });
     } else {
        fs.writeFile(filePath, "-------------------------------------------------------------------------------------------------------------------------------- ***\n\n Time - "+new Date()+" symbol - " + JSON.stringify(req.body) + "***\\n\n", function (err) {
            if (err) {
                return console.log(err);
            }
            //console.log("The file was saved!");
        });
    }
      //res.send(paneldata[0].name);
    //   res.send({data:});
      if (item.access_token != '' && item.access_token != null && item.access_token != undefined && item.trading_type == 'on' && signal_execution == '2') {
        if (broker == '1'){

            connection1.query('INSERT INTO `broker_response`(`client_id`,`receive_signal`,`trading_status`,`created_at`) VALUES ("' + item.id + '","' + signal_req + '","ON","' + get_date() + '")', (err1, bro_res_last) => {
                // console.log('eroor query broker response -', err1);

                var bro_res_last_id = bro_res_last.insertId;
                
                fs.appendFile(filePath, 'Alice Blue  =   client Username - ' + item.username + '  client id - ' + item.id + ' Enter Alice blue Broker \n\n', function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });

            aliceblue.place_order(item, signal, connection1, last_signal_id, connection2, bro_res_last_id, filePath);
            res.send({message:"Signal; Send successfully"});
            });
          

        }

           //Broker Zerodha
      else if (item.broker == '2') {

        connection1.query('INSERT INTO `broker_response`(`client_id`,`receive_signal`,`trading_status`,`created_at`) VALUES ("' + item.id + '","' + signal_req + '","ON","' + get_date() + '")', (err1, bro_res_last) => {
            // console.log('eroor query broker response -', err1);

            var bro_res_last_id = bro_res_last.insertId;

            fs.appendFile(filePath, 'Zerodha  =   client Username - ' + item.username + '  client id - ' + item.id + ' Enter Zerodha Broker ***\n\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });

            zerodha.place_order(item, signal, connection1, last_signal_id, connection2, bro_res_last_id, filePath);
            res.send({message:"Signal; Send successfully"});

        });

    }

    //Broker Zebull
    else if (item.broker == '3') {

        connection1.query('INSERT INTO `broker_response`(`client_id`,`receive_signal`,`trading_status`,`created_at`) VALUES ("' + item.id + '","' + signal_req + '","ON","' + get_date() + '")', (err1, bro_res_last) => {
            // console.log('eroor query broker response -', err1);

            var bro_res_last_id = bro_res_last.insertId;

            fs.appendFile(filePath, 'Zebull  =   client Username - ' + item.username + '  client id - ' + item.id + ' Enter Zebull Broker ***\n\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });

            zebull.place_order(item, signal, connection1, last_signal_id, connection2, bro_res_last_id, filePath);
            res.send({message:"Signal; Send successfully"});
        });

    }

    //Broker Angel
    else if (item.broker == '4') {
        connection1.query('INSERT INTO `broker_response`(`client_id`,`receive_signal`,`trading_status`,`created_at`) VALUES ("' + item.id + '","' + signal_req + '","ON","' + get_date() + '")', (err1, bro_res_last) => {
            // console.log('eroor query broker response -', err1);

            var bro_res_last_id = bro_res_last.insertId;

            fs.appendFile(filePath, 'Angel  =   client Username - ' + item.username + '  client id - ' + item.id + ' Enter Angel Broker ***\n\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });

            angelbroking.place_order(item, signal, connection1, last_signal_id, connection2, bro_res_last_id, filePath);
            res.send({message:"Signal; Send successfully"});
        });

    }

    //Broker Fyers
    else if (item.broker == '6') {

        connection1.query('INSERT INTO `broker_response`(`client_id`,`receive_signal`,`trading_status`,`created_at`) VALUES ("' + item.id + '","' + signal_req + '","ON","' + get_date() + '")', (err1, bro_res_last) => {
            // console.log('eroor query broker response -', err1);

            var bro_res_last_id = bro_res_last.insertId;
            fs.appendFile(filePath, 'Fyers  =   client Username - ' + item.username + '  client id - ' + item.id + ' Enter Fyers Broker ***\n\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });

            fyers.place_order(item, signal, connection1, last_signal_id, connection2, bro_res_last_id, filePath);
            res.send({message:"Signal; Send successfully"});
        });

    }

    //Broker FivePaisa
    else if (item.broker == '5') {

        connection1.query('INSERT INTO `broker_response`(`client_id`,`receive_signal`,`trading_status`,`created_at`) VALUES ("' + item.id + '","' + signal_req + '","ON","' + get_date() + '")', (err1, bro_res_last) => {
            // console.log('eroor query broker response -', err1);

            fs.appendFile(filePath, '5 Paisha  =   client Username - ' + item.username + '  client id - ' + item.id + ' Enter 5 Paisha Broker ***\n\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });

            var bro_res_last_id = bro_res_last.insertId;

            fivepaisa.place_order(item, signal, connection1, last_signal_id, connection2, bro_res_last_id, filePath);
            res.send({message:"Signal; Send successfully"});
        });

    }

    //Broker Market Hub
    else if (item.broker == '9') {

        connection1.query('INSERT INTO `broker_response`(`client_id`,`receive_signal`,`trading_status`,`created_at`) VALUES ("' + item.id + '","' + signal_req + '","ON","' + get_date() + '")', (err1, bro_res_last) => {
            // console.log('eroor query broker response -', err1);

            fs.appendFile(filePath, 'Markethub  =   client Username - ' + item.username + '  client id - ' + item.id + ' Enter Markethub Broker ***\n\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });

            var bro_res_last_id = bro_res_last.insertId;

            markethub.place_order(item, signal, connection1, last_signal_id, connection2, bro_res_last_id, filePath);
            res.send({message:"Signal; Send successfully"});
        });

    }

    //Broker Master trust
    else if (item.broker == '10') {

        connection1.query('INSERT INTO `broker_response`(`client_id`,`receive_signal`,`trading_status`,`created_at`) VALUES ("' + item.id + '","' + signal_req + '","ON","' + get_date() + '")', (err1, bro_res_last) => {
            // console.log('eroor query broker response -', err1);

            var bro_res_last_id = bro_res_last.insertId;

            fs.appendFile(filePath, 'Mastertrust  =   client Username - ' + item.username + '  client id - ' + item.id + ' Enter Mastertrust Broker ***\n\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });

            mastertrust.place_order(item, signal, connection1, last_signal_id, connection2, bro_res_last_id, filePath);
            res.send({message:"Signal; Send successfully"});
        });
    }

    //Broker B2C
    else if (item.broker == '11') {

        connection1.query('INSERT INTO `broker_response`(`client_id`,`receive_signal`,`trading_status`,`created_at`) VALUES ("' + item.id + '","' + signal_req + '","ON","' + get_date() + '")', (err1, bro_res_last) => {
            // console.log('eroor query broker response -', err1);

            fs.appendFile(filePath, 'B2C  =   client Username - ' + item.username + '  client id - ' + item.id + ' Enter B2C Broker ***\n\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });

            var bro_res_last_id = bro_res_last.insertId;

            b2c.place_order(item, signal, connection1, last_signal_id, connection2, bro_res_last_id, filePath);
            res.send({message:"Signal; Send successfully"});
        });

    }

    else if (item.broker == '12') {

        connection1.query('INSERT INTO `broker_response`(`client_id`,`receive_signal`,`trading_status`,`created_at`) VALUES ("' + item.id + '","' + signal_req + '","ON","' + get_date() + '")', (err1, bro_res_last) => {
            // console.log('eroor query broker response -', err1);

            var bro_res_last_id = bro_res_last.insertId;

            fs.appendFile(filePath, 'Motilal Oswal  =   client Username - ' + item.username + '  client id - ' + item.id + ' Enter MotilalOswal Broker ***\n\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });

            console.log('motilaloswal');
            motilaloswal.place_order(item, signal, connection1, last_signal_id, connection2, bro_res_last_id, filePath);
            res.send({message:"Signal; Send successfully"});
        });
    }

    //Broker AnandRathi
    else if (item.broker == '13') {

        connection1.query('INSERT INTO `broker_response`(`client_id`,`receive_signal`,`trading_status`,`created_at`) VALUES ("' + item.id + '","' + signal_req + '","ON","' + get_date() + '")', (err1, bro_res_last) => {
            // console.log('eroor query broker response -', err1);

            fs.appendFile(filePath, 'Anand Rathi  =   client Username - ' + item.username + '  client id - ' + item.id + ' Enter Anand Rathi Broker ***\n\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });

            var bro_res_last_id = bro_res_last.insertId;
            // console.log('Anandrathi');
            anandrathi.place_order(item, signal, connection1, last_signal_id, connection2, bro_res_last_id, filePath);
            res.send({message:"Signal; Send successfully"});
        });
    }

    //  Broker ChoiceIndia
    else if (item.broker == '14') {

        connection1.query('INSERT INTO `broker_response`(`client_id`,`receive_signal`,`trading_status`,`created_at`) VALUES ("' + item.id + '","' + signal_req + '","ON","' + get_date() + '")', (err1, bro_res_last) => {
            // console.log('eroor query broker response -', err1);

            var bro_res_last_id = bro_res_last.insertId;

            fs.appendFile(filePath, 'ChoiceIndia  =   client Username - ' + item.username + '  client id - ' + item.id + ' Enter ChoiceIndia Broker ***\n\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });

            // console.log('choiceindia');
            choiceindia.place_order(item, signal, connection1, last_signal_id, connection2, bro_res_last_id, filePath);
            res.send({message:"Signal; Send successfully"});
        });
    }


    //  Broker mandot
    else if (item.broker == '15') {

        connection1.query('INSERT INTO `broker_response`(`client_id`,`receive_signal`,`trading_status`,`created_at`) VALUES ("' + item.id + '","' + signal_req + '","ON","' + get_date() + '")', (err1, bro_res_last) => {
            // console.log('eroor query broker response -', err1);

            var bro_res_last_id = bro_res_last.insertId;

            fs.appendFile(filePath, 'mandot  =   client Username - ' + item.username + '  client id - ' + item.id + ' Enter mandot Broker ***\n\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });

            // console.log('mandot');
            mandot.place_order(item, signal, connection1, last_signal_id, connection2, bro_res_last_id, filePath);
            res.send({message:"Signal; Send successfully"});
        });
    }


    //  Broker Kotak
    else if (item.broker == '16') {
        // console.log("Runnnnnnn");

        connection1.query('INSERT INTO `broker_response`(`client_id`,`receive_signal`,`trading_status`,`created_at`) VALUES ("' + item.id + '","' + signal_req + '","ON","' + get_date() + '")', (err1, bro_res_last) => {
            // console.log('eroor query broker response -', err1);

            var bro_res_last_id = bro_res_last.insertId;

            fs.appendFile(filePath, 'Kotak  =   client Username - ' + item.username + '  client id - ' + item.id + ' Enter Kotak Broker ***\n\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });

            // console.log('Kotak');
            kotak.place_order(item, signal, connection1, last_signal_id, connection2, bro_res_last_id, filePath);
            res.send({message:"Signal; Send successfully"});
        });
    }


    
    //  Broker IIFL Securities
    else if (item.broker == '18') {
        // console.log("Runnnnnnn");

        connection1.query('INSERT INTO `broker_response`(`client_id`,`receive_signal`,`trading_status`,`created_at`) VALUES ("' + item.id + '","' + signal_req + '","ON","' + get_date() + '")', (err1, bro_res_last) => {
            // console.log('eroor query broker response -', err1);

            var bro_res_last_id = bro_res_last.insertId;

            fs.appendFile(filePath, 'IIFL Securities  = client Username - ' + item.username + '  client id - ' + item.id + ' Enter IIFL Securities Broker ***\n\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });

            // console.log('Kotak');
            iiflsecurities.place_order(item, signal, connection1, last_signal_id, connection2, bro_res_last_id, filePath);
            res.send({message:"Signal; Send successfully"});
        });
    }


     }
    });
      });
}


    