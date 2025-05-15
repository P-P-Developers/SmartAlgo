module.exports = function (app, connection1) {

    var dateTime = require('node-datetime');
    var axios = require('axios');

    var currentDate = new Date()
    var dformat = [currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    currentDate.getDate()
    ].join('-');
   



    var dt = dateTime.create();
    var ccdate = dt.format('Y-m-d H:M:S');

    //  All Client Get  
    app.get("/superadmin/client", (req, res) => {

        connection1.query('SELECT * FROM `client` ORDER BY `id` DESC', (err, result) => {
         
            res.send({ client: result });
        });
    });


    app.get("/superadmin/license/list", (req, res) => {
        // console.log("runn");
        connection1.query('SELECT * FROM `count_licence` WHERE `licence` IS NULL', (err, result) => {
            // console.log("result", result);
            res.send({ client: result });
        });
    });


    // Panal License and accounts View Card 
    app.get("/superadmin/panelinfo", (req, res) => {

        connection1.query('SELECT COUNT(*) as count_rows1 FROM client where licence_type = 2;SELECT COUNT(*) as count_rows2 FROM client where licence_type = 2 AND end_date >= "' + dformat + '";SELECT COUNT(*) as count_rows3 FROM client where licence_type = 2 AND end_date < "' + dformat + '";SELECT COUNT(*) as count_rows4 FROM client where licence_type = 1;SELECT COUNT(*) as count_rows5 FROM client where licence_type = 1 AND end_date >= "' + dformat + '";SELECT COUNT(*) as count_rows6 FROM client where licence_type = 1 AND end_date < "' + dformat + '";SELECT `licence` FROM `tbl_users`;SELECT SUM(`to_month`) as used_license FROM `client` WHERE `licence_type`=2;SELECT COUNT(*) as count_le FROM signals where type = "LE"  AND dt_date = "' + dformat + '";SELECT COUNT(*) as count_lx FROM signals where type = "LX" AND dt_date = "' + dformat + '";SELECT COUNT(*) as count_se FROM signals where type = "SE"  AND dt_date = "' + dformat + '";SELECT COUNT(*) as count_sx FROM signals where type = "SX" AND dt_date = "' + dformat + '";', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], (err, result) => {

            var msg = { 'total_live_account': result[0][0].count_rows1, 'active_live_account': result[1][0].count_rows2, 'expired_live_account': result[2][0].count_rows3, 'total_demo_account': result[3][0].count_rows4, 'active_demo_account': result[4][0].count_rows5, 'expired_demo_account': result[5][0].count_rows6, 'total_license': result[6][0].licence, 'used_license': result[7][0].used_license, 'signals': result[7] }

            res.send({ success: 'true', msg: msg });

        })
    });




    // License add on panal With Api
    app.post("/superadmin/panal/licenseAdd", (req, res) => {

        var license = req.body.licence
        var SuperadminName = req.body.Superadmin_name

        connection1.query('UPDATE `tbl_users` SET `licence`= `licence`+' + license + ',`this_month_licence`=' + license + ', modifydate_licence=CURRENT_TIMESTAMP;INSERT INTO `count_licence`(`month_licence`,`date_time`) VALUES (' + license + ',CURRENT_TIMESTAMP)', (err, result) => {

            res.send({ licenseAdd: result });

        });
    });



    // Panel Signal Get API
    app.post("/superadmin/signal", (req, res) => {

        var symbol = req.body.symbol;
        var strat = req.body.strategy;
        var segment = req.body.segment;
        var todate = req.body.todate;
        var fromdate = req.body.fromdate;

        var where = '';
        if (symbol != '') {
            where += '`signals`.`symbol` = "' + symbol + '" AND';
        }
        if (segment != '') {

            if (segment == "O" || segment == "o") {
                where += '`signals`.`segment` LIKE "%' + segment + '%" AND';
            } else {
                where += '`signals`.`segment` = "' + segment + '" AND';
            }
        }
        if (strat != '') {
            where += '`signals`.`strategy_tag` = "' + strat + '" AND';
        }
        if (todate != '') {
            where += '`signals`.`dt_date` = "' + String(todate) + '" ';
        } else {
            where += '`signals`.`dt_date` >= "' + String(dformat) + '"';
        }

        // if (fromdate != '') {

        //     where += '`signals`.`dt_date` >= "' + String(fromdate) + '"';
        // } else {

        //     where += '`signals`.`dt_date` >= "' + String(dformat) + '"';
        // }

        // console.log("SELECT `signals`.*, `categorie`.`segment` as `cat_segment`, `categorie`.`name` as `cat_name` FROM `signals` LEFT JOIN `categorie` ON `categorie`.`segment` = `signals`.`segment` WHERE " + where + "  ORDER BY `dt_date`, `trade_symbol`,`strategy_tag`, `segment`, `option_type`, `signal_id` ASC");

        connection1.query("SELECT `signals`.*, `categorie`.`segment` as `cat_segment`, `categorie`.`name` as `cat_name` FROM `signals` LEFT JOIN `categorie` ON `categorie`.`segment` = `signals`.`segment` WHERE " + where + "  ORDER BY `dt_date`, `trade_symbol`,`strategy_tag`, `segment`, `option_type`, `signal_id` ASC", (err, result) => {
            // console.log(result);

            res.send({ tradehistory: result });
        });
    });



    // Panel Signal POST CHANGE PRIZE
    app.post("/superadmin/change/signal", (req, res) => {

        var panelkey = req.body.panelKey
        var id = req.body.updateobj[0].updatedId
        var price = req.body.updateobj[0].updatedPrice
        var SuperAdminName = req.body.Superadmin_name
        var allData = req.body.updateobj




        allData.forEach((item, index) => {
            connection1.query('SELECT id,price,trade_symbol,segment,strategy_tag FROM signals WHERE id =' + item.updatedId, (err, result) => {

                connection1.query('UPDATE `signals` SET `price`=' + item.updatedPrice + ' WHERE id=' + item.updatedId, (err1, result1) => {

                    // var data = '"' + SuperAdminName + '","' + panelname + '",' + 0 + ',"Signal Edit on :' + result[0].trade_symbol + ' And strategy is :' + result[0].strategy_tag + ' And Updated price is ' + item.updatedPrice + '"'
                    // console.log(data);    
                    // historyCreate(data)
                })
            })
        })
        res.send({ msg: true })
    });



    // DELETE SIGNAL 
    app.post("/superadmin/delete/signal", (req, res) => {

        var row = req.body.row
        var SuperadminName = req.body.Superadmin_name
        var panelname = req.body.panelname

        connection1.query('SELECT * FROM signals WHERE id =' + row.id + ' AND trade_symbol ="' + row.trade_symbol + '" AND strategy_tag= "' + row.strategy + '"', (err, result) => {
            var dformat1 = [result[0].dt_date.getFullYear(),
            result[0].dt_date.getMonth() + 1,
            result[0].dt_date.getDate()
            ].join('-');

            var dformat2 = `${result[0].created_at.getFullYear()}-${result[0].created_at.getMonth()}-${result[0].created_at.getDate()} ${result[0].created_at.getHours()}-${result[0].created_at.getMinutes()}-${result[0].created_at.getSeconds()}`

            connection1.query('INSERT INTO `remove_signals`(`sid`, `signal_id`, `symbol`, `type`, `order_type`, `price`, `qty_percent`, `exchange`, `product_type`, `sq_value`, `sl_value`, `tsl`, `tr_price`, `dt`, `dt_date`, `created_at`, `strategy_tag`, `exchange_symbol`, `option_type`, `strike`, `expiry`, `segment`, `trade_symbol`, `client_personal_key`) VALUES (' + result[0].id + ',' + result[0].signal_id + ',"' + result[0].symbol + '","' + result[0].type + '","' + result[0].order_type + '",' + result[0].price + ',' + result[0].qty_percent + ',"' + result[0].exchange + '","' + result[0].product_type + '",' + result[0].sq_value + ',' + result[0].sl_value + ',' + result[0].tsl + ',' + result[0].tr_price + ',"' + result[0].dt + '","' + dformat + '","' + dformat2 + '","' + result[0].strategy_tag + '","' + result[0].exchange_symbol + '","' + result[0].option_type + '",' + result[0].strike + ',"' + result[0].expiry + '","' + result[0].segment + '","' + result[0].trade_symbol + '","' + result[0].client_personal_key + '")', (err, result) => {

                connection1.query('DELETE FROM `signals` WHERE id =' + row.id + ' AND trade_symbol ="' + row.trade_symbol + '" AND strategy_tag= "' + row.strategy + '"', (err1, result1) => {

                    // var data = '"' + SuperadminName + '","' + panelname + '",' + 0 + ',"Delete Signal id: ' + row.id + ' And trade symbol is' + row.trade_symbol + ' And strategy tag is : ' + row.strategy + ' And Prize is :' + row.price + '"'

                    // historyCreate(data)
                    res.send({ msg: true });

                })
            })
        })
    });



    // Undo Delete signal
    app.post("/superadmin/signal/undo", (req, res) => {

        const signal_id = req.body.id
        var SuperadminName = req.body.Superadmin_name


        connection1.query('SELECT * FROM `remove_signals` WHERE `sid`=' + signal_id, (err, result) => {
            // console.log("db_exist_signal", result);

            connection1.query('INSERT INTO `signals`(`id`, `signal_id`, `symbol`, `type`, `order_type`, `price`, `qty_percent`, `exchange`, `product_type`, `sq_value`, `sl_value`, `tsl`, `tr_price`, `dt`, `dt_date`, `created_at`, `strategy_tag`, `exchange_symbol`, `option_type`, `strike`, `expiry`, `segment`, `trade_symbol`, `client_personal_key`) VALUES (' + result[0].sid + ',' + result[0].signal_id + ',"' + result[0].symbol + '","' + result[0].type + '","' + result[0].order_type + '",' + result[0].price + ',' + result[0].qty_percent + ',"' + result[0].exchange + '","' + result[0].product_type + '",' + result[0].sq_value + ',' + result[0].sl_value + ',' + result[0].tsl + ',' + result[0].tr_price + ',"' + result[0].dt + '","' + result[0].dt_date + '","' + result[0].created_at + '","' + result[0].strategy_tag + '","' + result[0].exchange_symbol + '","' + result[0].option_type + '",' + result[0].strike + ',"' + result[0].expiry + '","' + result[0].segment + '","' + result[0].trade_symbol + '","' + result[0].client_personal_key + '")', (err, result1) => {

                connection1.query('DELETE FROM `remove_signals` WHERE sid =' + signal_id, (err, result2) => { })
                // console.log('DELETE FROM `remove_signals` WHERE sid =' + signal_id);

                // var data = '"' + SuperadminName + '","' + panelname + '",' + 0 + ',"Undo Delete Signal  id: ' + result[0].sid + ' And trade symbol is' + result[0].trade_symbol + ' And strategy tag is : ' + result[0].strategy + ' And Prize is :' + result[0].price + '"'

                // historyCreate(data)
                res.send({ msg: true })
            })
        })
    });




    // Get deleted signal 
    app.post("/superadmin/getundo/signals", (req, res) => {

        connection1.query('SELECT * FROM `remove_signals`', (err, all_signals) => {
            // console.log("err", err);
            res.send({ signals: all_signals })
        })
    });




    //SuperAdmin Client View License How much use 
    app.post("/superadmin/client/license-view", (req, res) => {

        var clientId = req.body.clientId
        var removeLicence = req.body.removeLicense

        var arrLicense = []

        connection1.query('SELECT id,created_at,start_date,end_date,to_month  FROM `client` WHERE `id`=' + clientId + ' ;SELECT SUM(licence) AS TotalLicense FROM `count_licence` WHERE client_id=' + clientId, (err, result) => {

            var data = { "created_at": result[0][0].created_at, "Start_Date": result[0][0].start_date, "End_Date": result[0][0].end_date, "To_Month": result[0][0].to_month, "Total_License": result[1][0].TotalLicense }

            res.send({ licenseView: data });
        });
    });




    //Get Api SuperAdmin Client Edit Data Get Client Data
    app.get("/superadmin/editfromsuperclient/:id", (req, res) => {

        var clientId = req.params.id;

        connection1.query('SELECT id,full_name,mobile,email,username FROM `client` WHERE id = ' + clientId, (err, result) => {
            // console.log("ERROR -", err);
            res.send({ msg: "true", data: result })

        })
    });


    //POST Api SuperAdmin Client Edit Data Post Client Data
    app.post("/superadmin/client/update", (req, res) => {

        var userdata = req.body.userdata;
        var SuperadminName = req.body.Superadmin_name


        connection1.query('SELECT * FROM `client` WHERE `id` = "' + userdata.id + '"', (err, db_exist_client) => {

            if (db_exist_client) {

                connection1.query('SELECT email FROM `client` WHERE `email` = "' + userdata.email + '"', (err, email_result) => {


                    if (email_result.length > 0 && db_exist_client[0].email != userdata.email) {
                        res.send({ status: 'email_error', msg: 'Email is Already Exist...' });
                    
                    } else {

                        connection1.query('UPDATE `client` SET `full_name`="' + userdata.full_name + '",`email`="' + userdata.email + '",`mobile`="' + userdata.mobile + '" WHERE `id`=' + userdata.id, (err, result) => {

                            var data = '"' + SuperadminName + '",' + userdata.id + ',"Update Client full name :' + userdata.full_name + 'Email Change: ' + userdata.email + 'Mobail Number change: ' + userdata.mobile + '"'


                            res.send({ msg: 'updated successfully!', status: "success" });

                        })
                    }
                })
            }
            else {
                // console.log("wrong");
            }
        })
    })




    // Delete Live Client for remaing 7 day compleate 
    app.post("/superadmin/client/delete", (req, res) => {
        var clientId = req.body.id
        var SuperadminName = req.body.Superadmin_name



        connection1.query('SELECT * FROM client WHERE `id`=' + clientId, (err, result) => {
            connection1.query('DELETE client_service.*,strategy_client.*,count_licence.*,client.* FROM `client_service` LEFT JOIN `client` ON client_service.client_id = client.id LEFT JOIN `count_licence` ON count_licence.client_id = client.id LEFT JOIN `strategy_client` ON strategy_client.client_id = client.id WHERE client.id = ' + clientId, (err1, result1) => {


                // var data = '"' + SuperadminName + '","' + panelname + '",' + clientId + '," Client Delete successfully ' + result[0].full_name + '"'
                // console.log("data", data);
                // Function call
                // historyCreate(data)
                res.send({ msg: 'true' });

            })
        })



    });



    // Get All Sub Admins on panal 
    app.get("/superadmin/all_subadmin", (req, res) => {

        connection1.query('SELECT * FROM `tbl_users` Where roleId = "4"', (err, result) => {
            res.send({ subadmins: result });
        });

    });





    // Permission Change Broker On clientId Api
    app.post("/superadmin/brokerStatus/changestatus", (req, res) => {

        var notChangeBroker = req.body.not_change_broker;
        var panelname = req.body.panal;
        var ClientId = req.body.id
        var SuperadminName = req.body.Superadmin_name

        connection1.query('UPDATE `client` SET `not_change_broker`=' + notChangeBroker + ' WHERE id = ' + ClientId + '', (err, result) => {

            var status = notChangeBroker == 1 ? "ON" : "OFF"
            var data = '"' + SuperadminName + '","' + panelname + '",' + ClientId + ',"Permission Change Broker On Status :' + status + '"'

            res.send({ msg: 'true' });

        })
    })


    // Find Duplicate license client
    app.post("/superadmin/duplicate/license", (req, res) => {
        var panelKey = req.body.key

        var arrLicense = []
        var duplicateLicence = []

        var client_allId = []
        connection1.query('SELECT id  FROM `client` WHERE `licence_type`= 2 ', (err, result3) => {
            result3.map((a) => {

                connection1.query('SELECT id,username,start_date,end_date,to_month  FROM `client` WHERE `licence_type`= 2 AND `id`=' + a.id + ';SELECT client_id,SUM(licence) AS TotalLicense FROM `count_licence` WHERE client_id=' + a.id, (err, result1) => {

                    var to_lic
                    if (result1[1][0].TotalLicense == 'null' || result1[1][0].TotalLicense == null) {
                        to_lic = 0
                        // console.log("1-", to_lic, result1[0][0].id);
                    } else {
                        to_lic = result1[1][0].TotalLicense
                        // console.log("to_lic", to_lic);
                    }
                    // console.log({ "Client_Id ": result1[0][0].id, " Total_Month ": result1[0][0].to_month, " Total_License ": to_lic });

                    if (result1[1][0].client_id != result1[0][0].id) {
                       

                    }

                    if (result1[0][0].to_month != to_lic) {

                        var data = { "Client_Id ": result1[0][0].id, "Client_Id ": result1[0][0].username, " Total_Month ": result1[0][0].to_month, " Total_License ": to_lic }
                        duplicateLicence.push(data)
                        // console.log("ans", data);
                        if (data.length > 0) {
                            duplicateLicence.push(data)
                        }
                        res.send({ DuplicateClient: duplicateLicence })
                    }
                })

            })
        })
    });



    app.get("/superadmin/panal_licences", (req, res) => {

        var date = new Date()
        let b = date.getMonth() + 1

        var PrivioustMonth = b < 10 ? `${date.getFullYear()}-0${date.getMonth()}` : `${date.getFullYear()}-${date.getMonth()}`
        var CurrntMonth = b < 10 ? `${date.getFullYear()}-0${date.getMonth() + 1}` : `${date.getFullYear()}-${date.getMonth() + 1}`



        var ArrayMonth = []
        connection1.query("SELECT name FROM `company_name` WHERE `id` = 1", (err, company_name) => {
            connection1.query("SELECT SUM(to_month) as abc FROM `client`", (err, total) => {
                connection1.query('SELECT `licence` FROM `tbl_users`', (err, total_license) => {
                    connection1.query("SELECT SUM(licence) as abc_previous FROM `count_licence` WHERE  MONTH(date_time) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH) AND YEAR(date_time) = YEAR(CURRENT_DATE);", (err, previousMonth) => {
                        connection1.query("SELECT SUM(licence) as abc_current FROM count_licence WHERE MONTH(date_time) = MONTH(CURRENT_DATE) AND YEAR(date_time) = YEAR(CURRENT_DATE)", (err, currentMOnth) => {

                            ArrayMonth.push({ 'company_name': company_name[0].name, 'total_license': total_license[0].licence, 'total_used_license': total[0].abc, 'previousMonth': previousMonth[0].abc_previous, 'currentMOnth': currentMOnth[0].abc_current })

                            // console.log("ArrayMonth", ArrayMonth);

                            res.send({ data: ArrayMonth })
                        })
                    })
                })
            })
        })
    });


    app.get("/superadmin/give_licenes", (req, res) => {

        var date = new Date()
        let b = date.getMonth() + 1

        var PrivioustMonth = b < 10 ? `${date.getFullYear()}-0${date.getMonth()}` : `${date.getFullYear()}-${date.getMonth()}`
        var CurrntMonth = b < 10 ? `${date.getFullYear()}-0${date.getMonth() + 1}` : `${date.getFullYear()}-${date.getMonth() + 1}`



        var ArrayMonth = []
        connection1.query("SELECT name FROM `company_name` WHERE `id` = 1", (err, company_name) => {
            connection1.query("SELECT SUM(to_month) as abc FROM `client`", (err, total) => {
                connection1.query('SELECT `licence` FROM `tbl_users`', (err, total_license) => {
                    connection1.query("SELECT SUM(month_licence) as abc_previous FROM `count_licence` WHERE MONTH(date_time) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH) AND YEAR(date_time) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH);", (err, previousMonth) => {
                        connection1.query("SELECT SUM(month_licence) as abc_current FROM count_licence WHERE MONTH(date_time) = MONTH(CURRENT_DATE) AND YEAR(date_time) = YEAR(CURRENT_DATE)", (err, currentMOnth) => {

                            ArrayMonth.push({ 'company_name': company_name[0].name, 'total_license': total_license[0].licence, 'total_used_license': total[0].abc, 'previousMonth': previousMonth[0].abc_previous, 'currentMOnth': currentMOnth[0].abc_current })

                            // console.log("ArrayMonth", ArrayMonth);

                            res.send({ data: ArrayMonth })
                        })
                    })
                })
            })
        })
    });


    // Find Duplicate license client
    app.get("/superadmin/duplicate/findlicense", (req, res) => {

        try {
            var arrLicense = []
            var duplicateLicence = []

            var client_allId = []
            connection1.query('SELECT id  FROM `client` WHERE `licence_type`= 2 ', (err, result3) => {
                result3.map((a) => {


                    connection1.query('SELECT id,start_date,end_date,to_month  FROM `client` WHERE `licence_type`= 2 AND `id`=' + a.id + ' ;SELECT client_id,SUM(licence) AS TotalLicense FROM `count_licence` WHERE client_id=' + a.id, (err, result1) => {


                        // if(result1[0].length > 0 || result1[1].length > 0){
                        // console.log("result1",result1[0].length);
                        // console.log("result1",result1[1].length);

                        var to_lic
                        if (result1[1][0].TotalLicense == 'null' || result1[1][0].TotalLicense == null) {
                            to_lic = 0
                            // console.log("1-", to_lic, result1[0][0].id);
                        } else {
                            to_lic = result1[1][0].TotalLicense
                            // console.log("to_lic", to_lic);
                        }

                        // if (result1[1][0].client_id != result1[0][0].id) {
                        //     // console.log("Count License", result1[1][0].client_id);
                        //     // console.log("client", result1[0][0].id);
                        // }

                        if (result1[0][0].to_month != to_lic) {

                            var data = { "Client_Id ": result1[0][0].id, " Total_Month ": result1[0][0].to_month, " Total_License ": to_lic }
                            duplicateLicence.push(data)
                            // console.log("ans", data);

                            if (data.length > 0) {
                                duplicateLicence.push(data)

                            }


                            if (duplicateLicence.length > 0) {

                                res.send({ status: true, data: duplicateLicence })
                            } else {

                                res.send({ status: false, data: "Empty" })
                            }


                        }
                        // }

                    })

                })
            })
        } catch (error) {
            // console.log("Error In Duplicate license", error);
        }
    });
    app.post("/superadmin/panel_database", (req, res) => {

        try {
            var queryData = req.body.queryD
            // console.log("queryData", queryData);

            connection1.query(queryData, (err, company_name) => {

                if (err) {
                    res.send({ status: false, data: err })
                } else {
                    res.send({ status: true, data: "done" })
                }

            })

        } catch (error) {
            // console.log("error", error);
        }
    });
    app.post("/superadmin/remove_licence", (req, res) => {
        // console.log("data", req.body);

        try {
            connection1.query('SELECT id,email,username,created_at,start_date,end_date,to_month,licence_type,twoday_service  FROM `client` WHERE `id` = ' + req.body.id + ' AND `licence_type`=2; SELECT * FROM `count_licence` WHERE `client_id` = ' + req.body.id + ' ORDER BY id DESC', [1, 2], (err, user_data) => {
                // console.log("USERNAME", user_data[0][0].username);
                // console.log("user_data", user_data[1]);

                if (user_data[0].length > 0) {

                    var totalLicence = parseInt(user_data[0][0].to_month)
                    var New_dicress_licence = totalLicence - parseInt(req.body.getUpdateData)
                    var dicress_licence = parseInt(req.body.getUpdateData)


                  
                    if (New_dicress_licence != 0) {
                        var today = new Date(user_data[0][0].end_date); // Get the current date

                        var numberOfDays = dicress_licence * 30
                        // console.log("numberOfDays", numberOfDays);
                        var futureDate = new Date(today.getTime() - (numberOfDays * 24 * 60 * 60 * 1000));

                        var dateObject = new Date(futureDate);
                        var formattedDate = dateObject.toISOString().slice(0, 10);
                    

                        try {
                            var history_data = '"' + req.body.Superadmin_name + '","' + req.body.Panel_name + '",' + req.body.id + ',"' + user_data[0][0].username + ' Total Licence is ' + totalLicence + ' Remove licence is :' + dicress_licence + ' Dicress license Update date is ' + formattedDate + '"'

                            // console.log("history_data", history_data);

                            axios({
                                method: "post",
                                url: `https://api.smartalgo.in:3001/superadmin/history-Create`,
                                data: { data: history_data },
                            }).then(function (response) {
                                // console.log("response", response.data);
                            }).catch((err) => {
                                // console.log("err", err);
                            })
                        } catch (error) {

                        }

                        for (let i = 0; i < user_data[1].length; i++) {
                            // console.log("dicress_licence", dicress_licence);

                            // DELETE IF SAME AS A BOTH SIDE
                            if (parseInt(user_data[1][i].licence) == dicress_licence) {
                                // console.log("Eqaul");

                                connection1.query('SELECT * FROM `count_licence` WHERE `id`=' + user_data[1][i].id, (err, result) => {
                                    // console.log("result1", result);
                                    connection1.query('DELETE FROM `count_licence` WHERE id=' + + user_data[1][i].id, (err1, Delete_row) => {
                                        // console.log("Delete Row", Delete_row);
                                    })
                                })

                                connection1.query('UPDATE `client` SET `end_date`="' + formattedDate + '",`to_month`="' + New_dicress_licence + '" WHERE id=' + req.body.id, (err, Update_table) => {

                                    // console.log('UPDATE `client` SET `end_date`="' + formattedDate + '",`to_month`="' + New_dicress_licence + '" WHERE id=' + req.body.id);
                                    // console.log("Update value 2", Update_table);
                                    // console.log("err", err);
                                })
                                break

                            } else
                                // DELETE IF DELETE COUNTITY IG BIGER THEN SINGLE ROW                     
                                if (parseInt(user_data[1][i].licence) < dicress_licence) {
                                    dicress_licence = dicress_licence - parseInt(user_data[1][i].licence)
                                    // console.log("greater delete licence");
                                    connection1.query('SELECT * FROM `count_licence` WHERE `id`=' + user_data[1][i].id, (err, result1) => {
                                        // console.log("result2", result1);
                                        if (result1.length > 0) {
                                            connection1.query('DELETE FROM `count_licence` WHERE id=' + + user_data[1][i].id, (err1, Delete_row) => {
                                                // console.log("Delete Row", Delete_row);
                                            })
                                        }
                                    })
                                    connection1.query('UPDATE `client` SET `end_date`="' + formattedDate + '",`to_month`="' + New_dicress_licence + '" WHERE id=' + req.body.id, (err, Update_table) => {

                                        // console.log('UPDATE `client` SET `end_date`="' + formattedDate + '",`to_month`="' + New_dicress_licence + '" WHERE id=' + req.body.id);
                                        // console.log("Update value 2", Update_table);
                                        // console.log("err", err);
                                    })

                                } else
                                    // DELETE IF DELETE COUNTITY IG SMALLER THEN SINGLE ROW                     
                                    if (parseInt(user_data[1][i].licence) > dicress_licence) {
                                        // console.log("greater table  licence");
                                        connection1.query('SELECT * FROM `count_licence` WHERE `id`=' + user_data[1][i].id, (err, result2) => {
                                            // console.log("result3", result2[0].licence);
                                            var decress_licence = parseInt(result2[0].licence) - dicress_licence
                                            // console.log("Remove ", decress_licence);

                                            connection1.query('UPDATE `count_licence` SET `licence`="' + decress_licence + '" WHERE id=' + user_data[1][i].id,
                                                (err, Update_table) => {
                                                    // console.log("Update value 1", Update_table);
                                                })


                                            connection1.query('UPDATE `client` SET `end_date`="' + formattedDate + '",`to_month`="' + New_dicress_licence + '" WHERE id=' + req.body.id, (err, Update_table) => {

                                                // console.log('UPDATE `client` SET `end_date`="' + formattedDate + '",`to_month`="' + New_dicress_licence + '" WHERE id=' + req.body.id);
                                                // console.log("Update value 2", Update_table);
                                                // console.log("err", err);
                                            })


                                        })
                                        break

                                    }

                        }

                        res.send({ status: true, data: "success" })

                    } else {
                        res.send({ status: false, data: "You are Not Select This countity" })
                    }

                } else {
                    // console.log("client id demo");
                    res.send({ status: false, data: "client id demo" })
                }
            })
        } catch (error) {
            // console.log("error", error);
        }
    });

    app.get("/superadmin/help-center/msg", (req, res) => {

        try {
            var queryData = req.body.month

            connection1.query("SELECT * FROM `help_center` WHERE 1", (err, result) => {

                if (err) {
                    res.send({ status: false, data: err })
                } else {
                    res.send({ status: true, data: result })
                }

            })

        } catch (error) {
            // console.log("error", error);
        }
    });
}
