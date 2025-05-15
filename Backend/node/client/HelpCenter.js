module.exports = function (app, connection1) {
    var { CommonEmail } = require(`../Common/SendEmails/CommonEmail.js`);
    var verifyToken = require('./middleware/awtJwt');

    var nodemailer = require('nodemailer');

    var dateTime = require('node-datetime');

    app.post("/client/helpcenter", verifyToken, (req, res) => {
        var dt = dateTime.create();
        var ccdate = dt.format('Y-m-d H:M:S');
        var userData = req.body.userData
        var message = req.body.message

        // console.log("body", req.body)


        connection1.query('SELECT * from `tbl_users` WHERE `userId`="' + userData.admin_id + '"', (err, result) => {
            // console.log("mesg",result[0].email)
            var Admin_Email = result[0].email

            // const toEmail = Admin_Email;
            // const subjectEmail = "Client Help";
            // const htmlEmail = '';
            // const textEmail = message;


            // CommonEmail(toEmail, subjectEmail, htmlEmail, textEmail)

            // console.log("HelpCenter", Admin_Email,result)


            var id = 1;
            connection1.query('SELECT * FROM `email_config` WHERE `id`=' + id, (err, result) => {

                var companyDetails = result[0]



                const transport = nodemailer.createTransport({
                    type: "smtp",
                    host: companyDetails.smtphost,
                    port: companyDetails.smtpport,
                    // ignoreTLS: false,
                    // secure: false,
                    // secure: false,
                    // requireTLS: true,
                    auth: {
                        user: companyDetails.email,
                        pass: companyDetails.smtp_password
                    }
                });
                var mailOptions = {
                    from: companyDetails.email,
                    to: companyDetails.email,
                    subject: "Client Help ",
                    text: "Username : " + userData.username + ", Email : " + userData.email + ",  Mobile : " + userData.mobile + "\n Message : " + message + ""

                };
                transport.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        // console.log(err);
                        res.send({ status: 'Failed!!!' })
                    } else {
                        // console.log("Email has been sent", info.response);

                        connection1.query('INSERT INTO `help_center`  (`client_id`,`admin_id`,`help_message`,`client_mobile`,`email`,`client_username`,`created_at`) VALUES ("' + userData.id + '","' + userData.admin_id + '","' + message + '","' + userData.mobile + '","' + userData.email + '","' + userData.username + '","' + ccdate + '")', (err, result) => {
                            

                            res.send({ status: 'success', msg: "Mail send successfully" })

                            // SNEH
                            // if(result == ''){
                            //     res.send({ status: 'faild', msg: "Error" })
                            // }else{
                            //     res.send({ status: 'success', msg: "Mail send successfully" })
                            // }


                        });

                    }
                });

            })
            // res.send({help_message:result}); 
        })






    });

    app.post("/client/notifications", (req, res) => {
        const AdminId = req.body.admin_id
        connection1.query('SELECT * from `help_center` WHERE `admin_id`="' + AdminId + '"', (err, result) => {
            // console.log("err", err);
            res.send({ 'notifications': result })
        })
    })

    app.post("/client/delete-notification", (req, res) => {
        const Id = req.body.id
        connection1.query('Delete from `help_center` WHERE `id`="' + Id + '"', (err, result) => {
            // console.log("err", err);
            res.send({ 'notifications': [] })
        })
    })

    app.post("/client/strategy_devlopment", (req, res) => {
        try {
            if (req.body.developmentDescription == "") {
                res.send({ status: false, data: "Missing strategy Name" })
            } else {

                connection1.query('INSERT INTO `strategy_devlopment`(client_id, `client_name`,`your_strategy`, `strategy_img`,`strategy_pdf`) VALUES ("' + req.body.client_id + '","' + req.body.client_name + '","' + req.body.developmentDescription + '","' + req.body.strategy_image64 + '","' + req.body.strategy_pdf + '")', (err, result) => {
                    if (err) {
                        res.send({ status: false, data: "Some think wrong" })
                    } else {
                        res.send({ status: true, data: "Successfully add" })

                    }
                })
            }


        } catch (error) {

        }

    })

    app.get("/client/get/strategy_development", verifyToken, (req, res) => {
        var client_id = req.body.client_id;
        // console.log('SELECT * FROM `strategy_devlopment` WHERE client_id="' + client_id + '"');
        connection1.query('SELECT * FROM `strategy_devlopment`', (err, result1) => {
            // console.log("result1result1", result1);
            res.send({ strategy_development: result1, status: true });
        });

        // SELECT * FROM `strategy_devlopment` WHERE `client_id` LIKE '623'
    });

}

// app.post("/client/get/strategy_development", verifyToken, (req, res) => {
//     var client_id = req.body.client_id;
//     // console.log('SELECT * FROM `strategy_devlopment` WHERE client_id="' + client_id + '"');
//     connection1.query('SELECT * FROM `strategy_devlopment` WHERE client_id="' + client_id + '"', (err, result1) => {
//         console.log("result1result1", result1);
//         res.send({ strategy_development: result1, status: true });
//     });

//     // SELECT * FROM `strategy_devlopment` WHERE `client_id` LIKE '623'
// });
