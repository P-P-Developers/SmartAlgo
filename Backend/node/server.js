const express = require("express");
const fileUpload = require("express-fileupload")
const fs = require('fs');
var bodyparser = require('body-parser');
const https = require('https');
const app = express();
const socketIo = require("socket.io");
const http = require("http");
require('dotenv').config();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({ limit: '10mb', extended: true }));




const mysql = require('mysql');
var cors = require('cors');
var dateTime = require('node-datetime');
const corsOpts = {
    origin: '*',

    methods: [
        'GET',
        'POST',
    ],

    allowedHeaders: [
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept", "authorization",
    ],
};
app.use(cors(corsOpts));
app.use(fileUpload());

var privateKey = fs.readFileSync('../crt/privkey.pem', 'utf8');
var certificate = fs.readFileSync('../crt/fullchain.pem', 'utf8');
var credentials = { key: privateKey, cert: certificate };

var httpsServer = https.createServer(credentials, app);

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        credentials: true
    }
});


io.on("connection", (socket) => {

    socket.on("message_broadcast", (data) => {
        socket.broadcast.emit("notification_onClient", data);
    });
    socket.on("message_help_center", (data) => {
        socket.broadcast.emit("notifi_onAdmin", data);
    });
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});




// connection1 = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'vLBA}z)/8/>%W/cy',
//     database: 'smarttradealgo_node',
//     multipleStatements: true
// });

connection1 = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database:process.env.DB_DATABASENAME,
    multipleStatements: true
});


connection1.connect((err) => {
    if (err) throw err;
    console.log(`Connected to Backend MySQL Server ${process.env.PANEL_NAME} node!' port ${process.env.PORT}`);
});


// Broker AcessToken
require('./brokers-accesstoken/angelbroking')(app, connection1);
require('./brokers-accesstoken/aliceblue')(app, connection1);
require('./brokers-accesstoken/b2c')(app, connection1);
require('./brokers-accesstoken/fivepaisa')(app, connection1);
require('./brokers-accesstoken/fyers')(app, connection1);
require('./brokers-accesstoken/markethub')(app, connection1);
require('./brokers-accesstoken/mastertrust')(app, connection1);
require('./brokers-accesstoken/zerodha')(app, connection1);
require('./brokers-accesstoken/zebull')(app, connection1);
require('./brokers-accesstoken/anandrathi')(app, connection1);
require('./brokers-accesstoken/choiceindia')(app, connection1);
require('./brokers-accesstoken/motilaloswal')(app, connection1);
require('./brokers-accesstoken/kotak')(app, connection1);
require('./brokers-accesstoken/mandotsecurities')(app, connection1);
require('./brokers-accesstoken/iiflsecurities')(app, connection1);
require('./brokers-accesstoken/arihant')(app, connection1);
require('./brokers-accesstoken/masterttrust_dealer')(app, connection1);
require('./brokers-accesstoken/laxmi')(app, connection1);
require('./brokers-accesstoken/kotak_neo')(app, connection1);
require('./brokers-accesstoken/swastika')(app, connection1);
require('./brokers-accesstoken/indira_xts')(app, connection1);
require('./brokers-accesstoken/icicidirect')(app, connection1);
require('./brokers-accesstoken/dhan')(app, connection1);
require('./brokers-accesstoken/upstox')(app, connection1);
require('./brokers-accesstoken/sharekhan')(app, connection1);
require('./brokers-accesstoken/smc')(app, connection1);
require('./brokers-accesstoken/adroit')(app, connection1);
require('./brokers-accesstoken/shoonya')(app, connection1);







//admin
require('./admin/services')(app, connection1);
require('./admin/group-service')(app, connection1);
require('./admin/Login')(app, connection1);
require('./admin/clients')(app, connection1);
require('./admin/signals')(app, connection1);
require('./admin/messageBroadcast')(app, connection1);
require('./admin/dashboard')(app, connection1);
require('./admin/reports')(app, connection1);
require('./admin/strategy')(app, connection1);
require('./admin/system')(app, connection1);
require('./admin/transactionlicence')(app, connection1);
require('./admin/adminprofile')(app, connection1);
require('./admin/cron')(app, connection1);
require('./admin/subAdmin')(app, connection1);
require('./Common/SendEmails/CommonEmail')(app, connection1);
require('./admin/tradingstatus')(app, connection1);
require('./admin/ThemeColorsSet')(app, connection1); 
//require('./admin/executeTrade')(app, connection1, io);
require('./admin/clientTradehistory')(app, connection1);
//require('./admin/manualTrade')(app, connection1, io);
require('./admin/signup')(app, connection1);

require('./admin/permissionUsers')(app, connection1);




//client
require('./client/Login')(app, connection1);
require('./client/dashboard')(app, connection1);
require('./client/Signals')(app, connection1);
require('./client/HelpCenter')(app, connection1);
require('./client/Tradehistory')(app, connection1);
require('./client/TradingStatus')(app, connection1);
require('./client/BrokerResponse')(app, connection1);



//client app
require('./client/app_api')(app, connection1);
require('./client/broker_signals')(app, connection1);

// Super Admin
require('./SuperAdmin/SuperAdmin')(app, connection1);


const redis = require('redis');
    const client_redis = redis.createClient(3001, '180.149.241.18');
    // Connect to Redis
    client_redis.on('connect', function () {
        console.log('Connected to Redis');
    });

    client_redis.connect();


app.get("/test", (req, res) => {

   
res.send("okkk")

});










app.get("/smartalgo/category", (req, res) => {
    connection1.query('SELECT * from categorie ORDER BY name ASC', (err, result) => {
        res.send({ category: result });
    });
});

