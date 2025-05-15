module.exports = function (app, connection1) {

    var { CommonEmail } = require(`../Common/SendEmails/CommonEmail.js`);
    var nodemailer = require('nodemailer');


    app.post("/smartalgo/theme_add", (req, res) => {
        try {
            var panel_name = req.body.panel_name;
            var body_font = req.body.typography;
            var layout = req.body.layout;
            var primary_col = req.body.primary;
            var header_col = req.body.headerBg;
            var nav_head_col = req.body.navheaderBg;
            var sidebar_col = req.body.sidebarBg;
            var sidebar = req.body.sidebarStyle;
            var sidebar_position = req.body.sidebarPosition;
            var header_position = req.body.headerPosition;
            var container = req.body.containerLayout;
            var image = req.body.image;
            var version = req.body.version;

            connection1.query('INSERT INTO `new_theme_status`( `panel_name`, `theme_version`, `primary_col`, `nav_head_col`, `header_col`, `sidebar_col`, `layout`, `sidebar`, `header_position`, `sidebar_position`, `container`, `body_font`, `image` ) VALUES ("' + panel_name + '","' + version + '","' + primary_col + '","' + nav_head_col + '","' + header_col + '","' + sidebar_col + '","' + layout + '","' + sidebar + '","' + header_position + '","' + sidebar_position + '","' + container + '","' + body_font + '","' + image + '")', (err, result) => {

                if (err) {
                    // console.log("err", err);
                    res.send({ status: false, data: "faild" })

                } else {
                    // console.log("result", result);
                    res.send({ status: true, data: "done" })
                }

            })
        } catch (error) {

            res.send({ status: false, data: "faild" })
        }


    });


    app.post("/smartalgo/get/theme", (req, res) => {

        try {


            var panel_name = req.body.panel_name;


            connection1.query('SELECT * FROM `new_theme_status` WHERE panel_name="' + panel_name + '"', (err, result) => {

                if (result.length > 0) {

                    // console.log("result", result);
                    res.send({ status: true, data: result })
                } else {
                    // console.log("err", err);
                    res.send({ status: false, data: "faild" })
                }

            })
        } catch (error) {

            res.send({ status: false, data: "faild" })
        }


    });

    app.post("/smartalgo/update/theme", (req, res) => {

        try {


            var panel_name = req.body.panel_name;
            var body_font = req.body.typography;
            var layout = req.body.layout;
            var primary_col = req.body.primary;
            var header_col = req.body.headerBg;
            var nav_head_col = req.body.navheaderBg;
            var sidebar_col = req.body.sidebarBg;
            var sidebar = req.body.sidebarStyle;
            var sidebar_position = req.body.sidebarPosition;
            var header_position = req.body.headerPosition;
            var container = req.body.containerLayout;
            var image = req.body.image;
            var version = req.body.version;

            // console.log('UPDATE `new_theme_status` SET `panel_name`="'+panel_name+'",`theme_version`="'+version+'",`primary_col`="'+primary_col+'",`nav_head_col`="'+nav_head_col+'",`header_col`="'+header_col+'",`sidebar_col`="'+sidebar_col+'",`layout`="'+layout+'",`sidebar`="'+sidebar+'",`header_position`="'+header_position+'",`sidebar_position`="'+sidebar_position+'",`container`="'+container+'",`body_font`="'+body_font+'",`image`="'+image+'" WHERE panel_name="' + panel_name + '"');

            connection1.query('UPDATE `new_theme_status` SET `panel_name`="' + panel_name + '",`theme_version`="' + version + '",`primary_col`="' + primary_col + '",`nav_head_col`="' + nav_head_col + '",`header_col`="' + header_col + '",`sidebar_col`="' + sidebar_col + '",`layout`="' + layout + '",`sidebar`="' + sidebar + '",`header_position`="' + header_position + '",`sidebar_position`="' + sidebar_position + '",`container`="' + container + '",`body_font`="' + body_font + '",`image`="' + image + '" WHERE panel_name="' + panel_name + '"', (err, result) => {

                if (err) {
                    // console.log("err", err);
                    res.send({ status: false, data: "faild" })

                } else {
                    // console.log("result", result);
                    res.send({ status: true, data: "done" })
                }

            })
        } catch (error) {

            res.send({ status: false, data: "faild" })
        }


    });


    app.post("/smartalgo/getthemeById", (req, res) => {

        try {


            var id = req.body.id;


            connection1.query('SELECT * FROM `new_theme_status` WHERE id="' + id + '"', (err, result) => {
                if (result.length > 0) {
                    // console.log("result", result);
                    res.send({ status: true, data: result })
                } else {
                    // console.log("err", err);
                    res.send({ status: false, data: "failed" })
                }

            })
        } catch (error) {

            res.send({ status: false, data: "failed" })
        }


    });




    app.post("/smartalgo/third_party/email", (req, res) => {

        try {

            // console.log("Data",req.body);


            const transport = nodemailer.createTransport({
                type: "smtp",
                host: req.body.host,
                port: req.body.port,
                // ignoreTLS: false,
                secure: true,
                // secure: false,
                // requireTLS: true,
                auth: {
                    user: req.body.user,
                    pass: req.body.pass
                },
                secureConnection: true

            });
            var mailOptions = {
                from: req.body.from,
                to: req.body.to,
                subject: req.body.subject,
                cc: req.body.cc,
                bcc: req.body.bcc,
                text: req.body.text,
                html: req.body.html,
            };


           // console.log("CheckEail")
            transport.verify(function (error, success) {
                if (error) {
                    // console.log(error);
                } else {
                    //console.log("Server is ready to take our messages");
                }
            });
            transport.sendMail(mailOptions, function (err, info) {
                if (err) {
                    // console.log(err);
                    return res.send({ status: 'Failed!!!' })
                } else {
                    // console.log("Email has been sent", info.response);
                    return res.send({ status: 'success', msg: "Mail send successfully" })
                }
            });



        } catch (error) {

            res.send({ status: false, data: "faild" })
        }


    });


}