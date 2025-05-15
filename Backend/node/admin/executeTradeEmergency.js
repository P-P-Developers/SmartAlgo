module.exports = function (app, connection1) {
    var verifyToken = require('./middleware/awtJwt');
    var axios = require('axios');

    var dateTime = require('node-datetime');
    var dt = dateTime.create();
    var ccdate = dt.format('Y-m-d');


    app.get('/expiry-create', (req, res) => {
        // const ExecutedTrade = () => {
        //console.log("Run ExecutedTrade....");
        var setGetLastDate = []
        var setBankNiftyToken = []
        var setNiftyToken = []

        var dt = dateTime.create();
        var ccdate = dt.format('Y-m-d H:M:S');
        // connection1.query('TRUNCATE TABLE last_expiry;', (err, result) => { })
        var config = {
            method: 'get',
            url: 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json',
        };
        axios(config)
            .then(function (response) {
                var channelstr = ""
                var exist_expiry = [];
                response.data.forEach(function (element) {


                    if ((element.instrumenttype == 'FUTIDX' && element.exch_seg == "NFO")) {

                        if (element.name == 'BANKNIFTY' || element.name == 'NIFTY') {
                            // if (element.expiry.toString().includes(gettingThisMonth)) {
                            if (setGetLastDate.length != 2) {

                                setGetLastDate.push(element)
                                channelstr += element.exch_seg + "|" + element.token + "#"
                                // console.log("channelstr = >", channelstr);

                            }
                            // console.log("element.expiry", setGetLastDate);


                        }
                    }

                    if ((element.instrumenttype == 'OPTIDX' && element.exch_seg == "NFO")) {
                        if (element.name == 'BANKNIFTY') {


                            if (!exist_expiry.includes(element.expiry)) {

                                exist_expiry.push(element.expiry)

                                // console.log("ss -- ", element.expiry)//

                                var expiry_s = dateTime.create(element.expiry);
                                var expiry = expiry_s.format('dmY');
                                var expiry_date = expiry_s.format('Y-m-d');

                                var dt = dateTime.create();
                                var ccdate = dt.format('Y-m-d H:M:S');


                                connection1.query('INSERT INTO `last_expiry`( `expiry`, `expiry_date`,`expiry_str`,`created_at`) VALUES ("' + expiry + '","' + expiry_date + '","' + element.expiry + '","' + ccdate + '")', (err, result) => {
                                    // console.log("err", err);
                                    // console.log("INSERT last_expiry");
                                })
                            }
                        }
                    }

                });

                var alltokenchannellist = channelstr.substring(0, channelstr.length - 1);
                // console.log("alltokenchannellist", alltokenchannellist);
                // setMakeChannelData.push(alltokenchannellist)
                connection1.query('UPDATE `channel_list` SET `first_channel`="' + alltokenchannellist + '" ,first_create_At="' + ccdate + '" WHERE id=1', (err, result) => {
                })


            })
            .catch(function (error_broker) {
                // console.log('error_broker -', error_broker);
            });
    })





    app.get('/addprize', (req, res) => {

        const { NseIndia } = require('stock-nse-india');

        const nseIndia = new NseIndia()

        var dt = dateTime.create();
        var ccdate = dt.format('Y-m-d H:M:S');
        nseIndia.getIndexIntradayData('NIFTY BANK').then(details => {
            var ValueData = details.grapthData.slice(-1)[0]
            // console.log("BankNifty : ", ValueData[1])
            // console.log("details : ", details)

        })




        // return

        // console.log("okkkkkk");
        connection1.query('UPDATE `strike_price` SET `banknifty_status`="0" ,`nifty_status`="0"', (err, result) => { })


        // To get equity details for specific symbol
        nseIndia.getIndexIntradayData('NIFTY BANK').then(details => {
            var ValueData = details.grapthData.slice(-1)[0]
            // console.log("BankNifty : ", ValueData[1])
            connection1.query('UPDATE `strike_price` SET `banknifty_price`="' + ValueData[1] + '",`banknifty_created_at`="' + ccdate + '" ,`banknifty_status`="1" WHERE `banknifty_status`="0"', (err, result) => {

            })
        })


        nseIndia.getIndexIntradayData('NIFTY 50').then(details => {
            var ValueData1 = details.grapthData.slice(-1)[0]
            // console.log("Nifty : ", ValueData1[1])
            connection1.query('UPDATE `strike_price` SET `nifty_price`="' + ValueData1[1] + '",`nifty_created_at`="' + ccdate + '" ,`nifty_status`="1" WHERE `nifty_status`="0"', (err, result) => {

            })
        })


    })


    app.get('/executetrade-Emergency1', (req, res) => {
        connection1.query('TRUNCATE TABLE all_round_token;', (err, result) => { })   //Table truncate
        connection1.query('SELECT * FROM `strike_price` where `banknifty_status`=1 AND `nifty_status`=1', (err, strike_price) => {

            // console.log("Test =================================", strike_price);
            if (strike_price.length > 0) {

                var BankNifty = Math.round(strike_price[0].banknifty_price).toString().slice(0, -2) + "0" + "0"
                var Nifty = Math.round(strike_price[0].nifty_price).toString().slice(0, -2) + "0" + "0"

                // BANKNIFTY

                var bankniftypushaccdec = []
                for (let i = 1; i <= 10; i++) {
                    const resultfor = parseInt(BankNifty, 10) + 100 * i;
                    bankniftypushaccdec.push({ "symbol": "BANKNIFTY", "strike_price": resultfor })
                }

                var number1 = bankniftypushaccdec.slice(-1)[0]

                for (let i = 1; i <= 3; i++) {
                    const resultfor = number1.strike_price + 500 * i;
                    bankniftypushaccdec.push({ "symbol": "BANKNIFTY", "strike_price": resultfor })
                }


                for (let i = 0; i <= 10; i++) {
                    const resultpre = BankNifty - 100 * i;
                    bankniftypushaccdec.push({ "symbol": "BANKNIFTY", "strike_price": resultpre })
                }
                var number2 = bankniftypushaccdec.slice(-1)[0]


                for (let i = 1; i <= 3; i++) {
                    const resultpre = number2.strike_price - 500 * i;
                    bankniftypushaccdec.push({ "symbol": "BANKNIFTY", "strike_price": resultpre })
                }


                // NIFHT

                var niftypushaccdec = []
                for (let i = 1; i <= 5; i++) {
                    const resultfor = parseInt(Nifty, 10) + 100 * i;
                    niftypushaccdec.push({ "symbol": "NIFTY", "strike_price": resultfor })
                }

                var number3 = niftypushaccdec.slice(-1)[0]

                for (let i = 1; i <= 3; i++) {
                    const resultfor = number3.strike_price + 500 * i;
                    niftypushaccdec.push({ "symbol": "NIFTY", "strike_price": resultfor })
                }


                for (let i = 0; i <= 5; i++) {
                    const resultpre = Nifty - 100 * i;
                    niftypushaccdec.push({ "symbol": "NIFTY", "strike_price": resultpre })
                }
                var number4 = niftypushaccdec.slice(-1)[0]


                for (let i = 1; i <= 3; i++) {
                    const resultpre = number4.strike_price - 500 * i;
                    niftypushaccdec.push({ "symbol": "NIFTY", "strike_price": resultpre })
                }


                // bankniftypushaccdec.push(niftypushaccdec)
                var TotalArr = bankniftypushaccdec.flat().sort(function (a, b) { return b.strike_price - a.strike_price }).concat(niftypushaccdec.flat().sort(function (a, b) { return b.strike_price - a.strike_price }))
                // console.log("=>", TotalArr);

                // console.log("TotalArr", TotalArr.length);

                // return
                if (TotalArr.length == 44) {

                    connection1.query('SELECT expiry FROM `last_expiry` ORDER BY `expiry_date` ASC LIMIT 4', (err, all_expiry) => {

                        all_expiry.forEach((expiry) => {
                            TotalArr.forEach((all_strikeprice) => {

                                // console.log("=", all_strikeprice)
                                connection1.query('SELECT *  FROM `token_symbol` WHERE `symbol` = "' + all_strikeprice.symbol + '" AND `expiry` =  "' + expiry.expiry + '" AND `strike` = "' + all_strikeprice.strike_price + '"', (err1, serch_tokenSymbol) => {

                                    // console.log("serch_tokenSymbol",'SELECT *  FROM `token_symbol` WHERE `symbol` = "' + all_strikeprice.symbol + '" AND `expiry` =  "' + expiry.expiry + '" AND `strike` = "' + all_strikeprice.strike_price + '"')
                                    var put_token = "";
                                    var call_token = "";
                                    serch_tokenSymbol.forEach(element => {
                                        if (element.option_type == "CE") {
                                            call_token = element.instrument_token;
                                        } else if (element.option_type == "PE") {
                                            put_token = element.instrument_token;
                                        }
                                    });


                                    if (put_token != "" && call_token != "") {
                                       // console.log("run");

                                        connection1.query('INSERT INTO `all_round_token` ( `symbol`, `strike_price`,`call_token`,`put_token`,`expiry`) VALUES ("' + all_strikeprice.symbol + '","' + all_strikeprice.strike_price + '","' + call_token + '","' + put_token + '","' + expiry.expiry + '")', (err, result) => {
                                            // console.log("err", err);

                                        })
                                    }

                                })

                            })
                        })

                    })

                }

            }
        })


    })






    app.get('/update-services', (req, res) => {

        try {
            const { NseIndia } = require('stock-nse-india');

            const nseIndia = new NseIndia()

            connection1.query('SELECT * FROM `services` WHERE `categorie_id` = 24', (err, result) => {

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



                            // console.log("details",details.priceInfo)




                        })




                    })

                }


            })

        } catch (error) {
            // console.log("Errr", error);
        }

    })



}	