app.get("/update-services", (req, res) => {

    var d = new Date();
    dformat = [d.getFullYear(),
    d.getMonth() + 1,
    d.getDate(),
    ].join('/') + ' ' + [d.getHours(),
    d.getMinutes(),
    d.getSeconds()
    ].join(':');
    var axios = require('axios');
    var config = {
        method: 'get',
        url: 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json',
    };

    axios(config)
        .then(function (response) {

            // res.send(response.data);


            response.data.forEach(function (element) {
                var option_type = element.symbol.substr(-2, 2);

                if (element.symbol.slice(-3) == '-EQ') {
                    // console.log('EQ');
                    connection1.query('SELECT *  FROM `services` WHERE `categorie_id` = 24 AND `service` LIKE "' + element.name + '#"', (err, result) => {

                        if (result.length == 0) {
                            // console.log('inside EQ');
                            connection1.query('INSERT INTO `services`(`categorie_id`, `service`, `status`, `created_at`, `instrument_token`, `zebu_token`) VALUES (24,"' + element.name + '#","","' + dformat + '","' + element.token + '","' + element.symbol + '")', (err, result) => {
                                console.log(err);
                                console.log(result);
                            });
                        }
                    });

                }

                if (element.instrumenttype == 'FUTSTK' || element.instrumenttype == 'FUTIDX') {

                    connection1.query('SELECT *  FROM `services` WHERE `categorie_id` = 25 AND `service` LIKE "' + element.name + '"', (err, result) => {
                        console.log('SELECT *  FROM `services` WHERE `categorie_id` = 25 AND `service` LIKE "' + element.name + '"');
                        if (result.length == 0) {
                            connection1.query('INSERT INTO `services`(`categorie_id`, `service`, `status`, `created_at`, `instrument_token`, `zebu_token`) VALUES (25,"' + element.name + '","","' + dformat + '","' + element.token + '","' + element.symbol + '")', (err, result) => {

                            });
                        }
                    });
                }

                if (element.instrumenttype == 'FUTCUR') {

                    connection1.query('SELECT *  FROM `services` WHERE `categorie_id` = "37" AND `service` LIKE "' + element.name + '"', (err, result) => {

                        if (result.length == 0) {
                            connection1.query('INSERT INTO `services`(`categorie_id`, `service`, `status`, `created_at`, `instrument_token`, `zebu_token`) VALUES (37,"' + element.name + '","","' + dformat + '","' + element.token + '","' + element.symbol + '")', (err, result) => {

                            });
                        }
                    });
                }

                if (element.instrumenttype == 'FUTCOM') {

                    connection1.query('SELECT *  FROM `services` WHERE `categorie_id` = "34" AND `service` LIKE "' + element.name + '"', (err, result) => {
                        if (result.length == 0) {
                            connection1.query('INSERT INTO `services`(`categorie_id`, `service`, `status`, `created_at`, `instrument_token`, `zebu_token`) VALUES (34,"' + element.name + '","","' + dformat + '","' + element.token + '","' + element.symbol + '")', (err, result) => {

                            });
                        }
                    });
                }


                if (element.instrumenttype == 'OPTSTK' || element.instrumenttype == 'OPTIDX') {

                    connection1.query('SELECT *  FROM `services` WHERE `categorie_id` = "26" AND `service` LIKE "' + element.name + '"', (err, result) => {
                        if (result.length == 0) {
                            connection1.query('INSERT INTO `services`(`categorie_id`, `service`, `status`, `created_at`, `instrument_token`, `zebu_token`) VALUES (26,"' + element.name + '","","' + dformat + '","' + element.token + '","' + element.symbol + '")', (err, result) => {

                            });
                        }
                    });
                }

                if (element.instrumenttype == 'OPTCUR') {

                    connection1.query('SELECT *  FROM `services` WHERE `categorie_id` = 36 AND `service` LIKE "' + element.name + '"', (err, result) => {
                        if (result.length == 0) {
                            connection1.query('INSERT INTO `services`(`categorie_id`, `service`, `status`, `created_at`, `instrument_token`, `zebu_token`) VALUES (36,"' + element.name + '","","' + dformat + '","' + element.token + '","' + element.symbol + '")', (err, result) => {

                            });
                        }
                    });
                }

                if (element.instrumenttype == 'OPTFUT') {

                    connection1.query('SELECT *  FROM `services` WHERE `categorie_id` = 35 AND `service` LIKE "' + element.name + '"', (err, result) => {
                        if (result.length == 0) {
                            connection1.query('INSERT INTO `services`(`categorie_id`, `service`, `status`, `created_at`, `instrument_token`, `zebu_token`) VALUES (35,"' + element.name + '","","' + dformat + '","' + element.token + '","' + element.symbol + '")', (err, result) => {

                            });
                        }
                    });
                }
            });
        });

    return "test";
});


 

async function marketHolidays(){
   
    let value =  ["2024-01-26","2024-03-08","2024-03-25","2024-03-29","2024-04-11","2024-04-17","2024-05-01","2024-06-17","2024-07-17","2024-10-02","2024-11-01","2024-11-15","2024-12-25"]

  
    const market_holiday_redis = await client_redis.hGet(process.env.PANEL_KEY, "market_holiday_redis");

    console.log("market_holiday_redis ",market_holiday_redis)
    
    
    if (market_holiday_redis) {
        
        await client_redis.hSet(process.env.PANEL_KEY, "market_holiday_redis", JSON.stringify(value));
        
    } else {
        
        await client_redis.hSet(process.env.PANEL_KEY, "market_holiday_redis", JSON.stringify(value));
        
    }
}


server.listen(process.env.PORT, () => {
    marketHolidays();
    console.log(`Server is ${process.env.PANEL_NAME} running at port ${process.env.PORT}`);
});
