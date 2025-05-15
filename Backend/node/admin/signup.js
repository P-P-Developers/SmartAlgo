module.exports = function (app, connection1) {
    var verifyToken = require('./middleware/awtJwt');
    const bcrypt = require("bcrypt");

    var dateTime = require('node-datetime');
    var dt = dateTime.create();



    app.post("/admin/verify-client", async (req, res) => {

        try {
            var dateTime = require('node-datetime');
            var dt = dateTime.create();
            var ccdate = dt.format('Y-m-d H:M:S');
            var ccd = dt.format('ymd');

            // console.log("REq", req.body);
            // RANDOME PASSWORD
            const min = 1;
            const max = 1000000;
            const rand = min + Math.random() * (max - min);
            var rand_password = Math.round(rand)

            // console.log("rand_password", rand_password);

            const axios = require('axios');

            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `http://sms.pnpuniverse.com/api/v4/?api_key=A43140157104eed42587ed153baad6592&method=sms&message=One%20Time%20Password%20is%20${rand_password}%20This%20is%20usable%20once%20and%20expire%20in%2010%20minutes.%20Please%20do%20not%20share%20this%20with%20anyone.%20Infotech&to=${req.body.mobileNumber}&sender=OTPPNP`,
                headers: {
                    'Cookie': 'AWSALB=z7JbEr8ZurAqu4hG3wVUsz55aJk+4TS3O7Q05tYau2IkJTw2pF5XSV0iUEfcU4JQp/BmUcolnZGH2pKA8PD2INdmiazE9kSQ/JAWnGJIEJeODMhM/82aenTGkLsN; AWSALBCORS=z7JbEr8ZurAqu4hG3wVUsz55aJk+4TS3O7Q05tYau2IkJTw2pF5XSV0iUEfcU4JQp/BmUcolnZGH2pKA8PD2INdmiazE9kSQ/JAWnGJIEJeODMhM/82aenTGkLsN'
                }
            };

            axios.request(config)
                .then((response) => {

                    if (response.data.status == "OK") {
                        // console.log("RUN PROPER");
                    }


                    res.send({ data: response.data, otp: rand_password, mobileNumber: req.body.mobileNumber })
                })
                .catch((error) => {
                    // console.log(error);
                });

        } catch (error) {
            // console.log("error In sms send", error);
        }

    });

    app.post("/admin/client/add_signup", async (req, res) => {
        try {

            var dateTime = require('node-datetime');
            var dt = dateTime.create();
            var ccdate = dt.format('Y-m-d H:M:S');
            var ccd = dt.format('ymd');

            // console.log("REq", req.body);

            if (!req.body.userName || !req.body.mobileNumber || !req.body.email || !req.body.fullName) {

                return res.send({ status: false, msg: 'Please Fill All Input fields' });
            }


            connection1.query('SELECT * FROM `signup_clients` WHERE `userName` = "' + req.body.userName + '"', (err, username_result) => {
                connection1.query('SELECT * FROM `signup_clients` WHERE `email` = "' + req.body.email + '"', (err, email_result) => {

                    if (username_result.length > 0) {

                        res.send({ status: 'username_error', msg: 'Username is Already Exist...' })

                    } else if (email_result.length > 0) {

                        res.send({ status: 'email_error', msg: 'Email is Already Exist...' });

                    } else {


                        try {


                           
                            connection1.query('INSERT INTO `signup_clients`( `email`, `fullName`, `mobileNumber`, `userName`) VALUES ("' + req.body.email + '","' + req.body.fullName + '","' + req.body.mobileNumber + '","' + req.body.userName + '")', (err11, result) => {
                                // console.log("result", result);
                                res.send({ status: true, msg: 'add successfully' });


                            })



                        } catch (error) {

                        }


                    }

                });
            });
        } catch (error) {
            // console.log("error", error);
        }


    });

    app.get("/admin/get/signup_user", async (req, res) => {

        try {
            connection1.query('SELECT * FROM `signup_clients` WHERE status = "0" ', (err, result) => {
                if (result.length > 0) {


                    res.send({ status: true, data: result })

                } else {
                    res.send({ status: false, data: [] })

                }
            })
        } catch (error) {

        }

    })


    app.post("/admin/client/signup", async (req, res) => {

        try {
            var { CommonEmail } = require(`../Common/SendEmails/CommonEmail.js`);


            var dateTime = require('node-datetime');
            var dt = dateTime.create();
            var ccdate = dt.format('Y-m-d H:M:S');
            var ccd = dt.format('ymd');

            connection1.query('SELECT * FROM `client_key_prefix_letters` WHERE `id` = "1"', async (err, prefix_result) => {
                var prefix_key = prefix_result[0].prefix;
                var domain_url_https = prefix_result[0].domain_url_https;

                // RANDOME PASSWORD
                const min = 1;
                const max = 1000000;
                const rand = min + Math.random() * (max - min);
                var rand_password = Math.round(rand)


                var client_key = prefix_key + rand_password + ccd

                // GENRATE BCRYPT PASSWORD
                var ByCryptrand_password = await bcrypt.hash(rand_password.toString(), 10);

                let { start_date, end_date } = threeDayDate()

                var broker = 0;
                var to_month = 0;
                var licence_type = 1;
                var status = 1;
                var status_term = 1;


                if (!req.body.userName || !req.body.email || !req.body.email || !req.body.fullName) {

                    return res.send({ status: false, msg: 'Please Fill All Input fields' });
                }


                connection1.query('SELECT * FROM `client` WHERE `username` = "' + req.body.userName + '"', (err, username_result) => {
                    connection1.query('SELECT * FROM `client` WHERE `email` = "' + req.body.email + '"', (err, email_result) => {
                        connection1.query('SELECT * FROM `admin_set_signup` WHERE 1', (err, admin_permission) => {
                            // console.log("admin_permission", admin_permission);

                            var GroupServiceId;
                            if (admin_permission[0].group_service != 'undefined') {
                                GroupServiceId = admin_permission[0].group_service
                            } else {
                                GroupServiceId = 1
                            }
                            // console.log("GroupServiceId", GroupServiceId);
                            var StrategtNAme;
                            if (admin_permission[0].strategy != 'undefined') {
                                StrategtNAme = admin_permission[0].strategy
                            } else {
                                StrategtNAme = 'TEST'
                            }
                            if (username_result.length > 0) {

                                res.send({ status: false, msg: 'Username is Already Exist...' })

                            } else if (email_result.length > 0) {

                                res.send({ status: false, msg: 'Email is Already Exist...' });

                            } else {


                                try {
                                    connection1.query('INSERT INTO `client`  (`full_name`,`email`,`mobile`,`password`,`new_password`,`username`,`created_at`,`start_date`,`end_date`,`broker`,`to_month`,`licence_type`,`status`,`status_term`,`client_key`,`sign_up`) VALUES ("' + req.body.fullName + '","' + req.body.email + '","' + req.body.mobileNumber + '","' + rand_password + '","' + ByCryptrand_password + '","' + req.body.userName + '","' + ccdate + '","' + start_date + '","' + end_date + '","' + broker + '","' + to_month + '","' + licence_type + '","' + status + '","' + status_term + '","' + client_key + '","1")', (err11, result) => {

                                        var client_id = result.insertId;
                                        // console.log("client_id:", client_id);

                                        connection1.query('SELECT * FROM `company_name` WHERE id = "1"', (err, result1) => {
                                            // console.log("result1", result1);

                                            // INSERT STRATEGY TABLE STG
                                            connection1.query('SELECT id  FROM `strategy` WHERE `name` LIKE "' + StrategtNAme + '"', (err, result11) => {
                                                if (result11.length > 0) {
                                                    connection1.query('INSERT INTO `strategy_client`  (`client_id`,`strategy`,`strategy_id`,`created_at`) VALUES ("' + client_id + '","' + StrategtNAme + '","' + result11[0].id + '","' + ccdate + '")', (err, result) => { });
                                                }


                                            })




                                            var brokerData = "";
                                            if (prefix_key == 'AAM') {
                                                // console.log("Adonomist");
                                                const term1 = "<p>***************HOW TO WORK WITH SOFTWARE **************************</p><p>1) You have ID and passwordwith link software.adonomist.com</p><p>2) open link reset password accept term and condition, then put last 4 digit mobile number and your software is ready to use it can be work manual sinal and automation</p><p>Manual means you have some option like signal ( you can see signal and use in your D-Mat Manually but same signal not Others)</p><p>you have some more option -</p><p>DASHBOARD - you can update strategy , quantity , Report , Counter selection.</p><p>SIGNALS - you can check signal going in penal</p><p>SIGNALS - you can check signal going in penal</p><p>STRATEGY - one time one strategy used only not for multiple use</p><p>SERVICES - you get all information here to occupied</p><p>REPORTS - reports get all on off detail software signal report and other report on regular basis</p><p>TRADE HISTORY - it always shows your daily performance sheet but it can be differ from actual returns because (sleepage difference, lot quantity, and other)</p><p>TRADING STATUS - this help to show your daily on and off detail you on timing and your off timing </p><p>MESSAGE BROADCAST - this help your existing and exit mechanism you exit and maintain your limit</p><p>HELP CENTER - we are always with you to help we have our support number in web page to help you</p><p>BROKER RESPONCE - this is very important feature in software you can check your connectivity and always tested here like order is going to hit or not</p><p>your order rejected reasons and your all quaries regarding to techniqual issues.</p></hr><p>Disclaimer</p><p>All subscription fees paid to Adonomist Algo Software is Non refundable. We do not provide trading tips not we are investment adviser.</p><p>Our service is solely restricted to automated trading application development, deployment and maintenance. All algorithms are based </p><p> <a href='https://adonomist.com/disclaimer'target='_blank'>https://adonomist.com/disclaimer</a></p></hr></hr><br><br><p>Thnaks for your support</p><p>Adonomist algo software</p>"

                                                const toEmail = req.body.email;
                                                const subjectEmail = "User ID and Password";
                                                const htmlEmail = "<p>Dear '" + req.body.fullName + "'</p><p>Thank you for choosing " + result1[0].name + " for Algo Platform. We are pleased to inform that the password of your <br> Algo Platform has been resetted as per details mentioned below:</p><p>Login Details:</p><p>User Name / User ID : <b>'" + req.body.userName + "'</b><br>Login Password : <b>'" + rand_password + "'</b></p><p>Note : Please Change Your Login Password as per your choice.</p><p>Login Url : <a href='" + domain_url_https + "' target='_blank'>" + domain_url_https + "</a></p><br>" + brokerData + "<p> *******************PLEASE READ IT BEFOR USING THIS SOFTWARE********************* </p><p>1) pls login ur adonomist panel software.nomistcom</p><p> 2) Do login with api button on and put there (broking ID) like angel client id and pass after putting angel id pass it will beredirect in same page and button will be on</p><p> 3) Pls do daily same process and do live trading button on between 9 to 9:15 left it till 3:30</p><p> 4) This is to inform you that monitoring of software is your responsibility you can on and Off your software any timeduring market hours,Loss and profit is subject to market risk we are not resposible for any kindly of loss and profitwe are pure softwareseller only, customer can optimize and use sofware according to teir customization like quantity ( according toyour customization ) live(on with API and Off with API) customer hand , and Strategy decision ( Customer Hand ) Operation of allsoftware ( Customer Hand )</p><p> 5)We are pure software seller if you are doing trading manual then you are resposible by your selfkindly to do trade with out software if anyone are doing this accuring software only do not work on calls. After getting User Id and password it will be assumethat you has beenaccepted all term and condition and also accepted that you read all, we are also sending a copy to your mail id that is final, you have anoption to discontinue your softer before accepting this User ID and Password but in case you accpetd thisand regisetered once then noamount refunded we are responsible to solve your quaries (techniqual issue) but not refunded.</p><p> 6) all rights are reserve by adonomistalgo soft company always.</p>" + term1;
                                                CommonEmail(toEmail, subjectEmail, htmlEmail);

                                            } else {
                                                // console.log("Smartalgo");
                                                const toEmail = req.body.email;
                                                const subjectEmail = "User ID and Password";
                                                const htmlEmail = "<p>Dear '" + req.body.fullName + "'</p><p>Thank you for choosing " + result1[0].name + " for Algo Platform. We are pleased to inform that the password of your <br> Algo Platform has been resetted as per details mentioned below:</p><p>Login Details:</p><p>User Name / User ID : <b>'" + req.body.userName + "'</b><br>Login Password : <b>'" + rand_password + "'</b></p><p>Note : Please Change Your Login Password as per your choice.</p><p>Login Url : <a href='" + domain_url_https + "' target='_blank'>" + domain_url_https + "</a></p><br>" + brokerData;
                                                CommonEmail(toEmail, subjectEmail, htmlEmail);

                                            }



                                            //  INSERT INTO CLIENT GROUP SERVICESadmin_permissionclient_gro
                                            connection1.query('INSERT INTO `client_group_service`  (`client_id`,`group_id`) VALUES ("' + client_id + '","' + GroupServiceId + '")', (err, result) => {


                                                connection1.query('SELECT * FROM `service_and_group_id` WHERE `service_group_id` =' + GroupServiceId, (err, group_service_id) => {


                                                    group_service_id.forEach((item) => {
                                                        //INSERT CLIENT SERVICES 
                                                        connection1.query('INSERT INTO `client_service`  (`service_id`,`client_id`,`service_group_id`,`created_at`,`strategy`) VALUES ("' + item.service_id + '",' + client_id + ',"' + GroupServiceId + '","' + ccdate + '","' + StrategtNAme + '")', (err, result1) => {
                                                            // console.log(err);

                                                        });
                                                    })



                                                });



                                            })



                                            connection1.query('UPDATE `signup_clients` SET `status`="1" WHERE `email`="' + req.body.email + '"', (err, result1) => {
                                                // console.log(err);

                                            });










                                            return res.send({ status: true, msg: 'Successfully signup' });

                                        })

                                    })
                                } catch (error) {

                                }


                            }
                        })
                    });
                });
            })
        } catch (error) {

        }



    });


    app.post("/admin/set/signup", async (req, res) => {
        try {
            if (req.body.strategy) {

                connection1.query('UPDATE `admin_set_signup` SET `strategy`="' + req.body.strategy + '" WHERE 1', (err, result) => {

                })
            }
            if (req.body.group_service) {
                connection1.query('UPDATE `admin_set_signup` SET `group_service`="' + req.body.group_service + '" WHERE 1', (err, result) => {

                })
            }
            return res.send({ status: true, data: "successfull update" })

        } catch (error) {

        }

    })


    app.get("/admin/get/signup", async (req, res) => {

      try {
        connection1.query('SELECT * FROM `admin_set_signup` JOIN `service_group_name` ON admin_set_signup.group_service = service_group_name.id', (err, result) => {
            if (result.length > 0) {

                connection1.query('SELECT `service_and_group_id`.*,`services`.service AS text FROM `service_and_group_id` JOIN `services` ON `service_and_group_id`.`service_id`=`services`.`id` WHERE `service_group_id` = ' + result[0].group_service, (err, result1) => {


                    res.send({ status: true, data: result, result1: result1 })
                })
            } else {
                res.send({ status: false, data: [] })

            }
        })

      } catch (error) {
        
      }
    })

    app.get("/admin/get/signupClients", async (req, res) => {

    try {
        connection1.query('SELECT id,full_name,email,mobile,username,created_at,start_date,end_date,updated_at,status,status_term,broker,api_key,api_secret,client_code,to_month,trading_type,licence_type,api_type,logouttime,app_id,is_term,admin_id,subadmin_id,web_url,isDeleted,client_key,expiry_status,login_status,subadmin_client_status,twoday_service,duration FROM `client` WHERE `sign_up`=1 ORDER BY `id` DESC', (err, result) => {
            if (result.length > 0) {

                res.send({ status: true, data: result, })

                // } else {
                //     res.send({ status: false, data: "No Data available" })

            }
        })

    } catch (error) {
        
    }
    })


    function threeDayDate() {
        var currentDate = new Date();
        var start_date_2days = dateTime.create(currentDate);
        var start_date_2days = start_date_2days.format('Y-m-d');
        var start_date = start_date_2days;
        // console.log("start_date", start_date);

        var StartDate = new Date(start_date)
        var UpdateDate = ""
        var GetDay = StartDate.getDay()
        if (GetDay == 4) {
            UpdateDate = StartDate.setDate(StartDate.getDate() + 4);
        } else if (GetDay == 5) {
            UpdateDate = StartDate.setDate(StartDate.getDate() + 4);
        } else if (GetDay == 6) {
            UpdateDate = StartDate.setDate(StartDate.getDate() + 3);
        } else if (GetDay == 0) {
            UpdateDate = StartDate.setDate(StartDate.getDate() + 3);
        } else if (GetDay > 0 && GetDay < 4) {
            UpdateDate = StartDate.setDate(StartDate.getDate() + 2);
        }

        var end_date_2days = dateTime.create(UpdateDate);
        var end_date_2days = end_date_2days.format('Y-m-d');

        var end_date = end_date_2days;
        // console.log("end_date", end_date);

        return { start_date, end_date }
    }




}


