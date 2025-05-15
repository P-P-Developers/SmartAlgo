module.exports = function (app, connection1) {
    var cron = require('node-cron');
    var dateTime = require('node-datetime');
    var moment = require('moment');
    var axios = require('axios');
    const path = require('path');
    const fs = require('fs');

    const redis = require('redis');
    const client_redis = redis.createClient(3001, '180.149.241.18');
    // Connect to Redis
    client_redis.on('connect', function () {
        console.log('Connected to Redis');
    });

    client_redis.connect();

    cron.schedule('0 0 * * *', () => {

        console.log('cron running at every 12 : 00 midnight.. ');
        ClientLoginStatus();
        AdminLoginStatus();
        setExpiryStatus();
        statusNullTradingOff();
        trdaingOffOptionChain();
        // TokenSymbolUpdate();


    });


// ===================================================================================


cron.schedule('0 6 * * *', () => {
    updateServicesToken();

});

const updateServicesToken = async () => {

    try {
        const { NseIndia } = require('stock-nse-india');
  
        const nseIndia = new NseIndia()
  
        connection1.query('SELECT * FROM `services` WHERE `categorie_id` = 24', (err, result) => {
  
          try {
            if (result.length > 0) {
  
              var symbolArr = []
              result.forEach((token) => {
                var symbol = ""
                const lastChar2 = token.service[token.service.length - 1];
  
                if (lastChar2 == "#") {
                  const modifiedValue = token.service.replace(/#/g, "");
                  symbol = modifiedValue
                }
                nseIndia.getEquityDetails(symbol).then((details) => {
                  try {
                    //console.log("details", details.priceInfo.lastPrice)
  
                    connection1.query('UPDATE `services` SET  `price`="' + details.priceInfo.lastPrice + '" WHERE service="' + token.service + '"', (err, result) => {
                    })
  
                  } catch (error) {
  
                  }
                })
              })
            }
          } catch (error) {
  
          }
        })
  
      } catch (error) {
       // console.log("Errr", error);
      }
  
}







    // ================================================================
    // Manual Trade
    cron.schedule('30 23 * * *', () => {
        market_holiday_redis();
    });

    // Market holiday set key in redis

    const market_holiday_redis = () => {

        connection1.query('SELECT `panel_key`,`broker_url` FROM `client_key_prefix_letters` LIMIT 1', (err, panel_key) => {
            var panelKey = panel_key[0].panel_key;

            //console.log("okkk run code market api");
            var config = {
                method: 'get',
                url: 'https://www.nseindia.com/api/holiday-master?type=trading',
            };

            axios(config)
                .then(async function (response) {
                    //  console.log("rr-----",JSON.stringify(response.data));
                    var holiday_date = [];
                    response.data.CM.forEach(element => {

                        //   console.log("check date --",element.tradingDate);

                        const originalDateString = element.tradingDate;
                        const dateParts = originalDateString.split('-');

                        // Create a new Date object with the year, month, and day
                        const dateObj = new Date(`${dateParts[1]} ${dateParts[0]}, ${dateParts[2]}`);

                        // Use the Date object's methods to format the date as "YYYY-MM-DD"
                        const year = dateObj.getFullYear();
                        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                        const day = String(dateObj.getDate()).padStart(2, '0');
                        const formattedDateString = `${year}-${month}-${day}`;

                       // console.log("convert data -", formattedDateString);

                        holiday_date.push(formattedDateString)


                    });

                    //console.log("all -result", holiday_date);

                    const market_holiday_redis = await client_redis.hGet(panelKey, "market_holiday_redis");

                    if (market_holiday_redis) {

                        await client_redis.hSet(panelKey, "market_holiday_redis", JSON.stringify(holiday_date));

                    } else {

                        await client_redis.hSet(panelKey, "market_holiday_redis", JSON.stringify(holiday_date));

                    }


                })
                .catch(function (error) {
                    // console.log(error);
                });


        });


    }

    cron.schedule('28 15 * * *', () => {
        expire_stock_openposition();
    });


    const expire_stock_openposition = () => {

        connection1.query('SELECT `panel_key`,`broker_url` FROM `client_key_prefix_letters` LIMIT 1', async (err, panel_key) => {

            var panelKey = panel_key[0].panel_key;

            const market_holiday_redis = await client_redis.hGet(panelKey, "market_holiday_redis");
            const market_holiday_redis_data = JSON.parse(market_holiday_redis);
            //console.log("market_holiday_redis",market_holiday_redis_data);


            const today = new Date();
            const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const weekday = weekdays[today.getDay()];
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');

            const currentDateYmd = `${year}-${month}-${day}`;



            const currentTime = new Date(); // Get the current time

            const targetTime = new Date(); // Create a target time
            targetTime.setHours(15); // Set the target hour (e.g., 10 AM)
            targetTime.setMinutes(25); // Set the target minute (e.g., 30 minutes)
           
            if(market_holiday_redis_data != null){
                if (!market_holiday_redis_data.includes(currentDateYmd) && weekday != 'Sunday' && weekday != 'Saturday') {


                    connection1.query('SELECT exucated_all_trade.*, STR_TO_DATE(expiry, "%d%m%Y") AS expiry_date FROM `exucated_all_trade` WHERE `squareoff` = 0 AND (`type` = "LE" || `type` = "SE") AND `exchange` != "NSE" AND STR_TO_DATE(expiry, "%d%m%Y") <= CURDATE()', (err, openposition) => {
    
                        if (openposition.length > 0) {
    
                            openposition.forEach(async (row) => {
    
    
                                let live_data = await client_redis.hGet(panelKey, "live_data_" + row.token);
    
                                if (live_data) {
    
                                    let live_data_get = JSON.parse(live_data);
    
                                    if (row.type == "LE") {
                                        tradeExucated(row, live_data_get.bp1, panel_key)
    
                                    } else if (row.type == "SE") {
                                        tradeExucated(row, live_data_get.sp1, panel_key)
                                    }
    
                                } else {
    
                                    tradeExucated(row, row.executed_price, panel_key)
    
                                }
    
    
    
                            });
    
                            return ""
    
                        } else {
                           // console.log("else");
                            return ""
                        }
    
                    });
    
                } else {
                   // console.log("else expiry stock")
                    return ""
                }
            }else{
                return ""
            }
            


        });



    }

    const tradeExucated = (row, price, panel_key) => {

        var axios = require('axios');


        var panelKey = panel_key[0].panel_key
        var broker_url = panel_key[0].broker_url;


        var type = "";
        if (row.type == "LE") {
            type = "LX";
        }
        else if (row.type == "SE") {
            type = "SX";
        }


        var request = "id:12@@@@@input_symbol:" + row.input_symbol + "@@@@@type:" + type + "@@@@@price:" + price + "@@@@@dt:1668504000@@@@@qty_percent:100@@@@@order_type:Market@@@@@client_key:" + panelKey + "@@@@@exchange:NFO@@@@@product_type:MIS@@@@@strike:" + row.strike_price + "@@@@@segment:O@@@@@option_type:" + row.option_type + "@@@@@expiry:" + row.expiry + "@@@@@strategy:" + row.strategy_tag + "@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@token:" + row.token + "@@@@@entry_trade_id:" + row.id + "@@@@@tradesymbol:" + row.tradesymbol + "@@@@@chain:option_chain@@@@@by_side:" + row.by_side + "@@@@@demo:demo";

       // console.log("exit trade ", request);



        var config = {
            method: 'post',
            url: broker_url,
            headers: {
                'Content-Type': 'text/plain'
            },
            data: request
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });



    }


    // Option Chain ALiceBlueToken Accesstoken And Trding OffF function
    const trdaingOffOptionChain = () => {
        connection1.query('UPDATE `alicebluetoken` SET `access_token` = "" , `trading` = "' + 0 + '"  WHERE `id` = "1"', (err, getToken) => {
        });

    }



    // app.get("/admin/cron/show-expery-msg", (req, res) => {
    const setExpiryStatus = () => {
        connection1.query('SELECT * FROM `client` where `licence_type`="2"', (err, result) => {
            result.forEach((item) => {

                // console.log("item", item.full_name, "-", item.end_date)
                var end_date_live = dateTime.create(item.end_date);
                var end_date = end_date_live.format('Y-m-d');

                var dt = dateTime.create();
                var ccdate = dt.format('Y-m-d');
                var diffInMs = Math.abs(new Date(ccdate) - new Date(end_date));
                var day1 = diffInMs / (1000 * 60 * 60 * 24);

                if (day1 == 2) {

                    connection1.query('UPDATE `client` SET `expiry_status`="3" WHERE `id`=' + item.id, (err, result) => { })

                } else if (day1 == 1) {

                    connection1.query('UPDATE `client` SET `expiry_status`="2" WHERE `id`=' + item.id, (err, result) => { })

                } else if (day1 == 0) {
                    connection1.query('UPDATE `client` SET `expiry_status`="1" WHERE `id`=' + item.id, (err, result) => { })


                }
                // console.log("licence", item.licence_type)
                // res.send({ clientNme: item.full_name, Expiry: end_date, days: day1 });

            })
            // res.send({ clientNme: result });
        });
        // });
    }

    const statusNullTradingOff = () => {

        var dt = dateTime.create();
        var ccdate = dt.format('Y-m-d H:M:S');

        connection1.query('UPDATE `client` SET `access_token` = " ", `trading_type` = "off"', (err, result) => {

            connection1.query(' SELECT `id` FROM `client` WHERE `access_token` != "" AND `trading_type` = "on"', (err, trading_on_client) => {

                if (trading_on_client.length) {

                    trading_on_client.forEach(element => {

                        connection1.query('INSERT INTO `trading_status_client` (`client_id`,`trading`,`created_at`) VALUES ("' + id + '","TradingOFF","' + ccdate + '")', (err, tradinf_status) => { });
                    });
                }


            })
        })
    }

    const ClientLoginStatus = () => {
        var zero = 0;
        connection1.query('UPDATE `client` SET `login_status` = ' + zero, (err, result) => {
           // console.log("resulkt", result)
        })
    }

    const AdminLoginStatus = () => {
        var zero = 0;
        connection1.query('UPDATE `tbl_users` SET `admin_login_status` = ' + zero, (err, result) => {
           // console.log("resulkt", result)
        })
    }

    const TokenSymbolUpdate = () => {


        connection1.query('TRUNCATE TABLE  token_symbol', (err, result) => { });

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
                    //  var option_type = element.symbol.substr(-2, 2);
                    //console.log('okkk',option_type);


                    //var option_type = element.symbol;
                    var option_type = element.symbol.slice(-2);

                    // console.log('okk-',element.symbol);
                    // console.log('sss- ',option_type);


                    if (element.instrumenttype == 'FUTSTK') {

                        var expiry_s = element.expiry
                        var expiry_s = dateTime.create(expiry_s);
                        var expiry = expiry_s.format('dmY');





                        var strike_s = parseInt(element.strike);
                        var strike = parseInt(strike_s.toString().slice(0, -2));
                        //console.log(element.token);

                        var option_type = element.symbol.slice(-2);



                        var day_month = element.expiry.slice(0, -4);

                        var year_end = element.expiry.slice(-2);

                        var day_start = element.expiry.slice(0, 2);

                        var moth_str = element.expiry.slice(2, 5);

                        const Dat = new Date(element.expiry);
                        //console.log("Dat", Dat)

                        var moth_count = Dat.getMonth() + 1



                        var lastWednesd = moment().endOf('month').day('wednesday')
                        var dt = dateTime.create(lastWednesd);
                        var lastWednesday_date = dt.format('dmY');


                        var expiry_month_year = expiry.slice(2);

                        var expiry_date = expiry.slice(0, -6);

                        var tradesymbol_m_w;

                        tradesymbol_m_w = element.name + year_end + moth_count + day_start + strike + option_type;


                        connection1.query('INSERT INTO `token_symbol`(`symbol`, `expiry`,`expiry_month_year`,`expiry_date`, `expiry_str`,`strike`,`option_type`,`segment`, `instrument_token`, `lotsize`, `tradesymbol`,`tradesymbol_m_w`) VALUES ("' + element.name + '","' + expiry + '","' + expiry_month_year + '","' + expiry_date + '","' + element.expiry + '","' + strike + '","' + option_type + '","F","' + element.token + '","' + element.lotsize + '","' + element.symbol + '","' + tradesymbol_m_w + '")', (err, result) => {

                        });

                    } else if (element.instrumenttype == 'FUTIDX') {

                        var expiry_s = element.expiry
                        var expiry_s = dateTime.create(expiry_s);
                        var expiry = expiry_s.format('dmY');





                        var strike_s = parseInt(element.strike);
                        var strike = parseInt(strike_s.toString().slice(0, -2));
                        //console.log(element.token);

                        var option_type = element.symbol.slice(-2);



                        var day_month = element.expiry.slice(0, -4);

                        var year_end = element.expiry.slice(-2);

                        var day_start = element.expiry.slice(0, 2);

                        var moth_str = element.expiry.slice(2, 5);

                        const Dat = new Date(element.expiry);
                        //console.log("Dat", Dat)

                        var moth_count = Dat.getMonth() + 1



                        var lastWednesd = moment().endOf('month').day('wednesday')
                        var dt = dateTime.create(lastWednesd);
                        var lastWednesday_date = dt.format('dmY');


                        var expiry_month_year = expiry.slice(2);

                        var expiry_date = expiry.slice(0, -6);

                        var tradesymbol_m_w;

                        tradesymbol_m_w = element.name + year_end + moth_count + day_start + strike + option_type;


                        connection1.query('INSERT INTO `token_symbol`(`symbol`, `expiry`,`expiry_month_year`,`expiry_date`, `expiry_str`,`strike`,`option_type`,`segment`, `instrument_token`, `lotsize`, `tradesymbol`,`tradesymbol_m_w`) VALUES ("' + element.name + '","' + expiry + '","' + expiry_month_year + '","' + expiry_date + '","' + element.expiry + '","' + strike + '","' + option_type + '","F","' + element.token + '","' + element.lotsize + '","' + element.symbol + '","' + tradesymbol_m_w + '")', (err, result) => {

                        });

                    } else if (element.instrumenttype == 'FUTCOM') {

                        var expiry_s = element.expiry
                        var expiry_s = dateTime.create(expiry_s);
                        var expiry = expiry_s.format('dmY');





                        var strike_s = parseInt(element.strike);
                        var strike = parseInt(strike_s.toString().slice(0, -2));
                        //console.log(element.token);

                        var option_type = element.symbol.slice(-2);



                        var day_month = element.expiry.slice(0, -4);

                        var year_end = element.expiry.slice(-2);

                        var day_start = element.expiry.slice(0, 2);

                        var moth_str = element.expiry.slice(2, 5);

                        const Dat = new Date(element.expiry);
                       // console.log("Dat", Dat)

                        var moth_count = Dat.getMonth() + 1



                        var lastWednesd = moment().endOf('month').day('wednesday')
                        var dt = dateTime.create(lastWednesd);
                        var lastWednesday_date = dt.format('dmY');


                        var expiry_month_year = expiry.slice(2);

                        var expiry_date = expiry.slice(0, -6);

                        var tradesymbol_m_w;

                        tradesymbol_m_w = element.name + year_end + moth_count + day_start + strike + option_type;


                        connection1.query('INSERT INTO `token_symbol`(`symbol`, `expiry`,`expiry_month_year`,`expiry_date`, `expiry_str`,`strike`,`option_type`,`segment`, `instrument_token`, `lotsize`, `tradesymbol`,`tradesymbol_m_w`) VALUES ("' + element.name + '","' + expiry + '","' + expiry_month_year + '","' + expiry_date + '","' + element.expiry + '","' + strike + '","' + option_type + '","MF","' + element.token + '","' + element.lotsize + '","' + element.symbol + '","' + tradesymbol_m_w + '")', (err, result) => {

                        });

                    } else if (element.instrumenttype == 'OPTIDX') {

                        var expiry_s = element.expiry
                        var expiry_s = dateTime.create(expiry_s);
                        var expiry = expiry_s.format('dmY');





                        var strike_s = parseInt(element.strike);
                        var strike = parseInt(strike_s.toString().slice(0, -2));
                        //console.log(element.token);

                        var option_type = element.symbol.slice(-2);



                        var day_month = element.expiry.slice(0, -4);

                        var year_end = element.expiry.slice(-2);

                        var day_start = element.expiry.slice(0, 2);

                        var moth_str = element.expiry.slice(2, 5);

                        const Dat = new Date(element.expiry);
                       // console.log("Dat", Dat)

                        var moth_count = Dat.getMonth() + 1



                        var lastWednesd = moment().endOf('month').day('wednesday')
                        var dt = dateTime.create(lastWednesd);
                        var lastWednesday_date = dt.format('dmY');


                        var expiry_month_year = expiry.slice(2);

                        var expiry_date = expiry.slice(0, -6);

                        var tradesymbol_m_w;

                        tradesymbol_m_w = element.name + year_end + moth_count + day_start + strike + option_type;


                        connection1.query('INSERT INTO `token_symbol`(`symbol`, `expiry`,`expiry_month_year`,`expiry_date`, `expiry_str`,`strike`,`option_type`,`segment`, `instrument_token`, `lotsize`, `tradesymbol`,`tradesymbol_m_w`) VALUES ("' + element.name + '","' + expiry + '","' + expiry_month_year + '","' + expiry_date + '","' + element.expiry + '","' + strike + '","' + option_type + '","O","' + element.token + '","' + element.lotsize + '","' + element.symbol + '","' + tradesymbol_m_w + '")', (err, result) => {

                        });

                    } else if (element.instrumenttype == 'OPTSTK') {

                        var expiry_s = element.expiry
                        var expiry_s = dateTime.create(expiry_s);
                        var expiry = expiry_s.format('dmY');

                        var strike_s = parseInt(element.strike);
                        var strike = parseInt(strike_s.toString().slice(0, -2));
                        // console.log(element.token);

                        var option_type = element.symbol.slice(-2);


                        var moth_str = element.expiry.slice(2, 5);

                        var day_month = element.expiry.slice(0, -4);

                        var year_end = element.expiry.slice(-2);

                        var day_start = element.expiry.slice(0, 2);

                        const Dat = new Date(element.expiry);


                        var moth_count = Dat.getMonth() + 1

                        var lastWednesd = moment().endOf('month').day('wednesday')
                        var dt = dateTime.create(lastWednesd);
                        var lastWednesday_date = dt.format('dmY');


                        var expiry_month_year = expiry.slice(2);

                        var expiry_date = expiry.slice(0, -6);



                        var tradesymbol_m_w;

                        tradesymbol_m_w = element.name + year_end + moth_count + day_start + strike + option_type;


                        connection1.query('INSERT INTO `token_symbol`(`symbol`, `expiry`,`expiry_month_year`,`expiry_date`, `expiry_str`,`strike`,`option_type`,`segment`, `instrument_token`, `lotsize`, `tradesymbol`,`tradesymbol_m_w`) VALUES ("' + element.name + '","' + expiry + '","' + expiry_month_year + '","' + expiry_date + '","' + element.expiry + '","' + strike + '","' + option_type + '","O","' + element.token + '","' + element.lotsize + '","' + element.symbol + '","' + tradesymbol_m_w + '")', (err, result) => {

                        });

                    } else if (element.instrumenttype == 'OPTFUT') {

                        var expiry_s = element.expiry
                        var expiry_s = dateTime.create(expiry_s);
                        var expiry = expiry_s.format('dmY');

                        var strike_s = parseInt(element.strike);
                        var strike = parseInt(strike_s.toString().slice(0, -2));
                        // console.log(element.token);

                        var option_type = element.symbol.slice(-2);


                        var moth_str = element.expiry.slice(2, 5);

                        var day_month = element.expiry.slice(0, -4);

                        var year_end = element.expiry.slice(-2);

                        var day_start = element.expiry.slice(0, 2);

                        const Dat = new Date(element.expiry);


                        var moth_count = Dat.getMonth() + 1

                        var lastWednesd = moment().endOf('month').day('wednesday')
                        var dt = dateTime.create(lastWednesd);
                        var lastWednesday_date = dt.format('dmY');


                        var expiry_month_year = expiry.slice(2);

                        var expiry_date = expiry.slice(0, -6);



                        var tradesymbol_m_w;

                        tradesymbol_m_w = element.name + year_end + moth_count + day_start + strike + option_type;


                        connection1.query('INSERT INTO `token_symbol`(`symbol`, `expiry`,`expiry_month_year`,`expiry_date`, `expiry_str`,`strike`,`option_type`,`segment`, `instrument_token`, `lotsize`, `tradesymbol`,`tradesymbol_m_w`) VALUES ("' + element.name + '","' + expiry + '","' + expiry_month_year + '","' + expiry_date + '","' + element.expiry + '","' + strike + '","' + option_type + '","MO","' + element.token + '","' + element.lotsize + '","' + element.symbol + '","' + tradesymbol_m_w + '")', (err, result) => {

                        });

                    } else if (element.instrumenttype == 'OPTCOM') {

                        var expiry_s = element.expiry
                        var expiry_s = dateTime.create(expiry_s);
                        var expiry = expiry_s.format('dmY');

                        var strike_s = parseInt(element.strike);
                        var strike = parseInt(strike_s.toString().slice(0, -2));
                        // console.log(element.token);

                        var option_type = element.symbol.slice(-2);


                        var moth_str = element.expiry.slice(2, 5);

                        var day_month = element.expiry.slice(0, -4);

                        var year_end = element.expiry.slice(-2);

                        var day_start = element.expiry.slice(0, 2);

                        const Dat = new Date(element.expiry);


                        var moth_count = Dat.getMonth() + 1

                        var lastWednesd = moment().endOf('month').day('wednesday')
                        var dt = dateTime.create(lastWednesd);
                        var lastWednesday_date = dt.format('dmY');


                        var expiry_month_year = expiry.slice(2);

                        var expiry_date = expiry.slice(0, -6);



                        var tradesymbol_m_w;

                        tradesymbol_m_w = element.name + year_end + moth_count + day_start + strike + option_type;


                        connection1.query('INSERT INTO `token_symbol`(`symbol`, `expiry`,`expiry_month_year`,`expiry_date`, `expiry_str`,`strike`,`option_type`,`segment`, `instrument_token`, `lotsize`, `tradesymbol`,`tradesymbol_m_w`) VALUES ("' + element.name + '","' + expiry + '","' + expiry_month_year + '","' + expiry_date + '","' + element.expiry + '","' + strike + '","' + option_type + '","MO","' + element.token + '","' + element.lotsize + '","' + element.symbol + '","' + tradesymbol_m_w + '")', (err, result) => {

                        });

                    } else if (element.instrumenttype == 'OPTCUR') {

                        var expiry_s = element.expiry
                        var expiry_s = dateTime.create(expiry_s);
                        var expiry = expiry_s.format('dmY');

                        var strike_s = parseInt(element.strike);
                        var strike = parseInt(strike_s.toString().slice(0, -2));
                        // console.log(element.token);

                        var option_type = element.symbol.slice(-2);


                        var moth_str = element.expiry.slice(2, 5);

                        var day_month = element.expiry.slice(0, -4);

                        var year_end = element.expiry.slice(-2);

                        var day_start = element.expiry.slice(0, 2);

                        const Dat = new Date(element.expiry);


                        var moth_count = Dat.getMonth() + 1

                        var lastWednesd = moment().endOf('month').day('wednesday')
                        var dt = dateTime.create(lastWednesd);
                        var lastWednesday_date = dt.format('dmY');


                        var expiry_month_year = expiry.slice(2);

                        var expiry_date = expiry.slice(0, -6);



                        var tradesymbol_m_w;

                        tradesymbol_m_w = element.name + year_end + moth_count + day_start + strike + option_type;


                        connection1.query('INSERT INTO `token_symbol`(`symbol`, `expiry`,`expiry_month_year`,`expiry_date`, `expiry_str`,`strike`,`option_type`,`segment`, `instrument_token`, `lotsize`, `tradesymbol`,`tradesymbol_m_w`) VALUES ("' + element.name + '","' + expiry + '","' + expiry_month_year + '","' + expiry_date + '","' + element.expiry + '","' + strike + '","' + option_type + '","CO","' + element.token + '","' + element.lotsize + '","' + element.symbol + '","' + tradesymbol_m_w + '")', (err, result) => {

                        });

                    } else if (element.instrumenttype == 'FUTCUR') {

                        var expiry_s = element.expiry
                        var expiry_s = dateTime.create(expiry_s);
                        var expiry = expiry_s.format('dmY');

                        var strike_s = parseInt(element.strike);
                        var strike = parseInt(strike_s.toString().slice(0, -2));
                        // console.log(element.token);

                        var option_type = element.symbol.slice(-2);


                        var moth_str = element.expiry.slice(2, 5);

                        var day_month = element.expiry.slice(0, -4);

                        var year_end = element.expiry.slice(-2);

                        var day_start = element.expiry.slice(0, 2);

                        const Dat = new Date(element.expiry);


                        var moth_count = Dat.getMonth() + 1

                        var lastWednesd = moment().endOf('month').day('wednesday')
                        var dt = dateTime.create(lastWednesd);
                        var lastWednesday_date = dt.format('dmY');


                        var expiry_month_year = expiry.slice(2);

                        var expiry_date = expiry.slice(0, -6);



                        var tradesymbol_m_w;

                        tradesymbol_m_w = element.name + year_end + moth_count + day_start + strike + option_type;


                        connection1.query('INSERT INTO `token_symbol`(`symbol`, `expiry`,`expiry_month_year`,`expiry_date`, `expiry_str`,`strike`,`option_type`,`segment`, `instrument_token`, `lotsize`, `tradesymbol`,`tradesymbol_m_w`) VALUES ("' + element.name + '","' + expiry + '","' + expiry_month_year + '","' + expiry_date + '","' + element.expiry + '","' + strike + '","' + option_type + '","CF","' + element.token + '","' + element.lotsize + '","' + element.symbol + '","' + tradesymbol_m_w + '")', (err, result) => {

                        });

                    }




                });
            });

        return "test";

    }




}