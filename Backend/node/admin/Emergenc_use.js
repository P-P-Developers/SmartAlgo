module.exports = function (app, connection1) {
    var verifyToken = require('./middleware/awtJwt');
    var axios = require('axios');
    const fs = require('fs');
    var dateTime = require('node-datetime');
    var dt = dateTime.create();
    var ccdate = dt.format('Y-m-d');
    const path = require('path');


    app.get('/kotak-token', (req, res) => {

        var config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://tradeapi.kotaksecurities.com/token?grant_type=password&username=PW15051984&password=ADFG5484',
            headers: {
                'Authorization': 'Basic cVh1RExibVdqZEhPeHI0aWlGeFYzYWFfb0o4YTpmMUlwSm1ZUUR2aVVtSHFrekJiUmo4V1p0TkFh'
            }
        };

        axios(config)
            .then(function (response) {
                // console.log(JSON.stringify(response.data));


                var config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: 'https://tradeapi.kotaksecurities.com/apim/scripmaster/1.1/filename',
                    headers: {
                        'consumerKey': 'qXuDLbmWjdHOxr4iiFxV3aa_oJ8a',
                        'Authorization': 'Bearer ' + response.data.access_token
                    }
                };

                axios(config)
                    .then(function (response) {
                        // console.log(response.data.Success);

                        if (response.data.Success.cash) {

                            axios({
                                method: 'get',
                                maxBodyLength: Infinity,
                                url: response.data.Success.cash,
                                headers: {}
                            })
                                .then(function (response) {
                                    // console.log( response.data );

                                    var Arr = []
                                    var Arr1 = []

                                    response.data.split('-').map((val) => {
                                        Arr.push(val.split('|'))
                                    })

                                    const eqData = Arr.filter((item, index) => {
                                        if (item[8] === "EQ" && item[9] === "CASH" && item[10] === "NSE") {

                                            const num = parseInt(item[0].match(/\d+/)[0]);
                                            const digits = num.toString().split('').map(Number).join('');

                                            Arr1.push({
                                                id: item[13],
                                                token: digits,
                                                symbol: item[1] + "#",
                                                name: item[2],
                                                price: item[3]
                                            })
                                        }
                                    }
                                    );

                                    connection1.query('SELECT * FROM `services`', (err, result) => {
                                        const matching = result.filter((obj1) => {
                                            const obj2 = Arr1.find((obj2) => {

                                                if (obj1.instrument_token === obj2.id) {

                                                    connection1.query('UPDATE `services5` SET `kotak_token`="' + obj2.token + '" WHERE instrument_token="' + obj1.instrument_token + '"', (err, data) => {
                                                        // console.log('UPDATE `services5` SET `kotak_token`="' + obj2.token + '" WHERE instrument_token="' + obj1.instrument_token + '"');
                                                    })
                                                }
                                            });

                                        });
                                    })


                                })
                                .catch(function (error) {
                                    // console.log(error);
                                });
                        }

                        if (response.data.Success.fno) {



                            axios({
                                method: 'get',
                                maxBodyLength: Infinity,
                                url: response.data.Success.fno,
                                headers: {}
                            })
                                .then(function (response) {
                                    // console.log( response.data );

                                    var Arr = []
                                    var Arr1 = []

                                    response.data.split('\r\n').map((val) => {

                                        var data = val.split('|')
                                        // console.log(data);

                                        Arr1.push({
                                            id: data[0],
                                            token: data[13],
                                            symbol: data[1],
                                            price: data[3]
                                        })

                                    })

                                    Arr1.find((obj2) => {

                                        connection1.query('UPDATE `token_symbol3` SET `kotak_fno`="' + obj2.id + '" WHERE instrument_token="' + obj2.token + '"', (err, data) => {

                                            // console.log("err", err);

                                        })

                                    });

                                })
                                .catch(function (error) {
                                    // console.log(error);
                                });

                        }

                    })
                    .catch(function (error) {
                        // console.log(error);
                    });

            })
            .catch(function (error) {
                // console.log(error);
            });
    })



    app.get('/updateToken', (req, res) => {


        connection1.query('SELECT symbol,lotsize FROM `token_symbol` ', (err, result) => {

            result.forEach((val1) => {

                connection1.query('UPDATE `services` SET `lot_size`="' + val1.lotsize + '" WHERE service="' + val1.symbol + '"', (err, data) => {

                    // console.log("rr1", err);
                })



            })
        })



    })




    app.get('/cash-token', (req, res) => {



        const { NseIndia } = require('stock-nse-india');

        const nseIndia = new NseIndia()



        connection1.query('SELECT service FROM `services` WHERE `categorie_id` = 24', (err, services) => {

            services.forEach((element) => {

                var Stock = element.service.split('#')[0];

                //   To get equity details for specific symbol
                nseIndia.getEquityDetails(Stock).then(details => {

                    // console.log("Stock", Stock, "---", "priceInfo: ", details.priceInfo.intraDayHighLow.value);


                })


            });
        })



    })



    app.get('/manul/stock', (req, res) => {


        try {
            var filePath = path.join(__dirname + '/Manul_stock.json');

        const { NseIndia } = require('stock-nse-india');
        const nseIndia = new NseIndia()

        var config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json',
            headers: {}
        };

        axios(config)
            .then(function (response) {

                var TotalStock = []

                response.data.forEach((val) => {
                    if (val.instrumenttype == 'FUTSTK') {

                        TotalStock.push(val)

                    }

                })

                const uniqueDeVals1 = [...new Set(TotalStock.map(item => item.name))];

                uniqueDeVals1.forEach((StName) => {


                    nseIndia.getEquityDetails(StName).then(details => {
                        Price = details.priceInfo.open;

                        var data = [];
                        var data1 = [];
                        response.data.forEach((val) => {
                            if (val.name == StName) {

                                var DevideValue = val.strike / 100
                                var DevideValue1 = DevideValue - Price


                                data.push({
                                    "Symbol": val.symbol,
                                    "token": val.token,
                                    "name": val.name,
                                    "Strike": val.strike,
                                    "exch_seg": val.exch_seg,
                                    "instrumenttype": val.instrumenttype,
                                    "DeVal": DevideValue1,
                                    "DeVal1": Math.abs(DevideValue1)
                                })

                            }
                        })


                        const uniqueDeVals = [...new Set(data.map(item => item.DeVal))];

                        uniqueDeVals.forEach((Val) => {
                            data.forEach((val1) => {
                                if (Val == val1.DeVal) {
                                    data1.push(val1)
                                    Val++
                                    return
                                }
                            })

                        })

                        const First = data1.sort((a, b) => {
                            return a.DeVal1 - b.DeVal1;
                        })[0]

                        const Main = data1.sort((a, b) => {
                            return a.DeVal - b.DeVal;
                        })


                        const index = Main.findIndex(obj => obj.DeVal === First.DeVal);

                        const prevTwoNextTwo = Main.slice(index - 2, index + 3);

                        // console.log({ Name: prevTwoNextTwo[0].Symbol, Data: prevTwoNextTwo });

                        fs.writeFile(filePath, JSON.stringify("hi"), err => {
                            if (err) {
                              console.error(err);
                              res.status(500).send('Error writing data to file');
                            } else {
                              res.send('Data saved to file');
                            }
                          });
                    })

                })
            })
            .catch(function (error) {
                // console.log(error);
            });


          } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
          }

    
    })



}	