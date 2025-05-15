module.exports = function (app, connection1) {

    var verifyToken = require('./middleware/awtJwt');

    var fs = require('fs-extra')

    var d = new Date,
        dformat = [d.getFullYear(),
        d.getMonth() + 1,
        d.getDate(),
        ].join('/') + ' ' + [d.getHours(),
        d.getMinutes(),
        d.getSeconds()
        ].join(':');



    app.get("/admin/transaction_all_licence", verifyToken, (req, res) => {


        connection1.query('SELECT `licence`, `this_month_licence`, `modifydate_licence` FROM `tbl_users`', (err, result) => {
            res.send({ data: result });
        });
    });


    app.get("/admin/count_licence", verifyToken, (req, res) => {


        connection1.query('SELECT `count_licence`.*, `client`.`full_name` as `client_name`, `client`.`username` as `client_username` FROM `count_licence` LEFT JOIN `client` ON `count_licence`.`client_id`=`client`.`id` ORDER BY `count_licence`.`date_time` DESC', (err, result) => {
            res.send({ data: result });
        });
    });


    app.get("/admin/expired_client", verifyToken,(req, res) => {

        const date = new Date();

        // This arrangement can be altered based on how we want the date's format to appear.
        let currentDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        // console.log(currentDate);

        const next3days = new Date();
        next3days.setDate(date.getDate() + 3);

        let Next3DayDate = `${next3days.getFullYear()}-${next3days.getMonth() + 1}-${next3days.getDate()}`;
        // console.log(Next3DayDate);


        connection1.query('SELECT id,full_name,username,created_at,start_date,end_date,to_month,licence_type FROM `client` WHERE end_date between "' + currentDate + '" and "' + Next3DayDate + '" AND licence_type =2', (err, result) => {

            // console.log("result",result);
            res.send({ data: result });
        });
    });


}